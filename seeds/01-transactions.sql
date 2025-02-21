INSERT INTO
  public.transaction(
    id,
    sender_id,
    receiver_id,
    amount,
    status,
    previoushash,
    hash,
    created_at,
    updated_at
  )
VALUES
  (
    '772523ff-cd41-4ff8-bdfc-1f940b5afabd',
    '5f74e184-8798-4fb6-8271-2f94b2f99de2',
    'b51f6866-a92b-4b6c-ac79-2c245d282954',
    0,
    'completed',
    '0',
    '6ebd795e74d90aa7af59d38c968fe3c29cd4fd2bfd4f96f12ad0745392d1b5bd',
    '2025-02-21 17:31:42.632',
		'2025-02-21 17:31:42.633178'
  ),
  (
    'a7172eb5-80ca-4f7e-ac78-aa8a8c0ca68a',
    'b51f6866-a92b-4b6c-ac79-2c245d282954',
    '5f74e184-8798-4fb6-8271-2f94b2f99de2',
    10000,
    'completed',
    '0',
    '45b3eb4c4325ad8a37d281b8a923d98014839c6ede8500eac74454a4feab5a94',
    '2025-02-21 17:33:42.632',
		'2025-02-21 17:33:42.633178'
  );
