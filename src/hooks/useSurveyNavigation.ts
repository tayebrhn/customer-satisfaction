
import { useState, useEffect } from 'react';
import { PAGE_KEY } from '../constants/survey';

export const useSurveyNavigation = (totalCategories: number) => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  // Restore saved page
  useEffect(() => {
    const savedPage = localStorage.getItem(PAGE_KEY);
    if (savedPage) {
      setCurrentCategoryIndex(parseInt(savedPage, 10));
    }
  }, []);

  // Auto-save current page
  useEffect(() => {
    localStorage.setItem(PAGE_KEY, String(currentCategoryIndex));
  }, [currentCategoryIndex]);

  const nextCategory = () => {
    setCurrentCategoryIndex(prev => Math.min(prev + 1, totalCategories - 1));
  };

  const prevCategory = () => {
    setCurrentCategoryIndex(prev => Math.max(prev - 1, 0));
  };

  const progress = ((currentCategoryIndex + 1) / totalCategories) * 100;
  const isFirstPage = currentCategoryIndex === 0;
  const isLastPage = currentCategoryIndex === totalCategories - 1; // ✅ fixed

  const clearPageData = () => {
    localStorage.removeItem(PAGE_KEY);
  };

  return {
    currentCategoryIndex,
    nextCategory,
    prevCategory,
    progress,
    isFirstPage,
    isLastPage,
    clearPageData
  };
};