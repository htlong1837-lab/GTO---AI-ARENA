# VIỆT PHỤC REMIX — Phối Trang Phục Truyền Thống Theo Phong Cách Gen Z

> **"Mặc chất Gen Z — Giữ hồn Việt."**  
> Nền tảng Styling Cổ phục tương tác trực quan dành cho thế hệ trẻ Việt Nam.

---

## 🌟 Giới thiệu

**Việt Phục Remix** là ứng dụng web cho phép học sinh, sinh viên và người trẻ khám phá, tự tay phối trang phục truyền thống Việt Nam (Áo Dài, Áo Tứ Thân, Áo Ngũ Thân, Áo Nhật Bình, Áo Bà Ba) kết hợp cùng phụ kiện đương đại và phong cách Gen Z.

Ứng dụng chú trọng việc **giữ gìn chuẩn mực văn hóa** trong khi thỏa sức sáng tạo:
- Phân định rõ ràng giữa **Yếu tố Truyền thống** và **Điểm Cách điệu Hiện đại**.
- Cảnh báo văn hóa thông minh khi các biến thể hiện đại có nguy cơ làm lệch lạc đặc trưng phẩm phục tôn nghiêm.
- Thuật toán kiểm tra độ hài hòa màu sắc (Color Harmony Engine) dựa trên triết lý Ngũ hành và sắc độ mỹ thuật Việt.

---

## 🚀 Tính năng nổi bật

1. **Studio Phối Đồ (Outfit Builder 5 bước)**:
   - Bước 1: Chọn bối cảnh (Tết, Lễ hội, Đi học, Chụp ảnh, Tốt nghiệp, Cưới hỏi, v.v.).
   - Bước 2: Chọn dòng Việt phục (Áo Dài, Tứ Thân, Ngũ Thân, Nhật Bình, Bà Ba).
   - Bước 3: Chọn màu di sản (Đỏ Son, Hoàng Cúc, Xanh Chàm, Bạch Ngọc, Hắc Tuyền, Hồng Sen, Tím Huế, v.v.).
   - Bước 4: Chọn phụ kiện (Chunky sneaker, boots da, kiềng bạc, nón quai thao, khăn đóng, túi cói, kính cyber...).
   - Bước 5: Chọn phong cách Gen Z (Traditional Authentic, Minimal Chic, Street Hypebeast, Modern Gen Z, Cute, v.v.).
2. **Visual Layered Mannequin**:
   - Hệ thống avatar SVG tương tác cập nhật màu sắc và các lớp phụ kiện theo thời gian thực.
   - Chuyển đổi nhanh sang chế độ ảnh mẫu lookbook biên tập với cơ chế fallback dự phòng.
3. **Đánh giá Hài hòa Màu sắc**:
   - Tính toán điểm hài hòa (%), phân tích bảng màu chính/phụ/accent và gợi ý thẩm mỹ chuyên nghiệp.
4. **Cảnh báo Văn hóa & Hiểu đúng về Việt phục**:
   - Tự động nhận diện các tổ hợp phối phá cách để đưa ra lời khuyên văn hóa văn minh, gìn giữ hồn cốt cội nguồn.
5. **Lookbook Việt**:
   - Khám phá các look mẫu của 3 miền Bắc — Trung — Nam với bộ lọc theo Vùng miền, Phong cách và Tìm kiếm từ khóa.
   - Nút "Phối lại Look" đưa toàn bộ thông số vào Studio ngay lập tức.
6. **Ma trận So Sánh Look**:
   - So sánh trực quan tối đa 3 bộ outfit cạnh nhau để chọn phương án tối ưu.
7. **Trắc nghiệm Cá tính Cổ phục**:
   - Trả lời 3 câu hỏi nhanh để tìm ra dòng trang phục và phong cách hòa hợp nhất với bạn.
8. **Tủ Đồ & Lưu trữ LocalStorage**:
   - Lưu trữ cá nhân, lịch sử phối đồ, xuất/nhập dữ liệu file JSON.
9. **Chia sẻ Look**:
   - Tạo link chia sẻ mô phỏng, sao chép clipboard và tải thiệp phong cách Look Card.

---

## 🛠️ Công nghệ sử dụng

- **Frontend**: React 19, TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Hiệu ứng**: Canvas Confetti
- **Lưu trữ**: LocalStorage (Client-side, không cần backend)

---

## 💻 Cài đặt & Chạy trên máy cục bộ

```bash
# 1. Clone repository
git clone https://github.com/tulaanh/viet-phuc-remix.git

# 2. Di chuyển vào thư mục dự án
cd viet-phuc-remix

# 3. Cài đặt các gói phụ thuộc
npm install

# 4. Chạy môi trường phát triển (Dev server)
npm run dev

# 5. Đóng gói bản Production
npm run build
```

---

## 📱 Hỗ trợ Responsive

- **Desktop**: 1440 × 900
- **Tablet**: 768 × 1024
- **Mobile**: 390 × 844 (có thanh điều hướng đáy tối ưu thao tác ngón cái)

---

## 📄 Bản quyền & Tôn chỉ Văn hóa

Dự án được xây dựng với tình yêu dành cho di sản văn hóa Việt Nam. Mọi thông tin lịch sử về kết cấu cổ áo, hàng cúc, vạt đối khâm đều được tham chiếu các tư liệu nghiên cứu cổ trang và mỹ thuật truyền thống.
