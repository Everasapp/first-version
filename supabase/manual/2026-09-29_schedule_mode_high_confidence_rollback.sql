-- MANUAL rollback for 2026-09-29_schedule_mode_high_confidence.sql
-- Restores only the IDs touched by that script to `single`.

BEGIN;

UPDATE public.events
SET schedule_mode = 'single'
WHERE id = '7c1d0a6b-dfd7-4dd9-b934-bfd7c9c07047'
  AND slug = 'tutankhamon-la-tomba-il-tesoro-la-scoperta-st374347'
  AND schedule_mode = 'continuous';

UPDATE public.events
SET schedule_mode = 'single'
WHERE id = '85c768b5-6990-4b8d-8549-6af2437db363'
  AND slug = 'futurama-st274347'
  AND schedule_mode = 'continuous';

UPDATE public.events
SET schedule_mode = 'single'
WHERE id = '06687462-1e13-48af-b6ac-afdf36a006e0'
  AND slug = 'partiture-di-ruggine-e-di-seta-wanda-nazzari-6aa19e7f'
  AND schedule_mode = 'continuous';

UPDATE public.events
SET schedule_mode = 'single'
WHERE id = 'b4e81734-a1b6-474a-9423-18da9e9152e7'
  AND slug = 'mostra-radici-roots-1a09065a6f9'
  AND schedule_mode = 'continuous';

UPDATE public.events
SET schedule_mode = 'single'
WHERE id = '85de5e5e-f21e-450d-9aea-03fb55ceb8be'
  AND slug = 'frammenti-d-identita-6aa19e77'
  AND schedule_mode = 'continuous';

UPDATE public.events
SET schedule_mode = 'single'
WHERE id = '9f0b6275-b692-4d26-a18b-474b1bdb0834'
  AND slug = 'memoria-e-natura-tradizione-e-mutamento-due-nuove-mostre-al-museo-organica-di-tempio-pausania-mul8zo2v'
  AND schedule_mode = 'continuous';

UPDATE public.events
SET schedule_mode = 'single'
WHERE id = '914c859a-b7a3-4ccc-995a-3f65db756d37'
  AND slug = 'mostra-gaetano-crivaro-margherita-pisano-atlante-videoritratti-di-gallura-mua1oeil'
  AND schedule_mode = 'continuous';

UPDATE public.events
SET schedule_mode = 'single'
WHERE id = 'e3265575-ce7b-4f2a-9446-13ff0c3f4954'
  AND slug = 'mostra-caterina-lai-tracce-di-terra-e-di-vento-mu9zze6o'
  AND schedule_mode = 'continuous';

UPDATE public.events
SET schedule_mode = 'single'
WHERE id = 'c4a80095-efdf-40ca-a54b-3dea53b9573b'
  AND slug = 'organica-mostre-di-caterina-lai-e-suber-2026-09-20-25ea706a'
  AND schedule_mode = 'continuous';

UPDATE public.events
SET schedule_mode = 'single'
WHERE id = '41aa6cd8-ce7c-4f3b-9cb0-183cc9b316da'
  AND slug = 'autunno-in-barbagia-2026-mt0ahz26'
  AND schedule_mode = 'container';

SELECT id, slug, title, schedule_mode
FROM public.events
WHERE id IN (
  '7c1d0a6b-dfd7-4dd9-b934-bfd7c9c07047',
  '85c768b5-6990-4b8d-8549-6af2437db363',
  '06687462-1e13-48af-b6ac-afdf36a006e0',
  'b4e81734-a1b6-474a-9423-18da9e9152e7',
  '85de5e5e-f21e-450d-9aea-03fb55ceb8be',
  '9f0b6275-b692-4d26-a18b-474b1bdb0834',
  '914c859a-b7a3-4ccc-995a-3f65db756d37',
  'e3265575-ce7b-4f2a-9446-13ff0c3f4954',
  'c4a80095-efdf-40ca-a54b-3dea53b9573b',
  '41aa6cd8-ce7c-4f3b-9cb0-183cc9b316da'
)
ORDER BY title;

COMMIT;
