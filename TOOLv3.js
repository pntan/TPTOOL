// ==UserScript==
// @name         Công Cụ Hỗ Trợ v3
// @namespace    https://tanphan.xyz
// @version      2026-10-10
// @description  Công cụ hỗ trợ công việc sàn TMĐT
// @author       TanPhan
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tanphan.xyz

// @connect      *

// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.setValues
// @grant        GM.getValue
// @grant        GM.getValues
// @grant        GM.deleteValue
// @grant        GM.deleteValues
// @grant        GM.listValues
// @grant        GM.addValueChangeListener
// @grant        GM.removeValueChangeListener
// @grant        GM.registerMenuCommand
// @grant        GM.unregisterMenuCommand
// @grant        GM.notification
// @grant        GM.openInTab
// @grant        GM.setClipboard
// @grant        GM.download
// @grant        GM.getResourceText
// @grant        GM.getResourceUrl
// @grant        GM.addElement
// @grant        GM.addStyle
// @grant        GM.audio
// @grant        GM.cookie
// @grant        GM.getTab
// @grant        GM.getTabs
// @grant        GM.saveTab
// @grant        GM.info
// @grant        GM.log

// @grant        GM_webRequest
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// @grant        window.onurlchange

// @copyright    2026, TanPhan (nhattanphan2014@gmail.com)

// @license      MIT

// @run-at       document-start
// ==/UserScript==

