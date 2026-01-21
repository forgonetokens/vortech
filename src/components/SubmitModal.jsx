import { useState } from 'react';

export function SubmitModal({ isOpen, onClose, onSubmit, categories }) {
  const [formData, setFormData] = useState({
    submitter: '',
    title: '',
    description: '',
    categories: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.submitter.trim() || !formData.title.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit(formData);
      setSuccess(true);
      setTimeout(() => {
        setFormData({ submitter: '', title: '', description: '', categories: [] });
        setSuccess(false);
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error submitting idea:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleCategory = (catId) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(catId)
        ? prev.categories.filter((id) => id !== catId)
        : [...prev.categories, catId],
    }));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 modal-backdrop"
      onClick={onClose}
    >
      <div
        className={`bg-slate-800 rounded-xl w-full max-w-lg p-6 modal-content ${
          success ? 'success-pulse' : ''
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {success ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-xl font-semibold text-white">Idea Submitted!</h2>
            <p className="text-slate-400 mt-2">Thanks for your contribution</p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-white mb-4">
              Submit New Idea
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Your Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.submitter}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, submitter: e.target.value }))
                  }
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Idea Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="What's your idea?"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe your idea in more detail..."
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Categories (optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        formData.categories.includes(cat.id)
                          ? 'ring-2 ring-offset-2 ring-offset-slate-800'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: `${cat.color}30`,
                        color: cat.color,
                        ringColor: cat.color,
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !formData.submitter.trim() || !formData.title.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  {submitting ? 'Submitting...' : 'Submit Idea'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
