-- DROP FUNCTION IF EXISTS cobuccio.uuid_generate_v4();

CREATE OR REPLACE FUNCTION cobuccio.uuid_generate_v4(
	)
    RETURNS uuid
    LANGUAGE 'c'
    COST 1
    VOLATILE STRICT PARALLEL SAFE 
AS '$libdir/uuid-ossp', 'uuid_generate_v4'
;

ALTER FUNCTION cobuccio.uuid_generate_v4()
    OWNER TO "MasterPostgres";
