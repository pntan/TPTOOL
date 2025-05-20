	'use strict';

	// Trạng thái hiển thị của giao diện
	var createUI = false;

	// Phiên bản của chương trình
	const VERSION = "2.1.3";

	/*const Jqu = document.createElement("script");
	Jqu.setAttribute("src", "https://code.jquery.com/jquery-3.7.1.min.js");
	Jqu.setAttribute("rel", "preload");
	Jqu.setAttribute("async", "async");
	document.head.appendChild(Jqu);

	const JquUI = document.createElement("script");
	JquUI.setAttribute("src", "https://code.jquery.com/ui/1.14.1/jquery-ui.js");
	JquUI.setAttribute("rel", "preload");
	document.head.appendChild(JquUI);*/

		// Danh sách thư viện cần thêm
		const LIBRARIES = [
			"https://code.jquery.com/jquery-3.7.1.min.js", // JQYERY
			"https://code.jquery.com/ui/1.14.1/jquery-ui.js", // JQUERY UI
			"https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js", // EXCEL
			"https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js", // ZIP FILE
			"https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js", // SAVE FILE
			"https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js", // BOOTSTRAP
			"https://cdn.socket.io/4.8.1/socket.io.min.js", // SOCKET IO
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
			"comboKMShopee": comboKMShopee,
			"kiemTraPhanLoaiShopee": kiemTraPhanLoaiShopee,
			"themPhanLoaiNhieuLinkShopee": themPhanLoaiNhieuLinkShopee,
			"layTenPhanLoaiShopee": layTenPhanLoaiShopee,
			// "themPhanLoaiShopee": themPhanLoaiShopee,
			// "giaDuoiChuongTrinhShopee": giaDuoiChuongTrinhShopee,
			// //"keoPhanLoaiShopee": keoPhanLoaiShopee,
			// //"batKhuyenMaiShopee": batKhuyenMaiShopee,
			// // --- TIKTOK
			"giaDuoiTiktok": giaDuoiTiktok,
			"saoChepFlashSaleTiktok": saoChepFlashSaleTiktok,
			"kiemTraMaPhanLoaiTiktok": kiemTraMaPhanLoaiTiktok,
			"chinhSuaKhuyenMaiTiktok": chinhSuaKhuyenMaiTiktok,
			// "tgFlashSaleTiktok": tgFlashSaleTiktok,
			// "ktraKhuyenMaiTiktok": ktraKhuyenMaiTiktok,
			// // --- SAPO
			// "kiemTraTonSapo": kiemTraTonSapo,
			// // -- LAZADA
			"giaDuoiLazada": giaDuoiLazada,
			"themPhanLoaiLazada": themPhanLoaiLazada,
			// "themGiaTheoSKULazada": themGiaTheoSKULazada,
			// "ktraGiaChuongTrinhKMLazada": ktraGiaChuongTrinhKMLazada,
			// //-- KHÁC
			"splitExcelFile": splitExcelFile,
			// "compareVoucher": compareVoucher,
		};

		const actionOnlineMap = {
			"aiChat": aiChat,
		}

		// Thêm thư viện
		function loadLibrary(scripts, callback){
			let index = 0;
			try{

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
						boxAlert(`Có lỗi khi thêm ${scripts[index]}`, "error");
						console.log(e);
						index++;
						loadNext();
					}

					document.head.appendChild(script);
				}
				loadNext();
			}catch (e){
				boxAlert(`Không thể load ${scripts[index]}`, "error");
			}				
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

		// Theo dõi phần tử
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
				return;
			}

			let observer = null;
			let timeoutId = null;
			let delayTimer = null;
			let lastMatchedElement = null;

			function runCallback(el) {
				callback(el);
				if (once) {
					observer.disconnect();
					if (timeoutId) clearTimeout(timeoutId);
					if (delayTimer) clearTimeout(delayTimer);
				}
			}

			var initial = rootNode.querySelector(selector);
			if (initial && !waitForLastChange) {
				callback(initial);
				if (once) return;
			}

			observer = new MutationObserver(() => {
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
					observer.disconnect();
					if (waitForLastChange && lastMatchedElement) {
						runCallback(lastMatchedElement);
					}
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

		var socket = null;

		async function getUrlServer(){
			var owner = 'pntan';
			var repo = 'TPTOOL';
			var path = 'urlNgrok'; // tên file chứa URL
			var branch = 'main';

			try {
				// Lấy file từ GitHub API
				const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?_=${Date.now()}`, {
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

		// Khải tạo chương trình
		function INITCONFIG(){
			boxAlert("ĐANG KHỞI TẠO");
			loadLibrary(LIBRARIES, () => {
				if (createUI)
					return;
				createUI = true;
				createLayout();
				applyNonce();

				// Kết nối máy chủ
				socket = getUrlServer();

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
				<div class="tp-popup">
					<div class="popup-overlay"></div>
					<div class="popup-box">
						<div class="content" style="white-space: pre-wrap; overflow-y: auto;"></div>
					</div>
				</div>

				<div id="toast-container"></div>

				<div class="tp-container tp-button-toggle">
					<p>ChuẩnMua</p>
				</div>

				<div id="custom-context-menu" style="display:none; position:absolute; z-index:9999;">
					<ul>
					<li class="menu-item" data-action="toggle-program">Ẩn/Hiện chương trình</li>
					<li class="menu-item" data-action="connect-server">Kết nối máy chủ</li>
					</ul>
				</div>

				<div class="tp-container tp-content">
					<div class="program-title">
						<p>Công Cụ Hỗ Trợ</p>
						<p>Ver ${VERSION}</p>
						<p id="server-status">OFFLINE</p>
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
								<option data-func="giaDuoiShopee">Cập Nhật Giá Đuôi</option>
								<option data-func="flashSaleShopee" data-layout="flashSaleShopeeLayout">Flash Sale</option>
								<option data-func="tinhGiaBanShopee" data-layout="tinhGiaBanShopeeLayout">Tính Giá Bán</option>
								<option data-func="kTr5LanGiaShopee" data-layout="kTr5LanGiaShopeeLayout">Kiểm Tra 5 Lần Giá</option>
								<option data-func="kiemTraMaPhanLoaiShopee">Hiển Thị Mã Phân Loại</option>
								<option data-func="suaGiaSKUShopee" data-layout="suaGiaSKUShopeeLayout">Sửa Giá Theo SKU</option>
								<option data-func="suaHinhSKUShopee" data-layout="suaHinhSKUShopeeLayout">Sửa Hình Theo SKU</option>
								<option data-func="themKyTuPhanLoaiShopee" data-layout="themKyTuPhanLoaiShopeeLayout">Sửa Tên Phân Loại</option>
								<option data-func="comboKMShopee" data-layout="comboKMShopeeLayout">Điều Chỉnh Combo Khuyến Mãi</option>
								<option data-func="kiemTraPhanLoaiShopee" data-layout="kiemTraPhanLoaiShopeeLayout">Kiểm Tra Phân Loại</option>
								<option data-func="themPhanLoaiNhieuLinkShopee" data-layout="themPhanLoaiNhieuLinkShopeeLayout">Thêm Phân Loại</option>
								<option data-func="layTenPhanLoaiShopee">Lấy Tên Phân Loại</option>
								<option disabled data-func="giaDuoiChuongTrinhShopee" data-layout="giaDuoiChuongTrinhShopeeLayout">Cập Nhật Giá Đăng Ký Chương Trình</option>
								<!-- <option disabled data-func="themPhanLoaiShopee" data-layout="themPhanLoaiShopeeLayout">Thêm Phân Loại</option> -->
								<!-- <option disabled data-func="keoPhanLoaiShopee" data-layout="keoPhanLoaiShopeeLayout">Kéo Phân Loại</option> -->
							</optgroup>

							<!-- TikTok -->
							<optgroup label="TikTok">
								<option data-func="giaDuoiTiktok">Cập Nhật Giá Đuôi</option>
								<option data-func="saoChepFlashSaleTiktok" data-layout="saoChepFlashSaleTiktokLayout">Sao Chép Chương Trình Flash Sale</option>
								<option data-func="kiemTraMaPhanLoaiTiktok">Hiển Thị Mã Phân Loại</option>
								<option data-func="chinhSuaKhuyenMaiTiktok" data-layout="chinhSuaKhuyenMaiTiktokLayout">Chỉnh Sửa Chương Trình Khuyến Mãi</option>
								<option disabled data-func="ktraKhuyenMaiTiktok" data-layout="ktraKhuyenMaiTiktokLayout">Kiểm Tra Văng Khuyến Mãi</option>
							</optgroup>

							<!-- Lazada -->
							<optgroup label="Lazada">
								<option data-func="giaDuoiLazada">Cập Nhật Giá Đuôi</option>
								<option data-func="themPhanLoaiLazada" data-layout="themPhanLoaiShopeeLayout">Thêm Phân Loại</option>
								<option data-func="themGiaTheoSKULazada" data-layout="themGiaTheoSKULazadaLayout">Sửa giá theo SKU</option>
								<option disabled data-func="ktraGiaChuongTrinhKMLazada" data-layout="ktraGiaChuongTrinhKMLazadaLayout">Kiểm Tra Giá Khuyến Mãi</option>
							</optgroup>

							<!-- Sapo -->
							<optgroup label="Sapo">
								<option disabled data-func="kiemTraTonSapo" data-layout="kiemTraTonSapoLayout">Kiểm Tra Tồn</option>
							</optgroup>

							<!-- Khác -->
							<optgroup label="Khác">
								<option data-func="splitExcelFile" data-layout="splitExcelFileLayout">Chia Nhỏ File Excel</option>
								<!-- <option disabled data-func="autobrowser" data-layout="autobrowserLayout">Trình Duyệt Tự Động</option> -->
								<option disabled data-func="compareVoucher" data-layout="compareVoucherLayout">So Sánh Voucher</option>
							</optgroup>

						</select>

						<div class="layout-future functionSelect">
						</div>
					</div>

					<div id="tab-custom" class="tab-content">
						<select id="optionSelect">
							<option>Chọn Chức Năng</option>
							<option>Chung</option>
							<option>Shopee</option>
							<option>Tiktok</option>
							<option>Lazada</option>
							<option>Sapo</option>
							<option>Khác</option>
						</select>
					</div>

					<div id="tab-online-function" class="tab-content">
						<select id="onlineSelect">
							<option hidden>Chọn Chức Năng</option>
							<option data-func="aiChat" data-layout="aiChatLayout">Veritas</option>
						</select>

						<div class="layout-future onlineSelect">
						</div>
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
						display: none;
					}

					.tp-button-toggle:hover{
						opacity: 1;
					}

					.tp-button-toggle.active{
						background: lightgreen;
						color: #000;
						opacity: 1;
					}

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
						display: none;
						flex-direction: column;
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

					.tp-content .program-title p:nth-child(1){
						font-size: 1.6em;
						font-weight: bold;

						color: #555;
					}

					.tp-content .program-title p:nth-child(2){
						font-size: 0.9em;
					}

					.tp-content .program-title p:nth-child(3){
						font-size: 1.1em;
						color: #000;
					}

					.tp-content .program-title p:nth-child(3).online{
						color: lightgreen;
					}

					.tp-content .program-title p:nth-child(3).connect{
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

					.tp-content .layout-future input,
					.tp-content textarea {
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
			$(document).on("contextmenu", (e) => {
				var ignoreTags = ["img", "a", "input", "textarea", "button", "select"];
				var isIgnored = ignoreTags.includes(e.target.tagName.toLowerCase());

				// Nếu không giữ Ctrl hoặc đang nhấn vào thẻ đặc biệt thì cho context mặc định
				if (!e.ctrlKey || isIgnored) return true;

				e.preventDefault();

				var offset = 10;

				$("#custom-context-menu")
				.css({
					top: e.pageY + offset + "px",
					left: e.pageX + offset + "px"
				})
				.fadeIn(100);
			});

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
				}else{
					$(".tp-container.tp-content").css("display", "block");
					$(this).addClass("active");
					boxAlert("Hiện Giao Diện");
				}
			});

			// Chọn chức năng cho sàn
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
				var func = $(this).attr("data-func");
				if (actionMap[func]) actionMap[func]();
			});

			$.each($("iframe"), (index, value) => {
				$("iframe").eq(index).remove();
			});

			// Chọn chức năng online
			$("select#onlineSelect").on("change", function(){
				var option = $(this).find("option:selected");

				createLayoutOnline(option.data("layout"));

				if(actionOnlineMap[option.data("func")])
					actionOnlineMap[option.data("func")]();
			})
		}

		// Dựng giao diện cho lựa chọn chức năng online
		function createLayoutOnline(layoutName){
			layoutName = layoutName == undefined ? "Không có giao diện" : layoutName;

			var content = $(".layout-future.onlineSelect");
			switch(layoutName) {
				case "aiChatLayout":
					content.append($(`
						<div class="layout-tab">
							<div class="message-content">
							</div>
							<div class="typing-content">
								<input type="text" placeholder="Nhập tin nhắn..." />
							</div>
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
			case "chinhSuaKhuyenMaiTiktokLayout":
				$("#excute-command").hide();
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
			case "tinhGiaBanShopeeLayout":
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
									simulateReactEvent($(price), "input");
								})

								// parent.eq(index).css({
								// 	"background": "green",
								// 	"color": "white"
								// });
							}
						}
					}
				});
			});

			boxToast("Hoàn thành cập nhật giá đuôi", "success")
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
									simulateReactEvent($(priceBox), "change");
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
									simulateReactEvent($(priceBox), "change");
								}else{
									boxLogging(`Giá của [copy]${skuBox.val()}[/copy] đã sửa từ ${price.gia} thành ${editPrice.gia}`, [`${skuBox.val()}`, `${price.gia}`, `${editPrice.gia}`], ["lightgreen", "green", "green"]);
									priceBox.val(editPrice.gia);
									simulateReactEvent($(priceBox), "change");
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
									simulateReactEvent($(priceBox), "change");
								}else{
									boxLogging(`Giá của [copy]${skuBox.val()}[/copy] đã sửa từ ${price.gia} thành ${editPrice.gia}`, [`${skuBox.val()}`, `${price.gia}`, `${editPrice.gia}`], ["lightgreen", "green", "green"]);
									priceBox.val(editPrice.gia);
									simulateReactEvent($(priceBox), "change");
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

			if (arrayData.length !== arrayKeyword.length) {
				boxLogging("Số lượng dòng dữ liệu và từ khóa không khớp.", ["Số lượng dòng dữ liệu", "Số lượng dòng từ khóa"], ["crimson", "crimson"]);
				boxToast(`Số lượng dòng dữ liệu và từ khóa không khớp.`, "error");
				return;
			}

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
			var row = $(".next-table-row");
			var price = [];

			var i = 0;
			$.each(row, (index, value) => {
				var gia = $(value).find("input").val();
				var giaKM = tachGia(gia).giaDuoi;

				var name = $(row).eq(index).find("td").eq(0).find("button span").text();

				if($(value).find("td.special_price").has("button.next-btn").length > 0){
					if(parseInt(giaKM) == 0)
						giaKM = gia;
					price.push(giaKM);
					$(value).find("td.special_price button.next-btn").click();

					row.eq(index).css("background", "lightgreen");

					boxLogging(`Sản phẩm ${name} đã được cập nhất giá`, [`${name}`], ["green"]);
				}
			})

			var balloon = $(".next-overlay-wrapper");

			$.each(balloon, (index, value) => {
				var inputPrice = balloon.eq(index).find(".next-balloon-content .next-input.next-medium input");
				var buttonClick = balloon.eq(index).find(".action-wrapper button.next-btn.next-medium.next-btn-primary")


				inputPrice.select();
				inputPrice.attr("value", price[index]);

				inputPrice.val(price[index]);

				buttonClick.click();
			});

			boxToast("Đã cập nhật giá đuôi", "success")
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

		// Cập nhật giá đuôi tiktok
		function giaDuoiTiktok(){
			var box = $(".theme-arco-table-content-inner .theme-arco-table-body").find("div div > div");

			var countProduct = 0;
			var currentProduct = 0;

			$.each(box, (index, value) => {
				if($(box).eq(index).hasClass("theme-arco-table-tr-custom-expand-row")){
				// Số lượng phân loại
				var checked = box.eq(index).find("div").find(".theme-arco-checkbox-mask").parent().parent();

				if(checked.hasClass("theme-arco-checkbox-checked")){
					var countProduct = box.eq(index).find("div").eq(39).find(".p-12").text();
					countProduct = countProduct.match(/\d+/);
				}
				}else if($(box).eq(index).is(".theme-arco-table-tr, .theme-arco-table-row-custom-expand, .styled")){
					currentProduct += 1;
					var parent = $(box).eq(index);
					var name = parent.find(".theme-arco-table-td").eq(1).find("span");
					var currentPrice = parent.find(".theme-arco-table-td").eq(2).find("span p");
					var promotionPrice = parent.find(".theme-arco-table-td").eq(3).find("input");

					if(promotionPrice.length > 0){
						if(promotionPrice.val().length > 0)
							return;
						var gia = currentPrice.text().replace(",", "");
						gia = gia.replace(".", "");
						gia = gia.replace("₫", "");
						gia = tachGia(gia).giaDuoi;

						promotionPrice.select().focus();

						promotionPrice.get(0).scrollIntoView({ behavior: 'smooth', block: 'center' });

						simulateReactInput(promotionPrice, gia);

						gia = gia.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

						boxLogging(`[copy]${name.text()}[/copy] đã cập nhật từ ${currentPrice.text()} -> ${gia}`, [`${name.text()}`, `${currentPrice.text()}`, `${gia}`], ["green", "orange", "orange"]);
					}
				}
			});
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
				var price = row.eq(index).find("td.core-table-td").eq(1);
				var stock = row.eq(index).find("td.core-table-td").eq(2);
				var sku = row.eq(index).find("td.core-table-td").eq(3);

				var productID = price.find("#skus").data("id");
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

		// Lấy tên phân loại shopee
		function layTenPhanLoaiShopee(){
			var box = $(".variation-edit-item.version-a").eq(0).find(".option-container .options-item.drag-item");

			var currentList = [];

			// Thu thập các tên phân loại đang hiển thị trên giao diện
			box.each((_, el) => {
				var name = $(el).find(".variation-input-item-container.variation-input-item input").val();
				currentList.push(name.toLowerCase());
			});

			boxToast(`Đã sao chép tên ${currentList.length} phân loại`, "success");

			currentList = currentList.join("\n");

			navigator.clipboard.writeText(currentList);
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
