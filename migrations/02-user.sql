-- DROP TABLE IF EXISTS cobuccio.user;

CREATE TABLE IF NOT EXISTS cobuccio.user (
	id character varying(36) COLLATE pg_catalog."default" NOT NULL DEFAULT cobuccio.uuid_generate_v4(),
	person_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
	email character varying(255) COLLATE pg_catalog."default" UNIQUE NOT NULL,
	cpf character varying(11) COLLATE pg_catalog."default" UNIQUE NOT NULL,
	hashed_password character varying(255) COLLATE pg_catalog."default" NOT NULL,
	birth_date date NOT NULL,
	created_at timestamp without time zone NOT NULL DEFAULT now(),
	updated_at timestamp without time zone NOT NULL DEFAULT now(),
	CONSTRAINT user_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

ALTER TABLE
	IF EXISTS cobuccio.user OWNER to "MasterPostgres";