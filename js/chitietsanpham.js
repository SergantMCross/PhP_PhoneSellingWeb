var NameProduct, MaProduct; // Product name in this page, 
// // global variable to be used anywhere in the page
// // no need to get name from url multiple times

window.onload = function() {
    KhoiTao();

    // add tags (keywords) to search box
    var Tags = ["Samsung", "iPhone", "Huawei", "Oppo", "Mobi"];
    for (var t of Tags) AddTags(t, "index.php?search=" + t, true);

    PhanTichURLWeb2();
}

// ======================= Web 2 =======================
function PhanTichURLWeb2() {
    MaProduct = window.location.href.split('?')[1]; // get name
    if (!MaProduct) return; // if no name found, exit function

    $.ajax({
        type: "POST",
        url: "php/ProcessProduct.php",
        dataType: "json",
        timeout: 1500, // stop after 1.5 seconds with no response => show error
        data: {
            request: "getbyid",
            id: MaProduct
        },
        success: function(data, status, xhr) {
            // console.log(data);
            AddChiTietToWeb(data);
            NameProduct = data.TenSP;
        },
        error: function(e) {
            Swal.fire({
                type: "error",
                title: "Error loading product (chitietSanpham.js > PhanTichURLWeb2)",
                html: e.responseText
            });
        }
    })
}

function AddChiTietToWeb(p) {
    var DivChiTiet = document.getElementsByClassName('chitietSanpham')[0];

    // Change title
    document.title = p.TenSP + ' - Smartphone Store';

    // Update h1 name
    var H1 = DivChiTiet.getElementsByTagName('h1')[0];
    H1.innerHTML += p.TenSP;

    // Update stars
    var Rating = "";
    if (p.SoSao > 0) {
        Rating = GetRateStar(p.SoSao);
        Rating += `<span> ` + p.SoDanhGia + ` reviews </span>`;
    }
    DivChiTiet.getElementsByClassName('rating')[0].innerHTML += Rating;

    // Update price + promotion label
    var AreaPrice = DivChiTiet.getElementsByClassName('area_price')[0];
    // Convert price to html tag format
    var GiaTri = parseInt(p.DonGia);
    var GiaTrikhuyenMai = parseInt(p.KM.GiaTriKM);
    var GiaTriSauKM = GiaTri - GiaTrikhuyenMai;

    var Pricediv, Khuyenmaidiv;

    if (p.KM.LoaiKM == "GiaReOnline") {

        AreaPrice.innerHTML = `<strong>` + GiaTriSauKM.toLocaleString() + `&#8363;</strong>
                <span>` + GiaTri.toLocaleString() + `&#8363;</span>`;

        AreaPrice.innerHTML += PromoToWeb(p.KM.LoaiKM, GiaTriSauKM);
    } else {
        document.getElementsByClassName('ship')[0].style.display = ''; // show 'delivery within 1 hour'
        
        Khuyenmaidiv = PromoToWeb(p.KM.LoaiKM, GiaTrikhuyenMai);
        AreaPrice.innerHTML = `<strong>` + GiaTri.toLocaleString() + `&#8363;</strong>` + Khuyenmaidiv;
    }

    // Update promotion details
    document.getElementById('detailPromo').innerHTML = GetDetailPromo(p);

    // Update specifications
    var Info = document.getElementsByClassName('info')[0];
    var S = AddThongSo('Screen', p.ManHinh);
    S += AddThongSo('Operating System', p.HDH);
    S += AddThongSo('Rear Camera', p.CamSau);
    S += AddThongSo('Front Camera', p.CamTruoc);
    S += AddThongSo('CPU', p.CPU);
    S += AddThongSo('RAM', p.Ram);
    S += AddThongSo('Internal Storage', p.Rom);
    S += AddThongSo('Memory Card', p.SDCard);
    S += AddThongSo('Battery Capacity', p.Pin);
    Info.innerHTML = S;

    // Update image
    var Hinh = DivChiTiet.getElementsByClassName('picture')[0];
    Hinh = Hinh.getElementsByTagName('img')[0];
    Hinh.src = p.HinhAnh;

    // Test comments
    RefreshBinhLuan();
}

function CheckGuiBinhLuan() {
    GetCurrentUser((user) => {
        if(user == null) {
            Swal.fire({
                title: 'Hello!',
                text: 'You need to login to comment',
                type: 'error',
                grow: 'row',
                confirmButtonText: 'Login',
                cancelButtonText: 'Go back',
                showCancelButton: true
            }).then((result) => {
                if (result.value) {
                    ShowTaiKhoan(true);
                }
            })
        } else {
            GuiBinhLuan(user);
        }

    }, (error) => {
        Swal.fire({
            title: 'Error!',
            text: 'Error posting review',
            type: 'error',
            grow: 'row'
        })
    })
}

