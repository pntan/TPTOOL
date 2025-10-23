// ==UserScript==
// @name         Công Cụ Hỗ Trợ GITHUB
// @namespace    http://tampermonkey.net/
// @version      2025-01-02
// @description  Bộ công cụ tích hợp các chức năng hỗ trợ cho sàn TMĐT
// @author       TanPhan
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=http://anonymouse.org/
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require      https://code.jquery.com/ui/1.14.1/jquery-ui.js
// @require      https://cdn.jsdelivr.net/npm/dompurify@2.4.0/dist/purify.min.js
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require      https://code.jquery.com/ui/1.14.1/jquery-ui.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @reqquire      https://code.jquery.com/jquery-3.7.1.min.js
// @reqquire      https://code.jquery.com/ui/1.14.1/jquery-ui.js
// @reqquire      https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js
// @reqquire      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @reqquire      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @reqquire      https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js
// @reqquire      https://kit.fontawesome.com/e538a919ef.js
// @reqquire      https://cdn.socket.io/4.8.1/socket.io.min.js
// @reqquire      https://cdn.boxicons.com/fonts/basic/boxicons.min.css
// @reqquire      https://cdn.jsdelivr.net/gh/mdbassit/Coloris@latest/dist/coloris.min.css
// @reqquire      https://cdn.jsdelivr.net/gh/mdbassit/Coloris@latest/dist/coloris.min.js
// @connect      raw.githubusercontent.com
// ==/UserScript==
/* globals       jQuery, $, waitForKeyElements */

(function() {
    const rawScriptUrl = 'https://raw.githubusercontent.com/pntan/TPTOOL/main/TOOL.js?nocache=' + Date.now();

    GM_xmlhttpRequest({
        method: 'GET',
        url: rawScriptUrl,
        onload: function(response) {
            try {
                eval(response.responseText);
                console.log('[TOOL] Đã tải và chạy TOOL.js mới nhất từ GitHub.');
            } catch (e) {
                console.error('[TOOL] Lỗi khi chạy script TOOL.js:', e);
            }
        },
        onerror: function(err) {
            console.error('[TOOL] Không thể tải TOOL.js từ GitHub:', err);
        }
    });
})();
