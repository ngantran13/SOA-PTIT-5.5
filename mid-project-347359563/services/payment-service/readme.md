# Payment Service
 
 ## Overview
 **Payment Service** là một microservice được xây dựng để xử lý thanh toán đặt vé xem phim của khách hàng. Trong quá trình khách hàng thanh toán thì payment có 3 trạng thái pending, completed, failed tương ứng với đang thanh toán, thanh toán thành công, thanh toán thất bại. 
 - Đối với trạng thái `pending` thì hóa đơn được tạo mới trước khi chuyển đến bước thanh toán có trạng thái `pending` và các ghế được đặt có trạng thái `reserved`
 - Đối với trạng thái `completed` thì `Payment Service` sẽ gửi message có event `PAYMENT_NOTIFICATION` có status ` success` qua queue `booking_ticket_queue` đến `Booking Ticket Service` để hóa đơn tương ứng chuyển trạng thái thành `completed`, qua queue `seat_queue` đến `Seat Service` để các ghế được đặt chuyển trạng thái thành `booked` và qua queue `notification_queue` đến `Notification Service` để gửi thông báo cho khách hàng.
 - Đối với trạng thái `canceled` thì `Payment Service` sẽ gửi message có event `PAYMENT_NOTIFICATION` có status ` fail` qua queue `booking_ticket_queue` đến `Booking Ticket Service` để hóa đơn tương ứng chuyển trạng thái thành `canceled`, qua queue `seat_queue` đến `Seat Service` để các ghế được đặt chuyển trạng thái thành `available` và queue `notification_queue` đến `Notification Service` để gửi thông báo cho khách hàng.
 
 ## Setup
 - Dịch vụ được đóng gói và xây dựng thông qua `Dockerfile` đi kèm.
 - Source code trong `app/` folder.

 ## Environment Variables
    File `.env` đã được cung cấp sẵn trong thư mục gốc. Tuy nhiên, bạn **nên kiểm tra và chỉnh sửa** lại thông tin kết nối cho phù hợp với môi trường của mình.

    Cấu trúc file .env gồm các biến sau:
      DATABASE_URL=mysql+pymysql://root:your_password@mysql:3306/payment_service
      VNP_TMN_CODE=your_vnp_tmn_code
      VNP_HASH_SECRET=your_hash_secret
      VNP_URL='https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
      VNP_RETURN_URL='http://localhost:8005/api/payments/pay/payment_return'
      FRONTEND_URL='http://localhost:3000'
      RABBITMQ_URL=rabbitmq

 ## Development
 - Định nghĩa API theo file OpenAPI: `docs/api-specs/payment_service.yaml`.
 
 ## Endpoints
 - URL: `http://localhost:8005/`
