# Ghi chú cập nhật — Hoàn thiện Việt Phục Remix

Tài liệu này ghi lại các thay đổi được thực hiện sau đợt tự đánh giá dự án theo góc nhìn ban giám khảo (văn hóa – phong tục, thiết kế, sản phẩm, kỹ thuật).

## 1. Bộ nhớ đệm ảnh AI (tránh hết quota)

- Ảnh tạo thành công được lưu vào `.ai-cache/<hash>.json` (hash của prompt + ảnh người mẫu gốc). Thư mục này đã được đưa vào `.gitignore`.
- Yêu cầu trùng với lần trước sẽ trả ảnh cũ ngay, không gọi 9router/Gemini.
- Nút **"Tạo lại bản phối khác"** trên ảnh AI gửi `force: true` để bỏ qua cache và tạo ảnh mới.
- Khi ảnh lấy từ cache, thông báo hiển thị "Đã tải ảnh từ bộ nhớ đệm".
- File liên quan: `vite.config.ts`, `src/services/geminiService.ts`, `src/components/studio/OutfitMannequin.tsx`.

## 2. Engine cảnh báo văn hóa — viết lại hoàn toàn

**Vấn đề trước đây:** logic là chuỗi `if` cứng, dùng sai mã dịp (`du-xuan-tet`, `dam-cuoi`, `tiec-toi` — không tồn tại), nên nhiều cảnh báo không bao giờ bật. Mỗi bản phối chỉ nhận một kết luận, và mọi trường hợp không khớp đều được "98% chuẩn di sản".

**Hiện tại** (`src/services/culturalAdviceService.ts`):

- **Bảng luật dạng dữ liệu:** mỗi luật gồm điều kiện, mức độ (`taboo` / `caution` / `creative` / `info`), lý do, gợi ý sửa và nguồn.
- **Nhiều luật có thể cùng bật.** Người dùng thấy toàn bộ điểm cần lưu ý, không chỉ điểm đầu tiên.
- **Điểm minh bạch:** `100 − 40 × (nghiêm trọng) − 12 × (lưu ý) − 4 × (cách tân)`. Công thức cụ thể của từng bản phối được hiển thị ngay trên thẻ.
- Bản phối có yếu tố hiện đại không bao giờ bị gọi là "nguyên bản".
- **Luật mới:**
  - Nhật Bình với phong cách Street, kính Cyber, blazer che cổ đối khâm, hoặc nón quai thao (lệch tầng lớp và vùng miền).
  - Màu đen hoặc trắng dịp Tết, màu đen ở đám cưới (ghi rõ là quan niệm dân gian).
  - Phong cách "Traditional" nhưng có từ 2 phụ kiện hiện đại trở lên; tổng số phụ kiện hiện đại quá nhiều.
  - Áo Bà Ba hoặc Tứ Thân ở sự kiện trang trọng (sửa lại cho đúng mã dịp thật).
  - Phối liên vùng, ví dụ khăn rằn Nam Bộ với áo Tứ Thân.
- **Giao diện** (`CulturalWarningCard.tsx`) hiển thị danh sách phát hiện, gợi ý sửa, nguồn của từng mục và cách tính điểm.
- **Đổi tên nhãn cho trung thực:**
  - "Độ chuẩn di sản %" → "Mức giữ nguyên bản /100".
  - "Chứng chỉ di sản" → "Gợi ý văn hóa".
  - "Tuyệt đối tránh" → "Nên tránh".

## 3. Nguồn trích dẫn và dữ kiện văn hóa

- **Nguồn chỉ còn 4 loại, ghi rõ:**
  - *Ngàn năm áo mũ* (Trần Quang Đức, NXB Thế Giới, 2013).
  - *Khâm định Đại Nam hội điển sự lệ*.
  - Quan niệm dân gian.
  - Nhận định của nhóm phát triển (ghi rõ đây không phải tư liệu lịch sử).
- **Bỏ các trích dẫn mơ hồ hoặc không kiểm chứng được**, như "Quy chế Y quan… (Đại Nam Thực Lục) nghiêm cấm…" hay "Mỹ thuật Thời trang Ứng dụng Việt Nam".
- **Làm mềm các nhận định còn tranh cãi:** "5 cúc = Ngũ thường" và "4 tà = tứ thân phụ mẫu" nay được ghi là *theo cách diễn giải phổ biến / quan niệm dân gian*. Niên đại "áo Tứ Thân từ thời Lý, Trần" được sửa cho thận trọng.
- **Sửa lỗi dữ kiện:** "Tết Giáp Thìn 2026" → "Tết **Bính Ngọ** 2026". Sửa cách ghi "Lemur, Lê Phổ" thành mẫu Le Mur của họa sĩ Cát Tường và mẫu của Lê Phổ.
- Ghi chú Ngũ hành được gắn nhãn "tham khảo văn hóa, không phải quy tắc bắt buộc".

