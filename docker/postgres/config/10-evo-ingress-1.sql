-- Adminer 4.7.8 PostgreSQL dump

\connect "evo-ingress";

DROP TABLE IF EXISTS "evo-ingress-1";
CREATE TABLE "public"."evo-ingress-1" (
    "Weight" real NOT NULL,
    "WasteType" text NOT NULL
) WITH (oids = false);


-- 2021-01-16 01:34:54.260636+00
