-- Retira únicamente los cinco IDs fijos del catálogo de demostración del frontend antiguo.
-- Las cabañas creadas desde el panel usan UUIDs y no se modifican.
DELETE FROM "cabins"
WHERE "id" IN (
  'cabana-1-abba',
  'cabana-2-avinu',
  'cabana-3-ahav',
  'cabana-4-agape',
  'cabana-5-nido-en-el-cielo'
);
