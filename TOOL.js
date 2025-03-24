// ==UserScript==
// @name         Công Cụ Hỗ Trợ
// @namespace    http://tampermonkey.net/
// @version      2025-01-02
// @description  Bộ công cụ tích hợp các chức năng hỗ trợ cho sàn TMĐT
// @author       TanPhan
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=http://anonymouse.org/
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require      https://code.jquery.com/ui/1.14.1/jquery-ui.js
// @require      https://cdn.jsdelivr.net/npm/dompurify@2.4.0/dist/purify.min.js
// ==/UserScript==
/* globals       jQuery, $, waitForKeyElements */

(function() {
    'use strict';
    var createUI = false;
    var Jqu = document.createElement("script");
    Jqu.setAttribute("src", "https://code.jquery.com/jquery-3.7.1.min.js");
    Jqu.setAttribute("rel", "preload");
    Jqu.setAttribute("async", "async");
    document.head.appendChild(Jqu);

    var JquUI = document.createElement("script");
    JquUI.setAttribute("src", "https://code.jquery.com/ui/1.14.1/jquery-ui.js");
    JquUI.setAttribute("rel", "preload");
    JquUI.setAttribute("async", "async");
    document.head.appendChild(JquUI);
    window.onload = function(){

        // Ghi console log
        function boxAlert(content){
            console.log(`%cTanPhan: %c${content}`, "color: crimson; font-size: 2rem", "color: yellow; font-size: 1.5rem");
            //console.log(`%c${content}`, "color: yellow; font-size: 1.5rem");
        }

        // Ghi logging
        function boxLogging(text, words = [], colors = []){
            var log = $(".content-log pre");
            var data = log.html();
            if (words.length === 0) {
                // Không truyền từ khóa -> Tô màu đen toàn bộ văn bản
                log.html(`${data}\n<span style="color: black;">${text}</span>`);
            }else{
                // Nếu có từ khóa -> Tô màu cho từ khóa, còn lại giữ nguyên màu
                words.forEach((word, index) => {
                    var regex = new RegExp(`(${word})`, "gi");
                    text = text.replace(regex, `<span style="color: ${colors[index]}; font-weight: bold;">$1</span>`);
                });

                log.html(`${data}\n${text}`);
            }
            log.scrollTop(log.prop("scrollHeight"));
        }

        // Dựng giao diện
        function createLayout(){
            if (window.parent != window.top) {
                console.log("we've been framed I tell ya");
                return;
            }

            boxAlert("Dựng Giao Diện");
            boxLogging("Dựng Giao Diện");

            // Tạo khung giao diện
            var container = $(`
                <div class="tp-container">
                    <!-- Nút mở rộng -->
                    <div class="toggle-content">
                        <p>Công Cụ Mở Rộng</p>
                    </div>

                    <!-- Nội dung chính -->
                    <div class="content">

                        <!-- Tiêu đề -->
                        <div class="content-header">
                          <p>Công Cụ Hỗ Trợ <span class="version">ver 1.0.0</span></p>
                        </div>

                        <!-- Khu vực log -->
                        <div class="content-log">
                          <pre></pre>
                        </div>

                        <!-- Khu vực chọn chức năng -->
                        <div class="content-feature">
                          <select id="functionSelect">
                            <option hidden>Chọn Chức Năng</option>

                            <!-- Shopee -->
                            <optgroup label="Shopee">
                              <option data-func="giaDuoiShopee">Cập Nhật Giá Đuôi</option>
                              <option data-func="flashSaleShopee" data-layout="flashSaleShopeeLayout">Flash Sale</option>
                              <option data-func="tinhGiaBanShopee" data-layout="tinhGiaBanShopeeLayout">Tính Giá Bán</option>
                              <option data-func="suaGiaSKUShopee" data-layout="suaGiaSKUShopeeLayout">Sửa Giá Theo SKU</option>
                              <option data-func="keoPhanLoaiShopee" data-layout="keoPhanLoaiShopeeLayout">Kéo Phân Loại</option>
                            </optgroup>

                            <!-- Lazada -->
                            <optgroup label="Lazada">
                              <option data-func="giaDuoiLazada">Cập Nhật Giá Đuôi</option>
                              <option data-func="themPhanLoaiLazada" data-layout="themPhanLoaiLazadaLayout">Thêm Phân Loại Hàng Loạt</option>
                              <option data-func="ktraGiaChuongTrinhKMLazada" data-layout="ktraGiaChuongTrinhKMLazadaLayout">Kiểm Tra Giá Khuyến Mãi</option>
                            </optgroup>

                            <!-- TikTok -->
                            <optgroup label="TikTok">
                              <option data-func="giaDuoiTiktok">Cập Nhật Giá Đuôi</option>
                              <option data-func="ktraKhuyenMaiTiktok" data-layout="ktraKhuyenMaiTiktokLayout">Kiểm Tra Văng Khuyến Mãi</option>
                            </optgroup>

                            <!-- Khác -->
                            <optgroup label="Khác">
                              <option data-func="autobrowser" data-layout="autobrowserLayout">Trình Duyệt Tự Động</option>
                            </optgroup>

                          </select>
                        </div>

                        <!-- Khu vực layout động -->
                        <div class="content-layout"></div>

                        <!-- Nút thực thi -->
                        <div class="content-button">
                          <button id="excuse-command" data-func="">Chạy</button>
                        </div>

                    </div>
                </div>
            `);
            $("body").append(container);

            // Xác định tọa độ
            var top, left;
            if(localStorage.getItem("positionYTP") == null)
                top = "0";
            else
                top = localStorage.getItem("positionYTP");
            if(localStorage.getItem("positionXTP") == null)
                left = "0";
            else
                left = localStorage.getItem("positionXTP");

            if($("body").height() / 2 < top)
                top = $("body").height() / 2;
            if($("body").width() / 2 < left)
                left = $("body").width() / 2;

            boxAlert(`Tọa độ hiện tại X: ${left} - Y: ${top}`);

            var cssStyle = $(`
            <style>
                .tp-container {
                    position: fixed;
                    width: auto;
                    height: auto;
                    user-select: none;
                    top: ${top}px;
                    left: ${left}px;
                    z-index: 99999999999999999999;
                }

                .tp-container * {
                    padding: 0;
                    border: 0;
                    margin: 0;
                    user-select: none;
                }

                .tp-container .toggle-content {
                    // background: linear-gradient(90deg, rgba(255,0,0,0.8) 0%, rgba(192,42,138,0.8) 5%, rgba(111,102,167,0.8) 10%, rgba(89,172,184,1) 15%, rgba(74,196,115,1) 20%, rgba(106,199,59,0.8) 25%, rgba(202,194,79,0.8) 30%, rgba(201,169,118,0.8) 35%, rgba(187,118,118,1) 40%, rgba(255,0,0,1) 45%, rgba(255,0,0,1) 50%, rgba(187,118,118,1) 55%, rgba(201,169,118,0.8) 60%, rgba(202,194,79,0.8) 65%, rgba(106,199,59,0.8) 70%, rgba(74,196,115,1) 75%, rgba(89,172,184,1) 80%, rgba(192,42,138,0.8) 85%, rgba(255,0,0,0.8) 90%);
                    background: crimson;
                    box-shadow: -5px 5px 10px pink;
                    background-size: 1200%;
                    font-weight: bold;
                    color: #000;
                    padding: 0.5vh auto;
                    border-radius: 100px;
                    transition: 0.5s;
                    text-align: center;
                    margin-bottom: 1vh;
                }

                .tp-container .toggle-content:hover {
                    background: #fff;
                    color: #000;
                }

                .tp-container .toggle-content p {
                    padding: 1vh 1vw;
                }

                .tp-container .content {
                    background: rgba(255, 255, 255, 0.63);
                    width: auto;
                    height: auto;
                    padding: 2vh 1vw;
                    border: 5px #000 double;
                    display: none;
                }

                .tp-container .content .content-header {
                    width: 100%;
                    height: 5vh;
                    line-height: 5vh;
                    padding: 0.5vh 0 !important;
                    padding-top: 0;
                    color: #000
                }

                .tp-container .content .content-header p {
                    width: 100%;
                    height: auto;
                    text-align: center;
                    font-size: 2vw;
                    font-weight: 800;
                }

                .tp-container .content .content-header p span.version {
                    font-size: 0.75vw;
                    color: gray;
                }

                .tp-container .content .content-log {
                    width: 100%;
                    height: auto;
                }

                .tp-container .content .content-log pre {
                    width: auto;
                    height: auto;
                    max-height: 20vh;
                    min-height: 7vh;
                    line-height: 3vh;
                    background: #90A4AE;
                    color: #fff;
                    font-size: 1vw;
                    text-indent: 5%;
                    overflow: scroll;
                }

                .tp-container .content .content-feature {
                    width: 100%;
                    height: auto;
                }

                .tp-container .content .content-feature select {
                    width: 100%;
                    height: 7vh;
                    line-height: 7vh;
                    border-radius: 5px;
                    text-indent: 5%;
                    outline: none;
                    transition: 0.5s;
                    background: rgba(255, 255, 255, 1);
                    color: #000;
                }

                .tp-container .content .content-feature select:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transition: 0.5s;
                }

                .tp-container .content .content-feature select optgroup {
                    width: 100%;
                    height: auto;
                }

                .tp-container .content .content-feature select optgroup option {
                    width: 100%;
                    height: 5vh;
                    transition: 0.5s;
                }

                .tp-container .content .content-feature select optgroup option:hover {
                    transform: scale(1.1);
                }

                .tp-container .content .content-layout {
                    width: auto;
                    height: auto;
                    margin: 2vh 0;
                }

                .tp-container .content .content-layout * {
                    width: auto;
                    height: auto;
                    margin-bottom: 1vh;
                }

                .tp-container .content .content-layout p {
                    background: transparent;
                    color: #000;
                }

                .tp-container .content .content-layout input {
                    color: #000;
                    border: 1px #000 solid;
                    width: auto;
                    height: 5vh;
                    background: #fff
                }

                .tp-container .content .content-layout label {
                    color: #000;
                    background: transparent;
                }

                .tp-container .content .content-layout textarea {
                    color: #000;
                    background: #fff;
                    width: 100%;
                    height: auto;
                }

                .tp-container .content .content-layout button {
                    color: #fff;
                    background: gray;
                    width: auto;
                    height: auto;
                    padding: 1vh 0.5vw;
                }

                .tp-container .content .content-button {
                    width: 100%;
                    height: auto;
                }

                .tp-container .content .content-button button {
                    width: 100%;
                    height: 5vh;
                    line-height: 5vh;
                    background: crimson;
                    color: #fff;
                    font-weight: 800;
                    transition: 0.5s;
                }

                .tp-container .content .content-button button:hover {
                    transform: scale(1.1);
                    filter: brightness(10px);
                }
            </style>
            `);

            $(".tp-container").append(cssStyle);

            // Kéo thả khung
            $(".tp-container").draggable({
                drag: function() {
                    var offset = $(this).offset();
                    var xPos = offset.left;
                    var yPos = offset.top;
                    localStorage.setItem("positionYTP",yPos);
                    localStorage.setItem("positionXTP",xPos);
                    boxAlert(`Tọa độ hiện tại X: ${xPos} - Y: ${yPos}`);
                    boxLogging(`Tọa độ hiện tại X: ${xPos} - Y: ${yPos}`, [`${xPos}`, `${yPos}`], ["orange", "yellow"]);
                },
            });

            // Ẩn hiện giao diện
            $(".toggle-content").on("dblclick", function(){
                if($(this).hasClass("active")){
                    $(".content").css("display", "none");
                    $(this).removeClass("active");
                    boxAlert("Ẩn Giao Diện");
                }else{
                    $(".content").css("display", "block");
                    $(this).addClass("active");
                    boxAlert("Hiện Giao Diện");
                }
            });

            // Hiệu ứng nút điều khiển
            var animate = $(".toggle-content");
            function loopbackground() {
                animate.css('background-position', '0px 0px');
                $({position_x: 0, position_y: 0}).animate({position_x: -5000, position_y: -2500}, {
                    duration: 50000,
                    easing: 'linear',
                    step: function() {
                        animate.css('background-position', this.position_x+'px '+this.position_y+'px');
                    },
                    complete: function() {
                        loopbackground();
                    }
                });
            }
            loopbackground();

            //Chọn chức năng
            $("select").on("change", function(){
                var option = $(this).find("option:selected");
                $("#excuse-command").show();
                $("#excuse-command").text("Chạy");
                $("#excuse-command").attr("data-func", option.attr("data-func"));
                $(".layout-tab").remove();
                boxLogging(`Đã chọn ${option.parent().attr("label")} > ${option.text()}`, [`${option.parent().attr("label")}`, `${option.text()}`], ["crimson", "crimson"]);
                createLayoutTab(option.attr("data-layout"));
            });

            // Map các hàm tương ứng với data-func
            const actionMap = {
                // --- SHOPEE
                "giaDuoiShopee": giaDuoiShopee,
                "5LanGiaShopee": kTr5LanGiaShopee,
                "tinhGiaBanShopee": tinhGiaBanShopee,
                "flashSaleShopee": flashSaleShopee,
                "suaGiaSKUShopee": suaGiaSKUShopee,
                //"keoPhanLoaiShopee": keoPhanLoaiShopee,
                //"batKhuyenMaiShopee": batKhuyenMaiShopee,
                // --- TIKTOK
                "tgFlashSaleTiktok": tgFlashSaleTiktok,
                "giaDuoiTiktok": giaDuoiTiktok,
                "ktraKhuyenMaiTiktok": ktraKhuyenMaiTiktok,
                // --- SAPO
                "autoSelectStoreSapo": autoSelectStoreSapo,
                // -- LAZADA
                "giaDuoiLazada": giaDuoiLazada,
                "themPhanLoaiLazada": themPhanLoaiLazada,
                "ktraGiaChuongTrinhKMLazada": ktraGiaChuongTrinhKMLazada
            };

            $("#excuse-command").on("click", function() {
                const func = $(this).attr("data-func");
                if (actionMap[func]) actionMap[func]();
            });

            $.each($("iframe"), (index, value) => {
                $("iframe").eq(index).remove();
            });
        }
        if (!createUI) {
            createUI = true;
            createLayout();
        }

        // Dựng giao diện của mỗi lựa chọn
        function createLayoutTab(layoutName){
            console.log("TP LOAD LAYOUT: " + layoutName);
            layoutName = layoutName == undefined ? "Không có giao diện" : layoutName;
            boxLogging(`Giao Diện: ${layoutName}`, [`${layoutName}`], ["crimson"]);
            var content = $(".content-layout");
            $(".layout-tab").remove();
            switch(layoutName){
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
                    setEventKeoPhanLoaiShopee();
                    break;
                case "suaGiaSKUShopeeLayout":
                    content.append($(`
                    <div class="layout-tab">
                        <textarea id="data" placeholder="SKU {tab} Giá"></textarea>
                    </div>
                    `));
                    setEventSuaGiaSKUShopee();
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
                    setEventKtra5LanGiaShopee();
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
                    setEventSapXepAnhShopee();
                    break;
                case "flashSaleShopeeLayout":
                    content.append($(`
                        <div class="layout-tab">
                            <textarea id="flahsSaleName" placeholder="Nhập Tên Cần Bật Lên"></textarea>
                        </div>
                    `));
                    setEventFlashSaleShopee();
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
                    setEventKtraKhuyeMaiTiktok();
                    break;
                case "autobrowserLayout":
                    $("#excuse-command").hide();
                    content.append($(`<div class="layout-tab">
                                                <button id="getGeminiKey">Lấy Key Gemini</button>
                                            </div>`
                                         ));
                    setEventAutobrowser();
                    break;
            }
        }

        // Kiểm tra 5 lần giá đuôi
        function kTr5LanGiaShopee(){
            var max = $("input#max-price").val(), min = $("input#min-price").val();
            if (max / 5 > min){
                var suggPrice = max / 5;
                min = suggPrice;
                console.log("Giá cao nhất: " + max);
                console.log("Giá đề xuất: " + min);
            }
        }

        function setEventKtra5LanGiaShopee(){
            $("input#max-price").on("keyup", function (e) {
                var cost = $("input#max-price").val();
                console.log(cost);
                cost = cost.split(",");
                cost = cost.join("");
                cost = cost.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                $("#cost").val(cost);
                tinhGiaBanShopee();
            });
            $("input#min-price").on("keyup", function (e) {
                var cost = $("input#max-price").val();
                cost = cost.split(",");
                cost = cost.join("");
                cost = cost.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                $("#cost").val(cost);
                tinhGiaBanShopee();
            });
        }

        // Sửa giá đuôi
        function suaGiaDuoi(price){
            var gia = price.toString().replace(",", "");
            gia = gia.replace(".", "");
            gia = gia.trim();
            boxAlert(gia);
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

            giaDau = giaDau.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            giaDuoi = giaDuoi.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            gia = gia.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

            boxAlert(giaDuoi);
            boxLogging(`Giá Gốc ${gia} => Giá Đuôi ${giaDuoi}`, [`${gia}`, `${giaDuoi}`], ["green", "yellow"]);

            return giaCuoi;

            //console.log(`${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} - ${giaDau} - ${giaDuoi}`);
        }

        /*suaGiaDuoi(3522390);
        suaGiaDuoi(3525390);
        suaGiaDuoi(3525039);
        suaGiaDuoi(3522039);
        suaGiaDuoi(100069);
        suaGiaDuoi(140089);
        suaGiaDuoi(70061);*/

        // Cập nhật giá đuôi sàn cam
        function giaDuoiShopee(){
            console.log("CẬP NHẬT GIÁ ĐUÔI");

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

                    console.log(price);

                    var gia = currentPrice.text().replace("₫", "");
                    gia = gia.replace(".", "");

                    var giaKM = suaGiaDuoi(gia);

                    if(parseInt(giaKM) <= 0){
                        boxLogging(`Sản phẩm ${name.text()} không có giá đuôi, vui lòng kiểm tra những khung được đánh dấu`, [`${name.text()}`], ["crimson"]);
                        parent.eq(index).css("background", "crimson");
                    }else{
                        price.select();
                        price.val(giaKM);

                        if (window.getSelection) {
                            window.getSelection().removeAllRanges();
                        }else if (document.selection) {
                            document.selection.empty();
                        }

                        if ("createEvent" in document) {
                            var evt = document.createEvent("HTMLEvents");
                            evt.initEvent("change", false, true);
                            $(price).get(0).dispatchEvent(evt);
                        }
                        else {
                            $(price).get(0).fireEvent("onchange");
                        }

                        price.blur();

                        parent.eq(index).css("background", "green");
                    }

                    if(!switcher.hasClass("eds-switch--open")){
                        switcher.trigger("click").click();
                    }
                });
            });

            /*var tien = document.querySelectorAll(".currency-input .eds-input__input");
            var phanTram = document.querySelectorAll(".discount-input .eds-input__input");

            tien.forEach((current, index) => {
                var parent = current.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
                if(parent.querySelectorAll(".discount-item-selector input")[0].checked){
                    var gia = $(current).parent().parent().parent().parent().parent().parent().parent().parent().parent().find(".item-content.item-price").text();
                    console.log(gia);
                    gia = gia.replace("₫", "");
                    gia = gia.replace(".", "");
                    console.log("gia: " + gia);
                    var giaKM = suaGiaDuoi(gia);
                    if(giaKM >= 0){
                        console.log("GIÁ ĐUÔI: " + giaKM);
                        var phamTramGiam = (giaKM / gia) * 100;
                        current.select();
                        current.value = giaKM;

                        if (window.getSelection) {
                            window.getSelection().removeAllRanges();
                        }else if (document.selection) {
                            document.selection.empty();
                        }

                        if ("createEvent" in document) {
                            var evt = document.createEvent("HTMLEvents");
                            evt.initEvent("change", false, true);
                            current.dispatchEvent(evt);
                        }
                        else {
                            current.fireEvent("onchange");
                        }
                        $(parent).css("background", "green");


                    }else{
                        $(parent).css("background", "crimson");
                        console.log("ABC: " + $(parent));
                    }
                }
            });*/
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

                $("#after-price").text(afterPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
                $("#before-price").text(beforePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));

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
                $("#last-price").text(lastPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',').split(","));
            }
        }

        function setEventTinhGiaBanShopee(){
            $("#after-price").parent().on("click", function(){
                navigator.clipboard.writeText($(this).find("span").text().replace(",", ""));
            });
            $("#before-price").parent().on("click", function(){
                navigator.clipboard.writeText($(this).find("span").text().replace(",", ""));
            });
            $("#last-price").parent().on("click", function(){
                navigator.clipboard.writeText($(this).find("span").text().replace(",", ""));
            });

            $("#cost").on("keyup", function (e) {
                var cost = $("#cost").val();
                cost = cost.split(",");
                cost = cost.join("");
                cost = cost.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                $("#cost").val(cost);
                tinhGiaBanShopee();
            });
        }

        // Cập nhật giá đuôi sàn L
        function giaDuoiLazada(){
            var row = $(".next-table-row");
            var price = [];

            var i = 0;
            $.each(row, (index, value) => {
                var gia = $(value).find("input").val();
                var giaKM = suaGiaDuoi(gia);
                console.log(gia + " => " + giaKM);
                price.push(giaKM);
                $(value).find("td.special_price button.next-btn").click();
            })

            var balloon = $(".next-balloon-content")
            $.each(balloon, (index, value) => {
                $(value).find(" .money-number-picker input").val(price[index]);
            });
            navigator.clipboard.writeText('document.querySelectorAll(".next-balloon-content .action-wrapper button.next-btn-primary").forEach((current, index) => {current.click()})');
            alert("Code lỏ nên chịu khó Bấm F12 > Console rồi dán code ra chạy hen ^_^");
        }

        // Kéo Phân Loại shopee
        function setEventKeoPhanLoaiShopee(){
            $(".tp-container .content-layout .layout-tab button#get").on("click", () => {
                boxAlert("Đang lấy danh sách phân loại");
                boxLogging("Đang lấy danh sách phân loại");
                layPhanLoaiShopee();
            });
            $(".tp-container .content-layout .layout-tab button#set").on("click", () => {
                boxAlert("Đang cập nhật danh sách phân loại");
                boxLogging("Đang cập nhật danh sách phân loại");
                capNhatLoaiShopee();
            });
        }

        function layPhanLoaiShopee(){
            var group = $(".tp-container .content-layout .layout-tab #group").find("option:selected").index();
            var box = $(".variation-edit-item.version-a").eq(0).find(".option-container .options-item.drag-item");
            $(".tp-container .content-layout .layout-tab").append($(`<ul class="option-sortable"></ul>`));

            $(".tp-container .layout-tab .option-sortable").css({
                "display": "flex",
                "max-height": "30vh",
                "max-width": "60vw",
                "flex-wrap": "wrap",
                "overflow": "scroll",
                "justify-content": "space-around",
            });

            $(".tp-container .layout-tab .option-sortable .ui-state-default").css({
                "width": "50%",
                "background": "red",
            });

            $(".tp-container .layout-tab .option-sortable").sortable();

            $(".tp-container .layout-tab .option-sortable").disableSelection();

            $.each(box, (index, value) => {
                var content = $(".tp-container .layout-tab .option-sortable");
                content.append($(box).eq(index).clone());
            });
        }

        function capNhatLoaiShopee(){
            var group = $(".tp-container .content-layout .layout-tab #group").find("option:selected").index();
            var box = $(".variation-edit-item.version-a").eq(group).find(".option-container");

            var data = $(".tp-container .content-layout .layout-tab .option-sortable .options-item.drag-item");

            $.each(data, (index, value) => {
                box.append(value);
            });
        }

        // Kiểm tra giá chương trình khuyến mãi
        function ktraGiaChuongTrinhKMLazada(){
            console.log("Kiểm tra giá chương trình khuyến mãi");
            var box = $(".next-table-row.next--table-row-level-1");
            $.each(box, (index, value) => {
                var clicker = box.eq(index).find("td .next-checkbox .next-checkbox-inner");
                var name = box.eq(index).find("td[name='name'] .right-cell .product-title .product-title-text .two-line-clamp");
                var currentPrice = box.eq(index).find("td[name='currentPrice'] .currency-text-scope .number-text-scope");
                var suggestPrice = box.eq(index).find("td[name='suggestPrice'] div div span").eq(5);
                var price = box.eq(index).find("td[name='suggestPrice'] div div input");
                var data = $(".tp-container #group").text();

                var lines = data.trim().split('\n');

                var discounts = {};
                lines.forEach(function(line) {
                  var parts = line.split(',');
                  var percentage = parts.shift().trim();
                  var keywords = parts.map(function(keyword) { return keyword.trim(); });
                  if (!discounts[percentage]) {
                    discounts[percentage] = [];
                  }
                  discounts[percentage] = discounts[percentage].concat(keywords);
                });

                for (const [discount, keywords] of Object.entries(discounts)) {
                    if (keywords.some(keyword => name.text().toLowerCase().includes(keyword.toLowerCase()))) {
                        var maxDiscount = parseInt(currentPrice.text().replace(",", "")) - (parseInt(currentPrice.text().replace(",", "")) * parseInt(discount) / 100);
                        var suggest = parseInt(suggestPrice.text().replace("<=", ""));
                        if(suggest >= maxDiscount){
                            box.eq(index).css("background", "#6eff9e");
                            return;
                        }else if(suggest + 2000 >= maxDiscount){
                            box.eq(index).css("background", "#ffbb00");
                            return;
                        }else{
                            clicker.click();
                            box.eq(index).css("background", "crimson");
                            return;
                        }
                    }else{
                        maxDiscount = parseInt(currentPrice.text().replace(",", "")) - (parseInt(currentPrice.text().replace(",", "")) * parseInt(discount) / 100);
                        suggest = parseInt(suggestPrice.text().replace("<=", ""));
                        if(suggest >= maxDiscount){
                            box.eq(index).css("background", "#6eff9e");
                            return;
                        }else if(suggest + 2000 >= maxDiscount){
                            box.eq(index).css("background", "#ffbb00");
                            return;
                        }else{
                            clicker.click();
                            box.eq(index).css("background", "crimson");
                            return;
                        }
                    }
                }
            });
        }

        // Tám chuyện với AI
        function setEventAiReq(){
            $(".user-input button").on("click", function(e){
                var req = $("#ai-req-content").val();
                //aiChat(ques);
                sendMess("user", req);
                sendMess("bot", "Tèo vẫn đang được phát triển, mọi người đợi Tèo vài bữa nghen <3 <|:>");
            });

            $("#ai-req-content").on("keyup", function(e){
                if (e.keyCode == 13) {
                    var req = $(this).val();
                    sendMess("user", req);
                    sendMess("bot", "Tèo vẫn đang được phát triển, mọi người đợi Tèo vài bữa nghen <3 <|:>");
                }
            });
        }

        function sendMess(role, content){
            $("#ai-req-content").val("");
            $(".respon-content").animate({ scrollTop: $(document).height() }, 1000);
            if(!content.length <= 0){
                switch (role){
                    case "user":
                        $(".respon-content").append($("<p></p>").addClass("user-chat").text(content).css({
                            "width": "auto",
                            "max-width": "70%",
                            "height": "auto",
                            "max-height": "30vh",
                            "margin-right": "5%",
                            "float": "right",
                            "clear": "both",
                            "background": "pink",
                            "padding": "0.5vh 1vw",
                            "border-radius": "100px",
                        }));
                        break;
                    case "bot":
                        $(".respon-content").append($("<p></p>").addClass("bot-chat").text(content).css({
                            "width": "auto",
                            "max-width": "70%",
                            "height": "auto",
                            "max-height": "30vh",
                            "margin-left": "5%",
                            "float": "left",
                            "clear": "both",
                            "background": "#a3a3a3",
                            "padding": "0.5vh 1vw",
                            "border-radius": "100px",
                        }));
                        break;
                }
            }
        }

        function aiChat(question){
            var chatGPTKey = "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";
            $.ajax({
                url: "https://api.openai.com/v1/chat/completions",
                type: "POST",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + chatGPTKey);
                    xhr.setRequestHeader("Content-Type", "application/json");
                    xhr.setRequestHeader("Content-Security-Policy", "connect-src 'self' https://api.openai.com typesense.jquery.com");
                },
                data: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: question }]
                }),
                success: function(response) {
                    // Handle successful response here
                    $(".response-content").append($(`<p class="user-chat">${response}</p>`));
                    console.log(response);
                },
                error: function(error) {
                    // Handle error here
                    console.error(error);
                }
            });
        }

        // Sửa giá theo SKU Shopee
        function setEventSuaGiaSKUShopee(){
            setEventTabTextarea();
        }

        function suaGiaSKUShopee(){
            var data = $(".tp-container .content-layout .layout-tab #data");
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
                        boxAlert(`Giá của ${sku} đã sửa từ ${priceBox.val().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} => ${gia.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`);
                        boxLogging(`Giá của ${sku} đã sửa từ ${priceBox.val().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} => ${gia.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`, [`${sku}`, `${priceBox.val().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`, `${gia.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`], ["crimson", "yellow", "yellow"]);

                        if(parseInt(priceBox.val()) < parseInt(gia)){
                            boxLogging(`SKU: ${sku} có giá mới cao hơn giá hiện tại`, [`${sku}`], ["crimson"]);
                            box.eq(index).css("background", "crimson");
                        }else
                            box.eq(index).css("background", "lightgreen");

                        priceBox.select();
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
                            current.fireEvent("onchange");
                        }
                    }
                });
            });
        }

        // Cập nhật giá đuôi tiktok
        function giaDuoiTiktok(){
            var box = $(".theme-arco-table-body").find("div div");
            var sp = $(box).find("div");
            console.log("STOP: " + sp.find(".theme-arco-table-tr.theme-arco-table-row-custom-expand").find("div.theme-arco-table-td").eq(3).find("input"));
            console.log(sp.find("p"));
            console.log(sp.find("input"));

            var gia = sp.find("p");
            var giaKM = sp.find("input");

            var lastFocus = sp.find(".tp-change").length || 0;

            console.log("VI TRI: " + lastFocus);

            if(giaKM.eq(lastFocus).val() == "0")
                return;

            gia = suaGiaDuoiTiktok(gia.eq(lastFocus).text());
            giaKM.eq(lastFocus).val(gia).addClass("tp-change").select().attr("aria-valuenow", gia);
        }

        function suaGiaDuoiTiktok(price){
            var gia = price;
            gia = gia.replace("₫", "");
            gia = gia.replace(".", "");
            console.log("GIA: " + gia);
            var arrayGia = gia.replace(/\B(?=(\d{3})+(?!\d))/g, ',').split(",");
            console.log("ARRAY GIA: " + arrayGia);
            var giaDau;
            var giaDuoi;
            var flag;
            if(parseInt(arrayGia[arrayGia.length - 1]) != 0){
                for(var i = 0; i < arrayGia.length - 1; i++){
                    giaDau += arrayGia[i];
                }
                giaDau = giaDau.substring(9);
                giaDau = giaDau.substring(0, giaDau.length - (arrayGia.length - 2))
                for(i = 0; i <= gia.length; i++){
                    if(parseInt(gia.substring(i, 2)) == 0){
                        flag = i;
                        break;
                    }
                    giaDuoi = parseInt(gia.substring(giaDau.length)).toString();
                }


                while((giaDau).length < (gia).length){
                    giaDau = giaDau + "0";
                }

                while((giaDuoi).length < (gia).length){
                    giaDuoi = giaDuoi + "0";
                }

                while(parseInt(giaDau) < parseInt(giaDuoi)){
                    giaDuoi = giaDuoi.substring(0, giaDuoi.length - 1);
                }
            }
            if(giaDuoi == undefined)
                return -1;
            return giaDuoi;
        }

        // Chia thời gian khuyến mãi
        function tgFlashSaleTiktok(){
            console.log("FLASHSALE");
            var frame = $("#frame-count").val();
            var secDay = 86400;
            var day = parseInt(secDay / frame);
            var hours = parseInt(day / (60 * 60));
            var startTime = 0, endTime = hours;
            var setTime, stop = false;
            var arrayTime = [];
            $(".box-frame p").remove();
            while(true){
                setTime = startTime + " - " + endTime;
                arrayTime.push(setTime);

                startTime = endTime;
                endTime += hours;
                if(endTime >= 24){
                    endTime = 24;
                    arrayTime.push(startTime + "-" +endTime);
                    stop = true;
                }

                if(stop == true){
                    break;
                }
            }
            console.log(arrayTime);
            $.each(arrayTime, (index, value) => {
                var time = value.split("-"), startTime = time[0], endTime = time[1];
                if(parseInt(startTime) < 10){
                    startTime = "0" + startTime;
                }

                if(parseInt(endTime) < 10){
                    endTime = "0" + parseInt(endTime);
                }

                $(".box-frame").append($("<p></p>").text(`Khung giờ bắt đầu từ ${startTime} kết thúc lúc ${endTime}`));
            });
        }

        // Sắp xếp hình ảnh sản phẩm
        function setEventSapXepAnhShopee(){
            $(".layout-tab #getData").on("click", function(){
                var parentBox = $(".image-manager-wrapper .shopee-image-manager:nth-child(1) .container");
                var item = parentBox.find(".shopee-image-manager__itembox");
                var phanLoai = $(".options-item.drag-item");
                var len = item.length - phanLoai.length * 2 - 1
                var imgList = [];
                for(var i = 0; i < len; i++){
                    imgList.push(item.eq(i).find("img").attr("src"));
                }
                $(".img-list").find("*").remove();
                $.each(imgList, (index, value) => {
                    $(".img-list").append(`
                    <div class="box-img" data-pos="${index}"><img src="${value}" /></div>
                    `);
                });

                var dataIn4 = $("div.image-manager-wrapper").attr("images-info");
            });

            $(".layout-tab #setData").on("click", function(){
                var parentBox = $(".image-manager-wrapper .shopee-image-manager:nth-child(1) .container");
                var item = parentBox.find(".shopee-image-manager__itembox");
                var phanLoai = $(".options-item.drag-item");
                var len = item.length - phanLoai.length * 2 - 1
                var img = $(".layout-tab .box-img img");
                var imgList = [];
                var posList = [];
                var box = $("div[data-v-145c0745].shopee-image-manager .container");
                $.each(img, (index, value) => {
                    imgList.push(img.eq(index).attr("src"));
                    posList.push(img.eq(index).parent().attr("data-pos"));
                });
                box.find("*").remove();
                $.each(posList, (index, value) => {
                    /*
                    console.log($("div[data-v-6101bd68].shopee-file-upload").eq(0).find(".eds-upload input.eds-upload__input"));
                    document.querySelector("div[data-v-6101bd68].shopee-file-upload").dispatchEvent(new Event ("click", { bubble: true}));
                    $("div[data-v-6101bd68].shopee-file-upload").eq(0).find(".eds-upload input.eds-upload__input").trigger("click");
                    item.eq(index).find("img").attr("src", value);
                    */
                    box.append($(`
                    <div data-v-145c0745="" class="can-drag shopee-image-manager__itembox" data-draggable="true" style="width: 80px; max-width: 80px; height: 80px; max-height: 80px;">
                        <div data-v-452090d4="" data-v-145c0745="" class="popover-wrap"><div data-v-145c0745="" class="shopee-image-manager__content content-fill">
                            <img data-v-145c0745="" src="${imgList[value]}" class="shopee-image-manager__image">
                            <div data-v-145c0745="" class="shopee-image-manager__tools" style="display: none;">
                                <span data-v-145c0745="" class="shopee-image-manager__icon shopee-image-manager__icon--crop">
                                    <i data-v-ef5019c0="" data-v-145c0745="" class="eds-icon">
                                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" xml:space="preserve">
                                            <path d="M29.9,26.2h-2.8V7.9l3.2-3.2c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0l-3.1,3.1H7.7V4c0-0.6-0.4-1-1-1s-1,0.4-1,1v2.4H2.9 c-0.6,0-1,0.4-1,1s0.4,1,1,1h2.8v18.8c0,0.6,0.4,1,1,1h18.4v2.4c0,0.6,0.4,1,1,1s1-0.4,1-1v-2.4h2.8c0.6,0,1-0.4,1-1 S30.5,26.2,29.9,26.2z M23.8,8.4L7.7,24.5V8.4H23.8z M8.9,26.2L25.1,9.9v16.3H8.9z"></path>
                                        </svg>
                                    </i>
                                </span>
                                <span data-v-145c0745="" class="decollator"></span>
                                <span data-v-145c0745="" class="shopee-image-manager__icon shopee-image-manager__icon--delete">
                                    <i data-v-ef5019c0="" data-v-145c0745="" class="eds-icon">
                                        <svg viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g stroke-width="1" fill-rule="evenodd"><g fill-rule="nonzero"><g transform="translate(1.015625, 1.015625)"><path d="M13.5,2 L9.5,2 L9.5,1 C9.5,0.8640625 9.471875,0.73125 9.421875,0.6109375 C9.3453125,0.43125 9.21875,0.278125 9.059375,0.171875 C8.9796875,0.11875 8.890625,0.075 8.796875,0.0453125 C8.703125,0.015625 8.6015625,0 8.5,0 L5.5,0 C5.3640625,0 5.23125,0.028125 5.1109375,0.078125 C4.93125,0.1546875 4.778125,0.28125 4.671875,0.440625 C4.61875,0.5203125 4.575,0.609375 4.5453125,0.703125 C4.515625,0.796875 4.5,0.8984375 4.5,1 L4.5,2 L0.5,2 C0.2234375,2 0,2.2234375 0,2.5 C0,2.7765625 0.2234375,3 0.5,3 L1.5,3 L1.5,13 C1.5,13.1359375 1.528125,13.26875 1.578125,13.3890625 C1.6546875,13.56875 1.78125,13.721875 1.940625,13.828125 C2.0203125,13.88125 2.109375,13.925 2.203125,13.9546875 C2.296875,13.984375 2.3984375,14 2.5,14 L11.5,14 C11.6359375,14 11.76875,13.971875 11.8890625,13.921875 C12.06875,13.8453125 12.221875,13.71875 12.328125,13.559375 C12.38125,13.4796875 12.425,13.390625 12.4546875,13.296875 C12.484375,13.203125 12.5,13.1015625 12.5,13 L12.5,3 L13.5,3 C13.7765625,3 14,2.7765625 14,2.5 C14,2.2234375 13.7765625,2 13.5,2 Z M5.5,1 L8.5,1 L8.5,2 L5.5,2 L5.5,1 Z M11.5,13 L2.5,13 L2.5,3 L11.5,3 L11.5,13 Z"></path><path d="M4.5,11 C4.7765625,11 5,10.7765625 5,10.5 L5,6.5 C5,6.2234375 4.7765625,6 4.5,6 C4.2234375,6 4,6.2234375 4,6.5 L4,10.5 C4,10.7765625 4.2234375,11 4.5,11 Z"></path><path d="M7,11 C7.2765625,11 7.5,10.7765625 7.5,10.5 L7.5,5.5 C7.5,5.2234375 7.2765625,5 7,5 C6.7234375,5 6.5,5.2234375 6.5,5.5 L6.5,10.5 C6.5,10.7765625 6.7234375,11 7,11 Z"></path><path d="M9.5,11 C9.7765625,11 10,10.7765625 10,10.5 L10,6.5 C10,6.2234375 9.7765625,6 9.5,6 C9.2234375,6 9,6.2234375 9,6.5 L9,10.5 C9,10.7765625 9.2234375,11 9.5,11 Z"></path></g><path opacity="0" d="M0 0H16V16H0z"></path></g></g></svg>
                                    </i>
                                </span>
                            </div>
                            <div data-v-145c0745="" class="shopee-image-manager__tools flex-center" style="">
                                <span data-v-145c0745="" class="mandatory-icon">*</span>
                                <span data-v-145c0745="" class="shopee-image-manager__text">Ảnh bìa</span>
                            </div>
                        </div>
                    </div>
                </div>
                    `));
                });
                $(".layout-tab").remove();
            });

            $(".layout-tab #cancelData").on("click", function(){
                $(".layout-tab").remove();
            });
        }

        // Lấy Key
        function setEventAutobrowser(){
            $("#getGeminiKey").on("click", () => {
                navigator.clipboard.writeText(GEMINIKEY);
            })
        }

        // Thêm phân loại hàng loạt Lazada
        function themPhanLoaiLazada() {
            var data = $("#phanLoai").val();
            var dataList = data.split(",");
            console.log(dataList);
            var group = $(".prop-option-list").eq($("#group").val() - 1);

            if (!dataList.length > 0) return;

            $.each(dataList, (index, value) => {
                var box = $(".form-item-prop-option-item").last();

                // Gán giá trị và thuộc tính cho input
                var input = box.find(".item-textbox input");
                input.val(value);
                input.attr("value", value);
                input.trigger("keydown");
                input.select();
            });
        }


        // Tự động chọn gian hàng và sản phẩm Sapo
        function setEventAutoSelectorStoreSapo(){
            $(".hIhsai").on("click", function(){
                var itemName = $(".current-item-selected .item-title").text();
                localStorage.setItem("shopName", itemName);
            });
        }

        function autoSelectStoreSapo(){
            var shopName = localStorage.getItem("shopName");
            if(shopName == null)
                shopName = "Không có Dữ Liệu";
            var itemName = navigator.clipboard.readText()
                .then((text) => {
                    return text;
                })

            $("#sapo .shop-name").text(shopName);
            $("#sapo .item-name").text(itemName);
        }

        function setEventKtraKhuyeMaiTiktok(){
            $("#moDSSP").on("click", moDSSPTT);
            $("#ktraKhuyenMai").on("click", ktraKhuyenMaiTiktok);
        }

        // Kiểm tra khuyến mãi tiktok
        var productPerPageTT = 0;
        function moDSSPTT(){
            console.log("Đang mở danh sách vui lòng chờ");
            var sanpham = $(".expandContainer-qifQJp");
            productPerPageTT = sanpham.length;
            sanpham.trigger("click");
            /*$.each(sanpham, (index, value) => {
                console.log(`Đang mở sản phẩm thứ ${index}`);
                sanpham.trigger("click");
            });*/
        }

        var listProduct = [];
        function ktraKhuyenMaiTiktok(){
            var dsPhanLoai = $(".skuContainer-B4RoDW").has(".item-gEBAXO");
            if(dsPhanLoai.length < productPerPageTT)
                confirm(`Có sản phẩm chưa load xong, vui lòng đợi ${dsPhanLoai.length} / ${productPerPageTT}`);
            else{
                var sanpham = $(".core-table-row-expanded");
                dsPhanLoai = $(".core-table-expand-content");

                $.each(dsPhanLoai.find("div.item-gEBAXO"), (index, value) => {
                    if(!$(value).has(".salePrice-HkKDz1")){
                        var name = sanpham.eq(index).find(".content-Woa6mM").text();
                        var id = sanpham.eq(index).find(".product.manage.table.columns.id").text() + "\t";
                        listProduct.push(name);
                        listProduct.push(id);
                    };
                });

                console.log(listProduct);
            }
        }

        function setEventTabTextarea(){
            boxAlert("Gắn sự kiện nhấn tab cho textarea");
            $(".tp-container .content-layout .layout-tab textarea").on("keydown", function(event){
                if (event.keyCode === 9) { // keyCode 9 là mã ASCII của phím Tab
                    event.preventDefault();

                    const start = this.selectionStart;
                    const end = this.selectionEnd;

                    $(this).val($(this).val().substring(0, start) + '\t' + $(this).val().substring(end));

                    this.selectionStart = this.selectionEnd = start + 1;
                }
            })
        }

        // Sự kiện flash sale shopee
        function setEventFlashSaleShopee(){
            setEventTabTextarea();
        }

        // Bật flash sale shopee theo tên
        function flashSaleShopee(){
            var data = $("#flahsSaleName").val().split("\n");
            $.each(data, (index, value) => {
                value = value.split("\t");
                var name = value[0];
                var count = value[1] || -1;
                var container = $(".products-container-content form.product-table .table-card");
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
                        var buttonSwitch = productBox.eq(index).find(".enable-disable .eds-switch");
                        if($(productName).text().includes(name)){
                            // Xử lý giá
                            var gia = originalPrice.text().replace("₫", "")
                            gia = gia.replace(".", "");
                            gia = parseInt(suaGiaDuoi(gia));

                            if(!gia <= 0){
                                gia -= 1000;

                                gia = gia.toString().split("");
                                gia[gia.length - 1] = "1";
                                gia = gia.join("");

                                currentcyPrice.select();
                                currentcyPrice.val(gia);
                                currentcyPrice.attr("modelvalue", gia);
                            }else{
                                productBox.eq(index).css({
                                    "background": "crimson",
                                    "color": "#fff"
                                });
                            }

                            if (window.getSelection) {
                                window.getSelection().removeAllRanges();
                            }else if (document.selection) {
                                document.selection.empty();
                            }

                            if ("createEvent" in document) {
                                var evt = document.createEvent("HTMLEvents");
                                evt.initEvent("change", false, true);
                                $(currentcyPrice).get(0).dispatchEvent(evt);
                            }
                            else {
                                value.fireEvent("onchange");
                            }

                            if(count == -1)
                                count = parseInt(currentStock.text());

                            if(parseInt(currentStock.text()) >= parseInt(count)){
                                // Xử lý số lượng
                                campaignStock.select();
                                //let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                                //nativeInputValueSetter.call($(campaignStock).get(0), count);
                                campaignStock.val(count);
                                campaignStock.attr("modelvalue", count);

                                if (window.getSelection) {
                                    window.getSelection().removeAllRanges();
                                }else if (document.selection) {
                                    document.selection.empty();
                                }

                                if ("createEvent" in document) {
                                    evt = document.createEvent("HTMLEvents");
                                    evt.initEvent("change", false, true);
                                    $(campaignStock).get(0).dispatchEvent(evt);
                                }
                                else {
                                    value.fireEvent("onchange");
                                }

                                if(!buttonSwitch.hasClass("eds-switch--open")){
                                    buttonSwitch.parent().parent().parent().click();
                                }

                                // Xử lý chọn
                                productBox.eq(index).find(".item-selector").trigger("click");
                                productBox.eq(index).find(".item-selector input.eds-checkbox__input").val("true");

                                boxLogging(`Đã chọn: ${$(productName).text()}\nt\tGiá: ${gia}\n\tSố Lượng: ${count}\n`, [`${$(productName).text()}`, `${gia}`, `${count}`], ["crimson", "green", "blue"]);
                            }

                            /*navigator.clipboard.writeText(`
                            $.each($("input.changeValueTP"), (index, value) => {
                                $(this).select();
                                $("input.changeValueTP").eq(index).val($("input.changeValueTP").eq(index).attr("data-value-TP"));
                                $(this).removeClass("changeValueTP");
                                if (window.getSelection) {
                                    window.getSelection().removeAllRanges();
                                }else if (document.selection) {
                                    document.selection.empty();
                                }

                                if ("createEvent" in document) {
                                    var evt = document.createEvent("HTMLEvents");
                                    evt.initEvent("change", false, true);
                                    value.dispatchEvent(evt);
                                }
                                else {
                                    value.fireEvent("onchange");
                                }
                            });
                            `);*/
                        }
                    })
                });
            });
        }
    }
})();
