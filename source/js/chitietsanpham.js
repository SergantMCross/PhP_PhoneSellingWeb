var nameProduct, maProduct; // Product name in this page, 
// // global variable to be used anywhere in the page
// // no need to get name from url multiple times

window.onload = function() {
    khoiTao();

    // add tags (keywords) to search box
    var tags = ["Samsung", "iPhone", "Huawei", "Oppo", "Mobi"];
    for (var t of tags) addTags(t, "index.php?search=" + t, true);

    phanTichURL_Web2();
}

// ======================= Web 2 =======================
function phanTichURL_Web2() {
    maProduct = window.location.href.split('?')[1]; // get name
    if (!maProduct) return; // if no name found, exit function

    $.ajax({
        type: "POST",
        url: "php/xulysanpham.php",
        dataType: "json",
        timeout: 1500, // stop after 1.5 seconds with no response => show error
        data: {
            request: "getbyid",
            id: maProduct
        },
        success: function(data, status, xhr) {
            // console.log(data);
            addChiTietToWeb(data);
            nameProduct = data.TenSP;
        },
        error: function(e) {
            Swal.fire({
                type: "error",
                title: "Error loading product (chitietSanpham.js > phanTichURL_Web2)",
                html: e.responseText
            });
        }
    })
}

function addChiTietToWeb(p) {
    var divChiTiet = document.getElementsByClassName('chitietSanpham')[0];

    // Change title
    document.title = p.TenSP + ' - Smartphone Store';

    // Update h1 name
    var h1 = divChiTiet.getElementsByTagName('h1')[0];
    h1.innerHTML += p.TenSP;

    // Update stars
    var rating = "";
    if (p.SoSao > 0) {
        rating = getRateStar(p.SoSao);
        rating += `<span> ` + p.SoDanhGia + ` reviews </span>`;
    }
    divChiTiet.getElementsByClassName('rating')[0].innerHTML += rating;

    // Update price + promotion label
    var area_price = divChiTiet.getElementsByClassName('area_price')[0];
    // Convert price to html tag format
    var giaTri = parseInt(p.DonGia);
    var giaTrikhuyenMai = parseInt(p.KM.GiaTriKM);
    var giaTriSauKM = giaTri - giaTrikhuyenMai;

    var pricediv, khuyenmaidiv;

    if (p.KM.LoaiKM == "GiaReOnline") {

        area_price.innerHTML = `<strong>` + giaTriSauKM.toLocaleString() + `&#8363;</strong>
                <span>` + giaTri.toLocaleString() + `&#8363;</span>`;

        area_price.innerHTML += promoToWeb(p.KM.LoaiKM, giaTriSauKM);
    } else {
        document.getElementsByClassName('ship')[0].style.display = ''; // show 'delivery within 1 hour'
        
        khuyenmaidiv = promoToWeb(p.KM.LoaiKM, giaTrikhuyenMai);
        area_price.innerHTML = `<strong>` + giaTri.toLocaleString() + `&#8363;</strong>` + khuyenmaidiv;
    }

    // Update promotion details
    document.getElementById('detailPromo').innerHTML = getDetailPromo(p);

    // Update specifications
    var info = document.getElementsByClassName('info')[0];
    var s = addThongSo('Screen', p.ManHinh);
    s += addThongSo('Operating System', p.HDH);
    s += addThongSo('Rear Camera', p.CamSau);
    s += addThongSo('Front Camera', p.CamTruoc);
    s += addThongSo('CPU', p.CPU);
    s += addThongSo('RAM', p.Ram);
    s += addThongSo('Internal Storage', p.Rom);
    s += addThongSo('Memory Card', p.SDCard);
    s += addThongSo('Battery Capacity', p.Pin);
    info.innerHTML = s;

    // Update image
    var hinh = divChiTiet.getElementsByClassName('picture')[0];
    hinh = hinh.getElementsByTagName('img')[0];
    hinh.src = p.HinhAnh;

    // Test comments
    refreshBinhLuan();
}

function checkGuiBinhLuan() {
    getCurrentUser((user) => {
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
                    showTaiKhoan(true);
                }
            })
        } else {
            guiBinhLuan(user);
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

function guiBinhLuan(nguoidung) {
    var soSao = $("input[name='star']:checked").val();
    var binhLuan = $("#inpBinhLuan").val();

    if(!soSao) {
        Swal.fire({
            title: 'Missing!',
            text: 'Please select star rating',
            type: 'warning',
            grow: 'row'
        })
        return;
    }

    if(!binhLuan) {
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
        url: "php/xulydanhgia.php",
        dataType: "json",
        timeout: 1500, // stop after 1.5 seconds with no response => show error
        data: {
            request: "thembinhluan",
            masp: maProduct,
            mand: nguoidung.MaND,
            sosao: soSao,
            binhluan: binhLuan,
            thoigian: new Date().toMysqlFormat()
        },
        success: function(data, status, xhr) {
            $("#inpBinhLuan").val("");
            refreshBinhLuan();
        },
        error: function(e) {
            console.log(e);
        }
    })
}

function refreshBinhLuan() {
    $.ajax({
        type: "POST",
        url: "php/xulydanhgia.php",
        dataType: "json",
        timeout: 1500, // stop after 1.5 seconds with no response => show error
        data: {
            request: "getbinhluan",
            masp: maProduct
        },
        success: function(data, status, xhr) {
            var div = document.getElementsByClassName("comment-content")[0];
            div.innerHTML = "";
            for(var b of data) {
                div.innerHTML += createComment(b.ND.TaiKhoan, b.BinhLuan, getRateStar(b.SoSao), b.NgayLap);
            }
        },
        error: function(e) {
            console.log(e);
        }
    })
}

// =====================================================

function getRateStar(num) {
    var result = "";
    for (var i = 1; i <= 5; i++) {
        if (i <= num) {
            result += `<i class="fa fa-star"></i>`
        } else {
            result += `<i class="fa fa-star-o"></i>`
        }
    }
    return result;
}

// Promotion details
function getDetailPromo(sp) {
    switch (sp.KM.LoaiKM) {
        case 'tragop':
            var span = `<span style="font-weight: bold"> interest rate ` + sp.KM.GiaTriKM + `% </span>`;
            return `Customers can purchase this product on installment with ` + span + `for a term of 6 months from purchase date.`;

        case 'giamgia':
            var span = `<span style="font-weight: bold">` + Number(sp.KM.GiaTriKM).toLocaleString() + `</span>`;
            return `Customers will get a discount of ` + span + `₫ when purchasing directly at the store`;

        case 'moiramat':
            return `Customers can try the device for free at the store. Defective returns accepted within 2 months.`;

        case 'giareonline':
            var del = Number(p.DonGia) - Number(p.KM.GiaTriKM);
            var span = `<span style="font-weight: bold">` + numToString(del) + `</span>`;
            return `Product will be discounted ` + span + `₫ when purchasing online with VPBank card or SMS`;

        default:
            var span = `<span style="font-weight: bold">61 Wave Alpha motorbike</span>`;
            return `Chance to win ` + span + ` with Home Credit installment`;
    }
}

function addThongSo(ten, giatri) {
    return `<li>
                <p>` + ten + `</p>
                <div>` + giatri + `</div>
            </li>`;
}

function createComment(name, value, star, time) {
    return `<div class="comment">
                <i class="fa fa-user-circle"> </i>
                <h4>` + name + `<span> `+ star +`</span></h4>
                <p>` + value + `</p>
                <span class="time">` + time + `</span>
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