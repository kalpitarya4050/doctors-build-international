/* ============================================================
   WebGL renderer for the hero globe.

   No three.js. An orthographic sphere does not need a mesh, a
   camera or a scene graph — it is a closed-form problem. Draw one
   full-screen triangle pair and, for each fragment:

     d  = |p|                     distance from the sphere centre
     z  = sqrt(1 - d.d)           the near surface, analytically
     n  = R^T . (p.x, p.y, z)     surface normal, back in Earth space
     uv = (atan2(n.x,n.z), asin(n.y))   equirectangular lookup

   That is a perfect, infinitely-tessellated sphere at the cost of
   one quad, and it ships nothing: three.js plus a sphere mesh and
   a texture loader is ~150KB gzipped before a single line of our
   own code. This file is under 10KB.

   The colour is painted from a one-channel land mask
   (public/brand/globe-land.png, baked by scripts/build-globe-texture.mjs)
   rather than a photographic Earth, so the palette is ours: navy
   ocean, lit continents, gold coastline and rim.
   ============================================================ */

export interface GlobeColors {
  /** Ocean at the sub-solar point, and in shadow. */
  oceanLit: string;
  oceanDark: string;
  /** Lowland and highland land tint; fbm mixes between them. */
  landLow: string;
  landHigh: string;
  /** Coastline emission — the bright edge where land meets water. */
  coast: string;
  /** Fresnel rim on the limb, and the halo outside it. */
  rim: string;
  atmosphere: string;
}

export interface GlobeFrame {
  /** Rotation about the pole, radians. Positive spins east-to-west. */
  yaw: number;
  /** Tilt toward the viewer, radians. */
  pitch: number;
  /** Seconds since start, for the slow specular drift. */
  time: number;
}

