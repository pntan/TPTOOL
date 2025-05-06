	'use strict';

	// Trạng thái hiển thị của giao diện
	var createUI = false;

	// Phiên bản của chương trình
	const VERSION = "2.0.0";

	/*var Jqu = document.createElement("script");
	Jqu.setAttribute("src", "https://code.jquery.com/jquery-3.7.1.min.js");
	Jqu.setAttribute("rel", "preload");
	Jqu.setAttribute("async", "async");
	document.head.appendChild(Jqu);

	var JquUI = document.createElement("script");
	JquUI.setAttribute("src", "https://code.jquery.com/ui/1.14.1/jquery-ui.js");
	JquUI.setAttribute("rel", "preload");
	document.head.appendChild(JquUI);*/

	window.onload = function(){
		// Danh sách thư viện cần thêm
		const LIBRARIES = [
			"https://code.jquery.com/jquery-3.7.1.min.js",
			"https://code.jquery.com/ui/1.14.1/jquery-ui.js",
			"https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js",
			"https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js",
			"https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js",
			"https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js",
		];

		const actionMap = {
			// --- SHOPEE
			"giaDuoiShopee": giaDuoiShopee,
			"kTr5LanGiaShopee": kTr5LanGiaShopee,
			"tinhGiaBanShopee": tinhGiaBanShopee,
			"flashSaleShopee": flashSaleShopee,
			"kiemTraMaPhanLoaiShopee": kiemTraMaPhanLoaiShopee,
			"suaGiaSKUShopee": suaGiaSKUShopee,
			"suaHinhSKUShopee": suaHinhSKUShopee,
			"themKyTuPhanLoaiShopee": themKyTuPhanLoaiShopee,
			// "kiemTraPhanLoaiShopee": kiemTraPhanLoaiShopee,
			// "themPhanLoaiShopee": themPhanLoaiShopee,
			// "giaDuoiChuongTrinhShopee": giaDuoiChuongTrinhShopee,
			// "comboKMShopee": comboKMShopee,
			// "themPhanLoaiNhieuLinkShopee": themPhanLoaiNhieuLinkShopee,
			// //"keoPhanLoaiShopee": keoPhanLoaiShopee,
			// //"batKhuyenMaiShopee": batKhuyenMaiShopee,
			// // --- TIKTOK
			// "tgFlashSaleTiktok": tgFlashSaleTiktok,
			// "giaDuoiTiktok": giaDuoiTiktok,
			// "ktraKhuyenMaiTiktok": ktraKhuyenMaiTiktok,
			// // --- SAPO
			// "kiemTraTonSapo": kiemTraTonSapo,
			// // -- LAZADA
			"giaDuoiLazada": giaDuoiLazada,
			// "themPhanLoaiLazada": themPhanLoaiLazada,
			// "themGiaTheoSKULazada": themGiaTheoSKULazada,
			// "ktraGiaChuongTrinhKMLazada": ktraGiaChuongTrinhKMLazada,
			// //-- KHÁC
			// "splitExcelFile": splitExcelFile,
			// "compareVoucher": compareVoucher,
		};

		// Thêm thư viện
		function loadLibrary(scripts, callback){
			let index = 0;

			function loadNext(){
				if (index >= scripts.length){
					if (callback)
						callback();
					return;
				}

				let script = document.createElement("script");
				script.src = scripts[index];

				script.onload = () => {
					boxAlert(`Đã thêm ${scripts[index]}`);
					index++;
					loadNext();
				}

				script.onerror = (e) => {
					boxAlert(`Có lỗi khi thêm ${scripts[index]} (${e})`, "error");
					index++;
					loadNext();
				}

				document.head.appendChild(script);
			}
			loadNext();
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
			const nonce = getNonce();
			if (!nonce) return console.warn('Không tìm thấy nonce');

			// Style inline
			$('style:not([nonce])').attr('nonce', nonce);

			// Iframe
			$('iframe:not([nonce])').attr('nonce', nonce);

			// Script do tool tạo
			$('script:not([nonce]):not([src])').attr('nonce', nonce);
		}

		// Giao diện nổi
		function boxPopup(text, words = [], colors = []){
			var log = $(".tp-popup .content");
			log.parent().toggle("slow");
			var data = log.empty().html();
			if (words.length === 0) {
				log.html(`${data}\n(${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}) <span style="color: black;">${text}</span>`);
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
				log.html(`${data}\n(${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}) ${modifiedText}`);
			}
			log.scrollTop(log.prop("scrollHeight"));
		}

		// Nhấn để sao chép nội dung đã được đánh dấu
		$("body").on("click", ".copyable", function(){
			navigator.clipboard.writeText($(this).text().trim());
			boxToast(`Đã sao chép nội dung <u>${$(this).text().trim()}`);
		})

		// Sự kiện nhấn tab cho textarea
		waitForElement($("body"), ".tp-container.tp-content textarea", (el) => {
			boxAlert("Đang theo dõi sự kiện nhấn tab của textarea")
			$(el).on("keydown", function(event){
				if (event.keyCode === 9) { // keyCode 9 là mã ASCII của phím Tab
				event.preventDefault();

				const start = this.selectionStart;
				const end = this.selectionEnd;

				$(this).val($(this).val().substring(0, start) + '\t' + $(this).val().substring(end));

				this.selectionStart = this.selectionEnd = start + 1;
				}
			})
		}, {once: false})

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
					console.log(`%cTanPhan: %c${content}`, "color: crimson; font-size: 2rem", "color: yellow; font-size: 1.5rem");
				break;
				case "error":
					console.error(`%cTanPhan: %c${content}`, "color: crimson; font-size: 2rem", "color: yellow; font-size: 1.5rem")
				break;
				case "warn":
					console.warn(`%cTanPhan: %c${content}`, "color: crimson; font-size: 2rem", "color: yellow; font-size: 1.5rem");
				break;
			}
		}

		// Tạo thông báo bằng taast
		function boxToast(message, type = "info", duration = 3000) {
			const toast = $(`<div class="toast ${type}">${message}</div>`);
			$("#toast-container").append(toast);

			// Bắt đầu animation
			setTimeout(() => toast.addClass("show"), 10);

			// Tự động ẩn
			setTimeout(() => {
				toast.removeClass("show");
				setTimeout(() => toast.remove(), 300);
			}, duration);
		}

		// Hàm giả lập thao tác người dùng
		function simulateReactEvent(input, type, options = {}) {
			var el = input[0];

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
							cancelable: true
					});
					el.dispatchEvent(event);
				});
			}

			// Nếu là phím đặc biệt → dùng hàm con
			var knownKeys = ['enter', 'tab', 'escape', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'];
			if (knownKeys.includes(type.toLowerCase())) {
				pressKey(type);
			}
			// Nếu là sự kiện bàn phím tự do
			else if (['keydown', 'keypress', 'keyup'].includes(type)) {
				var event = new KeyboardEvent(type, {
					key: options.key || '',
					code: options.code || '',
					bubbles: true,
					cancelable: true
				});
				el.dispatchEvent(event);
			}
			// Các loại sự kiện khác (click, input, blur,...)
			else {
				event = new Event(type, { bubbles: true, cancelable: true });
				el.dispatchEvent(event);
			}
		}

		// Giả lập input file
		function simulateReactInputFile(input) {
			var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'files')?.set;
			if (nativeInputValueSetter) {
				nativeInputValueSetter.call(input, input.files);
			}

			// Trigger lại các sự kiện input và change để React có thể nhận diện sự thay đổi
			var inputEvent = new Event('input', { bubbles: true });
			var changeEvent = new Event('change', { bubbles: true });

			input.dispatchEvent(inputEvent);
			input.dispatchEvent(changeEvent);
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
			const el = inputElement[0];

			// Gán trực tiếp thông qua setter gốc (để React nhận biết)
			const nativeSetter = Object.getOwnPropertyDescriptor(el.__proto__, 'value')?.set;
			nativeSetter ? nativeSetter.call(el, pastedText) : inputElement.val(pastedText);

			// Tạo clipboardData giả để gửi sự kiện paste
			const pasteEvent = new ClipboardEvent('paste', {
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

		// Theo dõi phần tử
		function waitForElement(root, selector, callback, options = {}) {
			var {
				once = true,
				timeout = null
			} = options;

			// Kiểm tra kỹ kiểu node
			const rootNode = (window.jQuery && root instanceof window.jQuery) ? root[0] : (Array.isArray(root) && root[0] instanceof Node) ? root[0] : root;

			if (!(rootNode instanceof Node)) {
				console.error("❌ waitForElement: root không phải DOM node hợp lệ:", rootNode);
				return;
			}

			var observer = new MutationObserver(() => {
				var el = rootNode.querySelector(selector);
				if (el) {
					callback(el);
					if (once) {
						observer.disconnect();
						if (timer) clearTimeout(timer);
					}
				}
			});

			observer.observe(rootNode, {
				childList: true,
				subtree: true
			});

			var el = rootNode.querySelector(selector);
				if (el) {
				callback(el);
				if (once) {
					observer.disconnect();
				}
			}

			let timer = null;
				if (timeout) {
				timer = setTimeout(() => {
					observer.disconnect();
				}, timeout);
			}

			return observer;
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

			return {giaTruoc, giaSau, lastPrice};
		}

		// Kiểm tra tự động mở các danh sách...
		function checkPage(){
			var domain = window.location;
			var host = domain.host, pathName = domain.pathname, port = domain.port, protocol = domain.protocol;

			if(pathName.includes("portal/product/")){
				if(pathName.includes("list")){
					waitForElement($("body"), ".product-variation-item.product-more-models", (el) => {
						$(".product-variation-item.product-more-models").click();
					})
				}else{
					waitForElement($("body"), ".variation-model-table-footer button.eds-button.eds-button--link.eds-button--normal", (el) => {
						simulateReactEvent($(el), "click");
						boxToast("Đã mở rộng danh sách phân loại");
					});
				}
			}
		}

		// Khải tạo chương trình
		function INITCONFIG(){
			boxAlert("ĐANG KHỞI TẠO");
			loadLibrary(LIBRARIES, () => {
				if (createUI)
					return;
				createUI = true;
				createLayout();
				applyNonce();

				// Kiểm tra tự động mở các danh sách
				checkPage();
			});
		}

		INITCONFIG();

		function createLayout(){
			if(window.parent != window.top){
				boxAlert(`Đã bỏ qua một lần thêm giao diện`);
				return;
			}

			boxAlert(`Đang dựng giao diện`);

			
			// Giao diện HTML
			$("body").append($(`
				<!-- GIAO DIỆN CHƯƠNG TRÌNH -->
				<div id="toast-container"></div>
				<div class="tp-container tp-button-toggle">
					<p>Chuẩn Mua</p>
				</div>

				<div class="tp-container tp-content">
					<div class="program-title">
						<p>Công Cụ Hỗ Trợ</p>
						<p>Ver ${VERSION}</p>
					</div>

					<div class="program-log">
						<pre class="logging"></pre>
					</div>

					<div class="program-tab">
						<div class="tab-title">
							<div class="tab-box" data-tab="tab-function">
								<p>Chức Năng</p>
							</div>
							<div class="tab-box" data-tab="tab-custom">
								<p>Tùy Chỉnh</p>
							</div>
						</div>
					</div>

					<div id="tab-function" class="tab-content program-future active">
						<select id="functionSelect">
							<option hidden>Chọn Chức Năng</option>

							<!-- Shopee -->
							<optgroup label="Shopee">
								<option data-func="giaDuoiShopee">Cập Nhật Giá Đuôi</option>
								<option data-func="flashSaleShopee" data-layout="flashSaleShopeeLayout">Flash Sale</option>
								<option data-func="tinhGiaBanShopee" data-layout="tinhGiaBanShopeeLayout">Tính Giá Bán</option>
								<option data-func="kTr5LanGiaShopee" data-layout="kTr5LanGiaShopeeLayout">Kiểm Tra 5 Lần Giá</option>
								<option data-func="kiemTraMaPhanLoaiShopee">Hiển Thị Mã Phân Loại</option>
								<option data-func="suaGiaSKUShopee" data-layout="suaGiaSKUShopeeLayout">Sửa Giá Theo SKU</option>
								<option data-func="suaHinhSKUShopee" data-layout="suaHinhSKUShopeeLayout">Sửa Hình Theo SKU</option>
								<option data-func="themKyTuPhanLoaiShopee" data-layout="themKyTuPhanLoaiShopeeLayout">Sửa Tên Phân Loại</option>
								<option disabled data-func="giaDuoiChuongTrinhShopee" data-layout="giaDuoiChuongTrinhShopeeLayout">Cập Nhật Giá Đăng Ký Chương Trình</option>
								<option disabled data-func="themPhanLoaiShopee" data-layout="themPhanLoaiShopeeLayout">Thêm Phân Loại</option>
								<option disabled data-func="keoPhanLoaiShopee" data-layout="keoPhanLoaiShopeeLayout">Kéo Phân Loại</option>
								<option disabled data-func="kiemTraPhanLoaiShopee" data-layout="kiemTraPhanLoaiShopeeLayout">Kiểm Tra Phân Loại</option>
								<option disabled data-func="comboKMShopee" data-layout="comboKMShopeeLayout">Điều Chỉnh Combo Khuyến Mãi</option>
								<option disabled data-func="themPhanLoaiNhieuLinkShopee" data-layout="themPhanLoaiNhieuLinkShopeeLayout">Thêm Phân Loại Nhiều Link</option>?
							</optgroup>

							<!-- Lazada -->
							<optgroup label="Lazada">
								<option data-func="giaDuoiLazada">Cập Nhật Giá Đuôi</option>
								<option disabled data-func="themPhanLoaiLazada" data-layout="themPhanLoaiShopeeLayout">Thêm Phân Loại</option>
								<option disabled data-func="themGiaTheoSKULazada" data-layout="themGiaTheoSKULazadaLayout">Sửa giá theo SKU</option>
								<option disabled data-func="ktraGiaChuongTrinhKMLazada" data-layout="ktraGiaChuongTrinhKMLazadaLayout">Kiểm Tra Giá Khuyến Mãi</option>
							</optgroup>

							<!-- TikTok -->
							<optgroup label="TikTok">
								<option disabled data-func="giaDuoiTiktok">Cập Nhật Giá Đuôi</option>
								<option disabled data-func="ktraKhuyenMaiTiktok" data-layout="ktraKhuyenMaiTiktokLayout">Kiểm Tra Văng Khuyến Mãi</option>
							</optgroup>

							<!-- Sapo -->
							<optgroup label="Sapo">
								<option disabled data-func="kiemTraTonSapo" data-layout="kiemTraTonSapoLayout">Kiểm Tra Tồn</option>
							</optgroup>

							<!-- Khác -->
							<optgroup label="Khác">
								<!-- <option disabled data-func="autobrowser" data-layout="autobrowserLayout">Trình Duyệt Tự Động</option> -->
								<option disabled data-func="splitExcelFile" data-layout="splitExcelFileLayout">Chia Nhỏ File Excel</option>
								<option disabled data-func="compareVoucher" data-layout="compareVoucherLayout">So Sánh Voucher</option>
							</optgroup>

						</select>

						<div class="layout-future">
						</div>
					</div>

					<div id="tab-custom" class="tab-content">
					</div>

					<div class="button-control">
						<button id="excute-command" data-func="">Chạy</button
					</div>
					<div class="resize-handle top-left"></div>
					<div class="resize-handle top-right"></div>
					<div class="resize-handle bottom-left"></div>
					<div class="resize-handle bottom-right"></div>
				</div>
			`));

			$("body").append($(`
				<style class="tp-style">
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
						min-width: 220px;
						max-width: 300px;
						padding: 12px 16px;
						border-radius: 6px;
						color: white;
						font-size: 14px;
						box-shadow: 0 2px 8px rgba(0,0,0,0.2);
						opacity: 0;
						transform: translateY(20px);
						transition: all 0.3s ease;
						position: relative;
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

					.tp-container{
						position: fixed;
						z-index: 9999999;
						user-select: none;
					}

					.tp-container *::-webkit-scrollbar {
						display: none;
					}

					.tp-button-toggle{
						left: calc(100% - 7%);
						top: calc(100% - 20%);
						width: auto;
						height: auto;
						aspect-ratio: 1 / 1;
						border-radius: 100px;
						background: rgba(255, 255, 255, 0.6);
						box-shadow: -5px 5px 10px #000;
						padding: 0.5vw 0.5vw;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 1.5rem;
						font-weight: 700;
						opacity: 0.6;
					}

					.tp-button-toggle:hover{
						opacity: 1;
					}

					.tp-content{
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
					}

					.tp-content > div{
						margin: 1vh 0;
					}

					.tp-content .copyable{
						user-select: text;
						text-decoration: underline;
						cursor: pointer;
					}

					.tp-content .program-title{
						width: 100%;
						text-align: center;
						font-size: 2rem;
						font-weight: 700;
						padding: 1vh 0;
					}

					.tp-content .program-title p:nth-child(1){
						font-size: 1.25em;
					}

					.tp-content .program-title p:nth-child(2){
						font-size: 0.75em;
					}

					.tp-content .program-log{
						width: 100%;
						height: auto;
						max-height: 20vh;
						overflow: hidden;
						overflow-y: scroll;
						background: #fff;
						border-radius: 10px;
					}

					.tp-content .program-log pre{
						width: 100%;
						height: 100%;
						text-indent: 3%;
						white-space: pre-wrap;
						word-wrap: break-word;
						overflow-wrap: break-word;
						padding: 2vh 2vw;
					}

					.tab-title {
						display: flex;
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
					}

					.tab-box.active {
						background: #fff;
						color: #000;
						box-shadow: 0 0 10px #00000040;
					}

					.tab-content {
						display: none;
					}

					.tab-content.active {
						display: block;
					}

					.tp-content .program-future{
						width: 100%;
						height: auto;
					}

					.tp-content .program-future select{
						width: 100%;
						height: 5vh;
						line-height: 5vh;
						border-radius: 10px;
						text-indent: 10px;
						margin-bottom: 2vh;
					}

					.tp-content .program-future select optgroup{
						font-size: 1.5em;
						text-indent: 5%;
					}

					.tp-content .program-future select optgroup option{
						font-size: 1em;
					}

					.tp-content .layout-future{
						width: 100%;
						height: auto;
					}

					.tp-content .layout-future * {
						margin-bottom: 10px;
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
						height: 4vh;
						line-height: 4vh;
					}

					.tp-content .button-control button{
						width: 100%;
						height: 100%;
						background: crimson;
						color: #fff;
						font-weight: 700;
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

			// Chọn tab
			$('.tab-box').click(function () {
				var tabToShow = $(this).data('tab');

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
			$(".tp-container.tp-button-toggle").on("dblclick", function(){
				if($(this).hasClass("active")){
					$(".tp-container.tp-content").css("display", "none");
					$(this).removeClass("active");
					boxAlert("Ẩn Giao Diện");
				}else{
					$(".tp-container.tp-content").css("display", "block");
					$(this).addClass("active");
					boxAlert("Hiện Giao Diện");
				}
			});

			//Chọn chức năng
			$("select#functionSelect").on("change", function(){
				var option = $(this).find("option:selected");
				$("#excute-command").show();
				$("#excute-command").text("Chạy");
				$("#excute-command").attr("data-func", option.attr("data-func"));
				$(".layout-tab").remove();
				boxLogging(`Đã chọn ${option.parent().attr("label")} > ${option.text()}`, [`${option.parent().attr("label")}`, `${option.text()}`], ["crimson", "crimson"]);
				createLayoutTab(option.attr("data-layout"));
				applyNonce();
			});

			$("#excute-command").on("click", function() {
				const func = $(this).attr("data-func");
				if (actionMap[func]) actionMap[func]();
			});

			$.each($("iframe"), (index, value) => {
				$("iframe").eq(index).remove();
			});
		}

		// Dựng giao diện của mỗi lựa chọn
		function createLayoutTab(layoutName){
		layoutName = layoutName == undefined ? "Không có giao diện" : layoutName;
		boxLogging(`Giao Diện: ${layoutName}`, [`${layoutName}`], ["crimson"]);
		var content = $(".layout-future");
		$(".layout-tab").remove();
		switch(layoutName){
			case "themPhanLoaiNhieuLinkShopeeLayout":
				content.append($(`
					<div class="layout-tab">
						<p>ID sản phẩm cần thêm</p>
						<textarea id="product-link"></textarea>
						<p>Thông tin phân loại</p>
						<textarea id="data"></textarea>
						<p>Hình ảnh phân loại</p>
						<input type="file" multiple />
					</div>
				`));
				// setEventThemPhanLoaiNhieuLinkShopee();
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

					<p>Thông tin sản phẩm</p>
					<label for="data">
							<p>SKU</p>
							<input type="radio" id="sku" name="type-search" checked/>
					</label>
					<label for="data">
							<p>Tên</p>
							<input type="radio" id="name" name="type-search" />
					</label>
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
				// setEventCompareVoucher();
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
						<textarea id="data"></textarea>
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
					<textarea id="data" placeholder="SKU {tab} Giá"></textarea>
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
					<textarea id="flahsSaleName" placeholder="Nhập Tên Cần Bật Lên"></textarea>
				</div>
				`));
				break;
			case "tinhGiaBanShopeeLayout":
				content.append($(`
				<div class="layout-tab">
					<div class="input-cost">
						<label for="cost">Nhập Giá Vốn</label>
						<input type="text" id="cost" maxlength="15" />
					</div>
					<div class="output-cost">
						<p>Giá sau Khuyễn mãi: <span id="after-price"></span></p>
						<p>Giá trước Khuyễn mãi: <span id="before-price"></span></p>
						<p>Giá Đăng Bán: <span id="last-price"></span></p>
					</div>
				</div>
				`));
				setEventTinhGiaBanShopee();
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
			var box = $(".discount-item-component");

			$.each(box, (index, value) => {
				var parent = box.eq(index).find(".discount-edit-item-model-list .discount-edit-item-model-component");
				$.each(parent, (index, value) => {
					var name = parent.eq(index).find(".item-content.item-variation .ellipsis-content.single");
					var currentPrice = parent.eq(index).find(".item-content.item-price");
					var price = parent.eq(index).find("form.eds-form.form.price-discount-form.eds-form--label-right .eds-form-item__content .eds-input.currency-input input");
					var percent = parent.eq(index).find("form.eds-form.form.price-discount-form.eds-form--label-right .eds-form-item__content .eds-input.discount-input input");
					var stock = parent.eq(index).find(".item-content.item-stock");
					var switcher = parent.eq(index).find(".item-content.item-enable-disable .eds-switch.eds-switch--normal");


					var gia = currentPrice.text().replace("₫", "");
					gia = gia.replace(".", "");

					var giaKM = tachGia(gia).giaDuoi;

					console.log(giaKM);

					if(!switcher.hasClass("eds-switch--disabled")){
						if(!switcher.hasClass("eds-switch--open")){
							parent.eq(index).css({
								"background": "orange",
								"color": "#fff"
							});
							switcher.trigger("click").click();
							boxLogging(`Sản phẩm ${name.text()} vừa được Bật`, [`${name.text()}`, "Bật"], ["orange", "green"]);
						}

						if(switcher.hasClass("eds-switch--open")){
							if(parseInt(giaKM) <= 0){
								parent.eq(index).css({
									"background": "crimson",
									"color": "#fff"
								});
								boxLogging(`Sản phẩm [copy]${name.text()}[/copy] không có giá đuôi`, [`${name.text()}`], ["crimson"]);
							}else{
								simulateClearing($(price), 0, () => {
									$(price).val(giaKM);
									simulateReactEvent($(price), "change");
								})

								parent.eq(index).css({
									"background": "green",
									"color": "white"
								});
							}
						}
					}
				});
			});
		}

		// Tính giá bán sàn cam
		function tinhGiaBanShopee(){
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

		function setEventTinhGiaBanShopee(){
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
				tinhGiaBanShopee();
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

				const maxIndex = arr.reduce((maxIdx, currentVal, currentIdx, array) => {
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
		}

		// Sửa giá theo SKU sản phẩm
		function suaGiaSKUShopee(){
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

					if(skuBox.val().includes(sku)){
						var priceBox1 = priceBox.val().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
						var gia1 = gia.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

						if(parseInt(priceBox.val()) < parseInt(gia)){
							boxLogging(`SKU: [copy]${skuBox.val()}[/copy] có giá mới cao hơn giá hiện tại (${gia1} > ${priceBox1})`, [`${skuBox.val()}`], ["crimson"]);
							box.eq(index).css("background", "crimson");
						}else{
							priceBox.val(gia);
							simulateReactEvent($(priceBox), "change");
							box.eq(index).css("background", "lightgreen");
							boxLogging(`Giá của ${skuBox.val()} đã sửa từ ${priceBox1} thành ${gia1}`, [`${skuBox.val()}`, `${priceBox1}`, `${gia1}`], ["lightgreen", "orange", "orange"]);
						}
					}
				});
			});
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

			$.each(box, (index) => {
				var skuBox = box.eq(index).find(".table-cell").eq(2).find("textarea");
				var sku = skuBox.val().trim().toUpperCase();

				if(boxLeft.eq(index).find(".table-cell img.shopee-image-manager__image").length > 0){
					boxLogging(`Phân Loại ${sku} đã có ảnh`, [`${sku}`], ["crimson"])
					return;
				}

				var imgInputShopee = boxLeft.eq(index).find(".table-cell").eq(0).find("input[type=file]")[0];

				// Tìm SKU tương ứng trong inputMap
				// var found = Object.keys(inputMap).find(key => 
				// 	sku.includes(key.toUpperCase()) || key.toUpperCase().includes(sku)
				// );

				if (inputMap[sku]) {
					// inputMap[found] là jQuery object, cần lấy phần tử gốc
					var fileInputEl = inputMap[sku].get(0);
					if (!fileInputEl || !fileInputEl.files || fileInputEl.files.length === 0) return;

					var file = fileInputEl.files[0];
					var dt = new DataTransfer();
					dt.items.add(file);

					// Click input đầu tiên để kích hoạt UI React
					if(!clickInput){
						imgInputShopee.click();
						clickInput = true;
					}

					setTimeout(() => {
						imgInputShopee.files = dt.files;

						// Tạo sự kiện change để Shopee nhận diện file mới
						var evt = new Event("change", { bubbles: true });
						imgInputShopee.dispatchEvent(evt);
						boxLogging(`Đã sửa ảnh cho SKU [copy]${sku}[/copy]`, [`${sku}`], ["green"])
					}, 100); // có thể chỉnh tăng lên nếu chưa kịp load
				}else{
					boxLogging(`SKU [copy]${sku}[/copy] không có ảnh`, [`${sku}`], ["crimson"])
				}

			});
		}

		// Thêm ký tự giới tính vào tên phân loại shopee
		function setEventThemKyTuPhanLoaiShopee(){
			setEventTabTextarea()
		}

		function themKyTuPhanLoaiShopee() {
			var group = $(".tp-container.tp-content .layout-future .layout-tab #group").find("option:selected").index();
			var data = $(".tp-container.tp-content .layout-future .layout-tab #data");
			var keyword = $(".tp-container.tp-content .layout-future .layout-tab #keyword");
			var arrayData = data.val().split("\n");
			var type = $(".tp-container.tp-content .layout-future #type").find("option:selected").attr("data-count");

			var box = $(".variation-edit-item.version-a").eq(group).find(".option-container .options-item.drag-item");

			$.each(box, (index, value) => {
				var name = box.eq(index).find(".variation-input-item-container.variation-input-item input");

				var newValue = null;
				type = parseInt(type);
				switch (type){
					// Thêm ký tự vào đầu
					case 0:
						newValue = (`${data.val()} ${name.val()}`)
						break;
					// Thêm ký tự vào cuối
					case 1:
						newValue = (`${name.val()} ${data.val()}`)
						break;
					// Thêm ký tự trước từ khóa
					case 2:
						var pos = name.val().indexOf(keyword.val());
						var before = name.val().slice(0, pos);
						var after = name.val().slice(pos, name.val().length);

						if(pos < 0)
							return;
						newValue = (`${before} ${data.val()} ${after}`);
						break;
					// Thêm ký tự sau từ khóa
					case 3:
						pos = name.val().indexOf(keyword.val());
						before = name.val().slice(0, (pos + keyword.val().length));
						after = name.val().slice(before.length, name.val().length);

						if(pos < 0)
							return;

						newValue = (`${before} ${data.val()} ${after}`);
						break;
					// Xóa ký tự từ đầu
					case 4:
						newValue = name.val().slice(keyword.val(), name.val().length);
						break;
					// Xóa ký tự từ cuối
					case 5:
						newValue = name.val().slice(0, name.val().length - keyword.val());
						break;
					// Xóa ký tự trước từ khóa
					case 6:
						pos = name.val().indexOf(keyword.val());

						if(pos < 0)
							return;
						
						newValue = name.val().slice(pos, name.val().length);
						break;
					// Xóa ký tự sau từ khóa
					case 7:
						pos = name.val().indexOf(keyword.val());

						if(pos < 0)
							return;
						
						newValue = name.val().slice(0, pos + keyword.val().length);
						break;
					case 8:
						pos = name.val().indexOf(keyword.val());

						if(pos < 0)
							return;

						newValue = name.val().replace(keyword.val(), data.val());
						break;
				}

				newValue = newValue.trim();

				if(newValue.length > 20){
					boxLogging(`Số ký tự ${name.val()} vượt quá mức cho phép (${newValue.length}/20)`, [`${name.val()}`, `${newValue.length}/20`], ["crimson", "crimson"])
					name.css({
						"background": "crimson",
						"color": "#fff"
					});
				}else{
					var oldName = name.val();
					name.val(newValue.trim() || name.val().trim());
					simulateReactEvent(name, "input");
					boxLogging(`Đã đổi ${oldName} thành ${newValue}`, [`${oldName}`, `${newValue}`], ["green", "green"])
					name.css({
						"background": "green",
						"color": "#fff"
					});					
				}
			});
		}

		// Cập nhật giá đuôi Lazada
		function giaDuoiLazada(){
			var row = $(".next-table-row");
			var price = [];

			var i = 0;
			$.each(row, (index, value) => {
				var gia = $(value).find("input").val();
				var giaKM = tachGia(gia).giaDuoi;

				var name = row.eq(index).find("td").eq(0).find("button span.next-btn-helper");

				console.log(name.text());

				if($(value).find("td.special_price").has("button.next-btn").length > 0){
					if(parseInt(giaKM) == 0)
						giaKM = gia;
					price.push(giaKM);
					$(value).find("td.special_price button.next-btn").click();

					row.eq(index).css("background", "lightgreen");

					waitForElement($("body"), ".next-overlay-wrapper", (el) => {
						var inputPrice = $(el).find(".next-balloon-content .next-input.next-medium input");
						var buttonClick = $(el).find(".action-wrapper button.next-btn.next-medium.next-btn-primary")
						
						inputPrice.val(giaKM);
						simulateReactEvent(inputPrice, "input")

						buttonClick.click();
						simulateReactEvent(buttonClick, "click");
					}, {once: false})

					boxLogging(`Sản phẩm [copy]${name.text()}[/copy] đã được cập nhất giá`, [`${name.text()}`], ["green"]);
				}
			})

			// var balloon = $(".next-overlay-wrapper");

			// $.each(balloon, (index, value) => {
			// 	var inputPrice = balloon.eq(index).find(".next-balloon-content .next-input.next-medium input");
			// 	var buttonClick = balloon.eq(index).find(".action-wrapper button.next-btn.next-medium.next-btn-primary")


			// 	inputPrice.select();
			// 	inputPrice.attr("value", price[index]);

			// 	inputPrice.val(price[index]);

			// 	buttonClick.click();
			// });
		}