## 4. Ảnh AI

- **Sửa lỗi prompt Nhật Bình:** code kiểm tra mã `ao-nhat-binh` trong khi mã thật là `nhat-binh`, nên Nhật Bình trước đây nhận prompt chung chung.
- **Bối cảnh ảnh theo đúng 8 dịp thật** (Tết, lễ hội, đi học, chụp ảnh, tốt nghiệp, cưới hỏi, giao lưu, đi chơi). Trước đây chỉ Tết có bối cảnh riêng.
- **Prompt kèm danh sách "đặc điểm không được làm mất"** của từng áo, và yêu cầu AI không pha yếu tố trang phục Trung, Hàn, Nhật.
- **Nhãn "Ảnh minh họa AI"** trên mọi ảnh gen, kèm checklist đặc điểm để người dùng tự đối chiếu (Studio và Fit Room).

## 5. Hài hòa màu sắc — tính toán thật

**Trước:** bảng tra theo phong cách, đổi phụ kiện thì điểm không đổi.

**Hiện tại** (`src/services/colorHarmonyService.ts`):

- **Mỗi phụ kiện có màu đại diện.** Màu trung tính (đen, trắng, bạc, be) được nhận diện riêng.
- **Chấm điểm theo quan hệ sắc độ** giữa màu áo và từng màu có sắc:
  - Tương đồng: lệch ≤ 40°.
  - Bổ túc: lệch ≥ 150° (+4).
  - Lệch "nửa vời" 60–110°: −7 mỗi màu.
  - Quá 3 màu có sắc: trừ thêm.
  - Phụ kiện chìm vì độ sáng gần bằng áo (tỷ lệ tương phản WCAG < 1.5): −5.
  - Màu hợp gam của phong cách: +6.
- Phần nhận xét nêu rõ từng điểm cộng, trừ và gợi ý sửa.

## 6. Bảo mật, triển khai, dọn repo

- **Bỏ key 9router hardcode** trong `vite.config.ts` và 5 script trong `scripts/`. Key nay đọc từ `.env` (`ROUTER_API_KEY`, `ROUTER_URL`, `ROUTER_IMAGE_MODEL`, xem `.env.example`).
  - ⚠️ Key cũ vẫn còn trong lịch sử git, **cần thu hồi và tạo key mới** trên 9router.
- **API tạo ảnh chạy được cả với `npm run build && npm run preview`**, không chỉ `npm run dev`. Nếu deploy dạng trang tĩnh thuần (GitHub Pages…), tính năng AI vẫn cần một server riêng.
- Chuyển các script thử API ở thư mục gốc (`test_*.js`, `check_models.js`) vào `scripts/api-checks/`.

## Kiểm tra đã thực hiện

- `npm run build` (bao gồm `tsc -b`) chạy thành công.
- Chạy thử engine văn hóa và engine màu với các tổ hợp mẫu, ví dụ:
  - Nhật Bình + street + 3 phụ kiện hiện đại, đi học → **nghiêm trọng, 24/100**, 4 phát hiện.
  - Nhật Bình + street + sneaker → **lưu ý, 88/100**.
  - Áo Dài + Gen Z + sneaker, Tết → **cách tân, 96/100**.
  - Bà Ba ở sự kiện giao lưu, không phụ kiện → **lưu ý, 88/100**.
  - Ngũ Thân + khăn đóng, tốt nghiệp → **nguyên bản, 100/100**.
- Chưa kiểm tra bằng cách bấm thử giao diện trên trình duyệt, và chưa gọi thật API tạo ảnh sau thay đổi.

## Hạn chế còn lại (nên nói thẳng khi thuyết trình)

- Bộ luật văn hóa do nhóm tự xây dựng, **chưa được chuyên gia văn hóa thẩm định**.
- Mới có 5 loại áo của người Kinh, chưa có trang phục các dân tộc thiểu số.
- Chưa có số liệu khảo sát người dùng thật.
- Luật chưa xét giới tính người mặc (ví dụ nam mặc Nhật Bình hoặc Tứ Thân vốn là trang phục nữ).
