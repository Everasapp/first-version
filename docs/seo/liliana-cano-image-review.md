# Liliana Cano: sources and image review

Checked on 2026-10-04. Requested: original EVERAS article, artist portrait and representative artworks, using only freely licensed images.

## Publication

`/cultura/liliana-cano` contains the original article, official sources, FAQs and related guides. It initially had no hero or reproduced artwork. Following the user's request for a freely reusable, anonymous stylized painter, it now uses an original AI illustration. This fictional middle-aged woman has a gray bob and is seen from behind; it is not a portrait of Cano and the fictional abstract canvas does not reproduce her work. Alt text and visible credits explicitly identify the image as anonymous. The hero also supplies the Cultura card, Open Graph and article metadata through existing data bindings.

## Image decisions

| Candidate | Declared photo rights | Decision |
| --- | --- | --- |
| Portraits on https://lilianacano.com/biografia/ | No free image license documented | Not copied. Official gallery linked in article sources. |
| I candelieri, Donne e arance, Neruda 1, S'Ardia, Trittico del mare | Archive requests permission for reproduction | Not copied. Official gallery linked. |
| https://commons.wikimedia.org/wiki/File:Sporting_Club_Monte_Spada_8.jpg | Photographer Air fans: CC BY-SA 4.0 | Not copied: photo license alone does not document a free license for Cano's depicted mural. |
| https://commons.wikimedia.org/wiki/File:Monumento_alla_donna,_opera_di_Liliana_Cano.jpg | Licensing section CC BY-SA 4.0; summary also mentions 3.0/GFDL | Not copied: no documented clearance for depicted sculpture and inconsistent license summary. |

The archive explicitly asks users to request permission, specifying the intended use: https://lilianacano.com/contatti/. No permission was requested or inferred. No images were downloaded or published.

## Subsequent AI portrait request

The user subsequently requested an artificial portrait with close likeness to a real photograph. A reference portrait from https://lilianacano.com/biografia/ was downloaded separately from the repository, and an editorial gouache/pencil illustration was generated from it. This preview is delivered in the conversation, not published on EVERAS or declared freely licensed. The initial no-download statement above describes the artwork review; this reference download is the sole subsequent exception. Creating a derivative portrait does not document reproduction clearance for the original photograph.

## Anonymous illustration

The user replaced the image brief with a generic anonymous stylized painter, then specified a middle-aged woman with a gray bob. The original generic scene was generated without any reference photograph. The only edit reference is that newly generated generic scene; neither the Cano photo nor the earlier portrait was included. Built-in image generation was used. The WebP is saved at `public/images/cultura/pittrice-anonima-hero.webp` and its CC0 statement at `public/images/cultura/pittrice-anonima-hero.license.txt`. The CC0 dedication covers any rights EVERAS controls, to the extent applicable, as requested by the user; it does not assert that AI output necessarily attracts copyright or extend to any other asset.

If the user obtains written authorization, confirm that it covers EVERAS, advertising-supported publication, both the depicted works and the photographs, required credits and allowed resizing. A permission to publish is not itself a free license; the user must choose whether to accept that alternative to their original free-license requirement.

## Editorial source allocation

- Biography and chronology of residence: https://lilianacano.com/biografia/ (under 200 derived words including FAQ).
- Figurative approach, I candelieri and the 2026 exhibition/catalog: Comune di Sassari page linked in the article (under 200 derived words including introduction and FAQ).
- Women in the painting: Abitare lo spazio, Il corpo femminile nella costruzione visiva (under 200 words).
- Selected painting titles/dates: archive Opere gallery (under 200 words).
- Public interventions, Ozieri/Fonni/Bono and altered original: Abitare lo spazio Cronologia (under 200 words).
- Map, sites and research method: Abitare lo spazio project (under 200 words including FAQ).
- Oliena collection, visitor support and Monumento alla donna: SardegnaCultura (under 200 words).
- Museo Diffuso inauguration: archive dedicated article (under 200 words).
- Archive foundation/organigram: archive L'archivio (under 200 words).

Text is an original synthesis; no direct quotes. No current museum hours or ticket prices are asserted. The past exhibition is not presented as upcoming or currently open.

## Image generation prompts

Initial generation (built-in):

Use case: illustration-story. Asset type: landscape 3:2 editorial hero for a cultural article about painting on EVERAS. Primary request: an original stylized illustration of an anonymous woman painter with no identifiable face or connection to any real person. Scene: quiet artist's studio, one easel, a palette and brushes. Subject: a female painter seen from behind and slightly in profile with her face completely hidden, wearing a simple artist's smock, painting a wholly invented abstract composition of loose shapes on a canvas. Style: tasteful contemporary gouache illustration on subtly textured paper, soft warm daylight, earthy terracotta, muted blue and sage, refined and welcoming. Composition: wide balanced scene, whole upper body, hand, brush and easel visible with comfortable margins, suitable for a website hero. Constraints: no portrait likeness, no distinctive features of Liliana Cano or any real artist, no recreation of any existing artwork or artist signature, no text, logos, watermark, labels or frame. Entirely new generic scene.

Final edit (built-in, anonymous generated scene only):

Use case: precise-object-edit. Edit the supplied original generic illustration. Change only the anonymous female painter's age impression and hair: she should be a middle-aged woman, roughly 50 to 60, with a soft gray chin-length bob haircut, slightly textured natural gray hair, no bun and no long hair. Keep her seen from behind with her face completely hidden and no recognizable identity; do not resemble Liliana Cano or any real person. Preserve the same studio, pose, hand holding brush, palette, smock, easel, wholly invented abstract canvas, warm lighting, paper texture, gouache style and landscape 3:2 framing. No lettering or signatures. Do not add objects.
