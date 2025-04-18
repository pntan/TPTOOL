  'use strict';
  var createUI = false;

    const VERSION = "1.1.3";
  /*var Jqu = document.createElement("script");
  Jqu.setAttribute("src", "https://code.jquery.com/jquery-3.7.1.min.js");
  Jqu.setAttribute("rel", "preload");
  Jqu.setAttribute("async", "async");
  document.head.appendChild(Jqu);

  var JquUI = document.createElement("script");
  JquUI.setAttribute("src", "https://code.jquery.com/ui/1.14.1/jquery-ui.js");
  JquUI.setAttribute("rel", "preload");
  document.head.appendChild(JquUI);*/

        const libraries = [
            'https://code.jquery.com/jquery-3.7.1.min.js',
            'https://code.jquery.com/ui/1.14.1/jquery-ui.js',
            'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js',

        ];

        function loadScriptsSequentially(scripts, callback) {
            let index = 0;

            function loadNext() {
            if (index >= scripts.length) {
              if (callback) callback();
              return;
            }

            const script = document.createElement('script');
            script.src = scripts[index];
            script.onload = () => {
              index++;
              loadNext();
            };
            script.onerror = () => {
              console.error(`Không thể tải script: ${scripts[index]}`);
              index++;
              loadNext(); // vẫn tiếp tục nếu lỗi
            };
            document.head.appendChild(script);
            }

            loadNext();
        }

        loadScriptsSequentially(libraries, () => {
          console.log('Đã load xong tất cả thư viện!');
          // gọi hàm chính của bạn ở đây nếu cần
        });

    // Lấy nonce từ thẻ meta hoặc bất kỳ thẻ script nào
    function getNonce() {
      let nonce = $('script[nonce]').attr('nonce');
      if (!nonce) {
        nonce = $('meta[http-equiv="Content-Security-Policy"]').attr('content')?.match(/nonce-([\w\d]+)/)?.[1] || '';
      }
      return nonce || '';
    }

    // Auto patch style, iframe, script dynamic
    function applyNonce() {
      const nonce = getNonce();
      if (!nonce) return console.warn('Không tìm thấy nonce');

      // Style inline
      $('style:not([nonce])').attr('nonce', nonce);

      // Iframe
      $('iframe:not([nonce])').attr('nonce', nonce);

      // Script do tool tạo
      $('script:not([nonce]):not([src])').attr('nonce', nonce);

      console.log('==> Nonce Applied:', nonce);
    }

    // Ghi console log
    function boxAlert(content){
      console.log(`%cTanPhan: %c${content}`, "color: crimson; font-size: 2rem", "color: yellow; font-size: 1.5rem");
      //console.log(`%c${content}`, "color: yellow; font-size: 1.5rem");
    }

    // Ghi logging
    function escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        function boxLogging(text, words = [], colors = []){
            var log = $(".content-log pre");
            var data = log.html();
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
              <p>Công Cụ Hỗ Trợ <span class="version">(ver ${VERSION})</span></p>
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
                                <option data-func="giaDuoiChuongTrinhShopee" data-layout="giaDuoiChuongTrinhShopeeLayout">Cập Nhật Giá Đăng Ký Chương Trình</option>
                                <option data-func="flashSaleShopee" data-layout="flashSaleShopeeLayout">Flash Sale</option>
                                <option data-func="tinhGiaBanShopee" data-layout="tinhGiaBanShopeeLayout">Tính Giá Bán</option>
                                <option data-func="themPhanLoaiShopee" data-layout="themPhanLoaiShopeeLayout">Thêm Phân Loại</option>
                                <option data-func="suaGiaSKUShopee" data-layout="suaGiaSKUShopeeLayout">Sửa Giá Theo SKU</option>
                                <option data-func="kTr5LanGiaShopee" data-layout="kTr5LanGiaShopeeLayout">Kiểm Tra 5 Lần Giá</option>
                                <option data-func="keoPhanLoaiShopee" data-layout="keoPhanLoaiShopeeLayout">Kéo Phân Loại</option>
                                <option data-func="themGioiTinhPhanLoaiShopee" data-layout="themGioiTinhPhanLoaiShopeeLayout">Thên Giới Tính Cho Phân Loại</option>
                                <option data-func="kiemTraPhanLoaiShopee" data-layout="kiemTraPhanLoaiShopeeLayout">Kiểm Tra Phân Loại</option>
                                <option data-func="kiemTraMaPhanLoaiShopee" data-layout="kiemTraMaPhanLoaiShopeeLayout">Hiển Thị Mã Mã Phân Loại</option>
              </optgroup>

              <!-- Lazada -->
              <optgroup label="Lazada">
                                <option data-func="giaDuoiLazada">Cập Nhật Giá Đuôi</option>
                                <option data-func="themPhanLoaiLazada" data-layout="themPhanLoaiShopeeLayout">Thêm Phân Loại</option>
                                <option data-func="themGiaTheoSKULazada" data-layout="themGiaTheoSKULazadaLayout">Sửa giá theo SKU</option>
                                <option data-func="ktraGiaChuongTrinhKMLazada" data-layout="ktraGiaChuongTrinhKMLazadaLayout">Kiểm Tra Giá Khuyến Mãi</option>
              </optgroup>

              <!-- TikTok -->
              <optgroup label="TikTok">
                                <option data-func="giaDuoiTiktok">Cập Nhật Giá Đuôi</option>
                                <option data-func="ktraKhuyenMaiTiktok" data-layout="ktraKhuyenMaiTiktokLayout">Kiểm Tra Văng Khuyến Mãi</option>
              </optgroup>

              <!-- Sapo -->
              <optgroup label="Sapo">
                                <option data-func="kiemTraTonSapo" data-layout="kiemTraTonSapoLayout">Kiểm Tra Tồn</option>
              </optgroup>

              <!-- Khác -->
              <optgroup label="Khác">
                                <!-- <option data-func="autobrowser" data-layout="autobrowserLayout">Trình Duyệt Tự Động</option> -->
                                <option data-func="splitExcelFile" data-layout="splitExcelFileLayout">Chia Nhỏ File Excel</option>
                                <option data-func="compareVoucher" data-layout="compareVoucherLayout">So Sánh Voucher</option>
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
                    <div class="resize-handle top-left"></div>
                    <div class="resize-handle top-right"></div>
                    <div class="resize-handle bottom-left"></div>
                    <div class="resize-handle bottom-right"></div>
        </div>
      `);
      $("body").append(container);

      // Xác định tọa độ
      var top = 0, left = 0;
            /*
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
            */

      var cssStyle = $(`
      <style>
                .tp-container {
                    top: ${top}px;
                    left: ${left}px;
                    width: auto;
                    background: rgba(255, 255, 255, 0.8); /* Nền trắng mờ */
                    backdrop-filter: blur(12px); /* Làm mờ nền phía sau */
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(200, 200, 200, 0.6);
                    border-radius: 12px;
                    font-family: 'Segoe UI', sans-serif;
                    font-size: 14px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    z-index: 9999;
                    resize: none !important; /* tránh conflict */
                    position: fixed;
                    overflow: auto; /* Hoặc hidden */
                    max-width: 100%; /* Đảm bảo container không vượt quá màn hình */
                    max-height: 100%; /* Đảm bảo container không vượt quá màn hình */
                  }

                  .tp-container *::-webkit-scrollbar {
                    display: none;
                  }

                  .tp-container .toggle-content {
                    background: rgba(245, 245, 245, 0.8);
                    padding: 10px;
                    cursor: pointer;
                    text-align: center;
                    font-weight: 600;
                    font-size: 15px;
                    border-bottom: 1px solid rgba(180, 180, 180, 0.4);
                    border-radius: 12px 12px 0 0;
                  }

                  .tp-container .content {
                    display: none;
                    padding: 15px;
                  }

                  .content-header {
                    font-weight: 600;
                    margin-bottom: 10px;
                    color: #222;
                  }

                  .content-log pre {
                    background: rgba(250, 250, 250, 0.6);
                    border: 1px solid rgba(200, 200, 200, 0.5);
                    border-radius: 8px;
                    height: 100px;
                    overflow: auto;
                    padding: 10px;
                    font-size: 13px;
                    color: #333;
                  }

                  .content-feature select {
                    width: 100%;
                    padding: 10px;
                    font-size: 14px;
                    border-radius: 8px;
                    border: 1px solid #bbb;
                    margin-bottom: 15px;
                    background: rgba(255, 255, 255, 0.7);
                    color: #000;
                    margin-top: 2vh
                  }

                  .content-layout {
                    margin-bottom: 15px;
                  }

                  .content-button button {
                    width: 100%;
                    padding: 12px;
                    font-size: 15px;
                    font-weight: bold;
                    background: rgba(220, 20, 60, 0.7);
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                  }

                  .content-button button:hover {
                    background: rgba(180, 0, 40, 0.5);
                    transform: scale(1.02);
                  }

                  .tp-container .content .content-layout * {
                    margin-bottom: 10px;
                  }

                  .tp-container .content .content-layout input,
                  .tp-container .content .content-layout textarea {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #aaa;
                    border-radius: 8px;
                    font-size: 14px;
                    background: rgba(255, 255, 255, 0.7);
                    color: #000;
                  }

                  .tp-container .content .content-layout label {
                    font-weight: 500;
                    display: block;
                    margin-bottom: 5px;
                    color: #222;
                  }

                  .tp-container .content .content-layout button {
                    background: rgba(0, 123, 255, 0.7);
                    color: white;
                    padding: 10px 16px;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    cursor: pointer;
                  }

                  .tp-container .content .content-layout button:hover {
                    background: rgba(0, 86, 179, 0.5);
                  }

                  .tp-container .content .content-layout table tr{
                      margin-top: 1vh;
                  }

                  .tp-container .content .content-layout table tr td{
                      padding: 1vh 1vw;
                      text-align: center;
                  }

                  /* Scrollbar nhẹ */
                  .tp-container pre::-webkit-scrollbar {
                    width: 6px;
                  }
                  .tp-container pre::-webkit-scrollbar-thumb {
                    background: #ccc;
                    border-radius: 3px;
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
                      opacity: 1
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
      `);

      $(".tp-container").append(cssStyle);

      // Kéo thả khung
      $(".tp-container").draggable({
                start: function (event, ui) {
                  // Nếu đang resize thì không cho drag
                  if (isResizing) return false;
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

            // Resize container (4 góc)
            let isResizing = false, containers, startX, startY, startWidth, startHeight;

            // Hàm resize góc
            function resize(e, direction) {
                e.preventDefault();
                container = $(e.target).closest('.tp-container');

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
        applyNonce();
      });

      // Map các hàm tương ứng với data-func
      const actionMap = {
        // --- SHOPEE
        "giaDuoiShopee": giaDuoiShopee,
        "kTr5LanGiaShopee": kTr5LanGiaShopee,
        "tinhGiaBanShopee": tinhGiaBanShopee,
        "flashSaleShopee": flashSaleShopee,
        "suaGiaSKUShopee": suaGiaSKUShopee,
        "kiemTraPhanLoaiShopee": kiemTraPhanLoaiShopee,
                "themGioiTinhPhanLoaiShopee": themGioiTinhPhanLoaiShopee,
        "themPhanLoaiShopee": themPhanLoaiShopee,
                "kiemTraMaPhanLoaiShopee": kiemTraMaPhanLoaiShopee,
                "giaDuoiChuongTrinhShopee": giaDuoiChuongTrinhShopee,
        //"keoPhanLoaiShopee": keoPhanLoaiShopee,
        //"batKhuyenMaiShopee": batKhuyenMaiShopee,
        // --- TIKTOK
        "tgFlashSaleTiktok": tgFlashSaleTiktok,
        "giaDuoiTiktok": giaDuoiTiktok,
        "ktraKhuyenMaiTiktok": ktraKhuyenMaiTiktok,
        // --- SAPO
        "kiemTraTonSapo": kiemTraTonSapo,
        // -- LAZADA
        "giaDuoiLazada": giaDuoiLazada,
        "themPhanLoaiLazada": themPhanLoaiLazada,
                "themGiaTheoSKULazada": themGiaTheoSKULazada,
        "ktraGiaChuongTrinhKMLazada": ktraGiaChuongTrinhKMLazada,
        //-- KHÁC
        "splitExcelFile": splitExcelFile,
        "compareVoucher": compareVoucher,
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
      applyNonce();
            setPreviewLink();
    }

    // Dựng giao diện của mỗi lựa chọn
    function createLayoutTab(layoutName){
      console.log("TP LOAD LAYOUT: " + layoutName);
      layoutName = layoutName == undefined ? "Không có giao diện" : layoutName;
      boxLogging(`Giao Diện: ${layoutName}`, [`${layoutName}`], ["crimson"]);
      var content = $(".content-layout");
      $(".layout-tab").remove();
      switch(layoutName){
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
              setEventCompareVoucher();
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
                    setEventThemGiaTheoSKULazada();
                    break;
                case "kiemTraTonSapoLayout":
                    content.append($(`
                    <div class="layout-tab">
                        <textarea id="data"></textarea>
                    </div>
                    `));
                    setEventKiemTraTonSapo();
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
                case "kiemTraMaPhanLoaiShopeeLayout":
                    content.append($(`
                    <div class="layout-tab">
                    </div>
                    `));
                    break;
        case "themGioiTinhPhanLoaiShopeeLayout":
          content.append($(`
          <div class="layout-tab">
            <select id="group">
              <option>Phân Loại 1</option>
              <option>Phân Loại 2</option>
            </select>
            <textarea id="data"></textarea>
          </div>
          `));
          setEventThemGioiTinhPhanLoaiShopee();
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
          setEventKtraPhanloaiShopee();
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
          setEventThemPhanLoaiShopee();
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

        // So sánh voucher
        function setEventCompareVoucher(){
            $("#addVoucher").on("click", function(){
                var i = 0;
                var voucherBox = $(".voucher-box.root").eq(0).clone(true).removeClass("root").removeAttr("hidden");
                $(".tp-container .content-layout table tbody").append(voucherBox);
            })

            $(".remove-voucher").on("click", function(){
                $(this).parent().remove();
            });

            $(".tp-container .content-layout table tbody .voucher-box input").on("keyup", function(){
                var cost = $(this).val();
                cost = cost.split(",");
                cost = cost.join("");
                cost = cost.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                $(this).val(cost);
            });

            $(".tp-container .content-layout .layout-tab #data").on("keyup", function(){
                var cost = $(this).val();
                cost = cost.split(",");
                cost = cost.join("");
                cost = cost.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                $(this).val(cost);
            });
        }

        function compareVoucher() {
            const data = $(".tp-container .content-layout .layout-tab #data");
            const arrayData = data.val().split("\n").map(x => parseInt(x.replace(/,/g, "").trim())).filter(x => !isNaN(x));
            const voucherBoxes = $(".voucher-box").slice(1);

            let headers = `<tr><th>Voucher</th>`;
            arrayData.forEach(price => {
                headers += `<th>${price.toLocaleString()}đ</th>`;
            });
            headers += `</tr>`;

            let rows = ``;

            voucherBoxes.each((index, el) => {
                // Bỏ qua box đầu tiên nếu là template
                if (index === 0) return;

                const box = $(el);
                const discount = parseInt(box.find(".discount-percent input").val().replace(/,/g, "")) || 0;
                const discountType = box.find(".discount-percent select option:selected").index(); // 0 = %, 1 = ₫
                const maxDiscount = parseInt(box.find(".max-discount input").val().replace(/,/g, "")) || 0;
                const conditionDeal = parseInt(box.find(".condition-deal input").val().replace(/,/g, "")) || 0;

                let voucherText = `Giảm ${discount}${discountType === 0 ? "%" : "đ"}`;
                if (maxDiscount) voucherText += `, tối đa ${maxDiscount.toLocaleString()}đ`;
                if (conditionDeal) voucherText += `, đơn từ ${conditionDeal.toLocaleString()}đ`;

                let row = `<tr><td>${voucherText}</td>`;

                arrayData.forEach(price => {
                    if (price < conditionDeal) {
                        row += `<td style="color: red;">Không đủ điều kiện</td>`;
                    } else {
                        let discountPrice = 0;
                        if (discountType === 0) {
                            discountPrice = price * (discount / 100);
                        } else {
                            discountPrice = discount;
                        }

                        if (maxDiscount > 0) discountPrice = Math.min(discountPrice, maxDiscount);
                        let finalPrice = price - discountPrice;

                        row += `<td>-${discountPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ<br>(còn ${finalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')})</td>`;
                    }
                });

                row += `</tr>`;
                rows += row;
            });

            const table = `
            <table style="
                border-collapse: collapse;
                width: 100%;
                font-family: Arial, sans-serif;
                text-align: center;
            ">
                <thead style="background: #f0f0f0;">
                    ${headers}
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>`;

            // In ra bảng (bạn có thể dùng .html() nếu có container hiển thị)
            boxLogging(table);
        }


        // Sửa giá của đăng ký chương trinh shopee
        function giaDuoiChuongTrinhShopee(){
            console.log("CẬP NHẬT GIÁ ĐUÔI");

      var box = $(".eds-react-table-container table.src-components-ProductTable-VirtualTable---vBody--2QBA6 tbody > div");

      $.each(box, (index, value) => {
                var parent = box.eq(index).find("tr.src-components-ProductTable-VirtualTable---vExpandedRow--375Xg table tbody.eds-react-table-tbody > tr");
        $.each(parent, (index, value) => {
                    if(parent.eq(index).is(".eds-react-table-row-selected")){
                        //var checkBox = parent.eq(index).find("td").eq(0).find("label");
                        var id = parent.eq(index).find("td").eq(1).find("div.src-components-ProductTable-VariationCol---variationCol--2pxe1 > div").eq(0);
                        var name = parent.eq(index).find("td").eq(1).find("div.src-components-ProductTable-VariationCol---variationCol--2pxe1 > div").eq(1);
                        var currentPrice = parent.eq(index).find("td").eq(5);
                        var price = parent.eq(index).find("td").eq(2).find("input");

                        var gia = currentPrice.text().replace("₫", "");
                        gia = gia.replace(".", "");

                        var giaKM = suaGiaDuoi(gia);

                        var discountType = $('input[name="discount-type"]:checked');
                        console.log(discountType);

                        if(discountType.length > 0){
                            var type = discountType.eq(0).attr("id");

                            var giaGiam = $(`input[id="tp-discount"]`).val().length > 0 ? $(`input[id="tp-discount"]`).val() : 0;

                            giaGiam = parseInt(giaGiam);

                            console.log(giaGiam);

                            if(type == "money"){
                                giaKM -= giaGiam
                            }else if(type == "percent"){
                                giaKM *= (100 - giaGiam) / 100;
                            }
                        }

                        giaKM = giaKM.toString().split("");
                        giaKM[giaKM.length - 1] = "1";
                        giaKM = giaKM.join();


                        clearReactInput(price);
                        simulateReactInput(price, giaKM);
                    }
        });
            });
        }

        // Thêm giá theo SKU lazada
        function setEventThemGiaTheoSKULazada(){
            setEventTabTextarea();
        };

        function themGiaTheoSKULazada(){
            var data = $(".tp-container .content-layout .layout-tab #data");
            var arrayData = data.val().split("\n").filter(i => i.trim() !== "");

            var box = $(".next-table-body .next-table-row");
            $.each(arrayData, (index, value) => {
                var data = value.split("\t");

                var parentSku = data[0];
                var parentGia = data[1];

                $.each(box, (index, value) => {
                    var sku = box.eq(index).find(".next-table-cell.SellerSku input");
                    var price = box.eq(index).find(".next-table-cell.price input");

                    console.log(sku.val() + " <=> " + parentSku + " <=> " + sku.val().includes(parentSku));

                    if(sku.val().includes(parentSku)){
                        simulateReactInput(price, parentGia);
                    }
                })
            });
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
                }
            },500);
        }

        // Kiểm tra tồn Sapo
        function setEventKiemTraTonSapo(){
            setEventTabTextarea();
        }
        function kiemTraTonSapo() {
            var data = $(".tp-container .content-layout .layout-tab #data");
            var arrayData = data.val().split("\n").filter(i => i.trim() !== "");

            var currentPos = 0;

            var listCanSell = [];

            function searchData() {
            if (currentPos >= arrayData.length) return;

            var searchBox = $(".MuiBox-root input").eq(0);
            if (!searchBox.length) {
              console.warn("Không tìm thấy ô tìm kiếm.");
              return;
            }

            var keyword = arrayData[currentPos];
            searchBox.focus();
            searchBox.val(arrayData[currentPos]);
            searchBox.val(arrayData[currentPos]);
            searchBox.attr("value", arrayData[currentPos]);
            searchBox.trigger("change");
            searchBox.blur();

            console.log(`Đang tìm: ${keyword}`);
            boxLogging(`Đang kiểm tra: ${keyword}`, [`Đang kiểm tra: ${keyword}`], ["orange"]);

            let retryCount = 0;

            let checkReady = setInterval(() => {
              let box = $(".sc-dWZqqJ.dRUZhp").eq(1);
              let item = box.find("tbody tr");

              if (item.length > 0 || retryCount >= 20) { // Chờ tối đa ~4s (20 x 200ms)
                clearInterval(checkReady);

                if (item.length === 0) {
                  boxLogging("Không tìm thấy dữ liệu.", ["Không tìm thấy dữ liệu"], ["crimson"]);
                } else {
                  item.each((index, value) => {
                    let name = $(value).find("td.sc-knuQbY").eq(2).find("p a");
                    let sku = $(value).find("td.sc-knuQbY").eq(4).find("p");
                    let canSell = $(value).find("td.sc-knuQbY").eq(5).find("p").eq(0);
                    let storage = $(value).find("td.sc-knuQbY").eq(6).find("p").eq(0);

                    let kq = parseInt(canSell.text()) > 0 ? "Có thể bán" : "Không có tồn";

                    if(parseInt(canSell.text()) > 0)
                        listCanSell.push(sku);

                    boxLogging(`${name.text()} ${sku.text()} ${canSell.text()}/${storage.text()}`);
                    boxLogging(kq, [kq], [kq === "Có thể bán" ? "lightgreen" : "crimson"]);
                  });
                }

                currentPos++;
                setTimeout(searchData, 500); // Chờ 0.5s rồi tiếp
              }

              retryCount++;
            }, 200); // Kiểm tra mỗi 200ms
            }

            searchData();
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
                    const [startRow] = mergeRange.match(/\d+/g).map(Number);
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

    // Kiểm tra 5 lần giá đuôi
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
                var nameProduct = name.contents()
                    .filter(function() {
                        return this.nodeType === 3; // chỉ lấy text thuần
                    })[0]?.nodeValue.trim();
        var price = box.eq(i).find(".table-cell").eq(0).find("input");
        var sku = box.eq(i).find(".table-cell").eq(2).find("textarea");

                if("x0".includes(sku.val().trim())){
                    boxLogging(`Đã bỏ qua sản phẩm ${nameProduct}`, [`${nameProduct}`], ["pink"]);
                    box.eq(i).css("background", "pink");
                    boxLeft.eq(i).css("background", "pink");
                   continue;
                }

                if(first == 0){
                    minPrice = suaGiaDuoi(price.val());
                    minSku = sku.val();
                    first = 1;
                    continue;
                }

                if(minPrice > parseInt(suaGiaDuoi(price.val())) && parseInt(suaGiaDuoi(price.val())) > 0){
                    i = 0;
                    minPrice = suaGiaDuoi(price.val());
                    minSku = sku.val();
                    box.css("background", "transparent");
                    boxLeft.css("background", "transparent");
                    listSku = [];
                    listPrice = [];
                    continue;
                }
                console.log(parseInt(suaGiaDuoi(price.val())) == 0);
                if(parseInt(suaGiaDuoi(price.val())) == 0){
                    boxLogging(`Sản phẩm ${nameProduct} chưa có giá đuôi!`, [`${nameProduct}`], [`crimson`])
                    box.eq(i).css("background", "crimson");
                    boxLeft.eq(i).css("background","crimson");
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
                console.log(listPrice);
                min = minPrice;
                maxSku = listSku[maxIndex];
      }

            if(listPrice.length > 0 && listSku.length > 0){
                $(".tp-container .content .content-layout .layout-tab span#maxPrice").text(maxPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
                $(".tp-container .content .content-layout .layout-tab span#maxSku").text(maxSku);
            }
            $(".tp-container .content .content-layout .layout-tab span#minPrice").text(min.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
            $(".tp-container .content .content-layout .layout-tab span#minSku").text(minSku);
            $(".tp-container .content .content-layout .layout-tab span#suggestPrice").text((parseInt(min) * 5).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));

      //listSku = [...listSku.reduce((map, item) => map.set(item, true), new Map()).keys()];
      //listPrice = [...listPrice.reduce((map, item) => map.set(item, true), new Map()).keys()];

      $.each(listSku, (index, value) => {
        boxLogging(`${listSku[index]} bị 5 lần giá đuôi ${listPrice[index]}`, [`${listSku[index]}`, `${listPrice[index]}`], ["orange", "lightgreen"]);
      });

      if(!error){
        boxLogging(`Không bị 5 lần giá`, [`Không bị 5 lần giá`], ["green"]);
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

      giaDau = giaDau.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      giaDuoi = giaDuoi.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      gia = gia.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      //boxAlert(giaDuoi);
      //boxLogging(`Giá Gốc ${gia} => Giá Đuôi ${giaDuoi}`, [`${gia}`, `${giaDuoi}`], ["green", "yellow"]);

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

          if(!switcher.hasClass("eds-switch--disabled")){
            if(!switcher.hasClass("eds-switch--open")){
              parent.eq(index).css("background", "orange");
              switcher.trigger("click").click();
              boxLogging(`Có sản phẩm cần kiểm tra, vui lòng xem lại những sản phẩm được đánh dấu`, ["Có sản phẩm cần kiểm tra, vui lòng xem lại những sản phẩm được đánh dấu"], ["orange"]);
            }

            if(switcher.hasClass("eds-switch--open")){
              if(parseInt(giaKM) <= 0){
                parent.eq(index).css("background", "crimson");
                boxLogging(`Sản phẩm ${name.text()} không có giá đuôi, vui lòng kiểm tra những khung được đánh dấu`, [`${name.text()}`], ["crimson"]);
              }else{
                $(price).select();
                $(price).val(giaKM);
                $(price).focus();


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

                parent.eq(index).css("background", "green");
              }
            }
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

    // Cập nhật giá đuôi Lazada
    function giaDuoiLazada(){
      var row = $(".next-table-row");
      var price = [];

      var i = 0;
      $.each(row, (index, value) => {
        var gia = $(value).find("input").val();
        var giaKM = suaGiaDuoi(gia);
                if($(value).find("td.special_price").has("button.next-btn").length > 0){
                    if(parseInt(giaKM) == 0)
                        giaKM = gia;
                    console.log(gia + " => " + giaKM);
                    price.push(giaKM);
                    $(value).find("td.special_price button.next-btn").click();

                    row.eq(index).css("background", "lightgreen");

                    boxLogging(`Sản phẩm đã được cập nhất giá`, [`Sản phẩm đã được cập nhất giá`], ["lightgreen"]);
                }
      })

            var balloon = $(".next-overlay-wrapper");

            $.each(balloon, (index, value) => {
                var inputPrice = balloon.eq(index).find(".next-balloon-content .next-input.next-medium input");
                var buttonClick = balloon.eq(index).find(".action-wrapper button.next-btn.next-medium.next-btn-primary")

                console.log(buttonClick);

                inputPrice.select();
                inputPrice.attr("value", price[index]);

                inputPrice.val(price[index]);

                buttonClick.click();
            });
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


        // Thêm ký tự giới tính vào tên phân loại shopee
        function setEventThemGioiTinhPhanLoaiShopee(){
            setEventTabTextarea()
        }

        function themGioiTinhPhanLoaiShopee() {
            var data = $(".tp-container .content-layout .layout-tab #data");
            var arrayData = data.val().split("\n");

            var charSex = [], nameProduct = [];

            $.each(arrayData, (index, value) => {
                charSex.push(value.slice(0, 1).trim());
                nameProduct.push(value.slice(1).trim());
            });

            var box = $(".variation-edit-item.version-a").eq(0).find(".option-container .options-item.drag-item");

            $.each(box, (index, value) => {
                var name = box.eq(index).find(".variation-input-item-container.variation-input-item input");

                var pos = nameProduct.indexOf(name.val());
                if (pos !== -1) {
                    name.parent().click();
                    name.focus();
                    name.select();

                    // **Xóa toàn bộ nội dung trước khi nhập lại**
                    simulateClearing(name, 50, function () {
                        let newValue = (`${charSex[pos]} ${nameProduct[pos]}`).trim();

                        // Gọi hàm giả lập nhập từng ký tự
                        simulateTyping(name, newValue);

                        if (newValue.length > 20) {
                            boxLogging(`${newValue} vượt quá ký tự (${newValue.length}/20)`, [`${newValue}`, `${newValue.length}/20`], ["orange", "crimson"]);
                            name.css({
                                "background": "crimson",
                                "color": "#fff"
                            });
                        } else {
                            boxLogging(`Đã sửa ${nameProduct[pos]} thành ${newValue}`, [`${nameProduct[pos]}`, `${newValue}`], ["orange", "yellow"]);
                            name.css({
                                "background": "lightgreen",
                                "color": "#ff"
                            });
                        }
                    });
                }
            });
        }

        // Thêm SKU theo tên phân loại shopee
        function themSKUTheoPhanLoaiShopee(){
            var data = $(".tp-container .content-layout .layout-tab #data");

            var array = $(data).val().split("\n");

            var arrayData = [], arraySku = [];

            $.each(array, (index, value) => {
                value = value.split("\t");
                arrayData.push(value[0]);
                arraySku.push(value[1]);
            });

            var currentPos = 0;
            var box = $(".variation-model-table-main .eds-scrollbar.middle-scroll-container .eds-scrollbar__content .variation-model-table-body .table-cell-wrapper");
            var boxLeft = $(".variation-model-table-fixed-left .variation-model-table-body .table-cell-wrapper");

      function writeValue(){
                if(currentPos >= box.length){
                    boxLogging(`Đã thêm SKU`, [`Đã thêm SKU`], ["green"]);
                    return;
                }

                var name = boxLeft.eq(currentPos).find(".table-cell.first-variation-cell")
                var nameProduct = name.contents()
                    .filter(function() {
                        return this.nodeType === 3; // chỉ lấy text thuần
                    })[0]?.nodeValue.trim();
                var skuBox = box.eq(currentPos).find(".table-cell").eq(2).find("textarea");
                var priceBox = box.eq(currentPos).find(".table-cell").eq(0).find("input");

                console.log(nameProduct);

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
                }

                currentPos++;

                setTimeout(writeValue, 10);
            }
            writeValue();
        }

    // Thêm phân loại shopee
    function setEventThemPhanLoaiShopee(){
      setEventTabTextarea();
    }

    function themPhanLoaiShopee(){
      var group = $(".tp-container .content-layout .layout-tab #group").find("option:selected").index();
      //var box = $(".variation-edit-item.version-a").eq(0).find(".option-container .options-item.drag-item");
      var box = $(".variation-edit-item.version-a").eq(0).find(".option-container .options-item");

      var data = $(".tp-container .content-layout .layout-tab #data");
      var array = data.val().split("\n");

            var arrayData = [], arraySku = [];

            $.each(array, (index, value) => {
                value = value.split("\t");
                arrayData.push(value[0]);
                arraySku.push(value[1]);
            });

            var currentPos = 0;

      function writeValue(){
                if(currentPos >= arrayData.length){
                    boxLogging(`Đã thêm phân loại, đang dò SKU...`, [`Đã thêm phân loại, đang dò SKU...`], ["orange"])
                    themSKUTheoPhanLoaiShopee(data);
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

                currentPos++;

                setTimeout(writeValue, 500);
            }
            writeValue();
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

        function kiemTraMaPhanLoaiShopee(){
            var container = $(".products-container-content form.product-table .table-card");

            var choiceAll = container.parent().find(".shopee-fixed-top-card.product-fixed-header.edit-fixed-header label.eds-checkbox.item-selector").click().click();

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

                    productName.parent().find(".data-model-id").remove();

                    productName.parent().append($(`
                    <div class="data-model-id">
                        ${productBox.eq(index).attr("data-model-id")}
                    </div>
                    `));
                });
            });
        }

    // Kiểm tra phân loại shopee
    function setEventKtraPhanloaiShopee(){
      setEventTabTextarea();
    }

    function kiemTraPhanLoaiShopee(){
      var data = $(".tp-container .content-layout .layout-tab #data");
      var arrayData = data.val().split("\n");

      var regex = /(\d{1,2}\/\d{1,2})/;

      var result = arrayData.filter(arrayData => !regex.test(arrayData));

      arrayData = result


      var box = $(".variation-edit-item.version-a").eq(0).find(".option-container .options-item.drag-item");

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
                        var priceBox1 = priceBox.val().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        var gia1 = gia.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            boxAlert(`Giá của ${sku} đã sửa từ ${priceBox1} => ${gia1}`);
            boxLogging(`Giá của ${sku} đã sửa từ ${priceBox1} => ${gia1}`, [`${sku}`, `${priceBox1}`, `${gia1}`], ["crimson", "yellow", "yellow"]);

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

        function clearReactInput(input) {
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
                        gia = suaGiaDuoi(gia);

                        promotionPrice.select().focus();

                        promotionPrice.get(0).scrollIntoView({ behavior: 'smooth', block: 'center' });

                        simulateReactInput(promotionPrice, gia);

                        /*

                        navigator.clipboard.writeText(gia);

                        var pasteEvent = new $.Event('paste', {
                            originalEvent: new ClipboardEvent('paste', {
                                dataType: 'text/plain',
                                data: gia
                            })
                        });

                        // Giả lập sự kiện keydown (Nhấn Ctrl + V)
                        var keydownEvent = new $.Event('keydowns', { ctrlKey: true, key: "v", keyCode: 86 });

                        promotionPrice.select();
                        promotionPrice.attr("aria-valuenow", gia);
                        //promotionPrice.trigger(pasteEvent);
                        //simulateTyping(promotionPrice, gia, "paste");
                        promotionPrice.trigger(keydownEvent);
                        //promotionPrice.val(gia);

                        */
                    }
                }
      });

      /*

      //var box = $(".theme-arco-table-body").find("div div");
      var sp = $(box).find("div");
      console.log(sp);
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

      */
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

        // Thêm ký tự ngẫu nhiên cho SKU lazada
        function taoSkuMoi(skuGoc, soKyTu = 2) {
            const kyTuNgauNhien = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let them = '';
            for (let i = 0; i < soKyTu; i++) {
            them += kyTuNgauNhien.charAt(Math.floor(Math.random() * kyTuNgauNhien.length));
            }
            return skuGoc + them;
        }

    // Thêm phân loại Lazada
        function themPhanLoaiLazada() {
      var box = $(".sale-prop-body .next-formily-item").eq(0).find(".prop-option-list .next-form-item.form-item-prop-option-item");

            var data = $(".tp-container .content-layout .layout-tab #data");
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

        // Thêm SKU theo tên phân loại lazada
        function themSKUTheoPhanLoaiLazada(){
            var data = $(".tp-container .content-layout .layout-tab #data");

            var array = $(data).val().split("\n");

            var arrayData = [], arraySku = [];

            $.each(array, (index, value) => {
                value = value.split("\t");
                arrayData.push(value[0]);
                arraySku.push(value[1]);
            });

            console.log(arrayData);

            var currentPos = 0;
            var box = $(".next-table-body .next-table-row");

      function writeValue(){
                if(currentPos >= box.length){
                    boxLogging(`Đã thêm SKU`, [`Đã thêm SKU`], ["green"]);
                    return;
                }

                var boxContent = box.eq(box.length - arrayData.length - 1 + currentPos);

                var name = boxContent.find("td.next-table-cell.first span")
                var nameProduct = name.contents()
                    .filter(function() {
                        return this.nodeType === 3; // chỉ lấy text thuần
                    })[0]?.nodeValue.trim();
                var skuBox = boxContent.find("td.next-table-cell.SellerSku input");
                var priceBox = boxContent.find("td.next-table-cell.price input");
                var quantity = boxContent.find("td.next-table-cell.quantity input");

                console.log(nameProduct);

                if(arrayData.includes(nameProduct)){
                    var pos = arrayData.indexOf(nameProduct);
                    skuBox.attr("modelValue", arraySku[pos]);
                    skuBox.val(arraySku[pos]).trigger("input");

                    simulateReactInput(skuBox, taoSkuMoi(arraySku[pos], Math.floor(Math.random() * 4)) + 1);

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
                }

                currentPos++;

                setTimeout(writeValue, 10);
            }
            writeValue();
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
            var nameList = [], countList = [];
      $.each(data, (index, value) => {
        value = value.split("\t");
        nameList.push(value[0]);
        countList.push(value[1] || -1);
            });

            var container = $(".products-container-content form.product-table .table-card");

            var choiceAll = container.parent().find(".shopee-fixed-top-card.product-fixed-header.edit-fixed-header label.eds-checkbox.item-selector").click().click();

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

                        /*var gia = originalPrice.text().replace("₫", "")
                        gia = gia.replace(".", "");
                        gia = parseInt(suaGiaDuoi(gia));

                        if(gia >= 0){
                            gia -= 1000;
                            gia = gia.toString().split("");
                            gia[gia.length - 1] = "1";
                            gia = gia.join("");

                            currentcyPrice.select();
                            currentcyPrice.val(gia);
                            currentcyPrice.attr("modelvalue", gia);

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
                        }*/

                        if(count == -1)
                            count = parseInt(currentStock.text());

                        if(parseInt(currentStock.text()) >= parseInt(count)){
                            // Xử lý số lượng
                            campaignStock.select();
                            //let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                            //nativeInputValueSetter.call($(campaignStock).get(0), count);

                            campaignStock.val(count);

                            if (window.getSelection) {
                                window.getSelection().removeAllRanges();
                            }else if (document.selection) {
                                document.selection.empty();
                            }

                            if ("createEvent" in document) {
                                var evt = document.createEvent("HTMLEvents");
                                evt.initEvent("change", false, true);
                                $(campaignStock).get(0).dispatchEvent(evt);
                            }
                            else {
                                value.fireEvent("onchange");
                            }

                            if(!buttonSwitch.hasClass("eds-switch--open")){
                                buttonSwitch.click();
                                buttonSwitch.parent().parent().parent().trigger("click");

                                productBox.eq(index).find(".item-selector").trigger("click");
                                productBox.eq(index).find(".item-selector input.eds-checkbox__input").val("true");
                            }
                        }

                        boxLogging(`Đã chọn: ${productName.text()}\n\tGiá: ${originalPrice.text()}\n\tSố Lượng: ${count}/${campaignStock.val()}\n`, [`${productName.text()}`, `${originalPrice.text()}`, `${count}`, `${campaignStock.val()}`], ["crimson", "green", "blue", "blue"]);
                    }else{
                        boxLogging(`Sản phẩm ${productName.text()} không có trong danh sách`, [`${productName.text()}`], ["crimson"]);
                    }
                });
            });

            return;

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
    }
