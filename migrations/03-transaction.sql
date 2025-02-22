-- DROP TABLE IF EXISTS public.transaction;

CREATE TABLE IF NOT EXISTS public.transaction (
	id character varying(36) COLLATE pg_catalog."default" NOT NULL DEFAULT public.uuid_generate_v4(),
	sender_id character varying(36) COLLATE pg_catalog."default" NOT NULL,
	receiver_id character varying(36) COLLATE pg_catalog."default" NOT NULL,
	amount numeric(10,2) NOT NULL,
	status character varying(20) CHECK (status IN ('pending', 'completed', 'canceled', 'rejected')) NOT NULL DEFAULT 'pending',
	previous_hash character varying(64) COLLATE pg_catalog."default" NOT NULL,
	hash character varying(64) COLLATE pg_catalog."default" NOT NULL,
	created_at timestamp without time zone NOT NULL DEFAULT now(),
	updated_at timestamp without time zone NOT NULL DEFAULT now(),

	CONSTRAINT transaction_pkey PRIMARY KEY (id),

	CONSTRAINT transaction_sender_id_fkey FOREIGN KEY (sender_id)
		REFERENCES public.user (id) MATCH SIMPLE
		ON UPDATE NO ACTION
		ON DELETE NO ACTION,

	CONSTRAINT transaction_receiver_id_fkey FOREIGN KEY (receiver_id)
		REFERENCES public.user (id) MATCH SIMPLE
		ON UPDATE NO ACTION
		ON DELETE NO ACTION
) TABLESPACE pg_default;

ALTER TABLE
	IF EXISTS public.transaction OWNER to "MasterPostgres";
