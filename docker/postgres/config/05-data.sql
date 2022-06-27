-- TODO: FOR SOME REASON, THIS FUCKER RUNS TWICE
-- TODO: INSERT SEED DATA

-- DELETE FROM bin_weights WHERE change <= .2;

-- INSERT INTO orgs (id, identifier, name) VALUES (gen_random_uuid(), 'ORG', 'ORG_NAME');
--
-- INSERT INTO sites
--     (org, id, identifier, name)
-- VALUES
--     ((SELECT id FROM orgs LIMIT 1), gen_random_uuid(), 'ORG_SITE', 'ORG_SITE_NAME')

-- EXCEPT SELECT 1;

-- INSERT INTO clusters() TODO:

-- INSERT INTO bin_weights
--     (unit_id, timestamp, change, change_units, weight, weight_units, overweight, scale_mode, mode, timezone, ignore)
--
-- INSERT INTO bin_telemetry
--     (unit_id, timestamp, boot_id, bin_mode, timezone, screen_status, connectivity_status, scale_status, gui_status, temperature)

-- INSERT INTO clusters (name) SELECT DISTINCT unit_id FROM bin_weights;

-- SELECT clusters.id,
--        bin_telemetry.timestamp,
--        bin_telemetry.boot_id,
--        bin_telemetry.bin_mode,
--        bin_telemetry.timezone,
--        bin_telemetry.screen_status,
--        bin_telemetry.connectivity_status,
--        bin_telemetry.scale_status,
--        bin_telemetry.gui_status,
--        bin_telemetry.temperature
-- FROM clusters,
--      bin_telemetry
-- WHERE clusters.name::uuid = bin_telemetry.unit_id;

-- SELECT clusters.id,
--        bin_weights.timestamp,
--        bin_weights.change,
--        bin_weights.change_units,
--        bin_weights.weight,
--        bin_weights.weight_units,
--        bin_weights.overweight,
--        bin_weights.scale_mode,
--        bin_weights.mode,
--        bin_weights.timezone,
--        bin_weights.ignore
-- FROM clusters,
--      bin_weights
-- WHERE clusters.name::uuid = bin_weights.unit_id;

-- USE evodb;

INSERT INTO orgs(
    id,
    name, 
    identifier,
    reports_ref 
) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Moishes company',
    'moisheco',
    'abcdefghi12345'
);

INSERT INTO sites (
    id, 
    name, 
    identifier, 
    reports_ref, 
    org
) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 
    'Moishes Room', 
    'room', 
    'klmnopqrs12345', 
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
);

INSERT INTO clusters (
    id,
    name,
    identifier,
    org,
    site,
    modes,
    awd_ids,
    reports_ref
) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    'Moishes Desk',
    'desk',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    '{0}',
    '{32}',
    'qrstuvqxy1234523'
)

