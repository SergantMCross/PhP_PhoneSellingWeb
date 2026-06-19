var TONGTIEN = 0;

window.onload = function() {

    document.getElementById("btnDangXuat").onclick = function() {
        checkDangXuat(()=>{
            window.location.href = "login.php"
        });
    }

    getCurrentUser((user)=>{
        if(user != null) {
            if(user.MaQuyen != 1) {
                addEventChangeTab();
                addThongKe();
                openTab('Home');
            }
        } else {
            document.body.innerHTML = `<h1 style="color:red; with:100%; text-align:center; margin: 50px;"> Access denied.. </h1>`;
        }
    }, (e)=> {
        document.body.innerHTML = `<h1 style="color:red; with:100%; text-align:center; margin: 50px;"> Access denied.. </h1>`;
    });
}

function refreshTableSanPham() {
    $.ajax({
        type: "POST",
        url: "php/xulysanpham.php",
        dataType: "json",
        // timeout: 1500, // stop after 1.5 seconds with no response => show error
        data: {
            request: "getall",
        },
        success: function(data, status, xhr) {
            list_products = data; // global variable storing current product array
            addTableProducts(data);
        },
        error: function(e) {
            Swal.fire({
                type: "error",
                title: "Error loading product data (admin.js > refreshTableSanPham)",
                html: e.responseText
            });
            console.log(e.responseText)
        }
    });
}

function addChart(id, chartOption) {
    var ctx = document.getElementById(id).getContext('2d');
    var chart = new Chart(ctx, chartOption);
}

