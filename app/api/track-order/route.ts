import { NextRequest, NextResponse } from 'next/server';
import { APIResponse } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const spx_tn = searchParams.get('spx_tn');
  const language_code = searchParams.get('language_code') || 'vi';

  if (!spx_tn) {
    return NextResponse.json(
      { error: 'Mã đơn hàng (spx_tn) là bắt buộc' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://spx.vn/shipment/order/open/order/get_order_info?spx_tn=${spx_tn}&language_code=${language_code}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: APIResponse = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching order data:', error);
    return NextResponse.json(
      { error: 'Không thể lấy thông tin đơn hàng. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
