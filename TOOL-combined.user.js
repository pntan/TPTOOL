// ==UserScript==
// @name         Công Cụ Hỗ Trợ GITHUB
// @namespace    http://tampermonkey.net/
// @version      2025-01-02
// @description  Bộ công cụ tích hợp các chức năng hỗ trợ cho sàn TMĐT
// @author       TanPhan
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=http://anonymouse.org/

// @grant        GM_xmlhttpRequest
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
