export const STAGES = [
  { id: 'new', label: 'INBOX', emoji: '📥', color: '#00D9FF' },
  { id: 'research', label: 'RECON', emoji: '🔍', color: '#8B5CF6' },
  { id: 'poc', label: 'PROTOTYPE', emoji: '⚡', color: '#FF6B35' },
  { id: 'codebase', label: 'BUILD', emoji: '🔧', color: '#00D9FF' },
  { id: 'testing', label: 'TESTING', emoji: '🎯', color: '#FFD700' },
  { id: 'deployed', label: 'DEPLOYED', emoji: '🚀', color: '#00FF9F' },
];

export const DEFAULT_CATEGORIES = [
  { id: 'projects', label: '🚀 SIDE PROJECTS', color: '#00D9FF' },
  { id: 'revenue', label: '💰 REVENUE STREAMS', color: '#00FF9F' },
  { id: 'skills', label: '🧠 SKILLS & LEARNING', color: '#8B5CF6' },
  { id: 'tools', label: '🔧 TOOLS & AUTOMATION', color: '#FF6B35' },
  { id: 'opensource', label: '🌐 OPEN SOURCE', color: '#FFD700' },
];

export const ADMIN_CODE = import.meta.env.VITE_ADMIN_CODE || 'vortech';
