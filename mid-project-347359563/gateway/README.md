# Gateway
 
 ## Overview
 Gateway đóng vai trò làm cổng bảo vệ đầu vào cho hệ thống, chịu trách nhiệm xác thực người dùng và kiểm soát truy cập thông qua cơ chế JWT (JSON Web Token). Khi người dùng thực hiện đăng nhập, hệ thống kiểm tra thông tin tài khoản và tạo ra một JWT chứa các thông tin định danh, cùng với thời gian phát hành và thời gian hết hạn. Token này sẽ được trả về cho client và sử dụng trong các request tiếp theo. Gateway sẽ kiểm tra token ở mỗi request, đảm bảo chỉ người dùng đã xác thực mới được phép truy cập tài nguyên.
 ## Setup
 - Dịch vụ được đóng gói và xây dựng thông qua `Dockerfile` đi kèm.
 - Source code trong `src/` folder.
