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
    window.onload = function(){
        /*
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
        */
        var GEMINIKEY = "AIzaSyDwwDQzjLc5C8iBgxGwTs0KbQvEzGJcS2c"

        const VERSION = "2025.02.06.16.45";

        // Dựng giao diện
        function createLayout(){
            if (window.parent != window.top) {
                console.log("we've been framed I tell ya");
                return;
            }
            console.log("Dựng Giao Diện");

            // Tạo khung giao diện
            var container = document.createElement("div");
            container.classList.add("tp-container");
            document.querySelector("body").appendChild(container);

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

            container = $(".tp-container").css({
                "position": "fixed",
                "width": "auto",
                "height": "auto",
                "top": `${top}px`,
                "left": `${left}px`,
                "z-index": "9999999999",
                "user-select": "none",
            });

            $(".tp-container *").css({
                "margin": "0",
                "padding": "0",
                "border": "0",
                "color": "#000",
            });

            // Kéo thả khung
            $(".tp-container").draggable({
                drag: function() {
                    var offset = $(this).offset();
                    var xPos = offset.left;
                    var yPos = offset.top;
                    localStorage.setItem("positionYTP",yPos);
                    localStorage.setItem("positionXTP",xPos);
                },
            });

            // Nút ẩn/hiện giao diện
            $(".tp-container").append($("<div></div>").addClass("icon-toggle").text("Công Cụ Hỗ Trợ").css({
                "width": "fit-content",
                "height": "auto",
                "background": "linear-gradient(90deg, rgba(255,0,0,0.8) 0%, rgba(192,42,138,0.8) 5%, rgba(111,102,167,0.8) 10%, rgba(89,172,184,1) 15%, rgba(74,196,115,1) 20%, rgba(106,199,59,0.8) 25%, rgba(202,194,79,0.8) 30%, rgba(201,169,118,0.8) 35%, rgba(187,118,118,1) 40%, rgba(255,0,0,1) 45%, rgba(255,0,0,1) 50%, rgba(187,118,118,1) 55%, rgba(201,169,118,0.8) 60%, rgba(202,194,79,0.8) 65%, rgba(106,199,59,0.8) 70%, rgba(74,196,115,1) 75%, rgba(89,172,184,1) 80%, rgba(192,42,138,0.8) 85%, rgba(255,0,0,0.8) 90%)",
                "background-size": "1200%",
                "font-weight": "800",
                "color": "#fff",
                "padding": "0.5vh 1vw",
                "border-radius": "100px",
            }));

            // Ẩn hiện giao diện
            $(".icon-toggle").on("dblclick", function(){
                if($(this).hasClass("active")){
                    $(".tab-container").css("display", "none");
                    $(".main-container").css("display", "none");
                    $(this).removeClass("active");
                }else{
                    $(".tab-container").css("display", "flex");
                    $(".main-container").css("display", "block");
                    $(this).addClass("active");
                }
            });

            // Hiệu ứng nút điều khiển
            var animate = $(".icon-toggle");
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

            // Tạo vùng chứa nhãn tab
            $(".tp-container").append($("<div></div>").addClass("tab-container").css({
                "display": "none",
                "gap": "1vw",
            }));

            /* Tạo nhãn tab
            $(".tab-container").append($("<div></div>").addClass("tab").text("Facebook").attr("data-tab", "facebook").css({
                "background": "rgb(8, 102, 255)",
                "color": "#fff",
            }));
            $(".tab-container").append($("<div></div>").addClass("tab").text("Instagram").attr("data-tab", "instagram").css({
                "background": "linear-gradient(to top left, #fbe18a, #fcbb45, #f86738, #f86738, #f74440, #f5326e, #d53692, #8f39ce, #544ced, #395dfb)",
                "color": "#fff",
            }));*/
            $(".tab-container").append($("<div></div>").addClass("tab").text("Shopee").attr("data-tab", "shopee").css({
                "background": "#ee4d2d",
                "color": "#fff",
            }));
            $(".tab-container").append($("<div></div>").addClass("tab").text("Lazada").attr("data-tab", "lazada").css({
                "background": "#3178f6",
                "color": "#fff",
            }));
            $(".tab-container").append($("<div></div>").addClass("tab").text("Tiktok").attr("data-tab", "tiktok").css({
                "background": "#000",
                "color": "#fff",
            }));

            /*$(".tab-container").append($("<div></div>").addClass("tab").html(`<span style="width: fit-content; height: fit-content; padding: 0 0.25vw; background: #23d187; color: #fff">S</span>apo`).attr("data-tab", "sapo").css({
                "background": "#fff",
                "color": "#188afc",
            }));*/

            $(".tab-container").append($("<div></div>").addClass("tab").text("Khác").attr("data-tab", "tool").css({
                "background": "#fff",
                "color": "#000",
            }));

            $(".tab-container .tab").css({
                "width": "fit-content",
                "height": "fint-content",
                "padding": "0.5vh 1vw",
                "border-top-left-radius": "10px",
                "border-top-right-radius": "10px",
                "font-weight": "800",
            });

            // Tạo vùng chứa nội dung của tab
            $(".tp-container").append($("<div></div>").addClass("main-container").css({
                "width": "auto",
                "height": "auto",
                "background": "rgba( 255, 255, 255, 0.7 )",
                "backdrop-filter": "blur(10px)",
                "border-bottom-left-radius": "10px",
                "border-bottom-right-radius": "10px",
                "border": "2px #000 solid",
                "color": "#000",
                "display": "none",
            }));

            // Tiêu đề
            $(".main-container").append($("<div></div>").addClass("header-title").text("CÔNG CỤ HỖ TRỢ" + " " + VERSION).css({
                "width": "auto",
                "height": "7vh",
                "line-height": "7vh",
                "text-align": "center",
                "font-size": "2vw",
                "padding": "1vh 1vw",
            }));

            // Tạo tab
            $(".main-container").append($("<div></div>").addClass("tab-content").attr("id","facebook").css({
                "width": "100%",
                "height": "auto",
            }));

            $(".main-container").append($("<div></div>").addClass("tab-content").attr("id","instagram").css({
                "width": "100%",
                "height": "auto",
            }));

            $(".main-container").append($("<div></div>").addClass("tab-content").attr("id","shopee").css({
                "width": "100%",
                "height": "auto",
            }));

            $(".main-container").append($("<div></div>").addClass("tab-content").attr("id","lazada").css({
                "width": "100%",
                "height": "auto",
            }));

            $(".main-container").append($("<div></div>").addClass("tab-content").attr("id","tiktok").css({
                "width": "100%",
                "height": "auto",
            }));

            $(".main-container").append($("<div></div>").addClass("tab-content").attr("id","sapo").css({
                "width": "100%",
                "height": "auto",
            }));

            $(".main-container").append($("<div></div>").addClass("tab-content").attr("id","tool").css({
                "width": "100%",
                "height": "auto",
            }));

            $(".tab-content").hide();
            //$("#tiktok").show();

            $("#shopee").append($(`
            <div class="choice-func">
                <span>Chọn Chức Năng</span>
                <select>
                    <option hidden></option>
                    <option data-func="giaDuoiShopee">Cập Nhật Giá Đuôi</option>
                    <option data-func="flashSaleShopee" data-layout="flashSaleShopeeLayout">Flash Sale</option>
                    <option data-func="tinhGiaBanShopee" data-layout="tinhGiaBanShopeeLayout">Tính Giá Bán</option>
                    <!-- <option data-func="sapXepHinhAnhShopee" data-layout="sapXepHinhAnhShopeeLayout">Sắp Xếp Hình Ảnh Sản Phẩm</option> -->
                    <!-- <option data-func="batKhuyenMaiShopee">Bật Khuyến Mãi</option> -->
                    <!-- <option data-func="5LanGiaShopee" data-layout="5langiaShopeeLayout")>Kiểm Tra 5 Lần Giá</option> --?
                </select>
            </div>
                                `));

            $("#lazada").append($(`
            <div class="choice-func">
                <span>Chọn Chức Năng</span>
                <select>
                    <option hidden></option>
                    <option data-func="giaDuoiLazada">Cập Nhật Giá Đuôi</option>
                </select>
            </div>
                                `));

            $("#tiktok").append($(`
            <div class="choice-func">
                <span>Chọn Chức Năng</span>
                <select>
                    <option hidden></option>
                </select>
            </div>
                                `));

            $("#tool").append($(`
            <div class="choice-func">
                <span>Chọn Chức Năng</span>
                <select>
                    <option hidden></option>
                    <option data-func="autobrowser" data-layout="autobrowserLayout">Trình Duyệt Tự Động</option>
                </select>
            </div>
                                `));

            $(".choice-func").css({
                "display": "flex",
                "align-items": "center",
                "justify-content": "center",
                "gap": "2vw",
                "height": "5vh",
                "padding": "0 1vw",
            });

            $(".choice-func p").css({
                "width": "40%",
                "height": "5vh",
                "line-height": "5vh",
                "vertical-align": "center",
                "text-align": "center",
                "text-indent": "10%",
            });

            $(".choice-func select").css({
                "width": "60%",
                "height": "5vh",
                "line-height": "5vh",
                "flex-grow": "3",
                "background": "#FFFFFFB2",
                "backdrop-filter": "blur(10px)",
                "border-radius": "10px",
                "text-indent": "5%",
                "color": "#000",
            });

            $(".choice-func select option").css({
                "width": "60%",
                "height": "5vh",
                "line-height": "5vh",
                "flex-grow": "3",
                "background": "#FFFFFFB2",
                "backdrop-filter": "blur(10px)",
                "border-radius": "10px",
                "text-indent": "5%",
                "color": "#000",
            });

            $("select").on("change", function(){
                var option = $(this).find("option:selected").attr("data-func");
                $("#excuse-command").show();
                $("#excuse-command").attr("data-func", option);
                $(".layout-tab").remove();
                createLayoutTab($(this).find("option:selected").attr("data-layout"));
            });

            $(".tab-content .dev_ing").css({
                "width": "100%",
                "height": "5vh",
                "line-height": "5vh",
                "text-align": "center",
            });

            $(".tab-container .tab").on("click", function(e){
                if(!$(this).hasClass("active")){
                    $(this).parent().find(".active").removeClass("active");
                    $(this).addClass("active");
                    $(".tab-content").hide();
                    var nameTab = $(this).attr("data-tab");
                    $(".header-title").text("ĐANG CHỌN: " + nameTab.toUpperCase());
                    $("#" + nameTab).show();
                    $("#" + nameTab).find("select").val($("#" + nameTab).find("select option:first").val());
                    $(".layout-tab").remove();
                    $("#excuse-command").show();
                    $("#excuse-command").attr("data-func", $("#" + nameTab + " select option:selected").attr("data-func"));
               }
            });

            // Tạo nút chạy
            $(".main-container").append($("<button>CHẠY</button>").attr({
                "id": "excuse-command",
                "data-func": "",
            }));
            $("#excuse-command").css({
                "width": "90%",
                "height": "5vh",
                "background": "crimson",
                "color": "#fff",
                "font-weight": "800",
                "margin-left": "5%",
                "margin-top": "2vh",
                "border": "none",
            })

            $("#excuse-command").on("click", function(){
                var func = $(this).attr("data-func");
                switch (func){
                    case "giaDuoiShopee":
                        giaDuoiShopee();
                        break;
                    case "5LanGiaShopee":
                        kTr5LanGiaShopee();
                        break;
                    case "tinhGiaBanShopee":
                        tinhGiaBanShopee();
                        break;
                    case "batKhuyenMaiShopee":
                        batKhuyenMaiShopee();
                        break;
                    case "tgFlashSaleTiktok":
                        tgFlashSaleTiktok();
                        break;
                    case "autoSelectStoreSapo":
                        autoSelectStoreSapo();
                        break;
                    case "flashSaleShopee":
                        flashSaleShopee();
                        break;
                    case "giaDuoiLazada":
                        giaDuoiLazada();
                        break;
                }
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
            $(".layout-tab").remove();
            switch(layoutName){
                case "5langiaShopeeLayout":
                    $("#shopee").append($(`<div class="layout-tab">
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
                    $(".layout-tab div").css({
                        "position": "relative",
                        "display": "flex",
                        "width": "100%",
                        "height": "5vh",
                        "align-items": "center",
                        "justify-content": "center",
                        "margin-top": "2vh",
                    });
                    $(".layout-tab div input").css({
                        "width": "70%",
                        "height": "5vh",
                        "background": "#FFFFFFB2",
                        "backdrop-filter": "blur(10px)",
                        "text-indent": "20px",
                        "border-radius": "100px",
                    });
                    $(".layout-tab div label").css({
                        "width": "20%",
                        "height": "5vh",
                        "line-height": "5vh",
                        "color": "#000",
                    });
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
                    $("#shopee").append($(`
                        <div class="layout-tab">
                            <textarea id="flahsSaleName" placeholder="Nhập Tên Cần Bật Lên"></textarea>
                        </div>
                    `));
                    $(".layout-tab").css({
                        "width": "100%",
                        "height": "auto",
                        "max-height": "80vh",
                        "overflow": "scroll",
                    });

                    $(".layout-tab textarea").css({
                        "width": "100%",
                        "height": "auto",
                        "min-height": "30vh",
                    })
                    break;
                case "tinhGiaBanShopeeLayout":
                    $("#shopee").append($(`
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
                    $(".layout-tab").css({
                        "width": "100%",
                        "height": "auto",
                        "max-height": "80vh",
                        "overflow-y": "scroll",
                    });
                    $(".layout-tab .input-cost").css({
                        "width": "100%",
                        "height": "5vh",
                        "line-height": "5vh",
                        "display": "flex",
                        "align-items": "center",
                        "justtify-content": "center",
                    });
                    $(".layout-tab .input-cost *").css({
                        "width": "100%",
                        "height": "5vh",
                        "line-height": "5vh",
                    });
                    $(".layout-tab .input-cost input").css({
                        "text-indent": "5%",
                    });
                    setEventTinhGiaBanShopee();
                    break;
                case "autobrowserLayout":
                    $("#excuse-command").hide();
                    $("#tool").append($(`<div class="layout-tab">
                                                <button id="getGeminiKey">Lấy Key Gemini</button>
                                            </div>`
                                         ));
                    $(".layout-tab button").css({
                        "padding": "1vh 1vw",
                        "background": "crimson",
                        "color": "#fff",
                    });
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
            var gia = price;
            gia = gia.replace(",", "");
            var arrayGia = gia.replace(/\B(?=(\d{3})+(?!\d))/g, ',').split(",");
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

        // Cập nhật giá đuôi sàn cam
        function giaDuoiShopee(){
            console.log("CẬP NHẬT GIÁ ĐUÔI");
            var tien = document.querySelectorAll(".currency-input .eds-input__input");
            var phanTram = document.querySelectorAll(".discount-input .eds-input__input");

            tien.forEach((current, index) => {
                var parent = current.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
                if(parent.querySelectorAll(".discount-item-selector input")[0].checked){
                    var gia = current.value;
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
                    }
                }
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
            var row = document.querySelectorAll(".next-table-row");

            var i = 0;
            row.forEach((current, index) => {
                var gia = current.children[1].querySelector("input").value
                var giaKM = suaGiaDuoi(gia);
                current.children[2].querySelector("button").click();

                document.querySelectorAll(".next-balloon-content input")[i].value = giaKM.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

                i++;
            })
            navigator.clipboard.writeText('document.querySelectorAll(".next-balloon-content .action-wrapper button.next-btn-primary").forEach((current, index) => {current.click()})');
            alert("Code lỏ nên chịu khó Bấm F12 > Console rồi dán code ra chạy hen ^_^");
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

        // Bật flash sale shopee theo tên
        function flashSaleShopee(){
            var data = $("#flahsSaleName").val().split("\n");
            $.each(data, (index, value) => {
                value = value.split("\t");
                var name = value[0];
                var count = value[1];
                var container = $(".products-container-content form.product-table .table-card");
                $.each(container, (index, value) => {
                    var productBox = container.eq(index).find(".inner-rows .inner-row");
                    $.each(productBox, (index, value) => {
                        var productName = productBox.eq(index).find(".variation .ellipsis-content").text();
                        if(productName.includes(name)){
                            productBox.eq(index).find(".item-selector").trigger("click");
                            productBox.eq(index).find(".item-selector input.eds-checkbox__input").val("true");

                            // Số Lượng
                            var countBox = productBox.eq(index).find(".campaign-stock input.eds-input__input");
                            //var countBox = $(".batch-setting-wrapper .campaign-stock input.eds-input__input");
                            countBox.focus();
                            countBox.parent().addClass("focused");
                            countBox.attr({
                                "modelvalue": count,
                            });

                            countBox.select();

                            var press = $.Event("keydown",
                            {
                             "key": "Backspace",
                             "keyCode": 8,
                             "which": 8,
                             "code": "Backspace",
                             "location": 0,
                             "altKey": false,
                             "ctrlKey": false,
                             "metaKey": false,
                             "shiftKey": false,
                             "repeat": false
                            });

                            countBox.trigger(press);

                            countBox.val(count);
                        }
                    })
                });
            });
        }
    }
})();
