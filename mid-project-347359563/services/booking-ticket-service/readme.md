# Booking Ticket Service
 
 ## Overview
 **Booking Ticket Service** là một microservice được xây dựng để quản lý hóa đơn đặt vé xem phim của khách hàng. Mỗi hóa đơn có 3 trạng thái pending, completed, canceled tương ứng với 3 trạng thái đang trong quá trình thanh toán, đã thanh toán thành công và đã hủy khi thanh toán thất bại hoặc không thanh toán.
 - Khi trong quá trình tạo mới hóa đơn có trạng thái `pending`, `Booking Ticket Service` gửi message có event `RESERVE_SEAT_NOTIFICATION` qua queue `seat_queue` đến `Seat Service` để chuyển trạng thái của các ghế đang chọn thành `reserved`.
 - `Booking Ticket Service` nhận message có event `PAYMENT_NOTIFICATION` từ queue `booking_ticket_queue` được gửi từ `Payment Service` thì đối với status `success` sẽ chuyển trạng thái hóa đơn tương ứng thành `completed` và đối với status `fail` sẽ chuyển trạng thái của hóa đơn  thành `canceled`.

 ## Setup
 - Dịch vụ được đóng gói và xây dựng thông qua `Dockerfile` đi kèm.
 - Source code trong `app/` folder.

 ## Environment Variables
    File `.env` đã được cung cấp sẵn trong thư mục gốc. Tuy nhiên, bạn **nên kiểm tra và chỉnh sửa** lại thông tin kết nối cho phù hợp với môi trường của mình.

    Cấu trúc file .env gồm các biến sau:
      DATABASE_URL=mysql+pymysql://root:your_passwork@mysql:3306/booking_ticket_service
      CUSTOMER_SERVICE_URL=http://customer-service:8001/api
      MOVIE_SERVICE_URL=http://movie-service:8002/api
      SEAT_SERVICE_URL=http://seat-service:8003/api
      PAYMENT_SERVICE_URL=http://payment-service:8005/api
      RABBITMQ_URL=amqp://guest:guest@rabbitmq/

 ## Development
 - Định nghĩa API theo file OpenAPI: `docs/api-specs/booking_ticket_service.yaml`.
 
 ## Endpoints
 - URL: `http://localhost:8004/`
