var SoLuongTrangHienThi = 4;
var ProductsPerPage = 4;
var DanhSachSanPham = [];
var DataCompany = [];
var CurrentFilters = [];

window.onload = function() {
    khoiTao();

    // autocomplete for search box
    // autocomplete(document.getElementById('search-box'), list_products);

    // add tags (keywords) to search box
    var tags = ["Samsung", "iPhone", "Coolpad", "Oppo", "Mobi"];
    for (var t of tags) addTags(t, "index.php?search=" + t);

    // =================== web 2 advanced search ================
    // Add images to banner
    setupBanner();

    // Add phone brand list
    setupCompany();

    // slider for price range
    $("#demoSlider").ionRangeSlider({
        type: "double",
        grid: true,
        min: 0,
        max: 50,
        from: 0,
        to: 50,
        step: 0.5,
        drag_interval: true,
        postfix: " million",
        prettify_enabled: true,
        prettify_separator: ",",
        values_separator: " →   ",
        onFinish: function(data) {
            filtersAjax(createFilters('price', data.from * 1E6 + "-" + data.to * 1E6));
        },
    });
    // ==================== End ===========================

    // Add products to page
    var filters = getFilterFromURL();
    if (filters.length) { // has filter
        filtersAjax(filters);

    } else { // no filter : main page will display hot products by default, ...
        hienThiKhungSanPhamMacDinh();
    }

    // Add price range selection
    addPricesRange(0, 2000000);
    addPricesRange(2000000, 4000000);
    addPricesRange(4000000, 7000000);
    addPricesRange(7000000, 13000000);
    addPricesRange(13000000, 0);

    // Add promotion selection
    addPromotion('Nothing');
    addPromotion('giamgia');
    addPromotion('tragop');
    addPromotion('moiramat');
    addPromotion('giareonline');

    // Add star rating selection
    addStarFilter(0);
    addStarFilter(1);
    addStarFilter(2);
    addStarFilter(3);
    addStarFilter(4);
    addStarFilter(5);

    // Add sort selection
    addSortFilter('asc', 'DonGia', 'Price ascending');
    addSortFilter('des', 'DonGia', 'Price descending');
    addSortFilter('asc', 'SoSao', 'Star ascending');
    addSortFilter('des', 'SoSao', 'Star descending');
    addSortFilter('asc', 'SoDanhGia', 'Rating ascending');
    addSortFilter('des', 'SoDanhGia', 'Rating descending');
    addSortFilter('asc', 'TenSP', 'Name A-Z');
    addSortFilter('des', 'TenSP', 'Name Z-A');
};

// ============================== web2 ===========================
function hienThiKhungSanPhamMacDinh() {

    $('.contain-khungSanPham').html('');

    var soLuong = (window.innerWidth < 1200 ? 4 : 5); // small screen displays 4 products, large displays 5

    // Colors
    var yellow_red = ['#ff9c00', '#ec1f1f'];
    var blue = ['#42bcf4', '#004c70'];
    var green = ['#5de272', '#007012'];

    // Add product frames
    addKhungSanPham('MOST POPULAR', yellow_red, ['star=0', 'sort=SoDanhGia-desc', 'page=0'], soLuong);
    addKhungSanPham('NEW PRODUCTS', blue, ['promo=moiramat', 'sort=SoDanhGia-desc', 'page=0'], soLuong);
    addKhungSanPham('0% INSTALLMENT', yellow_red, ['promo=tragop', 'page=0'], soLuong);
    addKhungSanPham('SHOCKING PRICE ONLINE', green, ['promo=giareonline', 'page=0'], soLuong);
    addKhungSanPham('BIG DISCOUNT', yellow_red, ['promo=giamgia', 'page=0'], soLuong);
    addKhungSanPham('AFFORDABLE FOR EVERYONE', green, ['price=0-3000000', 'sort=DonGia-asc', 'page=0'], soLuong);
}

