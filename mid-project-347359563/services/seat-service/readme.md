# Seat Service
 
 ## Overview
 **Seat Service** là một microservice được xây dựng để quản lý các ghế xem phim của các suất chiếu trong các rạp. Mỗi ghế xem phim trong từng suất chiếu có 3 trạng thái available, reserved, booked tương ứng với 3 trạng thái chưa được đặt, đang giữ ghế khi khách hàng đang thanh toán và đã được đặt.
 - `Seat Service` nhận message có event `RESERVE_SEAT_NOTIFICATION` từ queue `seat_queue` được gửi từ `Booking Ticket Service` thì sẽ chuyển trạng thái của các ghế đang chọn thành `reserved`
 - `Seat Service` nhận message có event `PAYMENT_NOTIFICATION` từ queue `seat_queue` được gửi từ `Payment Service` thì đối với status `success` sẽ chuyển trạng thái của các ghế đang giữ chỗ thành `booked` và đối với status `fail` sẽ chuyển trạng thái của các ghế đang giữ chỗ thành `available`

 ## Setup
 - Dịch vụ được đóng gói và xây dựng thông qua `Dockerfile` đi kèm.
 - Source code trong `app/` folder.

 ## Environment Variables
    File `.env` đã được cung cấp sẵn trong thư mục gốc. Tuy nhiên, bạn **nên kiểm tra và chỉnh sửa** lại thông tin kết nối cho phù hợp với môi trường của mình.

    Cấu trúc file .env gồm các biến sau:
      DATABASE_URL=mysql+pymysql://root:your_password@mysql:3306/seat_service
      RABBITMQ_URL=amqp://guest:guest@rabbitmq/

 ## Development
 - Định nghĩa API theo file OpenAPI: `docs/api-specs/seat_service.yaml`.
 
 ## Endpoints
 - URL: `http://localhost:8003/`
