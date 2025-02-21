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
    '6d83a267c2c3c1ada28d9a4310413a0b3d4708a618c64466dde94f0bea740e9e',
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
    'aab8ee4de61a608556e30b397c1f031756d63e71cf3e392149ecfa1d922f9c34',
    '2025-02-21 17:33:42.632',
		'2025-02-21 17:33:42.633178'
  );
