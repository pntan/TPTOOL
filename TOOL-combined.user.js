// ==UserScript==
// @name         Công Cụ Hỗ Trợ GITHUB
// @namespace    http://tampermonkey.net/
// @version      2025-01-02
// @description  Bộ công cụ tích hợp các chức năng hỗ trợ cho sàn TMĐT
// @author       TanPhan
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=http://anonymouse.org/
// @grant        GM_xmlhttpRequest
// @updateURL    https://raw.githubusercontent.com/pntan/TPTOOL/main/TOOL-combined.user.js
// @downloadURL  https://raw.githubusercontent.com/pntan/TPTOOL/main/TOOL-combined.user.js
// @connect      raw.githubusercontent.com
// ==/UserScript==

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
