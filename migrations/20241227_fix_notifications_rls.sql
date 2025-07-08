-- Fix RLS policies for notifications table
-- The previous policies used current_setting which doesn't work with the current auth setup

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON notifications;

-- Create more permissive policies for development
-- Note: In production, you should use proper Supabase authentication with auth.uid()

-- Allow all reads for now (can be restricted later)
CREATE POLICY "Allow read notifications" ON notifications
    FOR SELECT USING (true);

-- Allow all updates for now (can be restricted later)  
CREATE POLICY "Allow update notifications" ON notifications
    FOR UPDATE USING (true);

-- Allow all inserts for now (can be restricted later)
CREATE POLICY "Allow insert notifications" ON notifications
    FOR INSERT WITH CHECK (true);

-- Allow all deletes for now (can be restricted later)
CREATE POLICY "Allow delete notifications" ON notifications
    FOR DELETE USING (true);

-- Insert some sample notifications for testing
INSERT INTO notifications (user_id, title, message, type, is_read) VALUES 
('demo-user', 'Bienvenido a MultiServicios', 'Gracias por registrarte en nuestro sistema. Estamos aquí para ayudarte con todos tus servicios eléctricos.', 'info', false),
('demo-user', 'Servicio Programado', 'Tu cita para mañana a las 10:00 AM ha sido confirmada. El técnico llegará puntualmente.', 'service_update', false),
('demo-user', 'Promoción Especial', 'Descuento del 15% en mantenimiento preventivo este mes. ¡No te lo pierdas!', 'info', true);

-- Add a comment
COMMENT ON TABLE notifications IS 'Updated RLS policies for notifications - temporarily permissive for development'; 