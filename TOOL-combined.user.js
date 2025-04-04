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
// ==/UserScript==
/* globals       jQuery, $, waitForKeyElements */

(function() {
    const rawScriptUrl = 'https://raw.githubusercontent.com/pntan/TPTOOL/main/TOOL.js?nocache=' + Date.now();
    window.open(rawScriptUrl, "_blank");

    GM_xmlhttpRequest({
        method: 'GET',
        url: rawScriptUrl,
        onload: function(response) {
            try {
                eval(response.responseText);
                console.log('[TOOL] Đã tải và chạy TOOL.js mới nhất từ GitHub.');
                console.log(response);
                console.log(response);
            } catch (e) {
                console.error('[TOOL] Lỗi khi chạy script TOOL.js:', e);
            }
        },
        onerror: function(err) {
            console.error('[TOOL] Không thể tải TOOL.js từ GitHub:', err);
        }
    });
})();
