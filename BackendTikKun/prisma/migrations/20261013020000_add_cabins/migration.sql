CREATE TABLE "cabins" (
    "id" VARCHAR(120) NOT NULL,
    "numero_cabana" INTEGER NOT NULL,
    "etiqueta_numero_cabana" VARCHAR(50) NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "tipo" VARCHAR(20) NOT NULL,
    "subtitulo" VARCHAR(300) NOT NULL,
    "descripcion" VARCHAR(4000) NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "camas" VARCHAR(250) NOT NULL,
    "banos" INTEGER NOT NULL,
    "precio_cop" INTEGER NOT NULL,
    "precio_usd" INTEGER NOT NULL,
    "tarifas" JSONB NOT NULL,
    "calificacion" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cantidad_resenas" INTEGER NOT NULL DEFAULT 0,
    "imagen_principal" VARCHAR(2048) NOT NULL,
    "imagenes_galeria" TEXT[] NOT NULL,
    "caracteristicas" TEXT[] NOT NULL,
    "comodidades" JSONB NOT NULL,
    "insignia_popular" VARCHAR(150),
    "tamano_m2" DOUBLE PRECISION NOT NULL,
    "reglas" JSONB,
    "cortesias" JSONB,
    "especificaciones" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "cabins_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "cabins_numero_cabana_key" ON "cabins"("numero_cabana");
