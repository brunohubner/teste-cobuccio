-- 00-schema.sql
-- DROP SCHEMA IF EXISTS cobuccio CASCADE;

CREATE SCHEMA IF NOT EXISTS cobuccio
  AUTHORIZATION "MasterPostgres";

-- 01-uuid.sql
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

-- 02-user.sql
-- DROP TABLE IF EXISTS cobuccio.user;

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

-- 03-transaction.sql
-- DROP TABLE IF EXISTS cobuccio.transaction;

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

-- 04-prevent-update-transaction.sql
CREATE OR REPLACE FUNCTION prevent_transaction_update()

RETURNS TRIGGER AS $$
BEGIN
  IF 
    OLD.id <> NEW.id OR 
    OLD.sender_id <> NEW.sender_id OR 
    OLD.receiver_id <> NEW.receiver_id OR 
    -- OLD.amount <> NEW.amount OR // comentado de propósito.
    OLD.previous_hash <> NEW.previous_hash OR 
    OLD.created_at <> NEW.created_at THEN
    RAISE EXCEPTION 'Os campos id, sender_id, receiver_id, previous_hash e created_at não podem ser alterados';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER transaction_immutable_fields
BEFORE UPDATE ON cobuccio.transaction
FOR EACH ROW
EXECUTE FUNCTION prevent_transaction_update();
