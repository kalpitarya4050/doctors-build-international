import type { UniImage } from "./university-images";
import { uniCampusImages, uniCityImages } from "./university-images";
import type { UniLogo } from "./university-logos";

/* ============================================================
   Photography the client actually owns.

   university-images.ts and university-logos.ts are both rewritten
   from scratch by their fetch scripts, so nothing hand-written can
   live in them. This file is the hand-maintained overlay: it wins
   over the generated set and survives `npm run images:universities`.
   The files it points at live under public/images/owned/**, a tree
   no generator writes to.

   THE ONLY THING THAT MATTERS HERE IS THAT THE CLAIMS ARE TRUE.

   The generated set is Pexels stock, captioned "illustrative of
   medical study abroad" because that is what it is — a family
   reading this page is deciding where to send a child and lakhs of
   rupees, and a stock laboratory presented as a campus laboratory
   is a lie they would find out about after paying. Everything in
   THIS file is the real place, so it carries `owned: true` and the
   UI drops the illustrative caption for it.

   Add a university here only when the client has supplied genuine
   photographs of it. Run scripts/ingest-owned-photos.mjs to produce
   the files and the width/height/avgColor values below.
   ============================================================ */

/** A gallery tile. `owned` marks the client's own photography — real
 *  pictures of the named place, as opposed to illustrative stock. */
export type GalleryImage = UniImage & { owned?: boolean };

/* Short on purpose. This string is the tile subtitle, printed under
   a label in a grid cell that is half a phone wide — the full
   institution name wrapped to three lines and swamped the photo. The
   unabbreviated name is carried by the alt text and the footnote. */
const NCSA_PLACE = "NCSA, Cherkessk";

/* Slug → the client's own photographs, in gallery order.
 *
 * These REPLACE the five generated University/* slots rather than
 * sitting alongside them. The generated slots are Campus, Laboratory,
 * Classroom, Hospital and Students; the client's photographs do not
 * cover laboratory, classroom or hospital, and filling those three
 * labels with a cricket match would be worse than not having them.
 * What we actually hold — the grounds, the sports complex, the Indian
 * student body, freshers, a festival — is what the gallery shows. */
export const OWNED_UNI_PHOTOS: Record<string, GalleryImage[]> = {
  "north-caucasian-state-academy": [
    {
      key: "University/01_Campus",
      label: "Campus grounds",
      src: "/images/owned/north-caucasian-state-academy/campus-grounds.jpg",
      alt: "Indian students standing on the grounds of North Caucasian State Academy in Cherkessk, with academy buildings behind them",
      isPlace: true,
      place: NCSA_PLACE,
      photographer: "Doctors Build International",
      avgColor: "#9DA3A2",
      owned: true,
    },
    {
      key: "University/02_Sports_Complex",
      label: "Sports & health complex",
      // The signage in this frame reads «СЕВЕРО-КАВКАЗСКАЯ
      // ГОСУДАРСТВЕННАЯ АКАДЕМИЯ» under the Russian Ministry of
      // Science and Higher Education crest, which is why it is the
      // lead: it is the one photograph that identifies itself.
      src: "/images/owned/north-caucasian-state-academy/sports-complex.jpg",
      alt: "Three Indian medical students holding trophies and certificates outside the sports and health complex at North Caucasian State Academy, Cherkessk",
      isPlace: true,
      place: NCSA_PLACE,
      photographer: "Doctors Build International",
      avgColor: "#7F818C",
      owned: true,
    },
    {
      key: "University/03_Students_Indian_Students",
      label: "Indian students",
      src: "/images/owned/north-caucasian-state-academy/indian-students.jpg",
      alt: "A large group of Indian medical students seated on the steps of the sports complex at North Caucasian State Academy with tournament trophies",
      isPlace: true,
      place: NCSA_PLACE,
      photographer: "Doctors Build International",
      avgColor: "#7D808D",
      owned: true,
    },
    {
      key: "University/04_Student_Life",
      label: "Freshers' evening",
      src: "/images/owned/north-caucasian-state-academy/freshers-evening.jpg",
      alt: "Students performing a group dance on stage at the freshers' evening at North Caucasian State Academy",
      isPlace: true,
      place: NCSA_PLACE,
      photographer: "Doctors Build International",
      avgColor: "#362A4B",
      owned: true,
    },
    {
      key: "University/05_Festival",
      label: "Festivals on campus",
      src: "/images/owned/north-caucasian-state-academy/festival.jpg",
      alt: "Indian students in traditional dress beside a decorated shrine during a festival celebration at North Caucasian State Academy",
      isPlace: true,
      place: NCSA_PLACE,
      photographer: "Doctors Build International",
      avgColor: "#8F8B80",
      owned: true,
    },
  ],
};

/* university-logos.ts records NCSA as having "no usable mark on
   file". The client has since supplied the official СКГА crest, so
   it is registered here rather than in the generated file, where the
   next `npm run images:logos` would drop it again. `source` is the
   client's own upload rather than a URL, which is the honest answer
   to "where did this come from". */
export const OWNED_UNI_LOGOS: Record<string, UniLogo> = {
  "north-caucasian-state-academy": {
    src: "/images/university-logos/north-caucasian-state-academy.png",
    source: "Supplied by the university via Doctors Build International",
    // Dark maroon on transparency — invisible on a dark tile.
    tone: "light",
  },
};

/** True where the client holds genuine photography of this campus.
 *  Drives whether the gallery disclaims its images as illustrative. */
export function hasOwnedPhotos(slug: string): boolean {
  return (OWNED_UNI_PHOTOS[slug]?.length ?? 0) > 0;
}

/** The five campus tiles: the client's own where we have them, the
 *  generated illustrative set where we do not. */
export function galleryCampusImages(slug: string): GalleryImage[] {
  return OWNED_UNI_PHOTOS[slug] ?? uniCampusImages(slug);
}

/** The four city tiles. Always the generated set — the client has
 *  supplied campus photography, not city photography. */
export function galleryCityImages(slug: string): GalleryImage[] {
  return uniCityImages(slug);
}
