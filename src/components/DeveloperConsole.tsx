import React, { useState, useEffect } from 'react';
import { 
  Terminal, Users, Bot, Shield, Send, BookOpen, Database, 
  Search, Plus, Trash2, Edit2, Save, X, Check, AlertTriangle,
  Code, Cpu, Zap, Globe, Lock, UserPlus, MessageSquare,
  BarChart2, Settings, ChevronRight, ChevronDown, Layers,
  ExternalLink, Copy, RefreshCw, Eye, EyeOff, Filter, VolumeX, Slash, Ban
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../supabase';
import { AVATARS } from '../constants';
import { UserProfile, UserRank, Bot as BotType, BotTrigger, RankDefinition } from '../types';
import { cn } from '../lib/utils';

interface DeveloperConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
}

type Tab = 'dashboard' | 'database' | 'users' | 'bots' | 'ranks' | 'broadcast' | 'tutorials' | 'moderation';

export const DeveloperConsole: React.FC<DeveloperConsoleProps> = ({ isOpen, onClose, currentUser }) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [bots, setBots] = useState<BotType[]>([]);
  const [ranks, setRanks] = useState<RankDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [showBotTemplates, setShowBotTemplates] = useState(false);

  // Modals State
  const [editingDoc, setEditingDoc] = useState<{ id: string; data: any } | null>(null);
  const [editingBot, setEditingBot] = useState<BotType | null>(null);
  const [editingRank, setEditingRank] = useState<RankDefinition | null>(null);
  const [selectedTutorial, setSelectedTutorial] = useState<any | null>(null);
  const [moderationModal, setModerationModal] = useState<{ uid: string; action: 'mute' | 'kick' | 'ban' } | null>(null);

  // Database Explorer State
  const [collections] = useState(['users', 'messages', 'notifications', 'news', 'bots', 'ranks', 'updates']);
  const [selectedCollection, setSelectedCollection] = useState('users');
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchUsers = async () => {
      const { data } = await supabase.from('users').select('*');
      if (data) setUsers(data as UserProfile[]);
    };

    const fetchBots = async () => {
      const { data } = await supabase.from('bots').select('*');
      if (data) setBots(data as BotType[]);
    };

    const fetchRanks = async () => {
      const { data } = await supabase.from('ranks').select('*');
      if (data) setRanks(data as RankDefinition[]);
    };

    fetchUsers();
    fetchBots();
    fetchRanks();

    const usersSubscription = supabase
      .channel('dev-users-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, fetchUsers)
      .subscribe();

    const botsSubscription = supabase
      .channel('dev-bots-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bots' }, fetchBots)
      .subscribe();

    const ranksSubscription = supabase
      .channel('dev-ranks-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ranks' }, fetchRanks)
      .subscribe();

    setLoading(false);

    return () => {
      supabase.removeChannel(usersSubscription);
      supabase.removeChannel(botsSubscription);
      supabase.removeChannel(ranksSubscription);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || activeTab !== 'database') return;

    const fetchDocuments = async () => {
      const { data } = await supabase.from(selectedCollection).select('*').limit(50);
      if (data) setDocuments(data);
    };

    fetchDocuments();

    const docsSubscription = supabase
      .channel(`dev-docs-changes-${selectedCollection}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: selectedCollection }, fetchDocuments)
      .subscribe();

    return () => {
      supabase.removeChannel(docsSubscription);
    };
  }, [isOpen, activeTab, selectedCollection]);

  const handleSendBroadcast = async () => {
    if (!broadcastMessage.trim()) return;
    
    try {
      const { error } = await supabase.from('messages').insert({
        senderId: null,
        senderUsername: 'BROADCAST',
        senderPfp: AVATARS[0],
        senderRank: 'DEVELOPER',
        text: `📢 GLOBAL BROADCAST: ${broadcastMessage}`,
        timestamp: new Date().toISOString(),
        type: 'text'
      });
      if (error) throw error;
      setBroadcastMessage('');
      alert('Broadcast sent successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateUserRank = async (uid: string, newRank: UserRank) => {
    try {
      const { error } = await supabase.from('users').update({ rank: newRank }).eq('uid', uid);
      if (error) throw error;
    } catch (err) {
      console.error(err);
    }
  };

  const handleModerateUser = async (uid: string, action: 'mute' | 'kick' | 'ban', durationMinutes: number = 60, reason: string = '') => {
    const user = users.find(u => u.uid === uid);
    if (!user) return;

    const isCurrentlyModerated = 
      (action === 'mute' && user.mutedUntil && new Date(user.mutedUntil) > new Date()) ||
      (action === 'kick' && user.kickedUntil && new Date(user.kickedUntil) > new Date()) ||
      (action === 'ban' && user.bannedUntil && new Date(user.bannedUntil) > new Date());

    const now = new Date();
    const until = isCurrentlyModerated ? null : new Date(now.getTime() + durationMinutes * 60000).toISOString();
    
    try {
      const update: any = {};
      if (action === 'mute') update.mutedUntil = until;
      if (action === 'kick') update.kickedUntil = until;
      if (action === 'ban') update.bannedUntil = until;
      
      const { error } = await supabase.from('users').update(update).eq('uid', uid);
      if (error) throw error;
      alert(`User ${isCurrentlyModerated ? 'un' : ''}${action}ed successfully!`);
      setModerationModal(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    try {
      const { error } = await supabase.from('users').delete().eq('uid', uid);
      if (error) throw error;
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateUser = async (userData: any) => {
    try {
      const { error } = await supabase.from('users').insert({
        ...userData,
        gold: 1000,
        rubies: 100,
        level: 1,
        isOnline: false,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      });
      if (error) throw error;
      setIsCreatingUser(false);
      alert('User created successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateBot = async (template?: any) => {
    const name = template?.name || prompt('Bot Name:');
    if (!name) return;
    try {
      const { error } = await supabase.from('bots').insert({
        name,
        username: name.toLowerCase().replace(/\s/g, '_') + '_bot',
        pfp: template?.pfp || AVATARS[0],
        rank: template?.rank || 'MODERATOR',
        triggers: template?.triggers || [],
        isActive: true,
        description: template?.description || 'New system bot',
        createdAt: new Date().toISOString()
      });
      if (error) throw error;
      setShowBotTemplates(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateDoc = async (collectionName: string, id: string, data: any) => {
    try {
      const { id: _, ...updateData } = data;
      const { error } = await supabase.from(collectionName).update(updateData).eq('id', id);
      if (error) throw error;
      setEditingDoc(null);
      alert('Document updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Error updating document: ' + (err as Error).message);
    }
  };

  const handleDeleteDoc = async (collectionName: string, id: string) => {
    if (!window.confirm(`Are you sure you want to delete document ${id} from ${collectionName}?`)) return;
    try {
      const { error } = await supabase.from(collectionName).delete().eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveBot = async (bot: BotType) => {
    try {
      const { id, ...botData } = bot;
      const { error } = await supabase.from('bots').update(botData).eq('id', id);
      if (error) throw error;
      setEditingBot(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveRank = async (rank: RankDefinition) => {
    try {
      const { id, ...rankData } = rank;
      if (id === 'new') {
        const newId = rank.name.toUpperCase().replace(/\s/g, '_');
        const { error } = await supabase.from('ranks').insert({ ...rankData, id: newId, isCustom: true });
        if (error) throw error;
      } else {
        const { error } = await supabase.from('ranks').update(rankData).eq('id', id);
        if (error) throw error;
      }
      setEditingRank(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRank = async (id: string) => {
    if (!window.confirm('Delete this rank?')) return;
    try {
      const { error } = await supabase.from('ranks').delete().eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-7xl h-full bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.5)]"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              <Terminal className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">Developer Console</h1>
              <p className="text-xs text-white/40 font-mono">Uni-Fy Core Engine v2.5.0 // Root Access Granted</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-white/10 bg-black/40 p-4 space-y-2 overflow-y-auto">
            <NavButton active={activeTab === 'dashboard'} icon={<BarChart2 />} label="Dashboard" onClick={() => setActiveTab('dashboard')} />
            <NavButton active={activeTab === 'database'} icon={<Database />} label="DB Explorer" onClick={() => setActiveTab('database')} />
            <NavButton active={activeTab === 'users'} icon={<Users />} label="Users" onClick={() => setActiveTab('users')} />
            <NavButton active={activeTab === 'bots'} icon={<Bot />} label="Bot Factory" onClick={() => setActiveTab('bots')} />
            <NavButton active={activeTab === 'ranks'} icon={<Shield />} label="Rank Editor" onClick={() => setActiveTab('ranks')} />
            <NavButton active={activeTab === 'broadcast'} icon={<Send />} label="Broadcast" onClick={() => setActiveTab('broadcast')} />
            <NavButton active={activeTab === 'moderation'} icon={<AlertTriangle />} label="Moderation" onClick={() => setActiveTab('moderation')} />
            <NavButton active={activeTab === 'tutorials'} icon={<BookOpen />} label="Dev Tutorials" onClick={() => setActiveTab('tutorials')} />
            
            <div className="pt-8 px-4">
              <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold mb-4">System Status</p>
              <div className="space-y-3">
                <StatusItem label="Firestore" status="Online" color="text-green-500" />
                <StatusItem label="Auth Engine" status="Active" color="text-green-500" />
                <StatusItem label="Realtime" status="Connected" color="text-green-500" />
                <StatusItem label="Bot Engine" status="Standby" color="text-amber-500" />
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.05),transparent)]">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div 
                  key="dashboard"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard icon={<Users />} label="Total Users" value={users.length} color="text-blue-500" />
                    <StatCard icon={<Bot />} label="Active Bots" value={bots.filter(b => b.isActive).length} color="text-purple-500" />
                    <StatCard icon={<Zap />} label="Online Now" value={users.filter(u => u.isOnline).length} color="text-green-500" />
                    <StatCard icon={<Globe />} label="Server Load" value="12%" color="text-cyan-500" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6">
                      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-500" />
                        Recent Activity
                      </h3>
                      <div className="space-y-4">
                        {users.slice(0, 5).map((u, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-3">
                              <img src={u.pfp} className="w-8 h-8 rounded-lg" alt="" />
                              <div>
                                <p className="text-sm font-bold text-white">{u.username}</p>
                                <p className="text-[10px] text-white/40 font-mono uppercase">{u.rank}</p>
                              </div>
                            </div>
                            <span className="text-[10px] text-white/20 font-mono">Just joined</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6">
                      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-red-500" />
                        Console Output
                      </h3>
                      <div className="bg-black rounded-xl p-4 font-mono text-xs text-green-500/80 h-64 overflow-y-auto space-y-1 custom-scrollbar">
                        <p>[{new Date().toLocaleTimeString()}] Initializing Uni-Fy Core...</p>
                        <p>[{new Date().toLocaleTimeString()}] Connection established to Firestore cluster-0</p>
                        <p>[{new Date().toLocaleTimeString()}] Auth token verified for {currentUser.username}</p>
                        <p>[{new Date().toLocaleTimeString()}] Loading {bots.length} system bots...</p>
                        <p>[{new Date().toLocaleTimeString()}] Syncing {users.length} user profiles...</p>
                        <p className="text-white/40">_</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'users' && (
                <motion.div 
                  key="users"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                      <input 
                        type="text" 
                        placeholder="Search users by username, email, or UID..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-red-500/50 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <button 
                      onClick={() => setIsCreatingUser(true)}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                    >
                      <UserPlus className="w-5 h-5" />
                      Create User
                    </button>
                  </div>

                  <div className="bg-zinc-900/50 border border-white/10 rounded-3xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-black/40 border-b border-white/10">
                        <tr>
                          <th className="p-4 text-xs font-bold text-white/40 uppercase tracking-widest">User</th>
                          <th className="p-4 text-xs font-bold text-white/40 uppercase tracking-widest">Rank</th>
                          <th className="p-4 text-xs font-bold text-white/40 uppercase tracking-widest">Stats</th>
                          <th className="p-4 text-xs font-bold text-white/40 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {users.filter(u => 
                          u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.uid.includes(searchTerm)
                        ).map((u) => (
                          <tr key={u.uid} className="hover:bg-white/5 transition-all group">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <img src={u.pfp} className="w-10 h-10 rounded-xl" alt="" />
                                <div>
                                  <p className="text-sm font-bold text-white">{u.username}</p>
                                  <p className="text-xs text-white/40">{u.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <select 
                                value={u.rank}
                                onChange={(e) => handleUpdateUserRank(u.uid, e.target.value as UserRank)}
                                className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-red-500/50 appearance-none"
                              >
                                {['DEVELOPER', 'FOUNDER', 'ADMINISTRATION', 'MODERATOR', 'VIP', 'ELITE', 'SUPER_VIP'].map(r => (
                                  <option key={r} value={r} className="bg-zinc-900 text-white">{r}</option>
                                ))}
                              </select>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-4 text-xs">
                                <span className="text-amber-500 font-bold">{u.gold}G</span>
                                <span className="text-red-500 font-bold">{u.rubies}R</span>
                                <span className="text-blue-500 font-bold">Lvl {u.level || 1}</span>
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(u.uid);
                                    alert('UID copied to clipboard!');
                                  }}
                                  className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all"
                                  title="Copy UID"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                                <button onClick={() => setModerationModal({ uid: u.uid, action: 'mute' })} title="Mute/Unmute" className="p-2 rounded-lg hover:bg-amber-500/20 text-amber-500 transition-all"><VolumeX className="w-4 h-4" /></button>
                                <button onClick={() => setModerationModal({ uid: u.uid, action: 'kick' })} title="Kick/Unkick" className="p-2 rounded-lg hover:bg-orange-500/20 text-orange-500 transition-all"><Slash className="w-4 h-4" /></button>
                                <button onClick={() => setModerationModal({ uid: u.uid, action: 'ban' })} title="Ban/Unban" className="p-2 rounded-lg hover:bg-red-500/20 text-red-500 transition-all"><Ban className="w-4 h-4" /></button>
                                <button className="p-2 rounded-lg hover:bg-blue-500/20 text-blue-500 transition-all">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteUser(u.uid)}
                                  className="p-2 rounded-lg hover:bg-red-500/20 text-red-500 transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === 'database' && (
                <motion.div 
                  key="database"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="h-full flex flex-col gap-6"
                >
                  <div className="flex items-center gap-4 overflow-x-auto pb-2 custom-scrollbar">
                    {collections.map(c => (
                      <button
                        key={c}
                        onClick={() => setSelectedCollection(c)}
                        className={cn(
                          "px-6 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all border",
                          selectedCollection === c 
                            ? "bg-red-500 border-red-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]" 
                            : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10"
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 bg-zinc-900/50 border border-white/10 rounded-3xl overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-white/10 bg-black/40 flex items-center justify-between">
                      <h3 className="text-sm font-mono text-white/60">Collection: <span className="text-red-500">{selectedCollection}</span></h3>
                      <button className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white">
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                      {documents.map((doc, i) => (
                        <div key={doc.id || i} className="p-4 border-b border-white/5 hover:bg-white/5 transition-all group">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-mono text-red-500/80">{doc.id}</span>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                              <button 
                                onClick={() => setEditingDoc({ id: doc.id, data: doc })}
                                className="p-1.5 rounded-lg hover:bg-blue-500/20 text-blue-500"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteDoc(selectedCollection, doc.id)}
                                className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-500"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <pre className="text-[10px] font-mono text-white/40 overflow-x-auto bg-black/20 p-3 rounded-xl">
                            {JSON.stringify(doc, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'bots' && (
                <motion.div 
                  key="bots"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Bot Factory</h2>
                      <p className="text-sm text-white/40">Create and manage automated system entities</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setShowBotTemplates(true)}
                        className="bg-white/5 hover:bg-white/10 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all border border-white/10"
                      >
                        <Layers className="w-5 h-5" />
                        Templates
                      </button>
                      <button 
                        onClick={() => handleCreateBot()}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                      >
                        <Plus className="w-6 h-6" />
                        Deploy New Bot
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {bots.map(bot => (
                      <div key={bot.id} className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4">
                          <div className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                            bot.isActive ? "bg-green-500/20 border-green-500/50 text-green-500" : "bg-red-500/20 border-red-500/50 text-red-500"
                          )}>
                            {bot.isActive ? 'Active' : 'Offline'}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img src={bot.pfp} className="w-16 h-16 rounded-2xl border-2 border-purple-500/50" alt="" />
                            <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-lg bg-purple-500 flex items-center justify-center border-2 border-[#0a0a0a]">
                              <Cpu className="w-3 h-3 text-white" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">{bot.name}</h3>
                            <p className="text-xs text-white/40 font-mono">@{bot.username}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <p className="text-xs text-white/60 leading-relaxed">{bot.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {bot.triggers.map((t, i) => (
                              <span key={i} className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-purple-400 font-mono">
                                /{t.keyword}
                              </span>
                            ))}
                            <button className="px-2 py-1 rounded-lg bg-purple-500/20 border border-purple-500/50 text-[10px] text-purple-400 hover:bg-purple-500/40 transition-all">
                              + Add Trigger
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                          <button 
                            onClick={() => setEditingBot(bot)}
                            className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl text-sm font-bold transition-all border border-white/5"
                          >
                            Configure Logic
                          </button>
                          <button 
                            onClick={() => handleDeleteDoc('bots', bot.id)}
                            className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'ranks' && (
                <motion.div 
                  key="ranks"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Rank Editor</h2>
                      <p className="text-sm text-white/40">Define permissions and visual identities for user groups</p>
                    </div>
                    <button 
                      onClick={() => setEditingRank({ id: 'new', name: '', icon: '', color: '#ff0000', permissions: [], isCustom: true })}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                    >
                      <Plus className="w-6 h-6" />
                      Create New Rank
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ranks.map(rank => (
                      <div key={rank.id} className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 space-y-4 hover:border-blue-500/30 transition-all group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden">
                              <img src={rank.icon} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div>
                              <h3 className="font-black text-white uppercase italic tracking-tighter" style={{ color: rank.color }}>{rank.name}</h3>
                              <p className="text-[10px] text-white/20 font-mono">{rank.id}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <button 
                              onClick={() => setEditingRank(rank)}
                              className="p-2 rounded-lg hover:bg-blue-500/20 text-blue-500"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteRank(rank.id)}
                              className="p-2 rounded-lg hover:bg-red-500/20 text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {rank.permissions.map((p, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] text-white/40 uppercase font-bold">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'broadcast' && (
                <motion.div 
                  key="broadcast"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="max-w-2xl mx-auto space-y-8 py-12"
                >
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 rounded-3xl bg-amber-500/20 flex items-center justify-center border border-amber-500/50 shadow-[0_0_40px_rgba(245,158,11,0.2)] mx-auto mb-6">
                      <Send className="w-10 h-10 text-amber-500" />
                    </div>
                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Global Broadcast</h2>
                    <p className="text-white/40">Send a system-wide announcement to all active users. Use with extreme caution.</p>
                  </div>

                  <div className="space-y-6">
                    <textarea 
                      value={broadcastMessage}
                      onChange={(e) => setBroadcastMessage(e.target.value)}
                      placeholder="Enter your message here..."
                      className="w-full h-48 bg-white/5 border border-white/10 rounded-3xl p-6 text-white text-lg focus:outline-none focus:border-amber-500/50 transition-all resize-none"
                    />
                    <button 
                      onClick={handleSendBroadcast}
                      disabled={!broadcastMessage.trim()}
                      className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-6 rounded-3xl font-black text-xl uppercase italic tracking-widest transition-all shadow-[0_0_50px_rgba(245,158,11,0.3)]"
                    >
                      Fire Broadcast
                    </button>
                  </div>

                  <div className="p-6 rounded-3xl bg-red-500/10 border border-red-500/20 flex gap-4">
                    <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
                    <p className="text-xs text-red-500/80 leading-relaxed">
                      Warning: Broadcasts are logged and visible to all users. Abuse of this system will result in immediate revocation of developer privileges.
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'moderation' && (
                <motion.div 
                  key="moderation"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-3 gap-6">
                    <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6">
                      <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-2">Muted</h4>
                      <p className="text-3xl font-black text-amber-500">{users.filter(u => u.mutedUntil && new Date(u.mutedUntil) > new Date()).length}</p>
                    </div>
                    <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6">
                      <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-2">Kicked</h4>
                      <p className="text-3xl font-black text-orange-500">{users.filter(u => u.kickedUntil && new Date(u.kickedUntil) > new Date()).length}</p>
                    </div>
                    <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6">
                      <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-2">Banned</h4>
                      <p className="text-3xl font-black text-red-500">{users.filter(u => u.bannedUntil && new Date(u.bannedUntil) > new Date()).length}</p>
                    </div>
                  </div>
                  <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Moderated Users</h3>
                    <div className="space-y-4">
                      {users.filter(u => (u.mutedUntil && new Date(u.mutedUntil) > new Date()) || (u.kickedUntil && new Date(u.kickedUntil) > new Date()) || (u.bannedUntil && new Date(u.bannedUntil) > new Date())).map(u => (
                        <div key={u.uid} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                          <div className="flex items-center gap-3">
                            <img src={u.pfp} className="w-10 h-10 rounded-xl" alt="" />
                            <div>
                              <p className="text-sm font-bold text-white">{u.username}</p>
                              <p className="text-xs text-white/40">{u.email}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {u.mutedUntil && new Date(u.mutedUntil) > new Date() && <span className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-500 text-xs font-bold">Muted</span>}
                            {u.kickedUntil && new Date(u.kickedUntil) > new Date() && <span className="px-2 py-1 rounded-lg bg-orange-500/20 text-orange-500 text-xs font-bold">Kicked</span>}
                            {u.bannedUntil && new Date(u.bannedUntil) > new Date() && <span className="px-2 py-1 rounded-lg bg-red-500/20 text-red-500 text-xs font-bold">Banned</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'tutorials' && (
                <motion.div 
                  key="tutorials"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-12"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/50">
                      <BookOpen className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Developer Tutorials</h2>
                      <p className="text-sm text-white/40">Master the Uni-Fy Core Engine</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <TutorialCard 
                      icon={<Code />}
                      title="Coding Your First Bot"
                      description="Learn how to define triggers, handle user input, and create dynamic responses using the Bot Engine."
                      difficulty="Beginner"
                      onClick={() => setSelectedTutorial({
                        title: "Coding Your First Bot",
                        content: `
# Uni-Fy Bot Engine Guide

Bots in Uni-Fy are powerful entities that can react to chat messages in real-time.

## 1. Defining Triggers
A trigger consists of a **Keyword** and a **Response**.
- **Keyword:** The word or phrase the bot listens for (e.g., "hello").
- **Response:** What the bot says back (e.g., "Hey there! How can I help?").

## 2. Advanced Actions
You can set a trigger type to 'action' to perform system tasks:
- \`type: 'action'\`
- \`action: 'ban_user'\`

## 3. Deployment
Once created in the Bot Factory, your bot is instantly live in the main chat room.
                        `
                      })}
                    />
                    <TutorialCard 
                      icon={<Shield />}
                      title="Permission Hierarchy"
                      description="Deep dive into the rank system and how to secure your collections using Firestore rules."
                      difficulty="Advanced"
                      onClick={() => setSelectedTutorial({
                        title: "Permission Hierarchy",
                        content: `
# Security & Ranks

Uni-Fy uses a multi-layered permission system.

## 1. Rank Priority
Ranks are ordered by priority. Developers (100) have root access, while VIPs (10) have basic perks.

## 2. Firestore Rules
Permissions are enforced at the database level.
\`\`\`javascript
allow update: if request.auth.token.rank == 'DEVELOPER';
\`\`\`

## 3. Custom Ranks
You can create new ranks in the Rank Editor and assign them custom icons and colors.
                        `
                      })}
                    />
                    <TutorialCard 
                      icon={<Zap />}
                      title="Realtime Events"
                      description="Understanding the WebSocket layer and how to push instant updates to clients."
                      difficulty="Intermediate"
                      onClick={() => setSelectedTutorial({
                        title: "Realtime Events",
                        content: "Real-time updates are handled via Firestore's `onSnapshot` listener. Every message, notification, and rank change is pushed to all connected clients in < 100ms."
                      })}
                    />
                    <TutorialCard 
                      icon={<Layers />}
                      title="Custom UI Components"
                      description="How to build and register new themes and card styles for the Uni-Fy marketplace."
                      difficulty="Intermediate"
                      onClick={() => setSelectedTutorial({
                        title: "Custom UI Components",
                        content: "Themes are defined in `constants.ts`. To add a new one, define its background, text colors, and custom CSS styles."
                      })}
                    />
                  </div>

                  <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Terminal className="w-6 h-6 text-green-500" />
                      Bot Logic Example (Node.js)
                    </h3>
                    <pre className="bg-black rounded-2xl p-6 font-mono text-sm text-green-500/80 overflow-x-auto">
{`// Example: A simple "Question Bot" trigger
const handleBotTrigger = async (message, bot) => {
  const trigger = bot.triggers.find(t => 
    message.text.toLowerCase().includes(t.keyword)
  );

  if (trigger) {
    await supabase.from('messages').insert({
      senderId: bot.id,
      senderUsername: bot.name,
      senderPfp: bot.pfp,
      text: \`@\${message.senderUsername} \${trigger.response}\`,
      timestamp: new Date().toISOString()
    });
  }
};`}
                    </pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Modals */}
        <AnimatePresence>
          {editingDoc && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden flex flex-col max-h-[80vh]"
              >
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Edit Document: {editingDoc.id}</h3>
                  <button onClick={() => setEditingDoc(null)} className="text-white/40 hover:text-white"><X /></button>
                </div>
                <div className="p-6 overflow-y-auto flex-1">
                  <textarea 
                    className="w-full h-96 bg-black rounded-xl p-4 font-mono text-xs text-green-500 focus:outline-none border border-white/5"
                    defaultValue={JSON.stringify(editingDoc.data, null, 2)}
                    id="doc-editor"
                  />
                </div>
                <div className="p-6 border-t border-white/10 flex justify-end gap-4">
                  <button onClick={() => setEditingDoc(null)} className="px-6 py-2 rounded-xl text-white/40 hover:text-white font-bold">Cancel</button>
                  <button 
                    onClick={() => {
                      try {
                        const data = JSON.parse((document.getElementById('doc-editor') as HTMLTextAreaElement).value);
                        handleUpdateDoc(selectedCollection, editingDoc.id, data);
                      } catch (e) {
                        alert('Invalid JSON');
                      }
                    }}
                    className="px-6 py-2 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {editingBot && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-3xl bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Bot Configuration: {editingBot.name}</h3>
                  <button onClick={() => setEditingBot(null)} className="text-white/40 hover:text-white"><X /></button>
                </div>
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase">Name</label>
                      <input 
                        type="text" 
                        value={editingBot.name} 
                        onChange={(e) => setEditingBot({ ...editingBot, name: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase">Username</label>
                      <input 
                        type="text" 
                        value={editingBot.username} 
                        onChange={(e) => setEditingBot({ ...editingBot, username: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase">Description</label>
                    <textarea 
                      value={editingBot.description} 
                      onChange={(e) => setEditingBot({ ...editingBot, description: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white h-20"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white uppercase tracking-widest">Triggers</h4>
                      <button 
                        onClick={() => setEditingBot({
                          ...editingBot,
                          triggers: [...editingBot.triggers, { id: Math.random().toString(), keyword: '', response: '', type: 'text' }]
                        })}
                        className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Trigger
                      </button>
                    </div>
                    <div className="space-y-3">
                      {editingBot.triggers.map((trigger, idx) => (
                        <div key={trigger.id} className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                          <div className="flex items-center gap-3">
                            <input 
                              placeholder="Keyword"
                              value={trigger.keyword}
                              onChange={(e) => {
                                const newTriggers = [...editingBot.triggers];
                                newTriggers[idx].keyword = e.target.value;
                                setEditingBot({ ...editingBot, triggers: newTriggers });
                              }}
                              className="flex-1 bg-zinc-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                            <select 
                              value={trigger.type}
                              onChange={(e) => {
                                const newTriggers = [...editingBot.triggers];
                                newTriggers[idx].type = e.target.value as any;
                                setEditingBot({ ...editingBot, triggers: newTriggers });
                              }}
                              className="bg-zinc-900 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white"
                            >
                              <option value="text">Text</option>
                              <option value="image">Image</option>
                              <option value="action">Action</option>
                            </select>
                            <button 
                              onClick={() => {
                                const newTriggers = editingBot.triggers.filter((_, i) => i !== idx);
                                setEditingBot({ ...editingBot, triggers: newTriggers });
                              }}
                              className="text-red-500 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <textarea 
                            placeholder="Response or Action Data"
                            value={trigger.response}
                            onChange={(e) => {
                              const newTriggers = [...editingBot.triggers];
                              newTriggers[idx].response = e.target.value;
                              setEditingBot({ ...editingBot, triggers: newTriggers });
                            }}
                            className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white h-16"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-6 border-t border-white/10 flex justify-end gap-4">
                  <button onClick={() => setEditingBot(null)} className="px-6 py-2 rounded-xl text-white/40 hover:text-white font-bold">Cancel</button>
                  <button 
                    onClick={() => handleSaveBot(editingBot)}
                    className="px-6 py-2 rounded-xl bg-purple-500 text-white font-bold hover:bg-purple-600 transition-all"
                  >
                    Save Bot
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {editingRank && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-xl bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden flex flex-col"
              >
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">{editingRank.id === 'new' ? 'Create New Rank' : 'Edit Rank'}</h3>
                  <button onClick={() => setEditingRank(null)} className="text-white/40 hover:text-white"><X /></button>
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase">Rank Name</label>
                    <input 
                      type="text" 
                      value={editingRank.name} 
                      onChange={(e) => setEditingRank({ ...editingRank, name: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase">Icon URL</label>
                      <input 
                        type="text" 
                        value={editingRank.icon} 
                        onChange={(e) => setEditingRank({ ...editingRank, icon: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase">Color</label>
                      <input 
                        type="color" 
                        value={editingRank.color} 
                        onChange={(e) => setEditingRank({ ...editingRank, color: e.target.value })}
                        className="w-full h-10 bg-black border border-white/10 rounded-xl px-2 py-1 text-white cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase">Permissions (Comma separated)</label>
                    <input 
                      type="text" 
                      value={editingRank.permissions.join(', ')} 
                      onChange={(e) => setEditingRank({ ...editingRank, permissions: e.target.value.split(',').map(p => p.trim()).filter(p => p) })}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white"
                      placeholder="can_ban, can_broadcast, can_edit_ranks"
                    />
                  </div>
                </div>
                <div className="p-6 border-t border-white/10 flex justify-end gap-4">
                  <button onClick={() => setEditingRank(null)} className="px-6 py-2 rounded-xl text-white/40 hover:text-white font-bold">Cancel</button>
                  <button 
                    onClick={() => handleSaveRank(editingRank)}
                    className="px-6 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-all"
                  >
                    Save Rank
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {selectedTutorial && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full max-w-4xl bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden flex flex-col h-[80vh]"
              >
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-blue-500/5">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-blue-500" />
                    <h3 className="text-xl font-bold text-white">{selectedTutorial.title}</h3>
                  </div>
                  <button onClick={() => setSelectedTutorial(null)} className="text-white/40 hover:text-white"><X /></button>
                </div>
                <div className="p-8 overflow-y-auto flex-1 prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap font-sans text-white/80 leading-relaxed">
                    {selectedTutorial.content}
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {moderationModal && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden flex flex-col"
              >
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white capitalize">{moderationModal.action} User</h3>
                  <button onClick={() => setModerationModal(null)} className="text-white/40 hover:text-white"><X /></button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase">Reason</label>
                    <input 
                      type="text" 
                      placeholder="Enter reason..."
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white"
                      id="moderation-reason"
                    />
                  </div>
                  {moderationModal.action !== 'ban' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase">Duration (minutes)</label>
                      <select 
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white"
                        id="moderation-duration"
                      >
                        <option value="15">15 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="1440">24 hours</option>
                        <option value="10080">1 week</option>
                      </select>
                    </div>
                  )}
                </div>
                <div className="p-6 border-t border-white/10 flex justify-end gap-4">
                  <button onClick={() => setModerationModal(null)} className="px-6 py-2 rounded-xl text-white/40 hover:text-white font-bold">Cancel</button>
                  <button 
                    onClick={() => {
                      const reason = (document.getElementById('moderation-reason') as HTMLInputElement).value;
                      const duration = moderationModal.action === 'ban' ? 999999 : parseInt((document.getElementById('moderation-duration') as HTMLSelectElement).value);
                      handleModerateUser(moderationModal.uid, moderationModal.action, duration, reason);
                    }}
                    className="px-6 py-2 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all"
                  >
                    Confirm
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {isCreatingUser && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-xl bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden flex flex-col"
              >
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Create New Account</h3>
                  <button onClick={() => setIsCreatingUser(false)} className="text-white/40 hover:text-white"><X /></button>
                </div>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleCreateUser({
                      uid: formData.get('uid'),
                      username: formData.get('username'),
                      email: formData.get('email'),
                      pfp: AVATARS[0],
                      rank: formData.get('rank')
                    });
                  }}
                  className="p-6 space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase">UID (Unique ID)</label>
                    <input name="uid" required className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white" placeholder="e.g. user_123" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase">Username</label>
                    <input name="username" required className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase">Email</label>
                    <input name="email" type="email" required className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase">Initial Rank</label>
                    <select name="rank" className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white">
                      {['VIP', 'ELITE', 'MODERATOR', 'ADMINISTRATION', 'FOUNDER', 'DEVELOPER'].map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div className="pt-4 flex justify-end gap-4">
                    <button type="button" onClick={() => setIsCreatingUser(false)} className="px-6 py-2 rounded-xl text-white/40 hover:text-white font-bold">Cancel</button>
                    <button type="submit" className="px-6 py-2 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all">Create User</button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}

          {showBotTemplates && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden flex flex-col"
              >
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Bot Templates</h3>
                  <button onClick={() => setShowBotTemplates(false)} className="text-white/40 hover:text-white"><X /></button>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    onClick={() => handleCreateBot({
                      name: 'Question Bot',
                      description: 'Answers common user questions automatically.',
                      rank: 'MODERATOR',
                      pfp: AVATARS[0],
                      triggers: [
                        { id: '1', keyword: 'help', response: 'How can I assist you today? Type /rules for guidelines.', type: 'text' },
                        { id: '2', keyword: 'rules', response: '1. Be respectful. 2. No spam. 3. Have fun!', type: 'text' }
                      ]
                    })}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 cursor-pointer transition-all group"
                  >
                    <MessageSquare className="w-8 h-8 text-purple-500 mb-4" />
                    <h4 className="font-bold text-white">Question Bot</h4>
                    <p className="text-xs text-white/40">Automated FAQ handler</p>
                  </div>
                  <div 
                    onClick={() => handleCreateBot({
                      name: 'Welcome Bot',
                      description: 'Greets new users when they join the chat.',
                      rank: 'VIP',
                      pfp: AVATARS[0],
                      triggers: [
                        { id: '1', keyword: 'hello', response: 'Welcome to Uni-Fy! We are glad to have you here.', type: 'text' }
                      ]
                    })}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 cursor-pointer transition-all group"
                  >
                    <Globe className="w-8 h-8 text-blue-500 mb-4" />
                    <h4 className="font-bold text-white">Welcome Bot</h4>
                    <p className="text-xs text-white/40">New user greeter</p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; icon: React.ReactNode; label: string; onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all border",
      active 
        ? "bg-red-500 border-red-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]" 
        : "bg-transparent border-transparent text-white/40 hover:text-white hover:bg-white/5"
    )}
  >
    {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<any>, { className: "w-5 h-5" })}
    {label}
  </button>
);

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color: string }> = ({ icon, label, value, color }) => (
  <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 space-y-2">
    <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10", color)}>
      {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<any>, { className: "w-5 h-5" })}
    </div>
    <p className="text-xs text-white/40 uppercase tracking-widest font-bold">{label}</p>
    <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
  </div>
);

const StatusItem: React.FC<{ label: string; status: string; color: string }> = ({ label, status, color }) => (
  <div className="flex items-center justify-between text-xs">
    <span className="text-white/40">{label}</span>
    <div className="flex items-center gap-2">
      <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse bg-current", color)} />
      <span className={cn("font-bold", color)}>{status}</span>
    </div>
  </div>
);

const TutorialCard: React.FC<{ icon: React.ReactNode; title: string; description: string; difficulty: string; onClick?: () => void }> = ({ icon, title, description, difficulty, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 space-y-4 hover:border-blue-500/50 transition-all cursor-pointer group"
  >
    <div className="flex items-center justify-between">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-blue-500/20 group-hover:border-blue-500/50 transition-all">
        {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<any>, { className: "w-6 h-6 text-white/40 group-hover:text-blue-500 transition-all" })}
      </div>
      <span className={cn(
        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
        difficulty === 'Beginner' ? "bg-green-500/10 border-green-500/50 text-green-500" :
        difficulty === 'Intermediate' ? "bg-blue-500/10 border-blue-500/50 text-blue-500" :
        "bg-red-500/10 border-red-500/50 text-red-500"
      )}>
        {difficulty}
      </span>
    </div>
    <div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-white/40 leading-relaxed">{description}</p>
    </div>
    <div className="flex items-center gap-2 text-blue-500 text-xs font-bold">
      Start Learning
      <ChevronRight className="w-4 h-4" />
    </div>
  </div>
);
