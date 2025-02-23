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
