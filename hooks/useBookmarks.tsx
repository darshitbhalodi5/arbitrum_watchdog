import { useState, useEffect, useCallback } from 'react';

// Generic type for the bookmarked item
interface BookmarkItem {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// Custom hook for managing bookmarks with localStorage persistence
export function useBookmarks<T extends BookmarkItem>(
  storageKey: string, 
  initialBookmarks: T[] = []
) {
  // Use a state to store bookmarked items
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => {
    try {
      // Try to retrieve bookmarks from localStorage on initial load
      const savedBookmarks = localStorage.getItem(storageKey);
      return savedBookmarks 
        ? new Set(JSON.parse(savedBookmarks)) 
        : new Set(initialBookmarks.map(item => item.id));
    } catch (error) {
      console.error('Error loading bookmarks from localStorage:', error);
      return new Set(initialBookmarks.map(item => item.id));
    }
  });

  // Effect to save bookmarks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(bookmarks)));
    } catch (error) {
      console.error('Error saving bookmarks to localStorage:', error);
    }
  }, [bookmarks, storageKey]);

  // Method to toggle bookmark status
  const toggleBookmark = useCallback((id: string) => {
    setBookmarks(prev => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(id)) {
        newBookmarks.delete(id);
      } else {
        newBookmarks.add(id);
      }
      return newBookmarks;
    });
  }, []);

  // Method to check if an item is bookmarked
  const isBookmarked = useCallback((id: string) => {
    return bookmarks.has(id);
  }, [bookmarks]);

  // Method to clear all bookmarks
  const clearBookmarks = useCallback(() => {
    setBookmarks(new Set());
  }, []);

  return {
    bookmarks,
    toggleBookmark,
    isBookmarked,
    clearBookmarks
  };
}