const VERT = `
attribute vec2 aPos;
varying vec2 vPos;
uniform vec2 uScale;
void main() {
  vPos = aPos * uScale;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

/* Note on precision: `highp` is not guaranteed in fragment shaders on
   older mobile GPUs, so the qualifier is chosen at compile time. At
   mediump the atan/asin lookup jitters by well under a texel, which is
   invisible; the sphere's own geometry is what needs the range. */
const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec2 vPos;

uniform sampler2D uLand;
uniform mat3  uRot;
uniform float uPx;        // sphere radii per device pixel — the AA width
uniform float uTime;
uniform vec3  uOceanLit;
uniform vec3  uOceanDark;
uniform vec3  uLandLow;
uniform vec3  uLandHigh;
uniform vec3  uCoast;
uniform vec3  uRim;
uniform vec3  uAtm;
uniform vec3  uLight;

const float INV_TWO_PI = 0.15915494;
const float INV_PI     = 0.31830989;

/* --- value noise on the unit sphere -------------------------------
   Sampled in 3-space off the surface normal, so it is continuous
   everywhere including across the antimeridian and over the poles —
   which a noise field sampled in UV space is not. */
float hash31(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float vnoise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash31(i + vec3(0.0, 0.0, 0.0)), hash31(i + vec3(1.0, 0.0, 0.0)), f.x),
        mix(hash31(i + vec3(0.0, 1.0, 0.0)), hash31(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
    mix(mix(hash31(i + vec3(0.0, 0.0, 1.0)), hash31(i + vec3(1.0, 0.0, 1.0)), f.x),
        mix(hash31(i + vec3(0.0, 1.0, 1.0)), hash31(i + vec3(1.0, 1.0, 1.0)), f.x), f.y),
    f.z);
}

float fbm(vec3 p) {
  float s = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    s += a * vnoise(p);
    p *= 2.07;
    a *= 0.5;
  }
  return s;
}

/** Land coverage at an arbitrary point on the sphere. */
float landAt(vec3 n) {
  vec2 uv = vec2(atan(n.x, n.z) * INV_TWO_PI + 0.5,
                 0.5 - asin(clamp(n.y, -1.0, 1.0)) * INV_PI);
  return texture2D(uLand, uv).r;
}

void main() {
  float d2 = dot(vPos, vPos);
  float d  = sqrt(d2);

  /* ---- surface ---- */
  float z = sqrt(max(1.0 - d2, 0.0));
  vec3 nv = vec3(vPos.x, vPos.y, z);   // normal, view space
  vec3 n  = uRot * nv;                 // normal, Earth space

  float here = landAt(n);

  /* Coast proximity, sampled on a ring in the TANGENT PLANE rather
     than in UV. A ring in UV is an ellipse on the sphere that
     degenerates completely at the poles; a ring in the tangent plane
     is the same angular size everywhere. */
  vec3 t = normalize(cross(n, vec3(0.0, 1.0, 0.0)) + vec3(1e-4, 0.0, 0.0));
  vec3 b = cross(n, t);

  const float R1 = 0.012;   // ~0.7 degrees
  const float R2 = 0.042;   // ~2.4 degrees
  float near1 = 0.0;
  float near2 = 0.0;
  for (int i = 0; i < 6; i++) {
    float a = float(i) * 1.0471976;   // 60 degree steps
    vec3 dir = cos(a) * t + sin(a) * b;
    near1 += landAt(normalize(n + R1 * dir));
    near2 += landAt(normalize(n + R2 * dir));
  }
  near1 /= 6.0;
  near2 /= 6.0;

  float land = smoothstep(0.34, 0.66, here);

  /* Coastline emission, keyed off the INNER ring only.
     The outer ring reaches ~2.6 degrees, and lighting a band that wide
     on both sides of every shore buries the continents under a white
     rind — every coast merges into every other and Africa reads as
     cloud. The inner ring is roughly one degree, which at hero size is
     a few pixels: a rim on the land, not a weather system. */
  float edge = abs(here - near1);
  float coastal = smoothstep(0.22, 0.70, edge);

  /* ---- topography ----
     Frequency matters more than amplitude here. The first pass ran the
     base octave at 6x, which puts one light-dark cycle across roughly
     the width of Africa — and a continent with a single soft bright
     blob in the middle of it does not read as terrain, it reads as a
     cloud sitting on the ocean. Pushing the base up and cutting the
     contrast gives grain at the scale of mountain ranges instead. */
  float relief = fbm(n * 15.0);
  // A single octave, not fbm. fbm's third octave here lands at ~150
  // cycles across the sphere, which is under a pixel — so it cannot
  // resolve and shows up as crawling speckle instead of detail.
  float fine   = vnoise(n * 30.0);
  float height = clamp(relief * 0.74 + fine * 0.30 - 0.10, 0.0, 1.0);

  /* ---- lighting ---- */
  float lambert = dot(nv, normalize(uLight));
  // A wide, shallow terminator: this is a brand object, not a
  // planetarium. A true day/night line throws away half the
  // continents, and the half it throws away is the half China and
  // Kazakhstan sit on.
  float day = 0.52 + 0.48 * smoothstep(-0.75, 0.95, lambert);

  vec3 ocean = mix(uOceanDark, uOceanLit, day);
  // Sun glint, drifting slowly so the ocean is not a dead flat fill.
  float glint = pow(max(lambert, 0.0), 40.0)
              * (0.55 + 0.45 * sin(uTime * 0.21));
  ocean += uRim * glint * 0.22;
  // Continental shelf: the water shallows toward land. This is the one
  // place the outer ring earns its keep — a soft lift that gives every
  // coastline a base to sit on.
  ocean = mix(ocean, uOceanLit * 1.22, smoothstep(0.03, 0.55, near2) * (1.0 - land) * 0.30);

  /* The relief only ever gets the top two-thirds of the ramp. Letting
     it run the full distance between the two land tints makes every
     continent read as camouflage — the patches are the same size and
     contrast as the landmass itself, and being procedural they do not
     line up with anything real, so the eye files them as noise. Held
     to a band, the same field reads as ground that is not flat. */
  vec3 ground = mix(uLandLow, uLandHigh, 0.36 + 0.64 * smoothstep(0.26, 0.76, height));
  ground *= 0.70 + 0.44 * day;

  vec3 col = mix(ocean, ground, land);
  // Weighted toward the land side, so the rim reads as the edge of the
  // continent catching light rather than as surf.
  col += uCoast * coastal * (0.20 + 0.42 * day) * (0.34 + 0.66 * land);

  /* ---- limb ---- */
  // Fresnel: grazing angles pick up the atmosphere. z is the cosine of
  // the view angle, so 1-z is the Fresnel term for free. Kept tight —
  // a broad falloff turns the whole outer third of the sphere gold and
  // swallows the continents underneath it.
  float fres = pow(1.0 - z, 4.4);
  col = mix(col, uRim, clamp(fres * 0.52, 0.0, 0.66));

  float disc = 1.0 - smoothstep(1.0 - uPx, 1.0 + uPx, d);

  /* ---- atmosphere, outside the disc ---- */
  float halo = exp(-max(d - 1.0, 0.0) * 12.0);
  // Fades where the sphere is in shadow, so the glow reads as lit air
  // rather than an outline drawn around the shape.
  float haloLight = 0.40 + 0.60 * smoothstep(-0.9, 0.9, dot(normalize(vec3(vPos, 0.35)), normalize(uLight)));
  float haloA = halo * (1.0 - disc) * 0.36 * haloLight;

  vec3 outRgb = col * disc + uAtm * haloA;
  float outA  = disc + haloA;

  // Premultiplied: the context is created with premultipliedAlpha,
  // which is the default and the only mode that composites a soft
  // halo over the page without a dark fringe.
  gl_FragColor = vec4(outRgb, outA);
}
`;

