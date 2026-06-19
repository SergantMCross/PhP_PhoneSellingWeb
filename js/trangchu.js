var SoLuongTrangHienThi = 4;
var ProductsPerPage = 4;
var DanhSachSanPham = [];
var DataCompany = [];
var CurrentFilters = [];

window.onload = function() {
    KhoiTao();

    // autocomplete for search box
    // autocomplete(document.getElementById('search-box'), list_products);

    // add tags (keywords) to search box
    var Tags = ["Samsung", "iPhone", "Coolpad", "Oppo", "Mobi"];
    for (var t of Tags) AddTags(t, "index.php?search=" + t);

    // =================== web 2 advanced search ================
    // Add images to banner
    SetupBanner();

    // Add phone brand list
    SetupCompany();

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
            FiltersAjax(CreateFilters('price', data.from * 1E6 + "-" + data.to * 1E6));
        },
    });
    // ==================== End ===========================

    // Add products to page
    var Filters = GetFilterFromURL();
    if (Filters.length) { // has filter
        FiltersAjax(Filters);

    } else { // no filter : main page will display hot products by default, ...
        HienThiKhungSanPhamMacDinh();
    }

    // Add price range selection
    AddPricesRange(0, 2000000);
    AddPricesRange(2000000, 4000000);
    AddPricesRange(4000000, 7000000);
    AddPricesRange(7000000, 13000000);
    AddPricesRange(13000000, 0);

    // Add promotion selection
    AddPromotion('Nothing');
    AddPromotion('giamgia');
    AddPromotion('tragop');
    AddPromotion('moiramat');
    AddPromotion('giareonline');

    // Add star rating selection
    AddStarFilter(0);
    AddStarFilter(1);
    AddStarFilter(2);
    AddStarFilter(3);
    AddStarFilter(4);
    AddStarFilter(5);

    // Add sort selection
    AddSortFilter('asc', 'DonGia', 'Price ascending');
    AddSortFilter('des', 'DonGia', 'Price descending');
    AddSortFilter('asc', 'SoSao', 'Star ascending');
    AddSortFilter('des', 'SoSao', 'Star descending');
    AddSortFilter('asc', 'SoDanhGia', 'Rating ascending');
    AddSortFilter('des', 'SoDanhGia', 'Rating descending');
    AddSortFilter('asc', 'TenSP', 'Name A-Z');
    AddSortFilter('des', 'TenSP', 'Name Z-A');
};

// ============================== web2 ===========================
function HienThiKhungSanPhamMacDinh() {

    $('.contain-khungSanPham').html('');

    var SoLuong = (window.innerWidth < 1200 ? 4 : 5); // small screen displays 4 products, large displays 5

    // Colors
    var YellowRed = ['#ff9c00', '#ec1f1f'];
    var Blue = ['#42bcf4', '#004c70'];
    var Green = ['#5de272', '#007012'];

    // Add product frames
    AddKhungSanPham('MOST POPULAR', YellowRed, ['star=0', 'sort=SoDanhGia-desc', 'page=0'], SoLuong);
    AddKhungSanPham('NEW PRODUCTS', Blue, ['promo=moiramat', 'sort=SoDanhGia-desc', 'page=0'], SoLuong);
    AddKhungSanPham('0% INSTALLMENT', YellowRed, ['promo=tragop', 'page=0'], SoLuong);
    AddKhungSanPham('SHOCKING PRICE ONLINE', Green, ['promo=giareonline', 'page=0'], SoLuong);
    AddKhungSanPham('BIG DISCOUNT', YellowRed, ['promo=giamgia', 'page=0'], SoLuong);
    AddKhungSanPham('AFFORDABLE FOR EVERYONE', Green, ['price=0-3000000', 'sort=DonGia-asc', 'page=0'], SoLuong);
}

