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
  const JS_LIB = [
    "https://code.jquery.com/jquery-3.7.1.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js",
    "https://cdn.jsdelivr.net/gh/mdbassit/Coloris@latest/dist/coloris.min.js"
  ];
  const CSS_LIB = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/gh/mdbassit/Coloris@latest/dist/coloris.min.css'
  ];

  function LOAD_JS(url) {
    return new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: 'GET',
        url: url + (url.includes('?') ? '&' : '?') + 'v=' + Date.now(), // chống cache CDN
        onload: (res) => {
          if (res.status === 200) {
            try {
              // Dùng eval trong Userscript Context thay vì tạo thẻ <script> DOM
              // Cách này chạy ở Sandbox nên CSP của TikTok KHÔNG THỂ CHẶN được.
              window.eval(res.responseText);

              // Đồng bộ sang unsafeWindow nếu trang web cần dùng biến toàn cục (như $, jQuery)
              if (typeof unsafeWindow !== 'undefined') {
                if (window.jQuery) unsafeWindow.jQuery = window.jQuery;
                if (window.$) unsafeWindow.$ = window.$;
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
            const style = document.createElement('style');
            style.textContent = res.responseText;
            (document.head || document.documentElement).appendChild(style);
          }
          resolve();
        },
        onerror: () => resolve()
      });
    });
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
        console.log(`Đã tải thư viện JavaScript: ${url}`);
      } catch (error) {
        console.error(`Lỗi khi tải thư viện JavaScript: ${url}`, error);
      }
    }

    // Load CSS libraries
    for (const url of CSS_LIB) {
      try {
        await LOAD_CSS(url);
        console.log(`Đã tải thư viện CSS: ${url}`);
      } catch (error) {
        console.error(`Lỗi khi tải thư viện CSS: ${url}`, error);
      }
    }

    console.log("Công Cụ Hỗ Trợ v3", version, author, copyright, endpoint);
  }

  INIT();
})();