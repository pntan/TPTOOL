# 🚀 CÔNG CỤ HỖ TRỢ ĐA NỀN TẢNG CHO SELLER E-COMMERCE

Công cụ hỗ trợ công việc được làm bởi **Phan Nhật Tân (TanPhan)**, nhằm tối ưu hóa các thao tác trên các nền tảng thương mại điện tử lớn như Shopee, Lazada, và TikTok, giúp bạn tiết kiệm thời gian và nâng cao hiệu suất kinh doanh.

---

## 📖 MỤC LỤC
- [Giới Thiệu](#-giới-thiệu)
- [Cài Đặt](#-cài-đặt)
- [Hướng Dẫn Sử Dụng](#-hướng-dẫn-sử-dụng)
    - [Tổng Quan Giao Diện](#tổng-quan-giao-diện)
    - [Tab "Chức Năng"](#tab-chức-năng)
    - [Tab "Tùy Chỉnh"](#tab-tùy-chỉnh)
    - [Tab "Chức Năng Online"](#tab-chức-năng-online)
    - [Xem Nhật Ký Hoạt Động](#xem-nhật-ký-hoạt-động)
- [Các Chức Năng Chi Tiết](#-các-chức-năng-chi-tiết)
    - [Shopee (Sàn S - màu cam)](#shopee-sàn-s---màu-cam)
    - [TikTok (Sàn T)](#tiktok-sàn-t)
    - [Lazada (Sàn L - màu xanh)](#lazada-sàn-l---màu-xanh)
    - [Sapo](#sapo)
    - [Khác](#khác)
- [Phím Tắt](#-phím-tắt)
- [Khắc Phục Lỗi Thường Gặp](#-khắc-phục-lỗi-thường-gặp)
- [Giấy Phép](#-giấy-phép)
- [Liên Hệ & Hỗ Trợ](#-liên-hệ--hỗ-trợ)

---

## ✨ GIỚI THIỆU

Công Cụ Hỗ Trợ ra đời nhằm giải quyết những khó khăn mà các seller thường gặp phải khi vận hành trên nhiều sàn thương mại điện tử. Với khả năng tích hợp trực tiếp vào trình duyệt, công cụ này giúp bạn thực hiện hàng loạt thao tác phức tạp chỉ với vài cú nhấp chuột, từ cập nhật giá hàng loạt đến quản lý chương trình khuyến mãi.

---

## 🛠️ CÀI ĐẶT

Công cụ này được viết bằng JavaScript và chạy trực tiếp trên trình duyệt của bạn thông qua tiện ích mở rộng **Tampermonkey**.

### Hướng dẫn cài đặt Tampermonkey:

1.  **Cài đặt Tiện ích mở rộng Tampermonkey** trên trình duyệt của bạn:
    * [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)
    * [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
    * [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/tampermonkey)

2.  Sau khi cài đặt, mở giao diện Tampermonkey bằng cách nhấn vào **biểu tượng Tampermonkey** trên thanh công cụ trình duyệt.
3.  Nhấp vào **"Create a new script"** hoặc **"Thêm script mới"**.
4.  Xóa toàn bộ nội dung mặc định trong trình chỉnh sửa và **dán đoạn mã sau đây**:
    ```javascript
    // @require       [https://cdn.jsdelivr.net/gh/pntan/TPTOOL@latest/TOOL.js](https://cdn.jsdelivr.net/gh/pntan/TPTOOL@latest/TOOL.js)
    ```
5.  **Lưu script** (thường là `Ctrl + S` hoặc qua menu của Tampermonkey) và **tải lại trang** bạn đang mở để công cụ bắt đầu hoạt động.

### Tải qua CDN (Cách khác):

Bạn cũng có thể tải trực tiếp file script thông qua đường dẫn CDN sau:
[https://cdn.jsdelivr.net/gh/pntan/TPTOOL@latest/TOOL.js](https://cdn.jsdelivr.net/gh/pntan/TPTOOL@latest/TOOL.js)
(Phương pháp này thường được dùng để xem mã nguồn hoặc tải thủ công nếu không muốn dùng `@require`.)

---

## 🚀 HƯỚNG DẪN SỬ DỤNG

Sau khi cài đặt thành công, công cụ sẽ tự động hiển thị trên các trang web được hỗ trợ.

### Tổng Quan Giao Diện

* **Nút Thu Gọn (`ChuẩnMua`):** Nằm ở góc dưới bên phải màn hình (hoặc vị trí khác tùy cấu hình). Nhấp vào để hiển thị/ẩn giao diện chính của chương trình.
* **Giao Diện Chính:** Bao gồm các phần chính:
    * **Tiêu đề chương trình:** Hiển thị tên công cụ, phiên bản (`Ver ${VERSION}`) và **trạng thái máy chủ** (`OFFLINE`, `ONLINE`, `CONNECTING`).
    * **Nhật ký (`Program Log`):** Hiển thị các thông báo, lỗi và tiến trình hoạt động của công cụ.
    * **Các Tab chức năng:** Để điều hướng giữa các nhóm tính năng.
    * **Vùng layout chức năng:** Nơi hiển thị giao diện nhập liệu hoặc kết quả cho từng chức năng đã chọn.
    * **Nút "Chạy":** Thực thi chức năng đang được chọn.
* **Resize Handles:** Các điểm nhỏ ở góc giao diện chính cho phép bạn **kéo để thay đổi kích thước** cửa sổ chương trình.
* **Popup & Toast:** Các cửa sổ bật lên và thông báo nhỏ sẽ xuất hiện ở góc màn hình để cung cấp thông tin hoặc báo lỗi.

### Tab "Chức Năng"

Đây là nơi chứa các công cụ hỗ trợ chính, được sắp xếp theo từng nền tảng E-commerce.

1.  **Chọn chức năng:** Từ danh sách thả xuống, chọn chức năng bạn muốn sử dụng (ví dụ: `Cập Nhật Giá Đuôi` cho Shopee).
2.  **Giao diện tùy chỉnh:** Một giao diện nhập liệu hoặc hiển thị thông tin cụ thể sẽ xuất hiện bên dưới dựa trên chức năng bạn chọn.
3.  **Nhập liệu:** Điền đầy đủ thông tin vào các trường yêu cầu (ví dụ: danh sách SKU, URL sản phẩm, giá...).
4.  **Chạy:** Nhấn nút **"Chạy"** ở phía dưới cùng của giao diện để thực thi chức năng. Kết quả và tiến trình sẽ hiển thị trong phần **Nhật ký**.

### Tab "Tùy Chỉnh"

Dành cho việc cấu hình các thiết lập chung hoặc riêng cho từng nền tảng. Hiện tại, tab này đang chờ phát triển thêm các tùy chọn.

### Tab "Chức Năng Online"

Chứa các tính năng nâng cao yêu cầu kết nối với máy chủ. Hiện tại, chỉ có chức năng **Veritas (AI Chat)**.

### Xem Nhật Ký Hoạt Động

Khu vực **`program-log`** hiển thị chi tiết mọi hoạt động của công cụ. Đây là nơi quan trọng để bạn theo dõi tiến trình, kiểm tra các lỗi phát sinh hoặc xem kết quả xử lý.

---

## ⚙️ CÁC CHỨC NĂNG CHI TIẾT

Dưới đây là danh sách các chức năng hiện có trong công cụ, được phân loại theo nền tảng:

### Shopee (Sàn S - màu cam)

* **Cập Nhật Giá Đuôi:** Cho phép điều chỉnh phần đuôi của giá sản phẩm để đồng bộ hoặc tuân thủ chính sách giá trên sàn.
* **Flash Sale:** Hỗ trợ quản lý và điều chỉnh các chương trình Flash Sale.
* **Tính Giá Bán:** Công cụ tính toán giá bán tối ưu dựa trên chi phí và lợi nhuận mục tiêu.
* **Kiểm Tra 5 Lần Giá:** Tự động kiểm tra biến động giá 5 lần liên tiếp để đảm bảo tính ổn định.
* **Hiển Thị Mã Phân Loại:** Hiển thị mã phân loại (SKU) của sản phẩm.
* **Sửa Giá Theo SKU:** Cập nhật giá sản phẩm dựa trên SKU.
* **Sửa Hình Theo SKU:** Cập nhật hình ảnh sản phẩm theo SKU.
* **Sửa Tên Phân Loại:** Chỉnh sửa tên các phân loại sản phẩm.
* **Điều Chỉnh Combo Khuyến Mãi:** Quản lý và điều chỉnh các combo khuyến mãi.
* **Điều Chỉnh Chương Trình Khuyến Mãi:** Quản lý các chương trình khuyến mãi.
* **Kiểm Tra Phân Loại:** Kiểm tra tình trạng và thông tin của phân loại sản phẩm.
* **Thêm Phân Loại:** Thêm phân loại sản phẩm mới cho nhiều link.
* **Lấy Phân Loại:** Trích xuất thông tin phân loại sản phẩm.
* *(Đang phát triển: Cập Nhật Giá Đăng Ký Chương Trình, Thêm Phân Loại, Kéo Phân Loại)*
* *(Tính năng cũ được liệt kê trước đó: Bật khuyến mãi, Sắp xếp lại hình ảnh, Bật flashsale theo tên có sẵn)*

### TikTok (Sàn T)

* **Cập Nhật Giá Đuôi:** Điều chỉnh giá sản phẩm theo giá đuôi.
* **Sao Chép Chương Trình Flash Sale:** Sao chép các chương trình Flash Sale hiện có.
* **Hiển Thị Mã Phân Loại:** Hiển thị mã phân loại sản phẩm.
* **Chỉnh Sửa Chương Trình Khuyến Mãi:** Chỉnh sửa các chương trình khuyến mãi.
* **Thêm Phân Loại:** Thêm phân loại sản phẩm mới.
* *(Đang phát triển: Kiểm Tra Văng Khuyến Mãi)*

### Lazada (Sàn L - màu xanh)

* **Cập Nhật Giá Đuôi:** Điều chỉnh giá sản phẩm đồng nhất và nhanh chóng.
* **Thêm Phân Loại:** Thêm phân loại sản phẩm mới.
* **Sửa giá theo SKU:** Sửa giá sản phẩm dựa trên SKU.
* *(Đang phát triển: Kiểm Tra Giá Khuyến Mãi)*

### Sapo

* *(Đang phát triển: Kiểm Tra Tồn)*

### Khác

* **Chia Nhỏ File Excel:** Hỗ trợ chia nhỏ các file Excel lớn.
* **So Sánh Voucher:** Công cụ so sánh các voucher.
* *(Đang phát triển: Trình Duyệt Tự Động)*

---

## ⌨️ PHÍM TẮT

* **Ctrl + Click (hoặc Cmd + Click trên macOS):** Có thể được sử dụng kết hợp với các thao tác nhấp chuột để kích hoạt các hành vi đặc biệt (ví dụ: mở menu ngữ cảnh tùy chỉnh nếu được cấu hình).

---

## ⚠️ KHẮC PHỤC LỖI THƯỜNG GẶP

* **Lỗi không tải được tiện ích:**
    * Kiểm tra trạng thái kết nối mạng của bạn.
    * Đảm bảo trình duyệt đã được cập nhật lên phiên bản mới nhất.
    * Kiểm tra khả năng tương thích của trình duyệt với Tampermonkey.
* **Không thấy biểu tượng Tampermonkey:**
    * Tiện ích có thể bị ẩn khỏi thanh công cụ. Kiểm tra phần "Quản lý tiện ích mở rộng" trên trình duyệt và đảm bảo biểu tượng được ghim vào thanh công cụ.
* **Script không chạy:**
    * Đảm bảo bạn đã dán chính xác mã script được cung cấp và đã lưu lại.
    * **Làm mới trang web liên quan** (F5 hoặc Ctrl+R) để kích hoạt script.
* **Trang web không phản hồi sau khi cài đặt:**
    * Điều này thường do xung đột với các tiện ích mở rộng khác. Vô hiệu hóa từng tiện ích một và thử lại, nhằm xác định tiện ích gây xung đột.

---

## 📜 GIẤY PHÉP

This project is licensed under the (LICENSE) license. See the `LICENSE` file for details.

---

## 📞 LIÊN HỆ & HỖ TRỢ

Mọi câu hỏi, yêu cầu hỗ trợ hoặc đóng góp, vui lòng liên hệ **TanPhan**:
* Mail: [nhattanphan2014@gmail.com](mailto:nhattanphan2014@gmail.com)
* Facebook: [facebook.com/pntan215](https://www.facebook.com/pntan215)

---
