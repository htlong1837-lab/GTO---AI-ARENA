# Kế hoạch Diễn đàn Cộng đồng — bản điều chỉnh

Bản này thay cho plan gốc 8 tuần. Phần lớn MVP đã được làm xong trong một đợt; dưới đây là những gì đã đổi so với plan gốc, lý do, và việc còn lại.

## 1. Những điểm đã điều chỉnh

| Plan gốc | Đã làm | Lý do |
|---|---|---|
| Supabase **hoặc** Firebase, dùng SDK | Supabase qua REST (`fetch`), không thêm SDK; có chế độ demo localStorage dự phòng | App chưa có backend. Chạy được ngay không cần cấu hình; bật cloud chỉ bằng 2 biến môi trường. Bundle không tăng. |
| Zustand / React Query | Không thêm | App đang dùng state React thuần; polling 15–20s đủ cho "realtime" giai đoạn đầu. |
| Rich text TipTap / React Quill | Trình soạn nhẹ: **đậm**, *nghiêng*, liên kết, #hashtag, xem trước | Hai thư viện kia nặng hàng trăm KB; nhu cầu thực tế chỉ cần định dạng cơ bản. Nội dung lưu dạng text nên không có rủi ro XSS. |
| Route `/community`, `/post/:id` | Hash route `#/community/post/<id>` | Site chạy trên GitHub Pages, không hỗ trợ rewrite đường dẫn. |
| Tước hiệu *Tân Khách → Sĩ Tử → Nghệ Nhân → **Chính Thất*** | Tân Khách → Tú Tài → Cử Nhân → Tiến Sĩ → Bảng Nhãn → Trạng Nguyên | "Chính thất" nghĩa là vợ cả, không hợp làm danh hiệu. Thang khoa bảng nhất quán và đúng văn hóa hơn. |
| Chuyên mục "Sự kiện & **Chợ phiên** (mua bán)" | "Sự kiện & Hội họp", **chưa** mở mua bán | Mua bán cần xác thực người dùng, xử lý tranh chấp và lừa đảo. Mở khi đã có tài khoản thật. |
| Bảng `Users` riêng | Danh tính ẩn danh theo thiết bị (tên và ảnh lấy từ Tủ đồ) | Chưa có đăng nhập. Xóa bài dùng token bí mật của thiết bị. |
| Bảng `Tags` riêng | Cột `tags text[]` có index GIN | Đơn giản hơn và truy vấn nhanh hơn ở quy mô hiện tại. |

## 2. Đã hoàn thành
- Feed dạng masonry, 4 chuyên mục, sắp xếp theo Nổi bật / Mới / Nhiều sen, tìm kiếm, hashtag trending.
- **Đăng lên Cộng đồng** bằng một cú bấm từ Studio và từ thẻ trong Tủ đồ: tự đính kèm ảnh AI, công thức phối và tag.
- Chi tiết bài viết: xem nhiều ảnh, nút **Thử bản phối này** (mở công thức trong Studio), sao chép liên kết, báo cáo, xóa bài của mình.
- Bình luận phân cấp: trả lời, thả sen cho bình luận, xóa, sắp xếp, gợi ý trả lời nhanh.
- Gamification: tước hiệu, 5 huy hiệu, thử thách tuần, bảng vàng.
- Kiểm duyệt: lọc từ khóa, giới hạn số liên kết, báo cáo vi phạm, bài tự ẩn khi đủ 3 báo cáo, bắt buộc đồng ý nội quy trước khi đăng.
- Seed sẵn 8 bài và 10 bình luận để diễn đàn không trống.
- Thêm 6 dòng trang phục theo phong tục: Áo Tấc, Giao Lĩnh, Viên Lĩnh, Áo Dài Cưới & Khăn Vấn, Mớ Ba Mớ Bảy, Áo Cóm & Váy Thái. Mỗi dòng có bảng màu, prompt AI và luật văn hóa riêng.

## 3. Việc tiếp theo (ưu tiên giảm dần)
1. **Supabase Auth** (đăng nhập Google/email): chống mạo danh, đồng bộ hồ sơ giữa các thiết bị, mở lại chuyên mục mua bán.
2. **Supabase Realtime** thay cho polling.
3. Trang quản trị cho moderator: xem báo cáo, khôi phục hoặc xóa bài, ghim bài thắng thử thách.
4. Ảnh studio thật cho 6 dòng trang phục mới (hiện đang dùng minh họa SVG đổi màu theo bảng lụa).
5. Thông báo khi có người bình luận hoặc thả sen bài của mình.
6. Thêm trang phục các dân tộc khác (H'Mông, Ê Đê, Chăm…), cần tư vấn từ người trong cộng đồng đó trước khi đưa lên.
