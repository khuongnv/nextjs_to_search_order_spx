'use client';

import { TrackingRecord, SLSTrackingInfo } from '@/types';
import { Clock, MapPin, Package, CheckCircle, AlertCircle } from 'lucide-react';

interface TrackingTimelineProps {
  trackingInfo: SLSTrackingInfo;
}

export default function TrackingTimeline({ trackingInfo }: TrackingTimelineProps) {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getStatusIcon = (trackingCode: string, displayFlag: number, displayFlagV2: number) => {
    // Hiển thị icon dựa trên display_flag và display_flag_v2
    if (displayFlag === 1 || displayFlagV2 > 0) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return <Clock className="w-5 h-5 text-gray-400" />;
  };

  const getStatusColor = (displayFlag: number, displayFlagV2: number) => {
    // Màu sắc dựa trên cả display_flag và display_flag_v2
    if (displayFlag === 1 || displayFlagV2 > 0) {
      return 'text-green-600';
    }
    return 'text-gray-500';
  };

  const getOpacityClass = (displayFlag: number, displayFlagV2: number) => {
    // Độ mờ dựa trên trạng thái hiển thị
    if (displayFlag === 0 && displayFlagV2 === 0) {
      return 'opacity-60';
    }
    return 'opacity-100';
  };

  // Hiển thị tất cả records, sắp xếp theo thời gian
  const allRecords = trackingInfo.records.sort((a, b) => b.actual_time - a.actual_time);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Thông tin đơn hàng</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Mã vận đơn:</span>
            <span className="ml-2 text-gray-900">{trackingInfo.sls_tn}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Mã đơn hàng:</span>
            <span className="ml-2 text-gray-900">{trackingInfo.client_order_id}</span>
          </div>
          {trackingInfo.receiver_name && (
            <div>
              <span className="font-medium text-gray-600">Người nhận:</span>
              <span className="ml-2 text-gray-900">{trackingInfo.receiver_name}</span>
            </div>
          )}
          {trackingInfo.receiver_type_name && (
            <div>
              <span className="font-medium text-gray-600">Loại người nhận:</span>
              <span className="ml-2 text-gray-900">{trackingInfo.receiver_type_name}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lịch sử vận chuyển</h3>
      </div>

      <div className="space-y-0">
        {allRecords.map((record, index) => (
          <div 
            key={`${record.tracking_code}-${index}`} 
            className={`timeline-item ${getOpacityClass(record.display_flag, record.display_flag_v2)}`}
          >
            <div className="timeline-dot">
              {getStatusIcon(record.tracking_code, record.display_flag, record.display_flag_v2)}
            </div>
            
            <div className="timeline-content">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className={`font-semibold ${getStatusColor(record.display_flag, record.display_flag_v2)}`}>
                    {record.tracking_name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {record.buyer_description || record.description}
                  </p>
                  
                  {/* Hiển thị thông tin trạng thái */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      record.display_flag === 1 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      Display Flag: {record.display_flag}
                    </span>
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      record.display_flag_v2 > 0 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      Display Flag V2: {record.display_flag_v2}
                    </span>
                    <span className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      Code: {record.tracking_code}
                    </span>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500 ml-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatTime(record.actual_time)}
                  </div>
                </div>
              </div>

              {record.milestone_name && (
                <div className="mt-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {record.milestone_name}
                  </span>
                </div>
              )}

              {(record.current_location.location_name || record.next_location.location_name) && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="text-sm text-gray-600">
                      {record.current_location.location_name && (
                        <div>
                          <span className="font-medium">Vị trí hiện tại:</span> {record.current_location.location_name}
                        </div>
                      )}
                      {record.next_location.location_name && (
                        <div className="mt-1">
                          <span className="font-medium">Điểm đến tiếp theo:</span> {record.next_location.location_name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {record.reason_desc && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                    <div className="text-sm text-orange-700">
                      <span className="font-medium">Lý do:</span> {record.reason_desc}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {allRecords.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Chưa có thông tin vận chuyển</p>
        </div>
      )}
    </div>
  );
}
