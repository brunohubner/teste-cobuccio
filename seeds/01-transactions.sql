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
    10000,
    'completed',
    '0',
    'c28d66cebdbe7c0cd764f50f8154b94e3675042eb0d46cd5c35a114c43a681d1',
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
