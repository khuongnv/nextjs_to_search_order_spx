'use client';

import { useState } from 'react';
import { Search, Package, Clock, X, History } from 'lucide-react';
import { useSearchHistory } from '@/hooks/useSearchHistory';

interface OrderSearchProps {
  onSearch: (orderId: string) => void;
  loading: boolean;
}

export default function OrderSearch({ onSearch, loading }: OrderSearchProps) {
  const [orderId, setOrderId] = useState('');
  const { removeFromHistory, history } = useSearchHistory();
  
  // Top 5 lịch sử gần nhất để hiển thị bên ngoài
  const top5History = history.filter(item => item.success).slice(0, 5);

  // Hàm tính thời gian đã trôi qua
  const getTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    return `${days} ngày trước`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      onSearch(orderId.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderId(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setOrderId(suggestion);
    onSearch(suggestion);
  };

  const handleRemoveSuggestion = (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    removeFromHistory(orderId);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <Package className="w-8 h-8 text-shopee-orange" />
        <h1 className="text-2xl font-bold text-gray-900">Tra cứu đơn hàng</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-2">
            Mã đơn hàng
          </label>
          <div className="relative">
            <input
              type="text"
              id="orderId"
              value={orderId}
              onChange={handleInputChange}
              placeholder="Nhập mã đơn hàng"
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shopee-orange focus:border-transparent outline-none transition-all"
              disabled={loading}
              autoComplete="off"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading || !orderId.trim()}
          className="w-full bg-shopee-orange text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Đang tìm kiếm...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Tra cứu đơn hàng
            </>
          )}
        </button>
      </form>

      {/* Top 5 Lịch sử tìm kiếm */}
      {top5History.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-gray-500" />
              <h3 className="text-sm font-medium text-gray-700">Lịch sử tìm kiếm gần đây</h3>
            </div>
            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
              {top5History.length} mục
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {top5History.map((item, index) => {
              const timeAgo = getTimeAgo(item.timestamp);
              return (
                <button
                  key={`${item.orderId}-${index}`}
                  onClick={() => handleSuggestionClick(item.orderId)}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm rounded-lg border border-gray-200 transition-all group hover:shadow-sm"
                >
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div className="flex flex-col items-start">
                    <span className="font-mono text-xs font-medium">{item.orderId}</span>
                    <span className="text-xs text-gray-400">{timeAgo}</span>
                  </div>
                  <button
                    onClick={(e) => handleRemoveSuggestion(e, item.orderId)}
                    className="p-1 hover:bg-gray-200 rounded ml-1 transition-colors"
                    title="Xóa khỏi lịch sử"
                  >
                    <X className="w-3 h-3 text-gray-400 hover:text-red-500" />
                  </button>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
