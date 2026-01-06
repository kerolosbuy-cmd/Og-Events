-- Add manual_pay column to bookings table
-- This column stores the payment method name (e.g., "Vodafone Cash", "Instapay", "online")

ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS manual_pay TEXT;

-- Add a comment to describe the column
COMMENT ON COLUMN bookings.manual_pay IS 'Payment method name used for the booking (e.g., Vodafone Cash, Instapay, online)';
