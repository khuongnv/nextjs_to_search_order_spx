'use client';

import { TrackingRecord, SLSTrackingInfo } from '@/types';
import { Clock, MapPin, Package, CheckCircle, AlertCircle } from 'lucide-react';

interface TrackingTimelineProps {
  trackingInfo: SLSTrackingInfo;
}

export default function TrackingTimeline({ trackingInfo }: TrackingTimelineProps) {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
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
        <div className="space-y-2 text-sm">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="font-medium text-gray-600 min-w-[120px]">Mã vận đơn:</span>
            <span className="text-gray-900 break-all">{trackingInfo.sls_tn}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="font-medium text-gray-600 min-w-[120px]">Mã đơn hàng:</span>
            <span className="text-gray-900 break-all">{trackingInfo.client_order_id}</span>
          </div>
          {trackingInfo.receiver_name && (
            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="font-medium text-gray-600 min-w-[120px]">Người nhận:</span>
              <span className="text-gray-900 break-all">{trackingInfo.receiver_name}</span>
            </div>
          )}
          {trackingInfo.receiver_type_name && (
            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="font-medium text-gray-600 min-w-[120px]">Loại người nhận:</span>
              <span className="text-gray-900 break-all">{trackingInfo.receiver_type_name}</span>
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
              {/* Ngày tháng - hiển thị trên cùng */}
              <div className="mb-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">{formatTime(record.actual_time)}</span>
                </div>
              </div>
              
              {/* Tiêu đề trạng thái */}
              <div className="mb-2">
                <h4 className={`font-semibold ${getStatusColor(record.display_flag, record.display_flag_v2)}`}>
                  {record.tracking_name}
                </h4>
              </div>
              
              
              {/* Mô tả */}
              <div className="mb-2">
                <p className="text-sm text-gray-600">
                  {record.buyer_description || record.description}
                </p>
              </div>
              
              {/* Hiển thị thông tin trạng thái */}
              <div className="mb-2">
                <div className="flex flex-wrap gap-2">
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
