'use client';

import { useState, useEffect } from 'react';

interface SearchHistoryItem {
  orderId: string;
  timestamp: number;
  success: boolean;
}

const STORAGE_KEY = 'shopee-search-history';
const MAX_HISTORY = 20; // Giới hạn tối đa 20 lịch sử

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  // Load history từ localStorage khi component mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      console.log('Loading history from localStorage:', stored);
      if (stored) {
        const parsedHistory = JSON.parse(stored);
        console.log('Parsed history:', parsedHistory);
        setHistory(parsedHistory);
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  }, []);

  // Lưu history vào localStorage
  const saveHistory = (orderId: string, success: boolean) => {
    console.log('Saving history:', { orderId, success });
    const newItem: SearchHistoryItem = {
      orderId,
      timestamp: Date.now(),
      success,
    };

    setHistory(prevHistory => {
      // Loại bỏ item cũ nếu đã tồn tại
      const filteredHistory = prevHistory.filter(item => item.orderId !== orderId);
      
      // Thêm item mới vào đầu danh sách
      const newHistory = [newItem, ...filteredHistory].slice(0, MAX_HISTORY);
      
      console.log('New history:', newHistory);
      
      // Lưu vào localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
        console.log('History saved to localStorage');
      } catch (error) {
        console.error('Error saving search history:', error);
      }
      
      return newHistory;
    });
  };

  // Xóa một item khỏi history
  const removeFromHistory = (orderId: string) => {
    setHistory(prevHistory => {
      const newHistory = prevHistory.filter(item => item.orderId !== orderId);
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      } catch (error) {
        console.error('Error updating search history:', error);
      }
      
      return newHistory;
    });
  };

  // Xóa toàn bộ history
  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  };

  // Lấy danh sách gợi ý (chỉ các tìm kiếm thành công)
  const getSuggestions = (query: string = '') => {
    const suggestions = history
      .filter(item => item.success && item.orderId.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10); // Giới hạn 10 gợi ý
    
    console.log('Getting suggestions:', { query, history, suggestions });
    return suggestions;
  };

  return {
    history,
    saveHistory,
    removeFromHistory,
    clearHistory,
    getSuggestions,
  };
}
