import { useState } from 'react';
import { STAGES } from '../lib/constants';
import { IdeaCard } from './IdeaCard';

export function CategoryView({ ideas, categories, onIdeaClick, isAdmin, onAddCategory }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ label: '', color: '#6366F1' });

  const getCategoryStats = (categoryId) => {
    const categoryIdeas = ideas.filter((i) =>
      i.categories?.includes(categoryId)
    );
    const stageBreakdown = STAGES.map((stage) => ({
      ...stage,
      count: categoryIdeas.filter((i) => i.stage === stage.id).length,
    }));
    return {
      total: categoryIdeas.length,
      blocked: categoryIdeas.filter((i) => i.blocked).length,
      stageBreakdown,
    };
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.label.trim()) return;
    await onAddCategory(newCategory);
    setNewCategory({ label: '', color: '#6366F1' });
    setShowAddForm(false);
  };

  if (selectedCategory) {
    const category = categories.find((c) => c.id === selectedCategory);
    const categoryIdeas = ideas.filter((i) =>
      i.categories?.includes(selectedCategory)
    );

    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-slate-900 border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-2 text-slate-400 hover:text-white mb-3 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Categories
            </button>
            <div className="flex items-center gap-3">
              <span
                className="px-4 py-2 rounded-lg text-lg font-medium"
                style={{
                  backgroundColor: `${category?.color}30`,
                  color: category?.color,
                }}
              >
                {category?.label}
              </span>
              <span className="text-slate-400">
                {categoryIdeas.length} idea{categoryIdeas.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Ideas List */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="max-w-7xl mx-auto">
            {categoryIdeas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400">No ideas in this category</p>
              </div>
            ) : (
              <div className="space-y-3">
                {categoryIdeas
                  .sort((a, b) => {
                    const aTime = a.createdAt?.seconds || 0;
                    const bTime = b.createdAt?.seconds || 0;
                    return bTime - aTime;
                  })
                  .map((idea) => {
                    const stage = STAGES.find((s) => s.id === idea.stage);
                    return (
                      <div
                        key={idea.id}
                        onClick={() => onIdeaClick(idea)}
                        className="bg-slate-800 rounded-lg p-4 cursor-pointer hover:bg-slate-750 transition-all flex items-center gap-4"
                      >
                        <div
                          className="w-2 h-12 rounded-full flex-shrink-0"
                          style={{ backgroundColor: stage?.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-white truncate">
                              {idea.title}
                            </h3>
                            {idea.blocked && <span className="text-red-400">🚩</span>}
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <span
                              className="px-2 py-0.5 rounded text-xs"
                              style={{
                                backgroundColor: `${stage?.color}20`,
                                color: stage?.color,
                              }}
                            >
                              {stage?.emoji} {stage?.label}
                            </span>
                            <span className="text-slate-500">by {idea.submitter}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const stats = getCategoryStats(category.id);
            const maxCount = Math.max(...stats.stageBreakdown.map((s) => s.count), 1);

            return (
              <div
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="bg-slate-800 rounded-xl p-5 cursor-pointer hover:bg-slate-750 transition-all border-2 border-transparent hover:border-slate-600"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: category.color }}
                  >
                    {category.label}
                  </h3>
                  <div className="flex items-center gap-2">
                    {stats.blocked > 0 && (
                      <span className="text-red-400 text-sm">🚩{stats.blocked}</span>
                    )}
                    <span className="px-2 py-1 bg-slate-700 rounded-lg text-sm text-slate-300">
                      {stats.total}
                    </span>
                  </div>
                </div>

                {/* Mini Progress Bar */}
                <div className="space-y-1.5">
                  {stats.stageBreakdown.map((stage) => (
                    <div key={stage.id} className="flex items-center gap-2">
                      <span className="text-xs w-6">{stage.emoji}</span>
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${(stage.count / maxCount) * 100}%`,
                            backgroundColor: stage.color,
                            minWidth: stage.count > 0 ? '8px' : '0',
                          }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 w-4 text-right">
                        {stage.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Add Category Card (Admin only) */}
          {isAdmin && (
            <div
              onClick={() => setShowAddForm(true)}
              className="bg-slate-800/50 rounded-xl p-5 cursor-pointer hover:bg-slate-800 transition-all border-2 border-dashed border-slate-600 hover:border-slate-500 flex items-center justify-center min-h-[200px]"
            >
              <div className="text-center">
                <div className="text-3xl mb-2">+</div>
                <p className="text-slate-400">Add Category</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddForm && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 modal-backdrop"
          onClick={() => setShowAddForm(false)}
        >
          <div
            className="bg-slate-800 rounded-xl w-full max-w-md p-6 modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-white mb-4">
              Add New Category
            </h2>
            <form onSubmit={handleAddCategory}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Category Label
                </label>
                <input
                  type="text"
                  value={newCategory.label}
                  onChange={(e) =>
                    setNewCategory((prev) => ({ ...prev, label: e.target.value }))
                  }
                  placeholder="e.g., 📊 Analytics"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Color
                </label>
                <div className="flex gap-2">
                  {['#EC4899', '#8B5CF6', '#10B981', '#F59E0B', '#6366F1', '#06B6D4', '#EF4444'].map(
                    (color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() =>
                          setNewCategory((prev) => ({ ...prev, color }))
                        }
                        className={`w-8 h-8 rounded-full transition-transform ${
                          newCategory.color === color
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-800 scale-110'
                            : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    )
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newCategory.label.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