function hexToVec3(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h,
    16,
  );
  // sRGB values are handed to the shader as-is. The whole palette is
  // authored by eye against the rendered result, so a linearisation
  // pass here would only mean re-picking every colour.
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) throw new Error("shader alloc failed");
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(`globe shader: ${log}`);
  }
  return sh;
}

export class GlobeRenderer {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private buffer: WebGLBuffer;
  private texture: WebGLTexture;
  private u: Record<string, WebGLUniformLocation | null> = {};
  private width = 0;
  private height = 0;
  private radius = 1;
  private colors: GlobeColors;
  private lost = false;

  constructor(canvas: HTMLCanvasElement, mask: TexImageSource, colors: GlobeColors) {
    const gl = (canvas.getContext("webgl", {
      alpha: true,
      antialias: false, // the shader antialiases the limb itself
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      powerPreference: "low-power",
    }) ?? canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;

    if (!gl) throw new Error("WebGL unavailable");
    this.gl = gl;
    this.colors = colors;

    const prog = gl.createProgram();
    if (!prog) throw new Error("program alloc failed");
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error(`globe link: ${gl.getProgramInfoLog(prog)}`);
    }
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    this.program = prog;
    gl.useProgram(prog);

    // Two triangles covering clip space.
    const buf = gl.createBuffer();
    if (!buf) throw new Error("buffer alloc failed");
    this.buffer = buf;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const tex = gl.createTexture();
    if (!tex) throw new Error("texture alloc failed");
    this.texture = tex;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, gl.LUMINANCE, gl.UNSIGNED_BYTE, mask);
    // REPEAT on S so the antimeridian seam closes; CLAMP on T so the
    // poles do not sample across to the far hemisphere.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // No mipmaps — see the note in build-globe-texture.mjs.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    for (const name of [
      "uScale",
      "uLand",
      "uRot",
      "uPx",
      "uTime",
      "uOceanLit",
      "uOceanDark",
      "uLandLow",
      "uLandHigh",
      "uCoast",
      "uRim",
      "uAtm",
      "uLight",
    ]) {
      this.u[name] = gl.getUniformLocation(prog, name);
    }

    gl.uniform1i(this.u.uLand, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
    gl.clearColor(0, 0, 0, 0);

    this.setColors(colors);

    canvas.addEventListener("webglcontextlost", this.onLost);
  }

  private onLost = (e: Event) => {
    e.preventDefault();
    this.lost = true;
  };

  setColors(colors: GlobeColors) {
    this.colors = colors;
    const gl = this.gl;
    gl.useProgram(this.program);
    gl.uniform3fv(this.u.uOceanLit, hexToVec3(colors.oceanLit));
    gl.uniform3fv(this.u.uOceanDark, hexToVec3(colors.oceanDark));
    gl.uniform3fv(this.u.uLandLow, hexToVec3(colors.landLow));
    gl.uniform3fv(this.u.uLandHigh, hexToVec3(colors.landHigh));
    gl.uniform3fv(this.u.uCoast, hexToVec3(colors.coast));
    gl.uniform3fv(this.u.uRim, hexToVec3(colors.rim));
    gl.uniform3fv(this.u.uAtm, hexToVec3(colors.atmosphere));
    // Light from the upper left, but mostly toward the viewer: a
    // steeper angle carves a dramatic crescent and takes the eastern
    // half of the map — where every destination is — into shadow.
    gl.uniform3fv(this.u.uLight, new Float32Array([-0.34, 0.3, 0.89]));
  }

  /** @param radius sphere radius in CSS pixels. */
  resize(cssWidth: number, cssHeight: number, radius: number, dpr: number) {
    const gl = this.gl;
    const w = Math.max(1, Math.floor(cssWidth * dpr));
    const h = Math.max(1, Math.floor(cssHeight * dpr));
    const canvas = gl.canvas as HTMLCanvasElement;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    this.width = cssWidth;
    this.height = cssHeight;
    this.radius = Math.max(1, radius);
    gl.viewport(0, 0, w, h);
    gl.useProgram(this.program);
    // Clip space [-1,1] maps to half the canvas, measured in sphere radii.
    gl.uniform2f(this.u.uScale, cssWidth / 2 / this.radius, cssHeight / 2 / this.radius);
    gl.uniform1f(this.u.uPx, 1 / (this.radius * dpr));
  }

  render({ yaw, pitch, time }: GlobeFrame) {
    if (this.lost || this.width === 0) return;
    const gl = this.gl;
    gl.useProgram(this.program);
    gl.uniformMatrix3fv(this.u.uRot, false, inverseRotation(yaw, pitch));
    gl.uniform1f(this.u.uTime, time);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  dispose() {
    const gl = this.gl;
    (gl.canvas as HTMLCanvasElement).removeEventListener("webglcontextlost", this.onLost);
    gl.deleteTexture(this.texture);
    gl.deleteBuffer(this.buffer);
    gl.deleteProgram(this.program);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  }

  static isSupported(): boolean {
    if (typeof document === "undefined") return false;
    try {
      const c = document.createElement("canvas");
      return Boolean(c.getContext("webgl") ?? c.getContext("experimental-webgl"));
    } catch {
      return false;
    }
  }
}

