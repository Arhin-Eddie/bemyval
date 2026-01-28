-- Add opened_at column to invites
ALTER TABLE invites ADD COLUMN IF NOT EXISTS opened_at TIMESTAMPTZ;

-- Function to mark invite as opened idempotent
-- This ensures we only capture the FIRST open event, preventing overwrites
CREATE OR REPLACE FUNCTION mark_invite_opened(p_invite_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE invites
  SET opened_at = NOW()
  WHERE id = p_invite_id
  AND opened_at IS NULL;
END;
$$;
