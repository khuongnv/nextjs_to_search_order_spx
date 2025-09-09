'use client';

import { useState } from 'react';
import OrderSearch from '@/components/OrderSearch';
import TrackingTimeline from '@/components/TrackingTimeline';
import { APIResponse } from '@/types';
import { AlertCircle, Package } from 'lucide-react';
import { useSearchHistory } from '@/hooks/useSearchHistory';

export default function Home() {
  const [orderData, setOrderData] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { saveHistory } = useSearchHistory();

  const handleSearch = async (orderId: string) => {
    setLoading(true);
    setError(null);
    setOrderData(null);

    try {
      const response = await fetch(`/api/track-order?spx_tn=${encodeURIComponent(orderId)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra khi tìm kiếm đơn hàng');
      }

      if (data.retcode !== 0) {
        throw new Error(data.message || 'Không tìm thấy thông tin đơn hàng');
      }

      setOrderData(data);
      saveHistory(orderId, true); // Lưu lịch sử tìm kiếm thành công
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      saveHistory(orderId, false); // Lưu lịch sử tìm kiếm thất bại
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Search Component */}
        <OrderSearch onSearch={handleSearch} loading={loading} />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div>
                <h3 className="font-medium text-red-800">Lỗi</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {orderData && orderData.data.sls_tracking_info && (
          <TrackingTimeline trackingInfo={orderData.data.sls_tracking_info} />
        )}

        {/* No Results */}
        {orderData && !orderData.data.sls_tracking_info && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy thông tin vận chuyển
            </h3>
            <p className="text-gray-600">
              Đơn hàng này chưa có thông tin vận chuyển hoặc mã đơn hàng không đúng.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>
            @2025 - khuongnv
          </p>
        </div>
      </div>
    </div>
  );
}
