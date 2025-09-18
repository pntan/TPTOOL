  'use strict';

  console.log(`%cTanPhan: %cCHƯƠNG TRÌNH ĐANG KHỞI ĐỘNG`, "color: crimson; font-size: 2rem", "color: orange; font-size: 1.5rem");

  // // Hàm để tải các thư viện JavaScript hoặc CSS
  // function loadLibrary(libraries, callback) {
  //   let index = 0;
  //   const total = libraries.length;

  //   const isTampermonkey = typeof GM_xmlhttpRequest === 'function' && typeof GM_addStyle === 'function';

  //   function normalizeUrl(url) {
  //     let normalized = url.split('?')[0].split('#')[0];
  //     if (normalized.endsWith('/')) normalized = normalized.slice(0, -1);
  //     return normalized;
  //   }

  //   function loadNext() {
  //     if (index >= total) {
  //       if (callback) callback();
  //       return;
  //     }

  //     const currentLib = libraries[index];
  //     const currentUrl = currentLib.url;
  //     const normalizedCurrentUrl = normalizeUrl(currentUrl);

  //     let elementTagName = '';
  //     let relationType = currentLib.rel;
  //     let fileExtension = '';

  //     const customAttrs = {
  //       ...currentLib
  //     };
  //     delete customAttrs.url;
  //     delete customAttrs.rel;

  //     // Xác định loại phần tử
  //     if (relationType) {
  //       elementTagName = 'link';
  //       fileExtension = relationType;
  //     } else if (currentUrl.startsWith('https://fonts.googleapis.com/css')) {
  //       elementTagName = 'link';
  //       relationType = 'stylesheet';
  //       fileExtension = 'css';
  //     } else {
  //       const lastSegment = currentUrl.split('/').pop();
  //       const potentialExtension = lastSegment.split('?')[0].split('.').pop();
  //       if (potentialExtension === 'js') {
  //         elementTagName = 'script';
  //         fileExtension = 'js';
  //       } else if (potentialExtension === 'css') {
  //         elementTagName = 'link';
  //         relationType = 'stylesheet';
  //         fileExtension = 'css';
  //       } else {
  //         console.error(`Không xác định loại: ${currentUrl}. Bỏ qua.`);
  //         index++;
  //         loadNext();
  //         return;
  //       }
  //     }

  //     // Kiểm tra tồn tại
  //     let alreadyExists = false;
  //     if (elementTagName === 'script') {
  //       document.querySelectorAll('script[src]').forEach((s) => {
  //         if (normalizeUrl(s.src) === normalizedCurrentUrl) alreadyExists = true;
  //       });
  //       if (currentUrl.includes('jquery.min.js') && typeof jQuery !== 'undefined') {
  //         alreadyExists = true;
  //       }
  //     } else if (elementTagName === 'link') {
  //       document.querySelectorAll('link[rel]').forEach((l) => {
  //         if (l.rel === relationType && normalizeUrl(l.href) === normalizedCurrentUrl) {
  //           alreadyExists = true;
  //         }
  //       });
  //     }

  //     if (alreadyExists) {
  //       console.warn(`"${currentUrl}" (${relationType || fileExtension}) đã tồn tại. Bỏ qua.`);
  //       index++;
  //       loadNext();
  //       return;
  //     }

  //     // Tampermonkey
  //     if (isTampermonkey && relationType !== 'preconnect') {
  //       GM_xmlhttpRequest({
  //         method: "GET",
  //         url: currentUrl,
  //         responseType: "text",
  //         onload: function(response) {
  //           if (response.status === 200) {
  //             if (elementTagName === 'script') {
  //               Function(response.responseText)();
  //               console.log(`Đã thêm: "${currentUrl}" (GM script)`);
  //             } else if (elementTagName === 'link' && relationType === 'stylesheet') {
  //               if (typeof GM_addStyle === 'function') {
  //                 GM_addStyle(response.responseText);
  //               } else {
  //                 const style = document.createElement('style');
  //                 style.textContent = response.responseText;
  //                 document.head.appendChild(style);
  //               }
  //               console.log(`Đã thêm: "${currentUrl}" (GM style)`);
  //             }
  //           } else {
  //             console.error(`Lỗi GM_xmlhttpRequest: "${currentUrl}"`, response.status);
  //           }
  //           index++;
  //           loadNext();
  //         },
  //         onerror: function(err) {
  //           console.error(`Lỗi GM_xmlhttpRequest: "${currentUrl}"`, err);
  //           index++;
  //           loadNext();
  //         }
  //       });
  //     } else {
  //       // Tải thường
  //       let element;
  //       if (elementTagName === 'script') {
  //         element = document.createElement('script');
  //         element.src = currentUrl;
  //         element.type = 'text/javascript';
  //         element.async = true;
  //       } else if (elementTagName === 'link') {
  //         element = document.createElement('link');
  //         element.href = currentUrl;
  //         element.rel = relationType;
  //         for (const attr in customAttrs) element.setAttribute(attr, customAttrs[attr]);
  //       }

  //       if (!element) {
  //         index++;
  //         loadNext();
  //         return;
  //       }

  //       if (relationType === 'preconnect') {
  //         // ✅ fix: preconnect không có onload, gọi luôn loadNext
  //         document.head.appendChild(element);
  //         console.log(`Đã thêm preconnect: "${currentUrl}"`);
  //         index++;
  //         loadNext();
  //       } else {
  //         element.onload = () => {
  //           console.log(`Đã thêm: "${currentUrl}" (${relationType || fileExtension})`);
  //           index++;
  //           loadNext();
  //         };
  //         element.onerror = (e) => {
  //           console.error(`Lỗi khi thêm: "${currentUrl}"`, e);
  //           index++;
  //           loadNext();
  //         };
  //         document.head.appendChild(element);
  //       }
  //     }
  //   }

  //   loadNext();
  // }

  // // Danh sách các thư viện bên ngoài (JS/CSS/Fonts) cần được tải động vào trang.
  // // Mỗi mục có thể là một đối tượng chứa 'url' và các thuộc tính HTML bổ sung (như 'rel', 'crossorigin').
  // // Hàm loadLibrary sẽ tự động thêm rel="stylesheet" cho các file .css hoặc các URL Google Fonts CSS
  // // nếu 'rel' không được khai báo tường minh.
  // const LIBRARIES = [
  //   {
  //     url: "https://code.jquery.com/jquery-3.7.1.min.js"
  //   }, // jQuery
  //   {
  //     url: "https://code.jquery.com/ui/1.14.1/jquery-ui.js"
  //   }, // jQuery UI
  //   {
  //     url: "https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js"
  //   }, // ExcelJS
  //   {
  //     url: "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"
  //   }, // JSZip
  //   {
  //     url: "https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"
  //   }, // FileSaver.js
  //   {
  //     url: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js"
  //   }, // Bootstrap
  //   {
  //     url: "https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
  //   }, // Popper.js
  //   {
  //     url: "https://cdn.socket.io/4.8.1/socket.io.min.js"
  //   }, // Socket.IO
  //   {
  //     url: "https://cdn.jsdelivr.net/npm/flowbite@3.1.2/dist/flowbite.min.css"
  //   }, // Flowbite
  //   {
  //     url: "https://cdn.jsdelivr.net/npm/flowbite@3.1.2/dist/flowbite.min.js"
  //   }, // Flowbite
  //   {
  //     url: "https://fonts.googleapis.com",
  //     rel: "preconnect"
  //   }, // Google Fonts
  //   {
  //     url: "https://fonts.gstatic.com",
  //     rel: "preconnect",
  //     crossorigin: "anonymous"
  //   }, // Google Fonts
  //   {
  //     url: "https://fonts.googleapis.com/css2?family=Borel&display=swap"
  //   }, // Google Fonts
  //   {
  //     url: "https://cdn.boxicons.com/fonts/basic/boxicons.min.css"
  //   }, // Boxicons Basic
  //   {
  //     url: "https://cdn.boxicons.com/fonts/brands/boxicons-brands.min.css"
  //   }, // Boxicons Brands
  //   {
  //     url: "https://cdn.jsdelivr.net/gh/mdbassit/Coloris@latest/dist/coloris.min.css"
  //   }, // Coloris CSS
  //   {
  //     url: "https://cdn.jsdelivr.net/gh/mdbassit/Coloris@latest/dist/coloris.min.js"
  //   },
  //   {
  //     url: "https://cdn.jsdelivr.net/npm/sortablejs@1.15.6/Sortable.min.js"
  //   }, // Sortable JS
	// ];

	// Thêm thư viện
	function loadLibrary(scripts, callback){
		let index = 0;
		const total = scripts.length;

		function loadNext() {
			if (index >= total) {
				if (callback) {
					callback();
				}
				return;
			}

			const currentUrl = scripts[index];
			const fileExtension = currentUrl.split('.').pop().split('?')[0]; // Lấy phần mở rộng, bỏ qua query params

			// ----------------------------------------------------
			// Bước 1: Kiểm tra xem script/style đã tồn tại trên trang chưa
			// ----------------------------------------------------
			let alreadyExists = false;
			let elementTagName = '';

			if (fileExtension === 'js') {
				elementTagName = 'script';
				// Kiểm tra sự tồn tại của script bằng cách duyệt qua các thẻ script hiện có
				const existingScripts = document.querySelectorAll('script[src]');
				for (const script of existingScripts) {
					// So sánh đường dẫn hoặc chỉ tên file/phiên bản
					// Đây là logic kiểm tra nâng cao: kiểm tra có chứa tên script (và version) không
					if (script.src === currentUrl || script.src.includes(currentUrl.split('/').slice(-2).join('/'))) {
						alreadyExists = true;
						break;
					}
				}
				// Bổ sung kiểm tra biến toàn cục cho các thư viện cụ thể như jQuery
				// if (currentUrl.includes('jquery.min.js') && typeof jQuery !== 'undefined') {
				// 	alreadyExists = true;
				// } else if (currentUrl.includes('elevatezoom.min.js') && typeof $.fn.elevateZoom !== 'undefined') {
				// 	alreadyExists = true;
				// }

			} else if (fileExtension === 'css') {
				elementTagName = 'link';
				// Kiểm tra sự tồn tại của stylesheet bằng cách duyệt qua các thẻ link hiện có
				const existingLinks = document.querySelectorAll('link[rel="stylesheet"]');
				for (const link of existingLinks) {
					if (link.href === currentUrl || link.href.includes(currentUrl.split('/').slice(-2).join('/'))) {
						alreadyExists = true;
						break;
					}
				}
			} else {
				console.error(`%cTanPhan: %cKhông hỗ trợ định dạng file: ${fileExtension} cho URL: ${currentUrl}`, "color: crimson; font-size: 2rem", "color: orange; font-size: 1.5rem");
				index++;
				loadNext(); // Chuyển sang file tiếp theo
				return;
			}

			if (alreadyExists) {
				console.error(`%cTanPhan: %c"${currentUrl}" đã tồn tại. Bỏ qua tải.`, "color: crimson; font-size: 2rem", "color: orange; font-size: 1.5rem");
				index++;
				loadNext(); // Chuyển sang file tiếp theo
				return;
			}

			// ----------------------------------------------------
			// Bước 2: Tạo và thêm thẻ script/link phù hợp
			// ----------------------------------------------------
			let element;
			if (elementTagName === 'script') {
				element = document.createElement('script');
				element.src = currentUrl;
				element.type = 'text/javascript';
			} else if (elementTagName === 'link') {
				element = document.createElement('link');
				element.href = currentUrl;
				element.rel = 'stylesheet';
				element.type = 'text/css';
			}

			if (!element) { // Trường hợp lỗi không tạo được element
				index++;
				loadNext();
				return;
			}

			element.onload = () => {
				console.log(`%cTanPhan: %cĐã thêm thành công: "${currentUrl}"`, "color: crimson; font-size: 2rem", "color: orange; font-size: 1.5rem");
				index++;
				loadNext();
			};

			element.onerror = (e) => {
				console.error(`%cTanPhan: %cCó lỗi khi thêm: "${currentUrl}"`, "color: crimson; font-size: 2rem", "color: orange; font-size: 1.5rem");
				index++;
				loadNext(); // Vẫn cố gắng tải tiếp các file khác
			};

			document.head.appendChild(element);
		}

		// Bắt đầu quá trình tải
		loadNext();				
	}

	// Danh sách thư viện cần thêm
	const LIBRARIES = [
		"https://code.jquery.com/jquery-3.7.1.min.js", // JQYERY
		"https://code.jquery.com/ui/1.14.1/jquery-ui.js", // JQUERY UI
		"https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js", // EXCEL
		"https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js", // ZIP FILE
		"https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js", // SAVE FILE
		"https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js", // BOOTSTRAP
		"https://kit.fontawesome.com/e538a919ef.js", // Fontawesome
		"https://cdn.socket.io/4.8.1/socket.io.min.js", // SOCKET IO
		"https://cdn.boxicons.com/fonts/basic/boxicons.min.css", // Boxicons
    "https://cdn.jsdelivr.net/gh/mdbassit/Coloris@latest/dist/coloris.min.css", // Coloris CSS
    "https://cdn.jsdelivr.net/gh/mdbassit/Coloris@latest/dist/coloris.min.js",
	];

  // Cách sử dụng:
  loadLibrary(LIBRARIES, async () => {
    console.log("Tất cả thư viện đã được tải xong!");

    await INITCONFIG();
  });

  async function INITCONFIG() {
    // Phiên bản của chương trình
    const VERSION = "3.0.0.alpha";

    // TOKEN truy cập GitHub API
    const _GITHUB_KEY = "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";

    const HTML_TOOL_UI = `
			<link rel="stylesheet"href="./TOOL.css"><script src="./TOOLv2.js"></script><div class="tp-container tp-popup"><div class="content"></div></div><div class="tp-container tp-toast"id="toast-container"></div><div class="tp-container tp-button-toggle tp-draggable"><svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 384 384"><path fill="#000000"d="M213 0v213h-42V0h42zm103 46q68 58 68 146q0 80-56 136t-136 56t-136-56T0 192q0-88 68-146l30 30q-55 45-55 116q0 62 43.5 105.5T192 341t105.5-43.5T341 192q0-71-55-115z"/></svg></div><div class="tp-container"id="custom-context-menu"style="display:none;position:absolute;z-index:9999"><ul class="list-unstyled p-0 m-0"><li class="menu-item"data-action="toggle-program">Ẩn/Hiện chương trình</li><li class="menu-item"data-action="connect-server">Kết nối máy chủ</li></ul></div><div class="tp-container tp-content tp-draggable active"><div class="notification-bar"><div class="switch switch-theme-mode color-theme"><input type="radio"name="theme-mode"id="light-mode"value="light"> <label for="light-mode">Sáng</label> <input type="radio"name="theme-mode"id="dark-mode"value="dark"> <label for="dark-mode">Tối</label> <input type="radio"name="theme-mode"id="auto-mode"value="option"> <label for="auto-mode">Tùy Chỉnh</label> <span class="selected-theme"></span></div><div class="TP-choice-box"><input type="checkbox"id="alway-show"data-css-var="alway-show"> <label for="alway-show">Luôn Mở Khi Load Trang</label></div></div><div class="header-content"><div class="header-left"><div class="notification"><button type="button"class="relative inline-flex items-center text-center rounded-lg"><i class="bx bx-square-rounded"></i> <span class="sr-only">Thông Báo</span><div class="absolute inline-flex items-center justify-center font-bold border-2 border-white rounded-full">0</div></button></div></div><div class="header-right"><div class="server-status"><i class="bxr bx-wifi server-online"></i> <i class="bxr bx-loader-lines server-load"></i> <i class="bxr bx-wifi-slash server-offline"></i></div><div class="time"><p class="time-text">00:00:00</p></div></div></div><div class="body-content"><div class="screen-content config-screen"><div class="config-group"><div class="config-title"><p>Thanh Thông Báo</p></div><hr><div class="config-setting"><div class="config-item background-notification-bar"><div class="config-item-name"><label for="background-notification-bar">Màu Nền</label></div><div class="config-item-setting"><input data-css-var="background-notification-bar"data-coloris id="background-notification-bar"></div></div><div class="config-item background-blur-notification-bar"><div class="config-item-name"><label for="background-blur-notification-bar">Độ Mờ Nền</label></div><div class="config-item-setting"><input data-css-var="background-blur-notification-bar"type="number"id="background-blur-notification-bar"></div></div><div class="config-item background-switch-label"><div class="config-item-name"><label for="background-switch-label">Nền Nút Chuyển Giao Diện</label></div><div class="config-item-setting"><input data-css-var="background-switch-label"data-coloris id="background-switch-label"></div></div><div class="config-item background-switch-theme-label-hover"><div class="config-item-name"><label for="background-switch-theme-label-hover">Nền Nút Chuyển Giao Diện (chạm)</label></div><div class="config-item-setting"><input data-css-var="background-switch-theme-label-hover"data-coloris id="background-switch-theme-label-hover"></div></div><div class="config-item text-switch-label"><div class="config-item-name"><label for="text-switch-label">Chữ Nút Chuyển Giao Diện</label></div><div class="config-item-setting"><input data-css-var="text-switch-label"data-coloris id="text-switch-label"></div></div><div class="config-item text-switch-label-hover"><div class="config-item-name"><label for="text-switch-label-hover">Chữ Nút Chuyển Giao Diện (chạm)</label></div><div class="config-item-setting"><input data-css-var="text-switch-label-hover"data-coloris id="text-switch-label-hover"></div></div></div></div><div class="config-group"><div class="config-title"><p>Giao Diện Chính</p></div><hr><div class="config-setting"><div class="config-item background-color-main-content"><div class="config-item-name"><label for="background-color-main-content">Màu Nền</label></div><div class="config-item-setting"><input data-css-var="background-color-main-content"data-coloris id="background-color-main-content"></div></div><div class="config-item background-image-main-content"><div class="config-item-name"><label for="background-image-main-content">Ảnh Nền</label></div><div class="config-item-setting"><input data-css-var="background-image-main-content"id="background-image-main-content"placeholder="URL hình ảnh"></div></div><div class="config-item background-image-repeat-main-content"><div class="config-item-name"><label for="background-image-repeat-main-content">Ảnh Nền Lặp Lại</label></div><div class="config-item-setting"><div class="TP-select"><div class="TP-select-choice"><div class="option-name"><p>Ảnh Nền Lặp Lại</p><input data-css-var="background-image-repeat-main-content"hidden></div></div><div class="TP-select-list-option"><div class="TP-select-option"><div class="option-name"><p>Không Lặp Lại</p></div></div><div class="TP-select-option"><div class="option-name"><p>Lặp Lại</p></div></div></div></div></div></div><div class="config-item backgorund-size"><div class="config-item-name"><label>Kích Thước Ảnh Nền</label></div><div class="config-item-setting"><div class="TP-select"><div class="TP-select-choice"><div class="option-name"><p>Background Size</p><input data-css-var="background-image-size-main-content"hidden></div></div><div class="TP-select-list-option"><div class="TP-select-option"data-value="cover"><div class="option-name"><p>Đầy Đủ</p></div></div><div class="TP-select-option"data-value="cover"><div class="option-name"><p>Vừa Giao Diện</p></div></div><div class="TP-select-option"data-value="cover"><div class="option-name"><p>Tùy Chỉnh</p></div></div></div></div><div class="custom-config"><input data-css-var="background-size-width"type="number"value="100"><span>x</span><input data-css-var="background-size-height"type="number"value="100"><span>%</span></div></div></div><div class="config-item background-image-position-main-content"><div class="config-item-name"><label>Vị Trí Ảnh</label></div><div class="config-item-setting"><div class="custom-config"><input data-css-var="background-image-position-main-content-x"type="number"value="100"><span>x</span><input data-css-var="background-image-position-main-content-y"type="number"value="100"><span>%</span></div></div></div><div class="config-item background-opacity"><div class="config-item-name"><label for="background-opacity">Độ Trong Suốt</label></div><div class="config-item-setting"><input data-css-var="main-bg-image-blur"id="background-opacity"type="range"min="0"max="1000"value="0"></div></div><div class="config-item text-main-content"><div class="config-item-name"><label for="text-main-content">Màu Chữ</label></div><div class="config-item-setting"><input data-css-var="text-main-content"data-coloris id="text-main-content"></div></div><div class="config-item text-header"><div class="config-item-name"><label for="text-header">Màu Chữ Header</label></div><div class="config-item-setting"><input data-css-var="text-header"data-coloris id="text-header"></div></div><div class="config-item background-icon-app"><div class="config-item-name"><label for="background-icon-app">Màu Nền App</label></div><div class="config-item-setting"><input data-css-var="background-icon-app"data-coloris id="background-icon-app"></div></div><div class="config-item text-icon-app"><div class="config-item-name"><label for="text-icon-app">Màu Chữ App</label></div><div class="config-item-setting"><input data-css-var="text-icon-app"data-coloris id="text-icon-app"></div></div></div></div><div class="config-group"><div class="config-title"><p>Giao Diện Cấu Hình</p></div><hr><div class="config-setting"><div class="config-item background-config-group"><div class="config-item-name"><label for="background-config-group">Màu Nền</label></div><div class="config-item-setting"><input data-css-var="background-config-group"data-coloris id="background-config-group"></div></div><div class="config-item text-config-group-light"><div class="config-item-name"><label for="text-config-group-light">Màu Chữ</label></div><div class="config-item-setting"><input data-css-var="text-config-group"data-coloris id="text-config-group-light"></div></div></div></div><div class="config-group"><div class="config-title"><p>Thanh Điều Hướng</p></div><hr><div class="config-setting"><div class="config-item text-bottom-navbar"><div class="config-item-name"><label for="text-bottom-navbar">Màu Chữ</label></div><div class="config-item-setting"><input id="text-bottom-navbar"data-css-var="text-bottom-navbar"data-coloris></div></div></div></div><div class="config-group"><div class="config-title"><p>Nút Điều Khiển</p></div><hr><div class="config-setting"><div class="config-item background-color-button-toggle"><div class="config-item-name"><label for="background-color-button-toggle">Màu Nền</label></div><div clas="config-item-setting"><input id="background-color-button-toggle"data-css-var="background-color-button-toggle"data-coloris></div></div><div class="config-item background-image-button-toggle"><div class="config-item-name"><label for="background-image-button-toggle">Hình Nền</label></div><div clas="config-item-setting"><input id="background-image-button-toggle"data-css-var="background-image-button-toggle"></div></div><div class="config-item text-button-toggle"><div class="config-item-name"><label for="text-button-toggle">Màu Chữ</label></div><div clas="config-item-setting"><input id="text-button-toggle"data-css-var="text-button-toggle"data-coloris></div></div></div></div><div class="config-group"><div class="config-title"><p>Thông Báo</p></div><hr><div class="config-setting"><div class="config-item background-toast-success"><div class="config-item-name"><label for="background-toast-success">Thành Công</label></div><div clas="config-item-setting"><input id="background-toast-success"data-css-var="background-toast-success"data-coloris></div></div><div class="config-item background-toast-error"><div class="config-item-name"><label for="background-toast-error">Lỗi</label></div><div clas="config-item-setting"><input id="background-toast-error"data-css-var="background-toast-error"data-coloris></div></div><div class="config-item background-toast-warning"><div class="config-item-name"><label for="background-toast-warning">Cảnh Báo</label></div><div clas="config-item-setting"><input id="background-toast-warning"data-css-var="background-toast-warning"data-coloris></div></div><div class="config-item background-toast-info"><div class="config-item-name"><label for="background-toast-info">Thông Tin</label></div><div clas="config-item-setting"><input id="background-toast-info"data-css-var="background-toast-info"data-coloris></div></div></div></div></div><div class="screen-content home-screen active"><div class="TP-APPVIEW"><div class="TP-APP-BOX"data-function="giaDuoi"data-layout="#"data-platform="shopee,tiktok,lazada"title="Cập Nhật Giá Đuôi"><div class="app-box-icon"><svg xmlns="http://www.w3.org/2000/svg"id="Layer_1"data-name="Layer 1"viewBox="0 0 24 24"><path d="M24,10.5v3H0v-3H24Zm-10.5,5.5h-3v4h-3l3.793,3.707c.391,.391,1.024,.391,1.414,0l3.793-3.707h-3v-4Zm-3-8h3V4h3L12.707,.293c-.391-.391-1.024-.391-1.414,0l-3.793,3.707h3v4Z"/></svg></div><p>Cập Nhật Giá Đuôi</p></div><div class="TP-APP-BOX"data-function="flashSale"data-layout="#"data-platform="shopee,tiktok"title="Flash Sale"><div class="app-box-icon"><svg xmlns="http://www.w3.org/2000/svg"id="Layer_1"data-name="Layer 1"viewBox="0 0 24 24"><path d="M15.477,18.61c0-1.283-.808-2.029-2.357-3.344-.35-.3-.728-.618-1.118-.972-.445.409-.868.769-1.256,1.1C9.2,16.7,8.523,17.339,8.523,18.61a3.477,3.477,0,0,0,6.954,0Z"/><path d="M16.408,4.035c-1.2-1.019-2.44-2.072-3.694-3.325L12,0,11.3.711c-2.254,2.262-3.32,5.736-3.782,7.82a6.04,6.04,0,0,1-.779-1.785L6.312,5.109,5.079,6.266c-2.159,2.028-3.6,4.039-3.6,7.259a10.422,10.422,0,0,0,7.8,10.18A11.153,11.153,0,0,0,11,24a5.491,5.491,0,0,1-4.485-5.39c0-2.25,1.357-3.4,2.928-4.742.561-.477,1.2-1.018,1.845-1.667L12,11.493l.708.708c.576.576,1.152,1.064,1.709,1.538,1.576,1.337,3.064,2.6,3.064,4.871a5.489,5.489,0,0,1-4.456,5.384A10.51,10.51,0,0,0,22.52,13.527C22.52,9.225,19.687,6.82,16.408,4.035Z"/></svg></div><p>Flash Sale</p></div><div class="TP-APP-BOX"data-function="giaDuoiChuongTrinh"data-layout="#"data-platform="shopee"title="Cập Nhật Giá Đăng Ký Chương Trình"><div class="app-box-icon"><svg xmlns="http://www.w3.org/2000/svg"id="Layer_1"data-name="Layer 1"viewBox="0 0 24 24"><path d="m24,19c0,1.654-1.346,3-3,3v1c0,.553-.447,1-1,1s-1-.447-1-1v-1h-.268c-1.067,0-2.063-.574-2.598-1.499-.277-.479-.113-1.09.364-1.366.479-.279,1.091-.113,1.366.364.179.31.511.501.867.501h2.268c.552,0,1-.448,1-1,0-.379-.271-.698-.645-.761l-3.04-.506c-1.342-.224-2.315-1.374-2.315-2.733,0-1.654,1.346-3,3-3v-1c0-.553.447-1,1-1s1,.447,1,1v1h.268c1.067,0,2.063.574,2.598,1.499.277.479.113,1.09-.364,1.366-.48.278-1.091.112-1.366-.364-.179-.31-.511-.501-.867-.501h-2.268c-.552,0-1,.448-1,1,0,.379.271.698.645.761l3.04.506c1.342.224,2.315,1.374,2.315,2.733Zm-10.5,2H5.5c-1.379,0-2.5-1.121-2.5-2.5v-9.5h19.5c.828,0,1.5-.672,1.5-1.5,0-3.032-2.468-5.5-5.5-5.5h-.5v-.5c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5,1.5v.5h-6v-.5c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5,1.5v.5h-.5C2.468,2,0,4.468,0,7.5v11c0,3.032,2.468,5.5,5.5,5.5h8c.828,0,1.5-.672,1.5-1.5s-.672-1.5-1.5-1.5Z"/></svg></div><p>Giá Chương Trình</p></div><div class="TP-APP-BOX"data-function="kTr5LanGia"data-layout="#"data-platform="shopee"title="Kiểm Tra 5 Lần Giá"><div class="app-box-icon"><svg xmlns="http://www.w3.org/2000/svg"id="Layer_1"data-name="Layer 1"viewBox="0 0 24 24"><path d="M21,2H3C1.346,2,0,3.346,0,5V22H24V5c0-1.654-1.346-3-3-3Zm-10,15H3v-2H11v2Zm0-4H3v-2H11v2Zm0-4H3v-2H11v2Zm4.644,1.76l3.041,.507c1.342,.223,2.315,1.373,2.315,2.733,0,1.654-1.346,3-3,3v1h-2v-1c-1.654,0-3-1.346-3-3h2c0,.551,.448,1,1,1h2c.552,0,1-.449,1-1,0-.378-.271-.698-.644-.76l-3.041-.507c-1.342-.223-2.315-1.373-2.315-2.733,0-1.654,1.346-3,3-3v-1h2v1c1.654,0,3,1.346,3,3h-2c0-.551-.448-1-1-1h-2c-.552,0-1,.449-1,1,0,.378,.271,.698,.644,.76Z"/></svg></div><p>Kiểm Tra 5 Lần Giá</p></div><div class="TP-APP-BOX"data-function="saoChepFlashSale"data-layout="#"data-platform="tiktok"title="Sao Chép Chương Trình Flash Sale"><div class="app-box-icon"><svg xmlns="http://www.w3.org/2000/svg"id="Layer_1"viewBox="0 0 24 24"data-name="Layer 1"><path d="m8.5 16c-2.963 0-5.939-.646-6.064-.674-.381-.084-.679-.381-.762-.762-.028-.126-.673-3.102-.673-6.064s.645-5.939.672-6.064c.083-.381.381-.679.762-.762.125-.028 3.102-.673 6.064-.673s5.938.646 6.064.673c.381.083.678.381.762.762.027.125.674 3.102.674 6.064s-.646 5.938-.674 6.064c-.084.381-.381.678-.762.762-.126.027-3.101.674-6.064.674zm13.826-6.564c-.084-.381-.381-.679-.762-.762-.09-.02-1.625-.352-3.569-.542.002.123.005.245.005.368 0 3.085-.646 6.149-.72 6.488-.252 1.144-1.148 2.04-2.285 2.291-.346.075-3.41.721-6.495.721-.123 0-.246-.003-.368-.005.19 1.944.522 3.479.542 3.569.083.381.381.678.762.762.125.027 3.102.674 6.064.674s5.938-.646 6.064-.674c.381-.084.678-.381.762-.762.027-.126.674-3.101.674-6.064s-.646-5.939-.674-6.064z"/></svg></div><p>Sao Chép Flash Sale</p></div><div class="TP-APP-BOX"data-function="kiemTraMaPhanLoai"data-layout="#"data-platform="shopee,tiktok"title="Hiển Thị Mã Phân Loại"><div class="app-box-icon"><svg xmlns="http://www.w3.org/2000/svg"id="Layer_1"data-name="Layer 1"viewBox="0 0 24 24"><path d="m6.561,11.061l-.935.935.935.935c.586.586.586,1.535,0,2.121-.292.293-.677.439-1.061.439s-.768-.146-1.061-.439l-.935-.935-.935.935c-.293.293-.677.439-1.061.439s-.768-.146-1.061-.439c-.586-.586-.586-1.535,0-2.121l.935-.935-.935-.935c-.586-.585-.586-1.535,0-2.121.585-.586,1.535-.586,2.121,0l.935.935.935-.935c.586-.586,1.535-.586,2.121,0s.586,1.536,0,2.121ZM1.5,7c.829,0,1.5-.671,1.5-1.5,0-1.378,1.122-2.5,2.5-2.5h2c.829,0,1.5-.671,1.5-1.5s-.671-1.5-1.5-1.5h-2C2.467,0,0,2.467,0,5.5c0,.829.671,1.5,1.5,1.5Zm15-4h2c1.378,0,2.5,1.122,2.5,2.5,0,.829.671,1.5,1.5,1.5s1.5-.671,1.5-1.5c0-3.033-2.467-5.5-5.5-5.5h-2c-.829,0-1.5.671-1.5,1.5s.671,1.5,1.5,1.5Zm6,14c-.829,0-1.5.672-1.5,1.5,0,1.379-1.122,2.5-2.5,2.5h-2c-.829,0-1.5.672-1.5,1.5s.671,1.5,1.5,1.5h2c3.033,0,5.5-2.468,5.5-5.5,0-.828-.671-1.5-1.5-1.5Zm-15,4h-2c-1.378,0-2.5-1.121-2.5-2.5,0-.828-.671-1.5-1.5-1.5s-1.5.672-1.5,1.5c0,3.032,2.467,5.5,5.5,5.5h2c.829,0,1.5-.672,1.5-1.5s-.671-1.5-1.5-1.5Zm16.061-12.061c-.586-.586-1.535-.586-2.121,0l-.935.935-.935-.935c-.586-.586-1.536-.586-2.121,0-.586.586-.586,1.536,0,2.121l.935.935-.935.935c-.586.586-.586,1.535,0,2.121.293.293.677.439,1.061.439s.768-.146,1.061-.439l.935-.935.935.935c.293.293.677.439,1.061.439s.768-.146,1.061-.439c.586-.586.586-1.535,0-2.121l-.935-.935.935-.935c.586-.585.586-1.535,0-2.121Zm-8.5,3.991l-.935-.935.935-.935c.586-.585.586-1.535,0-2.121s-1.535-.586-2.121,0l-.935.935-.935-.935c-.586-.586-1.536-.586-2.121,0-.586.586-.586,1.536,0,2.121l.935.935-.935.935c-.586.586-.586,1.535,0,2.121.293.293.677.439,1.061.439s.768-.146,1.061-.439l.935-.935.935.935c.293.293.677.439,1.061.439s.768-.146,1.061-.439c.586-.586.586-1.535,0-2.121Z"/></svg></div><p>Hiển Thị Mã Phân Loại</p></div><div class="TP-APP-BOX"data-function="suaGiaTheoSKU"data-layout="#"data-platform="shopee,tiktok,lazada"title="Sửa Giá Theo SKU"><div class="app-box-icon"><svg xmlns="http://www.w3.org/2000/svg"id="Layer_1"data-name="Layer 1"viewBox="0 0 24 24"><path d="M9.828,20H4V14.172l.586-.586L18.172,0H3A3,3,0,0,0,0,3V24H17V17h7V5.828Z"/><polygon points="19 23.414 23.414 19 19 19 19 23.414"/><path d="M6,18H9L23.379,3.621a2.121,2.121,0,0,0-3-3L6,15Z"/></svg></div><p>Sửa Giá Theo SKU</p></div><div class="TP-APP-BOX"data-function="suaHinhTheoSKU"data-layout="#"data-platform="shopee,tiktok,lazada"title="Sửa Hình Theo SKU"><div class="app-box-icon"><svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 24 24"><g id="_01_align_center"data-name="01 align center"><path d="M21,0H3A3,3,0,0,0,0,3V24H24V3A3,3,0,0,0,21,0ZM3,2H21a1,1,0,0,1,1,1V20.586L11.121,9.707a3,3,0,0,0-4.242,0L2,14.586V3A1,1,0,0,1,3,2ZM2,17.414l6.293-6.293a1,1,0,0,1,1.414,0L20.586,22H2Z"/><path d="M16,10a3,3,0,1,0-3-3A3,3,0,0,0,16,10Zm0-4a1,1,0,1,1-1,1A1,1,0,0,1,16,6Z"/></g></svg></div><p>Sửa Hình Theo SKU</p></div><div class="TP-APP-BOX"data-function="suaTenPhanLoaiSKU"data-layout="#"data-platform="shopee"title="Sửa Tên Phân Loại"><div class="app-box-icon"><svg xmlns="http://www.w3.org/2000/svg"id="Layer_1"data-name="Layer 1"viewBox="0 0 24 24"><path d="M5,3h2V21h-2C2.239,21,0,18.761,0,16V8C0,5.239,2.239,3,5,3Zm14,0c2.761,0,5,2.239,5,5v8c0,2.761-2.239,5-5,5H9V3h10Zm-5,6h2v7c0,.553,.448,1,1,1s1-.447,1-1v-7h2c.552,0,1-.447,1-1,0-.553-.448-1-1-1h-6c-.552,0-1,.447-1,1s.448,1,1,1Zm-5,12h-2c0,.552-.449,1-1,1s-1,.447-1,1c0,.553,.448,1,1,1,.768,0,1.469-.29,2-.766,.531,.476,1.232,.766,2,.766,.552,0,1-.447,1-1,0-.553-.448-1-1-1s-1-.448-1-1ZM7,3h2c0-.552,.449-1,1-1s1-.447,1-1C11,.447,10.552,0,10,0c-.768,0-1.469,.29-2,.766C7.469,.29,6.768,0,6,0c-.552,0-1,.447-1,1,0,.553,.448,1,1,1s1,.448,1,1Z"/></svg></div><p>Sửa Tên Phân Loại</p></div><div class="TP-APP-BOX"data-function="kiemTraPhanLoai"data-layout="#"data-platform="shopee"title="Kiểm Tra Phân Loại"><div class="app-box-icon"><svg xmlns="http://www.w3.org/2000/svg"id="Layer_1"data-name="Layer 1"viewBox="0 0 24 24"><path d="m10,22.501c0,.828-.672,1.499-1.5,1.499h-.001l-3.004-.003c-3.03-.003-5.495-2.47-5.495-5.5V5.494c0-1.47.572-2.852,1.612-3.89C2.65.565,4.032-.006,5.5-.006h.002L14.502-.002c3.031,0,5.498,2.469,5.498,5.5v1.002c0,.828-.671,1.5-1.5,1.5s-1.5-.672-1.5-1.5v-1.002c0-1.378-1.121-2.499-2.499-2.5l-9-.004h-.001c-.667,0-1.295.26-1.768.731-.472.473-.732,1.101-.732,1.769v13.003c0,1.377,1.12,2.499,2.498,2.5l3.004.003c.829,0,1.5.673,1.499,1.501Zm13.561,1.06c-.293.293-.677.439-1.061.439s-.768-.146-1.061-.439l-2.396-2.396c-.893.527-1.931.836-3.043.836-3.314,0-6-2.686-6-6s2.686-6,6-6,6,2.686,6,6c0,1.112-.308,2.15-.836,3.043l2.396,2.396c.586.586.586,1.535,0,2.121Zm-6.581-5.234l2.703-2.614c.398-.383.411-1.016.029-1.414-.383-.399-1.017-.41-1.414-.029l-2.713,2.624c-.143.141-.379.144-.522.002l-1.354-1.331c-.396-.388-1.028-.381-1.414.014-.387.395-.381,1.027.014,1.414l1.354,1.332c.46.449,1.062.674,1.663.674s1.201-.225,1.653-.671Zm-6.479-13.326c-.829,0-1.5.672-1.5,1.5s.671,1.5,1.5,1.5h3c.829,0,1.5-.672,1.5-1.5s-.671-1.5-1.5-1.5h-3Zm-4,0c-.828,0-1.5.672-1.5,1.5s.672,1.5,1.5,1.5,1.5-.672,1.5-1.5-.672-1.5-1.5-1.5Zm0,10c-.828,0-1.5.672-1.5,1.5s.672,1.5,1.5,1.5,1.5-.672,1.5-1.5-.672-1.5-1.5-1.5Zm0-5c-.828,0-1.5.672-1.5,1.5s.672,1.5,1.5,1.5,1.5-.672,1.5-1.5-.672-1.5-1.5-1.5Z"/></svg></div><p>Kiểm Tra Phân Loại</p></div><div class="TP-APP-BOX"data-function="themPhanLoai"data-layout="#"data-platform="shopee,tiktok,lazada"title="Thêm Phân Loại"><div class="app-box-icon"><svg xmlns="http://www.w3.org/2000/svg"id="Layer_1"height="512"viewBox="0 0 24 24"data-name="Layer 1"><path d="m21.414 5h-4.414v-4.414zm.586 2v17h-20v-21a3 3 0 0 1 3-3h10v7zm-6 7h-3v-3h-2v3h-3v2h3v3h2v-3h3z"/></svg></div><p>Thêm Phân Loại</p></div><div class="TP-APP-BOX"data-function="xoaPhanLoai"data-layout="#"data-platform="tiktok"title="Xóa Phân Loại"><div class="app-box-icon"><svg xmlns="http://www.w3.org/2000/svg"id="Layer_1"data-name="Layer 1"viewBox="0 0 24 24"><path d="m21.414,5h-4.414V.586l4.414,4.414Zm-6.414,2V0H5c-1.657,0-3,1.343-3,3v21h20V7h-7Zm1,9h-8v-2h8v2Z"/></svg></div><p>Xóa Phân Loại</p></div><div class="TP-APP-BOX"data-function="layPhanLoai"data-layout="#"data-platform="shopee"title="Lấy Phân Loại"><div class="app-box-icon"><svg xmlns="http://www.w3.org/2000/svg"id="Layer_1"data-name="Layer 1"viewBox="0 0 24 24"width="512"height="512"><path d="m8,5h-4v-1h4V0h1v4h4v1h-4v4h-1v-4Zm15.363,8.182l-9.639,10.818H2.5c-1.378,0-2.5-1.122-2.5-2.5v-7c0-1.378,1.122-2.5,2.5-2.5h10.858c1.208,0,2.229.814,2.542,1.922l3.732-4.102c.451-.496,1.069-.787,1.739-.818.67-.022,1.312.2,1.809.652,1.012.923,1.094,2.505.182,3.527Zm-.856-2.788c-.298-.272-.688-.407-1.088-.393-.403.019-.775.194-1.047.492l-4.495,4.94c-.301.945-1.124,1.678-2.146,1.824l-5.667.738-.129-.991,5.661-.737c.797-.114,1.404-.813,1.404-1.625,0-.905-.737-1.642-1.642-1.642H2.5c-.827,0-1.5.673-1.5,1.5v7c0,.827.673,1.5,1.5,1.5h10.776l9.34-10.483c.549-.615.5-1.567-.109-2.123Z"/></svg></div><p>Lấy Phân Loại</p></div><div class="TP-APP-BOX"data-function="layIDSanPham"data-layout="#"data-platform="shopee,tiktok"title="Lấy ID Sản Phẩm"><div class="app-box-icon"><svg xmlns="http://www.w3.org/2000/svg"width="512"height="512"viewBox="0 0 24 24"fill="#000000"><path fill="#000000"d="M10 7v2H9v6h1v2H6v-2h1V9H6V7h4m6 0a2 2 0 0 1 2 2v6c0 1.11-.89 2-2 2h-4V7m4 2h-2v6h2V9Z"/></svg></div><p>Lấy ID Sản Phẩm</p></div><div class="TP-APP-BOX"data-function="hienThiThemSanPham"data-layout="#"data-platform="sapo"title="Hiển Thị Thêm Danh Sách Sản Phẩm Sàn"><div class="app-box-icon"><svg xmlns="http://www.w3.org/2000/svg"width="512"height="512"viewBox="0 0 48 48"><mask id="ipSMoreTwo0"><g fill="none"><path fill="#fff"stroke="#fff"stroke-linejoin="round"stroke-width="4"d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><circle cx="14"cy="24"r="3"fill="#000"/><circle cx="24"cy="24"r="3"fill="#000"/><circle cx="34"cy="24"r="3"fill="#000"/></g></mask><path fill="currentColor"d="M0 0h48v48H0z"mask="url(#ipSMoreTwo0)"/></svg></div><p>Load Thêm Sản Phẩm</p></div><div class="TP-APP-BOX"data-function="lienKetSKU"data-layout="#"data-platform="sapo"title="Liên Kết SKU"><div class="app-box-icon"><svg xmlns="http://www.w3.org/2000/svg"id="Layer_1"data-name="Layer 1"viewBox="0 0 24 24"><path d="m22.634,7.967c1.819-1.82,1.818-4.78,0-6.6-.881-.882-2.053-1.367-3.3-1.367s-2.419.485-3.3,1.367l-2.667,2.666c-1.576,1.577-1.781,4.007-.626,5.812l-.447.447c-.391.391-.391,1.023,0,1.414.195.195.451.293.707.293s.512-.098.707-.293l.448-.448c.744.478,1.606.741,2.512.741,1.247,0,2.419-.485,3.3-1.367l2.667-2.666Zm-6.997,1.81l2.07-2.07c.391-.391.391-1.023,0-1.414s-1.023-.391-1.414,0l-2.079,2.079c-.409-.97-.222-2.135.567-2.924l2.667-2.666c.503-.504,1.173-.781,1.885-.781s1.382.277,1.886.781c1.04,1.039,1.039,2.731,0,3.771l-2.667,2.666c-.76.76-1.945.945-2.915.558ZM2.793,4.207c-.391-.391-.391-1.023,0-1.414s1.023-.391,1.414,0l2,2c.391.391.391,1.023,0,1.414-.195.195-.451.293-.707.293s-.512-.098-.707-.293l-2-2Zm5.207-1.207V1c0-.553.448-1,1-1s1,.447,1,1v2c0,.553-.448,1-1,1s-1-.447-1-1ZM0,9c0-.553.448-1,1-1h2c.552,0,1,.447,1,1s-.448,1-1,1H1c-.552,0-1-.447-1-1Zm21.207,10.793c.391.391.391,1.023,0,1.414-.195.195-.451.293-.707.293s-.512-.098-.707-.293l-2-2c-.391-.391-.391-1.023,0-1.414s1.023-.391,1.414,0l2,2Zm-5.207,1.207v2c0,.553-.448,1-1,1s-1-.447-1-1v-2c0-.553.448-1,1-1s1,.447,1,1Zm8-6c0,.553-.448,1-1,1h-2c-.552,0-1-.447-1-1s.448-1,1-1h2c.552,0,1,.447,1,1Zm-12.293-2.707c-.391-.391-1.023-.391-1.414,0l-.448.448c-.744-.478-1.606-.741-2.512-.741-1.247,0-2.419.485-3.3,1.367l-2.667,2.666c-1.819,1.82-1.818,4.78,0,6.6.881.882,2.053,1.367,3.3,1.367s2.419-.485,3.3-1.367l2.667-2.666c1.576-1.577,1.781-4.007.626-5.812l.447-.447c.391-.391.391-1.023,0-1.414Zm-2.488,6.26l-2.667,2.666c-1.007,1.007-2.763,1.008-3.771,0-1.04-1.039-1.039-2.731,0-3.771l2.667-2.666c.503-.504,1.173-.781,1.885-.781.364,0,.715.074,1.04.212l-2.081,2.081c-.391.391-.391,1.023,0,1.414.195.195.451.293.707.293s.512-.098.707-.293l2.079-2.079c.409.97.222,2.135-.567,2.924Z"/></svg></div><p>Liên Kết SKU</p></div><div class="TP-APP-BOX"data-function="kiemTraTon"data-layout="#"data-platform="sapo"title="Kiểm Tra Tồn"><div class="app-box-icon"><svg xmlns="http://www.w3.org/2000/svg"width="512"height="512"viewBox="0 0 16 16"fill="#000000"><path fill="#000000"d="M12 6V0H4v6H0v7h16V6h-4zm-5 6H1V7h2v1h2V7h2v5zM5 6V1h2v1h2V1h2v5H5zm10 6H9V7h2v1h2V7h2v5zM0 16h3v-1h10v1h3v-2H0v2z"/></svg></div><p>Kiểm Tra Tồn</p></div><div class="TP-APP-BOX"data-function="splitExcelFile"data-layout="#"data-platform="khac"title="Chia Nhỏ File Excel"><div class="app-box-icon"><svg xmlns="http://www.w3.org/2000/svg"width="512"height="512"viewBox="0 0 100 100"fill="#000000"><path id="gisSplit0"fill="#000000"stroke="none"stroke-dasharray="20.429 10.214"stroke-dashoffset="51.072"stroke-linecap="round"stroke-linejoin="round"stroke-width="10.214"d="M4.727 1.062L0 5.738l9.351 9.455l4.727-4.676Zm14.027 14.182l-4.727 4.676l9.352 9.453l4.727-4.678zm14.028 14.178l-4.726 4.676l9.351 9.453l4.727-4.676z"color="currentColor"/><path id="gisSplit1"fill="#000000"stroke="none"stroke-dasharray="20.429 10.214"stroke-dashoffset="51.072"stroke-linecap="round"stroke-linejoin="round"stroke-width="10.214"d="M43.012 8.948a5.97 5.97 0 0 0-1.938-.294a5.34 5.34 0 0 0-1.466.232L52.901 52.4L8.57 42.154c-.907 3.926 2.787 10.107 8.283 11.378l38.485 8.843l3.881 10.718c-3.788-.293-7.142 3.19-8.192 6.35c-.894 2.835-.855 6.103.142 9.366c.996 3.262 2.789 5.993 5.114 7.845c2.326 1.852 5.405 2.853 8.385 1.943c13.461-5.073 3.564-26.363.78-34.355c9.877 1.708 31.332 9.816 34.352-3.303c.701-3.036-.511-6.036-2.52-8.228c-2.009-2.191-4.856-3.79-8.179-4.557c-3.323-.769-6.454-.913-9.353.505c-2.898 1.418-6.29 4.41-5.788 7.895c-.004.24.007.479.02.718l-10.957-2.993l-11.484-37.78c-1.172-3.835-5.75-6.661-8.527-7.551ZM87.79 53.82c2.271.525 4.126 1.65 5.202 2.824c1.075 1.174 1.327 2.181 1.14 2.987c-.186.805-.852 1.596-2.334 2.179c-1.481.582-3.642.78-5.913.254c-2.272-.525-4.126-1.653-5.201-2.827c-1.076-1.173-1.332-2.176-1.145-2.982c.186-.805.855-1.596 2.336-2.178c.741-.291 1.651-.49 2.66-.546a11.65 11.65 0 0 1 3.255.289zM59.758 78.669c.557.115 1.186.418 1.887.976c1.245.992 2.499 2.76 3.18 4.99c.68 2.23.632 4.4.154 5.92c-.479 1.517-1.22 2.236-2.011 2.477c-.791.242-1.813.06-3.058-.932c-1.245-.992-2.496-2.763-3.177-4.992c-.68-2.23-.632-4.4-.154-5.92c.479-1.517 1.221-2.238 2.012-2.48c.198-.06.41-.094.636-.095c.17-.001.345.018.531.056z"color="currentColor"/></svg></div><p>Chia Nhỏ File Excel</p></div><div class="TP-APP-BOX"data-function="mergeExcelFile"data-layout="#"data-platform="khac"title="Gộp File Excel"><div class="app-box-icon"><svg xmlns="http://www.w3.org/2000/svg"width="512"height="512"viewBox="0 0 24 24"fill="#000000"><path fill="#000000"d="M11 2H2v20h9v-5h2v5h9V2h-9v5h-2zm6.182 8.232L15.415 12l1.767 1.768l-1.414 1.414L12.586 12l3.182-3.182zM8.33 8.818L11.512 12L8.33 15.182l-1.414-1.414L8.684 12l-1.768-1.767z"/></svg></div><p>Gộp File Excel</p></div><div class="TP-APP-BOX"data-function="compareVoucher"data-layout="#"data-platform="khac"title="So Sánh Voucher"><div class="app-box-icon"><svg xmlns="http://www.w3.org/2000/svg"width="512"height="512"viewBox="0 0 24 24"fill="#000000"><path fill="#000000"fill-rule="evenodd"d="M13 2a1 1 0 1 0-2 0v1H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h5v1a1 1 0 0 0 2 0v-1a1 1 0 0 0 0-2V5a1 1 0 1 0 0-2V2Zm4 1a1 1 0 1 0 0 2h1a1 1 0 0 1 1 1v1a1 1 0 1 0 2 0V6a3 3 0 0 0-3-3h-1Zm4 8a1 1 0 1 0-2 0v2a1 1 0 0 0 2 0v-2Zm0 6a1 1 0 1 0-2 0v1a1 1 0 0 1-1 1h-1a1 1 0 1 0 0 2h1a3 3 0 0 0 3-3v-1Z"clip-rule="evenodd"/></svg></div><p>So Sánh Voucher</p></div><div class="TP-APP-BOX"data-function="moLink"data-layout="#"data-platform="khac"title="Mở Link Hàng Loạt"><div class="app-box-icon"><svg xmlns="http://www.w3.org/2000/svg"width="512"height="512"viewBox="0 0 512 512"fill="#000000"><path fill="#000000"d="M224 304a16 16 0 0 1-11.31-27.31l157.94-157.94A55.7 55.7 0 0 0 344 112H104a56.06 56.06 0 0 0-56 56v240a56.06 56.06 0 0 0 56 56h240a56.06 56.06 0 0 0 56-56V168a55.7 55.7 0 0 0-6.75-26.63L235.31 299.31A15.92 15.92 0 0 1 224 304Z"/><path fill="#000000"d="M448 48H336a16 16 0 0 0 0 32h73.37l-38.74 38.75a56.35 56.35 0 0 1 22.62 22.62L432 102.63V176a16 16 0 0 0 32 0V64a16 16 0 0 0-16-16Z"/></svg></div><p>Mở Link Hàng Loạt</p></div><div class="TP-APP-BOX"data-function="tinhGiaBan"data-layout="#"data-platform="khac"title="Tính Giá Bán"><div class="app-box-icon"><svg xmlns="http://www.w3.org/2000/svg"width="512"height="512"viewBox="0 0 14 14"fill="#000000"><path fill="#000000"fill-rule="evenodd"d="M6.375 0H2.5A2.5 2.5 0 0 0 0 2.5v3.875h6.375zM0 11.5V7.625h6.375V14H2.5A2.5 2.5 0 0 1 0 11.5M7.625 14V7.625H14V11.5a2.5 2.5 0 0 1-2.5 2.5zM14 2.5v3.875H7.625V0H11.5A2.5 2.5 0 0 1 14 2.5m-11.967.225a.625.625 0 0 0 0 1.25h.625V4.6a.625.625 0 1 0 1.25 0v-.625h.625a.625.625 0 0 0 0-1.25h-.625V2.1a.625.625 0 0 0-1.25 0v.625zm6.992.625c0-.346.28-.625.625-.625h2a.625.625 0 0 1 0 1.25h-2a.625.625 0 0 1-.625-.625m.625 5.682a.625.625 0 1 0 0 1.25h2a.625.625 0 1 0 0-1.25zm-.625 2.625c0-.345.28-.625.625-.625h2a.625.625 0 1 1 0 1.25h-2a.625.625 0 0 1-.625-.625M1.781 9.215a.625.625 0 0 1 .884 0l.618.618l.618-.618a.625.625 0 1 1 .884.884l-.618.618l.618.618a.625.625 0 0 1-.884.884l-.618-.618l-.618.618a.625.625 0 0 1-.884-.884l.618-.618l-.618-.618a.625.625 0 0 1 0-.884"clip-rule="evenodd"/></svg></div><p>Tính Giá Bán</p></div><div class="TP-APP-BOX"data-function="ktraGiaChuongTrinhKM"data-layout="#"data-platform="lazada"title="Kiểm Tra Giá Chương Trình KM"><div class="app-box-icon"><i class="bx bx-scan-search"></i></div><p>Kiểm Tra Giá Chương Trình KM</p></div><div class="TP-APP-BOX"data-function="ktraKhuyenMai"data-layout="#"data-platform="tiktok"title="Kiểm Tra Khuyến Mãi"><div class="app-box-icon"><svg xmlns="http://www.w3.org/2000/svg"width="512"height="512"viewBox="0 0 24 24"fill="#000000"><path fill="#000000"fill-rule="evenodd"d="M9.592 3.2a5.574 5.574 0 0 1-.495.399c-.298.2-.633.338-.985.408c-.153.03-.313.043-.632.068c-.801.064-1.202.096-1.536.214a2.713 2.713 0 0 0-1.655 1.655c-.118.334-.15.735-.214 1.536a5.707 5.707 0 0 1-.068.632c-.07.352-.208.687-.408.985c-.087.13-.191.252-.399.495c-.521.612-.782.918-.935 1.238c-.353.74-.353 1.6 0 2.34c.153.32.414.626.935 1.238c.208.243.312.365.399.495c.2.298.338.633.408.985c.03.153.043.313.068.632c.064.801.096 1.202.214 1.536a2.713 2.713 0 0 0 1.655 1.655c.334.118.735.15 1.536.214c.319.025.479.038.632.068c.352.07.687.209.985.408c.13.087.252.191.495.399c.612.521.918.782 1.238.935c.74.353 1.6.353 2.34 0c.32-.153.626-.414 1.238-.935c.243-.208.365-.312.495-.399c.298-.2.633-.338.985-.408c.153-.03.313-.043.632-.068c.801-.064 1.202-.096 1.536-.214a2.713 2.713 0 0 0 1.655-1.655c.118-.334.15-.735.214-1.536c.025-.319.038-.479.068-.632c.07-.352.209-.687.408-.985c.087-.13.191-.252.399-.495c.521-.612.782-.918.935-1.238c.353-.74.353-1.6 0-2.34c-.153-.32-.414-.626-.935-1.238a5.574 5.574 0 0 1-.399-.495a2.713 2.713 0 0 1-.408-.985a5.72 5.72 0 0 1-.068-.632c-.064-.801-.096-1.202-.214-1.536a2.713 2.713 0 0 0-1.655-1.655c-.334-.118-.735-.15-1.536-.214a5.707 5.707 0 0 1-.632-.068a2.713 2.713 0 0 1-.985-.408a5.73 5.73 0 0 1-.495-.399c-.612-.521-.918-.782-1.238-.935a2.713 2.713 0 0 0-2.34 0c-.32.153-.626.414-1.238.935Zm6.239 4.97a.814.814 0 0 1 0 1.15L9.32 15.832a.814.814 0 1 1-1.15-1.15l6.51-6.511a.814.814 0 0 1 1.15 0Zm-.033 6.543a1.085 1.085 0 1 1-2.17 0a1.085 1.085 0 0 1 2.17 0Zm-6.51-4.34a1.085 1.085 0 1 0 0-2.17a1.085 1.085 0 0 0 0 2.17Z"clip-rule="evenodd"/></svg></div><p>Kiểm Tra Khuyến Mãi</p></div><div class="TP-APP-BOX"data-function="chinhSuaKhuyenMai"data-layout="#"data-platform="tiktok"title="Chỉnh Sửa Khuyến Mãi"><div class="app-box-icon"><svg xmlns="http://www.w3.org/2000/svg"width="512"height="512"viewBox="0 0 24 24"fill="#000000"><path fill="none"stroke="#000000"stroke-linecap="round"stroke-linejoin="round"stroke-width="1.5"d="M16.946 3.173c.587-.587.88-.88 1.206-1.021c.469-.203 1-.203 1.469 0c.325.14.619.434 1.206 1.021s.88.881 1.021 1.206c.203.469.203 1 0 1.469c-.14.325-.434.619-1.021 1.206l-5.022 5.022c-1.237 1.237-1.855 1.855-2.63 2.222s-1.646.452-3.387.624L9 15l.078-.788c.172-1.741.257-2.612.624-3.387s.985-1.393 2.222-2.63zM6 15H3.75a1.75 1.75 0 1 0 0 3.5h9.5a1.75 1.75 0 1 1 0 3.5H11"color="currentColor"/></svg></div><p>Chỉnh Sửa Khuyến Mãi</p></div></div><div class="layout-future"><button class="back">Trở Lại</button><div class="tutorial"><p class="title">Hướng Dẫn</p><div class="tutorial-container"><p>Hướng dẫn sử dụng chức năng</p></div></div><div class="layout-tab giaDuoi"><p>Giá cao nhất: <span class="max-price">0</span></p><p>Giá thấp nhất: <span class="min-price">0</span></p><p>Giá đề xuất: <span class="avg-price">0</span></p></div><div class="layout-tab flashSale"><textarea class="data"></textarea></div><div class="layout-tab giaDuoiChuongTrinh"><label for="discount">Giảm của giá đuôi</label> <label for="money"><p>Tiền Mặt</p><input type="radio"name="discount-type"id="money"></label> <label for="percent"><p>Phần Trăm</p><input type="radio"name="discount-type"id="percent"></label> <input id="tp-discount"></div><div class="layout-tab kTr5LanGia"><p>Giá Cao Nhất: <span id="maxSku">XXX-XXX</span> <span id="maxPrice">0</span></p><p>Giá Thấp Nhất: <span id="minSku">XXX-XXX</span> <span id="minPrice">0</span></p><p>Giá Đề Xuất: <span id="suggestPrice">0</span></p></div><div class="layout-tab saoChepFlashSale"><input class="copy-link"placeholder="Link để sao chép"><div class="button-control-promotion"><button class="add-promotion">Thêm Chương Trình Mới</button></div><div class="area-promotion"><div style="display:none;justify-content:center;align-items:center;gap:2vw"class="box-promotion root"><input class="name"placeholder="Tên chương trình"><span class="count-character">0/50</span> <input class="time-start"type="datetime-local"placeholder="Bắt đầu"> <input class="time-end"type="datetime-local"placeholder="Kết thúc"> <button class="remove-promotion"style="background:#dc143c;color:#fff;font-weight:700">Xóa</button></div></div></div><div class="layout-tab kiemTraMaPhanLoai"><p>Đây là nội dung cho Kiểm Tra Mã Phân Loại.</p></div><div class="layout-tab suaGiaTheoSKU"><p>Cách sửa giá:</p><select id="type"><option data-type="all">Tất cả</option><option data-type="duoi">Giá đuôi</option><option data-type="dau">Giá đầu</option></select> <textarea id="data"placeholder="Mỗi SKU là một dòng, và các thuộc tính dưới đây sẽ cách nhau 1 tab\n-SKU: Bắt buộc (ABC123-DEF456 hoặc ABC123)\n-Giá: Bắt buộc"></textarea></div><div class="layout-tab suaHinhTheoSKU"><input type="file"webkitdirectory directory multiple="multiple"><p>Tải lên thư mục có chứa hình ảnh, không cần tải lên từng hình</p><p style="font-weight:700;color:#dc143c">*Tên hình ảnh phải là SKU của sản phẩm</p></div><div class="layout-tab suaTenPhanLoaiSKU"><p>Nội dung sửa tên phân loại SKU.</p></div><div class="layout-tab kiemTraPhanLoai"><select id="group"><option>Phân Loại 1</option><option>Phân Loại 2</option></select> <label for="type">Dò Chính Xác <input id="type"type="checkbox"></label> <textarea id="data"></textarea></div><div class="layout-tab themPhanLoai"><input id="group"placeholder="Nhóm phân loại"value="1"> <textarea id="phanLoai"placeholder="Nhập phân loại \nPhân Loại A, Phân Loại B, Phận Loại C, ...">Phân Loại A, Phân Loại B, Phận Loại C</textarea></div><div class="layout-tab xoaPhanLoai"><textarea id="data"placeholder="Nhập SKU cần xóa, mỗi SKU là một dòng"></textarea></div><div class="layout-tab layPhanLoai"><p>Số lượng tùy chỉnh?</p><input id="stock-edit"type="number"placeholder="Mặc định số lượng = 0"><div style="display:flex;justify-content:center;align-items:center"><p>Lấy số lượng theo sàn</p><input type="checkbox"id="getStock"></div></div><div class="layout-tab layIDSanPham"><label for="copy-type">Lấy đường dẫn sản phẩm</label> <input type="checkbox"id="copy-type"><p style="font-weight:700;color:#dc143c">*Mặc định chỉ lấy ID sản phẩm</p></div><div class="layout-tab hienThiThemSanPham"><p>Nội dung hiển thị thêm danh sách sản phẩm Sapo.</p></div><div class="layout-tab lienKetSKU"><p>Cách liên kết SKU</p><div class="switch-wrapper"><span class="switch-label">Tự Động</span> <label class="switch"><input type="checkbox"id="toggle-switch"checked="checked"><div class="slider"><div class="slider-handle"></div></div></label> <span class="switch-label">Thủ Công</span></div></div><div class="layout-tab kiemTraTon"><textarea id="data"></textarea></div><div class="layout-tab splitExcelFile"><input type="file"id="fileInput"accept=".xlsx, .xls"><br><br><label>Số dòng đầu giữ lại (header + mô tả...):</label> <input type="number"id="rowsToPreserve"value="1"min="0"><br><label>Số dòng mỗi file:</label> <input type="number"id="rowsPerFile"value="100"min="1"></div><div class="layout-tab mergeExcelFile"><input type="file"id="mergeFileInput"multiple="multiple"accept=".xlsx, .xls"><br><br><label>Dòng header:</label> <input type="number"id="headerRowsCount"value="1"min="0"><br><label>Số dòng mô tả:</label> <input type="number"id="descriptionRowsCount"value="100"min="1"></div><div class="layout-tab compareVoucher"><button id="addVoucher">Thêm Voucher</button> <textarea id="data"></textarea><div class="voucher-box"><table><thead><tr><td>Kiểm Tra</td><td>Tiền Giảm</td><td>Giảm Tối Đa</td><td>Đơn Tối Thiểu</td><td></td></tr></thead><tbody><tr class="voucher-box root"hidden><td class="checked-box"></td><td class="discount-percent"><input> <select><option>%</option><option><u>đ</u></option></select></td><td class="max-discount"><input></td><td class="condition-deal"><input></td><td class="remove-voucher">Xóa Voucher</td></tr><tr class="voucher-box"><td class="checked-box"></td><td class="discount-percent"><input> <select><option>%</option><option><u>đ</u></option></select></td><td class="max-discount"><input></td><td class="condition-deal"><input></td><td class="remove-voucher">Xóa Voucher</td></tr></tbody></table></div></div><div class="layout-tab moLink"><textarea id="data"placeholder="Nhập đường dẫn, mỗi đường dẫn trên một dòng"></textarea></div><div class="layout-tab tinhGiaBan"><div class="input-cost"><label for="cost">Nhập Giá Vốn</label> <input id="cost"maxlength="15"placeholder="Nhập giá vốn (đầy đủ số)"></div><div class="output-cost"><p>Giá sau Khuyễn mãi: <span id="after-price"></span></p><p>Giá trước Khuyễn mãi: <span id="before-price"></span></p><p>Giá Đăng Bán: <span id="last-price"></span></p></div></div><div class="layout-tab ktraGiaChuongTrinhKM"><textarea id="group"placeholder="Nhập từ khóa của nhóm:\nSố phần trăm, key1, key2, key3,.. \nSố phần trăm, key1, key2, key3,..."></textarea></div><div class="layout-tab thongKeDonHang"><p>Nội dung thống kê đơn hàng.</p></div><div class="layout-tab chinhSuaFlashSale"><p>Nội dung chỉnh sửa Flash Sale.</p></div><div class="layout-tab timkiemTheoSKU"><input id="skuInput"placeholder="Nhập SKU sản phẩm"> <button id="searchSkuButton">Tìm Kiếm</button></div><div class="layout-tab kiemTraThuocTinh"><p>Nội dung kiểm tra thuộc tính.</p></div><div class="button-control"><button id="excuse-command">Thực Hiện</button></div></div></div><div class="screen-content server-screen"><p>Máy chủ hiện tại: <span id="current-server">Chưa kết nối</span></p><div class="server-list"></div><button id="connect-server">Kết Nối Máy Chủ</button></div></div><div class="footer-content"><div class="bottom-navbar"><div class="navbar-item"data-screen="config-screen"><i class="bxr bx-cog"></i></div><div class="navbar-item"data-screen="home-screen"><i class="bxr bx-home"></i></div><div class="navbar-item"data-screen="server-screen"><i class="bxr bx-server"></i></div></div></div></div>
		`;

    const CSS_TOOL_UI = `
			body #clr-picker{z-index:999999999}body.tp-theme-light{--background-notification-bar: rgba(138,138,138,0.2);--background-blur-notification-bar: 20px;--background-switch-label: #ff9a9a;--background-switch-theme-label-hover: #fff;--text-switch-label: #fff;--text-switch-label-hover: #000;--background-color-main-content: #ffbaba;--background-image-main-content: url("https://github.com/pntan/TPTOOL/blob/main/background-button-toggle.gif?raw=true");--background-image-repeat-main-content: no-repeat;--background-image-size-main-content: contain;--background-image-position-main-content: 0% 50%;--background-image-blur-main-content: 5px;--text-main-content: #000;--text-header: #000;--background-config-group: rgba(255,255,255,0.603);--text-config-group: #000;--text-bottom-navbar: #000;--background-icon-app: #fff;--text-icon-app: #000;--text-choice-box: #fff;--text-choice-box-active: #000;--choice-box-border: 2px solid #f90;--choice-box-border-active: none;--background-choice-box-active: #f90;--select-box-border: 2px solid #000;--background-select-box: #fff;--text-select-box: #000;--background-select-option-box: #fff;--text-select-option-box: #000;--color-icon-gia-duoi: #ffb6c1;--color-icon-flash-sale: #fecdd3;--color-icon-gia-chuong-trinh: #ffe5b4;--color-icon-kiem-tra-gia: #fde047;--color-icon-sao-chep: #b6e7a9;--color-icon-ma-phan-loai: #bfdbfe;--color-icon-sua-gia: #ddd6fe;--color-icon-sua-hinh: #fc0;--color-icon-sua-ten-phan-loai: #ffaf70;--color-icon-kiem-tra-phan-loai: #a5d6a7;--color-icon-them-phan-loai: #93c5fd;--color-icon-xoa-phan-loai: #d8b4fe;--color-icon-lay-phan-loai: #ffedd5;--color-icon-lay-id-san-pham: #b3d9ff;--color-icon-hien-thi-them-san-pham: #fce7f3;--color-icon-lien-ket-sku: #d4f1f4;--color-icon-kiem-tra-ton: #b57edc;--color-icon-chia-excel: #86efac;--color-icon-gop-excel: #c4b5fd;--color-icon-so-sanh-voucher: #fff5b7;--color-icon-mo-link: #ffcc80;--color-icon-tinh-gia-ban: #a1c4e1;--color-icon-ktra-gia-chuong-trinh-km: #e9d5ff;--color-icon-ktra-khuyen-mai: #ffc6c6;--color-icon-chinh-sua-khuyen-mai: #b0bf1a;--color-icon-thong-ke-don-hang: #ffdab9;--color-icon-chinh-sua-flash-sale: #a5d6a7;--color-icon-tim-kiem-sku: #ecfccb;--color-icon-kiem-tra-thuoc-tinh: #b3e6ff;--background-color-button-toggle: #fff;--background-image-button-toggle: url("https://github.com/pntan/TPTOOL/blob/main/background-button-toggle.gif?raw=true");--border-button-toggle: 2px solid #000;--text-button-toggle: #000;--background-toast-success: #7bff93;--background-toast-error: #ff6262;--background-toast-warning: #ff551c;--background-toast-info: #00bfff}body.tp-theme-dark{--background-notification-bar: rgba(138,138,138,0.5);--background-blur-notification-bar: 20px;--background-switch-label: #2d2d2d;--background-switch-theme-label-hover: #4a4a4a;--text-switch-label: #e0e0e0;--text-switch-label-hover: #fff;--background-color-main-content: #1e1e1e;--background-image-main-content: url("https://github.com/pntan/TPTOOL/blob/main/background-button-toggle.gif?raw=true");--background-image-repeat-main-content: no-repeat;--background-image-size-main-content: contain;--background-image-position-main-content: 0% 50%;--background-image-blur-main-content: 5px;--text-main-content: #fff;--text-header: #fff;--background-config-group: rgba(30,30,30,0.603);--text-config-group: #e0e0e0;--text-bottom-navbar: #fff;--background-icon-app: #2a2a2a;--text-icon-app: #e0e0e0;--text-choice-box: #fff;--text-choice-box-active: #000;--choice-box-border: 2px solid #fff;--choice-box-border-active: none;--background-choice-box-active: #fff;--select-box-border: 2px solid #fdfdfd;--background-select-box: #a5a5a5;--text-select-box: #0c0c0c;--background-select-option-box: #b1b1b1;--text-select-option-box: #000;--color-icon-gia-duoi: #ffb6c1;--color-icon-flash-sale: #fecdd3;--color-icon-gia-chuong-trinh: #ffe5b4;--color-icon-kiem-tra-gia: #fde047;--color-icon-sao-chep: #b6e7a9;--color-icon-ma-phan-loai: #bfdbfe;--color-icon-sua-gia: #ddd6fe;--color-icon-sua-hinh: #fc0;--color-icon-sua-ten-phan-loai: #ffaf70;--color-icon-kiem-tra-phan-loai: #a5d6a7;--color-icon-them-phan-loai: #93c5fd;--color-icon-xoa-phan-loai: #d8b4fe;--color-icon-lay-phan-loai: #ffedd5;--color-icon-lay-id-san-pham: #b3d9ff;--color-icon-hien-thi-them-san-pham: #fce7f3;--color-icon-lien-ket-sku: #d4f1f4;--color-icon-kiem-tra-ton: #b57edc;--color-icon-chia-excel: #86efac;--color-icon-gop-excel: #c4b5fd;--color-icon-so-sanh-voucher: #fff5b7;--color-icon-mo-link: #ffcc80;--color-icon-tinh-gia-ban: #a1c4e1;--color-icon-ktra-gia-chuong-trinh-km: #e9d5ff;--color-icon-ktra-khuyen-mai: #ffc6c6;--color-icon-chinh-sua-khuyen-mai: #b0bf1a;--color-icon-thong-ke-don-hang: #ffdab9;--color-icon-chinh-sua-flash-sale: #a5d6a7;--color-icon-tim-kiem-sku: #ecfccb;--color-icon-kiem-tra-thuoc-tinh: #b3e6ff;--background-color-button-toggle: #000;--background-image-button-toggle: url("https://github.com/pntan/TPTOOL/blob/main/background-button-toggle.gif?raw=true");--border-button-toggle: 2px solid #000;--text-button-toggle: #000;--background-toast-success: #12a32d;--background-toast-error: #af0000;--background-toast-warning: #ad4e00;--background-toast-info: #4092ad}.tp-container{display:flex;flex-direction:column;position:fixed;z-index:9999999;font-size:14px}.tp-container *{user-select:none;margin:0;padding:0;border:none;font-family:"Montserrat",Segoe UI,sans-serif;box-sizing:border-box}.tp-container *::-webkit-scrollbar{display:none;width:0}.tp-container .TP-APPVIEW{position:absolute;width:100%;height:100%;overflow-y:auto;display:flex;align-items:flex-start;align-content:flex-start;justify-content:space-around;flex-wrap:wrap;gap:1vw;padding:.25vh .5vw;box-sizing:border-box}.tp-container .TP-APPVIEW.hidden{transform:translateX(-100%)}.tp-container .TP-APPVIEW .TP-APP-BOX{width:calc(100% / 3.5);height:auto;aspect-ratio:1/1;display:flex;align-items:center;justify-content:center;flex-direction:column;font-size:.8em;text-align:center;padding:2vh .5vw;border-radius:18%;cursor:pointer;transition:all .2s ease-out;background-color:var(--background-icon-app);transform:scale(.8)}.tp-container .TP-APPVIEW .TP-APP-BOX .app-box-icon{width:70%;height:70%;display:flex;align-items:center;justify-content:center;margin-bottom:.5vh}.tp-container .TP-APPVIEW .TP-APP-BOX img,.tp-container .TP-APPVIEW .TP-APP-BOX svg,.tp-container .TP-APPVIEW .TP-APP-BOX i,.tp-container .TP-APPVIEW .TP-APP-BOX i[class^="bx"]{max-width:100%;max-height:100%;object-fit:contain;font-size:3em}.tp-container .TP-APPVIEW .TP-APP-BOX p{font-size:.9em;font-weight:500;line-height:1.2;color:var(--text-icon-app);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;text-overflow:ellipsis;max-width:90%}.tp-container .TP-APPVIEW .TP-APP-BOX:hover{transform:translateY(-3px)}.tp-container .TP-APPVIEW .TP-APP-BOX:active{transform:scale(.95)}.tp-container .TP-APPVIEW .TP-APP-BOX.disabled{opacity:.6;cursor:not-allowed;pointer-events:none;filter:grayscale(100%)}.tp-container .TP-APPVIEW .TP-APP-BOX[data-function="giaDuoi"] .app-box-icon *,.tp-container .TP-APPVIEW .TP-APP-BOX svg,.tp-container .TP-APPVIEW .TP-APP-BOX svg path{color:var(--color-icon-gia-duoi);fill:var(--color-icon-gia-duoi)}.tp-container .TP-APPVIEW .TP-APP-BOX[data-function="flashSale"] .app-box-icon *,.tp-container .TP-APPVIEW .TP-APP-BOX svg,.tp-container .TP-APPVIEW .TP-APP-BOX svg path{color:var(--color-icon-flash-sale);fill:var(--color-icon-flash-sale)}.tp-container .TP-APPVIEW .TP-APP-BOX[data-function="giaDuoiChuongTrinh"] .app-box-icon *,.tp-container .TP-APPVIEW .TP-APP-BOX svg,.tp-container .TP-APPVIEW .TP-APP-BOX svg path{color:var(--color-icon-gia-chuong-trinh);fill:var(--color-icon-gia-chuong-trinh)}.tp-container .TP-APPVIEW .TP-APP-BOX[data-function="kTr5LanGia"] .app-box-icon *,.tp-container .TP-APPVIEW .TP-APP-BOX svg,.tp-container .TP-APPVIEW .TP-APP-BOX svg path{color:var(--color-icon-kiem-tra-gia);fill:var(--color-icon-kiem-tra-gia)}.tp-container .TP-APPVIEW .TP-APP-BOX[data-function="saoChepFlashSale"] .app-box-icon *,.tp-container .TP-APPVIEW .TP-APP-BOX svg,.tp-container .TP-APPVIEW .TP-APP-BOX svg path{color:var(--color-icon-sao-chep);fill:var(--color-icon-sao-chep)}.tp-container .TP-APPVIEW .TP-APP-BOX[data-function="kiemTraMaPhanLoai"] .app-box-icon *,.tp-container .TP-APPVIEW .TP-APP-BOX svg,.tp-container .TP-APPVIEW .TP-APP-BOX svg path{color:var(--color-icon-ma-phan-loai);fill:var(--color-icon-ma-phan-loai)}.tp-container .TP-APPVIEW .TP-APP-BOX[data-function="suaGiaTheoSKU"] .app-box-icon *,.tp-container .TP-APPVIEW .TP-APP-BOX svg,.tp-container .TP-APPVIEW .TP-APP-BOX svg path{color:var(--color-icon-sua-gia);fill:var(--color-icon-sua-gia)}.tp-container .TP-APPVIEW .TP-APP-BOX[data-function="suaHinhTheoSKU"] .app-box-icon *,.tp-container .TP-APPVIEW .TP-APP-BOX svg,.tp-container .TP-APPVIEW .TP-APP-BOX svg path{color:var(--color-icon-sua-hinh);fill:var(--color-icon-sua-hinh)}.tp-container .TP-APPVIEW .TP-APP-BOX[data-function="suaTenPhanLoaiSKU"] .app-box-icon *,.tp-container .TP-APPVIEW .TP-APP-BOX svg,.tp-container .TP-APPVIEW .TP-APP-BOX svg path{color:var(--color-icon-sua-ten-phan-loai);fill:var(--color-icon-sua-ten-phan-loai)}.tp-container .TP-APPVIEW .TP-APP-BOX[data-function="kiemTraPhanLoai"] .app-box-icon *,.tp-container .TP-APPVIEW .TP-APP-BOX svg,.tp-container .TP-APPVIEW .TP-APP-BOX svg path{color:var(--color-icon-kiem-tra-phan-loai);fill:var(--color-icon-kiem-tra-phan-loai)}.tp-container .TP-APPVIEW .TP-APP-BOX[data-function="themPhanLoai"] .app-box-icon *,.tp-container .TP-APPVIEW .TP-APP-BOX svg,.tp-container .TP-APPVIEW .TP-APP-BOX svg path{color:var(--color-icon-them-phan-loai);fill:var(--color-icon-them-phan-loai)}.tp-container .TP-APPVIEW .TP-APP-BOX[data-function="xoaPhanLoai"] .app-box-icon *,.tp-container .TP-APPVIEW .TP-APP-BOX svg,.tp-container .TP-APPVIEW .TP-APP-BOX svg path{color:var(--color-icon-xoa-phan-loai);fill:var(--color-icon-xoa-phan-loai)}.tp-container .TP-APPVIEW .TP-APP-BOX[data-function="layPhanLoai"] .app-box-icon *,.tp-container .TP-APPVIEW .TP-APP-BOX svg,.tp-container .TP-APPVIEW .TP-APP-BOX svg path{color:var(--color-icon-lay-phan-loai);fill:var(--color-icon-lay-phan-loai)}.tp-container .TP-APPVIEW .TP-APP-BOX[data-function="layIDSanPham"] .app-box-icon *,.tp-container .TP-APPVIEW .TP-APP-BOX svg,.tp-container .TP-APPVIEW .TP-APP-BOX svg path{color:var(--color-icon-lay-id-san-pham);fill:var(--color-icon-lay-id-san-pham)}.tp-container .TP-APPVIEW .TP-APP-BOX[data-function="hienThiThemSanPham"] .app-box-icon *,.tp-container .TP-APPVIEW .TP-APP-BOX svg,.tp-container .TP-APPVIEW .TP-APP-BOX svg path{color:var(--color-icon-hien-thi-them-san-pham);fill:var(--color-icon-hien-thi-them-san-pham)}.tp-container .TP-APPVIEW .TP-APP-BOX[data-function="lienKetSKU"] .app-box-icon *,.tp-container .TP-APPVIEW .TP-APP-BOX svg,.tp-container .TP-APPVIEW .TP-APP-BOX svg path{color:var(--color-icon-lien-ket-sku);fill:var(--color-icon-lien-ket-sku)}.tp-container .TP-APPVIEW .TP-APP-BOX[data-function="kiemTraTon"] .app-box-icon *,.tp-container .TP-APPVIEW .TP-APP-BOX svg,.tp-container .TP-APPVIEW .TP-APP-BOX svg path{color:var(--color-icon-kiem-tra-ton);fill:var(--color-icon-kiem-tra-ton)}.tp-container .TP-APPVIEW .TP-APP-BOX[data-function="splitExcelFile"] .app-box-icon *,.tp-container .TP-APPVIEW .TP-APP-BOX svg,.tp-container .TP-APPVIEW .TP-APP-BOX svg path{color:var(--color-icon-chia-excel);fill:var(--color-icon-chia-excel)}.tp-container .TP-APPVIEW .TP-APP-BOX[data-function="mergeExcelFile"] .app-box-icon *,.tp-container .TP-APPVIEW .TP-APP-BOX svg,.tp-container .TP-APPVIEW .TP-APP-BOX svg path{color:var(--color-icon-gop-excel);fill:var(--color-icon-gop-excel)}.tp-container .TP-APPVIEW .TP-APP-BOX[data-function="compareVoucher"] .app-box-icon *,.tp-container .TP-APPVIEW .TP-APP-BOX svg,.tp-container .TP-APPVIEW .TP-APP-BOX svg path{color:var(--color-icon-so-sanh-voucher);fill:var(--color-icon-so-sanh-voucher)}.tp-container .TP-APPVIEW .TP-APP-BOX[data-function="moLink"] .app-box-icon *,.tp-container .TP-APPVIEW .TP-APP-BOX svg,.tp-container .TP-APPVIEW .TP-APP-BOX svg path{color:var(--color-icon-mo-link);fill:var(--color-icon-mo-link)}.tp-container .TP-APPVIEW .TP-APP-BOX[data-function="tinhGiaBan"] .app-box-icon *,.tp-container .TP-APPVIEW .TP-APP-BOX svg,.tp-container .TP-APPVIEW .TP-APP-BOX svg path{color:var(--color-icon-tinh-gia-ban);fill:var(--color-icon-tinh-gia-ban)}.tp-container .TP-APPVIEW .TP-APP-BOX[data-function="ktraGiaChuongTrinhKM"] .app-box-icon *,.tp-container .TP-APPVIEW .TP-APP-BOX svg,.tp-container .TP-APPVIEW .TP-APP-BOX svg path{color:var(--color-icon-ktra-gia-chuong-trinh-km);fill:var(--color-icon-ktra-gia-chuong-trinh-km)}.tp-container .TP-APPVIEW .TP-APP-BOX[data-function="ktraKhuyenMai"] .app-box-icon *,.tp-container .TP-APPVIEW .TP-APP-BOX svg,.tp-container .TP-APPVIEW .TP-APP-BOX svg path{color:var(--color-icon-ktra-khuyen-mai);fill:var(--color-icon-ktra-khuyen-mai)}.tp-container .TP-APPVIEW .TP-APP-BOX[data-function="chinhSuaKhuyenMai"] .app-box-icon *,.tp-container .TP-APPVIEW .TP-APP-BOX svg,.tp-container .TP-APPVIEW .TP-APP-BOX svg path{color:var(--color-icon-chinh-sua-khuyen-mai);fill:var(--color-icon-chinh-sua-khuyen-mai)}.tp-container .TP-APPVIEW .TP-APP-BOX[data-function="thongKeDonHang"] .app-box-icon *,.tp-container .TP-APPVIEW .TP-APP-BOX svg,.tp-container .TP-APPVIEW .TP-APP-BOX svg path{color:var(--color-icon-thong-ke-don-hang);fill:var(--color-icon-thong-ke-don-hang)}.tp-container .TP-APPVIEW .TP-APP-BOX[data-function="chinhSuaFlashSale"] .app-box-icon *,.tp-container .TP-APPVIEW .TP-APP-BOX svg,.tp-container .TP-APPVIEW .TP-APP-BOX svg path{color:var(--color-icon-chinh-sua-flash-sale);fill:var(--color-icon-chinh-sua-flash-sale)}.tp-container .TP-APPVIEW .TP-APP-BOX[data-function="timkiemTheoSKU"] .app-box-icon *,.tp-container .TP-APPVIEW .TP-APP-BOX svg,.tp-container .TP-APPVIEW .TP-APP-BOX svg path{color:var(--color-icon-tim-kiem-sku);fill:var(--color-icon-tim-kiem-sku)}.tp-container .TP-APPVIEW .TP-APP-BOX[data-function="kiemTraThuocTinh"] .app-box-icon *,.tp-container .TP-APPVIEW .TP-APP-BOX svg,.tp-container .TP-APPVIEW .TP-APP-BOX svg path{color:var(--color-icon-kiem-tra-thuoc-tinh);fill:var(--color-icon-kiem-tra-thuoc-tinh)}.tp-container .TP-input-file{width:100%;height:auto}.tp-container .TP-input-file .TP-input-view{position:relative;width:100%;height:5vh;line-height:5vh}.tp-container .TP-input-file .TP-input-view *{position:absolute}.tp-container .TP-input-file .TP-input-view input{opacity:0;z-index:2}.tp-container .TP-input-file .TP-input-view p{width:100%;text-align:center;z-index:1;color:var(--text-black)}.tp-container .TP-input-file .TP-file-view{width:100%;height:auto;max-height:12vh;overflow:scroll;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:1vh 1vw;scroll-behavior:smooth}.tp-container .TP-input-file .TP-file-view .TP-file-box{width:40%;height:auto;display:flex;flex-direction:row;align-items:center;gap:5px;flex-wrap:wrap}.tp-container .TP-input-file .TP-file-view .TP-file-box p{font-size:.6em;color:var(--text-black)}.tp-container .TP-input-file .TP-file-view .TP-file-box img{max-width:100%;max-height:100%;object-fit:contain}.tp-container .TP-choice-box{width:25%;height:auto;font-size:.7em;margin:.5vw .5vh;border-radius:5px;display:flex;align-items:center;justify-content:center;text-align:center;border-radius:10px;overflow:hidden;border:var(--choice-box-border);aspect-ratio:1/1}.tp-container .TP-choice-box input{display:none}.tp-container .TP-choice-box input:checked ~ label{background-color:var(--background-choice-box-active);border:var(--choice-box-border-active);color:var(--text-choice-box-active)}.tp-container .TP-choice-box label{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;font-weight:700;padding:1vh .5vw;color:var(--text-black);word-break:break-word;overflow-y:auto;box-sizing:border-box;transition:.5s;color:var(--text-choice-box)}.tp-container .TP-select{width:100%;height:auto;position:relative;font-family:sans-serif;border:var(--select-box-border);border-radius:5px}.tp-container .TP-select .TP-select-choice{width:100%;height:5vh;display:flex;gap:5px;align-items:center;justify-content:space-around;cursor:pointer;box-sizing:border-box;background:var(--background-select-box);color:var(--text-select-box)}.tp-container .TP-select .TP-select-choice .option-name{width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:0 10px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;gap:1vw;color:#000;font-size:.7em}.tp-container .TP-select .TP-select-choice .option-name p{margin:0;font-weight:bold}.tp-container .TP-select .TP-select-choice .option-platform{width:auto;height:100%;aspect-ratio:1/1;display:flex;align-items:center;justify-content:center;padding:0 5px}.tp-container .TP-select .TP-select-choice .option-platform svg,.tp-container .TP-select .TP-select-choice .option-platform img{max-width:100%;max-height:100%;object-fit:contain}.tp-container .TP-select .TP-select-list-option{position:absolute;width:100%;top:5vh;border:var(--select-box-border);border-top:none;border-radius:0 0 5px 5px;box-sizing:border-box;z-index:10;background-color:var(--background-select-option-box);max-height:0;overflow:hidden;opacity:0;transition:max-height .3s ease-out,opacity .3s ease-out}.tp-container .TP-select .TP-select-list-option .TP-select-option{width:100%;height:5vh;display:flex;align-items:center;justify-content:space-between;padding:0 1vw;cursor:pointer;box-sizing:border-box;color:var(--text-select-option-box)}.tp-container .TP-select .TP-select-list-option .TP-select-option:first-child{border-top:none}.tp-container .TP-select .TP-select-list-option .TP-select-option .option-name{width:100%;display:flex;align-items:center}.tp-container .TP-select .TP-select-list-option .TP-select-option .option-platform{width:auto;height:3vh;display:flex;align-items:center;justify-content:flex-end;gap:5px}.tp-container .TP-select .TP-select-list-option .TP-select-option .option-platform svg,.tp-container .TP-select .TP-select-list-option .TP-select-option .option-platform img{max-width:100%;max-height:100%;object-fit:contain}.tp-container .TP-select:hover .TP-select-list-option,.tp-container .TP-select:focus-within .TP-select-list-option{max-height:100vh;opacity:1;overflow-y:auto;overflow-x:hidden}.tp-container.tp-button-toggle{width:fit-content;height:fit-content;position:fixed;right:5vw;bottom:5vh;background-color:var(--background-color-button-toggle);background-image:var(--background-image-button-toggle);background-size:100% 100%;border-radius:10px;transition:background .5s,border .5s;border:var(--border-button-toggle);box-sizing:border-box}.tp-container.tp-button-toggle svg{width:auto;height:7vh;aspect-ratio:1/1;padding:2vh 2vw;font-size:2em;transition:.5s;opacity:0}.tp-container.tp-button-toggle::after{content:"";position:absolute;width:0;height:100%;top:0;left:0;z-index:-1;transition:.5s;opacity:.3}.tp-container.tp-button-toggle.active{background-size:200% 200%;background-position:100%;border:0px solid #000}.tp-container.tp-button-toggle.active::after{width:100%;right:0;backdrop-filter:blur(5px)}.tp-container.tp-button-toggle.active svg{opacity:1}.tp-container.tp-theme-option{position:fixed;width:80%;height:95%;overflow:auto;bottom:0;left:50%;top:50%;transform:translateX(-50%) translateY(-50%);border-radius:10px;background:var(--background-color-app-box);box-shadow:0 0 10px 0 rgba(0,0,0,0.1);padding:1vh 1vw}.tp-container.tp-theme-option .option-group{width:100%;height:auto}.tp-container.tp-theme-option .option-group::after{content:"";position:absolute;width:80%;height:2px;background:#000;left:50%;transform:translateX(-50%);margin:2vh 0}.tp-container.tp-theme-option .option-group .option-group-title{font-size:2em}.tp-container.tp-theme-option .option-group .option-group-content *{display:flex;align-items:stretch;justify-content:space-between;flex-direction:row;flex-wrap:nowrap;width:100%}.tp-container.tp-theme-option .option-group .option-group-content .option-box{width:100%;height:auto}.tp-container.tp-theme-option .option-group .option-group-content .option-box .option-box-title{font-weight:600;text-align:left}.tp-container.tp-theme-option .option-group .option-group-content .option-box .option-box-content-item{display:flex;align-items:stretch;justify-content:space-around;flex:row;flex-wrap:nowrap}.tp-container.tp-toast{position:fixed;width:fit-content;height:fit-content;left:2vw;top:2vh;transition:.5s}.tp-container.tp-toast .toast{font-size:1.2em;width:fit-content;height:fit-content;padding:1vh 1vw;background:var(--glass-bg-color);backdrop-filter:blur(100px) saturate(180%);-webkit-backdrop-filter:blur(100px) saturate(180%);border:1px solid var(--border-light-color);box-shadow:0 4px 30px var(--shadow-color);overflow:hidden;font-weight:700;backdrop-filter:blur(100px);margin:.5vh 0;border:var(--border-toast);box-sizing:border-box;color:var(--text-white)}.tp-container.tp-toast .toast.success{background:var(--background-toast-success)}.tp-container.tp-toast .toast.error{background:var(--background-toast-error)}.tp-container.tp-toast .toast.warning{background:var(--background-toast-warning)}.tp-container.tp-toast .toast.info{background:var(--background-toast-info)}.tp-container.tp-popup{position:fixed;width:100%;height:100%;backdrop-filter:blur(100px);display:none;background:var(--background-color);z-index:9999999}.tp-container.tp-popup.active{display:flex}.tp-container.tp-content{position:fixed;width:35vh;max-width:45vw;min-width:300px;height:60vh;max-height:80vh;min-height:400px;right:5vw;bottom:15vh;flex-grow:1;overflow:hidden;display:flex;flex-direction:column;row-gap:.1vh;border:2px solid #000;border-radius:20px;padding:0 .5vw;backdrop-filter:blur(10px);overflow-y:auto;color:var(--text-main-color);transform:rotateX(90deg);transform-origin:50% 100%;transition:transform .5s linear;background:var(--background-color-main-content);background-image:var(--background-image-main-content);background-repeat:var(--background-image-repeat-main-content);background-size:var(--background-image-size-main-content);background-position:var(--background-image-position-main-content)}.tp-container.tp-content.active{transform:rotateX(0deg)}.tp-container.tp-content::after{position:absolute;width:100%;height:100%;content:"";top:0;left:0;backdrop-filter:blur(var(--background-image-blur-main-content));z-index:-1}.tp-container.tp-content .copyable{user-select:text;text-decoration:underline;cursor:pointer}.tp-container.tp-content i[class^=bx]{font-size:1.5em}.tp-container.tp-content .notification-bar{position:absolute;width:100%;height:2vh;display:flex;align-items:flex-start;justify-content:flex-start;flex-direction:column;top:0;left:0;z-index:2;transition:.5s;overflow:hidden;padding:.5vh .5vw;background:var(--background-notification-bar);backdrop-filter:blur(var(--background-blur-notification-bar));color:#fff;opacity:0}.tp-container.tp-content .notification-bar:hover{height:100%;opacity:1}.tp-container.tp-content .notification-bar .switch{overflow:hidden}.tp-container.tp-content .notification-bar .switch.switch-theme-mode{width:100%;height:fit-content;display:flex;align-items:stretch;justify-content:flex-start;background:var(--background-switch-label);border-radius:100px;font-weight:700;overflow:hidden;position:relative}.tp-container.tp-content .notification-bar .switch.switch-theme-mode input{display:none}.tp-container.tp-content .notification-bar .switch.switch-theme-mode input:checked>label{background:#fff;color:#000}.tp-container.tp-content .notification-bar .switch.switch-theme-mode input:checked ~ .selected-theme{height:100%}.tp-container.tp-content .notification-bar .switch.switch-theme-mode input[id="light-mode"]:checked ~ .selected-theme{transform:translateX(0);border-top-left-radius:100px;border-bottom-left-radius:100px}.tp-container.tp-content .notification-bar .switch.switch-theme-mode input[id="dark-mode"]:checked ~ .selected-theme{transform:translateX(100%)}.tp-container.tp-content .notification-bar .switch.switch-theme-mode input[id="auto-mode"]:checked ~ .selected-theme{transform:translateX(200%);border-top-right-radius:100px;border-bottom-right-radius:100px}.tp-container.tp-content .notification-bar .switch.switch-theme-mode label{width:100%;height:100%;font-size:.8em;text-align:center;transition:.5s;color:var(--text-switch-label);padding:1vh 1vw}.tp-container.tp-content .notification-bar .switch.switch-theme-mode label:hover{background:var(--background-swith-theme-label-hover);color:var(--text-switch-label-hover)}.tp-container.tp-content .notification-bar .switch.switch-theme-mode .selected-theme{position:absolute;top:0;left:0;height:0;width:calc(100% / 3 );background:rgba(255,255,255,0.479);transition:transform .3s ease;z-index:2}.tp-container.tp-content .header-content{width:95%;height:3vh;display:flex;align-items:center;justify-content:space-between;flex-direction:row;overflow:hidden;padding:1vh 0;margin:0 auto;color:var(--text-header)}.tp-container.tp-content .header-content .header-left{width:fit-content;height:fit-content}.tp-container.tp-content .header-content .header-left .notification button>div{align-items:center;justify-content:center;border-radius:100pz;font-weight:bold;position:absolute;top:0;font-size:.55em;right:5%;background:#fff;color:#000;padding:.2em .2em;display:flex;width:auto;height:auto;aspect-ratio:1/1}.tp-container.tp-content .header-content .header-right{width:fit-content;height:fit-content;display:flex;align-items:center;justify-content:center;gap:1vw;flex-wrap:nowrap}.tp-container.tp-content .body-content{width:100%;height:calc(100% - 5vh - 5vh);overflow:hidden;position:relative}.tp-container.tp-content .body-content .screen-content{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:1vh;position:absolute;overflow-y:auto;transition:.5s}.tp-container.tp-content .body-content .screen-content.config-screen{left:-100%;display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-start}.tp-container.tp-content .body-content .screen-content.config-screen .config-group{width:100%;height:auto;background:var(--background-config-group);padding:1vh 1vw;border-radius:10px;color:var(--text-config-group)}.tp-container.tp-content .body-content .screen-content.config-screen .config-group hr{width:100%;height:1px;background:#000;margin:1vh 0}.tp-container.tp-content .body-content .screen-content.config-screen .config-group .config-title{font-size:1.1em;font-weight:600}.tp-container.tp-content .body-content .screen-content.config-screen .config-group .config-setting{width:100%;height:auto;display:flex;align-items:flex-start;justify-content:flex-start;flex-direction:column;gap:2vh}.tp-container.tp-content .body-content .screen-content.config-screen .config-group .config-setting .config-item{width:100%;height:auto;display:flex;align-items:center;justify-content:space-between;flex-direction:row;gap:1vw}.tp-container.tp-content .body-content .screen-content.config-screen .config-group .config-setting .config-item input{width:100%;border-radius:10px;font-size:.7em;text-indent:7%}.tp-container.tp-content .body-content .screen-content.config-screen .config-group .config-setting .config-item input[type="range"]{background:#fff;color:#000;height:5px}.tp-container.tp-content .body-content .screen-content.config-screen .config-group .config-setting .config-item .config-item-name{width:100%;height:auto;font-weight:600;text-align:left}.tp-container.tp-content .body-content .screen-content.config-screen .config-group .config-setting .config-item .config-item-setting{width:100%;height:auto;display:flex;align-items:center;justify-content:flex-start;flex-direction:column;flex-wrap:nowrap;gap:.5vh}.tp-container.tp-content .body-content .screen-content.config-screen .config-group .config-setting .config-item .config-item-setting .custom-config{display:flex;align-items:flex-start;justify-content:flex-start;flex-direction:row}.tp-container.tp-content .body-content .screen-content.config-screen .config-group .config-setting .config-item .config-item-setting .custom-config input{width:100%;border-radius:10px;text-align:center}.tp-container.tp-content .body-content .screen-content.config-screen .config-group .config-setting .config-item.background-image input{width:100%;border-radius:10px;text-indent:3%}.tp-container.tp-content .body-content .screen-content.home-screen{top:100%}.tp-container.tp-content .body-content .screen-content.home-screen .layout-future{width:100%;height:100%;display:flex;flex-direction:column;flex-wrap:nowrap;align-items:flex-start;gap:1vh;position:absolute;transform:scale(0);opacity:0;transition:opacity .4s ease-out,transform .4s ease-out}.tp-container.tp-content .body-content .screen-content.home-screen .layout-future .back{width:fit-content;height:5vh;cursor:pointer;border-radius:10px;font-weight:700;padding:.5vh 1vw}.tp-container.tp-content .body-content .screen-content.home-screen .layout-future .tutorial{width:100%;height:auto;max-height:10vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1vh;background:rgba(255,255,255,0.4);padding:.5vh 1vw;border-radius:10px}.tp-container.tp-content .body-content .screen-content.home-screen .layout-future .tutorial .title{height:auto;max-height:3vh;font-size:1.25em;font-weight:600}.tp-container.tp-content .body-content .screen-content.home-screen .layout-future .tutorial .tutorial-container{width:100%;height:auto;max-height:calc(100% - 3vh);overflow:scroll;font-size:.7em}.tp-container.tp-content .body-content .screen-content.home-screen .layout-future .layout-tab{display:none;width:100%;height:auto;max-height:calc(100% - 20vh);gap:1vh;box-sizing:border-box;overflow:scroll}.tp-container.tp-content .body-content .screen-content.home-screen .layout-future .layout-tab.active{display:flex;flex-direction:column;align-items:flex-start}.tp-container.tp-content .body-content .screen-content.home-screen .layout-future .layout-tab textarea{width:100%;max-width:100%;min-width:100%;height:15vh;max-height:20vh;resize:both}.tp-container.tp-content .body-content .screen-content.home-screen .layout-future.active{transform:scale(1);opacity:1}.tp-container.tp-content .body-content .screen-content.home-screen .layout-future .button-control{width:100%;height:5vh;display:flex;align-items:center;justify-content:center;gap:1vw;position:absolute;bottom:0;left:0;background:#90ee90}.tp-container.tp-content .body-content .screen-content.home-screen .layout-future .button-control button{width:fit-content;height:100%;padding:.5vh 1vw;border-radius:10px;font-weight:700;cursor:pointer}.tp-container.tp-content .body-content .screen-content.server-screen{left:100%}.tp-container.tp-content .body-content .screen-content.active{top:0;left:0}.tp-container.tp-content .footer-content{width:100%;height:5vh;overflow:hidden;position:absolute;bottom:1vh;left:0}.tp-container.tp-content .footer-content .bottom-navbar{overflow:hidden;width:90%;height:100%;display:flex;align-items:center;justify-content:center;text-align:center;box-shadow:inset 0px 0px 20px 0px #000;backdrop-filter:blur(5px);border-radius:10px;margin:0 auto}.tp-container.tp-content .footer-content .bottom-navbar .navbar-item{transition:.5s;width:100%;height:100%;display:flex;align-items:center;justify-content:center}.tp-container.tp-content .footer-content .bottom-navbar .navbar-item i{transition:.5s;font-size:1.5em;color:var(--text-bottom-navbar)}.tp-container.tp-content .footer-content .bottom-navbar .navbar-item:hover{background:#2e995b}.tp-container.tp-content .footer-content .bottom-navbar .navbar-item:hover i{color:#fff}.tp-container.tp-content .footer-content .bottom-navbar .navbar-item.active{background:#20fbdf;color:#fff}
		`;

    // Lấy thông tin trang hiện tại
    async function getInfoPage() {
      boxAlert(`ĐANG LẤY THÔNG TIN`);
      const info = {};

      // 1. Thông tin về đường dẫn (URL, host, param,...)
      info.url = {
        href: window.location.href,
        protocol: window.location.protocol,
        host: window.location.host,
        hostname: window.location.hostname,
        port: window.location.port,
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash
      };

      // Phân tích các tham số URL
      info.url.params = {};
      const urlParams = new URLSearchParams(window.location.search);
      for (const [key, value] of urlParams.entries()) {
        info.url.params[key] = value;
      }

      // 2. Các thông tin trong cookie, session, local storage
      info.storage = {
        cookies: document.cookie, // Lưu ý: Chỉ lấy các cookie không phải HttpOnly
        localStorage: {},
        sessionStorage: {},
        indexedDbDatabases: [] // Chỉ có thể lấy tên các database, không phải nội dung
      };

      // Lấy localStorage
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          info.storage.localStorage[key] = localStorage.getItem(key);
        }
      } catch (e) {
        info.storage.localStorageError = `Error accessing localStorage: ${e.message}`;
      }

      // Lấy sessionStorage
      try {
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          info.storage.sessionStorage[key] = sessionStorage.getItem(key);
        }
      } catch (e) {
        info.storage.sessionStorageError = `Error accessing sessionStorage: ${e.message}`;
      }

      // Lấy tên các IndexedDB databases (không lấy nội dung vì phức tạp và cần biết cấu trúc DB)
      if (window.indexedDB) {
        try {
          const req = window.indexedDB.databases();
          req.onsuccess = function(event) {
            event.target.result.forEach(db => {
              info.storage.indexedDbDatabases.push(db.name);
            });
          };
          req.onerror = function(event) {
            info.storage.indexedDbError = `Error listing IndexedDB databases: ${event.target.errorCode}`;
          };
        } catch (e) {
          info.storage.indexedDbError = `Error checking IndexedDB support: ${e.message}`;
        }
      } else {
        info.storage.indexedDbDatabases = "IndexedDB not supported";
      }

      // Cache API (chỉ lấy tên caches)
      if ('caches' in window) {
        info.storage.cacheNames = [];
        caches.keys().then(keys => {
          info.storage.cacheNames = keys;
        }).catch(e => {
          info.storage.cacheError = `Error listing Cache API names: ${e.message}`;
        });
      } else {
        info.storage.cacheNames = "Cache API not supported";
      }

      // 3. Thông tin trình duyệt (Navigator)
      info.browser = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        hardwareConcurrency: navigator.hardwareConcurrency, // Số lõi CPU logic
        deviceMemory: navigator.deviceMemory || 'N/A', // Bộ nhớ thiết bị (GiB)
        appName: navigator.appName, // Kế thừa từ Netscape, thường là "Netscape"
        appVersion: navigator.appVersion,
        product: navigator.product,
        vendor: navigator.vendor, // Nhà cung cấp trình duyệt
        maxTouchPoints: navigator.maxTouchPoints || 0, // Số điểm chạm tối đa được hỗ trợ
        doNotTrack: navigator.doNotTrack || 'N/A', // Trạng thái DNT
        javaEnabled: navigator.javaEnabled(), // Kiểm tra Java có được bật không
        // Kiểm tra hỗ trợ các API hiện đại
        clipboardApiSupported: 'clipboard' in navigator,
        geolocationSupported: 'geolocation' in navigator,
        serviceWorkerSupported: 'serviceWorker' in navigator,
        webUsbSupported: 'usb' in navigator,
        bluetoothSupported: 'bluetooth' in navigator,
      };

      // Thông tin kết nối mạng (Network Information API)
      if (navigator.connection) {
        info.browser.network = {
          type: navigator.connection.type || 'N/A', // wifi, cellular, ethernet, etc.
          effectiveType: navigator.connection.effectiveType || 'N/A', // slow-2g, 2g, 3g, 4g
          rtt: navigator.connection.rtt || 'N/A', // Round-trip time in milliseconds
          downlink: navigator.connection.downlink || 'N/A', // Downlink speed in Mbps
          saveData: navigator.connection.saveData || 'N/A' // User has data saver enabled
        };
      }

      // 4. Thông tin màn hình
      info.screen = {
        width: screen.width,
        height: screen.height,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth
      };

      // 5. Thông tin Document
      info.document = {
        title: document.title,
        referrer: document.referrer,
        lastModified: document.lastModified,
        charset: document.charset,
        readyState: document.readyState, // Trạng thái tải của tài liệu
        dir: document.dir, // Hướng văn bản
        visibilityState: document.visibilityState, // Trạng thái hiển thị của tab
        // Các thẻ meta quan trọng (ví dụ: viewport, description)
        metaTags: Array.from(document.querySelectorAll('meta')).map(meta => ({
          name: meta.name || meta.getAttribute('property') || meta.getAttribute('http-equiv'),
          content: meta.content
        })),
        // Kích thước của phần thân tài liệu
        bodyClientWidth: document.body.clientWidth,
        bodyClientHeight: document.body.clientHeight,
        // Có thể thêm HTML và CSS thô nếu cần thiết, nhưng có thể rất lớn
        // fullHTML: document.documentElement.outerHTML,
        // inlineCSS: Array.from(document.styleSheets).map(sheet => {
        //     try {
        //         return Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n');
        //     } catch (e) {
        //         return `Cannot access CSS rules: ${e.message}`; // Lỗi bảo mật nếu CSS từ cross-origin
        //     }
        // }).join('\n\n')
      };

      // 6. Thông tin về cửa sổ trình duyệt
      info.window = {
        innerWidth: window.innerWidth, // Chiều rộng viewport (không bao gồm thanh cuộn)
        innerHeight: window.innerHeight, // Chiều cao viewport (không bao gồm thanh cuộn)
        outerWidth: window.outerWidth, // Chiều rộng toàn bộ cửa sổ trình duyệt
        outerHeight: window.outerHeight, // Chiều cao toàn bộ cửa sổ trình duyệt
        scrollX: window.scrollX, // Vị trí cuộn ngang
        scrollY: window.scrollY, // Vị trí cuộn dọc
        devicePixelRatio: window.devicePixelRatio, // Tỷ lệ pixel thiết bị
        prefersDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches, // Người dùng ưu tiên chế độ tối
      };

      // 7. Thông tin Performance Timing (có thể chậm hoặc không đồng bộ)
      info.performance = {};
      if (window.performance) {
        // Navigation Timing (khuyến nghị dùng getEntriesByType thay vì window.performance.timing)
        const navEntries = performance.getEntriesByType("navigation");
        if (navEntries.length > 0) {
          const nav = navEntries[0];
          info.performance.navigation = {
            type: nav.type, // navigate, reload, back_forward, prerender
            domContentLoadedEventStart: nav.domContentLoadedEventStart,
            domContentLoadedEventEnd: nav.domContentLoadedEventEnd,
            loadEventStart: nav.loadEventStart,
            loadEventEnd: nav.loadEventEnd,
            duration: nav.duration,
            responseStart: nav.responseStart,
            responseEnd: nav.responseEnd,
            // ... nhiều thuộc tính khác có sẵn trong NavigationTiming
          };
        }

        // Memory usage (có thể không được hỗ trợ hoặc yêu cầu cờ đặc biệt)
        if (performance.memory) {
          info.performance.memory = {
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            usedJSHeapSize: performance.memory.usedJSHeapSize
          };
        }
      }

      // 8. Timestamp
      info.timestamp = Date.now();

      // 9. Clipboard (chỉ kiểm tra khả năng truy cập, không lấy nội dung do hạn chế bảo mật)
      info.clipboard = {
        canReadText: false,
        canWriteText: false
      };
      if (navigator.clipboard) {
        // Việc đọc/ghi clipboard yêu cầu quyền và thường phải thông qua tương tác người dùng
        // Do đó, chỉ kiểm tra sự tồn tại của API
        info.clipboard.canReadText = typeof navigator.clipboard.readText === 'function';
        info.clipboard.canWriteText = typeof navigator.clipboard.writeText === 'function';
      }

      // 10. WebGL Info (nếu có context)
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
          info.webgl = {
            vendor: gl.getParameter(gl.VENDOR),
            renderer: gl.getParameter(gl.RENDERER),
            version: gl.getParameter(gl.VERSION),
            shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
            maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE)
          };
        }
      } catch (e) {
        info.webgl = `Error getting WebGL info: ${e.message}`;
      }

      // 11. Battery Status API (yêu cầu quyền, có thể không hoạt động trên mọi trình duyệt/môi trường)
      if ('getBattery' in navigator) {
        info.battery = {};
        navigator.getBattery().then(battery => {
          info.battery = {
            charging: battery.charging,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime,
            level: battery.level
          };
        }).catch(e => {
          info.batteryError = `Error accessing Battery API: ${e.message}`;
        });
      } else {
        info.battery = "Battery Status API not supported";
      }

      // 12. Media Devices (chỉ liệt kê khả năng, không truy cập camera/mic trực tiếp)
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        info.mediaDevices = {
          hasAudioInput: false,
          hasVideoInput: false,
          hasAudioOutput: false,
          devices: []
        };
        navigator.mediaDevices.enumerateDevices().then(devices => {
          devices.forEach(device => {
            info.mediaDevices.devices.push({
              kind: device.kind,
              label: device.label, // Tên thiết bị, có thể trống nếu chưa được cấp quyền
              deviceId: device.deviceId,
              groupId: device.groupId
            });
            if (device.kind === 'audioinput') info.mediaDevices.hasAudioInput = true;
            if (device.kind === 'videoinput') info.mediaDevices.hasVideoInput = true;
            if (device.kind === 'audiooutput') info.mediaDevices.hasAudioOutput = true;
          });
        }).catch(e => {
          info.mediaDevicesError = `Error enumerating media devices: ${e.message}`;
        });
      } else {
        info.mediaDevices = "Media Devices API not supported";
      }

      console.log("Thông tin trang hiện tại:", info);
      return info;
    }

    const INFO_PAGE = await getInfoPage();

    // Tạo giao diện
    async function createLayout() {
      boxAlert(`Đang tạo giao diện`, "info");
      $("body").append(HTML_TOOL_UI);
      $("body").append(`<style>${CSS_TOOL_UI}</style>`);
      await sortApp();
      await loadApp();
    }

    $(".tp-container.tp-content .program-title").empty().append($(`<p>${VERSION}</p>`))

    if (!INFO_PAGE.url.protocol.includes("file"))
      await createLayout();

    function checkTheme() {
      boxAlert("KIỂM TRA THEME")
      var data = INFO_PAGE.storage.localStorage["TP-CONFIG-APP"];
      if (!data) {
        $("body").addClass("tp-theme-light");
        return;
      }

      data = JSON.parse(data);
      console.log(data.appThemeForWeb);

      if (data.appThemeForWeb == "option") {
        applyConfig();
      }

      $(`.color-theme #${data.appThemeForWeb}-mode`).prop('checked', true);

      $("body").addClass(`tp-theme-${data.appThemeForWeb}`);
    }

    checkTheme();

    // Custom input color
    Coloris({
      theme: 'polaroid',
      themeMode: 'dark',
      formatToggle: true,
      onChange: (color, inputEl) => {}
    });

    // Khởi tạo chương trình
    console.log(`%cTanPhan: %cĐANG KHỞI TẠO CẤU HÌNH`, "color: crimson; font-size: 2rem", "color: orange; font-size: 1.5rem");

    var actionMap = {
      "giaDuoi": giaDuoi,
      "flashSale": flashSale,
    }

    /**
     * >>===================================================================<<
     * ||   ____     ____        __      _   _________    _____      _____  ||
     * ||  / ___)   / __ \      /  \    / ) (_   _____)  (_   _)    / ___ \ ||
     * || / /      / /  \ \    / /\ \  / /    ) (___       | |     / /   \_)||
     * ||( (      ( ()  () )   ) ) ) ) ) )   (   ___)      | |    ( (  ____ ||
     * ||( (      ( ()  () )  ( ( ( ( ( (     ) (          | |    ( ( (__  )||
     * || \ \___   \ \__/ /   / /  \ \/ /    (   )        _| |__   \ \__/ / ||
     * ||  \____)   \____/   (_/    \__/      \_/        /_____(    \____/  ||
     * >>===================================================================<<
     */

    /**
     * Chuyển đổi một giá trị pixel (px) sang một đơn vị tương đối.
     *
     * @param {number} childPxValue Giá trị pixel của phần tử con cần chuyển đổi.
     * @param {object} options Các tùy chọn cho việc chuyển đổi.
     * @param {string} options.targetUnit Đơn vị đích mong muốn ('%', 'vw', 'vh').
     * @param {number} [options.referencePxValue] Giá trị pixel của phần tử tham chiếu (ví dụ: chiều rộng/chiều cao phần tử cha).
     * Cần thiết khi targetUnit là '%'.
     * @returns {string|null} Giá trị đã chuyển đổi với đơn vị, hoặc null nếu có lỗi/thiếu thông tin.
     */
    function convertUnit(childPxValue, options) {
      const {
        targetUnit,
        referencePxValue
      } = options;

      if (typeof childPxValue !== 'number' || childPxValue < 0) {
        console.error("Lỗi: 'childPxValue' phải là một số dương.");
        return null;
      }

      let result;

      switch (targetUnit) {
        case '%':
          if (typeof referencePxValue !== 'number' || referencePxValue <= 0) {
            console.error("Lỗi: Cần 'referencePxValue' (chiều rộng/chiều cao phần tử cha) là một số dương để chuyển đổi sang '%'.");
            return null;
          }
          result = (childPxValue / referencePxValue) * 100;
          return `${result}%`;
        case 'vw':
          const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
          if (viewportWidth <= 0) {
            console.warn("Cảnh báo: Chiều rộng của viewport là 0 hoặc âm, không thể tính vw.");
            return '0vw';
          }
          result = (childPxValue / viewportWidth) * 100;
          return `${result}vw`;
        case 'vh':
          const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
          if (viewportHeight <= 0) {
            console.warn("Cảnh báo: Chiều cao của viewport là 0 hoặc âm, không thể tính vh.");
            return '0vh';
          }
          result = (childPxValue / viewportHeight) * 100;
          return `${result}vh`;
        default:
          console.error(`Lỗi: Đơn vị đích không hợp lệ: '${targetUnit}'. Chỉ hỗ trợ '%', 'vw', 'vh'.`);
          return null;
      }
    }

    async function sortApp() {
      // Load config
      let CONFIG = getConfig();

      // Khởi tạo sortable
      $(".TP-APPVIEW").sortable({
        helper: "clone",
        placeholder: "sortable-placeholder",
        tolerance: "pointer",
        update: function() {
          // Lấy thứ tự mới theo data-function
          let order = $(this).sortable("toArray", {
            attribute: "data-function"
          });

          // Gán vào config
          CONFIG["sort-app"] = order;

          // Lưu lại config
          setConfig("TP-CONFIG-APP", CONFIG);

          console.log("Đã lưu sort-app:", CONFIG["sort-app"]);
        }
      });
    }

    async function loadApp() {
      boxAlert("SẮP XẾP CÁC APP");
      var CONFIG = getConfig();

      if (CONFIG["sort-app"] && CONFIG["sort-app"].length > 0) {
        var list_app = (CONFIG["sort-app"]);

        $.each(list_app, (index, value) => {
          $(".screen-content.home-screen .TP-APPVIEW").append($(`.TP-APP-BOX[data-function="${value}"]`));
          checkLegitApp(value)
        })
      }

      function checkLegitApp(value) {
        var current_app = $(`.TP-APP-BOX[data-function="${value}"]`);
        var current_page = INFO_PAGE.url.host.toString().split(".").slice(-2, -1)[0];
        // ví dụ: shopee.vn -> "shopee"

        var platforms = current_app.attr("data-platform");

        console.log("LEGIT: ", current_app.attr("data-platform"), current_page);

        if (platforms === "*") {
          // luôn hiển thị
          current_app.css("display", "");
        } else {
					console.log("PLATFORMS", platforms);
          var platformList = platforms.split(",").map(p => p.trim().toLowerCase());
          if (platformList.includes(current_page.toLowerCase())) {
            current_app.css("display", "");
            console.log("HIỆN");
          } else {
            current_app.css("display", "none");
            console.log("ẨN");
          }
        }
      }
    }

    function getConfig(name = "TP-CONFIG-APP") {
      let CONFIG = localStorage.getItem(name);

      if (CONFIG) {
        try {
          CONFIG = JSON.parse(CONFIG);
          boxAlert(`Tải cấu hình: ${name}`);
          console.log(`Cấu hình đã được tải thành công từ khóa: ${name}`);
        } catch (e) {
          console.error("Lỗi khi phân tích cú pháp cấu hình từ localStorage. Khởi tạo cấu hình mặc định.", e);
          CONFIG = null; // Buộc tạo cấu hình mặc định nếu parse thất bại
        }
      }

      if (!CONFIG) { // Nếu không có cấu hình hoặc parse thất bại, tạo cấu hình mặc định
        let bodyWidth, bodyHeight;

        // Đảm bảo jQuery được tải trước khi sử dụng $
        if (typeof $ !== 'undefined' && $(window)) {
          bodyWidth = $(window).width();
          bodyHeight = $(window).height();
        } else {
          // Fallback nếu jQuery không có sẵn
          bodyWidth = window.innerWidth;
          bodyHeight = window.innerHeight;
          console.warn("jQuery không được tìm thấy. Sử dụng window.innerWidth/Height làm kích thước mặc định.");
        }

        CONFIG = {
          "window-size": `${bodyWidth}:${bodyHeight}`,
          "app-position": null,
          "appThemeForWeb": "light", // Mặc định là 'light'
          "appScreenActive": "home-screen",
          "sort-app": [],
          "color": {
            "background-notification-bar": "rgba(138, 138, 138, 0.2)",
            "background-blur-notification-bar": "20px",
            "background-switch-label": "rgba(255, 154, 154, 1)",
            "background-switch-theme-label-hover": "rgba(255, 255, 255, 1)",
            "text-switch-label": "rgba(255, 255, 255, 1)",
            "text-switch-label-hover": "rgba(0, 0, 0, 1)",
            "background-color-main-content": "rgb(255, 186, 186)",
            "background-image-main-content": "url(\"https://github.com/pntan/TPTOOL/blob/main/background-button-toggle.gif?raw=true\")",
            "background-image-repeat-main-content": "no-repeat",
            "background-image-size-main-content": "contain",
            "background-image-position-main-content": "0% 50%",
            "background-image-blur-main-content": "5px",
            "text-main-content": "rgba(0, 0, 0, 1)",
            "text-header": "rgb(0, 0, 0)",
            "background-config-group": "rgba(255, 255, 255, 0.603)",
            "text-config-group": "rgba(0, 0, 0, 1)",
            "background-icon-app": "rgba(255, 255, 255, 1)",
            "text-icon-app": "rgba(0, 0, 0, 1)",
            "text-bottom-navbar": "rgba(0, 0, 0, 1)",
            "text-choice-box": "rgb(255, 255, 255)",
            "text-choice-box-active": "rgb(0, 0, 0)",
            "choice-box-border": "2px solid rgb(255, 153, 0)",
            "choice-box-border-active": "none",
            "background-choice-box-active": "rgb(255, 153, 0)",
            "select-box-border": "2px solid rgba(0, 0, 0, 1)",
            "background-select-box": "rgba(255, 255, 255, 1)",
            "text-select-box": "rgba(0, 0, 0, 1)",
            "background-select-option-box": "rgba(255, 255, 255, 1)",
            "text-select-option-box": "rgba(0, 0, 0, 1)",
            "color-icon-gia-duoi": "rgba(255, 182, 193, 1)",
            "color-icon-flash-sale": "rgba(254, 205, 211, 1)",
            "color-icon-gia-chuong-trinh": "rgba(255, 229, 180, 1)",
            "color-icon-kiem-tra-gia": "rgba(253, 224, 71, 1)",
            "color-icon-sao-chep": "rgba(182, 231, 169, 1)",
            "color-icon-ma-phan-loai": "rgba(191, 219, 254, 1)",
            "color-icon-sua-gia": "rgba(221, 214, 254, 1)",
            "color-icon-sua-hinh": "rgba(255, 204, 0, 1)",
            "color-icon-sua-ten-phan-loai": "rgba(255, 175, 112, 1)",
            "color-icon-kiem-tra-phan-loai": "rgba(165, 214, 167, 1)",
            "color-icon-them-phan-loai": "rgba(147, 197, 253, 1)",
            "color-icon-xoa-phan-loai": "rgba(216, 180, 254, 1)",
            "color-icon-lay-phan-loai": "rgba(255, 237, 213, 1)",
            "color-icon-lay-id-san-pham": "rgba(179, 217, 255, 1)",
            "color-icon-hien-thi-them-san-pham": "rgba(252, 231, 243, 1)",
            "color-icon-lien-ket-sku": "rgba(212, 241, 244, 1)",
            "color-icon-kiem-tra-ton": "rgba(181, 126, 220, 1)",
            "color-icon-chia-excel": "rgba(134, 239, 172, 1)",
            "color-icon-gop-excel": "rgba(196, 181, 253, 1)",
            "color-icon-so-sanh-voucher": "rgba(255, 245, 183, 1)",
            "color-icon-mo-link": "rgba(255, 204, 128, 1)",
            "color-icon-tinh-gia-ban": "rgba(161, 196, 225, 1)",
            "color-icon-ktra-gia-chuong-trinh-km": "rgba(233, 213, 255, 1)",
            "color-icon-ktra-khuyen-mai": "rgba(255, 198, 198, 1)",
            "color-icon-chinh-sua-khuyen-mai": "rgba(176, 191, 26, 1)",
            "color-icon-thong-ke-don-hang": "rgba(255, 218, 185, 1)",
            "color-icon-chinh-sua-flash-sale": "rgba(165, 214, 167, 1)",
            "color-icon-tim-kiem-sku": "rgba(236, 252, 203, 1)",
            "color-icon-kiem-tra-thuoc-tinh": "rgba(179, 230, 255, 1)",
            "background-color-button-toggle": "rgba(255, 255, 255, 1)",
            "background-image-button-toggle": "url(\"https://github.com/pntan/TPTOOL/blob/main/background-button-toggle.gif?raw=true\")",
            "border-button-toggle": "2px solid rgba(0, 0, 0, 1)",
            "text-button-toggle": "rgba(0, 0, 0, 1)",
            "background-toast-success": "rgba(123, 255, 147, 1)",
            "background-toast-error": "rgba(255, 98, 98, 1)",
            "background-toast-warning": "rgba(255, 85, 28, 1)",
            "background-toast-info": "rgba(0, 191, 255, 1)"
          }
        };
      }
      return CONFIG;
    }

    function setConfig(name = "TP-CONFIG-APP", config = getConfig()) {
      localStorage.removeItem(name);
      localStorage.setItem(name, JSON.stringify(config));
    }

    /**
     * Áp dụng cấu hình vào các biến CSS của thẻ body và thêm các lớp CSS.
     */
    function applyConfig() {
      boxAlert("ĐANG ÁP DỤNG CẤU HÌNH")
      var CONFIG = getConfig();

      var body = $("body");
      var value;

      for (var key in CONFIG.color) {
        if (CONFIG.color.hasOwnProperty(key)) {
          value = CONFIG.color[key];
          try {
            if (CONFIG.color[key].includes("http"))
              value = `url("${CONFIG.color[key]}")`;
          } catch (e) {
            value = CONFIG.color[key];
          }
          body.css(varJsToVarCSS(key), value);
        }
      }
    }

    // Giao diện nổi
    function boxPopup(html, words = [], colors = []) {
      boxAlert(`BOX POPUP`);
      var log = $(".tp-container.tp-popup").toggle();
      log.find(".content").empty().append(html);
    }

    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Ghi log
    function boxLogging(text, words = [], colors = []) {
      var log = $(".program-log pre.logging");
      var data = log.html();
      var now = new Date();
      var h = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
      var m = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
      var s = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
      var time = `${h}:${m}:${s}`;

      // Tìm đoạn cần đánh dấu sao chép trong text: [copy]...[/copy]
      text = text.replace(/\[copy\](.*?)\[\/copy\]/g, `<span class="copyable">$1</span>`);

      if (words.length === 0) {
        log.html(`${data}\n(${time}) <span style="color: black;">${text}</span>`);
      } else {
        // Create a copy to modify, otherwise replacements might interfere with later searches if words overlap
        let modifiedText = text;
        words.forEach((word, index) => {
          // Escape the word BEFORE creating the RegExp
          var escapedWord = escapeRegExp(word);
          // Use the escaped word in the RegExp
          var regex = new RegExp(`(${escapedWord})`, "gi");
          // Perform replacement on the modifiedText
          modifiedText = modifiedText.replace(regex, `<span style="color: ${colors[index]}; font-weight: bold;">$1</span>`);
        });
        // Set the final HTML
        log.html(`${data}\n(${time}) ${modifiedText}`);
      }
      log.scrollTop(log.prop("scrollHeight"));

      log.find(".title").on("click", () => {
        log.parent().toggle();
      })
    }

    // Ghi console log
    function boxAlert(content, type = "log") {
      switch (type) {
        case "log":
          console.log(`%cTanPhan: %c${content}`, "color: crimson; font-size: 2rem", "color: orange; font-size: 1.5rem");
          break;
        case "error":
          console.error(`%cTanPhan: %c${content}`, "color: crimson; font-size: 2rem", "color: orange; font-size: 1.5rem")
          break;
        case "warn":
          console.warn(`%cTanPhan: %c${content}`, "color: crimson; font-size: 2rem", "color: orange; font-size: 1.5rem");
          break;
      }
    }

    // Ghi thông báo 1 lần
    function boxToast(message, type = "info", duration = 3000) {
      var toast = $(`<div class="toast ${type}">${message}</div>`);
      $("#toast-container").append(toast);

      setTimeout(() => {
        toast.addClass("show");
      }, 10);

      let hideTimeout;

      var startAutoHide = () => {
        hideTimeout = setTimeout(() => {
          toast.removeClass("show");
          setTimeout(() => toast.remove(), 300);
        }, duration);
      };

      var stopAutoHide = () => {
        clearTimeout(hideTimeout);
      };

      toast.on("mouseenter", stopAutoHide);
      toast.on("mouseleave", () => {
        stopAutoHide(); // clear lại nếu người dùng hover nhiều lần
        startAutoHide(); // reset lại thời gian
      });

      startAutoHide(); // bắt đầu đếm thời gian
    }

    /**
     * Gắn một file từ một input file nguồn sang một input file đích và kích hoạt sự kiện change.
     *
     * @param {HTMLElement|jQuery} sourceFileInput - Phần tử input type="file" gốc hoặc jQuery object chứa file cần lấy.
     * @param {HTMLElement|jQuery} targetFileInput - Phần tử input type="file" đích hoặc jQuery object mà file sẽ được gán vào.
     * @param {number} [delay=100] - Thời gian chờ (ms) trước khi gắn file và kích hoạt sự kiện. Mặc định là 100ms.
     * @param {Function} [onSuccessCallback] - Hàm callback sẽ được gọi sau khi file được gắn thành công.
     * @param {Function} [onErrorCallback] - Hàm callback sẽ được gọi nếu không tìm thấy file nguồn hoặc có lỗi.
     */
    function attachFileToInput(sourceFileInput, targetFileInput, delay = 100, onSuccessCallback, onErrorCallback) {

      // --- Chuẩn hóa tham số đầu vào thành phần tử DOM gốc (HTMLInputElement) ---
      let sourceFileInputEl;
      if (sourceFileInput instanceof jQuery) {
        sourceFileInputEl = sourceFileInput.get(0); // Lấy phần tử DOM từ jQuery object
      } else if (sourceFileInput instanceof HTMLElement) {
        sourceFileInputEl = sourceFileInput;
      } else {
        console.warn("Lỗi: sourceFileInput không phải là phần tử DOM hợp lệ hoặc jQuery object.");
        if (onErrorCallback) {
          onErrorCallback("sourceFileInput không hợp lệ.");
        }
        return;
      }

      let targetFileInputEl;
      if (targetFileInput instanceof jQuery) {
        targetFileInputEl = targetFileInput.get(0); // Lấy phần tử DOM từ jQuery object
      } else if (targetFileInput instanceof HTMLElement) {
        targetFileInputEl = targetFileInput;
      } else {
        console.warn("Lỗi: targetFileInput không phải là phần tử DOM hợp lệ hoặc jQuery object.");
        if (onErrorCallback) {
          onErrorCallback("targetFileInput không hợp lệ.");
        }
        return;
      }
      // --- Kết thúc chuẩn hóa ---


      // 1. Kiểm tra tính hợp lệ của input file nguồn
      if (!sourceFileInputEl || !sourceFileInputEl.files || sourceFileInputEl.files.length === 0) {
        console.warn("Lỗi: Input file nguồn không hợp lệ hoặc không có file nào được chọn.");
        if (onErrorCallback) {
          onErrorCallback("Input file nguồn không hợp lệ hoặc không có file nào được chọn.");
        }
        return;
      }

      // 2. Kiểm tra tính hợp lệ của input file đích
      if (!targetFileInputEl || targetFileInputEl.type !== 'file') {
        console.error("Lỗi: Input file đích không hợp lệ (không phải type='file').");
        if (onErrorCallback) {
          onErrorCallback("Input file đích không hợp lệ.");
        }
        return;
      }

      // Lấy file đầu tiên từ input nguồn
      const fileToAttach = sourceFileInputEl.files[0];

      // Tạo đối tượng DataTransfer để chứa file
      const dt = new DataTransfer();
      dt.items.add(fileToAttach);

      // Sử dụng setTimeout để đảm bảo UI kịp load hoặc xử lý
      setTimeout(() => {
        try {
          // Gán FileList vào input đích
          targetFileInputEl.files = dt.files;

          // Tạo và gửi sự kiện 'change' để React/UI nhận diện file mới
          const changeEvent = new Event("change", {
            bubbles: true
          });
          targetFileInputEl.dispatchEvent(changeEvent);

          console.log(`Đã gắn file '${fileToAttach.name}' vào input đích.`);

          // Gọi callback thành công nếu có
          if (onSuccessCallback) {
            onSuccessCallback(fileToAttach, targetFileInputEl);
          }

        } catch (error) {
          console.error("Lỗi khi gắn file hoặc kích hoạt sự kiện:", error);
          if (onErrorCallback) {
            onErrorCallback(error);
          }
        }
      }, delay);
    }

    // Hàm giả lập thao tác người dùng (đã sửa đổi)
    function simulateReactEvent(input, type, options = {}) {
      var el = input[0];

      if (!el) {
        console.warn(`simulateReactEvent: Element not found for eventType ${type}.`);
        return;
      }

      // Hàm con để xử lý sự kiện bàn phím
      function pressKey(keyName) {
        var keyMap = {
          enter: {
            key: 'Enter',
            code: 'Enter'
          },
          tab: {
            key: 'Tab',
            code: 'Tab'
          },
          escape: {
            key: 'Escape',
            code: 'Escape'
          },
          arrowup: {
            key: 'ArrowUp',
            code: 'ArrowUp'
          },
          arrowdown: {
            key: 'ArrowDown',
            code: 'ArrowDown'
          },
          arrowleft: {
            key: 'ArrowLeft',
            code: 'ArrowLeft'
          },
          arrowright: {
            key: 'ArrowRight',
            code: 'ArrowRight'
          }
        };

        var keyData = keyMap[keyName.toLowerCase()] || {
          key: keyName,
          code: keyName
        };

				['keydown', 'keypress', 'keyup'].forEach(eventType => {
          var event = new KeyboardEvent(eventType, {
            key: keyData.key,
            code: keyData.code,
            bubbles: true,
            cancelable: true,
            ...options // Thêm các tùy chọn khác nếu có (Ctrl, Shift, v.v.)
          });
          el.dispatchEvent(event);
        });
      }

      // --- Xử lý loại sự kiện ---
      var event;
      var knownKeys = ['enter', 'tab', 'escape', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'];

      if (knownKeys.includes(type.toLowerCase())) {
        pressKey(type);
      }
      // Nếu là sự kiện bàn phím tự do
      else if (['keydown', 'keypress', 'keyup'].includes(type)) {
        event = new KeyboardEvent(type, {
          key: options.key || '',
          code: options.code || '',
          bubbles: true,
          cancelable: true,
          ...options // Các tùy chọn khác như altKey, ctrlKey, shiftKey, metaKey
        });
        el.dispatchEvent(event);
      }
      // Nếu là sự kiện chuột (MouseEvent)
      else if (['click', 'mousedown', 'mouseup', 'dblclick', 'contextmenu', 'mousemove', 'mouseover', 'mouseout'].includes(type.toLowerCase())) {
        event = new MouseEvent(type, {
          bubbles: true,
          cancelable: true,
          // view: window,
          button: options.button !== undefined ? options.button : 0, // 0 cho chuột trái (mặc định)
          buttons: options.buttons !== undefined ? options.buttons : (type === 'mousedown' ? 1 : 0), // 1 cho nút trái đang nhấn
          clientX: options.clientX || 0,
          clientY: options.clientY || 0,
          screenX: options.screenX || 0,
          screenY: options.screenY || 0,
          altKey: options.altKey || false,
          ctrlKey: options.ctrlKey || false,
          shiftKey: options.shiftKey || false,
          metaKey: options.metaKey || false,
          ...options // Các tùy chọn khác như relatedTarget
        });
        el.dispatchEvent(event);
      }
      // Các loại sự kiện khác (input, change, blur, focus, submit,...)
      else {
        event = new Event(type, {
          bubbles: true,
          cancelable: true,
          ...options
        });
        el.dispatchEvent(event);
      }

      console.log(`Dispatched ${type} event on`, el);
    }

    // Giả lập input file
    function simulateReactInputFile(input) {
      var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'files')?.set;

      try {
        if (nativeInputValueSetter) {
          nativeInputValueSetter.call(input, input.files);
        }

        // Trigger lại các sự kiện input và change để React có thể nhận diện sự thay đổi
        var inputEvent = new Event('input', {
          bubbles: true
        });
        var changeEvent = new Event('change', {
          bubbles: true
        });

        input.dispatchEvent(inputEvent);
        input.dispatchEvent(changeEvent);
      } catch (e) {}
    }

    // Giả lập xóa nội dung
    function simulateClearing(inputElement, delay = 50, callback) {
      let text = inputElement.val();
      let index = text.length;

      function deleteNext() {
        if (index > 0) {
          inputElement.val(text.slice(0, --index)); // Xóa ký tự cuối cùng
          inputElement.trigger($.Event("keydown", {
            key: "Backspace",
            keyCode: 8
          }));
          setTimeout(deleteNext, delay);
        } else if (callback) {
          callback(); // Gọi callback sau khi xóa xong
        }
      }

      deleteNext();
    }

    // Giả lập gõ nội dung
    function simulateTyping(inputElement, text, event = "input", delay = 100, callback = null) {
      let index = 0;

      function typeNext() {
        if (index < text.length) {
          let char = text[index];
          inputElement.val(inputElement.val() + char);
          inputElement.trigger($.Event(event, {
            key: char,
            keyCode: char.charCodeAt(0),
            bubbles: true
          }));
          inputElement.trigger($.Event(event, {
            key: char,
            keyCode: char.charCodeAt(0),
            bubbles: true
          }));
          index++;
          setTimeout(typeNext, delay);
        } else {
          // Giả lập xóa khoảng trắng cuối cùng
          inputElement.trigger($.Event(event, {
            key: "Backspace",
            keyCode: 8,
            bubbles: true
          }));
          inputElement.trigger(event);
          inputElement.select();

          if (window.getSelection) {
            window.getSelection().removeAllRanges();
          } else if (document.selection) {
            document.selection.empty();
          }

          if ("createEvent" in document) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent(event, false, true);
            $(inputElement).get(0).dispatchEvent(evt);
          } else {
            $(inputElement).get(0).fireEvent(`on${event}`);
          }

          if (typeof callback === "function") {
            callback();
          }
        }
      }

      typeNext();
    }

    // Giả lập dán nội dung
    function simulatePaste(inputElement, pastedText, event = "input", callback = null) {
      // Đặt giá trị như người dùng dán
      var el = inputElement[0];

      // Gán trực tiếp thông qua setter gốc (để React nhận biết)
      var nativeSetter = Object.getOwnPropertyDescriptor(el.__proto__, 'value')?.set;
      nativeSetter ? nativeSetter.call(el, pastedText) : inputElement.val(pastedText);

      // Tạo clipboardData giả để gửi sự kiện paste
      var pasteEvent = new ClipboardEvent('paste', {
        bubbles: true,
        cancelable: true,
        clipboardData: new DataTransfer()
      });

      pasteEvent.clipboardData.setData('text/plain', pastedText);

      // Gửi sự kiện paste
      el.dispatchEvent(pasteEvent);

      // Gửi sự kiện input để đảm bảo state được cập nhật
      el.dispatchEvent(new InputEvent(event, {
        bubbles: true
      }));

      // Gửi sự kiện change nếu cần (để framework bắt được)
      el.dispatchEvent(new Event('change', {
        bubbles: true
      }));

      // Gọi callback nếu có
      if (typeof callback === "function") {
        callback();
      }
    }

    // Giả lập input file
    function simulateReactInput(input, text, delay) {
      delay = delay || 100;
      var el = input[0];
      input.focus();

      var i = 0;

      function setNativeValue(element, value) {
        var lastValue = element.value;
        element.value = value;

        // Gọi setter gốc nếu bị React override
        var event = new Event('input', {
          bubbles: true
        });
        var tracker = element._valueTracker;
        if (tracker) tracker.setValue(lastValue);
        element.dispatchEvent(event);
      }

      function typeChar() {
        if (i < text.length) {
          var newVal = input.val() + text[i];
          setNativeValue(el, newVal);
          i++;
          typeChar();
        }
      }

      typeChar();
    }

    // Giả lập làm trống input
    function simulateClearReactInput(input) {
      var el = input[0];

      function setNativeValue(element, value) {
        var lastValue = element.value;
        element.value = value;

        var event = new Event('input', {
          bubbles: true
        });
        var tracker = element._valueTracker;
        if (tracker) tracker.setValue(lastValue);
        element.dispatchEvent(event);
      }

      input.focus();
      setNativeValue(el, '');
    }

    // Đổi màu giao diện
    $(".tp-container.tp-content .color-theme input").on("change", function() {
      boxAlert("ĐỔI THEME GIAO DIỆN")
      var newTheme = $(this).val();
      var $body = $("body");

      var config = getConfig("TP-CONFIG-APP");
      config["appThemeForWeb"] = newTheme;
      setConfig("TP-CONFIG-APP", config);

      console.log(newTheme);

      // Lặp qua tất cả các class hiện có trên body
      // và loại bỏ những class bắt đầu bằng 'tp-theme-'
      $body[0].classList.forEach(function(className) {
        if (className.startsWith("tp-theme-")) {
          $body.removeClass(className);
        }
      });

      // Thêm class theme mới
      $body.addClass(`tp-theme-${newTheme}`);

      if (newTheme == "option")
        applyConfig();
      else
        $body.removeAttr("style");
    })

    loadColorConfigs(); // Tải cấu hình màu sắc khi trang được tải

    function loadColorConfigs() {
      // Lấy cấu hình đã lưu
      boxAlert("ĐANG TẢI CẤU HÌNH ĐÃ ĐƯỢC LƯU");
      var color_config = getConfig().color;

      console.log(color_config)

      $("input[data-css-var]").each(function() {
        var key = $(this).attr("data-css-var");

        console.log(key);

        if (key == "background-image-main-content") {
          var url = color_config[key].split(`"`);
          url = url[url.length - 2];

          console.log(url);

          $(this).val(url);
        } else if (key == "background-blur-notification-bar") {
          var data = color_config[key].replace("px", "");

          $(this).val(data);
        } else if (key == "background-image-repeat-main-content") {
          var data = color_config[key] == "repeat" ? "Lặp Lại" : "Không Lặp Lại";
          $(this).parent().find("p").text(data);
        } else if (key == "background-image-size-main-content") {
          console.log("ABC ", color_config[key]);
          var data = color_config[key] == "cover" ? "Đầy Đủ" : color_config[key] == "contain" ? "Vừa Giao Diện" : "Tùy Chỉnh"
          console.log(data);
          $(this).parent().find("p").text(data);
        } else {
          $(this).val(color_config[key]);

          $(this).parent().css("color", color_config[key]);

          console.log(color_config[key]);
        }
      })

      return;

      // Hàm trợ giúp để kiểm tra xem một chuỗi có phải là màu hợp lệ (hex, rgb hoặc rgba) hay không
      const isColorString = (str) => {
        return (str && (str.startsWith('#') || str.startsWith('rgb(') || str.startsWith('rgba(')));
      };

      // Lặp qua tất cả các input có thuộc tính data-css-var hoặc data-css-var-part
      $('input[data-css-var], [data-css-var-part], select[data-css-var-part]').each(function() {
        const $this = $(this);
        const cssVarName = $this.data('css-var'); // Đối với input đơn lẻ
        const partName = $this.data('css-var-part'); // Đối với input là một phần của thuộc tính phức tạp

        let valueToApply = null;
        let jsVarName = null;

        if (cssVarName) { // Xử lý input đơn lẻ
          jsVarName = (cssVarName);
          if (savedConfig.color && typeof savedConfig.color[jsVarName] !== 'undefined') {
            valueToApply = savedConfig.color[jsVarName];
          } else if (typeof savedConfig[jsVarName] !== 'undefined') {
            valueToApply = savedConfig[jsVarName];
          }
        } else if (partName) { // Xử lý input là một phần của thuộc tính phức tạp
          const baseCssVarName = partName.substring(0, partName.lastIndexOf('-'));
          jsVarName = varCSSToVarJs(baseCssVarName);
          const propertyType = partName.split('-').pop();

          if (savedConfig.color && savedConfig.color[jsVarName] && typeof savedConfig.color[jsVarName] === 'object') {
            valueToApply = savedConfig.color[jsVarName][propertyType];
          }
        }

        if (valueToApply !== null) {
          // Xử lý các input border
          if (partName && partName.startsWith('border-') && partName.endsWith('-width')) {
            const borderConfig = savedConfig.color[varCSSToVarJs(partName.replace('-width', ''))];
            if (borderConfig) {
              $this.val(borderConfig.width);
              $(`#${$this.attr('id').replace('width', 'style')}`).val(borderConfig.style);
              $(`#${$this.attr('id').replace('width', 'color')}`).val(rgbToHex(borderConfig.color));
            }
          }
          // Xử lý các input filter
          else if (partName && partName.startsWith('filter-') && partName.endsWith('-type')) {
            const filterConfig = savedConfig.color[varCSSToVarJs(partName.replace('-type', ''))];
            if (filterConfig) {
              $this.val(filterConfig.type);
              $(`#${$this.attr('id').replace('type', 'value')}`).val(filterConfig.value);
              $(`#${$this.attr('id').replace('type', 'unit')}`).val(filterConfig.unit);
            }
          }
          // Xử lý link ảnh: loại bỏ url("") nếu có
          else if (cssVarName && cssVarName.includes('image') && typeof valueToApply === 'string' && valueToApply.startsWith('url("')) {
            $this.val(valueToApply.substring(5, valueToApply.length - 2));
          }
          // Xử lý các input màu
          else if ($this.attr('type') === 'color') {
            const hexValue = isColorString(valueToApply) ? rgbToHex(valueToApply) : valueToApply;
            $this.val(hexValue);
          }
          // Xử lý các input select (ví dụ: filter unit, border style)
          else if ($this.is('select')) {
            $this.val(valueToApply);
          }
          // Xử lý các input text/number khác
          else {
            const rgbValue = isColorString(valueToApply) && valueToApply.startsWith('#') ? hexToRgbA(valueToApply) : valueToApply;
            $this.val(rgbValue);
          }

          // Áp dụng giá trị gốc vào biến CSS (chỉ áp dụng cho các input có data-css-var)
          // Việc áp dụng này sẽ được applyConfig() xử lý dựa trên theme hiện tại
          if (cssVarName) {
            let cssValue = valueToApply;
            if (cssVarName.includes('image') && typeof cssValue === 'string' && cssValue.trim() !== '' && !cssValue.startsWith('url(')) {
              cssValue = `url("${cssValue}")`;
            }
            // Không setProperty ở đây nữa, để applyConfig() quyết định
            // document.documentElement.style.setProperty(cssVarName, cssValue);
            console.log(`Đã tải giá trị vào input: ${cssVarName} -> ${cssValue}`);
          }
        } else {
          // Nếu không có giá trị đã lưu, lấy từ computed style (giá trị hiện tại của CSS)
          // Chỉ lấy computed style cho các biến CSS trực tiếp (data-css-var)
          if (cssVarName) {
            const computedValue = getComputedStyle(document.documentElement).getPropertyValue(cssVarName).trim();
            console.log(`Không có giá trị lưu cho ${cssVarName}. Lấy từ computed style: ${computedValue}`);

            if (computedValue && computedValue !== 'initial' && computedValue !== 'unset') {
              if ($this.attr('type') === 'color') {
                try {
                  const tempElement = document.createElement('div');
                  tempElement.style.color = computedValue;
                  document.body.appendChild(tempElement);
                  const hexColor = rgbToHex(getComputedStyle(tempElement).color);
                  $this.val(hexColor);
                  document.body.removeChild(tempElement);
                } catch (e) {
                  console.warn(`Lỗi khi chuyển đổi màu computed cho input type="color": ${e.message}. Sử dụng giá trị thô.`);
                  $this.val(computedValue);
                }
              } else if (cssVarName.includes('image') && typeof computedValue === 'string' && computedValue.startsWith('url("')) {
                $this.val(computedValue.substring(5, computedValue.length - 2));
              } else {
                $this.val(computedValue);
              }
              // Không setProperty ở đây nữa, để applyConfig() quyết định
              // document.documentElement.style.setProperty(cssVarName, computedValue);
            } else {
              console.warn(`Không thể lấy giá trị hợp lệ cho ${cssVarName} từ computed style.`);
            }
          }
        }
      });
    }

    // Gán sự kiện 'input' và 'change' cho tất cả các input và select có thuộc tính data-css-var HOẶC data-css-var-part
    $('input[data-css-var]').on('input change', function() {
      var color_config = getConfig();
      var key = $(this).attr("data-css-var");

      if (key == "background-blur-notification-bar") {
        color_config.color[key] = `${$(this).val()}px`;
      } else if (key == "background-image-repeat-main-content") {
        color_config.color[key] = $(this).val().toString().toLowerCase() == "lặp lại" ? "repeat" : "no-repeat";
      } else if (key == "background-image-size-main-content") {
        var size = $(this).val().toString().toLowerCase().replace("đẩy đủ") == "cover";
        size = $(this).val().toString().toLowerCase().replace("vừa giao diện") == "contain";

        if (size != "cover" || size != "contain")
          size = `${$("input[data-css-var='background-size-width']").val()}% ${$("input[data-css-var='background-size-height']").val()}%`
        console.log(size);
        color_config.color[key] = size;
      } else {
        color_config.color[key] = $(this).val();
      }

      setConfig("TP-CONFIG-APP", color_config);
      applyConfig();

      return;
      const $this = $(this);
      let config = getConfig(); // Lấy cấu hình hiện tại

      // Xử lý input thông thường (màu sắc, link ảnh, scale)
      if ($this.data('css-var')) {
        const cssVarName = $this.data('css-var');
        const jsVarName = (cssVarName);
        let newValue = $this.val();

        if ($this.attr('type') === 'color') {
          newValue = hexToRgbA(newValue); // Chuyển HEX sang RGB/RGBA để lưu và áp dụng vào CSS
        } else if (cssVarName.includes('image') && newValue.trim() !== '') {
          // Đối với link ảnh, lưu trữ link thô, không có url("")
          // applyConfig sẽ thêm url("") khi áp dụng vào CSS
          newValue = newValue;
        }

        if (config.color && Object.prototype.hasOwnProperty.call(config.color, jsVarName)) {
          config.color[jsVarName] = newValue;
        } else {
          config[jsVarName] = newValue; // Lưu ở cấp root nếu không phải màu
        }
      }
      // Xử lý các input là một phần của thuộc tính phức tạp (filter, border)
      else if ($this.data('css-var-part')) {
        const partName = $this.data('css-var-part'); // Ví dụ: --filter-background-image-content-type
        const baseCssVarName = partName.substring(0, partName.lastIndexOf('-')); // Ví dụ: --filter-background-image-content
        const baseJsVarName = varCSSToVarJs(baseCssVarName); // Ví dụ: filterBackgroundImageContent
        const propertyType = partName.split('-').pop(); // Ví dụ: type, value, unit, width, style, color

        // Đảm bảo cấu trúc object tồn tại trong config.color
        if (!config.color[baseJsVarName] || typeof config.color[baseJsVarName] !== 'object') {
          // Khởi tạo cấu trúc mặc định nếu chưa có
          if (baseJsVarName.startsWith('--filter')) {
            config.color[baseJsVarName] = {
              type: "none",
              value: 0,
              unit: ""
            };
          } else if (baseJsVarName.startsWith('--border')) {
            config.color[baseJsVarName] = {
              width: 0,
              style: "solid",
              color: "rgb(0, 0, 0)"
            };
          }
        }

        // Cập nhật giá trị cho từng phần
        if (propertyType === 'width' || propertyType === 'value') {
          config.color[baseJsVarName][propertyType] = parseFloat($this.val()) || 0;
        } else if (propertyType === 'color') {
          config.color[baseJsVarName][propertyType] = hexToRgbA($this.val());
        } else {
          config.color[baseJsVarName][propertyType] = $this.val();
        }
      }

      setConfig("TP-CONFIG-APP", config); // Lưu cấu hình đã cập nhật
      applyConfig(); // Áp dụng lại toàn bộ cấu hình để cập nhật CSS
    });

    function hexToRgbA(hex, alpha) {
      let c;
      // Kiểm tra định dạng hex hợp lệ và loại bỏ dấu '#'
      if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split(''); // Loại bỏ '#' và chia thành mảng ký tự
        if (c.length === 3) {
          // Xử lý định dạng #RGB thành #RRGGBB
          c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join(''); // Chuyển đổi thành giá trị thập lục phân

        // Tính toán các giá trị R, G, B
        const r = (c >> 16) & 255;
        const g = (c >> 8) & 255;
        const b = c & 255;

        // Trả về định dạng RGBA nếu có alpha, ngược lại trả về RGB
        if (typeof alpha !== 'undefined' && alpha >= 0 && alpha <= 1) {
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
        return `rgb(${r}, ${g}, ${b})`;
      }
      // Trả về null nếu định dạng hex không hợp lệ
      console.error(`Định dạng Hex không hợp lệ: ${hex}`);
      return null;
    }

    // Hàm chuyển đổi RGB sang Hex (đã có trong file TOOLv2.js, giữ lại để đảm bảo tính độc lập nếu cần)
    function rgbToHex(rgb) {
      var match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.?\d*))?\)$/);
      if (!match) {
        return rgb;
      }
      var r = parseInt(match[1]);
      var g = parseInt(match[2]);
      var b = parseInt(match[3]);
      var hexR = r.toString(16).padStart(2, '0');
      var hexG = g.toString(16).padStart(2, '0');
      var hexB = b.toString(16).padStart(2, '0');
      return "#" + hexR + hexG + hexB;
    }

    function varCSSToVarJs(kebabString) {
      // Loại bỏ '--' ở đầu và chia chuỗi thành mảng các từ dựa trên dấu '-'
      const parts = kebabString.replace("--", "").split("-");

      // Chuyển đổi các từ thành camelCase
      const camelCaseParts = parts.map((part, index) => {
        // Từ đầu tiên giữ nguyên chữ thường
        if (index === 0) {
          return part;
        }
        // Các từ còn lại viết hoa chữ cái đầu tiên
        return part.charAt(0).toUpperCase() + part.slice(1);
      });

      // Nối các phần lại với nhau để tạo thành chuỗi cuối cùng
      return camelCaseParts.join("");
    }

    function varJsToVarCSS(camelCaseString) {
      // Chuyển từ camelCase thành kebab-case
      const kebabCaseString = camelCaseString.replace(/([A-Z])/g, "-$1").toLowerCase();

      // Thêm tiền tố '--' vào đầu chuỗi
      return `--${kebabCaseString}`;
    }

    // Tách giá
    function tachGia(price) {
      var gia = price.toString().replace(",", "");
      gia = gia.replace(".", "");
      gia = gia.trim();
      //boxAlert(gia);
      var mid = Math.ceil(gia.length / 2);
      var du = Math.floor(gia.length % 2);

      var giaDau = gia.slice(0, mid - du);
      var giaDuoi = gia.slice(mid - du);

      var lastDau = parseInt(giaDau);
      var lastDuoi = parseInt(giaDuoi);

      giaDau = lastDau.toString().padEnd(gia.length, "0");
      giaDuoi = lastDuoi.toString().padEnd(gia.length, "0");
      while (parseInt(giaDau) < parseInt(giaDuoi) && giaDau.length <= giaDau.length) {
        giaDuoi = giaDuoi.split("");
        giaDuoi.pop();
        giaDuoi = giaDuoi.join("");
      }

      var giaCuoi = giaDuoi;

      //giaDau = giaDau.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      //giaDuoi = giaDuoi.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      //gia = gia.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      //boxAlert(giaDuoi);
      //boxLogging(`Giá Gốc ${gia} => Giá Đuôi ${giaDuoi}`, [`${gia}`, `${giaDuoi}`], ["green", "yellow"]);

      return {
        gia,
        giaDau,
        giaDuoi
      };
    }

    // Gộp giá
    function gopGia(beforePrice, afterPrice) {
      afterPrice = afterPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      beforePrice = beforePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      var giaTruoc = beforePrice,
        giaSau = afterPrice;

      var len = beforePrice.split(",").length;
      var dong = 0,
        arrayTien = [],
        tienTruoc = 0,
        tienSau = 0;
      arrayTien = beforePrice.split(",");
      dong = arrayTien[arrayTien.length - 1];
      for (var i = 0; i < arrayTien.length - 1; i++) {
        tienTruoc += arrayTien[i];
      }

      tienTruoc = parseInt(tienTruoc);
      if (parseInt(dong) > 0)
        tienTruoc += 1;

      arrayTien = afterPrice.split(",");
      dong = arrayTien[arrayTien.length - 1];
      for (i = 0; i < arrayTien.length - 1; i++) {
        tienSau += arrayTien[i];
      }

      tienSau = parseInt(tienSau);
      if (parseInt(dong) > 0)
        tienSau += 1;

      afterPrice = tienSau + "000";
      beforePrice = tienTruoc + "000";

      var arrayBefore = beforePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',').split(",");
      var arrayAfter = afterPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',').split(",");

      var lastPrice = [],
        giaDau, giaDuoi;

      for (i = 0; i < arrayBefore.length - 1; i++) {
        giaDau += arrayBefore[i];
      }

      for (i = 0; i < arrayAfter.length - 1; i++) {
        giaDuoi += arrayAfter[i];
      }

      giaDau = giaDau.substring(9);
      giaDuoi = giaDuoi.substring(9);

      lastPrice = beforePrice.split("");

      $.each(lastPrice, (index, value) => {
        lastPrice[index] = 0;
      })

      var flagDau, flagCuoi;

      $.each(giaDau.split(""), (index, value) => {
        lastPrice[index] = giaDau[index];
        flagDau = index;
      })

      $.each(giaDuoi.split(""), (index, value) => {
        if (lastPrice.length - giaDuoi.length + index == flagDau) {
          lastPrice[flagDau - 1] = parseInt(lastPrice[flagDau - 1]) + 1;
        }
        lastPrice[lastPrice.length - giaDuoi.length + index] = giaDuoi[index];
      })

      lastPrice = lastPrice.join("");

      return {
        giaTruoc,
        giaSau,
        gia: lastPrice
      };
    }

    // Gộp các obj
    function deepMergeByKey(targetObj, key, newData) {
      if (!targetObj[key]) {
        targetObj[key] = {};
      }

      function deepMerge(target, source) {
        for (var k in source) {
          if (source[k] && typeof source[k] === "object" && !Array.isArray(source[k])) {
            if (!target[k] || typeof target[k] !== "object") {
              target[k] = {};
            }

            deepMerge(target[k], source[k]);

          } else {
            target[k] = source[k]; // Ghi đè nếu không phải object
          }
        }
      }

      deepMerge(targetObj[key], newData);
    }

    // Cuộn tới cuối trang
    function scrollToBottom(onCompleteCallback) {
      let lastHeight = 0;
      let attempts = 0;
      var maxAttempts = 50; // Giới hạn số lần cuộn
      var scrollAnimationDuration = 600; // Thời gian animation cuộn (milliseconds)
      var delayAfterAnimation = 800; // Thời gian chờ sau animation để nội dung mới tải

      function scrollLoop() {
        var currentHeight = $(document).height();

        if (attempts >= maxAttempts) {
          console.log(`Đã đạt giới hạn ${maxAttempts} lần cuộn. Dừng lại.`);
          if (typeof onCompleteCallback === 'function') {
            onCompleteCallback("max_attempts_reached");
          }
          return;
        }

        if (currentHeight === lastHeight && attempts > 0) {
          console.log("Đã đạt đến cuối trang hoặc không còn sản phẩm để tải.");
          if (typeof onCompleteCallback === 'function') {
            onCompleteCallback("end_of_page");
          }
          return;
        }

        // Cuộn xuống cuối trang hiện tại với animation
        $('html, body').animate({
          scrollTop: currentHeight
        }, scrollAnimationDuration, 'swing', function() {
          // Callback sau khi animation hoàn tất
          console.log(`[${attempts + 1}/${maxAttempts}] Đã hoàn thành cuộn animation. Chiều cao: ${currentHeight}`);
          lastHeight = currentHeight; // Cập nhật chiều cao cuối cùng

          setTimeout(() => {
            // Đợi một chút để Shopee tải thêm nội dung trước khi kiểm tra lại
            var newHeight = $(document).height();
            if (newHeight > currentHeight) {
              // Nếu có nội dung mới, cuộn tiếp
              attempts++;
              scrollLoop();
            } else {
              // Nếu không, có thể đã đến cuối
              console.log("Không có thêm nội dung được tải. Có thể đã đến cuối trang.");
              if (typeof onCompleteCallback === 'function') {
                onCompleteCallback("no_new_content");
              }
            }
          }, delayAfterAnimation);
        });
      }

      scrollLoop(); // Bắt đầu quá trình cuộn
    }

    // Hàm theo dõi phần tử
    function waitForElement(root, selector, callback, options = {}) {
      var {
        once = true,
          timeout = null,
          waitForLastChange = false,
          delay = 300
      } = options;

      var rootNode = (window.jQuery && root instanceof window.jQuery) ? root[0] :
        (Array.isArray(root) && root[0] instanceof Node) ? root[0] :
        root;

      if (!(rootNode instanceof Node)) {
        console.error("❌ waitForElement: root không phải DOM node hợp lệ:", rootNode);
        return null; // TRẢ VỀ NULL NẾU ROOT KHÔNG HỢP LỆ
      }

      let observer = null;
      let timeoutId = null;
      let delayTimer = null;
      let lastMatchedElement = null;
      let foundAndTriggered = false; // Biến cờ để đảm bảo callback chỉ chạy một lần nếu once là true

      function runCallback(el) {
        if (foundAndTriggered && once) { // Nếu đã chạy và là once, thoát
          return;
        }
        foundAndTriggered = true; // Đánh dấu đã chạy

        callback(el);
        if (once) {
          if (observer) {
            observer.disconnect();
            observer = null; // Gán lại null sau khi disconnect
          }
          if (timeoutId) clearTimeout(timeoutId);
          if (delayTimer) clearTimeout(delayTimer);
        }
      }

      // Kiểm tra ban đầu, nhưng không sử dụng cho logic SPA (once: false)
      var initial = rootNode.querySelector(selector);
      if (initial && !waitForLastChange && once) {
        runCallback(initial);
        return null; // Nếu tìm thấy ngay và once là true, không cần observer
      }

      observer = new MutationObserver(() => {
        // Chỉ tiếp tục nếu chưa tìm thấy và kích hoạt và không phải là once HOẶC là once nhưng chưa kích hoạt
        if (foundAndTriggered && once) {
          return;
        }

        var found = rootNode.querySelector(selector);
        if (found) {
          lastMatchedElement = found;

          if (waitForLastChange) {
            clearTimeout(delayTimer);
            delayTimer = setTimeout(() => runCallback(lastMatchedElement), delay);
          } else {
            runCallback(found);
          }
        }
      });

      observer.observe(rootNode, {
        childList: true,
        subtree: true
      });

      if (timeout) {
        timeoutId = setTimeout(() => {
          if (!foundAndTriggered) { // Chỉ xử lý timeout nếu callback chưa được gọi
            if (observer) {
              observer.disconnect();
              observer = null;
            }
            if (waitForLastChange && lastMatchedElement) {
              runCallback(lastMatchedElement);
            } else {
              // Nếu timeout mà không tìm thấy gì (hoặc không có nội dung đủ)
              // và không có lastMatchedElement, có thể gọi callback với null
              callback(null); // Báo hiệu timeout cho bên ngoài
            }
          }
        }, timeout);
      }

      return observer; // Trả về observer để có thể disconnect từ bên ngoài
    }

    function awaitForElement(root, selector, options = {}) {
      return new Promise((resolve, reject) => {
        const timeout = options.timeout || 0;

        let actualObserver = null;
        let promiseTimeoutId = null;

        const customCallback = (el) => {
          if (promiseTimeoutId) clearTimeout(promiseTimeoutId);
          resolve(el);
        };

        actualObserver = waitForElement(root, selector, customCallback, {
          ...options,
          once: true
        });

        if (!actualObserver) {
          reject(new Error("waitForElement failed to initialize, root may be invalid."));
          return;
        }

        if (timeout > 0) {
          promiseTimeoutId = setTimeout(() => {
            if (actualObserver) actualObserver.disconnect();
            reject(new Error(`Timeout waiting for element: ${selector}`));
          }, timeout);
        }
      });
    }

    // Chờ
    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Lấy file từ GitHub, sử dụng GM_xmlhttpRequest để bỏ qua CSP
    async function getFileGitHub(path, getRawContent = false) {
      console.log(`Đang tải file ${path} từ GitHub`);

      if (!path) {
        console.error(`Đường dẫn file không được cung cấp`);
        return null;
      }

      var owner = 'pntan';
      var repo = 'TPTOOL';
      var branch = 'main';
      var url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}&_=${Date.now()}`;

      return new Promise((resolve, reject) => {
        // Kiểm tra nếu GM_xmlhttpRequest có sẵn (chạy trong Tampermonkey/Greasemonkey)
        if (typeof GM_xmlhttpRequest !== 'undefined') {
          GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: {
              "Authorization": `${_GITHUB_KEY}`,
              "Content-Type": "application/json"
            },
            onload: function(response) {
              if (response.status >= 200 && response.status < 300) {
                try {
                  var json = JSON.parse(response.responseText);
                  console.log(`Phản hồi từ GitHub API: ${json.name} (${json.size} bytes)`, json);

                  if (json.content) {
                    // Giải mã Base64 và UTF-8
                    const binaryString = atob(json.content);
                    const len = binaryString.length;
                    const bytes = new Uint8Array(len);
                    for (let i = 0; i < len; i++) {
                      bytes[i] = binaryString.charCodeAt(i);
                    }
                    const decoder = new TextDecoder('utf-8');
                    var content = decoder.decode(bytes);

                    if (getRawContent) {
                      resolve(content);
                    } else {
                      try {
                        resolve(JSON.parse(content));
                      } catch (e) {
                        console.warn(`File ${path} không phải JSON hợp lệ. Trả về nội dung thô. Lỗi: ${e.message}`);
                        resolve(content);
                      }
                    }
                  } else if (json.type === 'dir') {
                    console.error(`Đường dẫn ${path} là thư mục, không phải file.`);
                    resolve(null);
                  } else {
                    console.error(`Không có nội dung file cho ${path}`);
                    resolve(null);
                  }
                } catch (e) {
                  console.error(`Lỗi xử lý phản hồi từ GitHub: ${e.message}`);
                  resolve(null);
                }
              } else {
                console.error(`Lỗi khi tải file từ GitHub (Status: ${response.status}): ${response.statusText}`);
                try {
                  const errorData = JSON.parse(response.responseText);
                  console.error(`Chi tiết lỗi: ${errorData.message || 'Không có chi tiết'}`);
                } catch (e) {
                  // Bỏ qua lỗi phân tích nếu responseText không phải JSON
                }
                resolve(null);
              }
            },
            onerror: function(response) {
              console.error(`Lỗi kết nối khi tải file từ GitHub: ${response.error}`);
              resolve(null);
            }
          });
        } else {
          // Fallback sang fetch nếu không phải môi trường Tampermonkey
          // Lưu ý: Phần này có thể vẫn bị chặn bởi CSP nếu không chạy trong Tampermonkey.
          fetch(url, {
              headers: {
                Authorization: `${_GITHUB_KEY}`,
              }
            })
            .then(res => {
              if (!res.ok) {
                return res.json().then(errorData => {
                  throw new Error(errorData.message || res.statusText);
                });
              }
              return res.json();
            })
            .then(json => {
              console.log(`Phản hồi từ GitHub API: ${json.name} (${json.size} bytes)`, json);

              if (json.content) {
                const binaryString = atob(json.content);
                const len = binaryString.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                  bytes[i] = binaryString.charCodeAt(i);
                }
                const decoder = new TextDecoder('utf-8');
                var content = decoder.decode(bytes);

                if (getRawContent) {
                  resolve(content);
                } else {
                  try {
                    resolve(JSON.parse(content));
                  } catch (e) {
                    console.warn(`File ${path} không phải JSON hợp lệ. Trả về nội dung thô. Lỗi: ${e.message}`);
                    resolve(content);
                  }
                }
              } else if (json.type === 'dir') {
                console.error(`Đường dẫn ${path} là thư mục, không phải file.`);
                resolve(null);
              } else {
                console.error(`Không có nội dung file cho ${path}`);
                resolve(null);
              }
            })
            .catch(e => {
              console.error(`Lỗi kết nối hoặc xử lý khi lấy file: ${e.message}`);
              resolve(null);
            });
        }
      });
    }

    // Lấy URL máy chủ từ GitHub
    async function getUrlServer() {
      boxAlert(`Đang tải URL máy chủ từ GitHub`, "info");

      try {
        // Lấy file từ GitHub API
        var content = await getFileGitHub("urlNgrok");
        if (content) {
          var json = JSON.parse(content);
          return json.url;
        } else {
          console.error("Không thể lấy URL máy chủ");
          return null;
        }
      } catch (e) {
        console.error("Lỗi khi lấy URL máy chủ:", e.message);
        return null;
      }
    }

    // lấy nonce từ tag có sẵn trong trang
    function getNonce() {
      let nonce = $('script[nonce]').attr('nonce');

      if (!nonce)
        nonce = $('meta[http-equiv="Content-Security-Policy"]').attr('content')?.match(/nonce-([\w\d]+)/)?.[1] || '';

      return nonce || '';
    }

    // Áp dụng nonce
    function applyNonce() {
      var nonce = getNonce();
      if (!nonce) return console.warn('Không tìm thấy nonce');

      // Style inline
      $('style:not([nonce])').attr('nonce', nonce);

      // Iframe
      $('iframe:not([nonce])').attr('nonce', nonce);

      // Script do tool tạo
      $('script:not([nonce]):not([src])').attr('nonce', nonce);
    }

    // Sự kiện nhấn tab cho textarea
    $(document).on("keydown", ".tp-container.tp-content textarea", function(event) {
      boxAlert("Đang theo dõi sự kiện nhấn tab của textarea")
      if (event.keyCode == 9) { // keyCode 9 là mã ASCII của phím Tab
        event.preventDefault();

        var start = this.selectionStart;
        var end = this.selectionEnd;

        $(this).val($(this).val().substring(0, start) + '\t' + $(this).val().substring(end));

        this.selectionStart = this.selectionEnd = start + 1;
      }
    })

    var isResizing = false;
    // Kéo vị trí của giao diện chính
    $(".tp-container.tp-draggable").draggable({
      start: function(event, ui) {
        // Nếu đang resize thì không cho drag
        if (isResizing) return false;
        // var width = $(this).outerWidth();
        // var height = $(this).outerHeight();
        // $(this).draggable('option', 'cursorAt', { left: Math.floor(width / 2), top: Math.floor(height / 2) });
      },

      drag: function(event, ui) {
        var offset = $(this).offset();
        var xPos = offset.left;
        var yPos = offset.top;
        //localStorage.setItem("positionYTP",yPos);
        //localStorage.setItem("positionXTP",xPos);
        //boxAlert(`Tọa độ hiện tại X: ${xPos} - Y: ${yPos}`);
        //boxLogging(`Tọa độ hiện tại X: ${xPos} - Y: ${yPos}`, [`${xPos}`, `${yPos}`], ["orange", "yellow"]);

        var $this = $(this);
        var parentWidth = $this.parent().width();
        var parentHeight = $this.parent().height();
        var elementWidth = $this.outerWidth();
        var elementHeight = $this.outerHeight();

        // Tính toán lại right và bottom
        var newRight = parentWidth - (ui.position.left + elementWidth);
        var newBottom = parentHeight - (ui.position.top + elementHeight);

        // Áp dụng lại
        $this.css({
          'right': newRight + 'px',
          'bottom': newBottom + 'px',
          'left': 'auto', // Đảm bảo left và top không ghi đè
          'top': 'auto'
        });
      },
    });

    // Chọn chức năng
    $(".tp-container .TP-APPVIEW .TP-APP-BOX").on("click", function() {
      var choiceFunction = $(this).attr("data-function");

      $(".tp-container .TP-APPVIEW").addClass("hidden");

      $(".tp-container.tp-content .layout-tab").removeClass("active");

      if ($(`.tp-container.tp-content .layout-tab.${choiceFunction}`).length != 1)
        $(`.tp-container.tp-content .layout-tab.no-layout`).addClass("active");
      else
        $(`.tp-container.tp-content .layout-tab.${choiceFunction}`).addClass("active");

      $(this).parent().parent().find(".layout-future").addClass("active");

      $(".tp-container.tp-content .button-control  button#excuse-command").attr("data-func", choiceFunction.trim());

      writeTutorial(choiceFunction);
    })

    // Ẩn hiện giao diện
    $(".tp-container.tp-button-toggle").on("click", function() {
      if (isResizing)
        return;
      if ($(this).hasClass("active")) {
        $(this).removeClass("active");
        $(".tp-container.tp-content").removeClass("active");
        boxAlert("Ẩn Giao Diện");
        // $(this).find("svg").remove().append($(`<i class="fa-solid fa-eye"></i>`));
      } else {
        $(this).addClass("active");
        $(".tp-container.tp-content").addClass("active");
        boxAlert("Hiện Giao Diện");
        // $(this).find("svg").remove().append($(`<i class="fa-solid fa-eye-slash"></i>`));
      }
    });

    // Trở lại màn hình chọn chức năng
    $(".tp-container.tp-content .layout-future .back").on("click", function() {
      $(this).parent().removeClass("active");
      $(this).parent().parent().find(".TP-APPVIEW").removeClass("hidden");
    })

    // Chọn chức năng
    $(".tp-container .TP-select .TP-select-list-option .TP-select-option").on("click", function() {
      $(this).parent().parent().find(".TP-select-choice .option-name input").val("");
      simulateTyping($(this).parent().parent().find(".TP-select-choice .option-name input"), $(this).find(".option-name p").text(), "input", 50);
    })

    // Chọn màn hình hiển thị
    $(".tp-container.tp-content .footer-content .bottom-navbar .navbar-item").on("click", function() {
      var screen = $(this).data("screen");

      $(".tp-container.tp-content .body-content .screen-content").removeClass("active");
      $(".tp-container.tp-content .body-content .screen-content." + screen).addClass("active");
    })

    // Load nội dung chọn từ select box
    function loadLayoutSelectBox(el) {
      console.log(el)
      var layout = el.find(".option-name").attr("data-layout");

      el.parent().parent().parent().find(`.layout-future .layout-tab`).removeClass("active");
      el.parent().parent().parent().find(`.layout-future .layout-tab.${layout}`).addClass("active");
    }

    // Ghi lại tên chức năng hiện tại
    $(".tp-container .TP-select .TP-select-choice .option-name input").on("input", function() {
      $(this).parent().find("p").text($(this).val());
    })

    // Kéo thả input file
    $(".TP-input-file .TP-input-view input").on("change", (e) => {
      var fileLength = e.target.files.length
      $(e.target).parent().find("p").text(`Đã tải lên ${fileLength} tệp`); // Sửa chính tả một chút

      var fileList = e.target.files; // e.target.files đã là FileList, không cần $(...)

      console.log(fileList);

      $(".TP-input-file .TP-file-view").empty();

      $.each(fileList, (i, file) => { // Đổi tên biến 'v' thành 'file' để dễ hiểu hơn
        // Kiểm tra nếu tệp là hình ảnh
        if (file.type.startsWith('image/')) {
          var reader = new FileReader();

          reader.onload = function(e) {
            var imageUrl = e.target.result; // URL của hình ảnh
            var html = `
							<div class="TP-file-box">
								<img src="${imageUrl}" alt="${file.name}" />
								<div class="TP-file-info">
									<p class="TP-file-name">${file.name}</p>
									<p class="TP-file-size">${Math.round(file.size / 1024)} kB</p>
									<p class="TP-file-lastChange">${new Date(file.lastModified).toLocaleDateString()}</p>
								</div>
							</div>
						`;
            $(".TP-input-file .TP-file-view").prepend(html);
          };

          reader.readAsDataURL(file); // Đọc tệp dưới dạng URL dữ liệu
        } else {
          // Xử lý các tệp không phải hình ảnh (ví dụ: hiển thị icon mặc định)
          var html = `
						<div class="TP-file-box">
							<img src="placeholder.png" alt="File icon" />
							<div class="TP-file-info">
								<p class="TP-file-name">${file.name}</p>
								<p class="TP-file-size">${Math.round(file.size / 1024)} kB</p>
								<p class="TP-file-lastChange">${new Date(file.lastModified).toLocaleDateString()}</p>
							</div>
						</div>
					`;
          $(".TP-input-file .TP-file-view").prepend(html);
        }
      });
    });

    // Thực hiện chức năng hiện tại
    $(".tp-container.tp-content #excuse-command").on("click", function() {
      var func = $(this).attr("data-func");
      if (actionMap[func]) actionMap[func]();
      else boxAlert(`Hàm ${func} không xác định`, "error");
    });

    // Chuyển tên thành icon
    function converTextToIcon(iconName) {
      var shopeeIcon = `
					<!-- SHOPEE -->
					<svg aria-label="SHOPEE" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
						<path fill="#f4511e" d="M36.683,43H11.317c-2.136,0-3.896-1.679-3.996-3.813l-1.272-27.14C6.022,11.477,6.477,11,7.048,11 h33.904c0.571,0,1.026,0.477,0.999,1.047l-1.272,27.14C40.579,41.321,38.819,43,36.683,43z"></path><path fill="#f4511e" d="M32.5,11.5h-2C30.5,7.364,27.584,4,24,4s-6.5,3.364-6.5,7.5h-2C15.5,6.262,19.313,2,24,2 S32.5,6.262,32.5,11.5z"></path><path fill="#fafafa" d="M24.248,25.688c-2.741-1.002-4.405-1.743-4.405-3.577c0-1.851,1.776-3.195,4.224-3.195 c1.685,0,3.159,0.66,3.888,1.052c0.124,0.067,0.474,0.277,0.672,0.41l0.13,0.087l0.958-1.558l-0.157-0.103 c-0.772-0.521-2.854-1.733-5.49-1.733c-3.459,0-6.067,2.166-6.067,5.039c0,3.257,2.983,4.347,5.615,5.309 c3.07,1.122,4.934,1.975,4.934,4.349c0,1.828-2.067,3.314-4.609,3.314c-2.864,0-5.326-2.105-5.349-2.125l-0.128-0.118l-1.046,1.542 l0.106,0.087c0.712,0.577,3.276,2.458,6.416,2.458c3.619,0,6.454-2.266,6.454-5.158C30.393,27.933,27.128,26.741,24.248,25.688z"></path>
					</svg>`;

      var tiktokIcon = `
					<!-- TIKTOK -->
				<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
					<path d="M41,4H9C6.243,4,4,6.243,4,9v32c0,2.757,2.243,5,5,5h32c2.757,0,5-2.243,5-5V9C46,6.243,43.757,4,41,4z M37.006,22.323 c-0.227,0.021-0.457,0.035-0.69,0.035c-2.623,0-4.928-1.349-6.269-3.388c0,5.349,0,11.435,0,11.537c0,4.709-3.818,8.527-8.527,8.527 s-8.527-3.818-8.527-8.527s3.818-8.527,8.527-8.527c0.178,0,0.352,0.016,0.527,0.027v4.202c-0.175-0.021-0.347-0.053-0.527-0.053 c-2.404,0-4.352,1.948-4.352,4.352s1.948,4.352,4.352,4.352s4.527-1.894,4.527-4.298c0-0.095,0.042-19.594,0.042-19.594h4.016 c0.378,3.591,3.277,6.425,6.901,6.685V22.323z"></path>
				</svg>`

      var lazadaIcon = `
					<!-- LAZADA -->
				<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 100 100">
					<path fill="#f9b621" d="M74.007,18.001c0.204,0,0.403,0.056,0.576,0.163l16.427,10.109c0.61,0.375,0.989,1.054,0.989,1.77	v29.085c0,0.724-0.367,1.384-0.982,1.766L51.055,85.699C50.738,85.896,50.373,86,50,86s-0.738-0.104-1.055-0.301L8.982,60.895	C8.367,60.513,8,59.853,8,59.129V30.044c0-0.716,0.379-1.395,0.989-1.77l16.427-10.109c0.173-0.107,0.373-0.163,0.576-0.163	c0.205,0,0.406,0.057,0.58,0.165l15.354,9.53c2.426,1.506,5.218,2.302,8.073,2.302s5.647-0.796,8.073-2.302l15.354-9.53	C73.602,18.058,73.802,18.001,74.007,18.001"></path><path fill="#f5905f" d="M50,52L8.228,29.125C8.087,29.408,8,29.72,8,30.044v29.085c0,0.724,0.367,1.384,0.982,1.766	l39.963,24.805C49.262,85.896,49.627,86,50,86V52z"></path><path fill="#ee4267" d="M50,52l41.772-22.875C91.913,29.408,92,29.72,92,30.044v29.085c0,0.724-0.367,1.384-0.982,1.766	L51.055,85.699C50.738,85.896,50.373,86,50,86V52z"></path><path fill="#ee5490" d="M92,30.04v29.09c0,0.72-0.37,1.38-0.98,1.76L85,64.63v-31.8l6.77-3.71C91.91,29.41,92,29.72,92,30.04	z"></path><polygon fill="#ef5684" points="85,32.83 85,64.63 79,68.35 79,36.11"></polygon><polygon fill="#ef517b" points="79,36.11 79,68.35 73,72.08 73,39.4"></polygon><polygon fill="#ef4a75" points="73,39.4 73,72.08 67,75.8 67,42.69"></polygon><polygon fill="#f2ac0f" points="41,27.12 41,47.07 35,43.78 35,23.4"></polygon><path fill="#f59173" d="M47,29.7v20.66l-6-3.29V27.12l0.93,0.58C43.49,28.67,45.21,29.34,47,29.7z"></path><path fill="#f27c7c" d="M53,29.7v20.66L50,52l-3-1.64V29.7c0.98,0.2,1.99,0.3,3,0.3S52.02,29.9,53,29.7z"></path><path fill="#f16e7c" d="M59,27.12v19.95l-6,3.29V29.7c1.79-0.36,3.51-1.03,5.07-2L59,27.12z"></path><polygon fill="#ef6388" points="65,23.4 65,43.78 59,47.07 59,27.12"></polygon><path fill="#ee5490" d="M91.77,29.12L65,43.78V23.4l8.43-5.23C73.6,18.06,73.8,18,74.01,18c0.2,0,0.4,0.06,0.57,0.16	l16.43,10.11C91.34,28.48,91.61,28.78,91.77,29.12z"></path><path fill="#1f212b" d="M50,87c-0.559,0-1.105-0.156-1.582-0.451L8.455,61.744C7.544,61.179,7,60.201,7,59.128V30.044	c0-1.062,0.562-2.066,1.465-2.622l16.427-10.109c0.665-0.409,1.542-0.408,2.207,0.002l15.355,9.532	c2.268,1.407,4.877,2.151,7.546,2.151s5.278-0.744,7.546-2.151l15.354-9.53c0.669-0.414,1.544-0.413,2.209-0.004l16.427,10.109	C92.438,27.978,93,28.982,93,30.044v29.084c0,1.072-0.544,2.05-1.455,2.616L51.582,86.549C51.105,86.844,50.559,87,50,87z M25.416,18.165l0.524,0.852L9.514,29.125C9.196,29.32,9,29.672,9,30.044v29.084c0,0.376,0.19,0.718,0.51,0.917L49.473,84.85	c0.316,0.196,0.738,0.197,1.055,0L90.49,60.045C90.81,59.847,91,59.504,91,59.128V30.044c0-0.372-0.196-0.724-0.514-0.919	L74.007,19.001c-0.02,0-0.038,0.005-0.055,0.016l-15.352,9.529c-2.584,1.604-5.559,2.452-8.601,2.452s-6.017-0.848-8.601-2.452	l-15.354-9.53L25.416,18.165z"></path><polygon fill="#1f212b" points="50,52.57 7.76,29.438 8.24,28.562 50,51.43 91.76,28.562 92.24,29.438"></polygon><rect width="1" height="35" x="49.5" y="52" fill="#1f212b"></rect><path fill="#1f212b" d="M29.5,68.833c-0.091,0-0.182-0.024-0.264-0.075l-16.055-9.965C12.441,58.333,12,57.539,12,56.669	V35.5c0-0.276,0.224-0.5,0.5-0.5s0.5,0.224,0.5,0.5v21.169c0,0.522,0.265,0.999,0.709,1.274l16.055,9.965	c0.234,0.146,0.307,0.454,0.161,0.688C29.83,68.749,29.667,68.833,29.5,68.833z"></path><path fill="#1f212b" d="M44.5,78.144c-0.091,0-0.182-0.024-0.264-0.075l-1-0.621c-0.234-0.146-0.307-0.454-0.161-0.688	c0.146-0.235,0.456-0.305,0.688-0.161l1,0.621c0.234,0.146,0.307,0.454,0.161,0.688C44.83,78.06,44.667,78.144,44.5,78.144z"></path><path fill="#1f212b" d="M40.5,75.661c-0.091,0-0.182-0.024-0.264-0.075l-4-2.483c-0.234-0.146-0.307-0.454-0.161-0.688	c0.146-0.235,0.456-0.304,0.688-0.161l4,2.483c0.234,0.146,0.307,0.454,0.161,0.688C40.83,75.577,40.667,75.661,40.5,75.661z"></path><path fill="#1f212b" d="M84.418,30c-0.09,0-0.181-0.024-0.262-0.074l-9.351-5.754c-0.489-0.3-1.093-0.298-1.577,0.003	l-5.465,3.392c-0.232,0.146-0.542,0.074-0.688-0.161c-0.146-0.234-0.073-0.543,0.161-0.688l5.465-3.392	c0.811-0.503,1.817-0.504,2.628-0.005l9.351,5.754c0.235,0.145,0.309,0.453,0.164,0.688C84.749,29.916,84.585,30,84.418,30z"></path><path fill="#1f212b" d="M63.701,30c-0.167,0-0.33-0.084-0.425-0.236c-0.146-0.235-0.073-0.543,0.161-0.688l1.611-1	c0.233-0.144,0.542-0.074,0.688,0.161c0.146,0.235,0.073,0.543-0.161,0.688l-1.611,1C63.883,29.976,63.792,30,63.701,30z"></path>
				</svg>`

      var listicon = [];

      $.each(iconName, (i, v) => {
        if (v.includes("shopee"))
          listicon.push(shopeeIcon);
        if (v.toLowerCase().includes("tiktok"))
          listicon.push(tiktokIcon);
        if (v.toLowerCase().includes("lazada"))
          listicon.push(lazadaIcon);
      })

      return listicon;
    }

    // Lấy tên trang
    function getWebName() {
      var web_name = INFO_PAGE.url.host.toString().split(".");

      web_name = web_name[web_name.length - 2];
      return web_name;
    }


    function writeTutorial(tutorial) {
      boxAlert("Hướng Dẫn");
      tutorial = tutorial.trim();

      var listTutorial = {
        "giaDuoi": [
					`
					<p>Chức năng cho phép cập nhật giá đuôi</p>
					<p>Ví dụ <b>79.035</b> sẽ đổi thành <b>35.000</b> (số sẽ tự định dạng theo từng sàn)</p>
					<p>Dối với <b>Shopee</b> chương trình sẽ đổi giá của các sản phẩm đã được tích chọn</p>
					<p>Đối với <b>Tiktok</b> chương trình sẽ tự cuộn và thêm giá vào các sản phẩm cho đến hết</p>
					<p>Đối với <b>Lazada</b> chương trình sẽ tự bỏ giá hiện tại của phân loại đó và thêm bằng giá mới</p>
					`
				],
        "flashSale": [
					`
					<p>Mỗi sản phẩm là một dòng ngăn cách các thuộc tính bằng <b>1 tab</b></p>
					<p> - Tên hoặc một phần tên sản phẩm cần bật</p>
					<p> - Số Lượng của sản phẩm</p>
					<p> - Giá tiền của sán phẩm (có thể để trống)</p>
					<p>Khi chạy thì những sản phẩm được chọn sẽ được đánh dấu, thao tác bật tắt bằng nút ở giao diện shoppe</p>
					`
				]
      }

      if (listTutorial[tutorial])
        tutorial = listTutorial[tutorial];
      else
        tutorial = "<p>Chưa có hướng dẫn cho chức năng này</p>";

      $(".tp-container.tp-content .layout-future .tutorial .tutorial-container").empty().html(tutorial);
    }

    async function checkPath(truePath) {
      truePath = truePath.trim();
      var path = INFO_PAGE.url.pathname.trim();
      if (path.toString().includes(truePath)) {
        return true;
      } else {
        boxAlert("Không đúng đường dẫn", "error");
        boxToast(`Không đúng trang để thao tác`, "error");
        return false;
      }
    }

    // Cập nhật giá đuôi
    async function giaDuoi() {
      boxAlert("CẬP NHẬT GIÁ ĐUÔI");

      var web_name = getWebName();

      if (web_name.includes("shopee") && await checkPath("/portal/marketing/discount/"))
        giaDuoiShopee();
      else if (web_name.includes("tiktok") && checkPath("/promotion/marketing-tools/discount/edit/"))
        giaDuoiTiktok();
      else if (web_name.includes("lazada") && checkPath("/apps/product/publish/"))
        giaDuoiLazada();
      else {
        boxToast("Chức năng không thể thực hiện ở trang hiện tại");
        boxLogging("Không thể cập nhật giá đuôi");
      }

      function giaDuoiShopee() {
        var box = $(".discount-item-component");

        var indexBox = 0;

        function kTra5LanGia() {
          indexBox--;
          if (indexBox >= box.length)
            return;

          var minPrice = Infinity;
          var maxPrice = -Infinity;

          var parent = box.eq(indexBox).find(".discount-edit-item-model-list .discount-edit-item-model-component");

          var checkBox = box.eq(indexBox).find(".discount-item-header .header-left-area .header-left-top input");

          if (!checkBox.prop("checked")) {
            // Nếu sản phẩm chưa được chọn
            indexBox++;
            nextBox();
            return;
          }

          var indexParent = 0;

          function checkItem() {
            if (indexParent >= parent.length)
              return

            var name = parent.eq(indexParent).find(".item-content.item-variation .ellipsis-content.single");
            var currentPrice = parent.eq(indexParent).find(".item-content.item-price");
            var price = parent.eq(indexParent).find("form.eds-form.form.price-discount-form.eds-form--label-right .eds-form-item__content .eds-input.currency-input input");
            var percent = parent.eq(indexParent).find("form.eds-form.form.price-discount-form.eds-form--label-right .eds-form-item__content .eds-input.discount-input input");
            var stock = parent.eq(indexParent).find(".item-content.item-stock");
            var switcher = parent.eq(indexParent).find(".item-content.item-enable-disable .eds-switch.eds-switch--normal");

            var giaGoc = currentPrice.text().replace("₫", "");
            giaGoc = giaGoc.replace(".", "");

            var giaKM = price.val().replace("₫", "");
            giaKM = giaKM.replace(".", "");

            if (maxPrice < parseInt(giaGoc)) {
              maxPrice = parseInt(giaGoc);
              indexParent = 0;
              checkItem();
            }

            if (!switcher.hasClass("eds-switch--disabled")) {
              if (minPrice > parseInt(giaKM)) {
                minPrice = parseInt(giaKM);
                indexParent = 0;
                checkItem();
              }
            }

            var maxAccept = minPrice * 5;

            console.log(`Giá gốc: ${giaGoc}, Giá KM: ${giaKM}, Max Accept: ${maxAccept}, Max Price: ${maxPrice}, Min Price: ${minPrice}`);


            if (parseInt(giaGoc) > parseInt(maxAccept)) {
              boxLogging(`Sản phẩm [copy]${name.text()}[/copy] có giá quá cao, không thể cập nhật giá đuôi`, [`${name.text()}`], ["orange"]);
              parent.eq(indexParent).css({
                "background": "pink",
                "color": "#fff"
              });
              indexParent = 0;
              checkItem();
            }

            indexParent++;
            checkItem();
            return;
          };

          checkItem();
        }

        function nextBox() {
          if (indexBox >= box.length) {
            boxLogging("Đã cập nhật giá đuôi cho tất cả sản phẩm");
            boxToast("Đã sửa giá đuôi cho các sản phẩm được chọn", "success");
            return;
          }

          var parent = box.eq(indexBox).find(".discount-edit-item-model-list .discount-edit-item-model-component");

          var checkBox = box.eq(indexBox).find(".discount-item-header .header-left-area .header-left-top input");

          if (!checkBox.prop("checked")) {
            // Nếu sản phẩm chưa được chọn
            indexBox++;
            nextBox();
            return;
          }

          var indexParent = 0;

          var minPrice = Infinity;
          var maxPrice = -Infinity;
          var maxAccept = 0;

          async function nextParent() {
            if (indexParent >= parent.length) {
              boxLogging(`Đã cập nhật giá đuôi`);
              await delay(1000);
              // Kiểm tra giá đuôi
              // kTra5LanGia();

              var maxPriceText = $("span.max-price");
              var minPriceText = $("span.min-price");
              var avgPriceText = $("span.avg-price");

              maxPriceText.text(maxPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "₫");
              minPriceText.text(minPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "₫");

              // var maxAccept = minPrice * 5;
              var minAccept = maxAccept / 5;

              console.log(minAccept, maxAccept, minPrice, maxPrice);

              if (minAccept > minPrice)
                minPrice = Math.ceil(parseInt(maxPrice) / 5);

              if (maxAccept < maxPrice)
                maxPrice = gopGia(parseInt(maxAccept) - 1000, tachGia(maxPrice).giaDuoi).gia;

              avgPriceText.text(`Cao nhất ${maxPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "₫"} / Thấp nhất ${minPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "₫"}`);
              return;
            }

            var name = parent.eq(indexParent).find(".item-content.item-variation .ellipsis-content.single");
            var currentPrice = parent.eq(indexParent).find(".item-content.item-price");
            var price = parent.eq(indexParent).find("form.eds-form.form.price-discount-form.eds-form--label-right .eds-form-item__content .eds-input.currency-input input");
            var percent = parent.eq(indexParent).find("form.eds-form.form.price-discount-form.eds-form--label-right .eds-form-item__content .eds-input.discount-input input");
            var stock = parent.eq(indexParent).find(".item-content.item-stock");
            var switcher = parent.eq(indexParent).find(".item-content.item-enable-disable .eds-switch.eds-switch--normal");


            var gia = currentPrice.text().replace("₫", "");
            gia = gia.replace(".", "");

            var giaKM = tachGia(gia).giaDuoi;

            if (maxPrice < parseInt(gia)) {
              maxPrice = parseInt(gia);
              indexParent = 0;
              nextParent();
              return;
            }

            if (!switcher.hasClass("eds-switch--disabled")) {
              // Những sản phẩm không bị disabled
              if (!switcher.hasClass("eds-switch--open")) {
                // Những sản phẩm chưa được bật
                parent.eq(indexParent).css({
                  "background": "orange",
                  "color": "#fff"
                });
                // Bật công tắc
                switcher.trigger("click").click();
                boxLogging(`Sản phẩm ${name.text()} vừa được Bật`, [`${name.text()}`, "Bật"], ["orange", "green"]);

                await delay(500);
              }

              var giaKM5lan = giaKM;

              if (parseInt(giaKM5lan) <= 0) {
                giaKM5lan = price.val().replace("₫", "");
                giaKM5lan = giaKM5lan.replace(".", "");
              }

              // Kiểm tra 5 lần giá
              if (minPrice > parseInt(giaKM5lan)) {
                minPrice = parseInt(giaKM5lan);
                indexParent = 0;
                nextParent();
                return;
              }

              maxAccept = minPrice * 5;

              if (parseInt(gia) > parseInt(maxAccept)) {
                boxLogging(`Sản phẩm [copy]${name.text()}[/copy] có giá quá cao, không thể cập nhật giá đuôi`, [`${name.text()}`], ["orange"]);
                parent.eq(indexParent).css({
                  "background": "pink",
                  "color": "#fff"
                });
              }

              // Những sản phẩm đã bật						
              if (switcher.hasClass("eds-switch--open")) {
                // Những sản phẩm đã bật
                if (parseInt(giaKM) <= 0) {
                  // Những sản phẩm không có giá đuôi
                  parent.eq(indexParent).css({
                    "background": "crimson",
                    "color": "#fff"
                  });
                  boxLogging(`Sản phẩm [copy]${name.text()}[/copy] không có giá đuôi`, [`${name.text()}`], ["crimson"]);
                } else {
                  // Những sản phẩm có giá đuôi
                  simulateClearing($(price), 0, () => {
                    // Ghi giá đuôi vào ô giá
                    $(price).val(giaKM);
                    simulateReactEvent($(price), "input");
                  })

                  // parent.eq(index).css({
                  // 	"background": "green",
                  // 	"color": "white"
                  // });
                }
              }
            }

            indexParent++;
            nextParent();
          };

          nextParent();

          indexBox++;
          nextBox();
        };

        nextBox();
      }

      function giaDuoiLazada() {
        boxAlert(`Cập nhật giá đuôi`)
        var row = $(".next-table-row");
        var price = [];

        var indexRow = 0;
        async function nextRow() {
          if (indexRow >= row.length) {
            boxToast(`Đã cập nhật giá đuôi`, "success");
            boxLogging(`Đã cập nhất giá đuôi`);
            return;
          }

          var gia = row.eq(indexRow).find("input").val();
          var giaKM = tachGia(gia).giaDuoi;

          var name = row.eq(indexRow).find("td:nth-child(1) button span").text();

          if (row.eq(indexRow).find("td.special_price").has("button.next-btn").length == 0) {
            var currentPrice = parseInt($(".special-price .number-text-scope").attr("title"));
            if (currentPrice != giaKM) {
              var price = $(".special-price .number-text-scope");

              console.log(price);

              simulateReactEvent(price, "mouseover");

              await delay(500);

              simulateReactEvent($(".next-overlay-wrapper .next-balloon-content button:nth-child(1) i"), "click");
            }
          } else {
            row.eq(indexRow).find("td.special_price button.next-btn").click();
          }

          await delay(200);

          var balloon = $(".next-overlay-wrapper .next-balloon-content").last();

          console.log(balloon);

          var inputPrice = balloon.eq(0).find(".money-number-picker input");
          var buttonClick = balloon.eq(0).find(".action-wrapper button:nth-child(1)");

          simulateClearReactInput(inputPrice);

          inputPrice.select();

          inputPrice.attr("value", giaKM);

          inputPrice.val(giaKM);

          inputPrice.blur();

          await delay(200);

          buttonClick.click();

          await delay(200);

          boxLogging(`Đã cập nhật giá đuôi cho ${name}`, [`${name}`], ["pink"]);

          return;
        };
      }

      function giaDuoiTiktok() {
        async function processProductsByLastFlag() {
          let scrolledWithoutNewProducts = false;
          let consecutiveSkippedProducts = 0; // Biến đếm số sản phẩm liên tiếp đã có giá khuyến mãi
          const MAX_CONSECUTIVE_SKIPS = 5; // Ngưỡng: 5 sản phẩm liên tiếp đã có giá

          let productProcesscount = 0

          while (true) {
            productProcesscount++;
            var allProductRows = $(".theme-arco-table-content-inner .theme-arco-table-body").find("div div > div");
            let nextProductToProcess = null;

            let lastFlaggedRow = allProductRows.filter(".tp-flag").last();
            let startIndex = 0;

            if (lastFlaggedRow.length > 0) {
              startIndex = allProductRows.index(lastFlaggedRow) + 1;
            }

            for (let i = startIndex; i < allProductRows.length; i++) {
              let currentRow = $(allProductRows).eq(i);

              if (!currentRow.is(".theme-arco-table-tr, .theme-arco-table-row-custom-expand, .styled")) {
                // Nếu là hàng không hợp lệ, không tính vào số lượng skipped liên tiếp
                // nhưng vẫn cần chuyển sang hàng tiếp theo để tìm sản phẩm
                continue;
              }

              // Nếu hàng đã có tp-flag (trường hợp DOM thay đổi)
              if (currentRow.hasClass("tp-flag")) {
                // Nếu hàng này đã được đánh dấu, chúng ta vẫn xem xét nó là "skipped" theo một nghĩa nào đó
                // Tuy nhiên, để chính xác theo yêu cầu "có giá khuyến mãi", chúng ta sẽ xử lý riêng
                continue;
              }

              // Đây là hàng hợp lệ và chưa được xử lý (chưa có tp-flag)
              nextProductToProcess = currentRow;
              break;
            }

            if (nextProductToProcess) {
              // Đã tìm thấy một sản phẩm chưa xử lý (chưa có tp-flag)
              scrolledWithoutNewProducts = false;
              consecutiveSkippedProducts = 0; // Reset đếm khi tìm thấy sản phẩm cần xử lý

              nextProductToProcess.addClass("tp-flag");

              var nameElement = nextProductToProcess.find(".theme-arco-table-td").eq(0).find("span");
              var productName = nameElement.text().trim();

              var activeStatus = nextProductToProcess.find(".theme-arco-table-td").eq(nextProductToProcess.find(".theme-arco-table-td").length - 1).find("button[role='switch']");

              // Kiểm tra và kích hoạt khuyến mãi để thao tác
              if (!activeStatus.attr("aria-checked"))
                simulateReactEvent(activeStatus, "click");

              boxLogging(`Đang xử lý sản phẩm: "${productName}"`, [`${productName}`], ["cyan"]);

              var currentPrice = nextProductToProcess.find(".theme-arco-table-td").eq(1).find("span p");
              var promotionPrice = nextProductToProcess.find(".theme-arco-table-td").eq(2).find("input");

              if (promotionPrice.length > 0) {
                if (promotionPrice.val().length > 0) {
                  boxLogging(`Sản phẩm "${productName}" đã có giá khuyến mãi. Bỏ qua.`, [`${productName}`], ["gray"]);
                  consecutiveSkippedProducts++; // Tăng đếm khi sản phẩm đã có giá
                  // await delay(50); 
                } else { // Chưa có giá khuyến mãi, tiến hành nhập
                  var gia = currentPrice.text();
                  gia = gia.replace(/[,.₫]/g, '');
                  gia = tachGia(gia).giaDuoi;

                  promotionPrice.get(0).scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                  });

                  if (parseInt(gia) == 0) {
                    boxLogging(`Sản phẩm "${productName}" có giá bằng 0. Bỏ qua.`, [`${productName}`], ["yellow"]);
                    consecutiveSkippedProducts = 0; // Reset đếm khi bỏ qua vì giá 0

                    // Tắt khuyến mãi cho phân loại không có giá đuôi
                    simulateReactEvent(activeStatus, "click");
                    // await delay(50);
                  } else {
                    // Tương tác UI và chờ đợi
                    simulateReactEvent(promotionPrice, "focus");
                    // await delay(300);
                    // await delay(500);

                    // simulateReactInput(promotionPrice, gia, 50);

                    simulateReactInput(promotionPrice, gia);
                    simulateReactEvent(promotionPrice, "blur");

                    var formattedGia = gia.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    boxLogging(`[copy]${nameElement.text()}[/copy] đã cập nhật từ ${currentPrice.text()} -> ${formattedGia}`, [`${nameElement.text()}`, `${currentPrice.text()}`, `${formattedGia}`], ["green", "orange", "orange"]);
                    consecutiveSkippedProducts = 0; // Reset đếm khi sản phẩm được xử lý
                  }
                }
              } else {
                boxLogging(`Sản phẩm "${productName}" không có ô nhập giá khuyến mãi.`, [], ["yellow"]);
                consecutiveSkippedProducts = 0; // Reset đếm khi không có ô nhập
              }

              // Kiểm tra điều kiện dừng nếu đã có N sản phẩm liên tiếp bị bỏ qua vì đã có giá
              if (consecutiveSkippedProducts >= MAX_CONSECUTIVE_SKIPS) {
                boxLogging(`Đã bỏ qua ${MAX_CONSECUTIVE_SKIPS} sản phẩm liên tiếp do đã có giá khuyến mãi. Coi như đã xử lý xong các sản phẩm mới thêm vào. Kết thúc quá trình.`, [], ["green"]);
                boxToast(`Đã hoàn tất cập nhật giá! ${MAX_CONSECUTIVE_SKIPS} sản phẩm liên tiếp đã có giá sẵn.`, "success");
                break; // Thoát vòng lặp chính
              }

              await delay(150);

            } else {
              // Không tìm thấy sản phẩm chưa xử lý nào trên DOM hiện tại (tất cả đã được gắn cờ hoặc không hợp lệ)
              // Đây là lúc ta xác định tất cả các hàng hợp lệ đang hiển thị đều đã được xử lý.
              // Reset consecutiveSkippedProducts ở đây vì chúng ta đang cuộn xuống, không phải bỏ qua liên tiếp
              consecutiveSkippedProducts = 0;

              boxLogging("Đã xử lý tất cả sản phẩm hợp lệ hiện có trên màn hình. Thử cuộn để tải thêm...", [], ["gray"]);
              window.scrollTo(0, document.body.scrollHeight);
              await delay(3000);

              var reloadedProductRows = $(".theme-arco-table-content-inner .theme-arco-table-body").find("div div > div");

              let newUnprocessedFoundAfterScroll = false;
              for (let i = 0; i < reloadedProductRows.length; i++) {
                let row = $(reloadedProductRows).eq(i);
                if (row.is(".theme-arco-table-tr, .theme-arco-table-row-custom-expand, .styled") && !row.hasClass("tp-flag")) {
                  newUnprocessedFoundAfterScroll = true;
                  break;
                }
              }

              if (!newUnprocessedFoundAfterScroll) {
                if (scrolledWithoutNewProducts) {
                  boxLogging("Không tìm thấy sản phẩm mới chưa xử lý sau nhiều lần cuộn. Kết thúc quá trình.", [], ["blue"]);
                  boxToast("Đã hoàn tất cập nhật giá cho tất cả sản phẩm có thể tìm thấy!", "success");
                  break;
                } else {
                  boxLogging("Lần đầu cuộn không thấy sản phẩm mới. Có thể chưa load xong, sẽ thử lại...", [], ["yellow"]);
                  scrolledWithoutNewProducts = true;
                }
              } else {
                boxLogging(`Tìm thấy sản phẩm mới sau khi cuộn. Tiếp tục xử lý...`, [], ["blue"]);
                scrolledWithoutNewProducts = false;
              }
            }
          }

          boxLogging("Quá trình xử lý sản phẩm đã hoàn tất.", [], ["blue"]);
        }

        processProductsByLastFlag();
      }
    }

    // Bật flash sale
    async function flashSale() {
      var web_name = getWebName();

      if (web_name.includes("shopee") && (checkPath("/portal/marketing/shop-flash-sale/create") || checkPath("/portal/marketing/shop-flash-sale/")))
        flashSaleShopee();

      function flashSaleShopee() {
        var data = $(".tp-container.tp-content .layout-tab.flashSale .data").val().split("\n");
        var nameList = [],
          countList = [],
          priceList = [];
        var capNhatGia = $(".tp-container.tp-content .layout-future input#gia").prop("checked");
        $.each(data, (index, value) => {
          value = value.split("\t");
          nameList.push(value[0]);
          countList.push(value[1] || -1);
          priceList.push(value[2] || -1)
        });

        var container = $(".products-container-content form.product-table .table-card");

        // var choiceAll = container.parent().find(".shopee-fixed-top-card.product-fixed-header.edit-fixed-header label.eds-checkbox.item-selector").click().click();

        var indexContainer = 0;

        function nextContainer() {
          if (indexContainer > container.length) {
            boxToast("Hoàn thành đánh dấu sản phẩm", "success")
            return;
          }

          var productBox = container.eq(indexContainer).find(".inner-rows .inner-row");

          var indexProductBox = 0;

          function nextProductBox() {
            if (indexProductBox > productBox.length) {
              return;
            }

            productBox.eq(indexProductBox).css({
              "background": "transparent",
              "color": "#000"
            });

            var productName = productBox.eq(indexProductBox).find(".variation .ellipsis-content");
            var originalPrice = productBox.eq(indexProductBox).find(".original-price");
            var currentcyPrice = productBox.eq(indexProductBox).find(".currency-input input");
            var perPrice = productBox.eq(indexProductBox).find(".discount-input input");
            var campaignStock = productBox.eq(indexProductBox).find(".campaign-stock input");
            var currentStock = productBox.eq(indexProductBox).find(".current-stock");
            var buttonSwitch = productBox.eq(indexProductBox).find(".eds-switch.eds-switch--close.eds-switch--normal");

            var productText = productName.text()?.replace(/\s+/g, ' ').normalize("NFKC").trim().toLowerCase() || "";

            let pos = nameList.findIndex(value => productText.includes(value.toLowerCase()));

            if (pos != -1) {
              var name = nameList[pos],
                count = countList[pos];

              if (count == -1)
                count = parseInt(currentStock.text());

              if (parseInt(currentStock.text()) >= parseInt(count)) {
                // Xử lý số lượng

                simulateClearing($(campaignStock), 50, () => {
                  $(campaignStock).val(count);
                  simulateReactEvent($(campaignStock), "input");
                })

                if (capNhatGia) {
                  simulateClearing($(currentcyPrice), 50, () => {
                    var giaKM = tachGia((originalPrice.text().replace(".", "")).replace("₫", "")).giaDuoi;
                    giaKM = parseInt(giaKM) - 1000;
                    giaKM = giaKM.toString().split("");
                    giaKM[giaKM.length - 1] = "1";
                    giaKM = giaKM.join("");
                    $(currentcyPrice).val(giaKM);
                    simulateReactEvent($(currentcyPrice), "input");
                  })
                }

                if (!buttonSwitch.hasClass("eds-switch--open")) {
                  console.log(buttonSwitch);
                  console.log(productBox.eq(indexProductBox).find(".item-selector"));

                  // simulateReactEvent($(buttonSwitch), "click");
                  // buttonSwitch.click();
                  // buttonSwitch.parent().parent().parent().trigger("click");

                  // simulateReactEvent($(productBox).eq(index).find(".item-selector"), "click");
                  productBox.eq(indexProductBox).find(".item-selector").trigger("click");
                  productBox.eq(indexProductBox).find(".item-selector input.eds-checkbox__input").val("true");
                }

                boxLogging(`Đã chọn: [copy]${productName.text()}[/copy]\n\tGiá: ${originalPrice.text()}\n\tSố Lượng: ${count}/${campaignStock.val()}\n`, [`${productName.text()}`, `${originalPrice.text()}`, `${count}`, `${campaignStock.val()}`], ["crimson", "green", "blue", "blue"]);
              }

              // boxLogging(`${productName.text()} không đủ số lượng\n\tGiá: ${originalPrice.text()}\n\tSố Lượng: ${count}/${campaignStock.val()}\n`, [`${productName.text()}`, `${originalPrice.text()}`, `${count}`, `${campaignStock.val()}`], ["crimson", "green", "blue", "blue"]);
            } else {
              // boxLogging(`Sản phẩm ${productName.text()} không có trong danh sách`, [`${productName.text()}`], ["crimson"]);
            }

            indexProductBox++;
            nextProductBox();
          };

          nextProductBox();

          indexContainer++;
          nextContainer();
        };

        nextContainer();
      }
    }

    // Sửa giá theo SKU
    async function suaGiaTheoSKU() {
      boxAlert("SỬA GIÁ THEO SKU")
      var type = $(".tp-container.tp-content #type option:selected");
      type = type.data("type");

      var data = $(".tp-container.tp-content .layout-future textarea#data");
      var arrayData = data.val().split("\n");
      $.each(arrayData, (index, value) => {
        var listData = value.toString().split("\t");
        var sku = listData[0];
        var gia = listData[1];

        var box = $(".variation-model-table-main .eds-scrollbar.middle-scroll-container .eds-scrollbar__content .variation-model-table-body .table-cell-wrapper");

        $.each(box, (index, value) => {
          var skuBox = box.eq(index).find(".table-cell").eq(2).find("textarea");
          var priceBox = box.eq(index).find(".table-cell").eq(0).find("input");

          switch (type) {
            case "all":
              if (skuBox.val().includes(sku)) {
                var priceBox1 = priceBox.val().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || "Không";
                var gia1 = gia.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

                if (parseInt(priceBox.val()) < parseInt(gia)) {
                  boxLogging(`SKU: [copy]${skuBox.val()}[/copy] có giá mới cao hơn giá hiện tại (${gia1} > ${priceBox1})`, [`${skuBox.val()}`], ["crimson"]);
                  box.eq(index).css("background", "crimson");
                } else {
                  priceBox.val(gia);

                  simulateClearReactInput($(priceBox));
                  simulateReactInput($(priceBox), gia);
                  // simulateReactEvent($(priceBox), "input");
                  // box.eq(index).css("background", "lightgreen");
                  boxLogging(`Giá của [copy]${skuBox.val()}[/copy] đã sửa từ ${priceBox1} thành ${gia1}`, [`${skuBox.val()}`, `${priceBox1}`, `${gia1}`], ["lightgreen", "orange", "orange"]);
                }
              }
              break;

            case "duoi":
              if (skuBox.val().includes(sku)) {
                var price = tachGia(priceBox.val());
                var giaDau = price.giaDau;
                var giaDuoi = gia;

                var editPrice = gopGia(giaDau, giaDuoi);

                if (parseInt(editPrice.gia) > parseInt(price.gia)) {
                  giaDau = parseInt(giaDau) - 1000;

                  editPrice = gopGia(giaDau, giaDuoi);
                }

                if (parseInt(giaDuoi) > parseInt(giaDau)) {
                  boxLogging(`Bỏ qua SKU: [copy]${skuBox.val()}[/copy] (có giá đuôi cao hơn giá đầu)`, [`${skuBox.val()}`], ["crimson"]);
                  box.eq(index).css("background", "crimson");
                  return;
                } else if (parseInt(giaDuoi) >= parseInt(giaDau) - 5000) {
                  boxLogging(`SKU [copy]${skuBox.val()}[/copy] có giá đuôi cận giá đầu`, [`${skuBox.val()}`], ["orange"]);
                  box.eq(index).css("background", "orange");
                  simulateClearReactInput($(priceBox));
                  simulateReactInput($(priceBox), editPrice.gia);
                  // priceBox.val(editPrice.gia);
                  // simulateReactEvent($(priceBox), "input");
                } else {
                  boxLogging(`Giá của [copy]${skuBox.val()}[/copy] đã sửa từ ${price.gia} thành ${editPrice.gia}`, [`${skuBox.val()}`, `${price.gia}`, `${editPrice.gia}`], ["lightgreen", "green", "green"]);
                  simulateClearReactInput($(priceBox));
                  simulateReactInput($(priceBox), editPrice.gia);
                  // priceBox.val(editPrice.gia);
                  // simulateReactEvent($(priceBox), "input");
                  box.eq(index).css("background", "lightgreen");
                }
              }
              break;

            case "dau":
              if (skuBox.val().includes(sku)) {
                var price = tachGia(priceBox.val());
                var giaDau = gia;
                var giaDuoi = price.giaDuoi;

                var editPrice = gopGia(giaDau, giaDuoi);

                if (parseInt(editPrice.gia) > parseInt(price.gia)) {
                  boxLogging(`SKU: [copy]${skuBox.val()}[/copy] có giá mới cao hơn giá hiện tại (${editPrice.gia} > ${price.gia})`, [`${skuBox.val()}`], ["crimson"]);
                  box.eq(index).css("background", "crimson");
                  return;
                }

                if (parseInt(giaDuoi) > parseInt(giaDau)) {
                  boxLogging(`Bỏ qua SKU: [copy]${skuBox.val()}[/copy] (có giá đuôi cao hơn giá đầu)`, [`${skuBox.val()}`], ["crimson"]);
                  box.eq(index).css("background", "crimson");
                  return;
                } else if (parseInt(giaDuoi) >= parseInt(giaDau) - 5000) {
                  boxLogging(`SKU [copy]${skuBox.val()}[/copy] có giá đuôi cận giá đầu`, [`${skuBox.val()}`], ["orange"]);
                  box.eq(index).css("background", "orange");
                  simulateClearReactInput($(priceBox));
                  simulateReactInput($(priceBox), editPrice.gia);
                  // priceBox.val(editPrice.gia);
                  // simulateReactEvent($(priceBox), "input");
                } else {
                  boxLogging(`Giá của [copy]${skuBox.val()}[/copy] đã sửa từ ${price.gia} thành ${editPrice.gia}`, [`${skuBox.val()}`, `${price.gia}`, `${editPrice.gia}`], ["lightgreen", "green", "green"]);
                  simulateClearReactInput($(priceBox));
                  simulateReactInput($(priceBox), editPrice.gia);
                  // priceBox.val(editPrice.gia);
                  // simulateReactEvent($(priceBox), "input");
                  box.eq(index).css("background", "lightgreen");
                }
              }
              break;
          }
        });
      });

      boxToast("Đã sửa giá các SKU được chọn", "success")
    }
  }