function SetupBanner() {
    $.ajax({
        type: "POST",
        url: "php/ProcessImage.php",
        dataType: "json",
        timeout: 1500, // stop after 1.5 seconds with no response => show error
        data: {
            request: "getallbanners",
        },
        success: function(Data, status, xhr) {
            for (var Url of Data) {
                var RealPath = Url.split('../').join('');
                AddBanner(RealPath, RealPath);
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
        url: "php/ProcessImage.php",
        dataType: "json",
        timeout: 1500, // stop after 1.5 seconds with no response => show error
        data: {
            request: "getsmallbanner",
        },
        success: function(Data, status, xhr) {
            for (var Url of Data) {
                var RealPath = Url.split('../').join('');
                AddSmallBanner(RealPath);
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
function SetupCompany() {
    $.ajax({
        type: "POST",
        url: "php/ProcessProductCategory.php",
        dataType: "json",
        timeout: 1500, // stop after 1.5 seconds with no response => show error
        data: {
            request: "getall",
        },
        success: function(Data, status, xhr) {
            DataCompany = Data;
            for (var c of Data) {
                AddCompany("img/company/" + c.HinhAnh, c.MaLSP);
            }
        },
        error: function(e) {
            Swal.fire({
                type: "error",
                title: "Error loading product type data (trangchu.js > SetupCompany)",
                html: e.responseText
            });
        }
    });
}

function AddProductsFromList(List, Filters) {
    DanhSachSanPham = List; // save current list
    $("#divSoLuongSanPham").html("Found <span>"+ List.length + "</span> products")

    if (List.length == 0) {
        AlertNotHaveProduct(false); // if length = 0, show no products
        return;
    } else {
        AlertNotHaveProduct(true);
    }

    var Phantrang = 1;
    for (var f of Filters) {
        var SplitValue = f.split('=');
        var Left = SplitValue[0];
        if (Left == 'page') {
            Phantrang = parseInt(SplitValue[1]) || 1;
            break;
        }
    }

    if (Phantrang) {
        ChuyenTrang(Phantrang);

    } else {
        for (var P of List) {
            AddToWeb(P);
        }
    }

    document.getElementById("divSoLuongSanPham").scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function ChuyenTrang(VitriTrang) {
    // remove old page products
    $("#products li.sanPham").remove();
    PushState(CreateFilters('page', VitriTrang));

    var SanPhamDu = DanhSachSanPham.length % ProductsPerPage;
    var SoTrang = parseInt(DanhSachSanPham.length / ProductsPerPage) + (SanPhamDu ? 1 : 0);
    var TrangHienTai = parseInt(VitriTrang < SoTrang ? VitriTrang : SoTrang);

    ThemNutPhanTrang(SoTrang, TrangHienTai);
    var Start = ProductsPerPage * (TrangHienTai - 1);
    var Temp = CopyObject(DanhSachSanPham);
    Temp = Temp.splice(Start, ProductsPerPage);
    for (var P of Temp) {
        AddToWeb(P);
    }
}

function FiltersAjax(Filters, Callback) {
    if(Filters.length == 0) {
        RemoveAllFilters();
        return;
    }

    if (!Callback) { // no callback -> default is add to contain-products
        // display product list
        $(".contain-products").css("display", "block");
        $(".contain-khungSanPham").css("display", "none");
        $(".contain-products li.sanPham").remove(); // remove current products
        $(".loader").css("display", "block");
    }
    $.ajax({
        type: "POST",
        url: "php/ProcessProduct.php",
        dataType: "json",
        timeout: 1500, // stop after 1.5 seconds with no response => show error
        data: {
            request: "phanTich_Filters",
            filters: Filters
        },
        success: function(Data, status, xhr) {

            if (Callback) Callback(Data);
            else {
                AddProductsFromList(Data, Filters);
                AddAllChoosedFilter(Filters);
                PushState(Filters);
                $(".loader").css("display", "none");
            }
        },
        error: function(e) {
            Swal.fire({
                type: "error",
                title: "Error loading product filter data (trangchu.js > FiltersAjax)",
                html: e.responseText
            });
        }
    })
}

function AjaxThemSanPham(P, OnSuccess, OnFail) {
    $.ajax({
        type: "POST",
        url: "php/ProcessProduct.php",
        dataType: "json",
        timeout: 1500, // stop after 1.5 seconds with no response => show error
        data: {
            request: "addFromWeb1",
            sanpham: P
        },
        success: function(Data, status, xhr) {
            if (OnSuccess) OnSuccess(Data);
            else {
                console.log('Add successful ');
                console.log(Data);
            }
        },
        error: function(e) {
            if (OnFail) OnFail(e);
            else {
                Swal.fire({
                    type: "error",
                    title: "Error adding product " + P + " (trangchu.js > AjaxThemSanPham)",
                    html: e.responseText
                });
            }
        }
    })
}

function AddToWeb(P, Ele, ReturnString) {
    // Convert star to html tag format
    var Rating = "";
    if (P.SoDanhGia >= 0) {
        for (var i = 1; i <= 5; i++) {
            if (i <= P.SoSao) {
                Rating += `<i class="fa fa-star"></i>`
            } else {
                Rating += `<i class="fa fa-star-o"></i>`
            }
        }
        Rating += `<span>` + P.SoDanhGia + ` reviews</span>`;
    }

    // Convert price to html tag format
    var GiaTri = parseInt(P.DonGia);
    var GiaTrikhuyenMai = parseInt(P.KM.GiaTriKM);
    var GiaTriSauKM = GiaTri - GiaTrikhuyenMai;

    var Pricediv, Khuyenmaidiv;

    if (P.KM.LoaiKM == "GiaReOnline") {

        Khuyenmaidiv = PromoToWeb(P.KM.LoaiKM, GiaTriSauKM);
        Pricediv = `<strong>` + GiaTriSauKM.toLocaleString() + `&#8363;</strong>
                <span>` + GiaTri.toLocaleString() + `&#8363;</span>`;
    } else {

        Khuyenmaidiv = PromoToWeb(P.KM.LoaiKM, GiaTrikhuyenMai);
        Pricediv = `<strong>` + GiaTri.toLocaleString() + `&#8363;</strong>`;
    }

    // split by ' ' and rejoin with '-', this code removes all whitespace and replaces with '-'.
    // Create link to product details, replace all ' ' with '-'
    var ChitietSp = 'ProductDetail.php?' + P.MaSP;

    // Put everything into <li> tag
    var NewLi =
        `<li class="sanPham">
        <a href="` + ChitietSp + `">
            <img src="` + P.HinhAnh + `" alt="">
            <h3>` + P.TenSP + `</h3>
            <div class="price">
                ` + Pricediv + `
            </div>
            <div class="ratingresult">
                ` + Rating + `
            </div>
            ` + (PromoToWeb(P.KM.LoaiKM, GiaTrikhuyenMai)) + `
            <div class="tooltip">
                <button class="themvaogio" onclick="return ThemVaoGioHang('` + P.MaSP + `', '` + P.TenSP + `');">
                    <span class="tooltiptext" style="font-size: 15px;">Add to cart</span>
                    +
                </button>
            </div>
        </a>
    </li>`;

    if (ReturnString) return NewLi;

    // Add newly created <li> tag to <ul> homeproduct (default), or passed ele tag
    var Products = Ele || document.getElementById('products');
    Products.innerHTML += NewLi;
}

// =========== Read data from url ============
function GetFilterFromURL() { // split and return array of filters from url
    var FullLocation = window.location.href;
    FullLocation = decodeURIComponent(FullLocation);
    var DauHoi = FullLocation.split('?'); // split by ?

    if (DauHoi[1]) {
        var DauVa = DauHoi[1].split('&');
        return DauVa;
    }

    return [];
}

// Add products to product frames
function AddKhungSanPham(TenKhung, Color, Filters, Len) {
    // convert color to code
    var Gradient = `background-image: linear-gradient(120deg, ` + Color[0] + ` 0%, ` + Color[1] + ` 50%, ` + Color[0] + ` 100%);`
    var BorderColor = `border-color: ` + Color[0];
    var BorderA = ` border-left: 2px solid ` + Color[0] + `; border-right: 2px solid ` + Color[0] + `;`;

    // open tag
    var S = `<div class="khungSanPham" style="` + BorderColor + `">
                <h3 class="tenKhung" style="` + Gradient + `">* ` + TenKhung + ` *</h3>
                <div class="listSpTrongKhung flexContain" data-tenkhung="` + TenKhung + `">
                    <div class="loader"></div>
                </div>
                <a class="xemTatCa" onclick='FiltersAjax(`+JSON.stringify(Filters)+`)' style="` + BorderA + `" data-tenkhung="` + TenKhung + `">
                </a>
              </div> <hr>`;


    // add frame to contain-khung
    document.getElementsByClassName('contain-khungSanPham')[0].innerHTML += S;

    // get data to put into frame
    FiltersAjax(Filters, (Data) => {
        // add <li> (products) to tag
        var S1 = "";
        var SpResult = Data;
        if (SpResult.length < Len) Len = SpResult.length;

        for (var i = 0; i < Len; i++) {
            S1 += AddToWeb(SpResult[i], null, true);
            // pass 'true' to return a string then assign to s
        }

        $("div.listSpTrongKhung[data-tenkhung='" + TenKhung + "']").html(S1);
        $("a.xemTatCa[data-tenkhung='" + TenKhung + "']").html("View all " + SpResult.length + " products");
    })
}

// Pagination buttons
function ThemNutPhanTrang(SoTrang, TrangHienTai) {
    var DivPhanTrang = document.getElementsByClassName('pagination')[0];

    DivPhanTrang.innerHTML = ""; // clear old pagination

    if (TrangHienTai > 1) { // Previous page button
        DivPhanTrang.innerHTML += `<a onclick="ChuyenTrang(1)"><i class="fa fa-angle-double-left"></i></a>`;
        DivPhanTrang.innerHTML += `<a onclick="ChuyenTrang(` + (TrangHienTai - 1) + `)"><i class="fa fa-angle-left"></i></a>`;
    }

    if (SoTrang > 1) { // Only show pagination buttons if page count > 1
        for (var i = TrangHienTai - (SoLuongTrangHienThi - 2); i <= TrangHienTai + (SoLuongTrangHienThi - 2); i++) {
            if (i == TrangHienTai) {
                DivPhanTrang.innerHTML += `<a href="javascript:;" class="current">` + i + `</a>`

            } else if (i >= 1 && i <= SoTrang) {
                DivPhanTrang.innerHTML += `<a onclick="ChuyenTrang(` + i + `)">` + i + `</a>`
            }
        }
    }

    if (TrangHienTai < SoTrang) { // Next page button
        DivPhanTrang.innerHTML += `<a onclick="ChuyenTrang(` + (TrangHienTai + 1) + `)"><i class="fa fa-angle-right"></i></a>`;
        DivPhanTrang.innerHTML += `<a onclick="ChuyenTrang(` + (SoTrang) + `)"><i class="fa fa-angle-double-right"></i></a>`;
    }
}

function PushState(Filters) {
    var Str = "index.php?";
    var Fsort = "";
    for(var f of Filters) {
        if(f.split('=')[0] != 'sort') {
            Str += f + "&";
        } else {
            Fsort = f;
        }
    }
    if(Fsort != '') {
        Str += Fsort;
    } else if(Str.indexOf("&") >= 0) {
        Str = Str.slice(0, Str.length - 1); // remove extra "&"
    }

    history.pushState("", "", Str);
}

// ========== FILTERS ===============
function CreateFilters(Type, Value) {
    var NewFilters = [];

    var ChuaCo = true;
    for (var f of CurrentFilters) {
        var FSplit = f.split('=');
        var FType = FSplit[0];
        var FValue = FSplit[1];

        if (FType == Type) {
            NewFilters.push(Type + "=" + Value);
            ChuaCo = false;
        } else {
            NewFilters.push(f);
        }
    }

    if (ChuaCo) {
        NewFilters.push(Type + "=" + Value);
    }

    return NewFilters;
}

function CraeteRemoveFilters(Type) {
    var NewFilters = [];

    for (var f of CurrentFilters) {
        var FSplit = f.split('=');
        var FType = FSplit[0];
        var FValue = FSplit[1];

        if (FType == Type) {
            // do not add the one to remove
        } else {
            NewFilters.push(f);
        }
    }

    return NewFilters;
}

function RemoveAllFilters() {
    CurrentFilters = [];
    if($('.contain-khungSanPham').html() == "") {
        HienThiKhungSanPhamMacDinh();
    }
    PushState([]);
    $(".choosedFilter").css("display", "none");
    $(".contain-khungSanPham").css("display", "block");
    $(".contain-products").css("display", "none");
}

// Add selected filter to html
function AddChoosedFilter(Type, TextInside) {
    var DivChoosedFilter = document.getElementsByClassName('choosedFilter')[0];
    DivChoosedFilter.innerHTML += (`<a onclick="FiltersAjax(CraeteRemoveFilters('`+Type+`'))">
        <h3>` + TextInside + ` <i class="fa fa-close"></i></h3>
        </a>`);
}

// Add multiple filters at once 
function AddAllChoosedFilter(Filters) {
    // remove all old filters
    $(".choosedFilter").html(`<a onclick="RemoveAllFilters()"><h3>Clear filters <i class="fa fa-close"></i></h3></a>`);
    $(".choosedFilter").css("display", "");

    // Save new filters
    CurrentFilters = Filters;

    if (Filters.length) {

        for (var f of Filters) {
            var Data = f.split('=');
            var Type = Data[0];
            var Value = Data[1];

            switch (Type) {
                case 'company':
                    var TenHang = "";
                    for (var c of DataCompany) {
                        if (c.MaLSP == Value) {
                            TenHang = c.TenLSP;
                        }
                    }
                    AddChoosedFilter('company', "Brand " + TenHang);
                    break;

                case 'search':
                    AddChoosedFilter('search', SearchToString(Value));
                    break;
                case 'price':
                    var Prices = Value.split('-');
                    AddChoosedFilter('price', PriceToString(Prices[0], Prices[1]));
                    break;
                case 'promo':
                    AddChoosedFilter('promo', PromoToString(Value));
                    break;
                case 'star':
                    AddChoosedFilter('star', StarToString(Value));
                    break;
                case 'sort':
                    var Sorts = Value.split('-');
                    var SortBy = SortToString(Sorts[0]);
                    var KieuSapXep = (Sorts[1] == 'asc' ? 'ascending' : 'descending');
                    AddChoosedFilter('sort', SortBy + KieuSapXep);
                    break;
                default:
                    // statements_def
                    break;
            }
        }
    }
}

    // Alert if no products available
function AlertNotHaveProduct(CoSanPham) {
    var Thongbao = document.getElementById('khongCoSanPham');
    if (!CoSanPham) {
        Thongbao.style.width = "auto";
        Thongbao.style.opacity = "1";
        Thongbao.style.margin = "auto"; // Center
        Thongbao.style.transitionDuration = "1s"; // appear gradually

    } else {
        Thongbao.style.width = "0";
        Thongbao.style.opacity = "0";
        Thongbao.style.margin = "0";
        Thongbao.style.transitionDuration = "0s"; // Disappear immediately
    }
}

// ========== Filter ON PAGE ============
// Show product
function ShowLi(Li) {
    Li.style.opacity = 1;
    Li.style.width = "239px";
    Li.style.borderWidth = "1px";
}
// Hide product
function HideLi(Li) {
    Li.style.width = 0;
    Li.style.opacity = 0;
    Li.style.borderWidth = "0";
}

// Get product array on current page (in html tag form)
function GetLiArray() {
    var Ul = document.getElementById('products');
    var ListLi = Ul.getElementsByTagName('li');
    return ListLi;
}

// filter by name
function GetNameFromLi(Li) {
    var A = Li.getElementsByTagName('a')[0];
    var H3 = A.getElementsByTagName('h3')[0];
    var Name = H3.innerHTML;
    return Name;
}

function FilterProductsName(Ele) {
    var Filter = Ele.value.toUpperCase();
    var ListLi = GetLiArray();
    var CoSanPham = false;

    var SoLuong = 0;

    for (var i = 0; i < ListLi.length; i++) {
        if (GetNameFromLi(ListLi[i]).toUpperCase().indexOf(Filter) > -1 &&
            SoLuong < ProductsPerPage) {
            ShowLi(ListLi[i]);
            CoSanPham = true;
            SoLuong++;

        } else {
            HideLi(ListLi[i]);
        }
    }

// Alert if no products available
    AlertNotHaveProduct(CoSanPham);
}

// ================= Other functions ==================

// Add banner
function AddBanner(Img, Link) {
    // <a target='_blank' href=` + Link + `>
    var NewDiv = `<div class='item'>
                        <img src=` + Img + `>
                    </div>`;
    var Banner = document.getElementsByClassName('owl-carousel')[0];
    Banner.innerHTML += NewDiv;
}

function AddSmallBanner(Img) {
    var Newimg = `<img src=` + Img + ` style="width: 100%;">`;
    var Smallbanner = document.getElementsByClassName('smallbanner')[0];
    Smallbanner.innerHTML += Newimg;
}

// Add manufacturer
function AddCompany(Img, NameCompany) {
    var NewTag = `<button onclick="FiltersAjax(['company=` + NameCompany + `'])"><img src=` + Img + `></button>`;

    var KhungHangSanXuat = document.getElementsByClassName('companyMenu')[0];
    KhungHangSanXuat.innerHTML += NewTag;
}

// Add price range selection
function AddPricesRange(Min, Max) {
    var Text = PriceToString(Min, Max);
    var A = `<a onclick="FiltersAjax(CreateFilters('price', '` + (Min + "-" + Max) + `'))">` + Text + `</a>`

    document.getElementsByClassName('pricesRangeFilter')[0]
        .getElementsByClassName('dropdown-content')[0].innerHTML += A;
}

// Add promotion selection
function AddPromotion(Name) {
    var Text = PromoToString(Name);
    var Promo = `<a onclick="FiltersAjax(CreateFilters('promo', '` + Name + `'))">` + Text + `</a>`;

    document.getElementsByClassName('promosFilter')[0]
        .getElementsByClassName('dropdown-content')[0].innerHTML += Promo;
}

// Add star quantity selection
function AddStarFilter(Value) {
    var Text = StarToString(Value);
    var Star = `<a onclick="FiltersAjax(CreateFilters('star', '` + Value + `'))">` + Text + `</a>`;

    document.getElementsByClassName('starFilter')[0]
        .getElementsByClassName('dropdown-content')[0].innerHTML += Star;
}

// Add price sort selection
function AddSortFilter(Type, NameFilter, Text) {
    var SortTag = `<a onclick="FiltersAjax(CreateFilters('sort', '` + (NameFilter + "-" + Type) + `'))">` + Text + `</a>`;

    document.getElementsByClassName('sortFilter')[0]
        .getElementsByClassName('dropdown-content')[0].innerHTML += SortTag;
}

//  =================== ToString ====================
function SearchToString(Value) {
    return "Search '" + Value + "'";
}

// Convert price level to string
function PriceToString(Min, Max) {
    if (Min == 0) return 'Under ' + Max / 1E6 + ' million';
    if (Max == 0) return 'Above ' + Min / 1E6 + ' million';
    return 'From ' + Min / 1E6 + ' - ' + Max / 1E6 + ' million';
}

// Convert promotion to string
function PromoToString(Name) {
    switch (Name) {
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
function StarToString(Star) {
    return 'From ' + Star + ' stars and up';
}

// Convert sort types to string
function SortToString(SortBy) {
    switch (SortBy) {
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
function HideSanPhamKhongThuoc(List) {
    var AllLi = GetLiArray();
    for (var i = 0; i < AllLi.length; i++) {
        var Hide = true;
        for (var j = 0; j < List.length; j++) {
            if (GetNameFromLi(AllLi[i]) == List[j].name) {
                Hide = false;
                break;
            }
        }
        if (Hide) HideLi(AllLi[i]);
    }
}

//companysMenu responsive
function SetCompanysMenu() {
    var Content = document.getElementsByClassName("companyMenu")[0];
    if (Content.style.maxHeight) {
        Content.style.maxHeight = null;
        document.getElementById("iconOpenMenu").style.display = "block";
        document.getElementById("iconCloseMenu").style.display = "none";
    } else {
        Content.style.maxHeight = Content.scrollHeight + "px";
        document.getElementById("iconOpenMenu").style.display = "none";
        document.getElementById("iconCloseMenu").style.display = "block";
    }
}
