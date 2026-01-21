import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DEFAULT_CATEGORIES } from '../lib/constants';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeCategories = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'categories'));
        if (snapshot.empty) {
          // Seed default categories
          for (const category of DEFAULT_CATEGORIES) {
            await setDoc(doc(db, 'categories', category.id), {
              label: category.label,
              color: category.color,
            });
          }
        }
      } catch (err) {
        console.error('Error initializing categories:', err);
      }
    };

    initializeCategories();

    const unsubscribe = onSnapshot(
      collection(db, 'categories'),
      (snapshot) => {
        const categoriesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching categories:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addCategory = async ({ label, color }) => {
    try {
      const docRef = await addDoc(collection(db, 'categories'), {
        label,
        color,
      });
      return docRef.id;
    } catch (err) {
      console.error('Error adding category:', err);
      throw err;
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      await deleteDoc(doc(db, 'categories', categoryId));
    } catch (err) {
      console.error('Error deleting category:', err);
      throw err;
    }
  };

  const getCategoryById = (categoryId) => {
    return categories.find((c) => c.id === categoryId);
  };

  return {
    categories,
    loading,
    error,
    addCategory,
    deleteCategory,
    getCategoryById,
  };
}