function GuiBinhLuan(Nguoidung) {
    var SoSao = $("input[name='star']:checked").val();
    var BinhLuan = $("#inpBinhLuan").val();

    if(!SoSao) {
        Swal.fire({
            title: 'Missing!',
            text: 'Please select star rating',
            type: 'warning',
            grow: 'row'
        })
        return;
    }

    if(!BinhLuan) {
        Swal.fire({
            title: 'Missing!',
            text: 'Please leave a comment',
            type: 'warning',
            grow: 'row'
        })
        $("#inpBinhLuan")[0].focus();
        return;
    }


    $.ajax({
        type: "POST",
        url: "php/ProcessReview.php",
        dataType: "json",
        timeout: 1500, // stop after 1.5 seconds with no response => show error
        data: {
            request: "thembinhluan",
            masp: MaProduct,
            mand: Nguoidung.MaND,
            sosao: SoSao,
            binhluan: BinhLuan,
            thoigian: new Date().ToMysqlFormat()
        },
        success: function(data, status, xhr) {
            $("#inpBinhLuan").val("");
            RefreshBinhLuan();
        },
        error: function(e) {
            console.log(e);
        }
    })
}

function RefreshBinhLuan() {
    $.ajax({
        type: "POST",
        url: "php/ProcessReview.php",
        dataType: "json",
        timeout: 1500, // stop after 1.5 seconds with no response => show error
        data: {
            request: "getbinhluan",
            masp: MaProduct
        },
        success: function(data, status, xhr) {
            var Div = document.getElementsByClassName("comment-content")[0];
            Div.innerHTML = "";
            for(var b of data) {
                Div.innerHTML += CreateComment(b.ND.TaiKhoan, b.BinhLuan, GetRateStar(b.SoSao), b.NgayLap);
            }
        },
        error: function(e) {
            console.log(e);
        }
    })
}

// =====================================================

function GetRateStar(Num) {
    var Result = "";
    for (var i = 1; i <= 5; i++) {
        if (i <= Num) {
            Result += `<i class="fa fa-star"></i>`
        } else {
            Result += `<i class="fa fa-star-o"></i>`
        }
    }
    return Result;
}

// Promotion details
function GetDetailPromo(Sp) {
    switch (Sp.KM.LoaiKM) {
        case 'tragop':
            var Span = `<span style="font-weight: bold"> interest rate ` + Sp.KM.GiaTriKM + `% </span>`;
            return `Customers can purchase this product on installment with ` + Span + `for a term of 6 months from purchase date.`;

        case 'giamgia':
            var Span = `<span style="font-weight: bold">` + Number(Sp.KM.GiaTriKM).toLocaleString() + `</span>`;
            return `Customers will get a discount of ` + Span + `₫ when purchasing directly at the store`;

        case 'moiramat':
            return `Customers can try the device for free at the store. Defective returns accepted within 2 months.`;

        case 'giareonline':
            var Del = Number(p.DonGia) - Number(p.KM.GiaTriKM);
            var Span = `<span style="font-weight: bold">` + NumToString(Del) + `</span>`;
            return `Product will be discounted ` + Span + `₫ when purchasing online with VPBank card or SMS`;

        default:
            var Span = `<span style="font-weight: bold">61 Wave Alpha motorbike</span>`;
            return `Chance to win ` + Span + ` with Home Credit installment`;
    }
}

function AddThongSo(Ten, Giatri) {
    return `<li>
                <p>` + Ten + `</p>
                <div>` + Giatri + `</div>
            </li>`;
}

function CreateComment(Name, Value, Star, Time) {
    return `<div class="comment">
                <i class="fa fa-user-circle"> </i>
                <h4>` + Name + `<span> `+ Star +`</span></h4>
                <p>` + Value + `</p>
                <span class="time">` + Time + `</span>
            </div>`;
}

/*// add image
function addSmallImg(img) {
    var newDiv = `<div class='item'>
                        <a>
                            <img src=` + img + ` onclick="changepic(this.src)">
                        </a>
                    </div>`;
    var banner = document.getElementsByClassName('owl-carousel')[0];
    banner.innerHTML += newDiv;
}

// open/close view image
function opencertain() {
    document.getElementById("overlaycertainimg").style.transform = "scale(1)";
}

function closecertain() {
    document.getElementById("overlaycertainimg").style.transform = "scale(0)";
}

// change image in image view mode
function changepic(src) {
    document.getElementById("bigimg").src = src;
}*/