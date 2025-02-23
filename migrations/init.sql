DROP SCHEMA IF EXISTS cobuccio CASCADE;

CREATE SCHEMA IF NOT EXISTS cobuccio
  AUTHORIZATION "MasterPostgres";

DROP FUNCTION IF EXISTS vink.uuid_generate_v4();

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

DROP TABLE IF EXISTS cobuccio.user;

CREATE TABLE IF NOT EXISTS cobuccio.user (
	id character varying(36) COLLATE pg_catalog."default" NOT NULL DEFAULT cobuccio.uuid_generate_v4(),
	person_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
	email character varying(255) COLLATE pg_catalog."default" UNIQUE NOT NULL,
	cpf character varying(11) COLLATE pg_catalog."default" UNIQUE NOT NULL,
	hashed_password character varying(255) COLLATE pg_catalog."default" NOT NULL,
	birth_date date NOT NULL,
	created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone,
	CONSTRAINT user_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

ALTER TABLE
	IF EXISTS cobuccio.user OWNER to "MasterPostgres";

DROP TABLE IF EXISTS cobuccio.transaction;

CREATE TABLE IF NOT EXISTS cobuccio.transaction (
	id character varying(36) COLLATE pg_catalog."default" NOT NULL DEFAULT cobuccio.uuid_generate_v4(),
	sender_id character varying(36) COLLATE pg_catalog."default" NOT NULL,
	receiver_id character varying(36) COLLATE pg_catalog."default" NOT NULL,
	amount numeric(10,2) NOT NULL,
	status character varying(20) CHECK (status IN ('pending', 'completed', 'canceled', 'rejected')) NOT NULL DEFAULT 'pending',
	previous_hash character varying(64) COLLATE pg_catalog."default" NOT NULL,
	hash character varying(64) COLLATE pg_catalog."default" NOT NULL,
	created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone,

	CONSTRAINT transaction_pkey PRIMARY KEY (id),

	CONSTRAINT transaction_sender_id_fkey FOREIGN KEY (sender_id)
		REFERENCES cobuccio.user (id) MATCH SIMPLE
		ON UPDATE NO ACTION
		ON DELETE NO ACTION,

	CONSTRAINT transaction_receiver_id_fkey FOREIGN KEY (receiver_id)
		REFERENCES cobuccio.user (id) MATCH SIMPLE
		ON UPDATE NO ACTION
		ON DELETE NO ACTION
) TABLESPACE pg_default;

ALTER TABLE
	IF EXISTS cobuccio.transaction OWNER to "MasterPostgres";