function setupBanner() {
    $.ajax({
        type: "POST",
        url: "php/xulyhinhanh.php",
        dataType: "json",
        timeout: 1500, // stop after 1.5 seconds with no response => show error
        data: {
            request: "getallbanners",
        },
        success: function(data, status, xhr) {
            for (var url of data) {
                var realPath = url.split('../').join('');
                addBanner(realPath, realPath);
            }

            // Start banner library - only runs when images are created in banner
            $('.owl-carousel').owlCarousel({
                items: 1.5,
                margin: 100,
                center: true,
                loop: true,
                smartSpeed: 450,
                nav: false,

                autoplay: true,
                autoplayTimeout: 3500,

                responsive: {
                    0: {
                        items: 1
                    },
                    600: {
                        items: 1.25
                    },
                    1000: {
                        items: 1.5
                    }
                }
            });
        },
        error: function() {
            Swal.fire({
                type: "error",
                title: "Error loading banner image data (trangchu.js > setUpBanner)",
                html: e.responseText
            });
        }
    });

    $.ajax({
        type: "POST",
        url: "php/xulyhinhanh.php",
        dataType: "json",
        timeout: 1500, // stop after 1.5 seconds with no response => show error
        data: {
            request: "getsmallbanner",
        },
        success: function(data, status, xhr) {
            for (var url of data) {
                var realPath = url.split('../').join('');
                addSmallBanner(realPath);
            }
        },
        error: function() {
            Swal.fire({
                type: "error",
                title: "Error loading small banner image data (trangchu.js > setUpBanner)",
                html: e.responseText
            });
        }
    });
}

// select brand
function setupCompany() {
    $.ajax({
        type: "POST",
        url: "php/xulyloaisanpham.php",
        dataType: "json",
        timeout: 1500, // stop after 1.5 seconds with no response => show error
        data: {
            request: "getall",
        },
        success: function(data, status, xhr) {
            DataCompany = data;
            for (var c of data) {
                addCompany("img/company/" + c.HinhAnh, c.MaLSP);
            }
        },
        error: function(e) {
            Swal.fire({
                type: "error",
                title: "Error loading product type data (trangchu.js > setupCompany)",
                html: e.responseText
            });
        }
    });
}

