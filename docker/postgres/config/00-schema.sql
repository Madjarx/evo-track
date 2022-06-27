select * from pg_available_extensions order by name;


-- UGGGGG: https://stackoverflow.com/questions/40040540/how-to-create-postgres-extension-inside-the-container
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- DROP EXTENSION  pgcrypto; -- no dice, not found.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- USE evodb;

/**
 * This is for our unit tests.
 *
 * The SQL structure has been stripped down to essentials.
 */

CREATE TABLE IF NOT EXISTS orgs (
                                    id UUID NOT NULL PRIMARY KEY,
                                    name TEXT NOT NULL,
                                    identifier TEXT NOT NULL UNIQUE,
                                    reports_ref TEXT
);

CREATE TABLE IF NOT EXISTS sites (
                                     id UUID NOT NULL PRIMARY KEY,
                                     name TEXT NOT NULL,
                                     identifier TEXT NOT NULL UNIQUE,
                                     reports_ref TEXT,

                                     org UUID NOT NULL REFERENCES orgs
);

CREATE TABLE IF NOT EXISTS clusters (
                                        id UUID NOT NULL PRIMARY KEY,
                                        name TEXT NOT NULL,
                                        identifier TEXT NOT NULL UNIQUE,

                                        org UUID NOT NULL REFERENCES orgs,
                                        site UUID NOT NULL REFERENCES sites,

                                        modes INTEGER[] NOT NULL DEFAULT '{}',
                                        awd_ids INTEGER[] NOT NULL DEFAULT '{}',    -- TODO: unique?

                                        reports_ref TEXT

);

CREATE TABLE IF NOT EXISTS bin_weights (
                                           unit_id UUID NOT NULL REFERENCES clusters,
                                           timestamp TIMESTAMPTZ NOT NULL,
                                           timezone TEXT NOT NULL,

                                           mode SMALLINT NOT NULL,

                                           change REAL NOT NULL,
                                           change_units TEXT NOT NULL,

                                           weight REAL NOT NULL,
                                           weight_units TEXT NOT NULL,
                                           scale_mode TEXT NOT NULL,

                                           overweight BOOLEAN NOT NULL,

                                           ignore BOOLEAN NOT NULL DEFAULT 'f',
                                           CONSTRAINT bin_weights_no_simul UNIQUE (unit_id, timestamp)

);


