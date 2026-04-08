-- Drop existing policies if they exist to avoid errors
DROP POLICY IF EXISTS "Allow all operations for users" ON users;
DROP POLICY IF EXISTS "Allow all operations for messages" ON messages;
DROP POLICY IF EXISTS "Allow all operations for notifications" ON notifications;
DROP POLICY IF EXISTS "Allow all operations for news" ON news;
DROP POLICY IF EXISTS "Allow all operations for updates" ON updates;
DROP POLICY IF EXISTS "Allow all operations for ratings" ON ratings;
DROP POLICY IF EXISTS "Allow all operations for bots" ON bots;
DROP POLICY IF EXISTS "Allow all operations for ranks" ON ranks;

-- Create Policies
CREATE POLICY "Allow all operations for users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for messages" ON messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for notifications" ON notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for news" ON news FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for updates" ON updates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for ratings" ON ratings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for bots" ON bots FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for ranks" ON ranks FOR ALL USING (true) WITH CHECK (true);
