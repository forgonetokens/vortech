import { useState, useEffect, useRef } from 'react';
import { STAGES } from '../lib/constants';
import { IdeaCard } from './IdeaCard';

export function PipelineView({ ideas, categories, onIdeaClick }) {
  const [activeStage, setActiveStage] = useState('new');
  const [touchStart, setTouchStart] = useState(null);
  const containerRef = useRef(null);

  const stageIdeas = ideas.filter((idea) => idea.stage === activeStage);
  const activeStageIndex = STAGES.findIndex((s) => s.id === activeStage);
  const blockedCount = (stageId) =>
    ideas.filter((i) => i.stage === stageId && i.blocked).length;

  const goToStage = (direction) => {
    const newIndex = activeStageIndex + direction;
    if (newIndex >= 0 && newIndex < STAGES.length) {
      setActiveStage(STAGES[newIndex].id);
    }
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      goToStage(diff > 0 ? 1 : -1);
    }
    setTouchStart(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Stage Tabs */}
      <div className="sticky top-0 z-30 bg-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
            {STAGES.map((stage) => {
              const count = ideas.filter((i) => i.stage === stage.id).length;
              const blocked = blockedCount(stage.id);
              const isActive = activeStage === stage.id;

              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(stage.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  style={
                    isActive
                      ? { backgroundColor: `${stage.color}30`, color: stage.color }
                      : {}
                  }
                >
                  <span>{stage.emoji}</span>
                  <span className="font-medium">{stage.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      isActive ? 'bg-white/20' : 'bg-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                  {blocked > 0 && (
                    <span className="text-red-400 text-sm">🚩{blocked}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Arrows (Desktop) */}
      <div className="hidden md:flex items-center justify-between px-4 py-2 max-w-7xl mx-auto w-full">
        <button
          onClick={() => goToStage(-1)}
          disabled={activeStageIndex === 0}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {activeStageIndex > 0 && STAGES[activeStageIndex - 1].label}
        </button>
        <button
          onClick={() => goToStage(1)}
          disabled={activeStageIndex === STAGES.length - 1}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          {activeStageIndex < STAGES.length - 1 &&
            STAGES[activeStageIndex + 1].label}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Ideas Grid */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-4"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="max-w-7xl mx-auto">
          {stageIdeas.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">{STAGES[activeStageIndex].emoji}</div>
              <p className="text-slate-400">No ideas in this stage yet</p>
              <p className="text-slate-500 text-sm mt-1">
                {activeStage === 'new'
                  ? 'Submit a new idea to get started!'
                  : 'Move ideas from previous stages'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stageIdeas
                .sort((a, b) => {
                  // Blocked items first, then by date
                  if (a.blocked !== b.blocked) return b.blocked - a.blocked;
                  const aTime = a.createdAt?.seconds || 0;
                  const bTime = b.createdAt?.seconds || 0;
                  return bTime - aTime;
                })
                .map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    categories={categories}
                    onClick={() => onIdeaClick(idea)}
                  />
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile swipe hint */}
      <div className="md:hidden text-center py-2 text-xs text-slate-500">
        Swipe left or right to navigate stages
      </div>
    </div>
  );
}