/* ============================================================
   Rotation, shared by the shader and by every overlay.

   Forward (Earth space → view space) is Rx(pitch) · Ry(yaw): spin
   first, then tilt. The shader needs the INVERSE, because it starts
   from a view-space normal and asks which point of the Earth is
   there. The overlays need the FORWARD, because they start from a
   lat/lng and ask where on screen it lands. Both are derived from
   the one pair of angles here, so the arcs and the flags can never
   drift off the sphere they are drawn on.
   ============================================================ */

/** Column-major mat3 for GLSL: transpose(Rx(pitch) · Ry(yaw)). */
function inverseRotation(yaw: number, pitch: number): Float32Array {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  // Rows of the transpose, written out column-major.
  return new Float32Array([
    cy, 0, sy,
    sp * sy, cp, -sp * cy,
    -cp * sy, sp, cp * cy,
  ]);
}

export interface Projected {
  /** Screen offset from the sphere centre, in CSS pixels. */
  x: number;
  y: number;
  /** Depth in sphere radii: positive is the near hemisphere. */
  z: number;
}

/** Forward-project a lat/lng onto the screen. `lift` > 1 floats the
 *  point above the surface, for labels that must clear the terrain. */
export function projectLatLng(
  lat: number,
  lng: number,
  yaw: number,
  pitch: number,
  radius: number,
  lift = 1,
): Projected {
  const la = (lat * Math.PI) / 180;
  const lo = (lng * Math.PI) / 180;
  const r = radius * lift;
  const x0 = r * Math.cos(la) * Math.sin(lo);
  const y0 = r * Math.sin(la);
  const z0 = r * Math.cos(la) * Math.cos(lo);

  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const x1 = x0 * cy + z0 * sy;
  const z1 = -x0 * sy + z0 * cy;

  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const y2 = y0 * cp - z1 * sp;
  const z2 = y0 * sp + z1 * cp;

  // Screen Y grows downward.
  return { x: x1, y: -y2, z: z2 / radius };
}

/** Great-circle interpolation between two lat/lng points, so an arc
 *  follows the path an aircraft actually flies. */
export function greatCircle(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number,
  steps: number,
): { lat: number; lng: number; t: number }[] {
  const toRad = Math.PI / 180;
  const a = { la: aLat * toRad, lo: aLng * toRad };
  const b = { la: bLat * toRad, lo: bLng * toRad };
  const av = [
    Math.cos(a.la) * Math.sin(a.lo),
    Math.sin(a.la),
    Math.cos(a.la) * Math.cos(a.lo),
  ];
  const bv = [
    Math.cos(b.la) * Math.sin(b.lo),
    Math.sin(b.la),
    Math.cos(b.la) * Math.cos(b.lo),
  ];
  const dot = Math.max(-1, Math.min(1, av[0] * bv[0] + av[1] * bv[1] + av[2] * bv[2]));
  const omega = Math.acos(dot);
  const out: { lat: number; lng: number; t: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    let v: number[];
    if (omega < 1e-6) {
      v = av;
    } else {
      const s = Math.sin(omega);
      const w1 = Math.sin((1 - t) * omega) / s;
      const w2 = Math.sin(t * omega) / s;
      v = [av[0] * w1 + bv[0] * w2, av[1] * w1 + bv[1] * w2, av[2] * w1 + bv[2] * w2];
    }
    const len = Math.hypot(v[0], v[1], v[2]) || 1;
    out.push({
      lat: (Math.asin(v[1] / len) * 180) / Math.PI,
      lng: (Math.atan2(v[0] / len, v[2] / len) * 180) / Math.PI,
      t,
    });
  }
  return out;
}