function addThongKe() {
    var dataChart = {
        type: 'bar',
        data: {
            labels: ["Apple", "Samsung", "Xiaomi", "Vivo", "Oppo", "Mobiistar"],
            datasets: [{
                label: 'Products sold',
                data: [12, 19, 10, 5, 20, 5],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            title: {
                fontColor: '#fff',
                fontSize: 25,
                display: true,
                text: 'Products sold'
            }
        }
    };

    // Add statistics
    var barChart = copyObject(dataChart);
    barChart.type = 'bar';
    addChart('myChart1', barChart);

    var doughnutChart = copyObject(dataChart);
    doughnutChart.type = 'doughnut';
    addChart('myChart2', doughnutChart);

    var pieChart = copyObject(dataChart);
    pieChart.type = 'pie';
    addChart('myChart3', pieChart);

    var lineChart = copyObject(dataChart);
    lineChart.type = 'line';
    addChart('myChart4', lineChart);
}

function ajaxLoaiSanPham() {
    $.ajax({
        type: "POST",
        url: "php/xulyloaisanpham.php",
        dataType: "json",
        // timeout: 1500, // stop after 1.5 seconds with no response => show error
        data: {
            request: "getall"
        },
        success: function(data, status, xhr) {
            showLoaiSanPham(data);
        },
        error: function(e) {

        }
    });
}

function showLoaiSanPham(data) {
    var s="";
    for (var i = 0; i < data.length; i++) {
            var p = data[i];
                s +=`<option value="` + p.MaLSP + `">` + p.TenLSP + `</option>`;
        }
    document.getElementsByName("chonCompany")[0].innerHTML = s;
}

function ajaxKhuyenMai() {
    $.ajax({
        type: "POST",
        url: "php/xulykhuyenmai.php",
        dataType: "json",
        // timeout: 1500, // stop after 1.5 seconds with no response => show error
        data: {
            request: "getall"
        },
        success: function(data, status, xhr) {
            showKhuyenMai(data);
            showGTKM(data);
        },
        error: function(e) {

        }
    });
}

function showKhuyenMai(data) {
    var s=`
        <option selected="selected" value="`+data[0].MaKM+`">None</option>
        <option value="`+data[1].MaKM+`">Installment</option>
        <option value="`+data[2].MaKM+`">Discount</option>
        <option value="`+data[3].MaKM+`">Online Cheap</option>
        <option value="`+data[4].MaKM+`">New Launch</option>`;
    document.getElementsByName("chonKhuyenMai")[0].innerHTML = s;

}

function showGTKM() {
    var giaTri = document.getElementsByName("chonKhuyenMai")[0].value;
    switch (giaTri) {
        // get all promotions
        case '1':
                document.getElementById("giatrikm").value = 0;
            break;

        case '2':
                document.getElementById("giatrikm").value = 500000;
            break;

        case '3':
                document.getElementById("giatrikm").value = 650000;
            break;

        case '4':
                document.getElementById("giatrikm").value = 0;
            break;

        case '5':
                document.getElementById("giatrikm").value = 0;
            break;

        default:
            break;
    }
}

// ======================= Tabs =========================
function addEventChangeTab() {
    var sidebar = document.getElementsByClassName('sidebar')[0];
    var list_a = sidebar.getElementsByTagName('a');
    for (var a of list_a) {
        if (!a.onclick) {
            a.addEventListener('click', function() {
                turnOff_Active();
                this.classList.add('active');
                var tab = this.childNodes[1].data.trim()
                openTab(tab);
            })
        }
    }
}

function turnOff_Active() {
    var sidebar = document.getElementsByClassName('sidebar')[0];
    var list_a = sidebar.getElementsByTagName('a');
    for (var a of list_a) {
        a.classList.remove('active');
    }
}

function openTab(nameTab) {
    // hide all
    var main = document.getElementsByClassName('main')[0].children;
    for (var e of main) {
        e.style.display = 'none';
    }

    // open tab
    switch (nameTab) {
        case 'Home':
            document.getElementsByClassName('home')[0].style.display = 'block';
            break;
        case 'Products':
            document.getElementsByClassName('sanpham')[0].style.display = 'block';
            break;
        case 'Orders':
            document.getElementsByClassName('donhang')[0].style.display = 'block';
            break;
        case 'Customers':
            document.getElementsByClassName('khachhang')[0].style.display = 'block';
            break;
        case 'Statistics':
            document.getElementsByClassName('thongke')[0].style.display = 'block';
            break;
    }
}

// ========================== Products ========================
// Draw product list table
function addTableProducts(list_products) {
    var tc = document.getElementsByClassName('sanpham')[0].getElementsByClassName('table-content')[0];
    var s = `<table class="table-outline hideImg">`;

    for (var i = 0; i < list_products.length; i++) {
        var p = list_products[i];
        s += `<tr>
            <td style="width: 5%">` + (i + 1) + `</td>
            <td style="width: 10%">` + p.MaSP + `</td>
            <td style="width: 40%">
                <a title="View details" target="_blank" href="chitietsanpham.php?` + p.TenSP.split(' ').join('-') + `">` + p.TenSP + `</a>
                <img src="` + p.HinhAnh + `"></img>
            </td>
            <td style="width: 15%">` + parseInt(p.DonGia).toLocaleString() + `</td>
            <td style="width: 10%">` + /*promoToStringValue(*/ (p.KM.TenKM) /*)*/ + `</td>
            <td style="width: 10%">` + (p.TrangThai==1?"Visible":"Hidden") + `</td>
            <td style="width: 10%">
                <div class="tooltip">
                    <i class="fa fa-wrench" onclick="addKhungSuaSanPham('` + p.MaSP + `')"></i>
                    <span class="tooltiptext">Edit</span>
                </div>
                <div class="tooltip">
                    <i class="fa fa-trash" onclick="xoaSanPham('` + p.TrangThai + `', '` + p.MaSP + `', '` + p.TenSP + `')"></i>
                    <span class="tooltiptext">Delete</span>
                </div>
            </td>
        </tr>`;
    }

    s += `</table>`;

    tc.innerHTML = s;
}

// Search
function timKiemSanPham(inp) {
    var kieuTim = document.getElementsByName('kieuTimSanPham')[0].value;
    var text = inp.value;

    // Filter
    var vitriKieuTim = {
        'ma': 1,
        'ten': 2
    }; // array storing column positions

    var listTr_table = document.getElementsByClassName('sanpham')[0].getElementsByClassName('table-content')[0].getElementsByTagName('tr');
    for (var tr of listTr_table) {
        var td = tr.getElementsByTagName('td')[vitriKieuTim[kieuTim]].innerHTML.toLowerCase();

        if (td.indexOf(text.toLowerCase()) < 0) {
            tr.style.display = 'none';
        } else {
            tr.style.display = '';
        }
    }
}

// Add
function layThongTinSanPhamTuTable(id) {
    var khung = document.getElementById(id);
    var tr = khung.getElementsByTagName('tr');

    var masp = tr[1].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;
    var name = tr[2].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;
    var company = tr[3].getElementsByTagName('td')[1].getElementsByTagName('select')[0].value;
    var img =  document.getElementById("hinhanh").value;
    var price = tr[5].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;
    var amount = tr[6].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;
    var star = tr[7].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;
    var rateCount = tr[8].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;
    var promoName = tr[9].getElementsByTagName('td')[1].getElementsByTagName('select')[0].value;
    var promoValue = tr[10].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;

    var screen = tr[12].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;
    var os = tr[13].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;
    var camara = tr[14].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;
    var camaraFront = tr[15].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;
    var cpu = tr[16].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;
    var ram = tr[17].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;
    var rom = tr[18].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;
    var microUSB = tr[19].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;
    var battery = tr[20].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;

    return {
        "name": name,
        "img": img,
        "price": price,
        "company": company,
        "amount": amount,
        "star": star,
        "rateCount": rateCount,
        "promo": {
            "name": promoName,
            "value": promoValue
        },
        "detail": {
            "screen": screen,
            "os": os,
            "camara": camara,
            "camaraFront": camaraFront,
            "cpu": cpu,
            "ram": ram,
            "rom": rom,
            "microUSB": microUSB,
            "battery": battery
        },
        "masp": masp,
        "TrangThai": 1
    };
}

function themSanPham() {
    var newSp = layThongTinSanPhamTuTable('khungThemSanPham');

    //check product name
    var pattCheckTenSP = /([a-z A-Z0-9&():.'_-]{2,})$/;
    if (pattCheckTenSP.test(newSp.name) == false)
    {
        alert ("Invalid product name");
        return false;
    }

    //check image
    /*var pattCheckHinh= /^([0-9]{1,})[.](png|jpeg|jpg)$/;
    if (pattCheckHinh.test(newSp.img) == false)
    {
        alert ("Invalid image");
        return false;
    }*/

    //check price
    var pattCheckGia = /^([0-9]){1,}(000)$/;
    if (pattCheckGia.test(newSp.price) == false)
    {
        alert ("Invalid product price");
        return false;
    }

    //check quantity
    var pattCheckSL = /[0-9]{1,}$/;
    if (pattCheckSL.test(newSp.amount) == false)
    {
        alert ("Invalid product quantity");
        return false;
    }

    $.ajax({
        type: "POST",
        url: "php/xulysanpham.php",
        dataType: "json",
        // timeout: 1500, // stop after 1.5 seconds with no response => show error
        data: {
            request: "add",
            dataAdd: newSp
        },
        success: function(data, status, xhr) {
            Swal.fire({
                type: 'success',
                title: 'Add successful'
            })
            resetForm();
            document.getElementById('khungThemSanPham').style.transform = 'scale(0)';
            refreshTableSanPham();
        },
        error: function(e) {
            Swal.fire({
                type: "error",
                title: "Add error",
                html: e.responseText
            });
        }
    });

    

    alert('Product "' + newSp.name + '" added successfully.');
    refreshTableSanPham();

}
function resetForm() {
    var khung = document.getElementById('khungThemSanPham');
    var tr = khung.getElementsByTagName('tr');

    tr[2].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value = "";
    tr[4].getElementsByTagName('td')[1].getElementsByTagName('img')[0].src = "";
    tr[5].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value = "";
    tr[6].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value = "0";

    tr[12].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value ="";
    tr[13].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value ="";
    tr[14].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value ="";
    tr[15].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value ="";
    tr[16].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value ="";
    tr[17].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value ="";
    tr[18].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value ="";
    tr[19].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value ="";
    tr[20].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value ="";
}

function autoMaSanPham(company) {
    // auto generate code for new product
    var autoMaSP = list_products[list_products.length-1].MaSP;
    document.getElementById('maspThem').value = parseInt(autoMaSP)+1;
}

// Delete
function xoaSanPham(trangthai, masp, tensp) {
    if (trangthai == 1)
    {
        // alert ("Product is still being sold");
        Swal.fire({
            type: 'warning',
            title: 'Do you want to hide ' + tensp + '?',
            showCancelButton: true
        }).then((result) => {
            if(result.value) {
                $.ajax({
                    type: "POST",
                    url: "php/xulysanpham.php",
                    dataType: "json",
                    // timeout: 1500, // stop after 1.5 seconds with no response => show error
                    data: {
                        request: "hide",
                        id: masp,
                        trangthai: 0
                    },
                    success: function(data, status, xhr) {
                        Swal.fire({
                            type: 'success',
                            title: 'Hide successful'
                        })
                        refreshTableSanPham();
                    },
                    error: function(e) {
                        Swal.fire({
                            type: "error",
                            title: "Delete error",
                            html: e.responseText
                        });
                    }
                });
            }
        })
    }
    else
    {
        if (window.confirm('Are you sure you want to delete ' + tensp)) {
            // Delete
            $.ajax({
                type: "POST",
                url: "php/xulysanpham.php",
                dataType: "json",
                // timeout: 1500, // stop after 1.5 seconds with no response => show error
                data: {
                    request: "delete",
                    maspdelete: masp
                },
                success: function(data, status, xhr) {
                    
                },
                error: function() {
                    Swal.fire({
                        type: "error",
                        title: "Delete error"
                    });
                }
            });

            // Redraw table 
            refreshTableSanPham();
        }
    }
}

// Edit
function suaSanPham(masp) {
    var Sp = layThongTinSanPhamTuTable('khungSuaSanPham');
    console.log(Sp);
    return false;
}

function addKhungSuaSanPham(masp) {
    var sp;
    for (var p of list_products) {
        if (p.MaSP == masp) {
            sp = p;
        }
    }

    var s = `<span class="close" onclick="this.parentElement.style.transform = 'scale(0)';">&times;</span>
    <form method="post" action="" enctype="multipart/form-data" onsubmit="return suaSanPham('` + sp.MaSP + `')">
        <table class="overlayTable table-outline table-content table-header">
            <tr>
                <th colspan="2">` + sp.TenSP + `</th>
            </tr>
            <tr>
                <td>Product code:</td>
                <td><input disabled="disabled" type="text" id="maspSua" name="maspSua" value="` + sp.MaSP + `"></td>
            </tr>
            <tr>
                <td>Product name:</td>
                <td><input type="text" value="` + sp.TenSP + `"></td>
            </tr>
            <tr>
                <td>Brand:</td>
                <td>
                    <select name="chonCompany" onchange="autoMaSanPham(this.value)">`

                    var company = ["Apple", "Coolpad", "HTC", "Itel", "Mobell", "Vivo", "Oppo", "SamSung", "Phillips", "Nokia", "Motorola", "Motorola", "Xiaomi"];
                    var i = 1;
                    for (var c of company) {
                        var masp = i++;
                        if (sp.MaLSP == masp)
                            s += (`<option value="` + sp.MaLSP + `" selected="selected">` + c + `</option>`);
                        else s += (`<option value="` + masp + `">` + c + `</option>`);
                    }
                    s+=`</select>
                </td>
            </tr>
            <?php
                            $tenfilemoi= "";
                                if (isset($_POST["submit"]))
                                {
                                    if (($_FILES["hinhanh"]["type"]=="image/jpeg") ||($_FILES["hinhanh"]["type"]=="image/png") || ($_FILES["hinhanh"]["type"]=="image/jpg") && ($_FILES["hinhanh"]["size"] < 50000) )
                                    {
                                        if ($_FILES["file"]["error"] > 0 || file_exists("img/products/" . basename($_FILES["hinhanh"]["name"]))) 
                                        {
                                            echo ("Error Code: " . $_FILES["file"]["error"] . "<br />Edit image later)");
                                        }
                                        else
                                        {
                                            /*$tmp = explode(".", $_FILES["hinhanh"]["name"]);
                                            $duoifile = end($tmp);
                                            $masp = $_POST['maspThem'];
                                            $tenfilemoi = $masp . "." . $duoifile;*/
                                            $file = $_FILES["hinhanh"]["name"];
                                            $tenfilemoi = "img/products/" .$_FILES["hinhanh"]["name"];
                                            move_uploaded_file( $_FILES["hinhanh"]["tmp_name"], $tenfilemoi);
                                        }
                                    }
                                }
                        // require_once ("php/uploadfile.php");
                        ?>
            <tr>
                            <td>Image:</td>
                            <td>
                                <img class="hinhDaiDien" id="anhDaiDienSanPhamThem" src="">
                                <input type="file" name="hinhanh" onchange="capNhatAnhSanPham(this.files, 'anhDaiDienSanPhamThem', '<?php echo $tenfilemoi; ?>')">
                                <input style="display: none;" type="text" id="hinhanh" value="">
                            </td>
                        </tr>
            <tr>
                <td>Price:</td>
                <td><input type="text" value="` + sp.DonGia + `"></td>
            </tr>
            <tr>
                <td>Stars:</td>
                <td><input type="text" value="` + sp.SoSao + `"></td>
            </tr>
            <tr>
                <td>Rating:</td>
                <td><input type="text" value="` + sp.SoDanhGia + `"></td>
            </tr>
            <tr>
                <td>Promotion:</td>
                <td>
                    <select name="chonKhuyenMai" onchange="showGTKM()">`
                            var i = 1;
                            s += (`<option selected="selected" value="` + i++ + `">None</option>`);
                            s += (`<option value="` + i++ + `">Discount</option>`);
                            s += (`<option value="` + i++ + `">Online Cheap</option>`);
                            s += (`<option value="` + i++ + `">Installment</option>`);
                            s += (`<option value="` + i++ + `">New Launch</option>`);
                        s+=`</script>
                    </select>
                </td>
            </tr>
            <tr>
                <td>Promotion value:</td>
                <td><input id="giatrikm" type="text" value="0"></td>
            </tr>
            <tr>
                <th colspan="2">Specifications</th>
            </tr>
            <tr>
                <td>Screen:</td>
                <td><input type="text" value="` + sp.ManHinh + `"></td>
            </tr>
            <tr>
                <td>Operating System:</td>
                <td><input type="text" value="` + sp.HDH + `"></td>
            </tr>
            <tr>
                <td>Rear Camera:</td>
                <td><input type="text" value="` + sp.CamSau + `"></td>
            </tr>
            <tr>
                <td>Front Camera:</td>
                <td><input type="text" value="` + sp.CamTruoc + `"></td>
            </tr>
            <tr>
                <td>CPU:</td>
                <td><input type="text" value="` + sp.CPU + `"></td>
            </tr>
            <tr>
                <td>RAM:</td>
                <td><input type="text" value="` + sp.Ram + `"></td>
            </tr>
            <tr>
                <td>Internal Storage:</td>
                <td><input type="text" value="` + sp.Rom + `"></td>
            </tr>
            <tr>
                <td>Memory Card:</td>
                <td><input type="text" value="` + sp.SDCard + `"></td>
            </tr>
            <tr>
                <td>Battery Capacity:</td>
                <td><input type="text" value="` + sp.Pin + `"></td>
            </tr>
            <tr>
                <td colspan="2"  class="table-footer"> <button name="submit">SỬA</button> </td>
            </tr>
        </table>`

    var khung = document.getElementById('khungSuaSanPham');
    khung.innerHTML = s;
    khung.style.transform = 'scale(1)';
}

// Update product image
function capNhatAnhSanPham(files, id, anh) {
    var url = '';
    if (files.length) url = window.URL.createObjectURL(files[0]);

    document.getElementById(id).src = url;
    document.getElementById('hinhanh').value = anh;
}

// Sort products
function sortProductsTable(loai) {
    var list = document.getElementsByClassName('sanpham')[0].getElementsByClassName("table-content")[0];
    var tr = list.getElementsByTagName('tr');

    quickSort(tr, 0, tr.length - 1, loai, getValueOfTypeInTable_SanPham); // type allows sorting by code, name, price, etc. 
    decrease = !decrease;
}

// Get value of a specific data type (column) in the table
function getValueOfTypeInTable_SanPham(tr, loai) {
    var td = tr.getElementsByTagName('td');
    switch (loai) {
        case 'stt':
            return Number(td[0].innerHTML);
        case 'masp':
            return Number(td[1].innerHTML);
        case 'ten':
            return td[2].innerHTML.toLowerCase();
        case 'gia':
            return stringToNum(td[3].innerHTML);
        case 'khuyenmai':
            return td[4].innerHTML.toLowerCase();
    }
    return false;
}

// ========================= Orders ===========================
// Draw table

function refreshTableDonHang() {
    $.ajax({
        type: "POST",
        url: "php/xulydonhang.php",
        dataType: "json",
        // timeout: 1500, // stop after 1.5 seconds with no response => show error
        data: {
            request: "getall",
        },
        success: function(data, status, xhr) {
            addTableDonHang(data);
            console.log(data);
        },
        error: function(e) {
            Swal.fire({
                type: "error",
                title: "Error loading customer data (admin.js > refreshTableKhachHang)",
                html: e.responseText
            });
        }
    });
}
function addTableDonHang(data) {
    var tc = document.getElementsByClassName('donhang')[0].getElementsByClassName('table-content')[0];
    var s = `<table class="table-outline hideImg">`;

    TONGTIEN = 0;
    for (var i = 0; i < data.length; i++) {
        var d = data[i];
        s += `<tr>
            <td style="width: 5%">` + (i + 1) + `</td>
            <td style="width: 13%">` + d.MaHD + `</td>
            <td style="width: 7%">` + d.MaND + `</td>
            <td style="width: 20%">` + /*d.sp*/ + `</td>
            <td style="width: 15%">` + d.TongTien + `</td>
            <td style="width: 10%">` + d.NgayLap + `</td>
            <td style="width: 10%">` + d.TinhTrang + `</td>
            <td style="width: 10%">
                <div class="tooltip">
                    <i class="fa fa-check" onclick="duyet('` + d.MaHD + `', true)"></i>
                    <span class="tooltiptext">Approve</span>
                </div>
                <div class="tooltip">
                    <i class="fa fa-remove" onclick="duyet('` + d.MaHD + `', false)"></i>
                    <span class="tooltiptext">Cancel</span>
                </div>
                
            </td>
        </tr>`;
        TONGTIEN += stringToNum(d.tongtien);
    }

    s += `</table>`;
    tc.innerHTML = s;
}

function getListDonHang() {
    var u = getListUser();
    var result = [];
    for (var i = 0; i < u.length; i++) {
        for (var j = 0; j < u[i].donhang.length; j++) {
            // Total amount
            var tongtien = 0;
            for (var s of u[i].donhang[j].sp) {
                var timsp = timKiemTheoMa(list_products, s.ma);
                if (timsp.MaKM.name == 'giareonline') tongtien += stringToNum(timsp.MaKM.value);
                else tongtien += stringToNum(timsp.DonGia);
            }

            // Date time
            var x = new Date(u[i].donhang[j].ngaymua).toLocaleString();

            // Products
            var sps = '';
            for (var s of u[i].donhang[j].sp) {
                sps += `<p style="text-align: right">` + (timKiemTheoMa(list_products, s.ma).name + ' [' + s.soluong + ']') + `</p>`;
            }

            // Save to result
            result.push({
                "ma": u[i].donhang[j].ngaymua.toString(),
                "khach": u[i].username,
                "sp": sps,
                "tongtien": numToString(tongtien),
                "ngaygio": x,
                "tinhTrang": u[i].donhang[j].tinhTrang
            });
        }
    }
    return result;
}

// Approve
function duyet(maDonHang, duyetDon) {
    var u = getListUser();
    for (var i = 0; i < u.length; i++) {
        for (var j = 0; j < u[i].donhang.length; j++) {
            if (u[i].donhang[j].ngaymua == maDonHang) {
                if (duyetDon) {
                    if (u[i].donhang[j].tinhTrang == 'Pending') {
                        u[i].donhang[j].tinhTrang = 'Delivered';

                    } else if (u[i].donhang[j].tinhTrang == 'Cancelled') {
                        alert('Cannot approve cancelled order !');
                        return;
                    }
                } else {
                    if (u[i].donhang[j].tinhTrang == 'Pending') {
                        if (window.confirm('Are you sure you want to cancel this order. This action cannot be undone !'))
                            u[i].donhang[j].tinhTrang = 'Cancelled';

                    } else if (u[i].donhang[j].tinhTrang == 'Delivered') {
                        alert('Cannot cancel delivered order !');
                        return;
                    }
                }
                break;
            }
        }
    }

    // save
    setListUser(u);

    // redraw
    addTableDonHang();
}

function locDonHangTheoKhoangNgay() {
    var from = document.getElementById('fromDate').valueAsDate;
    var to = document.getElementById('toDate').valueAsDate;

    var listTr_table = document.getElementsByClassName('donhang')[0].getElementsByClassName('table-content')[0].getElementsByTagName('tr');
    for (var tr of listTr_table) {
        var td = tr.getElementsByTagName('td')[5].innerHTML;
        var d = new Date(td);

        if (d >= from && d <= to) {
            tr.style.display = '';
        } else {
            tr.style.display = 'none';
        }
    }
}

function timKiemDonHang(inp) {
    var kieuTim = document.getElementsByName('kieuTimDonHang')[0].value;
    var text = inp.value;

    // Filter
    var vitriKieuTim = {
        'ma': 1,
        'khachhang': 2,
        'trangThai': 6
    };

    var listTr_table = document.getElementsByClassName('donhang')[0].getElementsByClassName('table-content')[0].getElementsByTagName('tr');
    for (var tr of listTr_table) {
        var td = tr.getElementsByTagName('td')[vitriKieuTim[kieuTim]].innerHTML.toLowerCase();

        if (td.indexOf(text.toLowerCase()) < 0) {
            tr.style.display = 'none';
        } else {
            tr.style.display = '';
        }
    }
}

// Sort
function sortDonHangTable(loai) {
    var list = document.getElementsByClassName('donhang')[0].getElementsByClassName("table-content")[0];
    var tr = list.getElementsByTagName('tr');

    quickSort(tr, 0, tr.length - 1, loai, getValueOfTypeInTable_DonHang);
    decrease = !decrease;
}

// Get value of a specific data type (column) in the table
function getValueOfTypeInTable_DonHang(tr, loai) {
    var td = tr.getElementsByTagName('td');
    switch (loai) {
        case 'stt':
            return Number(td[0].innerHTML);
        case 'ma':
            return new Date(td[1].innerHTML); // convert to date format for date comparison
        case 'khach':
            return td[2].innerHTML.toLowerCase(); // get customer name
        case 'sanpham':
            return td[3].children.length; // get number of items in this order, length here is number of <p> tags
        case 'tongtien':
            return stringToNum(td[4].innerHTML); // return as price format
        case 'ngaygio':
            return new Date(td[5].innerHTML); // convert to date
        case 'trangthai':
            return td[6].innerHTML.toLowerCase(); //
    }
    return false;
}

// ====================== Customers =============================
// Draw table
function refreshTableKhachHang() {
    $.ajax({
        type: "POST",
        url: "php/xulykhachhang.php",
        dataType: "json",
        // timeout: 1500, // stop after 1.5 seconds with no response => show error
        data: {
            request: "getall",
        },
        success: function(data, status, xhr) {
            addTableKhachHang(data);
            //console.log(data);
        },
        error: function(e) {
            Swal.fire({
                type: "error",
                title: "Error loading customer data (admin.js > refreshTableKhachHang)",
                html: e.responseText
            });
        }
    });
}

function thayDoiTrangThaiND(inp, mand) {
    var trangthai = (inp.checked?1:0);  
    $.ajax({
        type: "POST",
        url: "php/xulykhachhang.php",
        dataType: "json",
        // timeout: 1500, // stop after 1.5 seconds with no response => show error
        data: {
            request: "changeTT",
            key: mand,
            trangThai: trangthai
        },
        success: function(data, status, xhr) {
            //list_products = data; // global variable storing current product array
            // refreshTableKhachHang();
            //console.log(data);
        },
        error: function(e) {
            // Swal.fire({
            //     type: "error",
            //     title: "Error loading customer data (admin.js > refreshTableKhachHang)",
            //     html: e.responseText
            // });
            console.log(e.responseText);
        }
    });
}


function addTableKhachHang(data) {
    var tc = document.getElementsByClassName('khachhang')[0].getElementsByClassName('table-content')[0];
    var s = `<table class="table-outline hideImg">`;


    for (var i = 0; i < data.length; i++) {
        var u = data[i];
        console.log(u.TrangThai)

        s += `<tr>
            <td >` + (i + 1) + `</td>
            <td >` + u.Ho + ' ' + u.Ten + `</td>
            <td >` + u.Email + `</td>
            <td >` + u.TaiKhoan + `</td>           
            <td >
                <div class="tooltip">
                    <label class="switch">
                        <input type="checkbox" `+(u.TrangThai==1?"checked":"")+` onclick="thayDoiTrangThaiND(this, '`+u.MaND+`')">
                        <span class="slider round"></span>
                    </label>
                    <span class="tooltiptext">` + (u.TrangThai ?    'Active' : 'Locked') + `</span>
                </div>
                <div class="tooltip">
                    <i class="fa fa-remove" onclick="xoaNguoiDung('` + u.MaND + `')"></i>
                    <span class="tooltiptext">Delete</span>
                </div>
            </td>
        </tr>`;
    }

    s += `</table>`;
    tc.innerHTML = s;
}

// Search
function timKiemNguoiDung(inp) {
    var kieuTim = document.getElementsByName('kieuTimKhachHang')[0].value;
    var text = inp.value;

    // Filter
    var vitriKieuTim = {
        'ten': 1,
        'email': 2,
        'taikhoan': 3
    };

    var listTr_table = document.getElementsByClassName('khachhang')[0].getElementsByClassName('table-content')[0].getElementsByTagName('tr');
    for (var tr of listTr_table) {
        var td = tr.getElementsByTagName('td')[vitriKieuTim[kieuTim]].innerHTML.toLowerCase();

        if (td.indexOf(text.toLowerCase()) < 0) {
            tr.style.display = 'none';
        } else {
            tr.style.display = '';
        }
    }
}

function openThemNguoiDung() {
    window.alert('Not Available!');
}

// disable user (pause, prevent login)
function voHieuHoaNguoiDung(TrangThai) {
    if (TrangThai == 1)
    {

    }
    var span = inp.parentElement.nextElementSibling;
    span.innerHTML = (inp.checked ? 'Locked' : 'Active');
}

// Delete user
function xoaNguoiDung(mand) { 
    Swal.fire({
        title: "Are you sure you want to delete?",
        type: "question",
        showCancelButton: true,
        cancelButtonText: "Cancel"
    }).then((result)=>{
        if(result.value) {
            $.ajax({
                type: "POST",
                url: "php/xulykhachhang.php",
                dataType: "json",
                // timeout: 1500, // stop after 1.5 seconds with no response => show error
                data: {
                    request: "delete",
                    mand: mand
                },
                success: function(data, status, xhr) {
                    refreshTableKhachHang();
                    //console.log(data);
                },
                error: function(e) {
                    // Swal.fire({
                    //     type: "error",
            //     title: "Error loading customer data (admin.js > refreshTableKhachHang)",
                    //     html: e.responseText
                    // });
                    console.log(e.responseText);
                }
            });
        }
    })
}

// Sort
function sortKhachHangTable(loai) {
    var list = document.getElementsByClassName('khachhang')[0].getElementsByClassName("table-content")[0];
    var tr = list.getElementsByTagName('tr');

    quickSort(tr, 0, tr.length - 1, loai, getValueOfTypeInTable_KhachHang);
    decrease = !decrease;
}

function getValueOfTypeInTable_KhachHang(tr, loai) {
    var td = tr.getElementsByTagName('td');
    switch (loai) {
        case 'stt':
            return Number(td[0].innerHTML);
        case 'hoten':
            return td[1].innerHTML.toLowerCase();
        case 'email':
            return td[2].innerHTML.toLowerCase();
        case 'taikhoan':
            return td[3].innerHTML.toLowerCase();
        case 'matkhau':
            return td[4].innerHTML.toLowerCase();
    }
    return false;
}

// ================== Sort ====================
// https://github.com/HoangTran0410/First_html_css_js/blob/master/sketch.js
var decrease = true; // Sort descending

// type is column name, func is function to get value from column type
function quickSort(arr, left, right, loai, func) {
    var pivot,
        partitionIndex;

    if (left < right) {
        pivot = right;
        partitionIndex = partition(arr, pivot, left, right, loai, func);

        //sort left and right
        quickSort(arr, left, partitionIndex - 1, loai, func);
        quickSort(arr, partitionIndex + 1, right, loai, func);
    }
    return arr;
}

function partition(arr, pivot, left, right, loai, func) {
    var pivotValue = func(arr[pivot], loai),
        partitionIndex = left;

    for (var i = left; i < right; i++) {
        if (decrease && func(arr[i], loai) > pivotValue ||
            !decrease && func(arr[i], loai) < pivotValue) {
            swap(arr, i, partitionIndex);
            partitionIndex++;
        }
    }
    swap(arr, right, partitionIndex);
    return partitionIndex;
}

function swap(arr, i, j) {
    var tempi = arr[i].cloneNode(true);
    var tempj = arr[j].cloneNode(true);
    arr[i].parentNode.replaceChild(tempj, arr[i]);
    arr[j].parentNode.replaceChild(tempi, arr[j]);
}

// ================= additional functions ====================
// Convert promotion to string
function promoToStringValue(pr) {
    switch (pr.name) {
        case 'tragop':
            return 'Installment ' + pr.value + '%';
        case 'giamgia':
            return 'Discount ' + pr.value;
        case 'giareonline':
            return 'Online (' + pr.value + ')';
        case 'moiramat':
            return 'New';
    }
    return '';
}

function progress(percent, bg, width, height) {

    return `<div class="progress" style="width: ` + width + `; height:` + height + `">
                <div class="progress-bar bg-info" style="width: ` + percent + `%; background-color:` + bg + `"></div>
            </div>`
}

// for(var i = 0; i < list_products.length; i++) {
//     list_products[i].masp = list_products[i].company.substring(0, 3) + vitriCompany(list_products[i], i);
// }

// console.log(JSON.stringify(list_products));
