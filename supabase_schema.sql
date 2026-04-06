-- Supabase Schema for Unify Chat App

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  uid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  age INTEGER,
  gender TEXT,
  pfp TEXT,
  banner TEXT,
  "onboardingStep" INTEGER DEFAULT 0,
  "isOnline" BOOLEAN DEFAULT false,
  "lastSeen" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  gold BIGINT DEFAULT 0,
  rubies BIGINT DEFAULT 0,
  "hasReceivedReset" BOOLEAN DEFAULT false,
  theme TEXT,
  "cardStyle" TEXT,
  border TEXT,
  "profileEffect" TEXT,
  aura TEXT,
  bio TEXT,
  likes TEXT[] DEFAULT '{}',
  "customThemes" JSONB DEFAULT '[]',
  "customCardStyles" JSONB DEFAULT '[]',
  rank TEXT DEFAULT 'VIP',
  "customRank" JSONB,
  invites INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  xp BIGINT DEFAULT 0,
  level INTEGER DEFAULT 1,
  "lastDailyReward" TIMESTAMP WITH TIME ZONE,
  badges TEXT[] DEFAULT '{}',
  status TEXT,
  "profileVideoUrl" TEXT,
  friends TEXT[] DEFAULT '{}',
  "friendRequests" TEXT[] DEFAULT '{}',
  "mutedUntil" TIMESTAMP WITH TIME ZONE,
  "kickedUntil" TIMESTAMP WITH TIME ZONE,
  "bannedUntil" TIMESTAMP WITH TIME ZONE,
  "isMuted" BOOLEAN DEFAULT false,
  "isBanned" BOOLEAN DEFAULT false,
  "isKicked" BOOLEAN DEFAULT false,
  "profileSong" TEXT
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "senderId" UUID REFERENCES users(uid) ON DELETE CASCADE,
  "senderUsername" TEXT NOT NULL,
  "senderPfp" TEXT,
  "senderRank" TEXT,
  text TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  type TEXT DEFAULT 'text',
  reactions JSONB DEFAULT '{}',
  "gambleData" JSONB,
  "pollData" JSONB
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID REFERENCES users(uid) ON DELETE CASCADE,
  "senderId" UUID,
  "senderUsername" TEXT,
  "senderPfp" TEXT,
  type TEXT NOT NULL,
  content TEXT,
  read BOOLEAN DEFAULT false,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News Table
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "authorId" UUID REFERENCES users(uid) ON DELETE CASCADE,
  "authorUsername" TEXT NOT NULL,
  "authorPfp" TEXT,
  content TEXT NOT NULL,
  "imageUrl" TEXT,
  likes TEXT[] DEFAULT '{}',
  dislikes TEXT[] DEFAULT '{}',
  comments JSONB DEFAULT '[]',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Updates Table
CREATE TABLE IF NOT EXISTS updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  version TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ratings Table
CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "targetUid" UUID REFERENCES users(uid) ON DELETE CASCADE,
  "authorUid" UUID REFERENCES users(uid) ON DELETE CASCADE,
  "authorUsername" TEXT NOT NULL,
  "authorPfp" TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bots Table
CREATE TABLE IF NOT EXISTS bots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  pfp TEXT,
  rank TEXT,
  triggers JSONB DEFAULT '[]',
  "isActive" BOOLEAN DEFAULT true,
  description TEXT,
  tutorial TEXT
);

-- Ranks Table
CREATE TABLE IF NOT EXISTS ranks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  color TEXT,
  permissions TEXT[] DEFAULT '{}',
  "isCustom" BOOLEAN DEFAULT false
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranks ENABLE ROW LEVEL SECURITY;

-- Create Policies (Allow all for now, since it's a migration from Firebase without strict rules specified)
CREATE POLICY "Allow all operations for users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for messages" ON messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for notifications" ON notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for news" ON news FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for updates" ON updates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for ratings" ON ratings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for bots" ON bots FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for ranks" ON ranks FOR ALL USING (true) WITH CHECK (true);

-- Enable Realtime for all tables
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE users, messages, notifications, news, updates, ratings, bots, ranks;
