import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useIdeas() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'ideas'),
      (snapshot) => {
        const ideasData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setIdeas(ideasData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching ideas:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addIdea = async ({ title, description, submitter, categories }) => {
    try {
      const docRef = await addDoc(collection(db, 'ideas'), {
        title,
        description: description || '',
        submitter,
        stage: 'new',
        categories: categories || [],
        blocked: false,
        blockedReason: '',
        notes: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      console.error('Error adding idea:', err);
      throw err;
    }
  };

  const updateIdea = async (ideaId, updates) => {
    try {
      await updateDoc(doc(db, 'ideas', ideaId), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error updating idea:', err);
      throw err;
    }
  };

  const deleteIdea = async (ideaId) => {
    try {
      await deleteDoc(doc(db, 'ideas', ideaId));
    } catch (err) {
      console.error('Error deleting idea:', err);
      throw err;
    }
  };

  const moveIdea = async (ideaId, newStage) => {
    await updateIdea(ideaId, { stage: newStage });
  };

  const setBlocked = async (ideaId, blocked, reason = '') => {
    await updateIdea(ideaId, { blocked, blockedReason: reason });
  };

  const addNote = async (ideaId, text, author) => {
    const note = {
      id: crypto.randomUUID(),
      text,
      author,
      date: new Date().toISOString(),
    };
    const idea = ideas.find((i) => i.id === ideaId);
    if (idea) {
      await updateIdea(ideaId, {
        notes: [...(idea.notes || []), note],
      });
    }
  };

  const deleteNote = async (ideaId, noteId) => {
    const idea = ideas.find((i) => i.id === ideaId);
    if (idea) {
      await updateIdea(ideaId, {
        notes: (idea.notes || []).filter((n) => n.id !== noteId),
      });
    }
  };

  const addCategory = async (ideaId, categoryId) => {
    await updateDoc(doc(db, 'ideas', ideaId), {
      categories: arrayUnion(categoryId),
      updatedAt: serverTimestamp(),
    });
  };

  const removeCategory = async (ideaId, categoryId) => {
    await updateDoc(doc(db, 'ideas', ideaId), {
      categories: arrayRemove(categoryId),
      updatedAt: serverTimestamp(),
    });
  };

  return {
    ideas,
    loading,
    error,
    addIdea,
    updateIdea,
    deleteIdea,
    moveIdea,
    setBlocked,
    addNote,
    deleteNote,
    addCategory,
    removeCategory,
  };
}
