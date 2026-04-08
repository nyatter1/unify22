-- Ensure the messages table has full replication identity
-- This ensures that all columns are sent in the real-time payload
ALTER TABLE messages REPLICA IDENTITY FULL;

-- Ensure the messages table is correctly in the realtime publication
-- We drop and recreate the publication to ensure it picks up all tables and columns
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE users, messages, notifications, news, updates, ratings, bots, ranks;

-- Ensure RLS is enabled and policies allow reading
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all operations for messages" ON messages;
CREATE POLICY "Allow all operations for messages" ON messages FOR ALL USING (true) WITH CHECK (true);
