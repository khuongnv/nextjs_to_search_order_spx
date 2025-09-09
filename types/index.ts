export interface TrackingRecord {
  tracking_code: string;
  tracking_name: string;
  description: string;
  display_flag: number;
  actual_time: number;
  reason_code: string;
  reason_desc: string;
  epod: string;
  pin_code: string;
  current_location: {
    location_name: string;
    location_type_name: string;
    lng: string;
    lat: string;
    full_address: string;
  };
  next_location: {
    location_name: string;
    location_type_name: string;
    lng: string;
    lat: string;
    full_address: string;
  };
  display_flag_v2: number;
  buyer_description: string;
  seller_description: string;
  milestone_code: number;
  milestone_name: string;
}

export interface SLSTrackingInfo {
  sls_tn: string;
  client_order_id: string;
  receiver_name: string;
  receiver_type_name: string;
  records: TrackingRecord[];
}

export interface FulfillmentInfo {
  deliver_type: number;
}

export interface OrderData {
  fulfillment_info: FulfillmentInfo;
  sls_tracking_info: SLSTrackingInfo;
  is_instant_order: boolean;
  is_shopee_market_order: boolean;
}

export interface APIResponse {
  retcode: number;
  data: OrderData;
  message: string;
  detail: string;
  debug: string;
}
