# Shopee Order Tracker

Ứng dụng web tra cứu đơn hàng Shopee với giao diện timeline đẹp mắt, được xây dựng bằng Next.js 14 và TypeScript.

## Tính năng

- 🔍 Tra cứu đơn hàng Shopee bằng mã SPX_TN
- 📱 Giao diện responsive, thân thiện với mobile
- ⏰ Hiển thị timeline vận chuyển chi tiết
- 🎨 Thiết kế đẹp mắt với Tailwind CSS
- ⚡ Tốc độ nhanh với Next.js 14
- 🔒 Type-safe với TypeScript

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy ứng dụng:
```bash
npm run dev
```

3. Mở trình duyệt và truy cập [http://localhost:3000](http://localhost:3000)

## Sử dụng

1. Nhập mã đơn hàng Shopee (SPX_TN) vào ô tìm kiếm
2. Nhấn "Tra cứu đơn hàng" để xem thông tin
3. Xem timeline vận chuyển chi tiết với thời gian thực

## API

Ứng dụng sử dụng API từ SPX Vietnam:
- Endpoint: `https://spx.vn/shipment/order/open/order/get_order_info`
- Tham số: `spx_tn` (mã đơn hàng), `language_code` (mã ngôn ngữ)

## Công nghệ sử dụng

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **App Router** - Next.js routing

## Cấu trúc dự án

```
├── app/
│   ├── api/track-order/route.ts  # API route
│   ├── globals.css               # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/
│   ├── OrderSearch.tsx          # Search component
│   └── TrackingTimeline.tsx     # Timeline component
├── types/
│   └── index.ts                 # TypeScript types
└── ...
```

## License

MIT License
