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