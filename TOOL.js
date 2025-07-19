	'use strict';

	// Trạng thái hiển thị của giao diện
	var createUI = false;

	// Phiên bản của chương trình
	const VERSION = "2.2.35";

	/*var Jqu = document.createElement("script");
	Jqu.setAttribute("src", "https://code.jquery.com/jquery-3.7.1.min.js");
	Jqu.setAttribute("rel", "preload");
	Jqu.setAttribute("async", "async");
	document.head.appendChild(Jqu);

	var JquUI = document.createElement("script");
	JquUI.setAttribute("src", "https://code.jquery.com/ui/1.14.1/jquery-ui.js");
	JquUI.setAttribute("rel", "preload");
	document.head.appendChild(JquUI);*/
		
	console.log(`%cTanPhan: %cCHƯƠNG TRÌNH ĐANG KHỞI ĐỘNG`, "color: crimson; font-size: 2rem", "color: orange; font-size: 1.5rem");

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
				if (currentUrl.includes('jquery.min.js') && typeof jQuery !== 'undefined') {
					alreadyExists = true;
				} else if (currentUrl.includes('elevatezoom.min.js') && typeof $.fn.elevateZoom !== 'undefined') {
					alreadyExists = true;
				}

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
	];

	loadLibrary(LIBRARIES, (e) => {
		console.log(`%cTanPhan: %cĐÃ THÊM THƯ VIỆN`, "color: crimson; font-size: 2rem", "color: orange; font-size: 1.5rem");
		INITCONFIG();		
	});

	function INITCONFIG(){
		boxAlert("ĐANG KHỞI TẠO GIAO DIỆN");
		if (createUI)
			return;
		createUI = true;

		createLayout($("body"));

		applyNonce();

		// Kết nối máy chủ
		// socket = getUrlServer();

		// Kiểm tra tự động mở các danh sách
		checkPage();

		// checkElementPage().then(mainContent => {
		// 	boxAlert("ĐÃ TÌM THẤY PHẦN TỬ CHÍNH CÓ NỘI DUNG");
		// 	createLayout(mainContent);
		// 	applyNonce();

		// 	// Kết nối máy chủ
		// 	// socket = getUrlServer();

		// 	// Kiểm tra tự động mở các danh sách
		// 	checkPage();
		// }).catch(err => {
		// 	boxAlert(`LỖI: ${err.message}`, "error");
		// 	console.error("Lỗi khi tìm phần tử chính:", err);
		// });

		const actionMap = {
			// --- SHOPEE
			"giaDuoiShopee": giaDuoiShopee,
			"kTr5LanGiaShopee": kTr5LanGiaShopee,
			"tinhGiaBan": tinhGiaBan,
			"flashSaleShopee": flashSaleShopee,
			"kiemTraMaPhanLoaiShopee": kiemTraMaPhanLoaiShopee,
			"suaGiaSKUShopee": suaGiaSKUShopee,
			"suaHinhSKUShopee": suaHinhSKUShopee,
			"suaTonSKUNhieuLinkShopee": suaTonSKUNhieuLinkShopee,
			"layLinkChuaSKUShopee": layLinkChuaSKUShopee,
			"themKyTuPhanLoaiShopee": themKyTuPhanLoaiShopee,
			"comboKMShopee": comboKMShopee,
			"cTrinhKMShopee": cTrinhKMShopee,
			"kiemTraPhanLoaiShopee": kiemTraPhanLoaiShopee,
			"themPhanLoaiNhieuLinkShopee": themPhanLoaiNhieuLinkShopee,
			"layPhanLoaiShopee": layPhanLoaiShopee,
			"layIDSanPhamShopee": layIDSanPhamShopee,
			// "themPhanLoaiShopee": themPhanLoaiShopee,
			// "giaDuoiChuongTrinhShopee": giaDuoiChuongTrinhShopee,
			// //"keoPhanLoaiShopee": keoPhanLoaiShopee,
			// //"batKhuyenMaiShopee": batKhuyenMaiShopee,
			// // --- TIKTOK
			"giaDuoiTiktok": giaDuoiTiktok,
			"saoChepFlashSaleTiktok": saoChepFlashSaleTiktok,
			"kiemTraMaPhanLoaiTiktok": kiemTraMaPhanLoaiTiktok,
			"chinhSuaKhuyenMaiTiktok": chinhSuaKhuyenMaiTiktok,
			"themPhanLoaiTiktok": themPhanLoaiTiktok,
			"themHinhTheoSKUTiktok": themHinhTheoSKUTiktok,
			"layIDSanPhamTiktok": layIDSanPhamTiktok,
			"xoaPhanLoaiTiktok": xoaPhanLoaiTiktok,
			"flashSaleTiktok": flashSaleTiktok,
			"suaGiaTheoSKUTiktok": suaGiaTheoSKUTiktok,
			// "tgFlashSaleTiktok": tgFlashSaleTiktok,
			// "ktraKhuyenMaiTiktok": ktraKhuyenMaiTiktok,
			// // --- SAPO
			"lienKetSKUSapo": lienKetSKUSapo,
			"hienThiThemDSSapo": hienThiThemDSSapo,
			// "kiemTraTonSapo": kiemTraTonSapo,
			// // -- LAZADA
			"giaDuoiLazada": giaDuoiLazada,
			"themPhanLoaiLazada": themPhanLoaiLazada,
			"khoiPhucSanPhamLazada": khoiPhucSanPhamLazada,
			"themHinhTheoSKULazada": themHinhTheoSKULazada,
			"layIDSanPhamLazada": layIDSanPhamLazada,
			"themGiaTheoSKULazada": themGiaTheoSKULazada,
			// "ktraGiaChuongTrinhKMLazada": ktraGiaChuongTrinhKMLazada,
			// //-- KHÁC
			"splitExcelFile": splitExcelFile,
			"mergeExcelFile": mergeExcelFile,
			"compareVoucher": compareVoucher,
			"moLink": moLink,
		};

		const actionOnlineMap = {
			"aiChat": aiChat,
		}

		const actionOptionMap = {
			"scaleMainContent": scaleMainContent
		}

		// lấy nonce từ tag có sẵn trong trang
		function getNonce(){
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

		// Giao diện nổi
		function boxPopup(html, words = [], colors = []){
			var log = $(".tp-popup").show();
			log.find(".content").empty().append(html);
		}

		// Nhấn để sao chép nội dung đã được đánh dấu
		$("body").on("click", ".copyable", function(){
			navigator.clipboard.writeText($(this).text().trim());
			boxToast(`Đã sao chép nội dung <u>${$(this).text().trim()}`);
		})

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

		// Ghi log
		function boxLogging(text, words = [], colors = []){
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

		function escapeRegExp(string) {
			return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		}

		// Ghi console log
		function boxAlert(content, type = "log"){
			switch(type){
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

		function boxToast(message, type = "info", duration = 3000) {
			var toast = $(`<div class="toast ${type}">${message}</div>`);
			$("#toast-container").append(toast);

			setTimeout(() => toast.addClass("show"), 10);

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

		// Chờ
		function delay(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
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
					const changeEvent = new Event("change", { bubbles: true });
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

		// Giả lập kéo thả tệp vào một phần tử (element)
		function simulateFileDrop(targetElement, files = [], options = {}) {
			var el = targetElement[0] || targetElement; // Đảm bảo el là DOM element

			if (!el) {
				console.warn("simulateFileDrop: Target element not found.");
				return;
			}

			var dataTransfer = new DataTransfer();
			files.forEach(file => {
				// Thay vì kiểm tra instanceof File, kiểm tra instanceof Blob
				// vì File kế thừa từ Blob và Blob ít bị ảnh hưởng bởi ngữ cảnh hơn trong trường hợp này.
				// Hoặc chỉ cần kiểm tra sự tồn tại của các thuộc tính cần thiết của một File/Blob.
				if (file && (file instanceof Blob || (typeof file.name === 'string' && typeof file.size === 'number' && typeof file.type === 'string'))) {
					dataTransfer.items.add(file);
				} else {
					console.warn("simulateFileDrop: Invalid file object provided. Must be an instance of File.", file);
					// Log chi tiết hơn để debug
					console.log("Details of invalid file:", file);
					if (file) {
						console.log("File constructor name:", file.constructor ? file.constructor.name : "N/A");
						try {
							console.log("Is file instanceof window.File?", file instanceof window.File);
							// Có thể thêm kiểm tra instanceof Blob của cửa sổ chính
							console.log("Is file instanceof window.Blob?", file instanceof window.Blob);
						} catch (e) {
							console.log("Error checking instanceof in window context:", e);
						}
					}
				}
			});

			if (dataTransfer.items.length === 0) {
				console.warn("simulateFileDrop: No valid files were added to DataTransfer.", files);
				return; // Không có file nào hợp lệ để kéo thả
			}

			const dragEvents = ['dragenter', 'dragover', 'drop'];

			dragEvents.forEach(eventType => {
				var event;
				if (eventType === 'dragenter' || eventType === 'dragover') {
					event = new DragEvent(eventType, {
						bubbles: true,
						cancelable: true,
						dataTransfer: dataTransfer,
						...options
					});
					event.preventDefault();
				} else if (eventType === 'drop') {
					event = new DragEvent(eventType, {
						bubbles: true,
						cancelable: true,
						dataTransfer: dataTransfer,
						...options
					});
					event.preventDefault();
				} else {
					event = new DragEvent(eventType, {
						bubbles: true,
						cancelable: true,
						...options
					});
				}
				el.dispatchEvent(event);
				console.log(`Dispatched ${eventType} event on`, el);
			});
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
					enter:      { key: 'Enter', code: 'Enter' },
					tab:        { key: 'Tab', code: 'Tab' },
					escape:     { key: 'Escape', code: 'Escape' },
					arrowup:    { key: 'ArrowUp', code: 'ArrowUp' },
					arrowdown:  { key: 'ArrowDown', code: 'ArrowDown' },
					arrowleft:  { key: 'ArrowLeft', code: 'ArrowLeft' },
					arrowright: { key: 'ArrowRight', code: 'ArrowRight' }
				};

				var keyData = keyMap[keyName.toLowerCase()] || { key: keyName, code: keyName };

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
				event = new Event(type, { bubbles: true, cancelable: true, ...options });
				el.dispatchEvent(event);
			}

			console.log(`Dispatched ${type} event on`, el);
		}

		// Giả lập input file
		function simulateReactInputFile(input) {
			var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'files')?.set;

			try{
				if (nativeInputValueSetter) {
					nativeInputValueSetter.call(input, input.files);
				}

				// Trigger lại các sự kiện input và change để React có thể nhận diện sự thay đổi
				var inputEvent = new Event('input', { bubbles: true });
				var changeEvent = new Event('change', { bubbles: true });

				input.dispatchEvent(inputEvent);
				input.dispatchEvent(changeEvent);
			}catch(e){}
		}

		// Giả lập xóa nội dung
		function simulateClearing(inputElement, delay = 50, callback) {
			let text = inputElement.val();
			let index = text.length;

			function deleteNext() {
				if (index > 0) {
					inputElement.val(text.slice(0, --index)); // Xóa ký tự cuối cùng
					inputElement.trigger($.Event("keydown", { key: "Backspace", keyCode: 8 }));
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
					inputElement.trigger($.Event(event, { key: char, keyCode: char.charCodeAt(0), bubbles: true }));
					inputElement.trigger($.Event(event, { key: char, keyCode: char.charCodeAt(0), bubbles: true }));
					index++;
					setTimeout(typeNext, delay);
				} else {
					// Giả lập xóa khoảng trắng cuối cùng
					inputElement.trigger($.Event(event, { key: "Backspace", keyCode: 8, bubbles: true }));
					inputElement.trigger(event);
					inputElement.select();

					if (window.getSelection) {
							window.getSelection().removeAllRanges();
					}else if (document.selection) {
							document.selection.empty();
					}

					if ("createEvent" in document) {
							var evt = document.createEvent("HTMLEvents");
							evt.initEvent(event, false, true);
							$(inputElement).get(0).dispatchEvent(evt);
					}
					else {
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
			el.dispatchEvent(new InputEvent(event, { bubbles: true }));

			// Gửi sự kiện change nếu cần (để framework bắt được)
			el.dispatchEvent(new Event('change', { bubbles: true }));

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
				var event = new Event('input', { bubbles: true });
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

				var event = new Event('input', { bubbles: true });
				var tracker = element._valueTracker;
				if (tracker) tracker.setValue(lastValue);
				element.dispatchEvent(event);
			}

			input.focus();
			setNativeValue(el, '');
		}

		// Hàm theo dõi phần tử
		function waitForElement(root, selector, callback, options = {}) {
			var {
				once = true,
				timeout = null,
				waitForLastChange = false,
				delay = 300
			} = options;

			var rootNode = (window.jQuery && root instanceof window.jQuery) ? root[0]
				: (Array.isArray(root) && root[0] instanceof Node) ? root[0]
				: root;

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

			observer.observe(rootNode, { childList: true, subtree: true });

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

				actualObserver = waitForElement(root, selector, customCallback, { ...options, once: true });

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


		// Tách giá
		function tachGia(price){
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
			while(parseInt(giaDau) < parseInt(giaDuoi) && giaDau.length <= giaDau.length){
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

			return {gia, giaDau, giaDuoi};
		}

		// Gộp giá
		function gopGia(beforePrice, afterPrice){
			afterPrice = afterPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
			beforePrice = beforePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

			var giaTruoc = beforePrice, giaSau = afterPrice;

			var len = beforePrice.split(",").length;
			var dong = 0, arrayTien = [], tienTruoc = 0, tienSau = 0;
			arrayTien = beforePrice.split(",");
			dong = arrayTien[arrayTien.length - 1];
			for(var i = 0; i < arrayTien.length - 1; i++){
				tienTruoc += arrayTien[i];
			}

			tienTruoc = parseInt(tienTruoc);
			if(parseInt(dong) > 0)
				tienTruoc += 1;

			arrayTien = afterPrice.split(",");
			dong = arrayTien[arrayTien.length - 1];
			for(i = 0; i < arrayTien.length - 1; i++){
				tienSau += arrayTien[i];
			}

			tienSau = parseInt(tienSau);
			if(parseInt(dong) > 0)
				tienSau += 1;

			afterPrice = tienSau + "000";
			beforePrice = tienTruoc + "000";

			var arrayBefore = beforePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',').split(",");
			var arrayAfter = afterPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',').split(",");

			var lastPrice = [], giaDau, giaDuoi;

			for(i = 0; i < arrayBefore.length - 1; i++){
				giaDau += arrayBefore[i];
			}

			for(i = 0; i < arrayAfter.length - 1; i++){
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
				if(lastPrice.length - giaDuoi.length + index == flagDau){
					lastPrice[flagDau - 1] = parseInt(lastPrice[flagDau - 1]) + 1;
				}
				lastPrice[lastPrice.length - giaDuoi.length + index] = giaDuoi[index];
			})

			lastPrice = lastPrice.join("");

			return {giaTruoc, giaSau, gia: lastPrice};
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
				$('html, body').animate({ scrollTop: currentHeight }, scrollAnimationDuration, 'swing', function() {
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

		/**
		 * Hiển thị một tooltip tùy chỉnh (div) với nội dung zoom khi hover vào hình ảnh.
		 * Hàm này lắng nghe sự kiện trên toàn bộ document và sử dụng document.elementsFromPoint()
		 * để phát hiện ảnh tại vị trí con trỏ, cho phép hoạt động linh hoạt trên các trang web động.
		 *
		 * @param {function($img): jQuery} getContentHtmlCallback Hàm callback trả về nội dung HTML của tooltip dưới dạng jQuery object.
		 * Hàm này nhận đối tượng jQuery của ảnh đang hover làm đối số.
		 * @param {object} [options={}] Tùy chọn cấu hình.
		 * @param {number} [options.offsetX=15] Khoảng cách ngang từ con trỏ đến tooltip.
		 * @param {number} [options.offsetY=15] Khoảng cách dọc từ con trỏ đến tooltip.
		 * @param {number} [options.maxWidth=300] Chiều rộng tối đa ban đầu của tooltip.
		 * @param {string} [options.widthUnit='px'] Đơn vị cho maxWidth (px, vw).
		 * @param {number} [options.maxHeight=200] Chiều cao tối đa ban đầu của tooltip.
		 * @param {string} [options.heightUnit='px'] Đơn vị cho maxHeight (px, vh).
		 * @param {string} [options.tooltipClass='custom-tooltip'] Class CSS thêm vào tooltip div.
		 * @param {string} [options.imageFilterSelector='img'] Selector để lọc các thẻ img cụ thể nếu muốn, mặc định là tất cả img.
		 */
		function zoomImg(getContentHtmlCallback, options = {}) {
			console.log("Hàm zoomImg đang được khởi tạo...");

			const defaultOptions = {
				offsetX: 15,
				offsetY: 15,
				maxWidth: 300,
				widthUnit: 'px',
				maxHeight: 200,
				heightUnit: 'px',
				tooltipClass: 'custom-tooltip',
				imageFilterSelector: 'img'
			};
			const opts = { ...defaultOptions, ...options };

			let currentTooltip = null;
			let hoverTimeout = null;
			const HOVER_DELAY = 100;
			let lastTargetImage = null;

			// Hàm tính toán vị trí tối ưu cho tooltip
			const calculateTooltipPosition = (e, tooltipElement, currentWidth, currentHeight, attemptScaling = false) => {
				const mouseX = e.clientX;
				const mouseY = e.clientY;
				const viewportWidth = window.innerWidth;
				const viewportHeight = window.innerHeight;

				let finalX = 0;
				let finalY = 0;
				let bestFitFound = false;
				
				// Khoảng cách tối thiểu từ con trỏ để tooltip không bị đè
				var cursorOffset = 10; 

				var eWidth  = $(e.target).outerWidth();
				var eHeight = $(e.target).outerHeight();

				cursorOffset = eWidth > eHeight ? eWidth : eHeight;

				// Các chiến lược thử vị trí theo thứ tự ưu tiên: Trái -> Dưới -> Phải -> Trên
				const priorityPositions = [
					// Trái: Căn giữa theo chiều dọc của con trỏ
					{ x: mouseX - currentWidth - cursorOffset, y: mouseY - currentHeight / 2 },
					// Dưới: Căn giữa theo chiều ngang của con trỏ
					{ x: mouseX - currentWidth / 2, y: mouseY + cursorOffset },
					// Phải: Căn giữa theo chiều dọc của con trỏ
					{ x: mouseX + cursorOffset, y: mouseY - currentHeight / 2 },
					// Trên: Căn giữa theo chiều ngang của con trỏ
					{ x: mouseX - currentWidth / 2, y: mouseY - currentHeight - cursorOffset }
				];

				for (const pos of priorityPositions) {
					let tempX = pos.x;
					let tempY = pos.y;

					// Đảm bảo tooltip không vượt quá biên trái/trên của viewport
					if (tempX < 0) tempX = 0;
					if (tempY < 0) tempY = 0;
					
					// Đảm bảo tooltip không vượt quá biên phải/dưới của viewport
					if (tempX + currentWidth > viewportWidth) tempX = viewportWidth - currentWidth;
					if (tempY + currentHeight > viewportHeight) tempY = viewportHeight - currentHeight;

					// Kiểm tra xem sau khi điều chỉnh, tooltip có nằm hoàn toàn trong viewport không
					const fitsInViewport = (
						tempX >= 0 && tempX + currentWidth <= viewportWidth &&
						tempY >= 0 && tempY + currentHeight <= viewportHeight
					);

					if (fitsInViewport) {
						// Kiểm tra xem vị trí này có đè lên con trỏ không
						const doesOverlapCursor = (
							mouseX >= tempX && mouseX <= tempX + currentWidth &&
							mouseY >= tempY && mouseY <= tempY + currentHeight
						);

						if (!doesOverlapCursor) {
							finalX = tempX;
							finalY = tempY;
							bestFitFound = true;
							break;
						}
					}
				}

				// Nếu không tìm được vị trí lý tưởng không đè lên con trỏ
				// và được phép thử scale lại
				if (!bestFitFound && attemptScaling) {
					console.log("Không đủ chỗ không đè lên chuột, đang cố gắng scale tooltip.");

					// Tính toán không gian khả dụng sau khi trừ đi lề
					let availableWidthPx = viewportWidth - 2 * cursorOffset; 
					let availableHeightPx = viewportHeight - 2 * cursorOffset;

					// Áp dụng lại max-width/max-height dựa trên không gian khả dụng và đơn vị ban đầu của người dùng
					// (Chuyển đổi vw/vh thành px nếu cần để tính toán)
					let desiredMaxWidthPx = (opts.widthUnit === 'vw' ? (opts.maxWidth / 100) * viewportWidth : opts.maxWidth);
					let desiredMaxHeightPx = (opts.heightUnit === 'vh' ? (opts.maxHeight / 100) * viewportHeight : opts.maxHeight);

					// Giới hạn kích thước theo không gian khả dụng
					let newMaxWidth = Math.min(desiredMaxWidthPx, availableWidthPx);
					let newMaxHeight = Math.min(desiredMaxHeightPx, availableHeightPx);

					tooltipElement.css({
						'max-width': `${newMaxWidth}px`, // Tạm thời dùng px để đảm bảo vừa
						'max-height': `${newMaxHeight}px`
					});

					// Lấy lại kích thước thực tế sau khi đã scale
					currentWidth = tooltipElement.outerWidth();
					currentHeight = tooltipElement.outerHeight();
					console.log(`Tooltip scaled to: ${currentWidth}px x ${currentHeight}px`);

					// Thử lại tìm vị trí với kích thước mới (chỉ một lần nữa sau khi scale)
					// Lặp lại logic tìm vị trí nhưng không thử scale lần nữa (avoid infinite loop)
					return calculateTooltipPosition(e, tooltipElement, currentWidth, currentHeight, false); 
				}

				return { x: finalX, y: finalY, found: bestFitFound };
			};


			// Hàm tạo và hiển thị tooltip
			const createAndShowTooltip = (e, $hoveredImage) => {
				if (lastTargetImage && lastTargetImage[0] === $hoveredImage[0]) {
					return;
				}

				if (currentTooltip) {
					currentTooltip.remove();
					currentTooltip = null;
				}
				
				lastTargetImage = $hoveredImage;
				console.log("Tạo và hiển thị tooltip cho:", lastTargetImage[0]);

				// 1. Tạo phần tử tooltip ban đầu với max-width/max-height được thiết lập
				currentTooltip = $('<div>')
					.addClass(opts.tooltipClass)
					.css({
						position: 'fixed',
						'z-index': 99999,
						'pointer-events': 'none',
						'background-color': 'rgba(0, 0, 0, 0.8)',
						color: 'white',
						padding: '8px',
						'border-radius': '4px',
						'box-shadow': '0 2px 10px rgba(0, 0, 0, 0.3)',
						'max-width': `${opts.maxWidth}${opts.widthUnit}`, // Áp dụng max-width/height ban đầu
						'max-height': `${opts.maxHeight}${opts.heightUnit}`,
						overflow: 'auto',
						display: 'block',
						'word-wrap': 'break-word',
						'box-sizing': 'border-box'
					})
					.append(getContentHtmlCallback($hoveredImage));

				$('body').append(currentTooltip);

				// 2. Đo kích thước tooltip sau khi được thêm vào DOM
				let tooltipWidth = currentTooltip.outerWidth();
				let tooltipHeight = currentTooltip.outerHeight();

				// 3. Tính toán vị trí ban đầu (không scale)
				let positionResult = calculateTooltipPosition(e, currentTooltip, tooltipWidth, tooltipHeight, true); // true = cho phép thử scale

				// 4. Nếu không tìm thấy vị trí tốt với kích thước ban đầu,
				// hàm calculateTooltipPosition đã tự động scale và tìm lại.
				// Chỉ cần áp dụng kết quả cuối cùng.
				currentTooltip.css({
					left: `${positionResult.x}px`,
					top: `${positionResult.y}px`
				});

				// 5. Nếu sau khi mọi nỗ lực mà tooltip vẫn bị tràn hoặc không tối ưu,
				// có thể điều chỉnh lại lần cuối để nó nằm gọn trong viewport
				// (Điều này thường không cần nếu logic trên hoạt động đúng)
				const viewportWidth = window.innerWidth;
				const viewportHeight = window.innerHeight;
				let finalX = parseFloat(currentTooltip.css('left'));
				let finalY = parseFloat(currentTooltip.css('top'));

				if (finalX + currentTooltip.outerWidth() > viewportWidth) {
					finalX = viewportWidth - currentTooltip.outerWidth();
				}
				if (finalY + currentTooltip.outerHeight() > viewportHeight) {
					finalY = viewportHeight - currentTooltip.outerHeight();
				}
				if (finalX < 0) finalX = 0;
				if (finalY < 0) finalY = 0;

				currentTooltip.css({
					left: `${finalX}px`,
					top: `${finalY}px`
				});
			};

			const hideAndRemoveTooltip = () => {
				if (hoverTimeout) {
					clearTimeout(hoverTimeout);
					hoverTimeout = null;
				}
				if (currentTooltip) {
					currentTooltip.remove();
					currentTooltip = null;
				}
				lastTargetImage = null;
			};

			$(document).on('mouseover', function(e) {
				if (hoverTimeout) {
					clearTimeout(hoverTimeout);
				}

				const elementsAtPoint = document.elementsFromPoint(e.clientX, e.clientY);
				let targetImage = null;

				for (const el of elementsAtPoint) {
					const $el = $(el); 
					if ($el.is('img') && $el.is(opts.imageFilterSelector)) {
						targetImage = $el;
						break;
					}
				}

				if (targetImage) {
					hoverTimeout = setTimeout(() => {
						createAndShowTooltip(e, targetImage);
					}, HOVER_DELAY);
				} else {
					hideAndRemoveTooltip();
				}
			});

			$(document).on('mouseout', hideAndRemoveTooltip);
			$(window).on('scroll mouseleave', hideAndRemoveTooltip);
		}

		// Broadcast tab
		var tpBroadcast = new BroadcastChannel("tp-broadcast-tab");
		// Kiểm tra nếu có tab cha đã mở tab này
		if(window.opener){
			boxAlert("CÓ TAB CHA");
			tpBroadcast.postMessage({
				type: "ready-to-listent"
			}, "*")
		}

		// Kiểm tra tự động mở các danh sách...
		function checkPage(){
			boxAlert("CHECKPAGE");

			// Phóng to hình ảnh khi hover
			zoomImg(
				($hoveredImage) => {
					// Đây là hàm callback để tạo nội dung cho tooltip.
					// $hoveredImage là đối tượng jQuery của thẻ <img> mà người dùng đang hover.

					const imageUrl = $hoveredImage.attr('src'); 
					// Thử tìm URL ảnh lớn hơn nếu có
					const fullSizeImageUrl = $hoveredImage.attr('data-full-size-url') 
										|| $hoveredImage.attr('data-src') 
										|| imageUrl;
					
					// Cố gắng tìm tên sản phẩm hoặc thông tin liên quan từ các phần tử cha hoặc anh chị em
					let productName = "Sản phẩm";
					// Các selector phổ biến cho container sản phẩm trên các sàn khác nhau
					const $productCard = $hoveredImage.closest('.theme-arco-table-tr, .product-card, .item-card, .sc-card-product'); 
					if ($productCard.length) {
						// Các selector phổ biến cho tên sản phẩm
						productName = $productCard.find('h1, h2, h3, .product-name, .item-title, .title, [data-name="product-title"]').first().text().trim() || productName;
					}

					return $(`
						<div style="text-align: center;">
							<!-- <h4 style="margin: 0 0 8px; color: white; font-size: 1.1em; max-height: 40px; overflow: hidden;">${productName}</h4> -->
							<img src="${fullSizeImageUrl}" style="width: 100%; height: auto; display: block; margin: auto; border: 1px solid #555; object-fit: contain;">
							<!-- <p style="font-size: 0.85em; margin-top: 8px; color: #ccc;">URL: <span style="font-size: 0.7em;">${imageUrl.substring(0, Math.min(imageUrl.length, 60))}...</span></p> -->
						</div>
					`);
				},
				{
					offsetX: 20,
					offsetY: 20,
					maxWidth: 30,
					widthUnit: "vw",
					maxHeight: "auto",
					heightUnit: "",
					tooltipClass: 'product-image-zoom-tooltip',
					// Thay đổi 'img' nếu bạn muốn chỉ nhắm mục tiêu các hình ảnh cụ thể
					// Ví dụ: 'img.product-thumbnail', '.some-container img', 'img[alt]', v.v.
					imageFilterSelector: 'img' 
				}
			);

			var domain = window.location;
			var host = domain.host, pathName = domain.pathname, port = domain.port, protocol = domain.protocol;

			console.log(domain);

			/*
			LABEL của optgroup:
			- Shopee
			- TikTok
			- Lazada
			- Sapo
			- Khác
			*/

			$("#tab-function optgroup").hide(); // Ẩn tất cả các optgroup
			$("#tab-function optgroup[label='Khác']").show(); // Hiển thị optgroup General

			// Kiểm tra trang Shopee
			if(host.includes("shopee.vn")){
				$("#tab-function optgroup[label='Shopee']").show(); // Hiển thị optgroup Shopee

				if(pathName.includes("portal/product/list")){
					waitForElement($("body"), ".product-variation-item.product-more-models", (el) => {
						$(".product-variation-item.product-more-models").click();
					})
				}

				if(pathName.includes("portal/product")){
					boxAlert("MO DANH SACH");
					waitForElement($("body"), ".variation-model-table-footer button.eds-button.eds-button--link.eds-button--normal", (el) => {
						console.log($(el));
						$(el).click();
						boxToast("Đã mở rộng danh sách phân loại");
					});
				}
			}else if(host.includes("tiktok.com")){ // Kiểm tra trang Tiktok
				$("#tab-function optgroup[label='TikTok']").show(); // Hiển thị optgroup TikTok

				if(pathName.includes("product/edit/")){
					// Giả lập kéo hình ảnh vào input Tiktok
					
					var proccessFileStatus = false;
					function setDragAndDropInputFile() {

						boxAlert("Đang gán lại input giả");
						
						$(".tp-inputfake").remove(); // Xóa các input giả trước đó
						var el1 = $("[class ^= 'uploadContainer']");
						var detailImg = $(el1).find("> div").eq(1).find("[class ^= 'uploadRender']");

						$.each(detailImg, (index, value) => {
							if(!detailImg.eq(index).find(".cursor-default .core-upload input[type='file']").length > 0){
								// boxAlert("Không tìm thấy input file TikTok");
								// console.log(detailImg.eq(index));
								return;
							}

							var inputFake = $("<input class='tp-inputfake' type='file' accept='image/*' multiple>");
							
							inputFake.css({
								position: "absolute",
								top: 0,
								left: 0,
								width: "100%",
								height: "100%",
								opacity: 0,
								cursor: "pointer"
							});

							detailImg.eq(index).prepend(inputFake);
							
							inputFake.on("change", (e) => {
								boxAlert("Đã chọn file thành công! Đang xử lý file...");

								e = e.target;

								if(!proccessFileStatus && e.files.length == 1){
									attachFileToInput(inputFake, $(e).parent().find(".cursor-default input[type='file']"));
									simulateReactInputFile($(e).parent().find(".cursor-default input[type='file']"));
								}else
									splitInputFile(inputFake, $(e));
							});
						});

						var el2 = $("#sale_properties .space-y-12 div").eq(0).find("> div").eq(2).find("> div").eq(0).find("> div[role='button']");
						 $.each(el2, (index, value) => {
							var variantImg = el2.eq(index).find(".cursor-default");

							if(variantImg.length != 1)
								return;

							var inputFake = $("<input class='tp-inputfake' type='file' accept='image/*' multiple>");
							
							inputFake.css({
								position: "absolute",
								top: 0,
								left: 0,
								width: "100%",
								height: "100%",
								opacity: 0,
								cursor: "pointer"
							});

							variantImg.prepend(inputFake);

							inputFake.on("change", (e) => {
								boxAlert("Đã chọn file thành công! Đang xử lý file...");
								e = e.target;
								attachFileToInput(inputFake, $(e).parent().find(".core-upload input[type='file']"), 100, async (v) => {
									await delay(500);

									setDragAndDropInputFile();
								});
								simulateReactInputFile($(e).parent().find(".core-upload input[type='file']"));
							});
						})
					}

					function splitInputFile(inputFake, inputTarget){
						const files = inputFake.get(0).files;
						listSKUImgTiktok = []; 
						inputMap = []; 

						if (files.length === 0) {
							boxLogging("Không có file ảnh nào được chọn.", [], ["yellow"]);
							boxToast("Chưa chọn ảnh!", "warning");
							return;
						}

						for (let i = 0; i < files.length; i++) {
							const file = files[i];
							const fileNameOnly = file.name.split(".")[0].trim().toUpperCase();

							listSKUImgTiktok.push(fileNameOnly); 

							const dt = new DataTransfer();
							dt.items.add(file);

							const newInput = $("<input type='file'>").prop("files", dt.files).addClass("single-file-input");
							inputMap.push(newInput);
						}
						boxLogging(`Đã nạp ${Object.keys(inputMap).length} ảnh vào bộ nhớ từ thư mục đã chọn.`, [], ["blue"]);
						boxToast(`Đã nạp ${Object.keys(inputMap).length} ảnh vào bộ nhớ!`, "success");

						proccessFile(inputMap, inputFake, inputTarget);
					}

					function proccessFile(inputMap, inputFake, inputTarget){
						proccessFileStatus = true;
						boxAlert("INPUT FAKER");
						console.log(inputFake);
						boxAlert("INPUT TARGET");
						console.log(inputTarget);

						var i = 0;
						
						async function nextImg(){
							if(i >= inputMap.length){
								proccessFileStatus = false;
								boxToast(`Đã tải xong ảnh sản phẩm`)
								return;
							}

							inputTarget = $(".tp-inputfake");

							inputTarget = inputTarget.parent().find(".cursor-default input[type='file']");

							console.log(inputTarget);

							attachFileToInput(inputMap[i], inputTarget);

							await delay(200);

							simulateReactInputFile(inputTarget);

							await delay(200);

							setDragAndDropInputFile();

							i++;

							await delay(200);

							nextImg();
						}

						nextImg();
					}

					boxAlert("Đang thay đổi input file TikTok");

					waitForElement($("body"), "[class ^= 'uploadContainer']", (el) => {
						setDragAndDropInputFile();
					}, {once: true});

					$(document).on("click", ".core-space .core-space-item", (e) => {
						boxAlert("NODENAME::" + $(e.target).prop("nodeName"));
						var svg = $(e.target).prop("nodeName") == "path" ? $(e.target).parent() : $(e.target);
						svg.parent().addClass("tp-clicked");

						var fatherBox = svg.parent().parent()
						
						console.log(fatherBox.attr("class") + " " + fatherBox.attr("class") == "core-space-item");

						if(fatherBox.attr("class") == "core-space-item")
							fatherBox = svg.parent().parent().parent();

						var len = fatherBox.find(".core-space-item").length;

						boxAlert("ABC");
						console.log(e);
						console.log(e.target);
						console.log(fatherBox)

						$.each(fatherBox.find(".core-space-item"), async (index, value) => {
							console.log($(value).hasClass("tp-clicked") && index == len - 1);
							if($(value).hasClass("tp-clicked") && index == len - 1){
								boxAlert("Đã xóa thành công!");
								setDragAndDropInputFile();
							}
						});
					});
				}
			}else if(host.includes("lazada.vn")){
				$("#tab-function optgroup[label='Lazada']").show(); // Hiển thị optgroup Lazada
			}else if(host.includes("sapo")){
				$("#tab-function optgroup[label='Sapo']").show(); // Hiển thị optgroup Sapo

				// Tự nhấn hiển thị thêm
				waitForElement($("body"), ".product-list-container .product-item-wrapper .show-more button", (el) => {
					simulateReactEvent($(el), "click");
				}, {once: true})
			}
		}

		var socket = null;

		async function getUrlServer(){
			var owner = 'pntan';
			var repo = 'TPTOOL';
			var path = 'urlNgrok'; // tên file chứa URL
			var branch = 'main';

			try {
				// Lấy file từ GitHub API
				var res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?_=${Date.now()}`, {
					headers: {
						Authorization: `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`,
					}
				});
				var json = await res.json();
				console.log(json);
				var content = atob(json.content); // Giải mã base64
				var url = content.trim();

				if (socket && socket.connect){
					boxToast(`Đã kết nối tới máy chủ rồi`, "info");
					return;
				}

				serverConnect(url);
			} catch (e) {
				console.error("Không thể lấy URL từ GitHub:", e.message);
				serverConnect(`https://127.0.0.1:2105`);
			}
		}

		// Kết nối tới máy chủ
		function serverConnect(url){
			boxAlert("KETNOIMAYCHU");
			console.log(url);
			socket = io(url, {
				transports: ["websocket"],        // ⛔️ tránh lỗi polling
				reconnection: true,               // Tự động thử lại
				reconnectionAttempts: 2,          // Tối đa 5 lần
				reconnectionDelay: 2000,          // Mỗi lần cách nhau 2s
				timeout: 5000                     // Timeout mỗi lần thử
			});

			socket.on("connect", () => {
				boxAlert("✅ Đã kết nối tới máy chủ");
				$("#server-status").text("ONLINE").removeAttr("class").addClass("online");
				boxToast(`✅ Máy chủ trực tuyến`);
				$(".tab-box[data-tab='tab-online-function'").removeClass("disabled");
			})

			socket.on("disconnect", () => {
				boxAlert(`⚠️ Mất kết nối với máy chủ`, "error");
				$("#server-status").text("OFFLINE").removeAttr("class");
				boxToast(`⚠️ Máy chủ ngoại tuyến`);
				$(".tab-box[data-tab='tab-online-function'").addClass("disabled");
			})

			socket.on("connect_error", (err) => {
				boxAlert(`🔁 Sự cố khi kết nối với máy chủ ${err.message}`, "error");
				$("#server-status").text("CONNECTING...").removeAttr("class").addClass("connect");
				boxToast(`🔁 Đang thử kết nối lại`);
				$(".tab-box[data-tab='tab-online-function'").addClass("disabled");
			})

			socket.on("reconnect_failed", () => {
				boxAlert("❌ Kết nối lại thất bại sau nhiều lần thử", "error");
				$("#server-status").text("OFFLINE").removeAttr("class");
				boxToast("❌ Không thể kết nối lại", "error");
				$(".tab-box[data-tab='tab-online-function'").addClass("disabled");
			})

			return socket;
		}

		const COMMON_CONTAINER_SELECTORS = [
			'#root',        // React, đôi khi Vue, cũng là Sapo theo bạn nói
			'#app',         // Vue, đôi khi React
			'#wrapper',     // Chung chung
			'#container',   // Chung chung
			'#main',        // Chung chung, HTML5
			'#___gatsby',   // Gatsby (React based)
			'#next',        // Next.js (React based)
			// Các class phổ biến khác (ít cụ thể hơn ID nhưng vẫn hữu ích):
			'.root',
			'.app',
			'.wrapper',
			'.container',
			'.main',
			'[data-v-app]', // Một số ứng dụng Vue có thể dùng thuộc tính này
		];

		function checkElementPage() {
			boxAlert("ĐANG KIỂM TRA PHẦN TỬ TRANG (Đang chờ SPA ổn định)");

			return new Promise((resolve) => {
				let foundContainer = null;
				let activeObserver = null; // Biến để giữ observer đang hoạt động của waitForElement
				let nextSelectorTimeoutId = null; // Biến để quản lý timeout chuyển selector

				const tryNextSelector = (index) => {
					// Nếu đã tìm thấy container và resolve, dừng tất cả các hoạt động đang chờ và thoát
					if (foundContainer) {
						return;
					}

					// Nếu đã thử hết các selector mà không tìm thấy
					if (index >= COMMON_CONTAINER_SELECTORS.length) {
						boxAlert("KHÔNG TÌM THẤY PHẦN TỬ CHÍNH CÓ NỘI DUNG. Mặc định thêm vào BODY.");
						resolve(document.body); // Fallback an toàn
						
						// Đảm bảo ngắt kết nối observer cuối cùng nếu có
						if (activeObserver) {
							activeObserver.disconnect();
							activeObserver = null;
						}
						if (nextSelectorTimeoutId) {
							clearTimeout(nextSelectorTimeoutId);
							nextSelectorTimeoutId = null;
						}
						return;
					}

					const selector = COMMON_CONTAINER_SELECTORS[index];
					boxAlert(`Đang thử tìm: ${selector}`);

					// Hủy bỏ observer cũ và timeout cũ trước khi bắt đầu cái mới
					if (activeObserver) {
						activeObserver.disconnect();
						activeObserver = null;
					}
					if (nextSelectorTimeoutId) {
						clearTimeout(nextSelectorTimeoutId);
						nextSelectorTimeoutId = null;
					}

					// Gọi waitForElement của bạn
					activeObserver = waitForElement(document.body, selector, (element) => {
						// Chỉ xử lý nếu chưa tìm thấy container và element hợp lệ
						// (callback của waitForElement có thể gọi với null nếu timeout)
						if (!foundContainer && element) { 
							// KIỂM TRA QUAN TRỌNG: Kiểm tra xem phần tử đã có nội dung hay chưa
							// children.length > 0: Có phần tử con
							// innerHTML.trim().length > 0: Có nội dung văn bản (không phải chỉ khoảng trắng)
							if (element.children.length > 0 || element.innerHTML.trim().length > 0) {
								foundContainer = element; // Gán phần tử đã tìm thấy
								boxAlert(`Đã tìm thấy phần tử chính và có nội dung: ${selector}`);
								
								// Đảm bảo ngắt kết nối observer hiện tại
								if (activeObserver) { 
									activeObserver.disconnect();
									activeObserver = null;
								}
								// Hủy timeout để chuyển selector tiếp theo
								if (nextSelectorTimeoutId) { 
									clearTimeout(nextSelectorTimeoutId);
									nextSelectorTimeoutId = null;
								}
								resolve(foundContainer); // Trả về phần tử đã tìm thấy
							} else {
								// boxAlert(`Tìm thấy ${selector} nhưng chưa có nội dung, tiếp tục chờ...`);
								// Không cần thông báo quá nhiều nếu chỉ là chờ đợi nội dung
							}
						} else if (!foundContainer && element === null) {
							// Nếu waitForElement báo timeout (callback(null)), chuyển sang selector tiếp theo
							boxAlert(`waitForElement timeout cho ${selector}. Thử selector kế tiếp.`);
							tryNextSelector(index + 1);
						}
					}, {
						once: false, // QUAN TRỌNG: Giữ observer hoạt động để chờ nội dung được load
						timeout: 7000 // Tăng timeout để cho phép SPA có thời gian render nội dung
					});

					// Nếu waitForElement trả về null ngay lập tức (ví dụ: rootNode không hợp lệ)
					if (!activeObserver) {
						boxAlert(`waitForElement không thể khởi tạo observer cho ${selector}. Thử selector tiếp theo.`);
						tryNextSelector(index + 1);
						return; // Thoát khỏi hàm này để tránh chạy tiếp logic dưới
					}

					// Set timeout để chuyển sang selector tiếp theo
					// Đây là một "fallback" nếu MutationObserver không hoạt động như mong đợi
					// hoặc nếu phần tử không bao giờ có đủ nội dung trong thời gian chờ
					nextSelectorTimeoutId = setTimeout(() => {
						if (!foundContainer) { // Nếu vẫn chưa tìm thấy container với nội dung sau timeout
							boxAlert(`Timeout (tự chuyển) cho ${selector}. Thử selector kế tiếp.`);
							tryNextSelector(index + 1); // Thử selector kế tiếp
						}
					}, 7500); // Lớn hơn timeout của waitForElement một chút
				};

				// Bắt đầu quá trình tìm kiếm từ selector đầu tiên
				tryNextSelector(0);
			});
		}

		function createLayout(mainContent){
			if(window.parent != window.top){
				boxAlert(`Đã bỏ qua một lần thêm giao diện`);
				return;
			}

			boxAlert(`Đang dựng giao diện`);

			mainContent = $(mainContent);

			// Giao diện HTML
			mainContent.append($(`
				<!-- GIAO DIỆN CHƯƠNG TRÌNH -->
				<div class="tp-popup">
					<div class="popup-overlay"></div>
					<div class="popup-box">
						<div class="content" style="white-space: pre-wrap; overflow-y: auto;"></div>
					</div>
				</div>

				<div id="toast-container"></div>

				<! -- <div class="tp-container tp-button-toggle">
					<div class="eye-toggle" id="myEyeToggle">
						<div class="pupil"></div>
						<div class="slash"></div>
						<div class="eyelid top"></div>
						<div class="eyelid bottom"></div>
					</div>
				</div> -->

				<div class="tp-container tp-button-toggle">
					<i class="fa-solid fa-fingerprint"></i>
				</div>

				<div id="custom-context-menu" style="display:none; position:absolute; z-index:9999;">
					<ul>
					<li class="menu-item" data-action="toggle-program">Ẩn/Hiện chương trình</li>
					<li class="menu-item" data-action="connect-server">Kết nối máy chủ</li>
					</ul>
				</div>

				<div class="tp-container tp-content">
					<div class="program-title">
						<p>Ver ${VERSION}</p>
						<p id="server-status">OFFLINE</p>
					</div>

					<div class="program-log">
						<pre class="logging"></pre>
					</div>
					<p id="clear-log-button" style="text-align: right; font-size: 0.8em; color: rgb(129, 186, 255)">Làm Sạch Log</p>

					<div class="program-tab">
						<div class="tab-title">
							<div class="tab-box" data-tab="tab-function">
								<p>Chức Năng</p>
							</div>
							<div class="tab-box" data-tab="tab-custom">
								<p>Tùy Chỉnh</p>
							</div>
							<div class="tab-box disabled" data-tab="tab-online-function">
								<p>Chức Năng Online</p>
							</div>
						</div>
					</div>

					<div id="tab-function" class="tab-content program-future active">
						<select id="functionSelect">
							<option hidden>Chọn Chức Năng</option>

							<!-- Shopee -->
							<optgroup label="Shopee">
								<option data-func="giaDuoiShopee" data-layout="giaDuoiShopeeLayout">Cập Nhật Giá Đuôi</option>
								<option data-func="flashSaleShopee" data-layout="flashSaleShopeeLayout">Flash Sale</option>
								<option data-func="kTr5LanGiaShopee" data-layout="kTr5LanGiaShopeeLayout">Kiểm Tra 5 Lần Giá</option>
								<option data-func="kiemTraMaPhanLoaiShopee">Hiển Thị Mã Phân Loại</option>
								<option data-func="suaGiaSKUShopee" data-layout="suaGiaSKUShopeeLayout">Sửa Giá Theo SKU</option>
								<option data-func="suaHinhSKUShopee" data-layout="suaHinhSKUShopeeLayout">Sửa Hình Theo SKU</option>
								<option data-func="themKyTuPhanLoaiShopee" data-layout="themKyTuPhanLoaiShopeeLayout">Sửa Tên Phân Loại</option>
								<option data-func="comboKMShopee" data-layout="comboKMShopeeLayout">Điều Chỉnh Combo Khuyến Mãi</option>
								<option data-func="cTrinhKMShopee" data-layout="cTrinhKMShopeeLayout">Điều Chỉnh Chương Trình Khuyến Mãi</option>
								<option data-func="kiemTraPhanLoaiShopee" data-layout="kiemTraPhanLoaiShopeeLayout">Kiểm Tra Phân Loại</option>
								<option data-func="themPhanLoaiNhieuLinkShopee" data-layout="themPhanLoaiNhieuLinkShopeeLayout">Thêm Phân Loại</option>
								<option data-func="layPhanLoaiShopee" data-layout="layPhanLoaiShopeeLayout">Lấy Phân Loại</option>
								<option data-func="layIDSanPhamShopee" data-layout="layIDSanPhamShopeeLayout">Lấy ID Sản Phẩm</option>
								<option data-func="layLinkChuaSKUShopee" data-layout="layLinkChuaSKUShopeeLayout">Lấy Link Chứa SKU</option>
								<option data-func="suaTonSKUNhieuLinkShopee" data-layout="suaTonSKUNhieuLinkShopeeLayout">Sửa Tồn Theo SKU Nhiều Link</option>
								<option disabled data-func="giaDuoiChuongTrinhShopee" data-layout="giaDuoiChuongTrinhShopeeLayout">Cập Nhật Giá Đăng Ký Chương Trình</option>
								<!-- <option disabled data-func="themPhanLoaiShopee" data-layout="themPhanLoaiShopeeLayout">Thêm Phân Loại</option> -->
								<!-- <option disabled data-func="keoPhanLoaiShopee" data-layout="keoPhanLoaiShopeeLayout">Kéo Phân Loại</option> -->
							</optgroup>

							<!-- TikTok -->
							<optgroup label="TikTok">
								<option data-func="giaDuoiTiktok">Cập Nhật Giá Đuôi</option>
								<option data-func="flashSaleTiktok">Flash Sale</option>
								<option data-func="saoChepFlashSaleTiktok" data-layout="saoChepFlashSaleTiktokLayout">Sao Chép Chương Trình Flash Sale</option>
								<option data-func="kiemTraMaPhanLoaiTiktok">Hiển Thị Mã Phân Loại</option>
								<option data-func="chinhSuaKhuyenMaiTiktok" data-layout="chinhSuaKhuyenMaiTiktokLayout">Chỉnh Sửa Chương Trình Khuyến Mãi</option>
								<option data-func="themPhanLoaiTiktok" data-layout="themPhanLoaiTikTokLayout">Thêm Phân Loại</option>
								<option data-func="xoaPhanLoaiTiktok" data-layout="xoaPhanLoaiTiktokLayout">Xóa Phân Loại</option>
								<option data-func="themHinhTheoSKUTiktok" data-layout="themHinhTheoSKUTiktokLayout">Sửa Hình Theo SKU</option>
								<option data-func="layIDSanPhamTiktok" data-layout="layIDSanPhamTiktokLayout">Lấy ID Sản Phẩm</option>
								<option data-func="suaGiaTheoSKUTiktok" data-layout="suaGiaTheoSKUTiktokLayout">Sửa Giá Theo SKU</option>
								<option disabled data-func="ktraKhuyenMaiTiktok" data-layout="ktraKhuyenMaiTiktokLayout">Kiểm Tra Văng Khuyến Mãi</option>
							</optgroup>

							<!-- Lazada -->
							<optgroup label="Lazada">
								<option data-func="giaDuoiLazada">Cập Nhật Giá Đuôi</option>
								<option data-func="khoiPhucSanPhamLazada">Khôi Phục Sản Phẩm Đã Xóa</option>
								<option data-func="themPhanLoaiLazada" data-layout="themPhanLoaiShopeeLayout">Thêm Phân Loại</option>
								<option data-func="themGiaTheoSKULazada" data-layout="themGiaTheoSKULazadaLayout">Sửa giá theo SKU</option>
								<option data-func="themHinhTheoSKULazada" data-layout="themHinhTheoSKULazadaLayout">Sửa Hình Theo SKU</option>
								<option data-func="layIDSanPhamLazada" data-layout="layIDSanPhamLazadaLayout"> Lấy ID Sản Phẩm</option>
								<option disabled data-func="ktraGiaChuongTrinhKMLazada" data-layout="ktraGiaChuongTrinhKMLazadaLayout">Kiểm Tra Giá Khuyến Mãi</option>
							</optgroup>

							<!-- Sapo -->
							<optgroup label="Sapo">
								<option data-func="hienThiThemDSSapo">Hiển Thị Thêm Danh Sách Sản Phẩm Sàn</option>
								<option data-func="lienKetSKUSapo" data-layout="lienKetSKUSapoLayout">Liên Kết SKU</option>
								<option disabled data-func="kiemTraTonSapo" data-layout="kiemTraTonSapoLayout">Kiểm Tra Tồn</option>
							</optgroup>

							<!-- Khác -->
							<optgroup label="Khác">
								<option data-func="splitExcelFile" data-layout="splitExcelFileLayout">Chia Nhỏ File Excel</option>
								<option data-func="mergeExcelFile" data-layout="mergeExcelFileLayout">Gộp File Excel</option>
								<option data-func="compareVoucher" data-layout="compareVoucherLayout">So Sánh Voucher</option>
								<option data-func="moLink" data-layout="moLinkLayout">Mở Link Hàng Loạt</option>
								<option data-func="tinhGiaBan" data-layout="tinhGiaBanLayout">Tính Giá Bán</option>
								<!-- <option disabled data-func="autobrowser" data-layout="autobrowserLayout">Trình Duyệt Tự Động</option> -->
							</optgroup>

						</select>

						<div class="layout-future functionSelect">
						</div>
					</div>

					<div id="tab-custom" class="tab-content">
						<select id="optionSelect">
							<option hidden>Chọn Chức Năng</option>
							<option data-layout="chung">Chung</option>
							<option data-layout="shopee">Shopee</option>
							<option data-layout="tiktok">Tiktok</option>
							<option data-layout="lazada">Lazada</option>
							<option data-layout="sapo">Sapo</option>
							<option data-layout="khac">Khác</option>
						</select>

						<div class="layout-future optionSelect">
						</div>
					</div>

					<div id="tab-online-function" class="tab-content">
						<select id="onlineSelect">
							<option hidden>Chọn Chức Năng</option>
							<option data-func="aiChat" data-layout="aiChatLayout">Veritas</option>
							<option data-func="editDescription" data-layout="editDescriptionLayout">Sửa Mô Tả</option>
						</select>

						<div class="layout-future onlineSelect">
						</div>
					</div>

					<div class="button-control">
						<button id="excuse-command" data-func="">Chạy</button
					</div>
					<div class="resize-handle top-left"></div>
					<div class="resize-handle top-right"></div>
					<div class="resize-handle bottom-left"></div>
					<div class="resize-handle bottom-right"></div>
				</div>
			`));

			mainContent.append($(`
				<style class="tp-style">
					.tp-popup {
						position: fixed;
						top: 0;
						left: 0;
						width: 100vw;
						height: 100vh;
						z-index: 9998; /* Giả sử UI chính có z-index: 9999 */
						display: none;
					}

					.tp-popup .popup-overlay {
						position: absolute;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						background: rgba(0, 0, 0, 0.4);
						backdrop-filter: blur(3px);
					}

					.tp-popup .popup-box {
						position: absolute;
						top: 10%;
						left: 50%;
						transform: translateX(-50%);
						width: 80%;
						max-width: 900px;
						max-height: 80%;
						background: white;
						box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
						border-radius: 8px;
						padding: 20px;
						overflow: hidden;
					}

					.tp-popup .popup-box .content {
						max-height: 100%;
						overflow-y: auto;
						font-family: monospace;
						font-size: 14px;
						padding: 1vh;
						overflow-y: auto;
						background: #fdfdfd;
						border-radius: 8px;
						box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
						line-height: 1.5;
						color: #222;
					}

					#toast-container {
						position: fixed;
						bottom: 20px;
						right: 20px;
						display: flex;
						flex-direction: column-reverse;
						gap: 10px;
						z-index: 9999;
					}

					.toast {
						width: auto;
						max-width: 20vw;
						border-radius: 6px;
						color: white;
						font-size: 14px;
						box-shadow: 0 2px 8px rgba(0,0,0,0.2);
						opacity: 0;
						transform: translateY(20px);
						transition: all 0.3s ease;
						position: relative;
						background: #333;
						padding: 10px 15px;
						animation: slideIn 0.3s ease forwards;
					}

					/* Show animation */
					.toast.show {
						opacity: 1;
						transform: translateY(0);
					}

					/* Type styles */
					.toast.success { background-color: #28a745; }   /* xanh lá */
					.toast.error   { background-color: #dc3545; }   /* đỏ */
					.toast.warning { background-color: #ffc107; color: #212529; } /* vàng */
					.toast.info    { background-color: #17a2b8; }   /* xanh biển */

					#custom-context-menu {
						display: none;
						position: absolute;
						z-index: 9999;
						min-width: 180px;
						background: rgba(255, 255, 255, 0.6);
						border-radius: 8px;
						box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
						font-family: "Segoe UI", sans-serif;
						animation: fadeIn 0.15s ease-in-out;
						overflow: hidden;
						border: 1px solid #ddd;
						border-radius: 10px;
					}

					#custom-context-menu ul {
						list-style: none;
						margin: 0;
						padding: 0;
					}

					#custom-context-menu .menu-item {
						display: flex;
						align-items: center;
						gap: 8px;
						padding: 10px 16px;
						cursor: pointer;
						font-size: 14px;
						color: #333;
						transition: background 0.2s;
					}

					#custom-context-menu .menu-item:hover {
						background-color: #f0f4f8;
						color: #fff;
					}

					#custom-context-menu .menu-item:active {
						background: rgba(255, 255, 255, 0.6);
					}

					@keyframes fadeIn {
						from { opacity: 0; transform: scale(0.98); }
						to { opacity: 1; transform: scale(1); }
					}

					/* Optional dark mode */
					@media (prefers-color-scheme: dark) {
						#custom-context-menu {
							background: rgba(0, 0, 0, 0.6);
							border: 1px solid #333;
						}
						#custom-context-menu .menu-item {
							color: #eee;
						}
						#custom-context-menu .menu-item:hover {
							background-color: #333;
						}
					}

					.tp-container{
						position: fixed;
						z-index: 9999999;
						user-select: none;
						max-height: 90vh;
						max-width: 70vw;
						overflow: hidden;
						display: flex;
						flex-direction: column;
						background: rgba(255, 255, 255, 0.8);
						border-radius: 10px;
						backdrop-filter: blur(10px);
						box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
						border: 1px solid rgba(255, 255, 255, 0.3);
						padding: 1vh 1vw;
					}

					.tp-container *::-webkit-scrollbar {
						display: none;
					}

					.tp-button-toggle{
						left: calc(100% - 7%);
						top: calc(100% - 20%);
						width: auto;
						height: 5vh;
						aspect-ratio: 16 / 9;
						// border-radius: 10px;
						background: rgba(255, 255, 255, 0.6);
						// box-shadow: -5px 5px 10px #000;
						padding: 0.5vw 0.5vw;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 1.5rem;
						font-weight: 700;
						// opacity: 0.6;
						display: flex;
						transition: color 0.5s;
					}

					.tp-button-toggle:hover{
						opacity: 1;
					}

					.tp-button-toggle.active{
						opacity: 1;
						background: lightgreen;
					}

					.tp-button-toggle svg{
						color: pink;
						width: 100%;
						height: 100%;
						font-size: 2em;
						transition: color 0.5s;
					}

					.tp-button-toggle.active svg{
						color: #fff;
					}

					// .eye-toggle {
					// 	position: relative;
					// 	width: 100%; /* Tăng kích thước để có không gian cho mí mắt */
					// 	height: 100%; /* Tăng chiều cao để mắt trông tự nhiên hơn */
					// 	cursor: pointer;
					// 	overflow: hidden; /* Quan trọng để ẩn phần mắt bị che bởi mí */
					// 	display: flex;
					// 	justify-content: center;
					// 	align-items: center;
					// 	border-radius: 100%; /* Giúp định hình mắt ban đầu */
					// 	box-shadow: 0 0 0 2px #333; /* Viền mắt */
					// 	background-color: #f0f0f0; /* Màu nền cho lòng trắng mắt, nếu cần */
					// 	transition: 0.5s;
					// }

					// /* Con ngươi */
					// .eye-toggle .pupil {
					// 	position: absolute;
					// 	width: auto; /* Kích thước tròng đen */
					// 	height: 80%;
					// 	aspect-ratio: 1 / 1;
					// 	background-color: #333;
					// 	border-radius: 50%;
					// 	transform: scale(1);
					// 	opacity: 1;
					// 	transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
					// 	z-index: 2; /* Đảm bảo con ngươi nằm trên mí mắt */
					// }

					// /* Đường gạch chéo khi ẩn */
					// .eye-toggle .slash {
					// 	position: absolute;
					// 	width: 90%; /* Chiều dài đường gạch chéo */
					// 	height: 3px;
					// 	background-color: #333;
					// 	transform: rotate(45deg) scaleX(0); /* Ban đầu ẩn */
					// 	transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
					// 	opacity: 0;
					// 	z-index: 3; /* Nằm trên cùng */
					// }

					// /* Các mí mắt trên và dưới */
					// .eye-toggle .eyelid {
					// 	position: absolute;
					// 	width: 100%;
					// 	height: 50%; /* Mỗi mí chiếm nửa chiều cao */
					// 	background-color: white; /* Màu nền của mí mắt, trùng với nền của khu vực chứa mắt */
					// 	transition: transform 0.3s ease-in-out, border-radius 0.3s ease-in-out;
					// 	z-index: 1; /* Nằm trên con ngươi nhưng dưới đường gạch chéo */
					// }

					// .eye-toggle .eyelid.top {
					// 	top: 0;
					// 	left: 0;
					// 	transform-origin: bottom center; /* Quay quanh cạnh dưới */
					// 	transform: translateY(-5px) rotateX(0deg); /* Đẩy lên 1 chút khi mở */
					// 	border-bottom-left-radius: 60% 30px; /* Điều chỉnh độ cong, giá trị thứ 2 là bán kính y */
					// 	border-bottom-right-radius: 60% 30px;
					// }

					// .eye-toggle .eyelid.bottom {
					// 	bottom: 0;
					// 	left: 0;
					// 	transform-origin: top center; /* Quay quanh cạnh trên */
					// 	transform: translateY(5px) rotateX(0deg); /* Đẩy xuống 1 chút khi mở */
					// 	border-top-left-radius: 60% 30px; /* Điều chỉnh độ cong */
					// 	border-top-right-radius: 60% 30px;
					// }

					// /* Trạng thái ẩn (mắt nhắm) */
					// .eye-toggle.hidden{
					// 	height: 0;
					// }

					// .eye-toggle.hidden .pupil {
					// 	transform: scale(0); /* Con ngươi ẩn dần */
					// 	opacity: 0;
					// }

					// .eye-toggle.hidden .slash {
					// 	transform: rotate(45deg) scaleX(1); /* Gạch chéo hiện ra */
					// 	opacity: 1;
					// }

					// .eye-toggle.hidden .eyelid.top {
					// 	transform: translateY(0px) rotateX(-90deg); /* Về vị trí giữa và xoay nhắm */
					// 	border-bottom-left-radius: 0; /* Thẳng ra khi nhắm */
					// 	border-bottom-right-radius: 0;
					// }

					// .eye-toggle.hidden .eyelid.bottom {
					// 	transform: translateY(0px) rotateX(90deg); /* Về vị trí giữa và xoay nhắm */
					// 	border-top-left-radius: 0; /* Thẳng ra khi nhắm */
					// 	border-top-right-radius: 0;
					// }

					.tp-content{
						// display: none;
						width: auto;
						height: auto;
						left: 0;
						top: 0;
						// transform: translate(-50%, -50%);
						background: 0 4px 20px rgba(255, 255, 255, 0.4), 0 4px 30px rgba(0, 0, 0, 0.2);
						color: #000;
						// box-shadow: -5px 5px 5px #fff;
						border-radius: 10px;
						padding: 1vh 1vw;
						backdrop-filter: blur(10px);
						-webkit-backdrop-filter: blur(10px);
						border: 1px solid rgba(255, 255, 255, 0.3);
						flex-grow: 1;
						overflow: hidden;
						// Ẩn hiện giao diện chính;
						display: flex;
						flex-direction: column;
						//opacity: 1;
						//transition: opacity 0.3s ease;
					}

					.tp-content:hover{
						opacity: 1;
					}

					.tp-content > div{
						margin: 1vh 0;
					}

					.tp-content .copyable, .tp-popup .copyable{
						user-select: text;
						text-decoration: underline;
						cursor: pointer;
					}

					.tp-content .program-title{
						width: 100%;
						text-align: center;
						font-weight: 700;
						margin-bottom: 1vh;
					}

					// .tp-content .program-title p:nth-child(1){
					// 	font-size: 1.6em;
					// 	font-weight: bold;

					// 	color: #555;
					// }

					// .tp-content .program-title p:nth-child(2){
					// 	font-size: 0.9em;
					// }

					.tp-content .program-title p:nth-child(1){
						font-size: 1em;
					}
					.tp-content .program-title p:nth-child(2){
						font-size: 1.1em;
						color: #000;
					}

					.tp-content .program-title p:nth-child(2).online{
						color: lightgreen;
					}

					.tp-content .program-title p:nth-child(2).connect{
						color: #f7ad00;
					}

					.tp-content .program-log{
						width: 100%;
						height: auto;
						max-height: 20vh;
						overflow-y: auto;
						background: #fff;
						border-radius: 8px;
						padding: 1vh 1vw;
						margin-bottom: 1vh;
						box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
					}

					.tp-content .program-log pre{
						white-space: pre-wrap;
						word-wrap: break-word;
						font-family: monospace;
						font-size: 13px;
					}

					.tab-title {
						display: flex;
						flex-wrap: wrap;
						gap: 1vw;
						justify-content: center;
						margin: 1vh 0;
					}

					.tab-box {
						cursor: pointer;
						padding: 0.5vh 1vw;
						background: rgba(255,255,255,0.6);
						border-radius: 5px;
						box-shadow: 0 0 5px #00000030;
						font-weight: 600;
						transition: 0.2s;
						user-select: none;
						transition: all 0.3s ease;
					}

					.tab-box.disabled{
						cursor: not-allowed;
						background: whitesmoke;
					}

					.tab-box.active {
						background: #fff;
						box-shadow: 0 0 10px #00000040;
					}

					.tab-content {
						display: none;
						flex-grow: 1;
						overflow-y: auto;
						padding: 1vh;
					}

					.tab-content.active {
						display: block;
					}

					.tp-content .program-future{
						width: 100%;
						height: auto;
					}

					.tp-content .tab-content select{
						width: 100%;
						height: 4vh;
						line-height: 4vh;
						text-indent: 10px;
						border-radius: 10px;
						border: 1px solid #aaa;
						font-size: 14px;
						margin-bottom: 1vh;
						background: #f9f9f9;
					}

					.tp-content .tab-content select optgroup{
						text-indent: 5%;
					}

					.tp-content .layout-future{
						width: 100%;
						height: auto;
						flex-grow: 1;
						overflow-y: auto;
						padding-bottom: 1vh;
					}

					.tp-content .layout-future * {
						margin-bottom: 10px;
					}

					.switch-wrapper {
						display: flex;
						align-items: center;
						gap: 10px;
						font-family: sans-serif;
					}

					/* Label: "Thêm" / "Xóa" */
					.switch-label {
						font-size: 14px;
						font-weight: bold;
						color: #444;
						width: 50px; /* Chiều rộng cố định cho label */
						text-align: center;
					}

					/* Container chính của switch */
					.switch {
						position: relative;
						/* Dùng kích thước bạn đã đặt trong JS */
						width: 60px;
						height: 28px;
						/* Có thể thêm cursor: pointer; ở đây hoặc ở .slider */
						cursor: pointer; /* Thêm cursor pointer cho toàn bộ vùng switch */
					}

					/* Ẩn input */
					.switch input {
						opacity: 0;
						width: 0;
						height: 0;
						position: absolute; /* Đảm bảo nó không chiếm không gian */
					}

					/* Track của switch (thanh nền) */
					.slider {
						position: relative; /* Giữ relative để handle định vị absolute bên trong */
						background-color: #ccc;
						border-radius: 34px; /* Làm tròn theo chiều cao (28px) -> radius 14px, 34px là tròn hoàn toàn nếu width = 34*2 */
						width: 100%; /* Chiếm toàn bộ chiều rộng của .switch */
						height: 100%; /* Chiếm toàn bộ chiều cao của .switch */
						transition: background-color 0.3s ease-in-out; /* Thêm ease-in-out cho mượt hơn */
						box-sizing: border-box; /* Đảm bảo padding/border không làm tăng kích thước */
						/* Nếu bạn muốn viền như hình ảnh lỗi, hãy thêm border ở đây. */
						/* border: 1px solid #007bff; */ /* Ví dụ, nếu bạn muốn viền xanh dương cố định */
					}

					/* Nút tròn gạt (handle) */
					.slider-handle {
						position: absolute;
						height: 22px; /* Kích thước nút kéo */
						width: 22px; /* Kích thước nút kéo */
						left: 3px; /* Vị trí ban đầu từ bên trái của slider */
						top: 3px; /* Vị trí ban đầu từ trên xuống của slider */
						background-color: white;
						border-radius: 50%;
						transition: left 0.3s ease-in-out; /* Thay đổi transition thành left thay vì transform */
						box-shadow: 0 1px 3px rgba(0,0,0,0.2);
					}

					/* Trạng thái BẬT của switch */
					/* Khi input được checked, thay đổi background của slider */
					.switch input:checked + .slider {
						background-color: #007bff; /* Màu xanh khi bật */
					}

					/* Di chuyển nút tròn gạt khi switch BẬT */
					/* Khi input được checked, tìm .slider-handle bên trong .slider */
					.switch input:checked + .slider .slider-handle {
						/* Tính toán vị trí mới:
						Tổng chiều rộng của slider (60px)
						Trừ đi chiều rộng của handle (22px)
						Trừ đi khoảng cách left ban đầu (3px)
						= 60 - 22 - 3 = 35px
						*/
						left: 35px;
						/* Hoặc dùng calc() để linh hoạt hơn:
						left: calc(100% - 22px - 3px);
						*/
					}

					/* Tùy chỉnh làm tròn cho slider nếu bạn thêm class .round vào HTML */
					.slider.round {
						border-radius: 14px; /* Để khớp với height 28px, radius 14px sẽ là hình elip tròn */
					}

					.tp-content .layout-future input,
					.tp-content .layout-future textarea {
						width: 100%;
						padding: 10px;
						border: 1px solid #aaa;
						border-radius: 8px;
						font-size: 14px;
						background: rgba(255, 255, 255, 0.7);
						color: #000;
						resize: both;
					}

					.tp-content .layout-future textarea {
						min-height: 10vh;
					}

					.tp-content .layout-future label {
						font-weight: 500;
						display: flex;
						justify-content: center;
						margin-bottom: 5px;
						color: #222;
					}

					.tp-content .layout-future button {
						background: rgba(0, 123, 255, 0.7);
						color: white;
						padding: 10px 16px;
						border: none;
						border-radius: 8px;
						font-size: 14px;
						cursor: pointer;
					}

					.tp-content .layout-future button:hover {
						background: rgba(0, 86, 179, 0.5);
					}

					.tp-content .layout-future table tr{
						margin-top: 1vh;
					}

					.tp-content .layout-future table tr td{
						padding: 1vh 1vw;
						text-align: center;
					}

					.tp-content .button-control{
						width: 100%;
						margin-top: auto;
					}

					.tp-content .button-control button{
						width: 100%;
						background: crimson;
						color: #fff;
						font-weight: 700;
						width: 100%;
						padding: 12px;
						background: #dc3545;
						color: white;
						font-weight: bold;
						font-size: 15px;
						border: none;
						border-radius: 8px;
						transition: all 0.3s ease;
					}

					.tp-content .button-control button:hover {
						background: #bd2130;
					}

					.resize-handle {
						position: absolute;
						width: 16px;
						height: 16px;
						right: 0;
						bottom: 0;
						background: #ccc;
						cursor: se-resize;
						border-bottom-right-radius: 16px;
					}

					.resize-handle {
						position: absolute;
						background: #ccc;
						cursor: pointer;
						opacity: 0
					}

					/* Các góc resize */
					.top-left {
						width: 16px;
						height: 16px;
						left: 0;
						top: 0;
						cursor: nw-resize;
					}

					.top-right {
						width: 16px;
						height: 16px;
						right: 0;
						top: 0;
						cursor: ne-resize;
					}

					.bottom-left {
						width: 16px;
						height: 16px;
						left: 0;
						bottom: 0;
						cursor: sw-resize;
					}

					.bottom-right {
						width: 16px;
						height: 16px;
						right: 0;
						bottom: 0;
						cursor: se-resize;
					}
				</style>
			`))

			// Context menu
			// $(document).on("contextmenu", (e) => {
			// 	var ignoreTags = ["img", "a", "input", "textarea", "button", "select"];
			// 	var isIgnored = ignoreTags.includes(e.target.tagName.toLowerCase());

			// 	// Nếu không giữ Ctrl hoặc đang nhấn vào thẻ đặc biệt thì cho context mặc định
			// 	if (!e.ctrlKey || isIgnored) return true;

			// 	e.preventDefault();

			// 	var offset = 10;

			// 	$("#custom-context-menu")
			// 	.css({
			// 		top: e.pageY + offset + "px",
			// 		left: e.pageX + offset + "px"
			// 	})
			// 	.fadeIn(100);
			// });

			$(document).on("click", () => {
				$("#custom-context-menu").fadeOut(100);
			});

			$("#custom-context-menu .menu-item").on("click", function (e) {
				var action = $(this).data("action");

				if (action == "toggle-program"){
					if($($(".tp-container.tp-content")).hasClass("active")){
						$(".tp-container.tp-content").css("display", "none");
						$($(".tp-container.tp-content")).removeClass("active");
						boxAlert("Ẩn Giao Diện");
					}else{
						$(".tp-container.tp-content").css("display", "block");
						$($(".tp-container.tp-content")).addClass("active");
						boxAlert("Hiện Giao Diện");
						var content = $(".tp-container.tp-content");

						var width = content.width();
						var height = content.height();

						$(".tp-container.tp-content").css({
							top: (e.pageY - (width / 2)),
							left: (e.pageX - (height / 2))
						})
					}
				}else if(action == "connect-server"){
					if (socket && socket.connected) {
						boxToast("🟢 Đã kết nối với máy chủ", "info");
						return;
					}

					// Gọi kết nối mới
					socket = getUrlServer();
				}
				$("#custom-context-menu").fadeOut(100);
			});

			$(".tp-popup .popup-overlay").on("click", function () {
				$(".tp-popup").hide();
			});

			// Chọn tab
			$('.tab-box').click(function () {
				if($(this).is(".disabled"))
					return;
				var tabToShow = $(this).data('tab');

				if(tabToShow.includes("tab-online-function")){
					$(".button-control").css("display", "none");
				}else{
					$(".button-control").css("display", "block");
				}

				// Bỏ active các tab khác
				$('.tab-box').removeClass('active');
				$(this).addClass('active');

				// Ẩn tất cả nội dung
				$('.tab-content').hide();

				// Hiện tab được chọn
				$('#' + tabToShow).show();
			});

			// Kéo vị trí của giao diện chính
			$(".tp-container").draggable({
				start: function (event, ui) {
					// Nếu đang resize thì không cho drag
					if (isResizing) return false;
					// var width = $(this).outerWidth();
					// var height = $(this).outerHeight();
					// $(this).draggable('option', 'cursorAt', { left: Math.floor(width / 2), top: Math.floor(height / 2) });
				},

				drag: function() {
					var offset = $(this).offset();
					var xPos = offset.left;
					var yPos = offset.top;
					//localStorage.setItem("positionYTP",yPos);
					//localStorage.setItem("positionXTP",xPos);
					//boxAlert(`Tọa độ hiện tại X: ${xPos} - Y: ${yPos}`);
					//boxLogging(`Tọa độ hiện tại X: ${xPos} - Y: ${yPos}`, [`${xPos}`, `${yPos}`], ["orange", "yellow"]);
				},
			});

			// Thay đổi kích thước (4 góc)
			let isResizing = false, containers, startX, startY, startWidth, startHeight;

			function resize(e, direction) {
				e.preventDefault();
				container = $(e.target).closest('.tp-container.tp-content');

				// Kiểm tra container có tồn tại không
				if (!container || container.length === 0) {
						console.error("Container không tồn tại!");
						return; // Nếu không tồn tại, thoát khỏi hàm
				}

				isResizing = true;
				startX = e.clientX;
				startY = e.clientY;
				startWidth = container.width();
				startHeight = container.height();

				$(document).on('mousemove.resizeBox', function (e) {
					if (!isResizing) return;
					let newWidth = startWidth;
					let newHeight = startHeight;
					let newTop = parseInt(container.css('top'));
					let newLeft = parseInt(container.css('left'));

					if (direction === 'top-left') {
						newWidth = startWidth - (e.clientX - startX);
						newHeight = startHeight - (e.clientY - startY);
						newTop = startY + (e.clientY - startY);
						newLeft = startX + (e.clientX - startX);
					} else if (direction === 'top-right') {
						newWidth = startWidth + (e.clientX - startX);
						newHeight = startHeight - (e.clientY - startY);
						newTop = startY + (e.clientY - startY);
					} else if (direction === 'bottom-left') {
						newWidth = startWidth - (e.clientX - startX);
						newHeight = startHeight + (e.clientY - startY);
						newLeft = startX + (e.clientX - startX);
					} else if (direction === 'bottom-right') {
						newWidth = startWidth + (e.clientX - startX);
						newHeight = startHeight + (e.clientY - startY);
					}

					// Kiểm tra nếu container là hợp lệ
					if (container) {
						container.css({
							width: newWidth + 'px',
							height: newHeight + 'px',
							top: newTop + 'px',
							left: newLeft + 'px'
						});
					}
				});

				$(document).on('mouseup.resizeBox', function () {
					isResizing = false;
					$(document).off('.resizeBox');
				});
			}

			// Gắn sự kiện cho các góc resize
			$('.top-left').on('mousedown', function (e) {
				resize(e, 'top-left');
			});
			$('.top-right').on('mousedown', function (e) {
				resize(e, 'top-right');
			});
			$('.bottom-left').on('mousedown', function (e) {
				resize(e, 'bottom-left');
			});
			$('.bottom-right').on('mousedown', function (e) {
				resize(e, 'bottom-right');
			});

			// Ẩn hiện giao diện
			$(".tp-container.tp-button-toggle").on("click", function(){
				if($(this).hasClass("active")){
					$(".tp-container.tp-content").css("display", "none");
					$(this).removeClass("active");
					boxAlert("Ẩn Giao Diện");
					// $(this).find("svg").remove().append($(`<i class="fa-solid fa-eye"></i>`));
				}else{
					$(".tp-container.tp-content").css("display", "block");
					$(this).addClass("active");
					boxAlert("Hiện Giao Diện");
					// $(this).find("svg").remove().append($(`<i class="fa-solid fa-eye-slash"></i>`));
				}				
			});

			// const eyeToggle = $('.tp-container.tp-button-toggle');
			// if (eyeToggle.length) {
			// 	eyeToggle.on('click', function() {
			// 		$("#myEyeToggle").toggleClass('hidden');
					
			// 		if ($("#myEyeToggle").hasClass('hidden')) {
			// 			console.log('Mắt đang ẩn');
			// 		} else {
			// 			console.log('Mắt đang hiện');
			// 		}
			// 	});
			// }

			// Xóa log
			$("#clear-log-button").on("click", function(){
				$(".program-log pre.logging").empty();
				boxToast("Đã xóa log", "success");
			});

			// Chọn chức năng cho sàn
			$("select#functionSelect").on("change", function(){
				var option = $(this).find("option:selected");
				$("#excuse-command").show();
				$("#excuse-command").text("Chạy");
				$("#excuse-command").attr("data-func", option.attr("data-func"));
				$(".layout-tab").remove();
				boxLogging(`Đã chọn ${option.parent().attr("label")} > ${option.text()}`, [`${option.parent().attr("label")}`, `${option.text()}`], ["crimson", "crimson"]);
				createLayoutTab(option.attr("data-layout"));
				applyNonce();
			});

			$("#excuse-command").on("click", function() {
				var func = $(this).attr("data-func");
				if (actionMap[func]) actionMap[func]();
			});

			$.each($("iframe"), (index, value) => {
				$("iframe").eq(index).remove();
			});

			$("select#optionSelect").on("change", function(){
				var option = $(this).find("option:selected");
				$(".layout-tab").remove();

				createLayoutOption(option.data("layout"));
			})

			// Chọn chức năng online
			$("select#onlineSelect").on("change", function(){
				var option = $(this).find("option:selected");
				$(".layout-tab").remove();

				createLayoutOnline(option.data("layout"));

				if(actionOnlineMap[option.data("func")])
					actionOnlineMap[option.data("func")]();
			})
		}

		function createLayoutOption(layoutName){
			layoutName = layoutName == undefined ? "Không có giao diện" : layoutName;

			$("#excuse-command").hide();

			var content = $(".layout-future.optionSelect");

			switch(layoutName){
				case "shopee":
					content.append($(`
						<div class="layout-option">
							<div class="box">
								<button class="excuse-command" data-func="scaleMainContent" id="scale-main-content">Mở Rộng Không Gian Làm Việc</button>
							</div>
						</div>						
					`))
					break;
			}

			$(".layout-future.optionSelect button.excuse-command").on("click", function(e){
				actionOptionMap[$(this).data("func")]();
			})
		}

		// Dựng giao diện cho lựa chọn chức năng online
		function createLayoutOnline(layoutName){
			layoutName = layoutName == undefined ? "Không có giao diện" : layoutName;

			var content = $(".layout-future.onlineSelect");
			switch(layoutName){
				case "editDescriptionLayout":
					content.append($(`
						<div class="layout-tab">
							<textarea placeholder="Nội dung mô tả hiện tại"></textarea>
						</div>
					`))
				break;
				case "aiChatLayout":
					content.append($(`
					<div class="layout-tab">
						<input type="file" webkitdirectory directory multiple />
						<p>Tải lên thư mục có chứa hình ảnh, không cần tải lên từng hình</p>
						<p style="font-weight:700; color: crimson">*Tên hình ảnh phải là SKU của sản phẩm</p>

						<!--<label for="search-name">
								<p>Đổi Theo Tên</p>
								<input id="search-name" type="radio" name="searchType" />
						</label>

						<label for="search-sku">
								<p>Đổi Theo SKU</p>
								<input id="search-sku" type="radio" name="searchType" />
						</label> -->
					</div>
					`))

					$(".layout-tab").css({
						"width": "100%",
						"height": "auto",
						"display": "flex",
						"flex-direction": "column",
					})

					$(".layout-tab .message-content").css({
						"width": "100%",
						"height": "auto",
						"overflow-y": "auto", /* Thêm thanh cuộn khi nội dung dài */
						"padding": "10px",
					})

					$(".layout-tab .message-content .ai-message").css({
						"background-color": "#f0f0f0",
						"color": "#333",
						"border-radius": "5px",
						"padding": "10px",
						"margin-bottom": "10px",
						"width": "fit-content",
						"max-width": "80%",
						"float": "left",
						"clear": "both",
					})

					$(".layout-tab .message-content .ai-message.error").css({
						"font-weight": "700",
						"background-color": "#ffe0e0",
						"color": "#ff0000",
					})

					$(".layout-tab .message-content .user-message").css({
						"background-color": "#e0f7fa",
						"color": "#00796b",
						"border-radius": "5px",
						"padding": "10px",
						"margin-bottom": "10px",
						"width": "fit-content",
						"max-width": "80%",
						"float": "right",
						"clear": "both",
					})

					$(".layout-tab .message-content .clear-message").css({
						"clear": "both",
					})

					$(".layout-tab .typing-content").css({
						"width": "100%",
						"height": "auto", /* Điều chỉnh chiều cao tự động */
						"padding": "10px",
						"display": "flex",
					})

					$(".layout-tab .typing-content input").css({
						"flex-grow": "1", /* Cho phép input chiếm phần lớn chiều rộng */
						"height": "40px",
						"padding": "10px",
						"border": "1px solid #ccc",
						"border-radius": "5px",
						"font-size": "16px",
					})
				break;
			}
		}

		// Dựng giao diện của mỗi lựa chọn
		function createLayoutTab(layoutName){
		layoutName = layoutName == undefined ? "Không có giao diện" : layoutName;
		boxLogging(`Giao Diện: ${layoutName}`, [`${layoutName}`], ["crimson"]);
		var content = $(".layout-future.functionSelect");
		$(".layout-tab").remove();
		switch(layoutName){
			case "suaGiaTheoSKUTiktokLayout":
				content.append($(`
				<div class="layout-tab">
					<p>Cách sửa giá:</p>
					<select id="type">
						<option data-type="all">Tất cả</option>
						<option data-type="duoi">Giá đuôi</option>
						<option data-type="dau">Giá đầu</option>
					</select>
					<textarea id="data" placeholder="Mỗi SKU là một dòng, và các thuộc tính dưới đây sẽ cách nhau 1 tab\n-SKU: Bắt buộc (ABC123-DEF456 hoặc ABC123)\n-Giá: Bắt buộc"></textarea>
				</div>
				`));
				break;
			case "giaDuoiShopeeLayout":
				content.append($(`
					<div class="layout-tab">
						<p>Giá cao nhất: <span class="max-price">0</span></p>
						<p>Giá thấp nhất: <span class="min-price">0</span></p>
						<p>Giá đề xuất: <span class="avg-price">0</span></p>
					</div>
				`))
				break;
			case "xoaPhanLoaiTiktokLayout":
				content.append($(`
					<div class="layout-tab">
						<textarea id="data" placeholder="Nhập SKU cần xóa, mỗi SKU là một dòng"></textarea>
					</div>
				`))
				setEventXoaPhanLoaiTiktok();
				break;
			case "themHinhTheoSKULazadaLayout":
				content.append($(`
					<div class="layout-tab">
						<input type="file" webkitdirectory directory multiple />
						<p>Tải lên thư mục có chứa hình ảnh, không cần tải lên từng hình</p>
						<p style="font-weight:700; color: crimson">*Tên hình ảnh phải là SKU của sản phẩm</p>
					</div>
				`))
				setEventThemHinhTheoSKuLazada();
				break;
			case "moLinkLayout":
				content.append($(`
					<div class="layout-tab">
						<textarea id="data" placeholder="Nhập đường dẫn, mỗi đường dẫn trên một dòng"></textarea>
					</div>
				`))
				setEventMoLink();
				break;
			case "layIDSanPhamLazadaLayout":
				content.append($(`
						<div class="layout-tab">
							<label for="copy-type">Lấy đường dẫn sản phẩm</label>
							<input type="checkbox" id="copy-type" />
							<p style="font-weight:700; color: crimson">*Mặc định chỉ lấy ID sản phẩm</p>
						</div>
				`));
				break;
			case "layIDSanPhamTiktokLayout":
				content.append($(`
						<div class="layout-tab">
							<label for="copy-type">Lấy đường dẫn sản phẩm</label>
							<input type="checkbox" id="copy-type" />
							<p style="font-weight:700; color: crimson">*Mặc định chỉ lấy ID sản phẩm</p>
						</div>
				`));
				break;
			case "layIDSanPhamShopeeLayout":
				content.append($(`
						<div class="layout-tab">
							<label for="copy-type">Lấy đường dẫn sản phẩm</label>
							<input type="checkbox" id="copy-type" />
							<p style="font-weight:700; color: crimson">*Mặc định chỉ lấy ID sản phẩm</p>
						</div>
				`));
				break;
			case "themHinhTheoSKUTiktokLayout":
				content.append($(`
					<div class="layout-tab">
						<input type="file" webkitdirectory directory multiple />
						<p>Tải lên thư mục có chứa hình ảnh, không cần tải lên từng hình</p>
						<p style="font-weight:700; color: crimson">*Tên hình ảnh phải là SKU của sản phẩm</p>

						<!--<label for="search-name">
								<p>Đổi Theo Tên</p>
								<input id="search-name" type="radio" name="searchType" />
						</label>

						<label for="search-sku">
								<p>Đổi Theo SKU</p>
								<input id="search-sku" type="radio" name="searchType" />
						</label> -->
					</div>
				`));
				setEventThemHinhTheoSKUTiktok();
				break;
			case "lienKetSKUSapoLayout":
				content.append($(`
					<div class="layout-tab">
						<p>Cách liên kết SKU</p>
						<div class="switch-wrapper">
							<span class="switch-label">Tự Động</span>
							<label class="switch">
								<input type="checkbox" id="toggle-switch" checked />
								<div class="slider">
									<div class="slider-handle"></div>
								</div>
							</label>
							<span class="switch-label">Thủ Công</span>
						</div>
					</div>
				`))

				content.append($(`
					<style>
						.box{
							display: flex;
							align-items: center;
							gap: 10px;
							margin-bottom: 10px;
							width: 100%;
							justify-content: space-between;
						}

						.box label{
							width: 100%;
							text-align: left;
						}
					</style>
				`));
				setEventLienKetSKUSapo();
				break;
			case "layLinkChuaSKUShopeeLayout":
				$("#excuse-command").hide();
				content.append($(`
					<div class="layout-tab">
						<textarea id="data" placeholder="Mỗi SKU là một dòng, và các thuộc tính dưới đây sẽ cách nhau 1 tab\n-SKU: Bắt buộc (có thể ở dạng rút gọn hoặc đầy đủ (ABC123 hoặc ABC123-DEF456))"></textarea>
						<textarea id="result" placeholder="Kết quả" style="user-select: none; cursor: pointer"></textarea>
						<div class="btn-control" style="display: flex; align-items: center; justify-content: space-around">
							<button id="prev">SKU Trước</button>
							<button id="search">Tìm</button>
							<button id="get">Lấy Link</button>
							<button id="next">SKU Kế</button>
						</div>
					</div>
				`))
				setEventLayLinkChuaSKUShopee();
				break;
			case "suaTonSKUNhieuLinkShopeeLayout":
				content.append($(`
					<div class="layout-tab">
						<p>ID sản phẩm</p>
						<textarea id="idlink" placeholder="Mỗi ID sản phẩm là một dòng">24293276501</textarea>
						<p>Thông tin</p>
						<textarea id="data" placeholder="Mỗi SKU là một dòng, và các thuộc tính dưới đây sẽ cách nhau 1 tab\n-SKU: bắt buộc (có thể ở dạng rút gọn và đầy đủ (ABC123 hoặc ABC123-DEF456))\n-Tồn: Nếu để trống sẽ = 0"></textarea>
						<button style="width: 100%" id="skipSKU">Bỏ Qua SKU</button>
					</div>
				`))
				setEventSuaTonSKUNhieuLinkShopee();
				break;
			case "layPhanLoaiShopeeLayout":
				content.append($(`
					<div class="layout-tab">
						<p>Số lượng tùy chỉnh?</p>
						<input id="stock-edit" type="number" placeholder="Mặc định số lượng = 0" />
						<div style="display: flex; justify-content: center; align-items: center">
							<p>Lấy số lượng theo sàn</p>
							<input type="checkbox" id="getStock" />
						</div>
					</div>
				`))
				break;
			case "themPhanLoaiTikTokLayout":
				content.append($(`
					<div class="layout-tab">
						<p>Thông tin phân loại</p>
						<textarea id="data" placeholder="Mỗi phân loại là một dòng, và các thuộc tính dưới đây sẽ cách nhau 1 tab\n-Tên phân loại: bắt buộc\n-Số Lượng: Nếu để trống sẽ bỏ qua\n-Giá: Nếu để trống sẽ bỏ qua"></textarea>
						<p>Hình ảnh phân loại</p>
						<input type="file" webkitdirectory directory multiple />
						<p style="font-weight:700; color: crimson">*Tên hình ảnh phải là SKU của sản phẩm</p>
					</div>
				`));
				setEventThemPhanLoaiTiktok();
				break;
			case "chinhSuaKhuyenMaiTiktokLayout":
				$("#excuse-command").hide();
				content.append($(`
					<div class="layout-tab">
						<div class="switch-wrapper">
							<span class="switch-label">Xóa</span>
							<label class="switch">
								<input type="checkbox" id="toggle-switch" />
								<div class="slider">
									<div class="slider-handle"></div>
								</div>
							</label>
							<span class="switch-label">Thêm</span>
						</div>
						<div class="button-control-promotion" style="display: flex; gap: 1vw;">
							<button style="width: 100%" id="prev">Sản Phẩm Trước</button>
							<button style="width: 100%; background: crimson;" id="remo">Xóa</button>
							<button style="width: 100%" id="next">Sản Phẩm Kế</button>
						</div>
						<p><span id="currentItem">0</span>/<span id="totalItem">0</span></p>
						<!-- <button style="width: 100%" id="continue">Tiếp Tục</button> -->
						<textarea id="data"></textarea>
					</div>
					`));

					// Wrapper
					$(".switch-wrapper").css({
					"display": "flex",
					"align-items": "center",
					"gap": "10px",
					"font-family": "sans-serif"
					});

					// Label: "Thêm" / "Xóa"
					$(".switch-label").css({
					"font-size": "14px",
					"font-weight": "bold",
					"color": "#444",
					"width": "50px",
					"text-align": "center"
					});

					// Container chính của switch
					$(".switch").css({
					"position": "relative",
					"width": "60px",
					"height": "28px"
					});

					// Ẩn input
					$(".switch input").css({
					"opacity": "0",
					"width": "0",
					"height": "0",
					"position": "absolute"
					});

					// Track của switch (thanh nền)
					$(".slider").css({
					"position": "relative",
					"background-color": "#ccc",
					"border-radius": "34px",
					"width": "100%",
					"height": "100%",
					"cursor": "pointer",
					"transition": "background-color 0.3s"
					});

					// Nút tròn gạt (handle)
					$(".slider-handle").css({
					"position": "absolute",
					"height": "22px",
					"width": "22px",
					"left": "3px",
					"top": "3px",
					"background-color": "white",
					"border-radius": "50%",
					"transition": "left 0.3s",
					"box-shadow": "0 1px 3px rgba(0,0,0,0.2)"
					});

					$("#toggle-switch").on("change", function () {
					if (this.checked) {
						$(".slider").css("background-color", "#4caf50"); // Thêm
						$(".slider-handle").css("left", "35px");
						$(this).attr("data-type", "add");
					} else {
						$(".slider").css("background-color", "#ccc"); // Xóa
						$(".slider-handle").css("left", "3px");
						$(this).attr("data-type", "del");
					}
					});
					setEventChinhSuaKhuyenMaiTiktok();
					break;
			case "saoChepFlashSaleTiktokLayout":
				content.append($(`
					<div class="layout-tab">
						<input class="copy-link" type="text" placeholder="Link để sao chép" />
						<div class="button-control-promotion">
							<button class="add-promotion">Thêm Chương Trình Mới</button>
						</div>
						<div class="area-promotion">
							<div style="display: none; justify-content: center; align-items: center; gap: 2vw" class="box-promotion root">
								<input class="name" type="text" placeholder="Tên chương trình" /><span class="count-character">0/50</span>
								<input class="time-start" type="datetime-local" placeholder="Bắt đầu"/>
								<input class="time-end" type="datetime-local" placeholder="Kết thúc"/>
								<button class="remove-promotion" style="background: crimson; color: #fff; font-weight: 700">Xóa</button>
							</div>

							<!-- DATA MẪU 
							<div style="display: flex; justify-content: center; align-items: center; gap: 2vw" class="box-promotion">
								<input class="name" type="text" placeholder="Tên chương trình" value="Chương Trình 1" /><span class="count-character">0/50</span>
								<input class="time-start" type="datetime-local" placeholder="Bắt đầu" value="05/28/2025 09:00 AM" />
								<input class="time-end" type="datetime-local" placeholder="Kết thúc" value="05/29/2025 09:00 AM"/>
								<button class="remove-promotion" style="background: crimson; color: #fff; font-weight: 700">Xóa</button>
							</div>
							<div style="display: flex; justify-content: center; align-items: center; gap: 2vw" class="box-promotion">
								<input class="name" type="text" placeholder="Tên chương trình" value="Chương Trình 2" /><span class="count-character">0/50</span>
								<input class="time-start" type="datetime-local" placeholder="Bắt đầu" value="05/29/2025 09:00 AM"/>
								<input class="time-end" type="datetime-local" placeholder="Kết thúc" value="05/30/2025 09:00 AM"/>
								<button class="remove-promotion" style="background: crimson; color: #fff; font-weight: 700">Xóa</button>
							</div>
							<div style="display: flex; justify-content: center; align-items: center; gap: 2vw" class="box-promotion">
								<input class="name" type="text" placeholder="Tên chương trình" value="Chương Trình 3" /><span class="count-character">0/50</span>
								<input class="time-start" type="datetime-local" placeholder="Bắt đầu" value="05/30/2025 09:00 AM"/>
								<input class="time-end" type="datetime-local" placeholder="Kết thúc" value="05/31/2025 09:00 AM"/>
								<button class="remove-promotion" style="background: crimson; color: #fff; font-weight: 700">Xóa</button>
							</div> -->
						</div>
					</div>
				`));
				setEventSaoChepFlashSaleTiktok();
				break;
			case "themPhanLoaiNhieuLinkShopeeLayout":
				content.append($(`
					<div class="layout-tab">
						<p>ID sản phẩm cần thêm</p>
						<textarea id="product-link" placeholder="Link sản phẩm cần thêm phân loại"></textarea>
						<p>Thông tin phân loại</p>
						<textarea style="resize: both" id="data" placeholder="Mỗi SKU là một dòng, và các thuộc tính dưới đây sẽ cách nhau 1 tab\n-Tên phân loại: Bắt buộc (Không quá 20 ký tự)\n-SKU: Bắt buộc\n-Giá: Bắt buộc\n-Số lượng: nếu không có sẽ mặc định là 0"></textarea>
						<p>Hình ảnh phân loại</p>
						<input type="file" multiple />
						<p style="font-weight:700; color: crimson">*Tên hình ảnh phải là SKU của sản phẩm</p>
						<button style="width: 100%" id="reporting">Xem Báo Cáo</button>
					</div>
				`));
				setEventThemPhanLoaiNhieuLinkShopee();
				break;
			case "cTrinhKMShopeeLayout":
				content.append($(`
				<div class="layout-tab">
					<div class="switch-wrapper">
					<span class="switch-label">Xóa</span>
					<label class="switch">
						<input type="checkbox" id="toggle-switch">
						<div class="slider">
							<div class="slider-handle"></div>
						</div>
					</label>
					<span class="switch-label">Thêm</span>
					</div>
					<button style="width: 100%" id="skip">Bỏ Qua Sản Phẩm</button>
					<!-- <button style="width: 100%" id="continue">Tiếp Tục</button> -->
					<textarea id="data"></textarea>
				</div>
				`));

				// Wrapper
				$(".switch-wrapper").css({
				"display": "flex",
				"align-items": "center",
				"gap": "10px",
				"font-family": "sans-serif"
				});

				// Label: "Thêm" / "Xóa"
				$(".switch-label").css({
				"font-size": "14px",
				"font-weight": "bold",
				"color": "#444",
				"width": "50px",
				"text-align": "center"
				});

				// Container chính của switch
				$(".switch").css({
				"position": "relative",
				"width": "60px",
				"height": "28px"
				});

				// Ẩn input
				$(".switch input").css({
				"opacity": "0",
				"width": "0",
				"height": "0",
				"position": "absolute"
				});

				// Track của switch (thanh nền)
				$(".slider").css({
				"position": "relative",
				"background-color": "#ccc",
				"border-radius": "34px",
				"width": "100%",
				"height": "100%",
				"cursor": "pointer",
				"transition": "background-color 0.3s"
				});

				// Nút tròn gạt (handle)
				$(".slider-handle").css({
				"position": "absolute",
				"height": "22px",
				"width": "22px",
				"left": "3px",
				"top": "3px",
				"background-color": "white",
				"border-radius": "50%",
				"transition": "left 0.3s",
				"box-shadow": "0 1px 3px rgba(0,0,0,0.2)"
				});

				$("#toggle-switch").on("change", function () {
				if (this.checked) {
					$(".slider").css("background-color", "#4caf50"); // Thêm
					$(".slider-handle").css("left", "35px");
					$(this).attr("data-type", "add");
				} else {
					$(".slider").css("background-color", "#ccc"); // Xóa
					$(".slider-handle").css("left", "3px");
					$(this).attr("data-type", "del");
				}
				});
				// setEventCTrinhKMShopee();
				break;
			case "comboKMShopeeLayout":
				content.append($(`
				<div class="layout-tab">
					<div class="switch-wrapper">
					<span class="switch-label">Xóa</span>
					<label class="switch">
						<input type="checkbox" id="toggle-switch">
						<div class="slider">
							<div class="slider-handle"></div>
						</div>
					</label>
					<span class="switch-label">Thêm</span>
					</div>
					<button style="width: 100%" id="skip">Bỏ Qua Sản Phẩm</button>
					<!-- <button style="width: 100%" id="continue">Tiếp Tục</button> -->
					<textarea id="data"></textarea>
				</div>
				`));

				// Wrapper
				$(".switch-wrapper").css({
				"display": "flex",
				"align-items": "center",
				"gap": "10px",
				"font-family": "sans-serif"
				});

				// Label: "Thêm" / "Xóa"
				$(".switch-label").css({
				"font-size": "14px",
				"font-weight": "bold",
				"color": "#444",
				"width": "50px",
				"text-align": "center"
				});

				// Container chính của switch
				$(".switch").css({
				"position": "relative",
				"width": "60px",
				"height": "28px"
				});

				// Ẩn input
				$(".switch input").css({
				"opacity": "0",
				"width": "0",
				"height": "0",
				"position": "absolute"
				});

				// Track của switch (thanh nền)
				$(".slider").css({
				"position": "relative",
				"background-color": "#ccc",
				"border-radius": "34px",
				"width": "100%",
				"height": "100%",
				"cursor": "pointer",
				"transition": "background-color 0.3s"
				});

				// Nút tròn gạt (handle)
				$(".slider-handle").css({
				"position": "absolute",
				"height": "22px",
				"width": "22px",
				"left": "3px",
				"top": "3px",
				"background-color": "white",
				"border-radius": "50%",
				"transition": "left 0.3s",
				"box-shadow": "0 1px 3px rgba(0,0,0,0.2)"
				});

				$("#toggle-switch").on("change", function () {
				if (this.checked) {
					$(".slider").css("background-color", "#4caf50"); // Thêm
					$(".slider-handle").css("left", "35px");
					$(this).attr("data-type", "add");
				} else {
					$(".slider").css("background-color", "#ccc"); // Xóa
					$(".slider-handle").css("left", "3px");
					$(this).attr("data-type", "del");
				}
				});
				// setEventComboKMShopee();
				break;
			case "suaHinhSKUShopeeLayout":
				content.append($(`
					<div class="layout-tab">
						<input type="file" webkitdirectory directory multiple />
						<p>Tải lên thư mục có chứa hình ảnh, không cần tải lên từng hình</p>
						<p style="font-weight:700; color: crimson">*Tên hình ảnh phải là SKU của sản phẩm</p>

						<!--<label for="search-name">
								<p>Đổi Theo Tên</p>
								<input id="search-name" type="radio" name="searchType" />
						</label>

						<label for="search-sku">
								<p>Đổi Theo SKU</p>
								<input id="search-sku" type="radio" name="searchType" />
						</label> -->
					</div>
				`));

					$(".layout-tab label").css({
						"display": "flex",
						"height": "3vh",
					})

					$(".layout-tab label p").css({
						"width": "100%",
					})
				setEventSuaHinhSKUShopee();
				break;
			case "compareVoucherLayout":
				content.append($(`
				<div class="layout-tab">
					<button id="addVoucher">Thêm Voucher</button>
					<textarea id="data"></textarea>
					<div class="voucher-box">
						<table>
							<thead>
								<tr>
									<td>Kiểm Tra</td>
									<td>Tiền Giảm</td>
									<td>Giảm Tối Đa</td>
									<td>Đơn Tối Thiểu</td>
									<td></td>
							</tr>
							</thead>
							<tbody>
								<tr class="voucher-box root" hidden>
									<td class="checked-box"></td>
									<td class="discount-percent" style="display: flex">
										<input type="text" />
										<select>
											<option>%</option>
											<option><u>đ</u></option>
										</select>
									</td>
									<td class="max-discount">
										<input type="text" />
									</td>
									<td class="condition-deal">
										<input type="text" />
									</td>
									<td class="remove-voucher" style="cursor: pointer">Xóa Voucher</td>
								</tr>
								<tr class="voucher-box">
									<td class="checked-box"></td>
									<td class="discount-percent" style="display: flex">
										<input type="text" />
										<select>
											<option>%</option>
											<option><u>đ</u></option>
										</select>
									</td>
									<td class="max-discount">
										<input type="text" />
									</td>
									<td class="condition-deal">
										<input type="text" />
									</td>
									<td class="remove-voucher" style="cursor: pointer">Xóa Voucher</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				`));
				setEventCompareVoucher();
				break
				case "giaDuoiChuongTrinhShopeeLayout":
					content.append($(`
						<div class="layout-tab">
							<label for="discount">Giảm của giá đuôi</label>
							<label for="money"><p>Tiền Mặt</p> <input type="radio" name="discount-type" id="money" /></label>
							<label for="percent"><p>Phần Trăm</p> <input type="radio" name="discount-type" id="percent" /></label>
							<input type="text" id="tp-discount" />
						</div>
					`));

					$(".layout-tab label").css({
						"display": "flex",
						"height": "3vh",
					})

					$(".layout-tab label p").css({
						"width": "100%",
					})
					break;
				case "themGiaTheoSKULazadaLayout":
					content.append($(`
						<div class="layout-tab">
							<p>Cách sửa giá:</p>
							<select id="type">
								<option data-type="all">Tất cả</option>
								<option data-type="duoi">Giá đuôi</option>
								<option data-type="dau">Giá đầu</option>
							</select>
							<textarea id="data" placeholder="Mỗi SKU là một dòng, và các thuộc tính dưới đây sẽ cách nhau 1 tab\n-SKU: Bắt buộc (ABC123-DEF456 hoặc ABC123)\n-Giá: Bắt buộc"></textarea>
						</div>
					`));
					// setEventThemGiaTheoSKULazada();
					break;
				case "kiemTraTonSapoLayout":
					content.append($(`
					<div class="layout-tab">
						<textarea id="data"></textarea>
					</div>
					`));
					// setEventKiemTraTonSapo();
					break;
				case "mergeExcelFileLayout":
					content.append($(`
					<div class="layout-tab">
						<input type="file" id="mergeFileInput" multiple accept=".xlsx, .xls">
						<br><br>
						<label>Dòng header:</label>
						<input type="number" id="headerRowsCount" value="1" min="0">
						<br />
						<label>Số dòng mô tả:</label>
						<input type="number" id="descriptionRowsCount" value="100" min="1">
					</div>
					`));
					break;
				case "splitExcelFileLayout":
					content.append($(`
					<div class="layout-tab">
						<input type="file" id="fileInput" accept=".xlsx, .xls">
						<br><br>
						<label>Số dòng đầu giữ lại (header + mô tả...):</label>
						<input type="number" id="rowsToPreserve" value="1" min="0">
						<br />
						<label>Số dòng mỗi file:</label>
						<input type="number" id="rowsPerFile" value="100" min="1">
					</div>
					`));
					break;
				case "themKyTuPhanLoaiShopeeLayout":
					content.append($(`
					<div class="layout-tab">
						<select id="group">
							<option>Phân Loại 1</option>
							<option>Phân Loại 2</option>
						</select>
						<p>Kiểu Thêm</p>
						<select id="type">
							<optgroup label="Thêm">
								<option data-count="0">Thêm Vào Đầu</option>
								<option data-count="1">Thêm Vào Đuôi</option>
								<option data-count="2">Thêm Vào Trước Từ Khóa</option>
								<option data-count="3">Thêm Vào Sau Từ Khóa</option>
							</optgroup>
							<optgroup label="Xóa">
								<option data-count="4">Xóa Từ Đầu</option>
								<option data-count="5">Xóa Từ Đuôi</option>
								<option data-count="6">Xóa Trước Từ Khóa</option>
								<option data-count="7">Xóa Sau Từ Khóa</option>
							</optgroup>
							<optgroup label="Thay Thế">
								<option data-count="8">Thay Thế Từ Khóa</option>
								<option disabled data-count="9">Thay Thế Trước Từ Khóa</option>
								<option disabled data-count="10">Thay Thế Sau Từ Khóa</option>
							</optgroup>
						</select>
						<p>Từ khóa/Số Ký Tự</p>
						<textarea id="keyword"></textarea>
						<p>Nội Dung</p>
						<textarea id="data"></textarea>
					</div>
					`));
					// setEventThemKyTuPhanLoaiShopee();
					break;
				case "kTr5LanGiaShopeeLayout":
					content.append($(`
					<div class="layout-tab">
						<p>Giá Cao Nhất: <span id="maxSku">XXX-XXX</span> <span id="maxPrice">0</span></p>
						<p>Giá Thấp Nhất: <span id="minSku">XXX-XXX</span> <span id="minPrice">0</span></p>
						<p>Giá Đề Xuất: <span id="suggestPrice">0</span></p>
					</div>
					`));
					break;
				case "kiemTraPhanLoaiShopeeLayout":
					content.append($(`
					<div class="layout-tab">
						<select id="group">
							<option>Phân Loại 1</option>
							<option>Phân Loại 2</option>
						</select>
						<label for="type">Dò Chính Xác <input id="type" type="checkbox" /></label>
						<textarea id="data"></textarea>
					</div>
					`));
					// setEventKtraPhanloaiShopee();
					break;
				case "themPhanLoaiShopeeLayout":
					content.append($(`
					<div class="layout-tab">
					<select id="group">
						<option>Phân Loại 1</option>
						<option>Phân Loại 2</option>
					</select>
					<textarea id="data"></textarea>
					</div>
					`));
					// setEventThemPhanLoaiShopee();
				break;
			case "keoPhanLoaiShopeeLayout":
				$("#excuse-command").hide();
				content.append($(`
				<div class="layout-tab">
				<select id="group">
					<option>Phân Loại 1</option>
					<option>Phân Loại 2</option>
				</select>
				<div class="btn-control">
					<button id="get">Lấy Phân Loại</button>
					<button id="set">Cập Nhật Phân Loại</button>
				</div>
				</div>
				`));
				// setEventKeoPhanLoaiShopee();
				break;
			case "suaGiaSKUShopeeLayout":
				content.append($(`
				<div class="layout-tab">
					<p>Cách sửa giá:</p>
					<select id="type">
						<option data-type="all">Tất cả</option>
						<option data-type="duoi">Giá đuôi</option>
						<option data-type="dau">Giá đầu</option>
					</select>
					<textarea id="data" placeholder="Mỗi SKU là một dòng, và các thuộc tính dưới đây sẽ cách nhau 1 tab\n-SKU: Bắt buộc (ABC123-DEF456 hoặc ABC123)\n-Giá: Bắt buộc"></textarea>
				</div>
				`));
				// setEventSuaGiaSKUShopee();
				break;
			case "5langiaShopeeLayout":
				content.append($(`<div class="layout-tab">
					<div>
						<label for="max-price">Giá cao nhất: </label>
						<input placeholder="Nhập giá cao nhất" type="text" id="max-price" value="" />
					</div>
					<div>
						<label for="min-price">Giá thấp nhất: </label>
						<input placeholder="Nhập giá thấp nhất" type="text" id="min-price" value="" />
					</div>
					</div>`
				));
				// setEventKtra5LanGiaShopee();
				break;
			case "sapXepHinhAnhShopeeLayout":
				$("#excuse-command").hide();
				$("body").append($(`
				<div class="layout-tab tp-popup">
					<div class="button-control">
						<button id="getData">Lấy Dữ Liệu</button>
						<button id="setData">Xác Nhận</button>
						<button id="cancelData">Hủy</button>
					</div>
					<div class="img-list"></div>
				</div>
				`));
				$(".layout-tab").css({
				"width": "100%",
				"height": "auto",
				"margin-top": "2vh",
				"background": "white",
				});
				$(".tp-popup").css({
				"position": "fixed",
				"top": "0",
				"left": "0",
				"z-index": "999999999999999999999999999999999999999999",
				});
				$(".layout-tab .button-control").css({
				"width": "100%",
				"height": "auto",
				"display": "flex",
				"justify-content": "center",
				"align-items": "center",
				"gap": "2vw",
				});
				$(".layout-tab .button-control button").css({
				"width": "100%",
				"height": "5vh",
				"line-height": "5vh",
				"display": "flex",
				"justify-content": "center",
				"align-items": "center",
				"border-radius": "5px",
				"background": "#cdcdcd",
				});
				$(".layout-tab .img-list").sortable();
				$(".layout-tab .img-list").css({
				"width": "auto",
				"max-width": "100%",
				"height": "auto",
				"max-height": "70vh",
				"overflow": "hidden",
				"overflowX": "scroll",
				"display": "flex",
				"justify-content": "center",
				"align-items": "center",
				});
				$(".layout-tab .img-list .box-img").css({
				"width": "auto",
				"height": "calc(100% - 2vw)",
				"aspect-ratio": "1 / 1",
				"max-height": "20vh",
				});
				// setEventSapXepAnhShopee();
				break;
			case "flashSaleShopeeLayout":
				content.append($(`
				<div class="layout-tab">
					<label for="gia">Cật nhật giá đuôi: <input id="gia" type="checkbox" /></label>
					<textarea id="flahsSaleName" placeholder="Mỗi phân loại là một dòng, và các thuộc tính dưới đây sẽ cách nhau 1 tab\n-Tên phân loại: bắt buộc\n-Số Lượng: Nếu để trống sẽ bỏ qua\n-Giá: Nếu để trống sẽ bỏ qua"></textarea>
				</div>
				`));
				break;
			case "tinhGiaBanLayout":
				content.append($(`
				<div class="layout-tab">
					<div class="input-cost">
						<label for="cost">Nhập Giá Vốn</label>
						<input type="text" id="cost" maxlength="15" placeholder="Nhập giá vốn (đầy đủ số)" />
					</div>
					<div class="output-cost">
						<p>Giá sau Khuyễn mãi: <span id="after-price"></span></p>
						<p>Giá trước Khuyễn mãi: <span id="before-price"></span></p>
						<p>Giá Đăng Bán: <span id="last-price"></span></p>
					</div>
				</div>
				`));
				setEventTinhGiaBan();
				break;
			case "themPhanLoaiLazadaLayout":
				content.append($(`
				<div class="layout-tab">
				<div class="layout-tab">
					<input id="group" placeholder="Nhóm phân loại" value="1" />
					<textarea id="phanLoai" placeholder="Nhập phân loại \nPhân Loại A, Phân Loại B, Phận Loại C, ...">Phân Loại A, Phân Loại B, Phận Loại C</textarea>
				</div>
				</div>`));
				break;
			case "ktraGiaChuongTrinhKMLazadaLayout":
				content.append($(`
				<div class="layout-tab">
				<div class="layout-tab">
					<textarea id="group" placeholder="Nhập từ khóa của nhóm:\nSố phần trăm, key1, key2, key3,..\nSố phần trăm, key1, key2, key3,...">
					10%, massage, diện chẩn, khẩu trang, bịt mặt
					5%, áo mưa bít, bít cá, bít dù</textarea>
				</div>
				</div>`));
				break;
			case "ktraKhuyenMaiTiktokLayout":
				content.append($(`
				<div class="layout-tab">
				<button id="moDSSP">Mở Danh Sách Sản Phẩm Trong Trang</button>
				<button id="ktraKhuyenMai">Kiểm Tra Khuyến Mãi</button>
				</div>
				`));
				// setEventKtraKhuyeMaiTiktok();
				break;
			case "autobrowserLayout":
				$("#excuse-command").hide();
				content.append($(`<div class="layout-tab">
								<button id="getGeminiKey">Lấy Key Gemini</button>
								</div>`
							));
				// setEventAutobrowser();
				break;
			}
		}

		// Cập nhật giá đuôi sàn cam
		function giaDuoiShopee(){
			boxLogging("Đang cập nhật giá đuôi cho sản phẩm");
			var box = $(".discount-item-component");

			var indexBox = 0;

			function kTra5LanGia(){
				boxAlert("Đang kiểm tra giá đuôi cho sản phẩm");
				indexBox--;
				if(indexBox >= box.length)
					return;

				var minPrice = Infinity;
				var maxPrice = -Infinity;

				var parent = box.eq(indexBox).find(".discount-edit-item-model-list .discount-edit-item-model-component");

				var checkBox = box.eq(indexBox).find(".discount-item-header .header-left-area .header-left-top input");

				if(!checkBox.prop("checked")){
					// Nếu sản phẩm chưa được chọn
					indexBox++;
					nextBox();
					return;
				}

				var indexParent = 0;

				function checkItem(){
					if(indexParent >= parent.length)
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

					if(maxPrice < parseInt(giaGoc)){
						maxPrice = parseInt(giaGoc);
						indexParent = 0;
						checkItem();
					}

					if(!switcher.hasClass("eds-switch--disabled")){
						if(minPrice > parseInt(giaKM)){
							minPrice = parseInt(giaKM);
							indexParent = 0;
							checkItem();
						}
					}

					var maxAccept = minPrice * 5;

					console.log(`Giá gốc: ${giaGoc}, Giá KM: ${giaKM}, Max Accept: ${maxAccept}, Max Price: ${maxPrice}, Min Price: ${minPrice}`);

					if(parseInt(giaGoc) > parseInt(maxAccept)){
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

			function nextBox(){
				if(indexBox >= box.length){
					boxLogging("Đã cập nhật giá đuôi cho tất cả sản phẩm");
					return;
				}

				var parent = box.eq(indexBox).find(".discount-edit-item-model-list .discount-edit-item-model-component");

				var checkBox = box.eq(indexBox).find(".discount-item-header .header-left-area .header-left-top input");

				if(!checkBox.prop("checked")){
					// Nếu sản phẩm chưa được chọn
					indexBox++;
					nextBox();
					return;
				}

				var indexParent = 0;

				var minPrice = Infinity;
				var maxPrice = -Infinity;
				var maxAccept = 0;

				async function nextParent(){
					if(indexParent >= parent.length){
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

						if(minAccept > minPrice)
							minPrice = Math.ceil(parseInt(maxPrice) / 5);

						if(maxAccept < maxPrice)
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

					if(maxPrice < parseInt(gia)){
						maxPrice = parseInt(gia);
						indexParent = 0;
						nextParent();
						return;
					}

					if(!switcher.hasClass("eds-switch--disabled")){
						// Những sản phẩm không bị disabled
						if(!switcher.hasClass("eds-switch--open")){
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

						if(parseInt(giaKM5lan) <= 0){
							giaKM5lan = price.val().replace("₫", "");
							giaKM5lan = giaKM5lan.replace(".", "");
						}

						// Kiểm tra 5 lần giá
						if(minPrice > parseInt(giaKM5lan)){
							minPrice = parseInt(giaKM5lan);
							indexParent = 0;
							nextParent();
							return;
						}

						maxAccept = minPrice * 5;

						if(parseInt(gia) > parseInt(maxAccept)){
							boxLogging(`Sản phẩm [copy]${name.text()}[/copy] có giá quá cao, không thể cập nhật giá đuôi`, [`${name.text()}`], ["orange"]);
							parent.eq(indexParent).css({
								"background": "pink",
								"color": "#fff"
							});
						}

						// Những sản phẩm đã bật						
						if(switcher.hasClass("eds-switch--open")){
							// Những sản phẩm đã bật
							if(parseInt(giaKM) <= 0){
								// Những sản phẩm không có giá đuôi
								parent.eq(indexParent).css({
									"background": "crimson",
									"color": "#fff"
								});
								boxLogging(`Sản phẩm [copy]${name.text()}[/copy] không có giá đuôi`, [`${name.text()}`], ["crimson"]);
							}else{
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

		// Tính giá bán sàn cam
		function tinhGiaBan(){
			var cost = $("#cost").val().split(",");
			cost = cost.join("");
			var afterPrice, beforePrice;
			if(!cost == "" && cost.length > 0){
				afterPrice = parseInt((cost / 0.45).toFixed(0));
				beforePrice = afterPrice + parseInt((afterPrice * 0.3).toFixed(0));

				afterPrice = afterPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
				beforePrice = beforePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

				var len = beforePrice.split(",").length;
				var dong = 0, arrayTien = [], tienTruoc = 0, tienSau = 0;
				arrayTien = beforePrice.split(",");
				dong = arrayTien[arrayTien.length - 1];
				for(var i = 0; i < arrayTien.length - 1; i++){
					tienTruoc += arrayTien[i];
				}

				tienTruoc = parseInt(tienTruoc);
				if(parseInt(dong) > 0)
					tienTruoc += 1;

				arrayTien = afterPrice.split(",");
				dong = arrayTien[arrayTien.length - 1];
				for(i = 0; i < arrayTien.length - 1; i++){
					tienSau += arrayTien[i];
				}

				tienSau = parseInt(tienSau);
				if(parseInt(dong) > 0)
					tienSau += 1;

				afterPrice = tienSau + "000";
				beforePrice = tienTruoc + "000";

				$("#after-price").html(`${afterPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} (<span class="copyable">${afterPrice.toString()}</span>)`);
				$("#before-price").html(`${beforePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} (<span class="copyable">${beforePrice.toString()}</span>)`);

				var arrayBefore = beforePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',').split(",");
				var arrayAfter = afterPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',').split(",");

				var lastPrice = [], giaDau, giaDuoi;

				for(i = 0; i < arrayBefore.length - 1; i++){
					giaDau += arrayBefore[i];
				}

				for(i = 0; i < arrayAfter.length - 1; i++){
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
					if(lastPrice.length - giaDuoi.length + index == flagDau){
						lastPrice[flagDau - 1] = parseInt(lastPrice[flagDau - 1]) + 1;
					}

					lastPrice[lastPrice.length - giaDuoi.length + index] = giaDuoi[index];
				})

				lastPrice = lastPrice.join("");
				$("#last-price").html(`${lastPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} (<span class="copyable">${lastPrice.toString()}</span>)`);
			}
		}

		function setEventTinhGiaBan(){
			// $("#after-price").parent().on("click", function(){
			// 	navigator.clipboard.writeText($(this).find("span").text().replace(",", ""));
			// });
			// $("#before-price").parent().on("click", function(){
			// 	navigator.clipboard.writeText($(this).find("span").text().replace(",", ""));
			// });
			// $("#last-price").parent().on("click", function(){
			// 	navigator.clipboard.writeText($(this).find("span").text().replace(",", ""));
			// });

			$("#cost").on("keyup", function (e) {
				var cost = $("#cost").val();
				cost = cost.split(",");
				cost = cost.join("");
				cost = cost.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
				$("#cost").val(cost);
				tinhGiaBan();
			});
		}

		// Bật flash sale shopee theo tên
		function flashSaleShopee(){
			var data = $("#flahsSaleName").val().split("\n");
			var nameList = [], countList = [], priceList = [];
			var capNhatGia = $(".tp-container.tp-content .layout-future input#gia").prop("checked");
			$.each(data, (index, value) => {
				value = value.split("\t");
				nameList.push(value[0]);
				countList.push(value[1] || -1);
				priceList.push(value[2] || -1)
			});

			var container = $(".products-container-content form.product-table .table-card");

			// var choiceAll = container.parent().find(".shopee-fixed-top-card.product-fixed-header.edit-fixed-header label.eds-checkbox.item-selector").click().click();

			$.each(container, (index, value) => {
				var productBox = container.eq(index).find(".inner-rows .inner-row");
				$.each(productBox, (index, value) => {
					productBox.eq(index).css({
						"background": "transparent",
						"color": "#000"
					});

					var productName = productBox.eq(index).find(".variation .ellipsis-content");
					var originalPrice = productBox.eq(index).find(".original-price");
					var currentcyPrice = productBox.eq(index).find(".currency-input input");
					var perPrice = productBox.eq(index).find(".discount-input input");
					var campaignStock = productBox.eq(index).find(".campaign-stock input");
					var currentStock = productBox.eq(index).find(".current-stock");
					var buttonSwitch = productBox.eq(index).find(".eds-switch.eds-switch--close.eds-switch--normal");

					var productText = productName.text()?.replace(/\s+/g, ' ').normalize("NFKC").trim().toLowerCase() || "";

					/*var pos = nameList.findIndex(item => item.replace(/\s+/g, ' ')
							.normalize("NFKC")
							.toLowerCase()
							.includes(productText.replace(/\s+/g, ' ').normalize("NFKC").toLowerCase())
					);*/

					var pos = -1;

					$.each(nameList, (index, value) => {
						if(productText.includes(value.toLowerCase()))
							pos = index;
					});

					if(pos != -1){
						var name = nameList[pos], count = countList[pos];

						if(count == -1)
							count = parseInt(currentStock.text());

						if(parseInt(currentStock.text()) >= parseInt(count)){
							// Xử lý số lượng

							simulateClearing($(campaignStock), 50, () => {
								$(campaignStock).val(count);
								simulateReactEvent($(campaignStock), "input");
							})

							if(capNhatGia){
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

							if(!buttonSwitch.hasClass("eds-switch--open")){
								console.log(buttonSwitch);
								console.log(productBox.eq(index).find(".item-selector"));

								// simulateReactEvent($(buttonSwitch), "click");
								// buttonSwitch.click();
								// buttonSwitch.parent().parent().parent().trigger("click");

								// simulateReactEvent($(productBox).eq(index).find(".item-selector"), "click");
								productBox.eq(index).find(".item-selector").trigger("click");
								productBox.eq(index).find(".item-selector input.eds-checkbox__input").val("true");
							}

							boxLogging(`Đã chọn: [copy]${productName.text()}[/copy]\n\tGiá: ${originalPrice.text()}\n\tSố Lượng: ${count}/${campaignStock.val()}\n`, [`${productName.text()}`, `${originalPrice.text()}`, `${count}`, `${campaignStock.val()}`], ["crimson", "green", "blue", "blue"]);
						}

						// boxLogging(`${productName.text()} không đủ số lượng\n\tGiá: ${originalPrice.text()}\n\tSố Lượng: ${count}/${campaignStock.val()}\n`, [`${productName.text()}`, `${originalPrice.text()}`, `${count}`, `${campaignStock.val()}`], ["crimson", "green", "blue", "blue"]);
					}else{
						// boxLogging(`Sản phẩm ${productName.text()} không có trong danh sách`, [`${productName.text()}`], ["crimson"]);
					}
				});
			});

			boxToast("Hoàn thành đánh dấu sản phẩm", "success")
		}

		// Kiểm tra 5 lần giá shopee
		function kTr5LanGiaShopee(){
			var box = $(".variation-model-table-main .eds-scrollbar.middle-scroll-container .eds-scrollbar__content .variation-model-table-body .table-cell-wrapper");
			var boxLeft = $(".variation-model-table-fixed-left .variation-model-table-body .table-cell-wrapper");
			var maxPrice = 0, minPrice = 0, min, maxSku, minSku, maxPos;
			var listSku = [], listPrice = [];
			var error = false;
			var first = 0;
			box.css("background", "transparent");
			boxLeft.css("background", "transparent");
			for(var i = 0; i < box.length; i++){
				var name = boxLeft.eq(i).find(".table-cell").eq(0);
				var nameProduct = name.contents().filter(function() {
							return this.nodeType === 3; // chỉ lấy text thuần
					})[0]?.nodeValue.trim();
				var price = box.eq(i).find(".table-cell").eq(0).find("input");
				var sku = box.eq(i).find(".table-cell").eq(2).find("textarea");

				if("x0".includes(sku.val().trim())){
					boxLogging(`Đã bỏ qua sản phẩm [copy]${nameProduct}[/copy]`, [`${nameProduct}`], ["pink"]);
					box.eq(i).css("background", "pink");
					boxLeft.eq(i).css("background", "pink");
					continue;
				}

				if(first == 0){
					minPrice = tachGia(price.val()).giaDuoi;
					minSku = sku.val();
					first = 1;
					continue;
				}

				if(parseInt(tachGia(price.val()).giaDuoi) == 0){
					boxLogging(`Sản phẩm [copy]${nameProduct}[/copy] chưa có giá đuôi!`, [`${nameProduct}`], [`crimson`])
					box.eq(i).css("background", "crimson");
					boxLeft.eq(i).css("background","crimson");
					continue;
				}

				if(minPrice > parseInt(tachGia(price.val()).giaDuoi) && parseInt(tachGia(price.val()).giaDuoi) > 0){
					i = 0;
					minPrice = tachGia(price.val()).giaDuoi;
					minSku = sku.val();
					box.css("background", "transparent");
					boxLeft.css("background", "transparent");
					listSku = [];
					listPrice = [];
					continue;
				}

				maxPrice = minPrice * 5;

				if(maxPrice < price.val()){
					box.eq(i).css("background" , "orange");
					boxLeft.eq(i).css("background", "orange");
					listSku.push(sku.val());
					listPrice.push(price.val());
				}

				var arr = listPrice;

				var maxIndex = arr.reduce((maxIdx, currentVal, currentIdx, array) => {
					return currentVal > array[maxIdx] ? currentIdx : maxIdx;
				}, 0);

				maxPrice = listPrice[maxIndex];
				min = minPrice;
				maxSku = listSku[maxIndex];
			}

			if(listPrice.length > 0 && listSku.length > 0){
				$(".tp-container.tp-content .program-future .layout-future span#maxPrice").html(`${maxPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} (<span class="copyable">${maxPrice}</span>)`);
				$(".tp-container.tp-content .program-future .layout-future span#maxSku").html(`<span class="copyable">${maxSku}</span>`);
			}

			$(".tp-container.tp-content .program-future .layout-future span#minPrice").html(`${min.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} (<span class="copyable">${min}</span>)`);
			$(".tp-container.tp-content .program-future .layout-future span#minSku").html(`<span class="copyable">${minSku}</span>`);
			$(".tp-container.tp-content .program-future .layout-future span#suggestPrice").html(`${(parseInt(min) * 5).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} (<span class="copyable">${parseInt(min) * 5}</span>)`);

			//listSku = [...listSku.reduce((map, item) => map.set(item, true), new Map()).keys()];
			//listPrice = [...listPrice.reduce((map, item) => map.set(item, true), new Map()).keys()];

			$.each(listSku, (index, value) => {
				error = true;
				boxLogging(`[copy]${listSku[index]}</copy> bị 5 lần giá đuôi ${listPrice[index].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`, [`${listSku[index]}`, `${listPrice[index].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`], ["orange", "lightgreen"]);
			});

			if(!error){
				boxLogging(`Không bị 5 lần giá`, [`Không bị 5 lần giá`], ["green"]);
			}

			boxToast("Đã kiểm tra 5 lần giá", "success")
		}

		// Kiểm tra mã phân loại shopee
		function kiemTraMaPhanLoaiShopee(){
			var container = $(".eds-table__main-body").eq(0).find(".eds-scrollbar__wrapper .eds-scrollbar__content table tbody tr");

			//var choiceAll = container.parent().find(".shopee-fixed-top-card.product-fixed-header.edit-fixed-header label.eds-checkbox.item-selector").click().click();

			$.each(container, (index, value) => {
				$.each($(value).find("td").eq(1).find(".view-more .model-list-item"), (index, value) => {
					var productName = $(value).find(".product-variation-padding").eq(0);
					var stock = $(value).find(".product-variation-padding").eq(3);

					productName.find(".data-model-id-tp").remove();

					productName.find(".variation-name-info").append($(`
					<div class="data-model-id-tp">
						Mã Phân Loại: ${stock.find(".list-view-stock").attr("modelid")}
					</div>
					`));
				});
				var item = container.find("td").eq(1);
				return;
				var productBox = container.eq(index).find(".inner-rows .inner-row");
				$.each(productBox, (index, value) => {
					productBox.eq(index).css({
						"background": "transparent",
						"color": "#000"
					});

					var productName = productBox.eq(index).find(".variation .ellipsis-content");
					var originalPrice = productBox.eq(index).find(".original-price");
					var currentcyPrice = productBox.eq(index).find(".currency-input input");
					var perPrice = productBox.eq(index).find(".discount-input input");
					var campaignStock = productBox.eq(index).find(".campaign-stock input");
					var currentStock = productBox.eq(index).find(".current-stock");
					var buttonSwitch = productBox.eq(index).find(".eds-switch.eds-switch--close.eds-switch--normal");

					productName.parent().find(".data-model-id").remove();

					productName.parent().append($(`
					<div class="data-model-id">
						${productBox.eq(index).attr("data-model-id")}
					</div>
					`));
				});
			});

			boxToast("Hoàn thành kiểm tra tên phân loại", "success")
		}

		// Sửa giá theo SKU sản phẩm
		function suaGiaSKUShopee(){
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

					switch(type){
						case "all":
							if(skuBox.val().includes(sku)){
								var priceBox1 = priceBox.val().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || "Không";
								var gia1 = gia.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

								if(parseInt(priceBox.val()) < parseInt(gia)){
									boxLogging(`SKU: [copy]${skuBox.val()}[/copy] có giá mới cao hơn giá hiện tại (${gia1} > ${priceBox1})`, [`${skuBox.val()}`], ["crimson"]);
									box.eq(index).css("background", "crimson");
								}else{
									priceBox.val(gia);
									simulateReactEvent($(priceBox), "input");
									box.eq(index).css("background", "lightgreen");
									boxLogging(`Giá của [copy]${skuBox.val()}[/copy] đã sửa từ ${priceBox1} thành ${gia1}`, [`${skuBox.val()}`, `${priceBox1}`, `${gia1}`], ["lightgreen", "orange", "orange"]);
								}
							}
						break;

						case "duoi":
							if(skuBox.val().includes(sku)){
								var price = tachGia(priceBox.val());
								var giaDau = price.giaDau;
								var giaDuoi = gia;

								var editPrice = gopGia(giaDau, giaDuoi);

								if(parseInt(editPrice.gia) > parseInt(price.gia)){
									giaDau = parseInt(giaDau) - 1000;

									editPrice = gopGia(giaDau, giaDuoi);
								}

								if(parseInt(giaDuoi) > parseInt(giaDau)){
									boxLogging(`Bỏ qua SKU: [copy]${skuBox.val()}[/copy] (có giá đuôi cao hơn giá đầu)`, [`${skuBox.val()}`], ["crimson"]);
									box.eq(index).css("background", "crimson");
									return;
								}else if(parseInt(giaDuoi) >= parseInt(giaDau) - 5000){
									boxLogging(`SKU [copy]${skuBox.val()}[/copy] có giá đuôi cận giá đầu`, [`${skuBox.val()}`], ["orange"]);
									box.eq(index).css("background", "orange");
									priceBox.val(editPrice.gia);
									simulateReactEvent($(priceBox), "input");
								}else{
									boxLogging(`Giá của [copy]${skuBox.val()}[/copy] đã sửa từ ${price.gia} thành ${editPrice.gia}`, [`${skuBox.val()}`, `${price.gia}`, `${editPrice.gia}`], ["lightgreen", "green", "green"]);
									priceBox.val(editPrice.gia);
									simulateReactEvent($(priceBox), "input");
									box.eq(index).css("background", "lightgreen");
								}
							}
						break;

						case "dau":
							if(skuBox.val().includes(sku)){
								var price = tachGia(priceBox.val());
								var giaDau = gia;
								var giaDuoi = price.giaDuoi;

								var editPrice = gopGia(giaDau, giaDuoi);

								if(parseInt(editPrice.gia) > parseInt(price.gia)){
									boxLogging(`SKU: [copy]${skuBox.val()}[/copy] có giá mới cao hơn giá hiện tại (${editPrice.gia} > ${price.gia})`, [`${skuBox.val()}`], ["crimson"]);
									box.eq(index).css("background", "crimson");
									return;
								}

								if(parseInt(giaDuoi) > parseInt(giaDau)){
									boxLogging(`Bỏ qua SKU: [copy]${skuBox.val()}[/copy] (có giá đuôi cao hơn giá đầu)`, [`${skuBox.val()}`], ["crimson"]);
									box.eq(index).css("background", "crimson");
									return;
								}else if(parseInt(giaDuoi) >= parseInt(giaDau) - 5000){
									boxLogging(`SKU [copy]${skuBox.val()}[/copy] có giá đuôi cận giá đầu`, [`${skuBox.val()}`], ["orange"]);
									box.eq(index).css("background", "orange");
									priceBox.val(editPrice.gia);
									simulateReactEvent($(priceBox), "input");
								}else{
									boxLogging(`Giá của [copy]${skuBox.val()}[/copy] đã sửa từ ${price.gia} thành ${editPrice.gia}`, [`${skuBox.val()}`, `${price.gia}`, `${editPrice.gia}`], ["lightgreen", "green", "green"]);
									priceBox.val(editPrice.gia);
									simulateReactEvent($(priceBox), "input");
									box.eq(index).css("background", "lightgreen");
								}
							}
						break;
					}
				});
			});

			boxToast("Đã sửa giá các SKU được chọn", "success")
		}

		var inputMap = {};
		// Thay hình theo SKU
		function setEventSuaHinhSKUShopee(){
			// Gắn sự kiện và cho phép chọn thư mục
			$(".tp-container.tp-content .layout-future .layout-tab input")
				.attr({
				webkitdirectory: true,
				directory: true,
				multiple: true
				})
				.on("change", function () {
				var files = this.files;

				// Xóa map cũ
				inputMap = {};

				for (let i = 0; i < files.length; i++) {
					var file = files[i];

					// Lấy tên file không có đuôi mở rộng
					var fileNameOnly = file.name.split(".")[0].trim().toUpperCase();

					// Tạo DataTransfer chứa file
					var dt = new DataTransfer();
					dt.items.add(file);

					// Tạo input giả (để nạp file vào ô của Shopee)
					var newInput = $("<input type='file'>").prop("files", dt.files).addClass("single-file-input");

					// Gán theo SKU
					inputMap[fileNameOnly] = newInput;
				}
			});
		}

		function suaHinhSKUShopee(){
			var box = $(".variation-model-table-main .eds-scrollbar.middle-scroll-container .eds-scrollbar__content .variation-model-table-body .table-cell-wrapper");
			var boxLeft = $(".variation-model-table-fixed-left .variation-model-table-body .table-cell-wrapper");

			var clickInput = false;

			$.each(box, async (index) => {
				var skuBox = box.eq(index).find(".table-cell").eq(2).find("textarea");
				var sku = skuBox.val().trim().toUpperCase();

				var imgInputShopee = boxLeft.eq(index).find(".table-cell").eq(0).find("input[type=file]")[0];

				// Tìm SKU tương ứng trong inputMap
				// var found = Object.keys(inputMap).find(key =>
				// 	sku.includes(key.toUpperCase()) || key.toUpperCase().includes(sku)
				// );

				if (inputMap[sku]) {
					if(boxLeft.eq(index).find(".table-cell img.shopee-image-manager__image").length > 0){
						// boxLogging(`Phân Loại ${sku} đã có ảnh`, [`${sku}`], ["crimson"]);
						var delButton = boxLeft.eq(index).find("span.shopee-image-manager__icon.shopee-image-manager__icon--delete");

						simulateReactEvent($(delButton), 'click');

						boxLogging(`Đã xóa ảnh của SKU [copy]${sku}[/copy]`, [`${sku}`], ["orange"]);

						boxLeft.eq(index).css({
							"background": "orange",
						});
						// Chờ xóa ảnh
						await delay(500);
					}

					// inputMap[found] là jQuery object, cần lấy phần tử gốc
					var fileInputEl = inputMap[sku].get(0);
					if (!fileInputEl || !fileInputEl.files || fileInputEl.files.length === 0) return;

					var file = fileInputEl.files[0];
					var dt = new DataTransfer();
					dt.items.add(file);

					// Click input đầu tiên để kích hoạt UI React
					if(!clickInput){
						// imgInputShopee.click();
						clickInput = true;
					}

					setTimeout(() => {
						imgInputShopee.files = dt.files;

						// Tạo sự kiện change để Shopee nhận diện file mới
						var evt = new Event("change", { bubbles: true });
						imgInputShopee.dispatchEvent(evt);
						boxLogging(`Đã sửa ảnh cho SKU [copy]${sku}[/copy]`, [`${sku}`], ["green"])
						boxLeft.eq(index).css({
							"background": "lightgreen",
							color: "#000"
						});
					}, 100); // có thể chỉnh tăng lên nếu chưa kịp load
				}else{
					boxLogging(`SKU [copy]${sku}[/copy] không có ảnh`, [`${sku}`], ["crimson"])
					boxLeft.eq(index).css({
						"background": "crimson",
						"color": "#fff"
					});
				}

			});

			boxToast("Đã sửa hình ảnh của những SKU đã tải lên", "success")
		}

		// Thêm ký tự giới tính vào tên phân loại shopee
		function setEventThemKyTuPhanLoaiShopee(){
			setEventTabTextarea()
		}

		function themKyTuPhanLoaiShopee() {
			var group = $(".tp-container.tp-content .layout-future .layout-tab #group").find("option:selected").index();
			var data = $(".tp-container.tp-content .layout-future .layout-tab #data");
			var keywordInput = $(".tp-container.tp-content .layout-future .layout-tab #keyword");
			var arrayData = data.val().split("\n").map(line => line.trim()).filter(line => line !== "");
			var arrayKeyword = keywordInput.val().split("\n").map(line => line.trim()).filter(line => line !== "");

			// if (arrayData.length !== arrayKeyword.length) {
			// 	boxLogging("Số lượng dòng dữ liệu và từ khóa không khớp.", ["Số lượng dòng dữ liệu", "Số lượng dòng từ khóa"], ["crimson", "crimson"]);
			// 	boxToast(`Số lượng dòng dữ liệu và từ khóa không khớp.`, "error");
			// 	return;
			// }

			var type = parseInt($(".tp-container.tp-content .layout-future #type").find("option:selected").attr("data-count"));
			var box = $(".variation-edit-item.version-a").eq(group).find(".option-container .options-item.drag-item");

			$.each(box, (index, element) => {
				var nameInput = $(element).find(".variation-input-item-container.variation-input-item input");
				var currentName = nameInput.val();
				var newValue = null;
				var dataItem = arrayData[index % arrayData.length]; // Sử dụng modulo để lặp nếu cần
				var keywordItem = arrayKeyword[index % arrayKeyword.length]; // Sử dụng modulo để lặp nếu cần
				var pos = 0;

				console.log(`Data: ${dataItem}, Keyword: ${keywordItem}, Current Name: ${currentName}`);

				switch (type) {
					// Thêm ký tự vào đầu
					case 0:
						newValue = (`${dataItem} ${currentName}`).trim();
						break;
					// Thêm ký tự vào cuối
					case 1:
						newValue = (`${currentName} ${dataItem}`).trim();
						break;
					// Thêm ký tự trước từ khóa
					case 2:
						pos = currentName.toLowerCase().indexOf(keywordItem.toLowerCase());
						if (pos < 0) {
							return; // Bỏ qua nếu không tìm thấy từ khóa
						}
						var before = currentName.slice(0, pos).trim();
						var after = currentName.slice(pos).trim();
						newValue = (`${before} ${dataItem} ${after}`).trim();
						break;
					// Thêm ký tự sau từ khóa
					case 3:
						pos = currentName.toLowerCase().indexOf(keywordItem.toLowerCase());
						if (pos < 0) {
							return; // Bỏ qua nếu không tìm thấy từ khóa
						}
						var before = currentName.slice(0, pos + keywordItem.length).trim();
						var after = currentName.slice(before.length).trim();
						newValue = (`${before} ${dataItem} ${after}`).trim();
						break;
					// Xóa ký tự từ đầu
					case 4:
						newValue = currentName.slice(keywordItem.length).trim();
						break;
					// Xóa ký tự từ cuối
					case 5:
						newValue = currentName.slice(0, currentName.length - keywordItem.length).trim();
						break;
					// Xóa ký tự trước từ khóa
					case 6:
						pos = currentName.toLowerCase().indexOf(keywordItem.toLowerCase());
						if (pos < 0) {
							return; // Bỏ qua nếu không tìm thấy từ khóa
						}
						newValue = currentName.slice(pos).trim();
						break;
					// Xóa ký tự sau từ khóa
					case 7:
						pos = currentName.toLowerCase().indexOf(keywordItem.toLowerCase());
						if (pos < 0) {
							return; // Bỏ qua nếu không tìm thấy từ khóa
						}
						newValue = currentName.slice(0, pos + keywordItem.length).trim();
						break;
					case 8:
						newValue = currentName.replace(new RegExp(keywordItem, 'g'), dataItem).trim(); // Sử dụng RegExp để thay thế tất cả các lần xuất hiện
						break;
				}

				if (newValue !== null) {
					if (newValue.length > 20) {
						boxLogging(`Số ký tự "${currentName}" vượt quá mức cho phép (${newValue.length}/20)`, [`"${currentName}"`, `${newValue.length}/20`], ["crimson", "crimson"]);
						nameInput.css({
							"background": "crimson",
							"color": "#fff"
						});
					} else {
						if (nameInput.val() === newValue) {
							boxLogging(`Giữ nguyên "${currentName}"`);
							nameInput.css({
								"background": "pink",
								"color": "#fff"
							});
							return;
						}
						nameInput.val(newValue);
						simulateReactEvent(nameInput, "input");
						boxLogging(`Đã đổi "${currentName}" thành "${newValue}"`, [`"${currentName}"`, `"${newValue}"`], ["green", "green"]);
						nameInput.css({
							"background": "green",
							"color": "#fff"
						});
					}
				}
			});

			boxToast("Đã sửa lại tên phân loại", "success");
		}

		// Cập nhật giá đuôi Lazada
		function giaDuoiLazada(){
			boxAlert(`Cập nhật giá đuôi`)
			var row = $(".next-table-row");
			var price = [];

			var indexRow = 0;
			async function nextRow(){
				if(indexRow >= row.length){
					boxToast(`Đã cập nhật giá đuôi`, "success");
					boxLogging(`Đã cập nhất giá đuôi`);
					return;
				}

				var gia = row.eq(indexRow).find("input").val();
				var giaKM = tachGia(gia).giaDuoi;

				var name = row.eq(indexRow).find("td:nth-child(1) button span").text();

				if(row.eq(indexRow).find("td.special_price").has("button.next-btn").length == 0){
					var currentPrice = parseInt($(".special-price .number-text-scope").attr("title"));
					if(currentPrice != giaKM){
						var price = $(".special-price .number-text-scope");

						console.log(price);

						simulateReactEvent(price, "mouseover");

						await delay(500);
						
						simulateReactEvent($(".next-overlay-wrapper .next-balloon-content button:nth-child(1) i"), "click");
					}
				}else{
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

				if(row.eq(indexRow).find("td.special_price").has("button.next-btn").length > 0){
					if(parseInt(giaKM) == 0)
						giaKM = gia;

					row.eq(indexRow).find("td.special_price button.next-btn").click();

					await delay(200);

					var balloon = $(".next-overlay-wrapper .next-balloon-content").last();
					
					var inputPrice = balloon.eq(0).find(".money-number-picker input");
					var buttonClick = balloon.eq(0).find(".action-wrapper button:nth-child(1)");

					inputPrice.select();
					
					inputPrice.attr("value", giaKM);

					inputPrice.val(giaKM);

					inputPrice.blur();

					await delay(200);

					buttonClick.click();

					await delay(200);

					boxLogging(`Đã cập nhật giá đuôi cho ${name}`, [`${name}`], ["pink"]);
				}else{
					console.log(parseInt(price.attr("title")), parseInt(giaKM));
					console.log(parseInt(price.attr("title")) != parseInt(giaKM));
					if(parseInt(price.attr("title")) != parseInt(giaKM)){
						simulateReactEvent(price, "mousemove");

						var price = $(".special-price .number-text-scope");

						simulateReactEvent(price, "mouseover");

						await delay(500);
						
						simulateReactEvent($(".next-overlay-wrapper .next-balloon-content button:nth-child(1) i"), "click");

						await delay(500);

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
					}
				}

				indexRow++;
				nextRow();
			}
			nextRow();
		}

		// Điều chỉnh combo khuyến mãi shopee
		function setEventComboKMShopee(){
			$(".tp-container .layout-tab label").on("click", function(){
				$(".tp-container .layout-tab #data").select().focus();
			});
		}

		function comboKMShopee(){
			var data = $(".tp-container.tp-content .layout-future .layout-tab #data");
			var arrayData = data.val().split("\n").filter(i => i.trim() !== "");

			var inputBox = $(".eds-react-search input");

			var searchIcon = $(".eds-react-search span.eds-react-icon.eds-react-icon-search.eds-react-input__suffix-icon");

			var currentItem = 0;

			var type = $(".tp-container.tp-content .layout-future .layout-tab #toggle-switch").attr("data-type") || "del";

			if(type == "del"){
				function nextItem(){
					console.log(currentItem);
					var skip = 0;
					if(currentItem >= arrayData.length){
						boxToast("Đã xóa các ID sản phẩm khỏi combo khuyến mãi", "success")
						return;
					}

					simulateClearReactInput(inputBox);

					var sku = arrayData[currentItem];

					// inputBox.val(sku);

					// simulateReactEvent(inputBox, "change")

					simulateReactInput(inputBox, sku)

					searchIcon.click();

					var box = $("tbody.eds-react-table-tbody").eq(1);

					waitForElement(box, (".eds-react-table-row.eds-react-table-row-level-0"), (e) => {
						if($(e).attr("data-row-key") == sku){

							$(e).find("td").eq(6).find("button").on("click", (e) => {
								boxLogging(`Đã xóa [copy]${sku}[/copy]`, [`${sku}`], ["green"])
								currentItem++;
								nextItem();
							})

							$(e).find("td").eq(6).find("button").click();
						}
					}, {once: false, waitForLastChange: 1000})

					$(".tp-container.tp-content .layout-future .layout-tab #skip").click(() => {
						boxLogging(`Đã bỏ qua [copy]${sku}[/copy]`, [`${sku}`], ["orange"])
						currentItem++;
						nextItem();
					})
				}
				nextItem();
			}else if(type == "add"){
				boxToast("Đã sao chép các ID sản phẩm theo định dạng", "success")
				var skuList = arrayData.join(",");
				navigator.clipboard.writeText(skuList);
			}
		};

		// Điều chỉnh chương trình khuyến mãi shopee
		function setEventCTrinhKMShopee(){
			$(".tp-container .layout-tab label").on("click", function(){
				$(".tp-container .layout-tab #data").select().focus();
			});
		}

		function cTrinhKMShopee(){
			var data = $(".tp-container.tp-content .layout-future .layout-tab #data");
			var arrayData = data.val().split("\n").filter(i => i.trim() !== "");

			var inputBox = $(".eds-input.search-input input");

			var searchIcon = $(".eds-input.search-input .search-btn");

			var currentItem = 0;

			var type = $(".tp-container.tp-content .layout-future .layout-tab #toggle-switch").attr("data-type") || "del";

			if(type == "del"){
				function nextItem(){
					console.log(currentItem);
					var skip = 0;
					if(currentItem >= arrayData.length){
						boxToast("Đã xóa các ID sản phẩm khỏi combo khuyến mãi", "success")
						return;
					}

					simulateClearReactInput(inputBox);

					var sku = arrayData[currentItem];

					// inputBox.val(sku);

					// simulateReactEvent(inputBox, "change")

					simulateReactInput(inputBox, sku)

					searchIcon.click();

					setTimeout(() => {
						var bin = $(".discount-item-component").find(".discount-item-header .header-right-area .item-content.item-action button");

						bin.click();

						setTimeout(() => {
							var popUp = $(".eds-modal__mask");
							popUp = popUp.get(popUp.length - 1);

							$(popUp).on("click", () => {
							boxLogging(`Đã xóa [copy]${sku}[/copy]`, [`${sku}`], ["green"])
							currentItem++;
							nextItem();				
						})

							$(popUp).find(".eds-modal__box .eds-modal__content.eds-modal__content--normal .eds-modal__footer").find("button").eq(1).click();
						}, 500)
					}, 500)					

					$(".tp-container.tp-content .layout-future .layout-tab #skip").click(() => {
						boxLogging(`Đã bỏ qua [copy]${sku}[/copy]`, [`${sku}`], ["orange"])
						currentItem++;
						nextItem();
					})
				}
				nextItem();
			}else if(type == "add"){
				boxToast("Đã sao chép các ID sản phẩm theo định dạng", "success")
				var skuList = arrayData.join(",");
				navigator.clipboard.writeText(skuList);
			}
		};

		// Kiểm tra tên phân loại đã tồn tại trong sản phẩm chưa
		function kiemTraPhanLoaiShopee(){
			var data = $(".tp-container.tp-content .layout-future .layout-tab #data");
			var arrayData = data.val().split("\n");

			var type = $(".tp-container.tp-content .layout-future .layout-tab #type").prop("checked");

			var group = $(".tp-container.tp-content .layout-future .layout-tab #group").find("option:selected").index();

			var box = $(".variation-edit-item.version-a").eq(group).find(".option-container .options-item.drag-item");


			if(type){
				var regex = /(\d{1,2}\/\d{1,2})/;

				var result = arrayData.filter(arrayData => !regex.test(arrayData));

				arrayData = result

				var currentList = [];

				$.each(box, (index, value) => {
					var name = box.eq(index).find(".variation-input-item-container.variation-input-item input");
					currentList.push(name.val());
				});

				var unique = arrayData.filter(item => !currentList.some(keyword => item.toLowerCase().includes(keyword.toLowerCase())));

				if(unique.length > 0){
					var ten = unique.join("\n");
					navigator.clipboard.writeText(ten);
					$.each(unique, (index, value) => {
						boxLogging(`Phân loại bị thiếu trong link: ${value}`, [`${value}`], ["orange"]);
					});
				}else{
					var mess = "Đã đủ sản phẩm trong danh sách";
					boxLogging(`${mess}`, [`${mess}`], ["green"]);
				}
			}else{
				$.each(arrayData, (index, value) => {
					var count = 0;
					var keyword = arrayData[index];
					boxLogging(`${keyword}:`, [`${keyword}`], ["crimson"])
					$.each(box, (index, value) => {
						var name = box.eq(index).find(".variation-input-item-container.variation-input-item input");
						if(name.val().includes(keyword)){
							count++;
							boxLogging(`\t${name.val()} (${count})`, [`${name.val()}`], ["green"]);
						}
					})
				})
			}

			boxToast(`Hoàn thành kiểm tra tên phân loại`, "success");
		}

		function setEventThemPhanLoaiNhieuLinkShopee(){
			$(".tp-container.tp-content .layout-future .layout-tab #reporting").on("click", () => {
				baoCaoThemPhanLoai();
			})
		}

		// Thêm phân loại hàng loạt
		async function themPhanLoaiNhieuLinkShopee(){
			var productIds = $(".tp-container.tp-content .layout-future .layout-tab #product-link").val().trim().split("\n").filter(Boolean);
			var variantLines = $(".tp-container.tp-content .layout-future .layout-tab #data").val().trim().split("\n").filter(Boolean);
			var files = $(".tp-container.tp-content .layout-future .layout-tab input[type='file']")[0]?.files || [];
			var inputMap = await makeInputMapFromFileNames(files);
			files = await filesToBase64Array(files);


			localStorage.removeItem("TP-exit");
			saveBatchDataByParts({productIds, variantLines, files, inputMap});
			moveToCurrentProduct();
		}

		// Map hình ảnh tải lên
		async function makeInputMapFromFileNames(fileList) {
			var inputMap = {};
			for (let i = 0; i < fileList.length; i++) {
				var file = fileList[i];
				if (!file) continue;

				var rawName = file.name.split(".")[0]; // "TS-001.jpg" → "TS-001"
				var sku = rawName.trim().toUpperCase();
				var base64 = await fileToBase64(file);
				inputMap[sku] = base64;
			}
			return inputMap;
		}

		// Encode hình ảnh
		async function fileToBase64(file, quality = 0.5) {
			return new Promise((resolve, reject) => {
				var reader = new FileReader();
				reader.onload = function (e) {
					var img = new Image();
					img.onload = function () {
						var canvas = document.createElement("canvas");
						canvas.width = img.width;
						canvas.height = img.height;

						var ctx = canvas.getContext("2d");
						ctx.drawImage(img, 0, 0); // loại bỏ metadata

						// Chuyển thành JPEG và giảm chất lượng
						var base64 = canvas.toDataURL("image/jpeg", quality);
						resolve(base64);
					};
					img.onerror = reject;
					img.src = e.target.result;
				};

				reader.onerror = reject;
				reader.readAsDataURL(file);
			});
		}

		async function filesToBase64Array(files) {
			var results = [];
			for (let i = 0; i < files.length; i++) {
				var base64 = await fileToBase64(files[i]);
				results.push(base64);
			}
			return results;
		}

		async function base64ToFile(base64, filename = "image.jpg") {
			var res = await fetch(base64);
			var blob = await res.blob();
			return new File([blob], filename, { type: blob.type });
		}


		async function saveBatchDataByParts({
			productIds = [],
			variantLines = [],
			files = [],
			inputMap = []
		}) {
			// 1. Lưu ID sản phẩm
			sessionStorage.setItem("batchProductIds", JSON.stringify(productIds));

			// 2. Lưu thông tin phân loại (đã parse)
			var variants = variantLines.map(line => {
				var [name, sku, price, stock] = line.trim().split("\t");
				return { name, sku, price: + price, stock, };
			});
			sessionStorage.setItem("batchVariantData", JSON.stringify(variants));

			// 3. Lưu hình ảnh (chuyển sang base64)
			sessionStorage.setItem("batchVariantImages", JSON.stringify(files));

			// 4. Reset index xử lý
			sessionStorage.setItem("batchIndex", "0");

			// 5. Map hình ảnh
			sessionStorage.setItem("batchInputMap", JSON.stringify(inputMap));

			boxToast("✅ Dữ liệu đã được lưu và đang được xử lý", "success");
		}


		function moveToCurrentProduct() {
			var productIds = JSON.parse(sessionStorage.getItem("batchProductIds") || "[]");
			var variants = JSON.parse(sessionStorage.getItem("batchVariantData") || "[]");
			var images = JSON.parse(sessionStorage.getItem("batchVariantImages") || "[]");
			var index = parseInt(sessionStorage.getItem("batchIndex") || "0");

			if (productIds[index]) {
				var id = productIds[index];

				// Gắn lại ảnh vào từng variant
				var variantsWithImage = variants.map((variant, i) => ({
					...variant,
					image: images[i] || null
				}));

				var product = {
					id,
					variants: variantsWithImage
				};

				sessionStorage.setItem("currentBatchProduct", JSON.stringify(product));
				var nextUrl = `https://banhang.shopee.vn/portal/product/${productIds[index]}`;
				boxToast(`Chuẩn bị điều hướng trong 7s, đừng thao tác trên tab hiện tại nếu không được yêu cầu`);
				setTimeout(() => {
					window.location.href = nextUrl;
				}, 7000)
			} else {
				boxToast(`Đã thêm xong, đang xuất báo cáo`, "success");
				// Xoá session tạm
				sessionStorage.clear();
			}
		}

		// Tạo báo cáo lỗi
		function baoCaoThemPhanLoai() {
			var raw = localStorage.getItem("TP-exit");
			if (!raw) {
				boxLogging("Không tìm thấy dữ liệu trong localStorage.TP-exit", ["localStorage.TP-exit"], ["red"]);
				return;
			}

			let allData;
			try {
				allData = JSON.parse(raw);
			} catch (e) {
				boxLogging("Dữ liệu trong localStorage.TP-exit không hợp lệ JSON", ["JSON"], ["red"]);
				return;
			}

			var items = Object.values(allData);
			if (!items.length) {
				boxLogging("Không có mục nào để báo cáo", ["báo cáo"], ["orange"]);
				return;
			}

			// Tạo bảng với style đẹp
			var table = $(`
				<table style="
					border-collapse: separate;
					border-spacing: 0;
					width: 100%;
					margin: 20px 0;
					font-family: Arial, sans-serif;
					font-size: 14px;
					box-shadow: 0 0 10px rgba(0,0,0,0.1);
					border-radius: 5px;
					overflow: hidden;
					border: 1px solid #ccc;
				">
					<h2 style="text-align: center; font-weight: 700; font-size: 1.5em">Báo Cáo Thêm Phân Loại</h2>
					<thead style="background-color: #f5f5f5;">
						<tr>
							<th style="text-align:center; padding: 10px; border-bottom: 1px solid #ddd;">STT</th>
							<th style="text-align:center; padding: 10px; border-bottom: 1px solid #ddd;">ID</th>
							<th style="text-align:left; padding: 10px; border-bottom: 1px solid #ddd;">Tên</th>
							<th style="text-align:center; padding: 10px; border-bottom: 1px solid #ddd;">SKU</th>
							<th style="text-align:right; padding: 10px; border-bottom: 1px solid #ddd;">Giá</th>
							<th style="text-align:right; padding: 10px; border-bottom: 1px solid #ddd;">Tồn kho</th>
							<th style="text-align:center; padding: 10px; border-bottom: 1px solid #ddd;">Hình ảnh</th>
							<th style="text-align:left; padding: 10px; border-bottom: 1px solid #ddd;">Ghi chú</th>
						</tr>
					</thead>
					<tbody></tbody>
				</table>
			`);

			let stt = 1;
			items.forEach((item) => {
				if (!item.variants) return;

				item.variants.forEach((v, index) => {
					var row = $(`
						<tr style="background-color: ${stt % 2 === 0 ? '#fafafa' : '#ffffff'};">
							<td style="text-align:center; padding: 8px; border-bottom: 1px solid #eee;">${stt++}</td>
							<td class="copyable" style="text-align: center; padding: 8px; border-bottom: 1px silid #eee"><a href="https://banhang.shopee.vn/portal/product/${item.id || Object.keys(item) || "#"}/">${item.id || Object.keys(item) || "Không xác định"}</a></td>
							<td class="copyable" style="text-align:left; padding: 8px; border-bottom: 1px solid #eee;">${v.name}</td>
							<td class="copyable" style="text-align:center; padding: 8px; border-bottom: 1px solid #eee;">${v.sku}</td>
							<td style="text-align:right; padding: 8px; border-bottom: 1px solid #eee;">${v.price.toLocaleString()}</td>
							<td style="text-align:right; padding: 8px; border-bottom: 1px solid #eee;">${v.stock}</td>
							<td style="text-align:center; padding: 8px; border-bottom: 1px solid #eee;">
								<img src="${v.image}" style="max-width: 60px; max-height: 60px; border-radius: 4px; box-shadow: 0 0 3px rgba(0,0,0,0.2);">
							</td>
							<td style="text-align:left; padding: 8px; border-bottom: 1px solid #eee;">${item.note || ""}</td>
						</tr>
					`);
					table.find("tbody").append(row);
				});
			});

			boxPopup(table);

			var totalVariants = items.reduce((sum, item) => sum + (item.variants?.length || 0), 0);
			boxLogging(`Tạo báo cáo với tổng ${totalVariants} biến thể.`, [], ["green"]);
		}

		function processCurrentProduct(callback) {
			var raw = sessionStorage.getItem("currentBatchProduct");
			if (raw) {
				var data = JSON.parse(raw);
				callback(data);
			}
		}

		function moveToNextProduct() {
			var index = parseInt(sessionStorage.getItem("batchIndex") || "0");
			sessionStorage.setItem("batchIndex", (index + 1).toString());
			moveToCurrentProduct();
		}

		// Tự mở danh sách phân loại
		// waitForElement($("body"), ".variation-model-table-footer", (el) => {
		// 	$(el).find("button").click();
		// }, {once: true});

		// Khi trang load và DOM sẵn sàng
		waitForElement($("body"), ".options-item.virtual-options-item", (el) => {
			processCurrentProduct((product) => {

				// 👉 GỌI HÀM CỦA BẠN TẠI ĐÂY
				// ví dụ: addVariants(product.variants);

				setTimeout(kiemTraTrungTenPhanLoaiHangLoatShopee(product), 2000);
			});
		}, { once: true, timeout: 10000 });

		waitForElement($("body"), ".tp-container.tp-content", (el) => {
			var done = localStorage.getItem("DONEADDNEWVARIANTS");
			if(done == true){
				baoCaoThemPhanLoai();
			}
		})

		// Kiểm tra các phân loại trước khi thêm phân loại hàng loạt shopee
		function kiemTraTrungTenPhanLoaiHangLoatShopee(data) {
			var arrayData = data.variants;

			var box = $(".variation-edit-item.version-a").eq(0).find(".option-container .options-item.drag-item");

			var currentList = [];

			// Thu thập các tên phân loại đang hiển thị trên giao diện
			box.each((_, el) => {
				var name = $(el).find(".variation-input-item-container.variation-input-item input").val();
				currentList.push(name.toLowerCase());
			});

			// Phân loại: trùng và chưa trùng
			var uniqueVariants = [];
			var existingVariants = [];

			arrayData.forEach(variant => {
				if (currentList.includes(variant.name.toLowerCase())) {
					existingVariants.push(variant);
				} else {
					uniqueVariants.push(variant);
				}
			});

			// Cập nhật lại chỉ giữ các phân loại mới
			data.variants = uniqueVariants;

			// Gộp phần phân loại trùng
			var exitItem = {
				[data.id]: {
					variants: existingVariants,
					note: "Tên phân loại đã tồn tại"
				}
			};

			var uniqueItem = {
				id: data.id,
				variants: uniqueVariants,
			};

			// Lấy object từ localStorage, đảm bảo hợp lệ
			let existing = {};
			try {
				var stored = localStorage.getItem("TP-exit");
				if (stored && stored !== "undefined") {
					existing = JSON.parse(stored);
				}
			} catch (e) {
				console.warn("❌ TP-exit JSON không hợp lệ, đang khởi tạo lại.");
				localStorage.removeItem("TP-exit");
				existing = {};
			}

			// Gộp dữ liệu mới vào
			deepMergeByKey(existing, data.id, exitItem[data.id]);

			// Lưu lại
			localStorage.setItem("TP-exit", JSON.stringify(existing));

			// Gọi kiểm tra tiếp với phần phân loại chưa trùng
			waitForElement(
				$("body"),
				".variation-model-table-main .eds-scrollbar.middle-scroll-container .eds-scrollbar__content .variation-model-table-body .table-cell-wrapper",
				(el) => {
					kiemTraGiaPhanLoaiHangLoatShopee(uniqueItem);
				},
				{ once: true }
			);
		}

		// Kiểm tra giá phân loại hàng loạt Shopee
		function kiemTraGiaPhanLoaiHangLoatShopee(data) {
			boxAlert("KIEMTRAGIA");
			if (!data || !data.id || !Array.isArray(data.variants)) return;

			var arrayData = data.variants;

			var box = $(".variation-model-table-main .eds-scrollbar.middle-scroll-container .eds-scrollbar__content .variation-model-table-body .table-cell-wrapper");
			var minMax = { min: Infinity, max: 0 };

			box.each((i, el) => {
				var priceInput = $(el).find(".table-cell").eq(0).find("input");
				var price = parseInt(priceInput.val().trim());
				if (isNaN(price)) return;

				var { giaDuoi } = tachGia(price);

				if (!giaDuoi || giaDuoi === 0) return;

				if (giaDuoi < minMax.min) minMax.min = giaDuoi;
			});

			if (!isFinite(minMax.min)) minMax.min = 1000;
			minMax.max = minMax.min * 5;

			console.log(minMax.max);

			var errorVariants = [];
			var dataVariants = [];

			arrayData.forEach(variant => {
				let productPrice = parseInt(variant.price);
				if (isNaN(productPrice)) return;

				var { giaDuoi, giaDau, gia } = tachGia(productPrice);
				if (!giaDuoi || giaDuoi === 0) return;

				// Nếu giá đuôi mới < min hiện tại
				if (giaDuoi < minMax.min) {
					if (giaDuoi * 5 <= minMax.max) {
						minMax.min = giaDuoi;
						minMax.max = giaDuoi * 5;
					} else {
						errorVariants.push(variant);
						return;
					}
				}

				if (gia > minMax.max) {
					var giaDauMoiTam = minMax.max - 1000;

					// Nếu giaDau > 50% của giaDuoi thì giới hạn lại chỉ còn 49% của giaDuoi
					let giaDauMoi = giaDau;
					if (giaDau > giaDuoi * 0.5) {
						giaDauMoi = Math.floor(giaDuoi * 0.49);
					}

					var threshold = Math.max(Math.floor((giaDauMoiTam - giaDuoi) / giaDauMoiTam), 5000);

					if ((giaDauMoiTam - giaDuoi) < threshold) {
						errorVariants.push(variant);
						return;
					} else {
						// Chọn giá đầu nhỏ hơn giữa giaDauMoiTam và giaDauMoi
						var giaDauChot = Math.min(giaDauMoiTam, giaDauMoi);
						var giaMoi = gopGia(giaDauChot, giaDuoi);
						variant.price = giaMoi.gia;
					}
				}
				dataVariants.push(variant);
			});

			// Nếu có lỗi, lưu lại vào localStorage
			if (errorVariants.length > 0) {
				var errorList = {
					[data.id]: {
						variants: errorVariants,
						note: "Sản phẩm cần xem xét lại giá"
					}
				};

				let errorData = {};
				try {
					var stored = localStorage.getItem("TP-exit");
					if (stored && stored !== "undefined") {
						errorData = JSON.parse(stored);
					}
				} catch (e) {
					console.warn("❌ TP-exit JSON không hợp lệ, đang khởi tạo lại.");
					localStorage.removeItem("TP-exit");
					errorData = {};
				}

				deepMergeByKey(errorData, data.id, errorList[data.id]);

				try {
					localStorage.setItem("TP-exit", JSON.stringify(errorData));
				} catch (e) {
					console.error("❌ Lỗi khi lưu TP-exit:", e);
				}
			}

			// Gọi tiếp tục xử lý với dữ liệu hợp lệ
			var dataItem = {
				id: data.id,
				variants: dataVariants
			};

			themPhanLoaiHangLoatShopee(dataItem);
		}

		// Thêm phân loại hàng loạt shopee
		function themPhanLoaiHangLoatShopee(data){
			boxAlert("THEMPHANLOAI");
			console.log(data);
			var group = $(".tp-container .content-layout .layout-tab #group").find("option:selected").index();
			//var box = $(".variation-edit-item.version-a").eq(0).find(".option-container .options-item.drag-item");
			var box = $(".variation-edit-item.version-a").eq(0).find(".option-container .options-item");

			var array = data.variants;

			var arrayData = [], arraySku = [];

			$.each(array, (index, value) => {
				arrayData.push(value.name);
				arraySku.push(value.sku);
			});

			var currentPos = 0;

			function writeValue(){
				if(currentPos >= arrayData.length){
					boxLogging(`Đã thêm phân loại, đang dò SKU...`, [`Đã thêm phân loại, đang dò SKU...`], ["orange"])
					themSKUHangLoatTheoPhanLoaiShopee(data);
					return;
				}

				var inputBox = box.eq(box.length - 1).find("input").trigger("input");

				inputBox.select();
				inputBox.attr("modelValue", arrayData[currentPos]);
				inputBox.val(arrayData[currentPos]);

				if (window.getSelection) {
					window.getSelection().removeAllRanges();
				}else if (document.selection) {
					document.selection.empty();
				}

				if ("createEvent" in document) {
					var evt = document.createEvent("HTMLEvents");
					evt.initEvent("input", false, true);
					$(inputBox).get(0).dispatchEvent(evt);
				}
				else {
					$(inputBox).get(0).fireEvent("oninput");
				}

				currentPos++

				inputBox.blur();

				setTimeout(writeValue, 2000);
			}
			writeValue();
		}

		// Thêm SKU hàng loạt theo tên phân loại shopee
		function themSKUHangLoatTheoPhanLoaiShopee(data){
			var array = data.variants;

			var arrayData = [], arraySku = [];

			$.each(array, (index, value) => {
				arrayData.push(value.name);
				arraySku.push(value.sku);
			});

			var currentPos = 0;
			var box = $(".variation-model-table-main .eds-scrollbar.middle-scroll-container .eds-scrollbar__content .variation-model-table-body .table-cell-wrapper");
			var boxLeft = $(".variation-model-table-fixed-left .variation-model-table-body .table-cell-wrapper");

			function writeValue(){
				if(currentPos >= box.length){
					boxLogging(`Đã thêm SKU`, [`Đã thêm SKU`], ["green"]);
					suaGiaSKUHangLoatShopee(data);
					return;
				}

				var name = boxLeft.eq(currentPos).find(".table-cell.first-variation-cell")
				var nameProduct = name.contents()
					.filter(function() {
						return this.nodeType === 3; // chỉ lấy text thuần
					})[0]?.nodeValue.trim();
				var skuBox = box.eq(currentPos).find(".table-cell").eq(2).find("textarea");
				var priceBox = box.eq(currentPos).find(".table-cell").eq(0).find("input");
				var stockBox = box.eq(currentPos).find(".table-cell").eq(1).find("input");

				if(arrayData.includes(nameProduct)){


					var pos = arrayData.indexOf(nameProduct);
					skuBox.attr("modelValue", arraySku[pos]);
					skuBox.val(arraySku[pos]).trigger("input");

					if (window.getSelection) {
						window.getSelection().removeAllRanges();
					}else if (document.selection) {
						document.selection.empty();
					}

					if ("createEvent" in document) {
						var evt = document.createEvent("HTMLEvents");
						evt.initEvent("input", false, true);
						$(skuBox).get(0).dispatchEvent(evt);
					}
					else {
						$(skuBox).get(0).fireEvent("oninput");
					}

					// simulateReactInput(stockBox, "0");
				}

				currentPos++;

				setTimeout(writeValue, 10);
			}
			writeValue();
		}

		// Sửa giá theo SKU hàng loạt shopee
		function suaGiaSKUHangLoatShopee(data){
			var array = data.variants;
			$.each(array, (index, value) => {
				var sku = value.sku;
				var gia = value.price.toString();
				var stock = value.stock.toString();

				var box = $(".variation-model-table-main .eds-scrollbar.middle-scroll-container .eds-scrollbar__content .variation-model-table-body .table-cell-wrapper");

				$.each(box, (index, value) => {
					var priceBox = box.eq(index).find(".table-cell").eq(0).find("input");
					var stockBox = box.eq(index).find(".table-cell").eq(1).find("input");
					var skuBox = box.eq(index).find(".table-cell").eq(2).find("textarea");

					if(skuBox.val().includes(sku)){
						var priceBox1 = priceBox.val().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || "Không";
						var gia1 = gia.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
						boxAlert(`Giá của ${sku} đã sửa từ ${priceBox1} => ${gia1}`);
						boxLogging(`Giá của ${sku} đã sửa từ ${priceBox1} => ${gia1}`, [`${sku}`, `${priceBox1}`, `${gia1}`], ["crimson", "orange", "orange"]);

						if(parseInt(priceBox.val()) < parseInt(gia)){
							boxLogging(`SKU: ${sku} có giá mới cao hơn giá hiện tại`, [`${sku}`], ["crimson"]);
							box.eq(index).css("background", "crimson");
						}else
							box.eq(index).css("background", "lightgreen");

						priceBox.select();
						simulateReactInput(priceBox, gia);
						priceBox.val(gia);

						if (window.getSelection) {
							window.getSelection().removeAllRanges();
						}else if (document.selection) {
							document.selection.empty();
						}

						if ("createEvent" in document) {
							var evt = document.createEvent("HTMLEvents");
							evt.initEvent("change", false, true);
							$(priceBox).get(0).dispatchEvent(evt);
						}
						else {
							$(priceBox).get(0).fireEvent("onchange");
						}

						// stockBox.click();

						// var wareHouse = $(".multi-warehouse-stock-edit");

						// var wareHouseStock = wareHouse.find(".stock-edit .stock-table .eds-table__body-container .eds-table__main-body .eds-scrollbar__content table tbody tr");

						// $.each(wareHouseStock, (index, value) => {
						// 	var nameWareHouse = $(value).find(".td").eq(0).find(".stock-edit-name .eds-popover__ref");
						// 	var stockWareHouse = $(value).find(".td").eq(1).find(".product-edit-form-item input");

						// 	if(nameWareHouse.includes("KHO 77")){
						// 		simulateReactInput(stockWareHouse, stock);
						// 	}
						// })
					}
				});
			});
			themAnhPhanLoaiHangLoatShopee(data);
		}

		// Thêm ảnh phân loại hàng loạt Shopee – từ sessionStorage.batchInputMap
		function themAnhPhanLoaiHangLoatShopee(data){
			var inputMap = JSON.parse(sessionStorage.getItem("batchInputMap") || "{}");

			var box = $(".variation-model-table-main .eds-scrollbar.middle-scroll-container .eds-scrollbar__content .variation-model-table-body .table-cell-wrapper");
			var boxLeft = $(".variation-model-table-fixed-left .variation-model-table-body .table-cell-wrapper");

			var clickInput = false;

			$.each(data.variants, (index, valueData) => {
				valueData = valueData;

				$.each(box, async (index, valueBox) => {
					var skuBox = box.eq(index).find(".table-cell").eq(2).find("textarea");
					var imgInputShopee = boxLeft.eq(index).find(".table-cell").eq(0).find("input[type=file]")[0];
					var sku = skuBox.val().trim().toUpperCase();

					if(sku.includes(valueData.sku.toUpperCase())){
						var img = valueData.image;
						var file = await base64ToFile(img, `${valueData.sku}.jpg`);("input[type=file]")[0];

						var dt = new DataTransfer();
						dt.items.add(file);

						// Click input 1 lần để React ghi nhận focus
						if (!clickInput) {
							imgInputShopee.click();
							clickInput = true;
						}

						setTimeout(() => {
							imgInputShopee.files = dt.files;

							var evt = new Event("change", { bubbles: true });
							imgInputShopee.dispatchEvent(evt);


						}, 100);
					} else {
						console.warn(`⚠️ Không tìm thấy ảnh cho SKU: ${sku}`);
					};
				});
			});

			$(document).blur();
			//kiemTraPhanLoaiHangLoatShopee();
			// ✅ Khi xử lý xong:
			setTimeout(saveProduct, 3000);
			moveToNextProduct();
		}

		// Lưu sản phẩm sau khi thêm phân loại
		function saveProduct(){
			$("body").focus();
			var button = $(".shopee-fix-bottom-card.product-selected-fix .eds-button.eds-button--primary.eds-button--normal.eds-button--xl-large");
			button.trigger("click");

			setTimeout(() => {
				var box = $(".eds-modal").last();
				box.find(".eds-modal__footer button").last().trigger("click");
			}, 2000)

			setTimeout(moveToNextProduct,3000);
		}

		// Gộp file excel
		async function mergeExcelFile() {
			const input = document.getElementById("mergeFileInput");
			const descriptionRowsCount = parseInt(document.getElementById("descriptionRowsCount").value);
			const headerRowsCount = 1;

			if (!input.files.length || input.files.length < 2) {
				boxToast("Vui lòng chọn từ 2 file Excel trở lên để gộp.", "warning");
				return;
			}

			const actualHeaderRowIndex = descriptionRowsCount + 1;
			const startDataRowIndex = actualHeaderRowIndex + headerRowsCount;

			const allUniqueHeaders = new Map();
			let finalColumnOrder = [];
			const processedHeaders = new Set();
			const mergedColumnWidths = new Map();
			const mergedMerges = new Set();
			const mergedDataRowsMap = new Map();
			const mergedAuxiliaryHeaderRows = Array.from({ length: descriptionRowsCount }, () => []);
			const finalHeaderMap = new Map();


			// --- BƯỚC 1: Xử lý file đầu tiên để thiết lập cấu trúc cột và header phụ ban đầu ---
			let firstFile = input.files[0];
			let firstBuffer = null;
			let firstWorkbook = null;
			let firstOriginalSheet = null;

			try {
				firstBuffer = await firstFile.arrayBuffer();
				firstWorkbook = new ExcelJS.Workbook();
				await firstWorkbook.xlsx.load(firstBuffer);
				firstOriginalSheet = firstWorkbook.worksheets[0];

				if (!firstOriginalSheet) {
					boxToast(`File ${firstFile.name} không có sheet nào. Vui lòng kiểm tra lại.`, "error");
					return;
				}

				for (let r = 1; r <= descriptionRowsCount; r++) {
					const rowValues = firstOriginalSheet.getRow(r).values;
					if (rowValues) {
						mergedAuxiliaryHeaderRows[r - 1] = rowValues.slice(1);
					} else {
						mergedAuxiliaryHeaderRows[r - 1] = [];
					}
				}

				const headerRowValues = firstOriginalSheet.getRow(actualHeaderRowIndex).values;
				const firstFileDataHeaders = headerRowValues ? headerRowValues.slice(1).map(h => String(h || '').trim()) : [];

				firstFileDataHeaders.forEach(headerText => {
					if (headerText) {
						const lowerCaseHeader = headerText.toLowerCase();
						allUniqueHeaders.set(lowerCaseHeader, headerText);
						if (!processedHeaders.has(lowerCaseHeader)) {
							finalColumnOrder.push(headerText);
							processedHeaders.add(lowerCaseHeader);
						}
					}
				});

				finalColumnOrder.forEach((headerText, index) => {
					finalHeaderMap.set(headerText.toLowerCase(), index);
				});

				const firstFileHeaderRow = firstOriginalSheet.getRow(actualHeaderRowIndex);
				firstOriginalSheet.columns.forEach((column, colIndex) => {
					const cellColIndex = colIndex + 1;
					if (column.width) {
						const headerCell = firstFileHeaderRow.getCell(cellColIndex);
						const headerText = String(headerCell.value || '').trim();
						if (headerText) {
							const lowerCaseHeader = headerText.toLowerCase();
							mergedColumnWidths.set(lowerCaseHeader, column.width);
						}
					}
				});

				if (firstOriginalSheet._merges) {
					Object.keys(firstOriginalSheet._merges).forEach(mergeRange => {
						const [startRow, startCol, endRow, endCol] = parseMergeRange(mergeRange);
						if (startRow >= 1 && startRow <= descriptionRowsCount && endRow <= descriptionRowsCount) {
							mergedMerges.add(mergeRange);
						}
					});
				}

				for (let r = startDataRowIndex; r <= firstOriginalSheet.rowCount; r++) {
					const rowValues = firstOriginalSheet.getRow(r).values;
					const originalDataRowValues = rowValues ? rowValues.slice(1) : [];

					const tempMappedRowValues = new Array(finalColumnOrder.length).fill(undefined);
					originalDataRowValues.forEach((cellValue, originalIndex) => {
						const headerText = firstFileDataHeaders[originalIndex];
						if (headerText) {
							const finalIndex = finalHeaderMap.get(headerText.toLowerCase());
							if (finalIndex !== undefined) {
								tempMappedRowValues[finalIndex] = cellValue;
							}
						}
					});

					const primaryKeyColIndex = 0;
					const primaryKey = normalizeCellValue(tempMappedRowValues[primaryKeyColIndex]);

					if (primaryKey === '') {
						if (!mergedDataRowsMap.has('__NO_PRIMARY_KEY__')) {
							mergedDataRowsMap.set('__NO_PRIMARY_KEY__', []);
						}
						mergedDataRowsMap.get('__NO_PRIMARY_KEY__').push([...tempMappedRowValues]);
					} else {
						if (!mergedDataRowsMap.has(primaryKey)) {
							mergedDataRowsMap.set(primaryKey, []);
						}
						mergedDataRowsMap.get(primaryKey).push([...tempMappedRowValues]);
					}
				}
			} catch (error) {
				boxToast(`Lỗi khi đọc file đầu tiên (${firstFile.name}): ${error.message}`, "error");
				console.error(`Error processing first file ${firstFile.name}:`, error);
				return;
			} finally {
				// LOẠI BỎ firstWorkbook.destroy() VÀ ĐẢM BẢO KHÔNG CÒN THAM CHIẾU
				if (firstWorkbook) {
					firstWorkbook.eachSheet(sheet => firstWorkbook.removeWorksheet(sheet.id));
					// firstWorkbook.destroy(); // <--- Dòng này đã bị xóa
					firstWorkbook = null;
					firstBuffer = null;
					firstOriginalSheet = null;
				}
			}


			// --- BƯỚC 2: Duyệt qua từng file còn lại và gộp dữ liệu vào các cấu trúc đã có ---
			for (let i = 1; i < input.files.length; i++) {
				const currentFile = input.files[i];
				let currentBuffer = null;
				let currentWorkbook = null;
				let originalSheet = null;

				try {
					currentBuffer = await currentFile.arrayBuffer();
					currentWorkbook = new ExcelJS.Workbook();
					await currentWorkbook.xlsx.load(currentBuffer);
					originalSheet = currentWorkbook.worksheets[0];

					if (!originalSheet) {
						console.warn(`File ${currentFile.name} không có sheet chính nào (worksheet[0]). Bỏ qua.`);
						continue;
					}

					const headerRowValues = originalSheet.getRow(actualHeaderRowIndex).values;
					const currentFileHeaders = headerRowValues ? headerRowValues.slice(1).map(h => String(h || '').trim()) : [];

					currentFileHeaders.forEach(headerText => {
						if (headerText) {
							const lowerCaseHeader = headerText.toLowerCase();
							allUniqueHeaders.set(lowerCaseHeader, headerText);
							if (!processedHeaders.has(lowerCaseHeader)) {
								finalColumnOrder.push(headerText);
								processedHeaders.add(lowerCaseHeader);
							}
						}
					});

					finalColumnOrder.forEach((headerText, index) => {
						finalHeaderMap.set(headerText.toLowerCase(), index);
					});

					for (let r = 1; r <= descriptionRowsCount; r++) {
						const currentAuxRowValues = originalSheet.getRow(r).values;
						if (!currentAuxRowValues) continue;

						const trimmedAuxRowValues = currentAuxRowValues.slice(1);

						let targetAuxRow = mergedAuxiliaryHeaderRows[r - 1];
						if (!targetAuxRow) {
							targetAuxRow = new Array(finalColumnOrder.length).fill(undefined);
							mergedAuxiliaryHeaderRows[r - 1] = targetAuxRow;
						} else if (targetAuxRow.length < finalColumnOrder.length) {
							targetAuxRow = targetAuxRow.concat(new Array(finalColumnOrder.length - targetAuxRow.length).fill(undefined));
							mergedAuxiliaryHeaderRows[r - 1] = targetAuxRow;
						}

						trimmedAuxRowValues.forEach((cellValue, originalColIndex) => {
							const headerTextForCol = currentFileHeaders[originalColIndex];
							if (headerTextForCol) {
								const finalColIndexForAux = finalHeaderMap.get(headerTextForCol.toLowerCase());
								if (finalColIndexForAux !== undefined) {
									const existingValue = targetAuxRow[finalColIndexForAux];
									if (existingValue === undefined || existingValue === null || String(existingValue).trim() === '' ||
										(cellValue !== undefined && cellValue !== null && String(cellValue).trim() !== '')) {
										targetAuxRow[finalColIndexForAux] = cellValue;
									}
								}
							}
						});
					}

					if (originalSheet._merges) {
						Object.keys(originalSheet._merges).forEach(mergeRange => {
							const [startRow, startCol, endRow, endCol] = parseMergeRange(mergeRange);
							if (startRow >= 1 && startRow <= descriptionRowsCount && endRow <= descriptionRowsCount) {
								mergedMerges.add(mergeRange);
							}
						});
					}

					const currentFileHeaderRow = originalSheet.getRow(actualHeaderRowIndex);
					originalSheet.columns.forEach((column, colIndex) => {
						const cellColIndex = colIndex + 1;
						if (column.width) {
							const headerCell = currentFileHeaderRow.getCell(cellColIndex);
							const headerText = String(headerCell.value || '').trim();
							if (headerText) {
								const lowerCaseHeader = headerText.toLowerCase();
								const existingWidth = mergedColumnWidths.get(lowerCaseHeader) || 0;
								if (column.width > existingWidth) {
									mergedColumnWidths.set(lowerCaseHeader, column.width);
								}
							}
						}
					});

					for (let r = startDataRowIndex; r <= originalSheet.rowCount; r++) {
						const rowValues = originalSheet.getRow(r).values;
						const originalDataRowValues = rowValues ? rowValues.slice(1) : [];
						const tempMappedRowValues = new Array(finalColumnOrder.length).fill(undefined);

						originalDataRowValues.forEach((cellValue, originalIndex) => {
							const headerText = currentFileHeaders[originalIndex];
							if (headerText) {
								const finalIndex = finalHeaderMap.get(headerText.toLowerCase());
								if (finalIndex !== undefined) {
									tempMappedRowValues[finalIndex] = cellValue;
								}
							}
						});

						const primaryKeyColIndex = 0;
						const primaryKey = normalizeCellValue(tempMappedRowValues[primaryKeyColIndex]);

						if (primaryKey === '') {
							if (!mergedDataRowsMap.has('__NO_PRIMARY_KEY__')) {
								mergedDataRowsMap.set('__NO_PRIMARY_KEY__', []);
							}
							mergedDataRowsMap.get('__NO_PRIMARY_KEY__').push([...tempMappedRowValues]);
						} else {
							let foundMatch = false;
							const possibleMatches = mergedDataRowsMap.get(primaryKey);

							if (possibleMatches && possibleMatches.length > 0) {
								for (const existingRowReference of possibleMatches) {
									if (isSameRecord(existingRowReference, tempMappedRowValues, finalHeaderMap, currentFileHeaders)) {
										tempMappedRowValues.forEach((valueToCopy, finalIndex) => {
											if (valueToCopy !== null && valueToCopy !== undefined && normalizeCellValue(valueToCopy) !== '') {
												existingRowReference[finalIndex] = valueToCopy;
											}
										});
										foundMatch = true;
										break;
									}
								}
							}

							if (!foundMatch) {
								if (!mergedDataRowsMap.has(primaryKey)) {
									mergedDataRowsMap.set(primaryKey, []);
								}
								mergedDataRowsMap.get(primaryKey).push([...tempMappedRowValues]);
							}
						}
					}
				} catch (error) {
					boxToast(`Lỗi khi đọc file ${currentFile.name}: ${error.message}`, "error");
					console.error(`Error processing file ${currentFile.name}:`, error);
				} finally {
					// LOẠI BỎ currentWorkbook.destroy() VÀ ĐẢM BẢO KHÔNG CÒN THAM CHIẾU
					if (currentWorkbook) {
						currentWorkbook.eachSheet(sheet => currentWorkbook.removeWorksheet(sheet.id));
						// currentWorkbook.destroy(); // <--- Dòng này đã bị xóa
						currentWorkbook = null;
						currentBuffer = null;
						originalSheet = null;
					}
				}
			}

			// --- Giai đoạn FINALIZE: Ghi dữ liệu đã gộp vào Workbook đích ---
			const newWorkbook = new ExcelJS.Workbook();
			let targetSheet = newWorkbook.addWorksheet("Merged Data");

			mergedAuxiliaryHeaderRows.forEach((rowValues, index) => {
				const targetRow = targetSheet.getRow(index + 1);
				let valuesToSet = [...rowValues];
				if (valuesToSet.length < finalColumnOrder.length) {
					valuesToSet = valuesToSet.concat(new Array(finalColumnOrder.length - valuesToSet.length).fill(undefined));
				}
				targetRow.values = [undefined, ...valuesToSet];
			});

			const targetHeaderRow = targetSheet.getRow(actualHeaderRowIndex);
			targetHeaderRow.values = [undefined, ...finalColumnOrder];

			const mergedDataRowsFinal = [];
			mergedDataRowsMap.forEach((rows, key) => {
				if (key !== '__NO_PRIMARY_KEY__') {
					mergedDataRowsFinal.push(...rows);
				}
			});
			if (mergedDataRowsMap.has('__NO_PRIMARY_KEY__')) {
				mergedDataRowsFinal.push(...mergedDataRowsMap.get('__NO_PRIMARY_KEY__'));
			}

			mergedDataRowsFinal.forEach((rowValues) => {
				targetSheet.addRow([undefined, ...rowValues]);
			});

			mergedMerges.forEach(mergeRange => {
				try {
					targetSheet.mergeCells(mergeRange);
				} catch (e) {
					console.warn(`Could not apply merge ${mergeRange} to final sheet. Error: ${e.message}`);
				}
			});

			mergedColumnWidths.forEach((width, headerTextLower) => {
				const colIndex = finalHeaderMap.get(headerTextLower);
				if (colIndex !== undefined) {
					const targetColumn = targetSheet.getColumn(colIndex + 1);
					if (targetColumn) {
						targetColumn.width = width;
					}
				}
			});

			// --- Xử lý các sheet phụ từ tất cả các file nguồn ---
			for (let i = 0; i < input.files.length; i++) {
				const currentFile = input.files[i];
				let currentWorkbook = null;

				try {
					const currentBuffer = await currentFile.arrayBuffer();
					currentWorkbook = new ExcelJS.Workbook();
					await currentWorkbook.xlsx.load(currentBuffer);

					for (let j = 1; j < currentWorkbook.worksheets.length; j++) {
						const originalOtherSheet = currentWorkbook.worksheets[j];
						let newSheetName = originalOtherSheet.name;

						let counter = 1;
						while (newWorkbook.worksheets.some(ws => ws.name === newSheetName)) {
							newSheetName = `${originalOtherSheet.name}_${counter++}`;
						}
						if (newSheetName === "Merged Data") {
							newSheetName = `${originalOtherSheet.name}_${currentFile.name.replace(/\.xlsx$/i, '')}_copy`;
							let innerCounter = 1;
							while (newWorkbook.worksheets.some(ws => ws.name === newSheetName)) {
								newSheetName = `${originalOtherSheet.name}_${currentFile.name.replace(/\.xlsx$/i, '')}_copy${innerCounter++}`;
							}
						}

						console.log(`Adding new sheet: ${newSheetName} from file ${currentFile.name}`);
						const newSheet = newWorkbook.addWorksheet(newSheetName);

						originalOtherSheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
							const newRow = newSheet.getRow(rowNumber);
							copyRow(row, newRow);
						});

						if (originalOtherSheet._merges) {
							Object.keys(originalOtherSheet._merges).forEach(mergeRange => {
								try {
									newSheet.mergeCells(mergeRange);
								} catch (e) {
									console.warn(`Could not merge cells ${mergeRange} in new sheet (${newSheetName}). Error: ${e.message}`);
								}
							});
						}
						originalOtherSheet.columns.forEach((column, colIndex) => {
							if (column.width) {
								const newSheetColumn = newSheet.getColumn(colIndex + 1);
								if (newSheetColumn) {
									newSheetColumn.width = column.width;
								}
							}
						});
					}
				} catch (error) {
					console.warn(`Error processing auxiliary sheets from file ${currentFile.name}: ${error.message}`);
				} finally {
					// LOẠI BỎ currentWorkbook.destroy() VÀ ĐẢM BẢO KHÔNG CÒN THAM CHIẾU
					if (currentWorkbook) {
						currentWorkbook.eachSheet(sheet => currentWorkbook.removeWorksheet(sheet.id));
						// currentWorkbook.destroy(); // <--- Dòng này đã bị xóa
						currentWorkbook = null;
					}
				}
			}


			// --- Ghi workbook đã gộp ra file ---
			try {
				const buffer = await newWorkbook.xlsx.writeBuffer();
				saveAs(new Blob([buffer], { type: "application/octet-stream" }), "merged_excel_file.xlsx");
				boxToast(`Đã gộp file Excel thành công!`, "success");
			} catch (error) {
				boxToast(`Lỗi khi ghi file Excel: ${error.message}`, "error");
				console.error("Error writing merged Excel file:", error);
			} finally {
				// LOẠI BỎ newWorkbook.destroy() VÀ ĐẢM BẢO KHÔNG CÒN THAM CHIẾU
				if (newWorkbook) {
					newWorkbook.eachSheet(sheet => newWorkbook.removeWorksheet(sheet.id));
					// newWorkbook.destroy(); // <--- Dòng này đã bị xóa
				}
			}
		}

		// Tách file excel
		async function splitExcelFile() {
			var input = document.getElementById("fileInput");
			var rowsPerFile = parseInt(document.getElementById("rowsPerFile").value);
			var rowsToPreserve = parseInt(document.getElementById("rowsToPreserve").value);

			if (!input.files.length) {
				alert("Vui lòng chọn file Excel.");
				return;
			}

			var file = input.files[0];
			var buffer = await file.arrayBuffer();

			var workbook = new ExcelJS.Workbook();
			await workbook.xlsx.load(buffer);

			var originalSheet = workbook.worksheets[0];
			var totalRows = originalSheet.rowCount;

			var zip = new JSZip();
			var headerRows = [];
			for (var i = 1; i <= rowsToPreserve; i++) {
				headerRows.push(originalSheet.getRow(i));
			}

			var chunkIndex = 1;
			for (i = rowsToPreserve + 1; i <= totalRows; i += rowsPerFile) {
				var newWorkbook = new ExcelJS.Workbook();
				var newSheet = newWorkbook.addWorksheet("Sheet1");

				// Copy header
				for (var h = 0; h < headerRows.length; h++) {
					copyRow(headerRows[h], newSheet.getRow(h + 1));
				}

				// Copy data chunk
				var chunkEnd = Math.min(i + rowsPerFile - 1, totalRows);
				var rowIndex = rowsToPreserve + 1;

				for (var j = i; j <= chunkEnd; j++) {
					var originalRow = originalSheet.getRow(j);
					var newRow = newSheet.getRow(rowIndex++);
					copyRow(originalRow, newRow);
				}

				// Copy merged cells (chỉ phần header)
				if (originalSheet._merges) {
					Object.keys(originalSheet._merges).forEach((mergeRange) => {
					var [startRow] = mergeRange.match(/\d+/g).map(Number);
					if (startRow <= rowsToPreserve) {
						newSheet.mergeCells(mergeRange);
					}
					});
				}

				var xlsxBuffer = await newWorkbook.xlsx.writeBuffer();
				zip.file(`part_${chunkIndex++}.xlsx`, xlsxBuffer);
			}

			zip.generateAsync({ type: "blob" }).then(function (content) {
				saveAs(content, "splitted_excel.zip");
			});

			boxToast(`Đã chia nhỏ file excel thành công`, "success");
		}

		/**
		 * Chuyển đổi một chuỗi cột (ví dụ: "A", "AB") thành số cột (1-indexed).
		 * Ví dụ: "A" -> 1, "Z" -> 26, "AA" -> 27.
		 * @param {string} colStr Chuỗi chữ cái của cột.
		 * @returns {number} Số cột (1-indexed).
		 */
		function decodeColumn(colStr) {
			let col = 0;
			for (let i = 0; i < colStr.length; i++) {
				col = col * 26 + (colStr.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
			}
			return col;
		}

		/**
		 * Chuyển đổi một số cột (1-indexed) thành chuỗi chữ cái của cột.
		 * Ví dụ: 1 -> "A", 26 -> "Z", 27 -> "AA".
		 * @param {number} colNumber Số cột (1-indexed).
		 * @returns {string} Chuỗi chữ cái của cột.
		 */
		function encodeColumn(colNumber) {
			let result = '';
			while (colNumber > 0) {
				let remainder = (colNumber - 1) % 26;
				result = String.fromCharCode(65 + remainder) + result;
				colNumber = Math.floor((colNumber - 1) / 26);
			}
			return result;
		}

		/**
		 * Chuyển đổi một địa chỉ ô Excel (ví dụ: "A1", "AB10") thành một đối tượng { row, col }.
		 * @param {string} address Chuỗi địa chỉ ô Excel.
		 * @returns {{row: number, col: number}} Đối tượng chứa số hàng và số cột (1-indexed).
		 */
		function decodeCell(address) {
			let colPart = '';
			let rowPart = '';

			// Tách phần chữ (cột) và phần số (hàng) từ địa chỉ
			for (let i = 0; i < address.length; i++) {
				const char = address[i];
				if (char >= 'A' && char <= 'Z') {
					colPart += char;
				} else if (char >= '0' && char <= '9') {
					rowPart += char;
				}
			}

			const col = decodeColumn(colPart);
			const row = parseInt(rowPart, 10);

			return { row: row, col: col };
		}

		/**
		 * Chuyển đổi tọa độ hàng và cột thành địa chỉ ô Excel (ví dụ: 1, 1 -> "A1").
		 * @param {number} row Số hàng (1-indexed).
		 * @param {number} col Số cột (1-indexed).
		 * @returns {string} Chuỗi địa chỉ ô Excel.
		 */
		function encodeCell(row, col) {
			return encodeColumn(col) + row;
		}

		/**
		 * Phân tích một chuỗi phạm vi ô Excel (ví dụ: "A1:B2") thành một mảng tọa độ số.
		 * @param {string} range Chuỗi phạm vi ô Excel.
		 * @returns {[number, number, number, number]} Mảng [startRow, startCol, endRow, endCol].
		 * Trả về [0, 0, 0, 0] nếu phạm vi không hợp lệ.
		 */
		function parseMergeRange(range) {
			if (typeof range !== 'string' || range.trim() === '') {
				console.warn(`Invalid merge range input: '${range}'. Returning default coordinates.`);
				return [0, 0, 0, 0];
			}

			const cells = range.split(':');

			if (cells.length < 1 || cells[0].trim() === '') { // Thêm kiểm tra cho cells[0] rỗng
				console.warn(`Incomplete or empty merge range: '${range}'. Returning default coordinates.`);
				return [0, 0, 0, 0];
			}

			const startCellStr = cells[0].trim();
			let endCellStr = startCellStr; // Mặc định endCellStr là startCellStr nếu chỉ có 1 ô

			if (cells.length >= 2 && cells[1].trim() !== '') {
				endCellStr = cells[1].trim();
			}

			const startCellCoords = decodeCell(startCellStr);
			const endCellCoords = decodeCell(endCellStr);

			return [startCellCoords.row, startCellCoords.col, endCellCoords.row, endCellCoords.col];
		}

		/**
		 * Normalize cell value for comparison (e.g., trim strings, convert to string).
		 * @param {*} value Cell value.
		 * @returns {string} Normalized string value.
		 */
		function normalizeCellValue(value) {
			if (value === null || value === undefined) {
				return '';
			}
			if (typeof value === 'object' && value.richText) {
				return value.richText.map(text => text.text).join('').trim();
			}
			return String(value).trim();
		}

		/**
		 * So sánh hai bản ghi để xác định xem chúng có phải là cùng một bản ghi dựa trên các cột chung.
		 * @param {Array<*>} row1 Dòng dữ liệu thứ nhất.
		 * @param {Array<*>} row2 Dòng dữ liệu thứ hai.
		 * @param {Map<string, number>} finalHeaderMap Bản đồ từ tên header chuẩn hóa đến index cột cuối cùng.
		 * @param {Array<string>} currentFileHeaders Các header của file hiện tại đang được xử lý.
		 * @returns {boolean} True nếu là cùng một bản ghi, ngược lại False.
		 */
		function isSameRecord(row1, row2, finalHeaderMap, currentFileHeaders) {
			// Chỉ so sánh các cột đã có trong finalHeaderMap (tức là các cột chung)
			for (const [headerTextLower, finalIndex] of finalHeaderMap.entries()) {
				// Tìm index của header này trong currentFileHeaders
				const originalIndex = currentFileHeaders.findIndex(h => normalizeCellValue(h).toLowerCase() === headerTextLower);

				// Nếu header này có trong file hiện tại (originalIndex !== -1) VÀ
				// cả hai hàng đều có giá trị ở cột này (không phải undefined/null)
				if (originalIndex !== -1 &&
					row1[finalIndex] !== undefined && row1[finalIndex] !== null &&
					row2[finalIndex] !== undefined && row2[finalIndex] !== null) {

					// So sánh giá trị
					if (normalizeCellValue(row1[finalIndex]) !== normalizeCellValue(row2[finalIndex])) {
						return false; // Khác nhau ở cột chung -> không phải cùng bản ghi
					}
				}
			}
			return true; // Tất cả các cột chung đều giống nhau hoặc một trong hai không có giá trị
		}

		/**
		 * Chuyển đổi tọa độ số thành chuỗi phạm vi ô Excel (ví dụ: 1, 1, 2, 2 -> "A1:B2").
		 * @param {number} startRow Số hàng bắt đầu (1-indexed).
		 * @param {number} startCol Số cột bắt đầu (1-indexed).
		 * @param {number} endRow Số hàng kết thúc (1-indexed).
		 * @param {number} endCol Số cột kết thúc (1-indexed).
		 * @returns {string} Chuỗi phạm vi ô Excel.
		 */
		function encodeRange(startRow, startCol, endRow, endCol) {
			const startCellAddress = encodeCell(startRow, startCol);
			const endCellAddress = encodeCell(endRow, endCol);
			return `${startCellAddress}:${endCellAddress}`;
		}

		function copyRow(sourceRow, targetRow) {
			targetRow.height = sourceRow.height;

			// Kiểm tra xem dòng có bị ẩn không và ẩn nó lại trong sheet mới
			if (sourceRow.hidden) {
			targetRow.hidden = true;
			}

			sourceRow.eachCell({ includeEmpty: true }, function (cell, colNumber) {
			var targetCell = targetRow.getCell(colNumber);
			targetCell.value = cell.value;

			// Deep clone style
			targetCell.style = JSON.parse(JSON.stringify(cell.style || {}));

			if (cell.master && cell !== cell.master) {
				targetCell.value = cell.master.value;
			}
			});
		}

		// Thêm phân loại Lazada
		function themPhanLoaiLazada() {
			var group = $(".tp-container.tp-content .layout-future .layout-tab #group").index();
			var box = $(".sale-prop-body .next-formily-item").eq(group).find(".prop-option-list .next-form-item.form-item-prop-option-item");

			var data = $(".tp-container.tp-content .layout-future .layout-tab #data");
			var array = data.val().split("\n");

			var arrayData = [], arraySku = [];

			$.each(array, (index, value) => {
				value = value.split("\t");
				arrayData.push(value[0]);
				arraySku.push(value[1]);
			});

			var currentPos = 0;

			function writeData() {
				// lấy lại input mới nhất mỗi lần
				var boxList = $(".sale-prop-body .next-formily-item").eq(0).find(".prop-option-list .next-form-item.form-item-prop-option-item");
				var inputBox = boxList.eq(boxList.length - 1).find(".prop-option-item .item-textbox input");

				if (!inputBox.length) {
					console.warn('Không tìm thấy input tại vị trí:', currentPos);
					return;
				}

				simulatePaste(inputBox, arrayData[currentPos], 0, () => {
					//console.log("✔ Thêm:", arrayData[currentPos]);

					currentPos++;

					if (currentPos >= arrayData.length){
						boxLogging(`Đã thêm phân loại, đang thêm SKU`, [`Đã thêm phân loại, đang thêm SKU`], [`lightgreen`]);
						setTimeout(themSKUTheoPhanLoaiLazada,1000);
						return;
					}

					// chờ ô mới xuất hiện rồi tiếp tục
					setTimeout(writeData, 300); // tuỳ sàn, có thể tăng lên 500ms nếu render chậm
				});

				inputBox.blur(); // để kích hoạt sự kiện thêm ô mới
			}

			writeData();
		}

		// Cập nhật giá đuôi Tiktok
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
						if(!activeStatus.attr("aria-checked"))
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

								promotionPrice.get(0).scrollIntoView({ behavior: 'smooth', block: 'center' });

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

		// Sao chép chương trình flash sale
		function setEventSaoChepFlashSaleTiktok(){
			$(".add-promotion").on("click", () => {
				var box = $(".area-promotion").append($(".box-promotion.root").clone(true).removeClass("root").css("display", "flex"));
				var timeStartInput = box.find(".time-start");
				var timeEndInput = box.find(".time-end"); // Thêm selector cho input end time

				// Lấy thời gian hiện tại theo định dạng YYYY-MM-DDTHH:mm
				var now = new Date();
				var year = now.getFullYear();
				var month = String(now.getMonth() + 1).padStart(2, '0');
				var day = String(now.getDate()).padStart(2, '0');
				var hours = String(now.getHours()).padStart(2, '0');
				var minutes = String(parseInt(now.getMinutes()) + 5).padStart(2, '0');

				var currentTimeFormatted = `${year}-${month}-${day}T${hours}:${minutes}`;

				// Gán giá trị hiện tại cho input time-start
				timeStartInput.val(currentTimeFormatted);

				// Nếu bạn muốn gán một giá trị mặc định khác cho time-end, bạn có thể làm tương tự
				// Ví dụ: đặt thời gian kết thúc sau 1 tiếng
				var oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
				var endYear = oneHourLater.getFullYear();
				var endMonth = String(oneHourLater.getMonth() + 1).padStart(2, '0');
				var endDay = String(oneHourLater.getDate()).padStart(2, '0');
				var endHours = String(parseInt(oneHourLater.getHours()) + 2).padStart(2, '0');
				var endMinutes = String(oneHourLater.getMinutes()).padStart(2, '0');
				var endTimeFormatted = `${endYear}-${endMonth}-${endDay}T${endHours}:${endMinutes}`;

				timeEndInput.val(endTimeFormatted);

				var name = box.find(".name");
				var index = $(".box-promotion");

				var currentName = `Flash sale 07 khung hằng ngày ${(index.length - 1).toString().padStart(2, "0")} ${day}/${month}/${year}`;
				name.eq(index.length - 1).val(currentName);
			})

			$(".remove-promotion").on("click", function(){
				$(this).parent().remove();
			})

			$(".box-promotion .name").on("keyup", function(){
				var charLen = $(this).val().length;
				$(this).parent().find(".count-character").text(`${charLen}/50`);
			})

			$(".box-promotion .name").on("keypress", function(){
				var charLen = $(this).val().length;
				$(this).parent().find(".count-character").text(`${charLen}/50`);
			})

			$(".box-promotion .name").on("change", function(){
				var charLen = $(this).val().length;
				$(this).parent().find(".count-character").text(`${charLen}/50`);
			})
		}

		function saoChepFlashSaleTiktok(){
			boxAlert("SAOCHEP");
			var copyLink = $(".tp-container.tp-content .layout-future .layout-tab .copy-link");

			if (copyLink.val().length  <= 10){
				boxToast(`Đường dẫn chương trình gốc bị để trống`, "error");
				return;
			}

			var promotionBox = $(".box-promotion");

			var name, start, end;

			localStorage.removeItem("TP-exit");

			var promotionData = [];

			$.each(promotionBox, (index, value) => {
				if(index == 0)
					return;
				do{
					name = $(promotionBox).eq(index).find(".name");
					start = $(promotionBox).eq(index).find(".time-start");
					start = formatDateStringTiktok(start.val());
					end = $(promotionBox).eq(index).find(".time-end");
					end = formatDateStringTiktok(end.val());
				}while(name.val().length == 0);

				promotionData.push({
					name: name.val(),
					start: start,
					end: end
				})
			})

			var totalPromotion = parseInt(promotionData.length) - 1;

			sessionStorage.clear();

			sessionStorage.setItem("TP-promotion", JSON.stringify(promotionData));
			sessionStorage.setItem("TP-promotion-index", JSON.stringify(totalPromotion));
			sessionStorage.setItem("TP-promotion-copylink", JSON.stringify(copyLink.val()));

			checkCopyPromotion();
		}

		function checkCopyPromotion() {
			boxAlert("KIEMTRA")
			try {
				var promotion = JSON.parse(sessionStorage.getItem("TP-promotion") || "[]");
				var promotionIndex = JSON.parse(parseInt(sessionStorage.getItem("TP-promotion-index")));
				var promotionLink = JSON.parse(sessionStorage.getItem("TP-promotion-copylink"));

				// Nếu hết dữ liệu thì thông báo
				if (!promotion || !promotion[promotionIndex]) {
					boxToast("🎉 Đã hoàn tất sao chép chương trình khuyến mãi", "success");
					sessionStorage.clear();
					return;
				}

				// Nếu chưa đúng trang thì chuyển hướng
				if (!window.location.href.includes(promotionLink)) {
					window.location.href = promotionLink;
					return;
				}

				var { name, start, end } = promotion[promotionIndex];

				waitForElement($("body"), ".theme-arco-form-item-control#name input#name_input", async (el) => {
					var nameBox = $(el);

					// Điền tên
					simulateClearReactInput(nameBox);
					simulateReactInput(nameBox, name);

					waitForElement($("body"), ".theme-arco-form-item-control#period input", async (el) => {
						var time = $(".theme-arco-form-item-control#period input");
						time.removeAttr("readonly");

						var timeStart = time.eq(0);
						var timeEnd = time.eq(1);

						// Chọn ngày + xác nhận
						await dateTimeChoiceTiktok(timeStart, start);
						await dateTimeChoiceTiktok(timeEnd, end);
						confirmPromotionTiktok(promotionIndex);
						await confirmPromotionTiktok(promotionIndex);

						setTimeout(checkCopyPromotion, 3000); // đợi nhẹ 1s cho ổn định
					});
				})
			} catch (e) {
				boxAlert("❌ Lỗi khi kiểm tra chương trình: " + e.message, "error");
			}
		}
		checkCopyPromotion();

		// Xác Nhận
		function confirmPromotionTiktok(index){
			if(index >= 0){
				sessionStorage.setItem("TP-promotion-index", JSON.stringify(parseInt(index - 1)));
			}
			var confirmButton = $(".theme-arco-btn.theme-arco-btn-primary.theme-arco-btn-size-default.theme-arco-btn-shape-square.theme-m4b-button.ml-16");
			confirmButton.eq(0).click();
		}

		// Chọn ngày từ bảng của tiktok
		function dateTimeChoiceTiktok(selector, dateTime){
			return new Promise((resolve) => {
				simulateReactEvent(selector, "click");

				dateTime = dateTime.split(" ");
				var date = dateTime[0];
				var time = dateTime[1];

				var [dayRoot, monthRoot, yearRoot] = date.split("/");

				time = time.replace("(GMT+7)", "");
				var [hoursRoot, minutesRoot] = time.split(":")

				waitForElement($("body"), ".theme-arco-picker-container", (el) => {

					function checkHeader(value){
						var header = $(el).find(".theme-arco-picker-header");
						var preYear = header.find("div").eq(0);
						var preMonth = header.find("div").eq(1);
						var value = header.find("div").eq(2);
						var nextMonth = header.find("div").eq(3);
						var nextYear = header.find("div").eq(4);

						value = value.toString().split("-");
						var year = value[0];
						var month = value[1];

						if(year != yearRoot){
							var len = Math.abs(year - yearRoot);
							if(parseInt(year) - parseInt(yearRoot) < 0){
								while(len > 0){
									nextYear.click();
									len--;
								}
							}else{
								while(len > 0){
									preYear.click();
									len--;
								}
							}
						}

						if(month != monthRoot){
							len = Math.abs(month - monthRoot);
							if(parseInt(month) - parseInt(monthRoot) < 0){
								while(len > 0){
									nextMonth.click();
									len--;
								}
							}else{
								while(len > 0){
									preMonth.click();
									len--;
								}
							}
						}
					}

					checkHeader();

					function checkBody(){
						var body = $(el).find(".theme-arco-picker-body");
						var row = body.find(".theme-arco-picker-row");

						$.each(row, (indexRow, valueRow) => {
							var cell = $(valueRow).find(".theme-arco-picker-cell");

							$.each(cell, (indexCell, valueCell) => {
								if($(valueCell).not(".theme-arco-picker-cell-disabled")){
									if(parseInt($(valueCell).text()) == parseInt(dayRoot)){
										$(valueCell).click();
									}
								}
							})
						})
					}

					checkBody();

					function checkTime(){
						var footer = $(el).find(".theme-arco-picker-footer");
						footer.find("button.theme-arco-picker-btn-select-time").click();

						waitForElement($(el), ".theme-arco-panel-date-timepicker", (el) => {
							var timePicker = $(el).find(".theme-arco-timepicker");
							var list = timePicker.find(".theme-arco-timepicker-list");

							var hours = list.eq(0);
							var minute = list.eq(1);

							$.each(hours.find("ul li"), (index, value) => {
								if(parseInt($(value).text()) == hoursRoot){
									$(value).click();
								}
							})

							$.each(minute.find("ul li"), (index, value) => {
								if(parseInt($(value).text()) == minutesRoot){
									$(value).click();
								}
							})
						})
					}

					checkTime();

					$(el).find("button.theme-arco-picker-btn-confirm").click();
					setTimeout(resolve, 1000);
				})
			});
		}

		// Chỉnh định dạng ngày của tiktok
		function formatDateStringTiktok(value){
			value = value.toString().split("T");
			var date = value[0];
			var time = value[1];

			var [year, month, day] = date.split("-");
			date = `${day}/${month}/${year}`;

			return (`${date} ${time}(GMT+7)`);
		}

		if(window.location.href.includes("https://seller-vn.tiktok.com/product/edit")){
			waitForElement($("body"), ".core-table-content-inner", kiemTraMaPhanLoaiTiktok);
		}

		// Kiểm tra mã phân loại tiktok
		function kiemTraMaPhanLoaiTiktok(){
			var table = $(".core-table-content-inner tbody");

			var row = table.find("tr.core-table-tr");

			row.find(".tp-model-id").remove();

			$.each(row, (index, value) => {
				var name = row.eq(index).find("td.core-table-td").eq(0);
				var price = row.eq(index).find("td.core-table-td div#skus");
				// var stock = row.eq(index).find("td.core-table-td").eq(2);
				// var sku = row.eq(index).find("td.core-table-td").eq(3);

				var productID = price.data("id");
				productID = productID.split(".");
				productID = productID[productID.length - 1];

				name.find(".core-table-cell-wrap-value").append($(`
					<p class="tp-model-id">ID phân loại: <span class="copyable" style="cursor: pointer;">${productID}</span></p>
				`))
			})
		}

		// Chỉnh sữa chương trình khuyến mãi Tiktok
		function setEventChinhSuaKhuyenMaiTiktok(){
			var data = $(".tp-container.tp-content .layout-future .layout-tab #data").val().split("\n").length;
			$(".tp-container.tp-content .layout-future .layout-tab #prev").on("click", function(){
				var index = sessionStorage.getItem("currentRemove");
				index = parseInt(index);
				if(index > 0){
					sessionStorage.setItem("currentRemove", index - 1);
					chinhSuaKhuyenMaiTiktok();
				}
			});

			$(".tp-container.tp-content .layout-future .layout-tab #next").on("click", function(){
				var index = sessionStorage.getItem("currentRemove");
				index = parseInt(index);
				if(index <= data){
					sessionStorage.setItem("currentRemove", index + 1);
					chinhSuaKhuyenMaiTiktok();
				}
			});

			$(".tp-container.tp-content .layout-future .layout-tab #remo").on("click", function(){
				if($("button[data-uid='deletecolumnui:button:0d701']")){
					$("button[data-uid='deletecolumnui:button:0d701']").click().click();
					var message = "Đã xóa";
					boxLogging(message, [message], ["green"]);
				}else{
					boxLogging("Không có gì để xóa");
				}
			});

			$(".tp-container.tp-content .layout-future .layout-tab #data").on("input", function(){
				sessionStorage.setItem("currentRemove", 0);
				chinhSuaKhuyenMaiTiktok();
			});
		}
		
		function chinhSuaKhuyenMaiTiktok(){
			var data = $(".tp-container.tp-content .layout-future .layout-tab #data")
			data = data.val().split("\n");
			var searchBox = $("div[data-uid='productsearch:div_onclicksearchicon:27e8f']");
			searchBox.click();

			var index = sessionStorage.getItem("currentRemove");

			var input = searchBox.find("input");
			simulateClearReactInput(input);
			simulateReactInput(input, data[index]);

			console.log($(".tp-container.tp-content .layout-future .layout-tab > p #currentItem"));

			$(".tp-container.tp-content .layout-future .layout-tab > p #currentItem").val(index + 1);

			$(".tp-container.tp-content .layout-future .layout-tab > p #totalItem").val(data.length + ` ( ${data[index]} )`);

			// $("button[data-uid='deletecolumnui:button:0d701']").click();
		}

		// Lấy phân loại shopee
		async function layPhanLoaiShopee() {
			boxToast("Đang xử lý");
			var box = $(".variation-edit-item.version-a").eq(0).find(".option-container .options-item.drag-item");
			var boxDetail = $(".variation-model-table-main .eds-scrollbar.middle-scroll-container .eds-scrollbar__content .variation-model-table-body .table-cell-wrapper");
			var boxLeft = $(".variation-model-table-fixed-left .variation-model-table-body .table-cell-wrapper");

			let currentList = [];
			var zip = new JSZip();

			for (let i = 0; i < box.length; i++) {
				var el = box[i];
				var name = $(el).find(".variation-input-item-container.variation-input-item input").val();
				var detailRow = boxDetail.eq(i).find(".table-cell");
				var price = detailRow.eq(0).find("input").val();
				let stockVal = detailRow.eq(1).find("input").val();
				var skuText = detailRow.eq(2).find("textarea").val() || `variant-${i}`;

				var getStock = $(".tp-container.tp-content .layout-future #getStock").prop("checked");
				if (!getStock) {
					var editStock = $(".tp-container.tp-content .layout-future #stock-edit").val();
					stockVal = editStock.length === 0 ? 0 : editStock;
				}

				var copyVariant = `${name}\t${skuText}\t${price}\t${stockVal}`;
				currentList.push(copyVariant);

				// Tải ảnh lớn → chuyển sang PNG thật sự
				var img = boxLeft.eq(i).find("img");
				if (img.length) {
					let url = img.attr("src");
					if (url) {
						var parts = url.split("/");
						var fileId = parts[parts.length - 1];
						fileId = fileId.toString().replace("_tn", "");
						var fullUrl = `https://banhang.shopee.vn/api/v1/cdn_proxy/${fileId}`;

						try {
							var response = await fetch(fullUrl);
							var blob = await response.blob();

							var imageBitmap = await createImageBitmap(blob);
							var canvas = document.createElement("canvas");
							canvas.width = imageBitmap.width;
							canvas.height = imageBitmap.height;

							var ctx = canvas.getContext("2d");
							ctx.drawImage(imageBitmap, 0, 0);

							var pngBlob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));

							var filename = `${skuText}.png`;
							var arrayBuffer = await pngBlob.arrayBuffer();
							zip.file(filename, arrayBuffer);
						} catch (error) {
							console.error('Lỗi tải/chuyển ảnh:', fullUrl, error);
						}
					}
				}
			}

			zip.generateAsync({ type: 'blob' }).then(function (zipBlob) {
				saveAs(zipBlob, "Anh_Phan_Loai_PNG.zip");
			});

			boxToast(`Đã sao chép tên ${currentList.length} phân loại`, "success");
			navigator.clipboard.writeText(currentList.join("\n"));
		}

		// Tự động thêm preview link
		if(window.location.toString().includes("https://banhang.shopee.vn/portal/product/")){
			//waitForElement($("body"), ".preview-card .preview-card-title", setPreviewLink);
			waitForElement($("body"), ".product-edit-form-item.custom-len-calc-input input", setPreviewLink);
		}

		// Chức năng xem sản phẩm giao diện người mua
		function setPreviewLink(){
			var attempts = 0;
			var maxAttempts = 20;
			var interval = setInterval(function () {
				if (!$(".preview-card").length) {
					if (++attempts >= maxAttempts) clearInterval(interval);
					return;
				}else
					clearInterval(interval);

				var html = document.documentElement.innerHTML;
				var itemMatch = window.location.pathname.match(/\/product\/(\d+)/);
				var shopMatch = html.match(/"shopid":(\d+)/);

				if (itemMatch && shopMatch) {
					var itemid = itemMatch[1];
					var shopid = shopMatch[1];
					//var productURL = "https://shopee.vn/product/" + shopid + "/" + itemid;
					var card = $(".preview-card");
					var title = card.find(".preview-card-title");

					var boxName = $(".product-edit-form-item.custom-len-calc-input");
					var productName = boxName.find("input").val();
					productName = (productName.split(" ")).join("-");

					var url = `https://shopee.vn/${productName}-i.${shopid}.${itemid}`;

					var link = $("<a></a>");
					link.attr({
						"href": url,
						"target": "_bank"
					});
					link.text("Xem Trước").css("color", "crimson");

					title.empty().append(link);

					boxToast(`Đã thêm link xem trước cho sản phẩm`);
				}
			},500);
		}

		// Thêm phân loại tiktok
		function setEventThemPhanLoaiTiktok(){
			// Gắn sự kiện và cho phép chọn thư mục
			$(".tp-container.tp-content .layout-future .layout-tab input")
				.attr({
				webkitdirectory: true,
				directory: true,
				multiple: true
				})
				.on("change", function () {
				var files = this.files;

				// Xóa map cũ
				inputMap = {};

				for (let i = 0; i < files.length; i++) {
					var file = files[i];

					// Lấy tên file không có đuôi mở rộng
					var fileNameOnly = file.name.split(".")[0].trim().toUpperCase();

					// Tạo DataTransfer chứa file
					var dt = new DataTransfer();
					dt.items.add(file);

					// Tạo input giả (để nạp file vào ô của Shopee)
					var newInput = $("<input type='file'>").prop("files", dt.files).addClass("single-file-input");

					// Gán theo SKU
					inputMap[fileNameOnly] = newInput;
				}
			});
		}

		function themPhanLoaiTiktok(){
			boxLogging("THEMPHANLOAI");
			var data = $(".tp-container.tp-content .layout-future #data");

			data = data.val().split("\n");

			var name = [], sku = [], price = [], stock = [];

			$.each(data, (index, value) => {
				value = value.split("\t");
				name.push(value[0]);
				sku.push(value[1]);
				price.push(value[2]);
				stock.push(value[3] || 0);
			})

			var len = name.length, i = 0;

			function nextItem(){
				if(i >= len){
					setVariantItem(data);
					return;
				}

				var box = $(".sc-dHntBn.hkbMon div div.flex.flex-row.relative");

				var newBox = box.eq(box.length - 1).find("input");

				var imgBox = newBox.eq(0);
				var nameBox = newBox.eq(1);

				simulateReactInput(nameBox, name[i]);

				simulateReactEvent(nameBox, "change");

				nameBox.blur();

				setTimeout(() => {
					var imgInputTiktok = imgBox[0];

					if (inputMap[sku[i]]) {
						// inputMap[found] là jQuery object, cần lấy phần tử gốc
						var fileInputEl = inputMap[sku[i]].get(0);
						if (!fileInputEl || !fileInputEl.files || fileInputEl.files.length === 0) return;

						var file = fileInputEl.files[0];
						var dt = new DataTransfer();
						dt.items.add(file);

						// Click input đầu tiên để kích hoạt UI React
						// if(!clickInput){
						// 	imgInputTiktok.click();
						// 	clickInput = true;
						// }

						setTimeout(() => {
							imgInputTiktok.files = dt.files;

							// Tạo sự kiện change để Shopee nhận diện file mới
							var evt = new Event("change", { bubbles: true });
							imgInputTiktok.dispatchEvent(evt);
							boxLogging(`Đã sửa ảnh cho SKU [copy]${sku}[/copy]`, [`${sku}`], ["green"])
						}, 100); // có thể chỉnh tăng lên nếu chưa kịp load
					}else{
						boxLogging(`SKU [copy]${sku}[/copy] không có ảnh`, [`${sku}`], ["crimson"])
					}

					i++;

					setTimeout(nextItem, 2000);

				}, 500)
			}

			nextItem();

			function setVariantItem(data){
				boxAlert("SỬA CHI TIẾT");
				var table = $(".core-table-content-inner table tbody tr");

				$.each(table, (index, value) => {
					var nameBox = table.eq(index).find("td").eq(0).find("p").eq(0);
					var priceBox = table.eq(index).find("td").eq(1).find("input");
					var stockBox = table.eq(index).find("td").eq(2).find("input");
					var skuBox = table.eq(index).find("td").eq(3).find("input");

					$.each(name, (index, value) => {
						if(nameBox.text().includes(name[index])){
							simulateReactInput(priceBox, price[index]);
							simulateReactInput(stockBox, stock[index]);
							simulateReactInput(skuBox, sku[index]);
						}
					})
				})
			}
		}

		// Giữ ctrl + click để mở trong tab mới
		if(window.location.toString().includes("https://seller-vn.tiktok.com/")){
			$("a").on("click", function(e){

				var url = $(this).attr("href");

				if(e.ctrlKey){
					e.preventDefault();
					e.stopPropagation();
					window.open(url, "_blank");
				}s
			})
		}

		// So sánh voucher
		function setEventCompareVoucher(){
			$("#addVoucher").on("click", function(){
				var i = 0;
				var voucherBox = $(".tp-container.tp-content .layout-future table tbody .voucher-box.root").eq(0).clone(true).removeClass("root").removeAttr("hidden");
				$(".tp-container.tp-content .layout-future table tbody").append(voucherBox);
			})

			$(".remove-voucher").on("click", function(){
				$(this).parent().remove();
			});

			$(".tp-container.tp-content table tbody .voucher-box input").on("keyup", function(){
				var cost = $(this).val();
				cost = cost.split(",");
				cost = cost.join("");
				cost = cost.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
				$(this).val(cost);
			});

			$(".tp-container.tp-content .layout-tab #data").on("keyup", function(){
				var cost = $(this).val();
				cost = cost.split(",");
				cost = cost.join("");
				cost = cost.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
				$(this).val(cost);
			});
		}

		function compareVoucher() {
			var data = $(".tp-container.tp-content .layout-future .layout-tab #data");
			var arrayData = data.val().split("\n").map(x => parseInt(x.replace(/,/g, "").trim())).filter(x => !isNaN(x));
			var voucherBoxes = $(".voucher-box").slice(1);

			console.log(voucherBoxes);

			let headers = `<tr><th>Voucher</th>`;
			arrayData.forEach(price => {
				headers += `<th>${price.toLocaleString()}đ</th>`;
			});
			headers += `</tr>`;

			let rows = ``;

			voucherBoxes.each((index, el) => {
				// Bỏ qua box đầu tiên nếu là template
				if (index === 0) return;

				var box = $(el);
				var discount = parseInt(box.find(".discount-percent input").val().replace(/,/g, "")) || 0;
				var discountType = box.find(".discount-percent select option:selected").index(); // 0 = %, 1 = ₫
				var maxDiscount = parseInt(box.find(".max-discount input").val().replace(/,/g, "")) || 0;
				var conditionDeal = parseInt(box.find(".condition-deal input").val().replace(/,/g, "")) || 0;

				let voucherText = `Giảm ${discount}${discountType === 0 ? "%" : "đ"}`;
				if (maxDiscount) voucherText += `, tối đa ${maxDiscount.toLocaleString()}đ`;
				if (conditionDeal) voucherText += `, đơn từ ${conditionDeal.toLocaleString()}đ`;

				let row = `<tr><td>${voucherText}</td>`;

				arrayData.forEach(price => {
					if (price < conditionDeal) {
						row += `<td style="color: red;">Không đủ điều kiện</td>`;
					} else {
						let discountPrice = 0;
						if (discountType === 0) {
							discountPrice = price * (discount / 100);
						} else {
							discountPrice = discount;
						}

						if (maxDiscount > 0) discountPrice = Math.min(discountPrice, maxDiscount);
						let finalPrice = price - discountPrice;

						row += `<td>-${discountPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ<br>(còn ${finalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')})</td>`;
					}
				});

				row += `</tr>`;
				rows += row;
			});

			var table = `
			<table style="
				border-collapse: collapse;
				width: 100%;
				font-family: Arial, sans-serif;
				text-align: center;
				background: #fff;
			">
				<thead style="background: #f0f0f0;">
					${headers}
				</thead>
				<tbody>
					${rows}
				</tbody>
			</table>`;

			// In ra bảng (bạn có thể dùng .html() nếu có container hiển thị)
			boxPopup(table);
		}

		// Lấy link chứa SKU
		function setEventLayLinkChuaSKUShopee(){
			// Nhấn để sao chép kết quả
			$(".tp-container.tp-content .layout-future .layout-tab #result").on("click", function(e){
				var value = $(this).val();

				if(value.length == 0){
					boxToast(`Không có gì để sao chép`, "error");
					return;
				}

				navigator.clipboard.writeText(value);

				boxToast(`Đã sao chép`, "sucess");
			})

			// Tìm link trên trang
			$(".tp-container.tp-content .layout-future .layout-tab #search").on("click", function(e){
				layLinkChuaSKUShopee.searchLink();
			})

			// Lấy link trên trang
			$(".tp-container.tp-content .layout-future .layout-tab #get").on("click", function(e){
				layLinkChuaSKUShopee.getLink();
			})

			// Lấy link trên trang
			$(".tp-container.tp-content .layout-future .layout-tab #prev").on("click", function(e){
				layLinkChuaSKUShopee.prevLink();
			})

			// Lấy link trên trang
			$(".tp-container.tp-content .layout-future .layout-tab #next").on("click", function(e){
				layLinkChuaSKUShopee.nextLink();
			})
		}

		var layLinkChuaSKUShopee = {
			data: null,
			currentIndex: 0,
			searchLink: function(){
				this.data = $(".tp-container.tp-content .layout-future .layout-tab #data");

				var data = this.data.val().split("\n");

				var searchBox = $(".search-input input");
				simulateClearReactInput(searchBox);
				simulateReactInput(searchBox, data[this.currentIndex]);
				simulateReactEvent(searchBox, "enter");


				setTimeout(() => {
					scrollToBottom(() => {
						this.getLink();
					})
				}, 3000);
			},
			getLink: function(){
				var box = $(".product-grid-container .product-item")

				var listID = [];

				$.each(box, (index, value) => {
					var id = box.eq(index).find(".product-checkbox label.eds-checkbox input").attr("name");
					listID.push(id);
				})

				var oldData = $(".tp-container.tp-content .layout-future .layout-tab #result").val().split("\n");

				var mergeData = [...new Set([...oldData, ...listID])].filter(Boolean);

				mergeData = mergeData.join("\n");

				$(".tp-container.tp-content .layout-future .layout-tab #result").val(mergeData);

				boxToast(`Đã lấy xong`);
			},
			nextLink: function(){
				console.log("NEXT");
				$('html, body').animate({ scrollTop: 0 });
				this.currentIndex++;
				setTimeout(() => {
					this.searchLink();
				}, 1000);
			},
			prevLink: function(){
				console.log("PREV");
				$('html, body').animate({ scrollTop: 0 });
				this.currentIndex--;
				setTimeout(() => {
					this.searchLink();
				}, 1000);
			}

		}

		// Sửa tồn theo SKU hàng loạt Shopee
		function setEventSuaTonSKUNhieuLinkShopee(){
			$(".tp-container.tp-content .layout-future .layout-tab #skip").click(() => {
				boxLogging(`Đã bỏ qua [copy]${sku}[/copy]`, [`${sku}`], ["orange"])
				currentItem++;	
				nextItem();
			})
		}

		function suaTonSKUNhieuLinkShopee(){
			var data = $(".tp-container.tp-content .layout-future .layout-tab #data");

			var link = $(".tp-container.tp-content .layout-future .layout-tab #idlink");

			link = link.val().split("\n");

			var listLink = [];

			$.each(link, (index, value) => {
				listLink.push(value);
			})

			data = data.val().split("\n");

			var sku = [], stock = [];

			$.each(data, (index, value) => {
				value = value.split("\t");

				sku.push(value[0]);
				if(!value[1] || parseInt(value[1]) < 0)
					value[1] = 0;
				stock.push(value[1]);
			})

			console.log(listLink);
			console.log(sku);
			console.log(stock);

			var currentLink = 0;

			window.open(`https://banhang.shopee.vn/portal/product/${listLink[currentLink]}`, "_blank");

			tpBroadcast.addEventListener("message", function(e){
				if(e.data.type == "ready-to-listent"){
					tpBroadcast.postMessage({
						type: "data-for-edit-stock-shopee",
						sku: sku,
						stock: stock
					}, "*")
				}

				if(e.data.type == "edit-stock-done"){
					currentLink++;
					if(currentLink >= listLink.length){
						boxLogging(`Đã sửa hết, chờ xác nhận`);
						return;
					}
					window.open(`https://banhang.shopee.vn/portal/product/${listLink[currentLink]}`, "_blank");
				}
			})			
		}

		tpBroadcast.addEventListener("message", function(e){
			if(e.data.type == "data-for-edit-stock-shopee"){
				suaTonSKUShopee(e.data);
			}
		})

		// Hàm suaTonSKUShopee - GIỮ NGUYÊN TÊN VÀ CẤU TRÚC NHẤT CÓ THỂ
		async function suaTonSKUShopee(...data){ // Đảm bảo hàm này là ASYNC
			var sku = [], stock = [];
			if(data && data[0]){
				data = data[0];
				sku = data.sku;
				stock = data.stock;
			}else{
				var dataElement = $(".tp-container.tp-content .layout-future .layout-tab #data");
				if (!dataElement.length) {
					console.error("suaTonSKUShopee: Phần tử #data không tìm thấy. Không thể lấy dữ liệu SKU/Stock từ DOM.");
					// Gửi thông báo lỗi nếu không tìm thấy dữ liệu đầu vào
					tpBroadcast.postMessage({
						type: "edit-stock-failed",
						message: "Không tìm thấy dữ liệu SKU/Stock đầu vào."
					}, "*");
					return;
				}
				data = dataElement.val().split("\n").filter(line => line.trim() !== '');

				$.each(data, (index, value) => {
					value = value.split("\t");
					sku.push(value[0]);
					let currentStock = parseInt(value[1]);
					stock.push(isNaN(currentStock) || currentStock < 0 ? 0 : currentStock);
				});
			}

			console.log("suaTonSKUShopee: Đã tải SKU và Stock:", sku, stock);

			let mainTableWrapperContent;
			try {
				// AWAIT trực tiếp việc tìm thấy phần tử chính của bảng biến thể
				mainTableWrapperContent = await awaitForElement($("body"), ".variation-model-table-main .eds-scrollbar.middle-scroll-container .eds-scrollbar__content .variation-model-table-body", {timeout: 15000});
				console.log("suaTonSKUShopee: Đã tìm thấy wrapper bảng biến thể chính.");
			} catch (error) {
				console.error("suaTonSKUShopee: Lỗi khi chờ bảng biến thể chính:", error.message);
				boxAlert("Lỗi: Không tìm thấy bảng biến thể sản phẩm.");
				// Gửi thông báo lỗi nếu bảng chính không được tìm thấy
				tpBroadcast.postMessage({
					type: "edit-stock-failed",
					message: `Không tìm thấy bảng biến thể chính: ${error.message}`
				}, "*");
				return;
			}

			// --- BẮT ĐẦU VÒNG LẶP XỬ LÝ TỪNG HÀNG BIẾN THỂ ---
			// Vì không có callback nữa, vòng lặp này sẽ chạy sau khi awaitForElement hoàn thành.
			var box = $(mainTableWrapperContent).find(".table-cell-wrapper"); // Lấy các hàng từ mainTableWrapperContent
			if (box.length === 0) {
				console.warn("suaTonSKUShopee: Không tìm thấy các hàng biến thể sản phẩm bên trong bảng.");
				boxAlert("Không tìm thấy hàng biến thể để cập nhật.");
				// Gửi thông báo hoàn thành (nhưng không có gì để làm) hoặc báo lỗi
				tpBroadcast.postMessage({
					type: "edit-stock-done", // Coi như hoàn thành vì không có gì để cập nhật
					message: "Không tìm thấy hàng biến thể để cập nhật."
				}, "*");
				return;
			}

			// Vòng lặp chính, bây giờ là FOR...OF để đảm bảo đồng bộ hóa
			for (let indexBox = 0; indexBox < box.length; indexBox++) {
				var valueBox = box.eq(indexBox);
				var skuBox = valueBox.find(".table-cell").eq(2).find("textarea");
				var stockBox = valueBox.find(".table-cell").eq(1).find(".multi-warehouse-stock-input input");

				if (!skuBox.length || !stockBox.length) {
					console.warn(`suaTonSKUShopee: Hàng ${indexBox} không có đủ SKU/Stock input. Bỏ qua.`);
					continue;
				}

				let foundSkuIndex = -1;
				for (let i = 0; i < sku.length; i++) {
					if(skuBox.val().includes(sku[i])){
						foundSkuIndex = i;
						break;
					}
				}

				if(foundSkuIndex !== -1){
					var currentSku = sku[foundSkuIndex];
					var currentStock = stock[foundSkuIndex];

					console.log(`suaTonSKUShopee: Đang xử lý SKU: "${currentSku}" với Stock: ${currentStock}`);

					stockBox.focus();
					stockBox.click();
					stockBox.attr("modelvalue", currentStock);

					simulateReactEvent(stockBox, "change");
					simulateReactEvent(stockBox, "mousedown");
					await delay(200);
					simulateReactEvent(stockBox, "mouseup");
					await delay(200);
					simulateReactEvent(stockBox, "click");

					let warehouseEditModal;
					try {
						warehouseEditModal = await awaitForElement($("body"), ".multi-warehouse-stock-edit", {timeout: 7000});
						console.log(`suaTonSKUShopee: Đã tìm thấy modal chỉnh sửa tồn kho cho SKU: "${currentSku}".`);
						await delay(300);
					} catch (error) {
						console.error(`suaTonSKUShopee: Lỗi khi chờ modal tồn kho cho SKU "${currentSku}":`, error.message);
						boxAlert(`Lỗi: Không tìm thấy bảng tồn kho cho SKU "${currentSku}".`);
						continue;
					}

					var wareHouse = $(warehouseEditModal).find(".eds-table__row.valign-top");

					for (let indexWarehouse = 0; indexWarehouse < wareHouse.length; indexWarehouse++) {
						var valueWarehouse = wareHouse.eq(indexWarehouse);
						var nameEdit = valueWarehouse.find("td").eq(0).find(".eds-popover__ref").text().trim();
						var stockEdit = valueWarehouse.find("td").eq(1).find("input");

						if(nameEdit.toLowerCase().includes("kho 77") && stockEdit.length){
							console.log(`suaTonSKUShopee: Tìm thấy "Kho 77" cho SKU "${currentSku}". Cập nhật tồn kho: ${currentStock}`);
							simulateClearReactInput(stockEdit);
							await delay(100);
							simulateReactInput(stockEdit, currentStock.toString());
							await delay(100);
							simulateReactEvent(stockEdit, "blur");
							await delay(100);
						}
					}

					try {
						var confirmButton = await awaitForElement($(warehouseEditModal), ".stock-edit-fixed .stock-edit-fixed-right button.eds-button--primary", {timeout: 3000});
						console.log(`suaTonSKUShopee: Tìm thấy nút xác nhận cho SKU "${currentSku}". Click.`);
						simulateReactEvent($(confirmButton), "click");
						await delay(1000); // Chờ modal đóng
					} catch (error) {
						console.error(`suaTonSKUShopee: Lỗi khi chờ nút xác nhận cho SKU "${currentSku}":`, error.message);
						try {
							var closeButton = await awaitForElement($(warehouseEditModal), ".shopee-modal__close-btn", {timeout: 1000});
							simulateReactEvent($(closeButton), "click");
							await delay(500);
						} catch (e) {
							console.warn("suaTonSKUShopee: Không tìm thấy nút đóng modal để tự động đóng sau lỗi nút xác nhận.");
						}
					}
					console.log(`suaTonSKUShopee: Đã hoàn thành xử lý SKU: "${currentSku}".`);
				} else {
					console.log(`suaTonSKUShopee: Không tìm thấy SKU "${skuBox.val()}" trong danh sách cần xử lý. Bỏ qua.`);
				}
				await delay(800); // Chờ trước khi xử lý hàng tiếp theo
			} // Kết thúc vòng lặp FOR...OF cho $boxRows

			// --- GỬI REQUEST CHỈ SAU KHI TẤT CẢ CÁC SKU ĐÃ ĐƯỢC XỬ LÝ XONG ---
			console.log("suaTonSKUShopee: Đã hoàn thành toàn bộ quá trình cập nhật tồn kho.");
			boxAlert("Đã hoàn thành quá trình cập nhật tồn kho!");
			tpBroadcast.postMessage({
				type: "edit-stock-done",
			}, "*");
		}

		// suaTonSKUShopee({
		// 	sku: ["GDD041", "GDD038", "GDD039"],
		// 	stock: ["0", "0", "0"]
		// })

		// suaTonSKUShopee({
		// 	sku: ["GDD041-GG130"],
		// 	stock: ["0"]
		// })

		// Mở rộng không gian làm việc
		var optionStatus = false;
		function scaleMainContent(){
			waitForElement($("body"), ".product-edit__main", (mainContent) => {
				mainContent = $(mainContent);
				if(!optionStatus){
					mainContent.css({
						"width": "100%",
						"position": "absolute",
						"top": "0",
						"left": "0",
						"margin-left": "0",
						"z-index": "9999",
					});
					optionStatus = true;
				}else{
					mainContent.removeAttr("style");
					optionStatus = false;
				}
			});
		}

		function setEventLienKetSKUSapo(){

		}

		async function lienKetSKUSapo(){
			boxAlert("LIÊN KẾT SKU SAPO");

			function checkSKU(sku){
				// Biểu thức chính quy để trích xuất phần SKU chính:
				// ^                   : Bắt đầu chuỗi
				// ([A-Z]+[A-Z0-9]*)   : NHÓM 1 - Phần đầu của SKU chính (bắt buộc): 1+ chữ cái hoa, theo sau là 0+ chữ hoa/số.
				// (-[A-Z]+[A-Z0-9]*)? : NHÓM 2 - Phần sau của SKU chính (tùy chọn): Dấu gạch nối, 1+ chữ cái hoa, theo sau là 0+ chữ hoa/số.
				// (.*)                : NHÓM 3 - Bất kỳ ký tự nào còn lại sau phần SKU chính (có thể là nhiễu).
				// $                   : Kết thúc chuỗi
				const pattern = /^([A-Z]+[A-Z0-9]*)(-[A-Z]+[A-Z0-9]*)?(.*)$/;

				const match = sku.match(pattern);

				if (match) {
					let mainSkuPart = match[1]; // Lấy phần đầu của SKU chính

					// Nếu có phần thứ hai của SKU chính, nối vào
					if (match[2]) {
						mainSkuPart += match[2];
					}

					const noisePart = match[3]; // Lấy phần còn lại (nhiễu)

					const hasNoise = noisePart !== ''; // Có nhiễu nếu phần còn lại không rỗng

					return {
						sku: mainSkuPart, // Phần SKU chính được trích xuất
						noise: noisePart,     // Phần nhiễu (rỗng nếu không có)
						type: hasNoise    // true nếu có nhiễu, false nếu không
					};
				} else {
					// Trường hợp không khớp với cả định dạng cơ bản của SKU chính (ví dụ: "123", "abc")
					// Trong trường hợp này, toàn bộ chuỗi được coi là nhiễu.
					return {
						sku: "",          // Không trích xuất được SKU chính
						noise: sku,           // Toàn bộ chuỗi là nhiễu
						type: true        // Chắc chắn có nhiễu
					};
				}
			}

			var typeLink = $(".tp-content .layout-future .layout-tab #toggle-switch").prop("checked");

			boxAlert(`Đang Liên Kết SKU`);

			var containers = $(".product-list-wrapper .product-list-container .product-item-wrapper");

			var indexContainer = 0;

			function nextContainer(){
				if(indexContainer >= containers.length){
					boxLogging(`Đã liên kết xong tất cả sản phẩm`, [], ["green"]);
					boxToast(`Đã liên kết xong tất cả sản phẩm`, "success");
					return;
				};

				var containerElement = containers.eq(indexContainer);

				var openSku = false;

				var product = $(containerElement).find(".product-item-line");

				var product_name = product.find(".product-info div[data-id='tooltip']");

				var variants = $(containerElement).find(".variant-list-wrapper .product-tooltip-wrapper");

				var indexVariant = 0;

				async function nextVariant(){
					if(indexVariant >= variants.length){
						boxLogging(`Đã liên kết xong sản phẩm ${product_name.text()}`, [`${product_name.text()}`], ["green"]);
						boxToast(`Đã liên kết xong sản phẩm ${product_name.text()}`, "success");
						return;
					}

					var variantElement = variants.eq(indexVariant);
					var variant = $(variantElement);

					var checkBox = $(variant).find(".item-checkbox input");
					var variant_name = $(variant).find(".item-product").eq(0).find(".item-name span");
					var variant_sku = $(variant).find(".item-product").eq(0).find(".item-sku span");
					var variant_status = $(variant).find(".item-status span");

					var variant_name_connect = $(variant).find(".item-product").eq(1).find(".item-name span") || false;
					var variant_sku_connect = $(variant).find(".item-product").eq(1).find(".item-sku span") || false;

					var variant_action = $(variant).find('.item-action');

					if(!checkBox.prop("checked")){
						// Nếu không chọn phân loại thì bỏ qua
						indexVariant++;
						nextVariant();
						return;
					}

					// console.log(`${variant_name.text()}\n${variant_sku.text()}\n${variant_status.text()}\n${variant_name_connect.text()}\n${variant_sku_connect.text()}`);

					var currentSKU = checkSKU(variant_sku.text());

					console.log(currentSKU);

					// Kiểm tra tính hợp lệ của SKU
					if(currentSKU.type){
						// SKU không hợp lệ
						boxLogging(`SKU ${variant_sku.text()} trên sàn không hợp lệ`, [`${variant_sku.text()}`], ["crimson"]);

						// Kiểm tra để mở link của sản phẩm hiện tại
						// if(!openSku){
						// 	// Chưa mở link của sản phẩm chứa phân loại hiện tại
						// 	simulateReactEvent(variant_name, "click", {ctrlKey: true});
						// 	openSku = true;
						// }

						if(variant_status.text().toLowerCase().includes("liên kết thành công") && variant_sku_connect.text().toLowerCase() === "x0"){
							// Đã liên kết
							var linkSKU = checkSKU(variant_sku_connect.text());

							if(linkSKU.type){
								// Hủy liên kết với sku đã liên kết không hợp lệ
								boxLogging(`SKU ${variant_sku.text()} liên kết SKU không hợp lệ (${variant_sku_connect.text()})`);
								variant_action.find("> div[data-for^='tool-tip-cancel']").click();
							}
						}
					}else{
						// SKU hợp lệ
						if(variant_status.text().toLowerCase().includes("liên kết thành công")){
							// Đã liên kết
							var linkSKU = checkSKU(variant_sku_connect.text());

							console.log(currentSKU);
							console.log(linkSKU);

							if(!linkSKU.sku.includes(currentSKU.sku)){
								// Hủy liên kết SKU với sản phẩm không cùng SKU
								boxLogging(`SKU ${variant_sku.text()} liên kết sai`);
								variant_action.find("> div[data-for^='tool-tip-cancel']").click();
							}
						}
					}	
					
					if(!typeLink){
						// Loại liên kết tự động
						if(!variant_status.text().toLowerCase().includes("liên kết thành công")){
							// Liên kết những sản phẩm chưa liên kết
							boxLogging(`Đang liên kết SKU ${variant_sku.text()}`, [`${variant_sku.text()}`], ["orange"]);
							variant_action.find("> div[data-for^='tool-tip-auto']").click();
						}	

						indexVariant++;
						nextVariant();
					}else{
						// Loại liên kết thủ công
						if(!variant_status.text().toLowerCase().includes("liên kết thành công")){
							// Liên kết những sản phẩm chưa liên kết
							boxLogging(`Đang liên kết SKU ${variant_sku.text()}`, [`${variant_sku.text()}`], ["orange"]);
							variant_action.find("> div[data-for^='tool-tip-handle']").click();

							simulateReactEvent(variant_action.find("> div[data-for^='tool-tip-handle'] > div"), "click");

							await delay(200);

							waitForElement($("body"), ".popup-select-product-body .popup-select-product-body .pspb-row", async (el) => {
								var el = $(".popup-select-product-v2");

								var headerInput = $(el).find('.popup-select-product-header input');

								var sku = currentSKU.sku != '' ? currentSKU.sku : "x0";

								simulateClearing(headerInput, 0);
								simulateReactInput(headerInput, sku);

								await delay(1500);

								el = $(".popup-select-product-body .popup-select-product-body");

								console.log(el.text());

								if($(el).text().toLowerCase().includes("không tìm thấy sản phẩm")){
									sku = "x0";
									simulateClearing(headerInput, 0);
									await delay(200);
									simulateReactInput(headerInput, sku);
									await delay(500);
								}

								var popupContents = $(".popup-select-product-body .pspb-row");

								for(var popupContentsElement of popupContents){
									var popContent = $(popupContentsElement);

									var nameBox = popContent.find(".pspb-row-col-right .pspb-line:nth-child(1) .pspb-line-col-left");
									var skuBox = popContent.find(".pspb-row-col-right .pspb-line:nth-child(2) .pspb-line-col-left");

									console.log(`${nameBox.text()} ${skuBox.text()}`);

									if(skuBox.text() == sku){
										simulateReactEvent(popContent, "click");
									}
								}

								simulateReactEvent(checkBox, "click");

								indexVariant++;
								nextVariant();

							}, {once: true});
						}
					}
				}

				nextVariant();
				indexContainer++;
				nextContainer();
			}

			nextContainer();
			
			// $.each(container, (indexContainer, value) => {
				
			// 	var openSku = false;

			// 	var product = container.eq(indexContainer).find(".product-item-line");

			// 	var product_name = product.find(".product-info div[data-id='tooltip']");

			// 	var variant = container.eq(indexContainer).find(".variant-list-wrapper .product-tooltip-wrapper");

			// 	$.each(variant, async (indexVariant, value) => {
			// 		var checkBox = variant.eq(indexVariant).find(".item-checkbox input");
			// 		var variant_name = variant.eq(indexVariant).find(".item-product").eq(0).find(".item-name span");
			// 		var variant_sku = variant.eq(indexVariant).find(".item-product").eq(0).find(".item-sku span");
			// 		var variant_status = variant.eq(indexVariant).find(".item-status span");

			// 		var variant_name_connect = variant.eq(indexVariant).find(".item-product").eq(1).find(".item-name span") || false;
			// 		var variant_sku_connect = variant.eq(indexVariant).find(".item-product").eq(1).find(".item-sku span") || false;

			// 		var variant_action = variant.eq(indexVariant).find('.item-action');

			// 		if(!checkBox.prop("checked"))
			// 			return;

			// 		// console.log(`${variant_name.text()}\n${variant_sku.text()}\n${variant_status.text()}\n${variant_name_connect.text()}\n${variant_sku_connect.text()}`);

			// 		var currentSKU = checkSKU(variant_sku.text());

			// 		console.log(currentSKU);

			// 		// Kiểm tra tính hợp lệ của SKU
			// 		if(currentSKU.type){
			// 			// SKU không hợp lệ
			// 			boxLogging(`SKU ${variant_sku.text()} trên sàn không hợp lệ`, [`${variant_sku.text()}`], ["crimson"]);

			// 			// Kiểm tra để mở link của sản phẩm hiện tại
			// 			// if(!openSku){
			// 			// 	// Chưa mở link của sản phẩm chứa phân loại hiện tại
			// 			// 	simulateReactEvent(variant_name, "click", {ctrlKey: true});
			// 			// 	openSku = true;
			// 			// }

			// 			if(variant_status.text().toLowerCase().includes("liên kết thành công")){
			// 				// Đã liên kết
			// 				var linkSKU = checkSKU(variant_sku_connect.text());

			// 				if(linkSKU.type){
			// 					// Hủy liên kết với sku đã liên kết không hợp lệ
			// 					boxLogging(`SKU ${variant_sku.text()} liên kết SKU không hợp lệ (${variant_sku_connect.text()})`);
			// 					variant_action.find("> div[data-for^='tool-tip-cancel']").click();
			// 				}
			// 			}
			// 		}else{
			// 			// SKU hợp lệ
			// 			if(variant_status.text().toLowerCase().includes("liên kết thành công")){
			// 				// Đã liên kết
			// 				var linkSKU = checkSKU(variant_sku_connect.text());

			// 				console.log(currentSKU);
			// 				console.log(linkSKU);

			// 				if(!linkSKU.sku.includes(currentSKU.sku)){
			// 					// Hủy liên kết SKU với sản phẩm không cùng SKU
			// 					boxLogging(`SKU ${variant_sku.text()} liên kết sai`);
			// 					variant_action.find("> div[data-for^='tool-tip-cancel']").click();
			// 				}
			// 			}
			// 		}	
					
			// 		if(!typeLink){
			// 			// Loại liên kết tự động
			// 			if(!variant_status.text().toLowerCase().includes("liên kết thành công")){
			// 				// Liên kết những sản phẩm chưa liên kết
			// 				boxLogging(`Đang liên kết SKU ${variant_sku.text()}`, [`${variant_sku.text()}`], ["orange"]);
			// 				variant_action.find("> div[data-for^='tool-tip-auto']").click();
			// 			}	
			// 		}else{
			// 			// Loại liên kết thủ công
			// 			if(!variant_status.text().toLowerCase().includes("liên kết thành công")){
			// 				// Liên kết những sản phẩm chưa liên kết
			// 				boxLogging(`Đang liên kết SKU ${variant_sku.text()}`, [`${variant_sku.text()}`], ["orange"]);
			// 				variant_action.find("> div[data-for^='tool-tip-handle']").click();

			// 				simulateReactEvent(variant_action.find("> div[data-for^='tool-tip-handle'] > div"), "click");

			// 				await delay(200);

			// 				var el = $(".popup-select-product-v2");

			// 				var headerInput = $(el).find('.popup-select-product-header input');

			// 				setTimeout(() => { 
			// 					simulateReactInput(headerInput, currentSKU.sku != '' ? currentSKU.sku : "x0");
			// 				}, 1000);
			// 			}
			// 		}		
			// 	})
			// })
		}

		// Flashsale Tiktok
		function flashSaleTiktok(){
			boxAlert("FLASHSALE TIKTOK");

			async function processProductsByLastFlag() {
				let scrolledWithoutNewProducts = false;
				let consecutiveSkippedProducts = 0; // Biến đếm số sản phẩm liên tiếp đã có giá khuyến mãi
				const MAX_CONSECUTIVE_SKIPS = 5; // Ngưỡng: 5 sản phẩm liên tiếp đã có giá

				let productProcesscount = 0

				while (true) {
					if(productProcesscount == 30){
						await delay(5000);
						productProcesscount = 0;
					}
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
						if(!activeStatus.attr("aria-checked"))
							simulateReactEvent(activeStatus, "click");

						boxLogging(`Đang xử lý sản phẩm: "${productName}"`, [`${productName}`], ["cyan"]);

						var currentPrice = nextProductToProcess.find(".theme-arco-table-td").eq(1).find("span p");
						var promotionPrice = nextProductToProcess.find(".theme-arco-table-td").eq(2).find("input").eq(0);
						var promotionPercent = nextProductToProcess.find(".theme-arco-table-td").eq(2).find("input").eq(1);

						if (promotionPrice.length > 0) {
							if (promotionPrice.val().length > 0) {
								boxLogging(`Sản phẩm "${productName}" đã có giá khuyến mãi. Bỏ qua.`, [`${productName}`], ["gray"]);
								consecutiveSkippedProducts++; // Tăng đếm khi sản phẩm đã có giá
								// await delay(50); 
							} else { // Chưa có giá khuyến mãi, tiến hành nhập
								var gia = currentPrice.text();
								gia = gia.replace(/[,.₫]/g, '');
								gia = tachGia(gia).giaDuoi;

								promotionPrice.get(0).scrollIntoView({ behavior: 'smooth', block: 'center' });

								if (parseInt(gia) == 0) {
									boxLogging(`Sản phẩm "${productName}" có giá bằng 0. Bỏ qua.`, [`${productName}`], ["yellow"]);
									consecutiveSkippedProducts = 0; // Reset đếm khi bỏ qua vì giá 0

									// Tắt khuyến mãi cho phân loại không có giá đuôi
									simulateReactEvent(activeStatus, "click");
									// await delay(50);
								} else {
									gia = (parseInt(gia) - 1000 +  1).toString(); // Giảm giá 1000đ và cộng thêm 1đ để tránh giá bằng 0
									// Tương tác UI và chờ đợi
									simulateReactEvent(promotionPrice, "focus");
									// await delay(300);
									// await delay(500);

									// simulateReactInput(promotionPrice, gia, 50);
									
									simulateReactInput(promotionPrice, gia);
									simulateReactEvent(promotionPrice, "blur");

									var formattedGia = gia.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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

						await delay(500); 

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

		// Biến global (hoặc scope cha)
		var listSKUImgTiktok = [];
		var inputMap = {}; // Lưu trữ các đối tượng jQuery input file giả lập { "SKU_UPPERCASE": jQueryFileInputObject }

		// Hàm khởi tạo sự kiện cho nút chọn thư mục
		function setEventThemHinhTheoSKUTiktok() {
			boxLogging("Thiết lập sự kiện chọn thư mục ảnh...", [], ["gray"]);
			const fileInputSelector = ".tp-container.tp-content .layout-future .layout-tab input"; 

			$(fileInputSelector)
				.attr({
					webkitdirectory: true,
					directory: true,
					multiple: true
				})
				.on("change", function () {
					const files = this.files;
					listSKUImgTiktok = []; 
					inputMap = {}; 

					if (files.length === 0) {
						boxLogging("Không có file ảnh nào được chọn.", [], ["yellow"]);
						boxToast("Chưa chọn ảnh!", "warning");
						return;
					}

					for (let i = 0; i < files.length; i++) {
						const file = files[i];
						const fileNameOnly = file.name.split(".")[0].trim().toUpperCase();

						listSKUImgTiktok.push(fileNameOnly); 

						const dt = new DataTransfer();
						dt.items.add(file);

						const newInput = $("<input type='file'>").prop("files", dt.files).addClass("single-file-input");
						inputMap[fileNameOnly] = newInput;
					}
					boxLogging(`Đã nạp ${Object.keys(inputMap).length} ảnh vào bộ nhớ từ thư mục đã chọn.`, [], ["blue"]);
					boxToast(`Đã nạp ${Object.keys(inputMap).length} ảnh vào bộ nhớ!`, "success");
				});
		}

		// Hàm chính để thêm hình ảnh theo SKU
		async function themHinhTheoSKUTiktok() {
			boxLogging("BẮT ĐẦU THÊM HÌNH ẢNH THEO SKU TIKTOK", [], ["green"]);

			if (Object.keys(inputMap).length === 0) {
				boxLogging("Chưa có hình ảnh nào được nạp vào bộ nhớ. Vui lòng chọn thư mục ảnh trước.", [], ["red"]);
				boxToast("Chưa có ảnh! Vui lòng chọn thư mục ảnh.", "error");
				return; 
			}

			const mappingData = []; // Lưu trữ thông tin SKU/Name của các biến thể CÓ TRÊN SÀN VÀ CÓ ẢNH TƯƠNG ỨNG

			// **Bước 1: Thu thập thông tin các SKUs và tên biến thể từ bảng sản phẩm (tab SKU List)**
			const tableRows = $(".core-table-content-inner table tbody tr");
			if (tableRows.length === 0) {
				boxLogging("Không tìm thấy bảng SKU biến thể để lấy thông tin. Đảm bảo bạn đang ở trang quản lý biến thể sản phẩm.", [], ["red"]);
				boxToast("Không tìm thấy bảng SKU!", "error");
				return;
			}

			boxLogging(`Đang thu thập thông tin SKU từ ${tableRows.length} hàng biến thể trên sàn...`, [], ["blue"]);
			for (let i = 0; i < tableRows.length; i++) {
				const row = tableRows.eq(i);
				const nameBox = row.find("td").eq(0).find("p").eq(0); 
				const idElement = row.find("td").eq(0).find("p").eq(1).find(".copyable"); 
				const skuInput = row.find("td").find(`input#skus${idElement.text().trim()}`); 

				if (skuInput.length > 0 && skuInput.val()) {
					const skuValue = skuInput.val().trim().toUpperCase();
					// CHỈ THÊM VÀO MAPPINGDATA NẾU SKU NÀY CÓ TRÊN SÀN VÀ CÓ FILE ẢNH TƯƠNG ỨNG
					if (inputMap[skuValue]) { 
						mappingData.push({
							name: nameBox.text().trim(),
							sku: skuValue,
						});
					} else {
						boxLogging(`SKU "${skuValue}" có trên sàn nhưng không có file ảnh tương ứng. Bỏ qua.`, [], ["gray"]);
					}
				}
			}

			if (mappingData.length === 0) {
				boxLogging("Không tìm thấy SKU nào trên sàn có file ảnh tương ứng đã nạp. Kiểm tra lại tên file và SKUs.", [], ["orange"]);
				boxToast("Không tìm thấy SKU phù hợp!", "warning");
				return;
			}

			boxLogging(`Tìm thấy ${mappingData.length} biến thể SKU có ảnh cần thêm/sửa trên sàn.`, [], ["blue"]);

			// **Bước 2: Lặp qua từng container biến thể trên UI và xử lý ảnh (xóa trước, thêm sau)**
			const variantImageContainers = $("#sale_properties .space-y-12 div > div:nth-child(3) > div:nth-child(1) > div[role='button']");

			if (variantImageContainers.length === 0) {
				boxLogging("Không tìm thấy các khối UI để tải ảnh biến thể. Đảm bảo bạn đang ở phần 'Thuộc tính bán hàng' và các biến thể đã được tạo.", [], ["red"]);
				boxToast("Không tìm thấy UI upload ảnh!", "error");
				return;``
			}

			let processedCount = 0;
			
			for (let i = 0; i < variantImageContainers.length; i++) {
				const currentVariantContainer = variantImageContainers.eq(i);
				const imgBox = currentVariantContainer.find("> div div > div.mr-12"); // Container chứa ảnh hiện tại
				const nameInputForVariant = currentVariantContainer.find("> div div > div.w-full.overflow-hidden").find("input"); // Input chứa tên biến thể

				if (nameInputForVariant.length === 0 || !nameInputForVariant.val()) {
					boxLogging(`Cảnh báo: Không tìm thấy input tên biến thể hoặc giá trị rỗng cho container ${i}. Bỏ qua.`, [], ["yellow"]);
					continue; 
				}

				const currentVariantName = nameInputForVariant.val().trim();
				let foundMapping = null;

				// Tìm trong mappingData đã được lọc (chỉ chứa các SKU có trên sàn và có ảnh)
				for (let j = 0; j < mappingData.length; j++) {
					// So sánh tên biến thể trên UI với tên biến thể trong mappingData
					if (currentVariantName.includes(mappingData[j].name)) {
						foundMapping = mappingData[j];
						break;
					}
				}

				if (foundMapping) {
					const skuToProcess = foundMapping.sku;
					const fileInputEl = inputMap[skuToProcess].get(0); // Lấy phần tử input file giả lập

					// Kiểm tra lại file ảnh có sẵn trong inputMap không (phòng trường hợp lỗi logic mappingData)
					if (!fileInputEl || !fileInputEl.files || fileInputEl.files.length === 0) {
						boxLogging(`Lỗi: Không tìm thấy file ảnh cho SKU [copy]${skuToProcess}[/copy] trong bộ nhớ. Bỏ qua.`, [`${skuToProcess}`], ["red"]);
						currentVariantContainer.css("background","red"); 
						// await delay(500); 
						continue; 
					}
					const file = fileInputEl.files[0];
					const dt = new DataTransfer();
					dt.items.add(file);

					// **THAO TÁC XÓA ẢNH CŨ (ƯU TIÊN HÀNG ĐẦU)**
					// Kiểm tra xem có ảnh đang hiển thị trong container này không
					const existingImagePreview = imgBox.find("img"); 
					if (existingImagePreview.length > 0) {
						boxLogging(`Đang chuẩn bị xóa ảnh cũ cho biến thể "${currentVariantName}" (SKU: [copy]${skuToProcess}[/copy])...`, [`${skuToProcess}`], ["orange"]);
						
						// Di chuột vào ảnh để hiển thị nút xóa
						simulateReactEvent(imgBox.find("> div > div"), "mouseenter"); 
						// await delay(400); // Chờ nút xóa hiện ra (điều chỉnh nếu cần)

						var delButton = imgBox.find(".core-space .core-space-item").eq(1); 

						if (delButton.length > 0) {
							boxLogging(`Đang click nút xóa cho biến thể "${currentVariantName}"...`, [], ["orange"]);
							// delButton.get(0).click(); 
							simulateReactEvent(delButton.find("svg"), "click");
							await delay(200); // Rất quan trọng: Chờ ảnh xóa xong và UI cập nhật
							boxLogging(`Đã xóa ảnh cũ cho biến thể "${currentVariantName}" (SKU: [copy]${skuToProcess}[/copy]).`, [`${skuToProcess}`], ["green"]);
						} else {
							boxLogging(`Không tìm thấy nút xóa ảnh cho biến thể "${currentVariantName}". Có thể ảnh đã được xóa hoặc không có.`, [], ["yellow"]);
						}

						
					} else {
						boxLogging(`Không có ảnh cũ cho biến thể "${currentVariantName}" (SKU: [copy]${skuToProcess}[/copy]) để xóa.`, [`${skuToProcess}`], ["gray"]);
					}

					// **THAO TÁC THÊM ẢNH MỚI (CHỈ THỰC HIỆN SAU KHI ĐẢM BẢO CÓ INPUT)**
					// Tìm lại input[type="file"] sau khi ảnh cũ đã được xóa (nếu có)
					const imgInputTiktok = imgBox.find(".core-upload input[type='file']")[0]; 

					if (!imgInputTiktok) {
						boxLogging(`Lỗi: Không tìm thấy input upload ảnh cho biến thể "${currentVariantName}" (SKU: ${skuToProcess}) sau khi xóa ảnh cũ (nếu có).`, [`${currentVariantName}`, `${skuToProcess}`], ["red"]);
						currentVariantContainer.css("background","red");
						// await delay(500);
						continue;
					}

					boxLogging(`Đang thêm ảnh mới cho biến thể "${currentVariantName}" (SKU: [copy]${skuToProcess}[/copy])...`, [`${skuToProcess}`], ["blue"]);

					$(nameInputForVariant).get(0).scrollIntoView({ behavior: 'smooth', block: 'center' });;
					
					imgInputTiktok.files = dt.files; // Gán file vào input

					const changeEvent = new Event("change", { bubbles: true });
					imgInputTiktok.dispatchEvent(changeEvent);

					currentVariantContainer.css("background","lightgreen");
					boxLogging(`Đã thêm ảnh cho biến thể "${currentVariantName}" (SKU: [copy]${skuToProcess}[/copy]).`, [`${skuToProcess}`], ["green"]);
					
					await delay(100); // Rất quan trọng: Chờ ảnh tải lên và hiển thị đầy đủ
					processedCount++;

				} else {
					// Trường hợp này xảy ra khi biến thể trên UI (currentVariantName)
					// không tìm thấy trong mappingData (tức là không có SKU tương ứng hoặc không có ảnh đã nạp)
					boxLogging(`Biến thể "${currentVariantName}" không có ảnh phù hợp đã nạp. Bỏ qua.`, [`${currentVariantName}`], ["crimson"]);
					currentVariantContainer.css("background","crimson");
					// await delay(500); 
				}
			}

			boxLogging(`Đã hoàn tất thêm hình ảnh theo SKU TikTok cho ${processedCount} biến thể.`, [], ["blue"]);
			boxToast(`Đã thêm xong hình ảnh theo SKU TikTok!`, "success");
		}

		// Lấy ID của sản phẩm Shopee
		function layIDSanPhamShopee(){
			boxLogging("LẤY ID SẢN PHẨM SHOPEE");

			var container = $(".eds-table__main-body").eq(0).find(".eds-scrollbar__wrapper .eds-scrollbar__content table tbody tr");

			var type = $(".tp-container.tp-content .layout-future .layout-tab #copy-type").prop("checked") ? "https://banhang.shopee.vn/portal/product/" : "";
			
			var idList = [];

			$.each(container, (index, value) => {
				var box = container.eq(index).find("> td").eq(1);
				var id = box.find(".item-id.text-overflow2");

				id = id.text().trim();
				id = id.split(":")[1].trim();

				idList.push(`${type}${id}`);
			});

			navigator.clipboard.writeText(idList.join("\n"));

			boxToast(`Đã lấy xong ID sản phẩm Shopee`, "success");
		}

		// Lấy ID của sản phẩm Tiktok
		function layIDSanPhamTiktok(){
			boxLogging("LẤY ID SẢN PHẨM TIKTOK");

			var container = $(".core-table-body table tbody tr");

			var type = $(".tp-container.tp-content .layout-future .layout-tab #copy-type").prop("checked") ? "https://seller-vn.tiktok.com/product/edit/" : "";

			var idList = [];

			$.each(container, (index, value) => {
				try {
					var id = container.eq(index).find("> td").eq(2).find("> div > span > div > div").eq(1).find("> div span[data-id='product.manage.table.columns.id']");

					id = id.text().trim();
					id = id.split(":")[1].trim();

					idList.push(`${type}${id}`);
				}catch (error) {
					boxToast(`Lỗi khi lấy ID sản phẩm tại dòng ${index + 1}: ${error.message}`, "error");
				}
			});

			navigator.clipboard.writeText(idList.join("\n"));

			boxToast(`Đã lấy xong ID sản phẩm TikTok`, "success");
		}

		// Mở link hàng loạt
		function moLink(){
			var data = $(".tp-container.tp-content .layout-future .layout-tab #data");

			var linkList = data.val().split("\n").filter(link => link.trim() !== "");

			$.each(linkList, (index, link) => {
				if(link.trim() !== ""){
					window.open(link, "_blank");
				}
			});

			boxToast(`Đã mở ${linkList.length} link`, "success");
		}

		// Hiển thị thêm danh sách
		function hienThiThemDSSapo(...type){
			var buttonShowMore = $(".product-list-container .product-item-wrapper .show-more button");

			$.each(buttonShowMore, (index, value) => {
				if(buttonShowMore.eq(index).find("span").text().toLowerCase().includes("xem thêm")){
					simulateReactEvent(buttonShowMore.eq(index), "click");
				}
			})		
			boxToast(`Đã mở rộng danh sách`, "success");
		}

		// Khôi phục sản phẩm đã xóa
		function khoiPhucSanPhamLazada(){
			var i = 0;

			function nextItem(){
				var box = $(".pm-table-container .next-table-body table tbody tr");
				var checkBox = box.eq(i).find("td:nth-child(1) input");
				var buttonRecov = box.eq(i).find("td:last-child button");

				if(checkBox.prop("checked")){
					simulateReactEvent(buttonRecov, "click");

					waitForElement($("body"), ".next-overlay-inner .next-dialog-footer button:nth-child(2)", async (el) => {
						simulateReactEvent($(el), "click");

						await delay(1500);

						if (i < box.length){
							i++;
							nextItem();
						}

					}, {once: true});
				}else{
					if (i < box.length){
						i++;
						nextItem();
					}
				}
			}

			nextItem();
		}

		// Xóa phân loại Tiktok
		async function setEventXoaPhanLoaiTiktok() {};

		async function xoaPhanLoaiTiktok(){
			boxLogging("XÓA PHÂN LOẠI TIKTOK");
			inputMap = []; // Reset inputMap trước khi bắt đầu

			var data = $(".tp-container.tp-content .layout-future .layout-tab #data");

			data = data.val().split("\n");

			$.each(data, (index, value) => {
				inputMap.push(data[index].trim());
			});

			console.log(inputMap);

			const tableRows = $(".core-table-content-inner table tbody tr");
			if (tableRows.length === 0) {
				boxLogging("Không tìm thấy bảng SKU biến thể để lấy thông tin. Đảm bảo bạn đang ở trang quản lý biến thể sản phẩm.", [], ["red"]);
				boxToast("Không tìm thấy bảng SKU!", "error");
				return;
			}

			var mappingData = [];

			boxLogging(`Đang thu thập thông tin SKU từ ${tableRows.length} hàng biến thể trên sàn...`, [`${tableRows.length}`], ["blue"]);
			for (let i = 0; i < tableRows.length; i++) {
				var row = tableRows.eq(i);
				var nameBox = row.find("td").eq(0).find("p").eq(0); 
				var idElement = row.find("td").eq(0).find("p").eq(1).find(".copyable"); 
				var skuInput = row.find("td").find(`input#skus${idElement.text().trim()}`);
				var actionRemoveButton = row.find("td:last-child span button"); // Nút xóa biến thể

				if (skuInput.length > 0 && skuInput.val()) {
					var skuValue = skuInput.val().trim();
					// CHỈ THÊM VÀO MAPPINGDATA NẾU SKU NÀY CÓ TRÊN SÀN VÀ CÓ FILE ẢNH TƯƠNG ỨNG
					for(var skuItem of inputMap){
						if (skuValue.includes(skuItem)) {
							simulateReactEvent(actionRemoveButton, "click"); // Di chuột vào nút xóa biến thể
							await delay(1000);
						}
					};
				}
			}

			return

			if (mappingData.length === 0) {
				boxLogging("Không tìm thấy SKU nào trên sàn có file ảnh tương ứng đã nạp. Kiểm tra lại tên file và SKUs.", [], ["orange"]);
				boxToast("Không tìm thấy SKU phù hợp!", "warning");
				return;
			}

			boxLogging(`Tìm thấy ${mappingData.length} biến thể SKU có ảnh cần thêm/sửa trên sàn.`, [`${mappingData.length}`], ["blue"]);

			// **Bước 2: Lặp qua từng container biến thể trên UI và xử lý ảnh (xóa trước, thêm sau)**
			const variantImageContainers = $("#sale_properties .space-y-12 div > div:nth-child(3) > div:nth-child(1) > div[role='button']");

			if (variantImageContainers.length === 0) {
				boxLogging("Không tìm thấy các khối UI để tải ảnh biến thể. Đảm bảo bạn đang ở phần 'Thuộc tính bán hàng' và các biến thể đã được tạo.", [], ["red"]);
				boxToast("Không tìm thấy UI upload ảnh!", "error");
				return;
			}

			let processedCount = 0;
			
			for (let i = 0; i < variantImageContainers.length; i++) {
				const currentVariantContainer = variantImageContainers.eq(i);
				const imgBox = currentVariantContainer.find("> div div > div.mr-12"); // Container chứa ảnh hiện tại
				const nameInputForVariant = currentVariantContainer.find("> div div > div.w-full.overflow-hidden").find("input"); // Input chứa tên biến thể
				var actionRemoveButton = currentVariantContainer.find("> div > div:nth-child(2) > svg:nth-child(1)"); // Nút hành động (xóa biến thể)

				console.log(nameInputForVariant.val());

				if (nameInputForVariant.length === 0 || !nameInputForVariant.val()) {
					boxLogging(`Cảnh báo: Không tìm thấy input tên biến thể hoặc giá trị rỗng cho container ${i}. Bỏ qua.`, [], ["yellow"]);
					continue; 
				}

				const currentVariantName = nameInputForVariant.val().trim();
				let foundMapping = null;

				// Tìm trong mappingData đã được lọc (chỉ chứa các SKU có trên sàn và có ảnh)
				for (let j = 0; j < mappingData.length; j++) {
					// So sánh tên biến thể trên UI với tên biến thể trong mappingData
					if (currentVariantName.includes(mappingData[j].name)) {
						foundMapping = mappingData[j];
						break;
					}
				}

				if (foundMapping) {
					simulateReactEvent(actionRemoveButton, "click"); // Di chuột vào input tên biến thể để hiển thị nút xóa
					await delay(200); // Chờ nút xóa hiện ra (điều
				}
			}

			boxLogging(`Đã hoàn tất thêm hình ảnh theo SKU TikTok cho ${processedCount} biến thể.`, [], ["blue"]);
			boxToast(`Đã thêm xong hình ảnh theo SKU TikTok!`, "success");
		}

		// Thêm hình ảnh theo SKU Lazada
		function setEventThemHinhTheoSKuLazada(){
			boxLogging("Thiết lập sự kiện chọn thư mục ảnh...", [], ["gray"]);
			const fileInputSelector = ".tp-container.tp-content .layout-future .layout-tab input"; 

			$(fileInputSelector)
				.attr({
					webkitdirectory: true,
					directory: true,
					multiple: true
				})
				.on("change", function () {
					const files = this.files;
					listSKUImgTiktok = []; 
					inputMap = {}; 

					if (files.length === 0) {
						boxLogging("Không có file ảnh nào được chọn.", [], ["yellow"]);
						boxToast("Chưa chọn ảnh!", "warning");
						return;
					}

					for (let i = 0; i < files.length; i++) {
						const file = files[i];
						const fileNameOnly = file.name.split(".")[0].trim().toUpperCase();

						listSKUImgTiktok.push(fileNameOnly); 

						const dt = new DataTransfer();
						dt.items.add(file);

						const newInput = $("<input type='file'>").prop("files", dt.files).addClass("single-file-input");
						inputMap[fileNameOnly] = newInput;
					}
					boxLogging(`Đã nạp ${Object.keys(inputMap).length} ảnh vào bộ nhớ từ thư mục đã chọn.`, [], ["blue"]);
					boxToast(`Đã nạp ${Object.keys(inputMap).length} ảnh vào bộ nhớ!`, "success");
				});
		}

		async function themHinhTheoSKULazada(){
			boxLogging("THÊM HÌNH ẢNH THEO SKU LAZADA");

			if (Object.keys(inputMap).length === 0) {
				boxLogging("Chưa có hình ảnh nào được nạp vào bộ nhớ. Vui lòng chọn thư mục ảnh trước.", [], ["red"]);
				boxToast("Chưa có ảnh! Vui lòng chọn thư mục ảnh.", "error");
				return;
			}

			var mappingData = []; // Lưu trữ thông tin SKU/Name của các biến thể CÓ TRÊN SÀN VÀ CÓ ẢNH TƯƠNG ỨNG

			// **Bước 1: Thu thập thông tin các SKUs và tên biến thể từ bảng sản phẩm (tab SKU List)**
			var tableRows = $(".props-sku-table .next-table-inner table tr.next-table-row");
			if (tableRows.length === 0) {
				boxLogging("Không tìm thấy bảng SKU biến thể để lấy thông tin. Đảm bảo bạn đang ở trang quản lý biến thể sản phẩm.", [], ["red"]);
				boxToast("Không tìm thấy bảng SKU!", "error");
				return;
			}

			boxLogging(`Đang thu thập thông tin SKU từ ${tableRows.length} hàng biến thể trên sàn...`, [], ["blue"]);

			for (let i = 0; i < tableRows.length; i++) {
				var row = tableRows.eq(i);
				var nameBox = row.find("td:nth-child(1) button");
				var skuInput = row.find("td:nth-child(5) input");

				if (skuInput.length > 0 && skuInput.val()) {
					var skuValue = skuInput.val().trim().toUpperCase();
					if (inputMap[skuValue] && inputMap[skuValue][0] && inputMap[skuValue][0].files.length > 0) {
						mappingData.push({
							name: nameBox.text().trim(),
							sku: skuValue,
						});
					} else {
						boxLogging(`SKU "${skuValue}" có trên sàn nhưng không có file ảnh tương ứng trong bộ nhớ. Bỏ qua.`, [], ["gray"]);
					}
				}
			}

			if (mappingData.length === 0) {
				boxLogging("Không tìm thấy SKU nào trên sàn có file ảnh tương ứng đã nạp. Kiểm tra lại tên file và SKUs.", [], ["orange"]);
				boxToast("Không tìm thấy SKU phù hợp!", "warning");
				return;
			}

			boxLogging(`Tìm thấy ${mappingData.length} biến thể SKU có ảnh cần thêm/sửa trên sàn.`, [], ["blue"]);

			// **Bước 2: Lặp qua từng container biến thể trên UI và xử lý ảnh (xóa trước, thêm sau)**
			var variantImageContainers = $(".prop-group-body > div:nth-child(2) > div:nth-child(2) > div .prop-option-list .next-form-item");

			if (variantImageContainers.length === 0) {
				boxLogging("Không tìm thấy các khối UI để tải ảnh biến thể. Đảm bảo bạn đang ở phần 'Thuộc tính bán hàng' và các biến thể đã được tạo.", [], ["red"]);
				boxToast("Không tìm thấy UI upload ảnh!", "error");
				return;
			}

			// Hàm xóa ảnh hiện có cho một container biến thể cụ thể (sử dụng đệ quy)
			async function deleteExistingImagesRecursive(containerElement, currentIndex = 0) {
				var existingImages = containerElement.find(".gc-image-list .custom-sale-prop-image-item.gc-image-item");

				if (currentIndex >= existingImages.length) {
					boxLogging("Hoàn thành xóa tất cả ảnh cũ trong container này.", [], ["green"]);
					return; // Dừng đệ quy
				}

				var imgItem = existingImages.eq(currentIndex);
				var imgElement = imgItem.find("img");

				simulateReactEvent(imgElement, "mouseover");

				await delay(500);

				var deleteButton = $(".next-overlay-wrapper .next-balloon-content .image-actions > button").eq(1).find("i");

				if (deleteButton.length > 0) {
					simulateReactEvent(deleteButton, "click");
					boxLogging(`Đã bấm nút xóa ảnh thứ ${currentIndex + 1}.`, [], ["yellow"]);
					await sleep(200); // Đợi ảnh được xóa và UI cập nhật
					
					// Gọi đệ quy cho ảnh tiếp theo
					await deleteExistingImagesRecursive(containerElement, currentIndex); // currentIndex không tăng vì sau khi xóa, phần tử tiếp theo sẽ ở vị trí hiện tại
				} else {
					boxLogging(`Không tìm thấy nút xóa cho ảnh thứ ${currentIndex + 1}. Bỏ qua xóa.`, [], ["red"]);
					// Gọi đệ quy cho ảnh tiếp theo (nếu không thể xóa ảnh hiện tại, chuyển sang ảnh kế tiếp)
					await deleteExistingImagesRecursive(containerElement, currentIndex + 1);
				}
			}


			// Hàm đệ quy để xử lý từng biến thể
			async function processVariantRecursive(index) {
				if (index >= variantImageContainers.length) {
					boxLogging(`Hoàn thành quá trình thêm/sửa ảnh cho ${index} biến thể.`, [], ["green", "bold"]);
					boxToast("Hoàn thành thêm ảnh theo SKU!", "success");
					return; // Dừng đệ quy
				}

				var currentVariantContainer = variantImageContainers.eq(index);
				var dropZone = currentVariantContainer.find(".prop-option-item > div:nth-child(2) .gc-image-upload .gc-drag-area.image-zone");
				var fileInputTarget = currentVariantContainer.find(".prop-option-item > div:nth-child(2) .gc-image-upload input[type='file']");

				var nameInputForVariant = currentVariantContainer.find(".prop-option-item > div:nth-child(1)").find("input");

				if (nameInputForVariant.length === 0 || !nameInputForVariant.val()) {
					boxLogging(`Cảnh báo: Không tìm thấy input tên biến thể hoặc giá trị rỗng cho container ${index}. Bỏ qua.`, [], ["yellow"]);
					await processVariantRecursive(index + 1); // Tiếp tục với biến thể tiếp theo
					return;
				}

				const variantName = nameInputForVariant.val().trim();
				const matchedMapping = mappingData.find(m => m.name === variantName);

				if (!matchedMapping) {
					boxLogging(`Biến thể "${variantName}" không có SKU phù hợp trong mappingData. Bỏ qua.`, [], ["gray"]);
					await processVariantRecursive(index + 1); // Tiếp tục với biến thể tiếp theo
					return;
				}

				const skuToUpload = matchedMapping.sku;
				const filesToUploadInput = inputMap[skuToUpload];

				if (!filesToUploadInput || filesToUploadInput.length === 0 || filesToUploadInput[0].files.length === 0) {
					boxLogging(`SKU "${skuToUpload}" (${variantName}) không có file ảnh nào được nạp trong inputMap. Bỏ qua.`, [], ["gray"]);
					await processVariantRecursive(index + 1); // Tiếp tục với biến thể tiếp theo
					return;
				}

				const filesToUpload = Array.from(filesToUploadInput[0].files);

				boxLogging(`Đang xử lý hình ảnh cho biến thể: "${variantName}" (SKU: ${skuToUpload}) - ${filesToUpload.length} file (Biến thể ${index + 1}/${variantImageContainers.length})`, [], ["cyan"]);

				// **Bước xóa ảnh hiện có (sử dụng đệ quy)**
				deleteExistingImagesRecursive(currentVariantContainer);

				await delay(500);

				// **Giả lập kéo thả file vào vùng dropZone hoặc set trực tiếp vào file input**
				if (fileInputTarget.length > 0) {
					boxLogging(`Đang gán trực tiếp ${filesToUpload.length} file ảnh cho biến thể "${variantName}" qua input type="file"...`, [], ["green"]);

					const dataTransfer = new DataTransfer();
					filesToUpload.forEach(file => {
						if (file instanceof File || (file && typeof file === 'object' && typeof file.name === 'string' && typeof file.size === 'number')) {
							dataTransfer.items.add(file);
						} else {
							boxLogging(`Cảnh báo: File không hợp lệ khi thêm vào DataTransfer cho input direct:`, [], ["red"]);
							console.error(file);
						}
					});

					fileInputTarget[0].files = dataTransfer.files;

					simulateReactEvent(fileInputTarget, 'change');
					simulateReactEvent(fileInputTarget, 'input');

					boxLogging(`Đã gán file cho biến thể "${variantName}".`, [], ["green"]);

				} else if (dropZone.length > 0) {
					boxLogging(`Đang giả lập kéo thả ${filesToUpload.length} file ảnh vào drop zone cho biến thể "${variantName}"...`, [], ["green"]);
					simulateFileDrop(dropZone, filesToUpload);
					boxLogging(`Đã giả lập kéo thả file cho biến thể "${variantName}".`, [], ["green"]);

				} else {
					boxLogging(`Cảnh báo: Không tìm thấy input file hoặc drop zone cho biến thể "${variantName}". Bỏ qua việc tải ảnh.`, [], ["yellow"]);
				}

				await delay(500); // Đợi để Lazada xử lý upload mỗi ảnh
				
				// Gọi đệ quy cho biến thể tiếp theo
				await processVariantRecursive(index + 1);
			}

			// Bắt đầu quá trình đệ quy
			await processVariantRecursive(0);
		}
		
		async function suaGiaTheoSKUTiktok(){
			var type = $(".tp-container.tp-content #type option:selected");
			type = type.data("type");

			var data = $(".tp-container.tp-content .layout-future textarea#data");
			var arrayData = data.val().split("\n");

			var groupVariant = parseInt($("#sale_properties .space-y-12 > div").length) - 1;

			var indexData = 0, indexBox = 0;
			
			async function nextData(){
				if(indexData == arrayData.length){
					boxLogging(`Hoàn tất sửa giá`);
					return;
				}

				var listData = arrayData[indexData].toString().split("\t");
				var sku = listData[0];
				var gia = listData[1];

				var box = $(".core-table-content-inner table tbody tr");

				indexBox = 0;

				async function nextBox(){
					if(indexBox == box.length){
						return;
					}

					var nameBox = box.eq(indexBox).find("td").eq(0).find("p").eq(0);
					var priceBox = box.eq(indexBox).find("td").eq(1 + groupVariant).find("input");
					var stockBox = box.eq(indexBox).find("td").eq(2 + groupVariant).find("input");
					var skuBox = box.eq(indexBox).find("td").eq(3 + groupVariant).find("input");

					switch(type){
						case "all":
							if(skuBox.val().includes(sku)){
								var priceBox1 = priceBox.val().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || "Không";
								var gia1 = gia.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

								if(parseInt(priceBox.val()) < parseInt(gia)){
									boxLogging(`SKU: [copy]${skuBox.val()}[/copy] có giá mới cao hơn giá hiện tại (${gia1} > ${priceBox1})`, [`${skuBox.val()}`], ["crimson"]);
									box.eq(indexBox).css("color", "crimson");
								}else{
									simulateClearReactInput($(priceBox));
									simulateReactInput($(priceBox), editPrice.gia);
									box.eq(indexBox).css("color", "lightgreen");
									boxLogging(`Giá của [copy]${skuBox.val()}[/copy] đã sửa từ ${priceBox1} thành ${gia1}`, [`${skuBox.val()}`, `${priceBox1}`, `${gia1}`], ["lightgreen", "orange", "orange"]);
								}
							}
						break;

						case "duoi":
							if(skuBox.val().includes(sku)){
								var price = tachGia(priceBox.val());
								var giaDau = price.giaDau;
								var giaDuoi = gia;

								var editPrice = gopGia(giaDau, giaDuoi);

								if(parseInt(editPrice.gia) > parseInt(price.gia)){
									giaDau = parseInt(giaDau) - 1000;

									editPrice = gopGia(giaDau, giaDuoi);
								}

								if(parseInt(giaDuoi) > parseInt(giaDau)){
									boxLogging(`Bỏ qua SKU: [copy]${skuBox.val()}[/copy] (có giá đuôi cao hơn giá đầu)`, [`${skuBox.val()}`], ["crimson"]);
									box.eq(indexBox).css("color", "crimson");
									return;
								}else if(parseInt(giaDuoi) >= parseInt(giaDau) - 5000){
									boxLogging(`SKU [copy]${skuBox.val()}[/copy] có giá đuôi cận giá đầu`, [`${skuBox.val()}`], ["orange"]);
									simulateClearReactInput($(priceBox));
									simulateReactInput($(priceBox), editPrice.gia);
									box.eq(indexBox).css("color", "orange");
								}else{
									boxLogging(`Giá của [copy]${skuBox.val()}[/copy] đã sửa từ ${price.gia} thành ${editPrice.gia}`, [`${skuBox.val()}`, `${price.gia}`, `${editPrice.gia}`], ["lightgreen", "green", "green"]);
									simulateClearReactInput($(priceBox));
									simulateReactInput($(priceBox), editPrice.gia);
									box.eq(indexBox).css("color", "lightgreen");
								}
							}
						break;

						case "dau":
							if(skuBox.val().includes(sku)){
								var price = tachGia(priceBox.val());
								var giaDau = gia;
								var giaDuoi = price.giaDuoi;

								var editPrice = gopGia(giaDau, giaDuoi);

								if(parseInt(editPrice.gia) > parseInt(price.gia)){
									boxLogging(`SKU: [copy]${skuBox.val()}[/copy] có giá mới cao hơn giá hiện tại (${editPrice.gia} > ${price.gia})`, [`${skuBox.val()}`], ["crimson"]);
									box.eq(indexBox).css("color", "crimson");
									return;
								}

								if(parseInt(giaDuoi) > parseInt(giaDau)){
									boxLogging(`Bỏ qua SKU: [copy]${skuBox.val()}[/copy] (có giá đuôi cao hơn giá đầu)`, [`${skuBox.val()}`], ["crimson"]);
									box.eq(indexBox).css("color", "crimson");
									return;
								}else if(parseInt(giaDuoi) >= parseInt(giaDau) - 5000){
									boxLogging(`SKU [copy]${skuBox.val()}[/copy] có giá đuôi cận giá đầu`, [`${skuBox.val()}`], ["orange"]);
									simulateClearReactInput($(priceBox));
									simulateReactInput($(priceBox), editPrice.gia);
									box.eq(indexBox).css("color", "orange");
								}else{
									boxLogging(`Giá của [copy]${skuBox.val()}[/copy] đã sửa từ ${price.gia} thành ${editPrice.gia}`, [`${skuBox.val()}`, `${price.gia}`, `${editPrice.gia}`], ["lightgreen", "green", "green"]);
									simulateClearReactInput($(priceBox));
									simulateReactInput($(priceBox), editPrice.gia);
									box.eq(indexBox).css("color", "lightgreen");
								}
							}
						break;
					}

					indexBox++;
					await nextBox();
				};

				indexData++;
				await nextBox();
				await nextData();
			};

			await nextData();

			boxToast("Đã sửa giá các SKU được chọn", "success")
		}

		// Lấy ID sản phẩm Lazada
		function layIDSanPhamLazada(){
			var content = $(".pm-table-container .next-table-inner > div.next-table-body > table > tbody > .next-table-row");

			var type = $(".tp-container.tp-content .layout-future .layout-tab #copy-type").prop("checked") ? "https://sellercenter.lazada.vn/apps/product/publish?productId=" : "";

			var indexContent = 0;

			var idList = [];

			function nextContent(){
				if(indexContent >= content.length){
					boxLogging(`Đã sao chép các liên kết`);
					boxToast(`Đã sao chép các liên kết`, "success");
					navigator.clipboard.writeText(idList.join("\n"));
					return;
				}

				var checKBox = content.eq(indexContent).find("td:nth-child(1) input");
				var name = content.eq(indexContent).find("td:nth-child(2) .right-cell a");

				if(name.attr("href") != undefined){
					var link = name.attr("href").split("/");

					link = link[link.length - 1];
					link = link.replace("i", "");
					link = link.replace(".html", "");

					idList.push(type + link);
				}

				indexContent++;
				nextContent();
			}

			nextContent();
		}

		// Sửa giá theo SKU Lazada
		function themGiaTheoSKULazada(){
			var box = $(".next-table-body .next-table-row");

			var type = $(".tp-container.tp-content #type option:selected");
			type = type.data("type");

			var data = $(".tp-container.tp-content .layout-future .layout-tab #data").val();

			data = data.split("\n");

			var indexData = 0;

			async function nextData(){
				if(indexData >= data.length){
					boxLogging(`Đang kiểm tra gia đuôi`)
					await delay(500);
					giaDuoiLazada();
					return;
				}
				var indexBox = 0;

				var line = data[indexData].split("\t");
				var sku = line[0].toString().trim();
				var gia = line[1].toString().trim();
		
				function nextBox(){
					if(indexBox >= box.length){
						return;
					}

					var name = box.eq(indexBox).find("td:nth-child(1) button span");
					var priceBox = box.eq(indexBox).find("td.price input");
					var skuBox = box.eq(indexBox).find("td.SellerSku input");

					switch(type){
						case "all":
							if(skuBox.val().includes(sku)){
								var priceBox1 = priceBox.val().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || "Không";
								var gia1 = gia.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

								if(parseInt(priceBox.val()) < parseInt(gia)){
									boxLogging(`SKU: [copy]${skuBox.val()}[/copy] có giá mới cao hơn giá hiện tại (${gia1} > ${priceBox1})`, [`${skuBox.val()}`], ["crimson"]);
									box.eq(indexBox).css("background", "crimson");
								}else{
									simulateClearReactInput(priceBox);
									priceBox.val(gia);
									simulateReactEvent($(priceBox), "input");
									box.eq(indexBox).css("background", "lightgreen");
									boxLogging(`Giá của [copy]${skuBox.val()}[/copy] đã sửa từ ${priceBox1} thành ${gia1}`, [`${skuBox.val()}`, `${priceBox1}`, `${gia1}`], ["lightgreen", "orange", "orange"]);
								}
							}
						break;

						case "duoi":
							if(skuBox.val().includes(sku)){
								var price = tachGia(priceBox.val());
								var giaDau = price.giaDau;
								var giaDuoi = gia;

								var editPrice = gopGia(giaDau, giaDuoi);

								if(parseInt(editPrice.gia) > parseInt(price.gia)){
									giaDau = parseInt(giaDau) - 1000;

									editPrice = gopGia(giaDau, giaDuoi);
								}

								if(parseInt(giaDuoi) > parseInt(giaDau)){
									boxLogging(`Bỏ qua SKU: [copy]${skuBox.val()}[/copy] (có giá đuôi cao hơn giá đầu)`, [`${skuBox.val()}`], ["crimson"]);
									box.eq(indexBox).css("background", "crimson");
									return;
								}else if(parseInt(giaDuoi) >= parseInt(giaDau) - 5000){
									boxLogging(`SKU [copy]${skuBox.val()}[/copy] có giá đuôi cận giá đầu`, [`${skuBox.val()}`], ["orange"]);
									box.eq(indexBox).css("background", "orange");
									simulateClearReactInput(priceBox);
									priceBox.val(editPrice.gia);
									simulateReactEvent($(priceBox), "input");
								}else{
									boxLogging(`Giá của [copy]${skuBox.val()}[/copy] đã sửa từ ${price.gia} thành ${editPrice.gia}`, [`${skuBox.val()}`, `${price.gia}`, `${editPrice.gia}`], ["lightgreen", "green", "green"]);
									simulateClearReactInput(priceBox);
									priceBox.val(editPrice.gia);
									simulateReactEvent($(priceBox), "input");
									box.eq(indexBox).css("background", "lightgreen");
								}
							}
						break;

						case "dau":
							if(skuBox.val().includes(sku)){
								var price = tachGia(priceBox.val());
								var giaDau = gia;
								var giaDuoi = price.giaDuoi;

								var editPrice = gopGia(giaDau, giaDuoi);

								if(parseInt(editPrice.gia) > parseInt(price.gia)){
									boxLogging(`SKU: [copy]${skuBox.val()}[/copy] có giá mới cao hơn giá hiện tại (${editPrice.gia} > ${price.gia})`, [`${skuBox.val()}`], ["crimson"]);
									box.eq(indexBox).css("background", "crimson");
									return;
								}

								if(parseInt(giaDuoi) > parseInt(giaDau)){
									boxLogging(`Bỏ qua SKU: [copy]${skuBox.val()}[/copy] (có giá đuôi cao hơn giá đầu)`, [`${skuBox.val()}`], ["crimson"]);
									box.eq(indexBox).css("background", "crimson");
									return;
								}else if(parseInt(giaDuoi) >= parseInt(giaDau) - 5000){
									boxLogging(`SKU [copy]${skuBox.val()}[/copy] có giá đuôi cận giá đầu`, [`${skuBox.val()}`], ["orange"]);
									box.eq(indexBox).css("background", "orange");
									simulateClearReactInput(priceBox);
									priceBox.val(editPrice.gia);
									simulateReactEvent($(priceBox), "input");
								}else{
									boxLogging(`Giá của [copy]${skuBox.val()}[/copy] đã sửa từ ${price.gia} thành ${editPrice.gia}`, [`${skuBox.val()}`, `${price.gia}`, `${editPrice.gia}`], ["lightgreen", "green", "green"]);
									simulateClearReactInput(priceBox);
									priceBox.val(editPrice.gia);
									simulateReactEvent($(priceBox), "input");
									box.eq(indexBox).css("background", "lightgreen");
								}
							}
						break;
					}

					indexBox++;
					nextBox();
				}

				indexData++;
				nextBox();

				nextData();
			}

			nextData();
		}

		// Chat với AI
		function aiChat(){
			$(".tp-container.tp-content .layout-future .layout-tab .typing-content input").on("keypress", function(e){
				if(e.keyCode == 13){
					var prompt = $(this).val();
					$(this).val("");
					$(".tp-container.tp-content .layout-future .layout-tab .message-content").append($(`
						<div class="user-message">
							<p>${prompt}<p>
						</div>
					`))

					$(".layout-tab .message-content .user-message").css({
						"border-radius": "5px",
						"padding": "10px",
						"margin-bottom": "10px",
						"width": "fit-content",
						"max-width": "80%",
						"float": "right",
						"clear": "both",
					})

					$(".tab-content#tab-online-function").scrollTop($(".tab-content#tab-online-function").prop("scrollHeight"));

					socket.emit("aichat", prompt);
				}
			})

			socket.on("ai_error", (res) => {
				$(".tp-container.tp-content .layout-future .layout-tab .message-content").append($(`
					<div class="ai-message error">
						<p>${res}<p>
					</div>
				`))

				$(".layout-tab .message-content .ai-message").css({
					"border-radius": "5px",
					"padding": "10px",
					"margin-bottom": "10px",
					"width": "fit-content",
					"max-width": "80%",
					"float": "left",
					"clear": "both",
					"word-wrap": "break-word",
					"overflow-wrap": "break-word",
				})

				$(".layout-tab .message-content .ai-message.error").css({
					"font-weight": "700",
					"color": "#ff0000",
					"word-wrap": "break-word",
					"overflow-wrap": "break-word",
				})

				$(".tab-content#tab-online-function").scrollTop($(".tab-content#tab-online-function").prop("scrollHeight"));
			})

			socket.on("ai_response", (res) => {
				$(".tp-container.tp-content .layout-future .layout-tab .message-content").append($(`
					<div class="ai-message">
						<p>${res}<p>
					</div>
				`))

				$(".layout-tab .message-content .ai-message").css({
					"border-radius": "5px",
					"padding": "10px",
					"margin-bottom": "10px",
					"width": "fit-content",
					"max-width": "80%",
					"float": "left",
					"clear": "both",
					"word-wrap": "break-word",
					"overflow-wrap": "break-word",
				})

				$(".tab-content#tab-online-function").scrollTop($(".tab-content#tab-online-function").prop("scrollHeight"));
			})
		}
	}