function addProductsFromList(list, filters) {
    DanhSachSanPham = list; // save current list
    $("#divSoLuongSanPham").html("Found <span>"+ list.length + "</span> products")

    if (list.length == 0) {
        alertNotHaveProduct(false); // if length = 0, show no products
        return;
    } else {
        alertNotHaveProduct(true);
    }

    var phantrang = 1;
    for (var f of filters) {
        var splitValue = f.split('=');
        var left = splitValue[0];
        if (left == 'page') {
            phantrang = parseInt(splitValue[1]) || 1;
            break;
        }
    }

    if (phantrang) {
        chuyenTrang(phantrang);

    } else {
        for (var p of list) {
            addToWeb(p);
        }
    }

    document.getElementById("divSoLuongSanPham").scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function chuyenTrang(vitriTrang) {
    // remove old page products
    $("#products li.sanPham").remove();
    pushState(createFilters('page', vitriTrang));

    var sanPhamDu = DanhSachSanPham.length % ProductsPerPage;
    var soTrang = parseInt(DanhSachSanPham.length / ProductsPerPage) + (sanPhamDu ? 1 : 0);
    var trangHienTai = parseInt(vitriTrang < soTrang ? vitriTrang : soTrang);

    themNutPhanTrang(soTrang, trangHienTai);
    var start = ProductsPerPage * (trangHienTai - 1);
    var temp = copyObject(DanhSachSanPham);
    temp = temp.splice(start, ProductsPerPage);
    for (var p of temp) {
        addToWeb(p);
    }
}

function filtersAjax(filters, callback) {
    if(filters.length == 0) {
        removeAllFilters();
        return;
    }

    if (!callback) { // no callback -> default is add to contain-products
        // display product list
        $(".contain-products").css("display", "block");
        $(".contain-khungSanPham").css("display", "none");
        $(".contain-products li.sanPham").remove(); // remove current products
        $(".loader").css("display", "block");
    }
    $.ajax({
        type: "POST",
        url: "php/xulysanpham.php",
        dataType: "json",
        timeout: 1500, // stop after 1.5 seconds with no response => show error
        data: {
            request: "phanTich_Filters",
            filters: filters
        },
        success: function(data, status, xhr) {

            if (callback) callback(data);
            else {
                addProductsFromList(data, filters);
                addAllChoosedFilter(filters);
                pushState(filters);
                $(".loader").css("display", "none");
            }
        },
        error: function(e) {
            Swal.fire({
                type: "error",
                title: "Error loading product filter data (trangchu.js > filtersAjax)",
                html: e.responseText
            });
        }
    })
}

function ajaxThemSanPham(p, onSuccess, onFail) {
    $.ajax({
        type: "POST",
        url: "php/xulysanpham.php",
        dataType: "json",
        timeout: 1500, // stop after 1.5 seconds with no response => show error
        data: {
            request: "addFromWeb1",
            sanpham: p
        },
        success: function(data, status, xhr) {
            if (onSuccess) onSuccess(data);
            else {
                console.log('Add successful ');
                console.log(data);
            }
        },
        error: function(e) {
            if (onFail) onFail(e);
            else {
                Swal.fire({
                    type: "error",
                    title: "Error adding product " + p + " (trangchu.js > ajaxThemSanPham)",
                    html: e.responseText
                });
            }
        }
    })
}

function addToWeb(p, ele, returnString) {
    // Convert star to html tag format
    var rating = "";
    if (p.SoDanhGia >= 0) {
        for (var i = 1; i <= 5; i++) {
            if (i <= p.SoSao) {
                rating += `<i class="fa fa-star"></i>`
            } else {
                rating += `<i class="fa fa-star-o"></i>`
            }
        }
        rating += `<span>` + p.SoDanhGia + ` reviews</span>`;
    }

    // Convert price to html tag format
    var giaTri = parseInt(p.DonGia);
    var giaTrikhuyenMai = parseInt(p.KM.GiaTriKM);
    var giaTriSauKM = giaTri - giaTrikhuyenMai;

    var pricediv, khuyenmaidiv;

    if (p.KM.LoaiKM == "GiaReOnline") {

        khuyenmaidiv = promoToWeb(p.KM.LoaiKM, giaTriSauKM);
        pricediv = `<strong>` + giaTriSauKM.toLocaleString() + `&#8363;</strong>
                <span>` + giaTri.toLocaleString() + `&#8363;</span>`;
    } else {

        khuyenmaidiv = promoToWeb(p.KM.LoaiKM, giaTrikhuyenMai);
        pricediv = `<strong>` + giaTri.toLocaleString() + `&#8363;</strong>`;
    }

    // split by ' ' and rejoin with '-', this code removes all whitespace and replaces with '-'.
    // Create link to product details, replace all ' ' with '-'
    var chitietSp = 'chitietsanpham.php?' + p.MaSP;

    // Put everything into <li> tag
    var newLi =
        `<li class="sanPham">
        <a href="` + chitietSp + `">
            <img src="` + p.HinhAnh + `" alt="">
            <h3>` + p.TenSP + `</h3>
            <div class="price">
                ` + pricediv + `
            </div>
            <div class="ratingresult">
                ` + rating + `
            </div>
            ` + (promoToWeb(p.KM.LoaiKM, giaTrikhuyenMai)) + `
            <div class="tooltip">
                <button class="themvaogio" onclick="return themVaoGioHang('` + p.MaSP + `', '` + p.TenSP + `');">
                    <span class="tooltiptext" style="font-size: 15px;">Add to cart</span>
                    +
                </button>
            </div>
        </a>
    </li>`;

    if (returnString) return newLi;

    // Add newly created <li> tag to <ul> homeproduct (default), or passed ele tag
    var products = ele || document.getElementById('products');
    products.innerHTML += newLi;
}

// =========== Read data from url ============
function getFilterFromURL() { // split and return array of filters from url
    var fullLocation = window.location.href;
    fullLocation = decodeURIComponent(fullLocation);
    var dauHoi = fullLocation.split('?'); // split by ?

    if (dauHoi[1]) {
        var dauVa = dauHoi[1].split('&');
        return dauVa;
    }

    return [];
}

// Add products to product frames
function addKhungSanPham(tenKhung, color, filters, len) {
    // convert color to code
    var gradient = `background-image: linear-gradient(120deg, ` + color[0] + ` 0%, ` + color[1] + ` 50%, ` + color[0] + ` 100%);`
    var borderColor = `border-color: ` + color[0];
    var borderA = ` border-left: 2px solid ` + color[0] + `; border-right: 2px solid ` + color[0] + `;`;

    // open tag
    var s = `<div class="khungSanPham" style="` + borderColor + `">
                <h3 class="tenKhung" style="` + gradient + `">* ` + tenKhung + ` *</h3>
                <div class="listSpTrongKhung flexContain" data-tenkhung="` + tenKhung + `">
                    <div class="loader"></div>
                </div>
                <a class="xemTatCa" onclick='filtersAjax(`+JSON.stringify(filters)+`)' style="` + borderA + `" data-tenkhung="` + tenKhung + `">
                </a>
              </div> <hr>`;


    // add frame to contain-khung
    document.getElementsByClassName('contain-khungSanPham')[0].innerHTML += s;

    // get data to put into frame
    filtersAjax(filters, (data) => {
        // add <li> (products) to tag
        var s1 = "";
        var spResult = data;
        if (spResult.length < len) len = spResult.length;

        for (var i = 0; i < len; i++) {
            s1 += addToWeb(spResult[i], null, true);
            // pass 'true' to return a string then assign to s
        }

        $("div.listSpTrongKhung[data-tenkhung='" + tenKhung + "']").html(s1);
        $("a.xemTatCa[data-tenkhung='" + tenKhung + "']").html("View all " + spResult.length + " products");
    })
}

// Pagination buttons
function themNutPhanTrang(soTrang, trangHienTai) {
    var divPhanTrang = document.getElementsByClassName('pagination')[0];

    divPhanTrang.innerHTML = ""; // clear old pagination

    if (trangHienTai > 1) { // Previous page button
        divPhanTrang.innerHTML += `<a onclick="chuyenTrang(1)"><i class="fa fa-angle-double-left"></i></a>`;
        divPhanTrang.innerHTML += `<a onclick="chuyenTrang(` + (trangHienTai - 1) + `)"><i class="fa fa-angle-left"></i></a>`;
    }

    if (soTrang > 1) { // Only show pagination buttons if page count > 1
        for (var i = trangHienTai - (SoLuongTrangHienThi - 2); i <= trangHienTai + (SoLuongTrangHienThi - 2); i++) {
            if (i == trangHienTai) {
                divPhanTrang.innerHTML += `<a href="javascript:;" class="current">` + i + `</a>`

            } else if (i >= 1 && i <= soTrang) {
                divPhanTrang.innerHTML += `<a onclick="chuyenTrang(` + i + `)">` + i + `</a>`
            }
        }
    }

    if (trangHienTai < soTrang) { // Next page button
        divPhanTrang.innerHTML += `<a onclick="chuyenTrang(` + (trangHienTai + 1) + `)"><i class="fa fa-angle-right"></i></a>`;
        divPhanTrang.innerHTML += `<a onclick="chuyenTrang(` + (soTrang) + `)"><i class="fa fa-angle-double-right"></i></a>`;
    }
}

function pushState(filters) {
    var str = "index.php?";
    var fsort = "";
    for(var f of filters) {
        if(f.split('=')[0] != 'sort') {
            str += f + "&";
        } else {
            fsort = f;
        }
    }
    if(fsort != '') {
        str += fsort;
    } else if(str.indexOf("&") >= 0) {
        str = str.slice(0, str.length - 1); // remove extra "&"
    }

    history.pushState("", "", str);
}

// ========== FILTERS ===============
function createFilters(type, value) {
    var newFilters = [];

    var chuaCo = true;
    for (var f of CurrentFilters) {
        var fSplit = f.split('=');
        var fType = fSplit[0];
        var fValue = fSplit[1];

        if (fType == type) {
            newFilters.push(type + "=" + value);
            chuaCo = false;
        } else {
            newFilters.push(f);
        }
    }

    if (chuaCo) {
        newFilters.push(type + "=" + value);
    }

    return newFilters;
}

function craeteRemoveFilters(type) {
    var newFilters = [];

    for (var f of CurrentFilters) {
        var fSplit = f.split('=');
        var fType = fSplit[0];
        var fValue = fSplit[1];

        if (fType == type) {
            // do not add the one to remove
        } else {
            newFilters.push(f);
        }
    }

    return newFilters;
}

function removeAllFilters() {
    CurrentFilters = [];
    if($('.contain-khungSanPham').html() == "") {
        hienThiKhungSanPhamMacDinh();
    }
    pushState([]);
    $(".choosedFilter").css("display", "none");
    $(".contain-khungSanPham").css("display", "block");
    $(".contain-products").css("display", "none");
}

// Add selected filter to html
function addChoosedFilter(type, textInside) {
    var divChoosedFilter = document.getElementsByClassName('choosedFilter')[0];
    divChoosedFilter.innerHTML += (`<a onclick="filtersAjax(craeteRemoveFilters('`+type+`'))">
        <h3>` + textInside + ` <i class="fa fa-close"></i></h3>
        </a>`);
}

// Add multiple filters at once 
function addAllChoosedFilter(filters) {
    // remove all old filters
    $(".choosedFilter").html(`<a onclick="removeAllFilters()"><h3>Clear filters <i class="fa fa-close"></i></h3></a>`);
    $(".choosedFilter").css("display", "");

    // Save new filters
    CurrentFilters = filters;

    if (filters.length) {

        for (var f of filters) {
            var data = f.split('=');
            var type = data[0];
            var value = data[1];

            switch (type) {
                case 'company':
                    var tenHang = "";
                    for (var c of DataCompany) {
                        if (c.MaLSP == value) {
                            tenHang = c.TenLSP;
                        }
                    }
                    addChoosedFilter('company', "Brand " + tenHang);
                    break;

                case 'search':
                    addChoosedFilter('search', searchToString(value));
                    break;
                case 'price':
                    var prices = value.split('-');
                    addChoosedFilter('price', priceToString(prices[0], prices[1]));
                    break;
                case 'promo':
                    addChoosedFilter('promo', promoToString(value));
                    break;
                case 'star':
                    addChoosedFilter('star', starToString(value));
                    break;
                case 'sort':
                    var sorts = value.split('-');
                    var sortBy = sortToString(sorts[0]);
                    var kieuSapXep = (sorts[1] == 'asc' ? 'ascending' : 'descending');
                    addChoosedFilter('sort', sortBy + kieuSapXep);
                    break;
                default:
                    // statements_def
                    break;
            }
        }
    }
}

    // Alert if no products available
function alertNotHaveProduct(coSanPham) {
    var thongbao = document.getElementById('khongCoSanPham');
    if (!coSanPham) {
        thongbao.style.width = "auto";
        thongbao.style.opacity = "1";
        thongbao.style.margin = "auto"; // Center
        thongbao.style.transitionDuration = "1s"; // appear gradually

    } else {
        thongbao.style.width = "0";
        thongbao.style.opacity = "0";
        thongbao.style.margin = "0";
        thongbao.style.transitionDuration = "0s"; // Disappear immediately
    }
}

// ========== Filter ON PAGE ============
// Show product
function showLi(li) {
    li.style.opacity = 1;
    li.style.width = "239px";
    li.style.borderWidth = "1px";
}
// Hide product
function hideLi(li) {
    li.style.width = 0;
    li.style.opacity = 0;
    li.style.borderWidth = "0";
}

// Get product array on current page (in html tag form)
function getLiArray() {
    var ul = document.getElementById('products');
    var listLi = ul.getElementsByTagName('li');
    return listLi;
}

// filter by name
function getNameFromLi(li) {
    var a = li.getElementsByTagName('a')[0];
    var h3 = a.getElementsByTagName('h3')[0];
    var name = h3.innerHTML;
    return name;
}

function filterProductsName(ele) {
    var filter = ele.value.toUpperCase();
    var listLi = getLiArray();
    var coSanPham = false;

    var soLuong = 0;

    for (var i = 0; i < listLi.length; i++) {
        if (getNameFromLi(listLi[i]).toUpperCase().indexOf(filter) > -1 &&
            soLuong < ProductsPerPage) {
            showLi(listLi[i]);
            coSanPham = true;
            soLuong++;

        } else {
            hideLi(listLi[i]);
        }
    }

// Alert if no products available
    alertNotHaveProduct(coSanPham);
}

// ================= Other functions ==================

// Add banner
function addBanner(img, link) {
    // <a target='_blank' href=` + link + `>
    var newDiv = `<div class='item'>
                        <img src=` + img + `>
                    </div>`;
    var banner = document.getElementsByClassName('owl-carousel')[0];
    banner.innerHTML += newDiv;
}

function addSmallBanner(img) {
    var newimg = `<img src=` + img + ` style="width: 100%;">`;
    var smallbanner = document.getElementsByClassName('smallbanner')[0];
    smallbanner.innerHTML += newimg;
}

// Add manufacturer
function addCompany(img, nameCompany) {
    var new_tag = `<button onclick="filtersAjax(['company=` + nameCompany + `'])"><img src=` + img + `></button>`;

    var khung_hangSanXuat = document.getElementsByClassName('companyMenu')[0];
    khung_hangSanXuat.innerHTML += new_tag;
}

// Add price range selection
function addPricesRange(min, max) {
    var text = priceToString(min, max);
    var a = `<a onclick="filtersAjax(createFilters('price', '` + (min + "-" + max) + `'))">` + text + `</a>`

    document.getElementsByClassName('pricesRangeFilter')[0]
        .getElementsByClassName('dropdown-content')[0].innerHTML += a;
}

// Add promotion selection
function addPromotion(name) {
    var text = promoToString(name);
    var promo = `<a onclick="filtersAjax(createFilters('promo', '` + name + `'))">` + text + `</a>`;

    document.getElementsByClassName('promosFilter')[0]
        .getElementsByClassName('dropdown-content')[0].innerHTML += promo;
}

// Add star quantity selection
function addStarFilter(value) {
    var text = starToString(value);
    var star = `<a onclick="filtersAjax(createFilters('star', '` + value + `'))">` + text + `</a>`;

    document.getElementsByClassName('starFilter')[0]
        .getElementsByClassName('dropdown-content')[0].innerHTML += star;
}

// Add price sort selection
function addSortFilter(type, nameFilter, text) {
    var sortTag = `<a onclick="filtersAjax(createFilters('sort', '` + (nameFilter + "-" + type) + `'))">` + text + `</a>`;

    document.getElementsByClassName('sortFilter')[0]
        .getElementsByClassName('dropdown-content')[0].innerHTML += sortTag;
}

//  =================== ToString ====================
function searchToString(value) {
    return "Search '" + value + "'";
}

// Convert price level to string
function priceToString(min, max) {
    if (min == 0) return 'Under ' + max / 1E6 + ' million';
    if (max == 0) return 'Above ' + min / 1E6 + ' million';
    return 'From ' + min / 1E6 + ' - ' + max / 1E6 + ' million';
}

// Convert promotion to string
function promoToString(name) {
    switch (name) {
        case 'tragop':
            return 'Installment';
        case 'giamgia':
            return 'Discount';
        case 'giareonline':
            return 'Online cheap';
        case 'moiramat':
            return 'New launch';
        case 'Nothing':
            return 'No promotion';
    }
}

// Convert star count to string
function starToString(star) {
    return 'From ' + star + ' stars and up';
}

// Convert sort types to string
function sortToString(sortBy) {
    switch (sortBy) {
        case 'DonGia':
            return 'Price ';
        case 'SoSao':
            return 'Star ';
        case 'SoDanhGia':
            return 'Rating ';
        case 'TenSP':
            return 'Name ';
        default:
            return '';
    }
}

// Test function, not used
function hideSanPhamKhongThuoc(list) {
    var allLi = getLiArray();
    for (var i = 0; i < allLi.length; i++) {
        var hide = true;
        for (var j = 0; j < list.length; j++) {
            if (getNameFromLi(allLi[i]) == list[j].name) {
                hide = false;
                break;
            }
        }
        if (hide) hideLi(allLi[i]);
    }
}

//companysMenu responsive
function setCompanysMenu() {
    var content = document.getElementsByClassName("companyMenu")[0];
    if (content.style.maxHeight) {
        content.style.maxHeight = null;
        document.getElementById("iconOpenMenu").style.display = "block";
        document.getElementById("iconCloseMenu").style.display = "none";
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
        document.getElementById("iconOpenMenu").style.display = "none";
        document.getElementById("iconCloseMenu").style.display = "block";
    }
}