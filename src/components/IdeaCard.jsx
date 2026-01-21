import { STAGES } from '../lib/constants';

export function IdeaCard({ idea, categories, onClick }) {
  const stage = STAGES.find((s) => s.id === idea.stage) || STAGES[0];
  const ideaCategories = (idea.categories || [])
    .map((catId) => categories.find((c) => c.id === catId))
    .filter(Boolean);
  const displayCategories = ideaCategories.slice(0, 2);
  const remainingCount = ideaCategories.length - 2;
  const noteCount = (idea.notes || []).length;

  return (
    <div
      onClick={onClick}
      className={`bg-slate-800 rounded-lg p-4 cursor-pointer hover:bg-slate-750 transition-all border-l-4 ${
        idea.blocked ? 'blocked-glow' : ''
      }`}
      style={{ borderLeftColor: stage.color }}
    >
      {/* Header with title and flags */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-medium text-white line-clamp-2">{idea.title}</h3>
        <div className="flex items-center gap-1 flex-shrink-0">
          {idea.blocked && (
            <span className="text-red-400" title="Blocked">
              🚩
            </span>
          )}
          {noteCount > 0 && (
            <span className="text-slate-400 text-sm" title={`${noteCount} notes`}>
              📝 {noteCount}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {idea.description && (
        <p className="text-slate-400 text-sm line-clamp-2 mb-3">
          {idea.description}
        </p>
      )}

      {/* Categories */}
      {ideaCategories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {displayCategories.map((cat) => (
            <span
              key={cat.id}
              className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${cat.color}20`,
                color: cat.color,
              }}
            >
              {cat.label}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-400">
              +{remainingCount}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>by {idea.submitter}</span>
        {idea.createdAt && (
          <span>
            {new Date(idea.createdAt.seconds * 1000).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}