(function () {
  // Ghi console log
  function console_log(content, type = "log") {
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

  const JS_LIB = [
    "https://code.jquery.com/jquery-3.7.1.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js",
    "https://cdn.jsdelivr.net/gh/mdbassit/Coloris@latest/dist/coloris.min.js",
    "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4",
  ];
  const CSS_LIB = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/gh/mdbassit/Coloris@latest/dist/coloris.min.css'
  ];

  function LOAD_JS(url) {
    return new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: 'GET',
        url: url + (url.includes('?') ? '&' : '?') + 'v=' + Date.now(),
        onload: (res) => {
          if (res.status === 200) {
            try {
              // Lưu lại danh sách key trên window trước khi eval
              const keysBefore = Object.keys(window);

              // Thực thi code thư viện
              window.eval(res.responseText);

              // Tự động quét các key mới xuất hiện sau khi eval và đồng bộ sang unsafeWindow
              if (typeof unsafeWindow !== 'undefined') {
                const keysAfter = Object.keys(window);
                for (const key of keysAfter) {
                  if (!keysBefore.includes(key)) {
                    unsafeWindow[key] = window[key];
                  }
                }
                // Đồng thời xử lý luôn alias phổ biến của jQuery
                if (window.jQuery && !unsafeWindow.$) unsafeWindow.$ = window.jQuery;
              }

              resolve();
            } catch (e) {
              reject(`Lỗi thực thi JS từ ${url}: ${e.message}`);
            }
          } else {
            reject(`Lỗi HTTP ${res.status} khi tải ${url}`);
          }
        },
        onerror: reject
      });
    });
  }

  function LOAD_CSS(url) {
    return new Promise((resolve) => {
      GM.xmlHttpRequest({
        method: 'GET',
        url: url,
        onload: (res) => {
          if (res.status === 200) {
            // const style = document.createElement('style');
            // style.textContent = res.responseText;
            // (document.head || document.documentElement).appendChild(style);
            GM.addStyle(res.responseText);
          }
          resolve();
        },
        onerror: () => resolve()
      });
    });
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

  /**
   * Tải file từ một đường dẫn URL, chuyển đổi thành đối tượng File và gán vào input file đích.
   * * @param {string} url - Đường dẫn URL tới file ảnh.
   * @param {string} filename - Tên file mong muốn.
   * @param {HTMLElement|jQuery} targetFileInput - Phần tử input type="file" đích hoặc jQuery object.
   * @param {number} [delay=100] - Thời gian chờ (ms) trước khi gắn file và kích hoạt sự kiện.
   * @returns {Promise<File|null>} Một Promise trả về đối tượng File đã được tạo hoặc null nếu có lỗi.
   */
  async function attachUrlToFileToInput(url, filename, targetFileInput, delay = 100) {
    try {
      // --- Chuẩn hóa tham số đầu vào ---
      let targetFileInputEl;
      if (targetFileInput instanceof jQuery) {
        targetFileInputEl = targetFileInput.get(0);
      } else if (targetFileInput instanceof HTMLElement) {
        targetFileInputEl = targetFileInput;
      } else {
        console.error("Lỗi: targetFileInput không phải là phần tử DOM hợp lệ hoặc jQuery object.");
        return null;
      }

      if (targetFileInputEl.type !== 'file') {
        console.error("Lỗi: targetFileInput không phải là input type='file'.");
        return null;
      }

      // --- 1. Tải file từ URL ---
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const fileObject = new File([blob], filename, {
        type: blob.type
      });

      // --- 2. Gán đối tượng File vào input đích ---
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(fileObject);

      // Chờ một chút để đảm bảo UI kịp xử lý, sau đó gán file
      await new Promise(resolve => setTimeout(resolve, delay));

      targetFileInputEl.files = dataTransfer.files;

      // --- 3. Kích hoạt sự kiện 'change' ---
      const changeEvent = new Event("change", {
        bubbles: true
      });
      targetFileInputEl.dispatchEvent(changeEvent);

      console.log(`Đã gắn file '${fileObject.name}' từ URL vào input thành công.`);
      return fileObject;

    } catch (error) {
      console.error('Lỗi khi xử lý file từ URL:', error);
      return null;
    }
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
    } catch (e) { }
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

  async function urlToFile(url, filename) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const file = new File([blob], filename, {
        type: blob.type
      });
      return file;
    } catch (error) {
      console.error('Lỗi khi chuyển đổi URL thành File:', error);
      return null;
    }
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

  function get_detail_page(){
    const URL = window.location;
    return {
      title: document.title,
      domain: URL.hostname,
      protocol: URL.protocol,
      port: URL.port,
      host: URL.host,
      hostname: URL.hostname,
      href: URL.href,
      origin: URL.origin,
      pathname: URL.pathname,
      search: URL.search,
      hash: URL.hash,
      cookie: Object.fromEntries(document.cookie.split(';').map(c => c.trim().split('='))),
      storage: {
        localStorage: Object.fromEntries(Object.entries(localStorage)),
        sessionStorage: Object.fromEntries(Object.entries(sessionStorage))
      }
    };
  }

  // Chi tiết sản phẩm https://banhang.shopee.vn/portal/product/3778222809
  function PRODUCT_DETAIL_SHOPEE() {
    console_log("PRODUCT_DETAIL_SHOPEE");
    const data = get_detail_page();
    console.log(data);
  }

  async function INIT() {
    const version = "3.0.0a";
    const author = "TanPhan";
    const copyright = "Copyright (c) 2025 TanPhan. All rights reserved.";
    const endpoint = "https://api.tanphan.xyz/";

    // Load JavaScript libraries
    for (const url of JS_LIB) {
      try {
        await LOAD_JS(url);
        console_log(`Đã tải thư viện JavaScript: ${url}`);
      } catch (error) {
        console_log(`Lỗi khi tải thư viện JavaScript: ${url}`, error);
      }
    }

    // Load CSS libraries
    for (const url of CSS_LIB) {
      try {
        await LOAD_CSS(url);
        console_log(`Đã tải thư viện CSS: ${url}`);
      } catch (error) {
        console_log(`Lỗi khi tải thư viện CSS: ${url}`, error);
      }
    }

    console.log("Công Cụ Hỗ Trợ v3", version, author, copyright, endpoint);

    PRODUCT_DETAIL_SHOPEE();
  }

  INIT();
})();

