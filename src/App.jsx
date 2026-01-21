import { useState } from 'react';
import { Header } from './components/Header';
import { PipelineView } from './components/PipelineView';
import { CategoryView } from './components/CategoryView';
import { IdeaModal } from './components/IdeaModal';
import { SubmitModal } from './components/SubmitModal';
import { AdminPrompt } from './components/AdminPrompt';
import { useIdeas } from './hooks/useIdeas';
import { useCategories } from './hooks/useCategories';
import { useAdmin } from './hooks/useAdmin';

function App() {
  const [view, setView] = useState('pipeline');
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);

  const {
    ideas,
    loading: ideasLoading,
    error: ideasError,
    addIdea,
    moveIdea,
    setBlocked,
    addNote,
    deleteNote,
    addCategory: addIdeaCategory,
    removeCategory: removeIdeaCategory,
    deleteIdea,
  } = useIdeas();

  const {
    categories,
    loading: categoriesLoading,
    addCategory: createCategory,
  } = useCategories();

  const { isAdmin, login, logout } = useAdmin();

  const loading = ideasLoading || categoriesLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading ideas...</p>
        </div>
      </div>
    );
  }

  if (ideasError) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Connection Error
          </h2>
          <p className="text-slate-400 mb-4">
            Unable to connect to the database. Please check your Firebase
            configuration.
          </p>
          <p className="text-sm text-red-400 bg-red-500/10 rounded-lg p-3">
            {ideasError}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Header
        view={view}
        setView={setView}
        isAdmin={isAdmin}
        onAdminClick={() => setShowAdminPrompt(true)}
        onLogout={logout}
        onSubmitClick={() => setShowSubmitModal(true)}
      />

      <main className="flex-1 flex flex-col">
        {view === 'pipeline' ? (
          <PipelineView
            ideas={ideas}
            categories={categories}
            onIdeaClick={setSelectedIdea}
          />
        ) : (
          <CategoryView
            ideas={ideas}
            categories={categories}
            onIdeaClick={setSelectedIdea}
            isAdmin={isAdmin}
            onAddCategory={createCategory}
          />
        )}
      </main>

      {/* Modals */}
      <IdeaModal
        idea={selectedIdea}
        categories={categories}
        isAdmin={isAdmin}
        onClose={() => setSelectedIdea(null)}
        onMoveStage={moveIdea}
        onSetBlocked={setBlocked}
        onAddNote={addNote}
        onDeleteNote={deleteNote}
        onAddCategory={addIdeaCategory}
        onRemoveCategory={removeIdeaCategory}
        onDeleteIdea={deleteIdea}
      />

      <SubmitModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSubmit={addIdea}
        categories={categories}
      />

      <AdminPrompt
        isOpen={showAdminPrompt}
        onClose={() => setShowAdminPrompt(false)}
        onLogin={login}
      />
    </div>
  );
}

export default App;
