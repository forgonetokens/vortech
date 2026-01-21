import { useState } from 'react';
import { STAGES } from '../lib/constants';

export function IdeaModal({
  idea,
  categories,
  isAdmin,
  onClose,
  onMoveStage,
  onSetBlocked,
  onAddNote,
  onDeleteNote,
  onAddCategory,
  onRemoveCategory,
  onDeleteIdea,
}) {
  const [noteText, setNoteText] = useState('');
  const [noteAuthor, setNoteAuthor] = useState('');
  const [blockedReason, setBlockedReason] = useState(idea?.blockedReason || '');
  const [showBlockedInput, setShowBlockedInput] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!idea) return null;

  const stage = STAGES.find((s) => s.id === idea.stage) || STAGES[0];
  const ideaCategories = (idea.categories || [])
    .map((catId) => categories.find((c) => c.id === catId))
    .filter(Boolean);
  const availableCategories = categories.filter(
    (c) => !idea.categories?.includes(c.id)
  );

  const handleAddNote = async () => {
    if (!noteText.trim() || !noteAuthor.trim()) return;
    await onAddNote(idea.id, noteText, noteAuthor);
    setNoteText('');
    setNoteAuthor('');
  };

  const handleToggleBlocked = async () => {
    if (idea.blocked) {
      await onSetBlocked(idea.id, false, '');
      setBlockedReason('');
    } else {
      setShowBlockedInput(true);
    }
  };

  const handleSetBlocked = async () => {
    await onSetBlocked(idea.id, true, blockedReason);
    setShowBlockedInput(false);
  };

  const handleDelete = async () => {
    if (confirmDelete) {
      await onDeleteIdea(idea.id);
      onClose();
    } else {
      setConfirmDelete(true);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 modal-backdrop overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-xl w-full max-w-2xl my-8 modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white mb-2">
                {idea.title}
              </h2>
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: `${stage.color}20`,
                    color: stage.color,
                  }}
                >
                  {stage.emoji} {stage.label}
                </span>
                {idea.blocked && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-400">
                    🚩 Blocked
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Description */}
          {idea.description && (
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">
                Description
              </h3>
              <p className="text-slate-200 whitespace-pre-wrap">
                {idea.description}
              </p>
            </div>
          )}

          {/* Blocked Reason */}
          {idea.blocked && idea.blockedReason && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <h3 className="text-sm font-medium text-red-400 mb-1">
                Blocked Reason
              </h3>
              <p className="text-red-300">{idea.blockedReason}</p>
            </div>
          )}

          {/* Categories */}
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-2">
              Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {ideaCategories.map((cat) => (
                <span
                  key={cat.id}
                  className="px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-2"
                  style={{
                    backgroundColor: `${cat.color}20`,
                    color: cat.color,
                  }}
                >
                  {cat.label}
                  {isAdmin && (
                    <button
                      onClick={() => onRemoveCategory(idea.id, cat.id)}
                      className="hover:opacity-70"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
              {ideaCategories.length === 0 && (
                <span className="text-slate-500 text-sm">No categories</span>
              )}
            </div>
            {isAdmin && availableCategories.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-slate-500 mb-2">Add category:</p>
                <div className="flex flex-wrap gap-2">
                  {availableCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => onAddCategory(idea.id, cat.id)}
                      className="px-2 py-1 rounded-full text-xs font-medium opacity-50 hover:opacity-100 transition-opacity"
                      style={{
                        backgroundColor: `${cat.color}20`,
                        color: cat.color,
                      }}
                    >
                      + {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <span>Submitted by: <span className="text-white">{idea.submitter}</span></span>
            {idea.createdAt && (
              <span>
                {new Date(idea.createdAt.seconds * 1000).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-3">
              Notes ({(idea.notes || []).length})
            </h3>
            <div className="space-y-3">
              {(idea.notes || []).map((note) => (
                <div
                  key={note.id}
                  className="bg-slate-700/50 rounded-lg p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-slate-200 text-sm">{note.text}</p>
                    {isAdmin && (
                      <button
                        onClick={() => onDeleteNote(idea.id, note.id)}
                        className="text-slate-500 hover:text-red-400 text-sm flex-shrink-0"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    <span>{note.author}</span>
                    <span>{new Date(note.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Note Form (Admin only) */}
            {isAdmin && (
              <div className="mt-4 space-y-2">
                <input
                  type="text"
                  value={noteAuthor}
                  onChange={(e) => setNoteAuthor(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add a note..."
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && noteText.trim() && noteAuthor.trim()) {
                        handleAddNote();
                      }
                    }}
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!noteText.trim() || !noteAuthor.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <div className="p-6 border-t border-slate-700 space-y-4">
            {/* Move Stage */}
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">
                Move to Stage
              </h3>
              <div className="flex flex-wrap gap-2">
                {STAGES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onMoveStage(idea.id, s.id)}
                    disabled={s.id === idea.stage}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      s.id === idea.stage
                        ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                        : 'hover:opacity-80'
                    }`}
                    style={
                      s.id !== idea.stage
                        ? { backgroundColor: `${s.color}30`, color: s.color }
                        : {}
                    }
                  >
                    {s.emoji} {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Block/Unblock */}
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">
                Status
              </h3>
              {showBlockedInput ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={blockedReason}
                    onChange={(e) => setBlockedReason(e.target.value)}
                    placeholder="Reason for blocking..."
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    autoFocus
                  />
                  <button
                    onClick={handleSetBlocked}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                  >
                    Block
                  </button>
                  <button
                    onClick={() => setShowBlockedInput(false)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleToggleBlocked}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    idea.blocked
                      ? 'bg-green-600/20 hover:bg-green-600/30 text-green-400'
                      : 'bg-red-600/20 hover:bg-red-600/30 text-red-400'
                  }`}
                >
                  {idea.blocked ? '✓ Unblock Idea' : '🚩 Flag as Blocked'}
                </button>
              )}
            </div>

            {/* Delete */}
            <div>
              <button
                onClick={handleDelete}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  confirmDelete
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-red-400'
                }`}
              >
                {confirmDelete ? 'Click again to confirm delete' : 'Delete Idea'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
