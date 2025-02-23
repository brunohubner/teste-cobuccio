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
