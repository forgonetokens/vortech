import { useState } from 'react';

export function Header({
  view,
  setView,
  isAdmin,
  onAdminClick,
  onLogout,
  onSubmitClick,
}) {
  return (
    <header className="sticky top-0 z-40 bg-[#0F1D32] border-b border-[#1E3A5F]">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0A1628] border border-[#00D9FF] rounded flex items-center justify-center font-bold text-[#00D9FF] text-sm"
                 style={{ boxShadow: '0 0 15px rgba(0, 217, 255, 0.3)' }}>
              VT
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#00D9FF] tracking-wider" style={{ textShadow: '0 0 10px rgba(0, 217, 255, 0.5)' }}>VORTECH</h1>
              <p className="text-xs text-[#4A6B8A] uppercase tracking-widest">Mission Control</p>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-[#0A1628] rounded p-1 border border-[#1E3A5F]">
            <button
              onClick={() => setView('pipeline')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors uppercase tracking-wider ${
                view === 'pipeline'
                  ? 'bg-[#00D9FF]/20 text-[#00D9FF]'
                  : 'text-[#4A6B8A] hover:text-[#E0F4FF]'
              }`}
            >
              Pipeline
            </button>
            <button
              onClick={() => setView('category')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors uppercase tracking-wider ${
                view === 'category'
                  ? 'bg-[#00D9FF]/20 text-[#00D9FF]'
                  : 'text-[#4A6B8A] hover:text-[#E0F4FF]'
              }`}
            >
              Categories
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSubmitClick}
              className="px-4 py-2 bg-[#00D9FF]/20 hover:bg-[#00D9FF]/30 text-[#00D9FF] text-sm font-medium rounded transition-colors border border-[#00D9FF]/50 uppercase tracking-wider"
            >
              + New Objective
            </button>
            {isAdmin ? (
              <button
                onClick={onLogout}
                className="px-3 py-2 bg-[#FF6B35]/20 hover:bg-[#FF6B35]/30 text-[#FF6B35] text-sm font-medium rounded transition-colors border border-[#FF6B35]/50 uppercase tracking-wider"
              >
                Exit Admin
              </button>
            ) : (
              <button
                onClick={onAdminClick}
                className="px-3 py-2 bg-[#132238] hover:bg-[#1E3A5F] text-[#4A6B8A] text-sm font-medium rounded transition-colors border border-[#1E3A5F] uppercase tracking-wider"
              >
                Admin
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
