-- 01-users.sql

INSERT INTO
	cobuccio.user(
		id,
		person_name,
		email,
		cpf,
		hashed_password,
		birth_date,
		created_at
	)
VALUES
	(
		'5f74e184-8798-4fb6-8271-2f94b2f99de2',
		'Bruno Hubner',
		'bruno@domain.com',
		'12345678909',
		'$2a$10$fMKdr6RXSRVx1jaES2cc2.w3Sl71S6z7aTQlJdWiw8t4VaSN4e4QG', -- @Pass1234
		'1999-04-21',
		'2025-02-21 17:23:38.24'
	),
	(
		'b51f6866-a92b-4b6c-ac79-2c245d282954',
		'Ana Saiyan',
		'ana@domain.com',
		'14171336007',
		'$2a$10$FiLrBC6f6LblND6cvHZGkeY6SEhT0aWpZKk66uVTl5uYBklsEpMcC', -- @Pass1234
		'2005-01-02',
		'2025-02-21 17:24:38.24'
	);

-- 02-transactions.sql
INSERT INTO
  cobuccio.transaction(
    id,
    sender_id,
    receiver_id,
    amount,
    status,
    previous_hash,
    hash,
    created_at
  )
VALUES
  (
    '772523ff-cd41-4ff8-bdfc-1f940b5afabd',
    '5f74e184-8798-4fb6-8271-2f94b2f99de2',
    'b51f6866-a92b-4b6c-ac79-2c245d282954',
    0,
    'completed',
    '0',
    'add425ce5aa042cea38a3f6ab9cc06e123e95304ea0f18267431807740dd4f24',
    '2025-02-21 17:31:42.632'
  ),
  (
    'a7172eb5-80ca-4f7e-ac78-aa8a8c0ca68a',
    'b51f6866-a92b-4b6c-ac79-2c245d282954',
    '5f74e184-8798-4fb6-8271-2f94b2f99de2',
    10000,
    'completed',
    '0',
    '60e26bc961ed5e29bb491955f4e23a552c46c19eeac17809df90d86c8759fbcf',
    '2025-02-21 17:33:42.632'
  );
