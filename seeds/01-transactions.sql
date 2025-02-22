INSERT INTO
  public.transaction(
    id,
    sender_id,
    receiver_id,
    amount,
    status,
    previous_hash,
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
    '8bf6817c909dc16ae20d6759356cc6eae79413f13937b01f18c7ee27510373d2',
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
    '19bc416a7cc2777dd8817515c39a67d044cfd74045951ca0887c135d91c5f06b',
    '2025-02-21 17:33:42.632',
		'2025-02-21 17:33:42.633178'
  );
