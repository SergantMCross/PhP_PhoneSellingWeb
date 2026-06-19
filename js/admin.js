var TONGTIEN = 0;

window.onload = function() {

    document.getElementById("btnDangXuat").onclick = function() {
        CheckDangXuat(()=>{
            window.location.href = "Login.php"
        });
    }

    GetCurrentUser((user)=>{
        if(user != null) {
            if(user.MaQuyen != 1) {
                AddEventChangeTab();
                AddThongKe();
                OpenTab('Home');
            }
        } else {
            document.body.innerHTML = `<h1 style="color:red; with:100%; text-align:center; margin: 50px;"> Access denied.. </h1>`;
        }
    }, (e)=> {
        document.body.innerHTML = `<h1 style="color:red; with:100%; text-align:center; margin: 50px;"> Access denied.. </h1>`;
    });
}

function RefreshTableSanPham() {
    $.ajax({
        type: "POST",
        url: "php/ProcessProduct.php",
        dataType: "json",
        // timeout: 1500, // stop after 1.5 seconds with no response => show error
        data: {
            request: "getall",
        },
        success: function(data, status, xhr) {
            ListProducts = data; // global variable storing current product array
            AddTableProducts(data);
        },
        error: function(e) {
            Swal.fire({
                type: "error",
                title: "Error loading product data (admin.js > RefreshTableSanPham)",
                html: e.responseText
            });
            console.log(e.responseText)
        }
    });
}

function AddChart(Id, ChartOption) {
    var Ctx = document.getElementById(Id).getContext('2d');
    var chart = new Chart(Ctx, ChartOption);
}

function AddThongKe() {
    var DataChart = {
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
    var BarChart = CopyObject(DataChart);
    BarChart.type = 'bar';
    AddChart('myChart1', BarChart);

    var DoughnutChart = CopyObject(DataChart);
    DoughnutChart.type = 'doughnut';
    AddChart('myChart2', DoughnutChart);

    var PieChart = CopyObject(DataChart);
    PieChart.type = 'pie';
    AddChart('myChart3', PieChart);

    var LineChart = CopyObject(DataChart);
    LineChart.type = 'line';
    AddChart('myChart4', LineChart);
}

function AjaxLoaiSanPham() {
    $.ajax({
        type: "POST",
        url: "php/ProcessProductCategory.php",
        dataType: "json",
        // timeout: 1500, // stop after 1.5 seconds with no response => show error
        data: {
            request: "getall"
        },
        success: function(data, status, xhr) {
            ShowLoaiSanPham(data);
        },
        error: function(e) {

        }
    });
}

function ShowLoaiSanPham(Data) {
    var S="";
    for (var i = 0; i < Data.length; i++) {
            var P = Data[i];
                S +=`<option value="` + P.MaLSP + `">` + P.TenLSP + `</option>`;
        }
    document.getElementsByName("chonCompany")[0].innerHTML = S;
}

function AjaxKhuyenMai() {
    $.ajax({
        type: "POST",
        url: "php/ProcessPromotion.php",
        dataType: "json",
        // timeout: 1500, // stop after 1.5 seconds with no response => show error
        data: {
            request: "getall"
        },
        success: function(data, status, xhr) {
            ShowKhuyenMai(data);
            ShowGTKM(data);
        },
        error: function(e) {

        }
    });
}

function ShowKhuyenMai(Data) {
    var S=`
        <option selected="selected" value="`+Data[0].MaKM+`">None</option>
        <option value="`+Data[1].MaKM+`">Installment</option>
        <option value="`+Data[2].MaKM+`">Discount</option>
        <option value="`+Data[3].MaKM+`">Online Cheap</option>
        <option value="`+Data[4].MaKM+`">New Launch</option>`;
    document.getElementsByName("chonKhuyenMai")[0].innerHTML = S;

}

function ShowGTKM() {
    var GiaTri = document.getElementsByName("chonKhuyenMai")[0].value;
    switch (GiaTri) {
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
function AddEventChangeTab() {
    var Sidebar = document.getElementsByClassName('sidebar')[0];
    var ListA = Sidebar.getElementsByTagName('a');
    for (var a of ListA) {
        if (!a.onclick) {
            a.addEventListener('click', function() {
                TurnOffActive();
                this.classList.add('active');
                var Tab = this.childNodes[1].data.trim()
                OpenTab(Tab);
            })
        }
    }
}

function TurnOffActive() {
    var Sidebar = document.getElementsByClassName('sidebar')[0];
    var ListA = Sidebar.getElementsByTagName('a');
    for (var a of ListA) {
        a.classList.remove('active');
    }
}

function OpenTab(NameTab) {
    // hide all
    var Main = document.getElementsByClassName('main')[0].children;
    for (var e of main) {
        e.style.display = 'none';
    }

    // open tab
    switch (NameTab) {
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
function AddTableProducts(ListProducts) {
    var Tc = document.getElementsByClassName('sanpham')[0].getElementsByClassName('table-content')[0];
    var S = `<table class="table-outline hideImg">`;

    for (var i = 0; i < ListProducts.length; i++) {
        var P = ListProducts[i];
        S += `<tr>
            <td style="width: 5%">` + (i + 1) + `</td>
            <td style="width: 10%">` + P.MaSP + `</td>
            <td style="width: 40%">
                <a title="View details" target="_blank" href="ProductDetail.php?` + P.TenSP.split(' ').join('-') + `">` + P.TenSP + `</a>
                <img src="` + P.HinhAnh + `"></img>
            </td>
            <td style="width: 15%">` + parseInt(P.DonGia).toLocaleString() + `</td>
            <td style="width: 10%">` + /*PromoToStringValue(*/ (p.KM.TenKM) /*)*/ + `</td>
            <td style="width: 10%">` + (p.TrangThai==1?"Visible":"Hidden") + `</td>
            <td style="width: 10%">
                <div class="tooltip">
                    <i class="fa fa-wrench" onclick="AddKhungSuaSanPham('` + P.MaSP + `')"></i>
                    <span class="tooltiptext">Edit</span>
                </div>
                <div class="tooltip">
                    <i class="fa fa-trash" onclick="XoaSanPham('` + P.TrangThai + `', '` + P.MaSP + `', '` + P.TenSP + `')"></i>
                    <span class="tooltiptext">Delete</span>
                </div>
            </td>
        </tr>`;
    }

    S += `</table>`;

    Tc.innerHTML = S;
}

// Search
function TimKiemSanPham(Inp) {
    var KieuTim = document.getElementsByName('kieuTimSanPham')[0].value;
    var Text = Inp.value;

    // Filter
    var VitriKieuTim = {
        'ma': 1,
        'ten': 2
    }; // array storing column positions

    var ListTrTable = document.getElementsByClassName('sanpham')[0].getElementsByClassName('table-content')[0].getElementsByTagName('tr');
    for (var Tr of ListTrTable) {
        var Td = Tr.getElementsByTagName('td')[VitriKieuTim[KieuTim]].innerHTML.toLowerCase();

        if (Td.indexOf(Text.toLowerCase()) < 0) {
            Tr.style.display = 'none';
        } else {
            Tr.style.display = '';
        }
    }
}

// Add
function LayThongTinSanPhamTuTable(Id) {
    var Khung = document.getElementById(Id);
    var Tr = Khung.getElementsByTagName('tr');

    var Masp = Tr[1].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;
    var Name = Tr[2].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;
    var Company = Tr[3].getElementsByTagName('td')[1].getElementsByTagName('select')[0].value;
    var Img =  document.getElementById("hinhanh").value;
    var Price = Tr[5].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;
    var Amount = Tr[6].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;
    var Star = Tr[7].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;
    var RateCount = Tr[8].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;
    var PromoName = Tr[9].getElementsByTagName('td')[1].getElementsByTagName('select')[0].value;
    var PromoValue = Tr[10].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;

    var Screen = Tr[12].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;
    var Os = Tr[13].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;
    var Camara = Tr[14].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;
    var CamaraFront = Tr[15].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;
    var Cpu = Tr[16].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;
    var Ram = Tr[17].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;
    var Rom = Tr[18].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;
    var MicroUSB = Tr[19].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;
    var Battery = Tr[20].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value;

    return {
        "name": Name,
        "img": Img,
        "price": Price,
        "company": Company,
        "amount": Amount,
        "star": Star,
        "rateCount": RateCount,
        "promo": {
            "name": PromoName,
            "value": PromoValue
        },
        "detail": {
            "screen": Screen,
            "os": Os,
            "camara": Camara,
            "camaraFront": CamaraFront,
            "cpu": Cpu,
            "ram": Ram,
            "rom": Rom,
            "microUSB": MicroUSB,
            "battery": Battery
        },
        "masp": Masp,
        "TrangThai": 1
    };
}

function ThemSanPham() {
    var NewSp = LayThongTinSanPhamTuTable('khungThemSanPham');

    //check product name
    var PattCheckTenSP = /([a-z A-Z0-9&():.'_-]{2,})$/;
    if (PattCheckTenSP.test(NewSp.name) == false)
    {
        alert ("Invalid product name");
        return false;
    }

    //check image
    /*var PattCheckHinh= /^([0-9]{1,})[.](png|jpeg|jpg)$/;
    if (PattCheckHinh.test(NewSp.img) == false)
    {
        alert ("Invalid image");
        return false;
    }*/

    //check price
    var PattCheckGia = /^([0-9]){1,}(000)$/;
    if (PattCheckGia.test(NewSp.price) == false)
    {
        alert ("Invalid product price");
        return false;
    }

    //check quantity
    var PattCheckSL = /[0-9]{1,}$/;
    if (PattCheckSL.test(NewSp.amount) == false)
    {
        alert ("Invalid product quantity");
        return false;
    }

    $.ajax({
        type: "POST",
        url: "php/ProcessProduct.php",
        dataType: "json",
        // timeout: 1500, // stop after 1.5 seconds with no response => show error
        data: {
            request: "add",
            dataAdd: NewSp
        },
        success: function(data, status, xhr) {
            Swal.fire({
                type: 'success',
                title: 'Add successful'
            })
            ResetForm();
            document.getElementById('khungThemSanPham').style.transform = 'scale(0)';
            RefreshTableSanPham();
        },
        error: function(e) {
            Swal.fire({
                type: "error",
                title: "Add error",
                html: e.responseText
            });
        }
    });

    

    alert('Product "' + NewSp.name + '" added successfully.');
    RefreshTableSanPham();

}
function ResetForm() {
    var Khung = document.getElementById('khungThemSanPham');
    var Tr = Khung.getElementsByTagName('tr');

    Tr[2].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value = "";
    Tr[4].getElementsByTagName('td')[1].getElementsByTagName('img')[0].src = "";
    Tr[5].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value = "";
    Tr[6].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value = "0";

    Tr[12].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value ="";
    Tr[13].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value ="";
    Tr[14].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value ="";
    Tr[15].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value ="";
    Tr[16].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value ="";
    Tr[17].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value ="";
    Tr[18].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value ="";
    Tr[19].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value ="";
    Tr[20].getElementsByTagName('td')[1].getElementsByTagName('input')[0].value ="";
}

function AutoMaSanPham(Company) {
    // auto generate code for new product
    var AutoMaSP = ListProducts[ListProducts.length-1].MaSP;
    document.getElementById('maspThem').value = parseInt(AutoMaSP)+1;
}

// Delete
function XoaSanPham(Trangthai, Masp, Tensp) {
    if (Trangthai == 1)
    {
        // alert ("Product is still being sold");
        Swal.fire({
            type: 'warning',
            title: 'Do you want to hide ' + Tensp + '?',
            showCancelButton: true
        }).then((result) => {
            if(result.value) {
                $.ajax({
                    type: "POST",
                    url: "php/ProcessProduct.php",
                    dataType: "json",
                    // timeout: 1500, // stop after 1.5 seconds with no response => show error
                    data: {
                        request: "hide",
                        id: Masp,
                        trangthai: 0
                    },
                    success: function(data, status, xhr) {
                        Swal.fire({
                            type: 'success',
                            title: 'Hide successful'
                        })
                        RefreshTableSanPham();
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
                url: "php/ProcessProduct.php",
                dataType: "json",
                // timeout: 1500, // stop after 1.5 seconds with no response => show error
                data: {
                    request: "delete",
                    maspdelete: Masp
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
            RefreshTableSanPham();
        }
    }
}

// Edit
function SuaSanPham(Masp) {
    var Sp = LayThongTinSanPhamTuTable('khungSuaSanPham');
    console.log(Sp);
    return false;
}

function AddKhungSuaSanPham(MaSp) {
    var Sp;
    for (var p of ListProducts) {
        if (p.MaSP == MaSp) {
            Sp = p;
        }
    }

    var S = `<span class="close" onclick="this.parentElement.style.transform = 'scale(0)';">&times;</span>
    <form method="post" action="" enctype="multipart/form-data" onsubmit="return SuaSanPham('` + Sp.MaSP + `')">
        <table class="overlayTable table-outline table-content table-header">
            <tr>
                <th colspan="2">` + Sp.TenSP + `</th>
            </tr>
            <tr>
                <td>Product code:</td>
                <td><input disabled="disabled" type="text" id="maspSua" name="maspSua" value="` + Sp.MaSP + `"></td>
            </tr>
            <tr>
                <td>Product name:</td>
                <td><input type="text" value="` + Sp.TenSP + `"></td>
            </tr>
            <tr>
                <td>Brand:</td>
                <td>
                    <select name="chonCompany" onchange="AutoMaSanPham(this.value)">`

                    var Company = ["Apple", "Coolpad", "HTC", "Itel", "Mobell", "Vivo", "Oppo", "SamSung", "Phillips", "Nokia", "Motorola", "Motorola", "Xiaomi"];
                    var I = 1;
                    for (var C of Company) {
                        var Masp = I++;
                        if (Sp.MaLSP == Masp)
                            S += (`<option value="` + Sp.MaLSP + `" selected="selected">` + C + `</option>`);
                        else S += (`<option value="` + Masp + `">` + C + `</option>`);
                    }
                    S+=`</select>
                </td>
            </tr>
            <?php
                            $TenFileMoi= "";
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
                                            /*$Tmp = explode(".", $_FILES["hinhanh"]["name"]);
                                            $DuoiFile = end($Tmp);
                                            $MaSp = $_POST['maspThem'];
                                            $TenFileMoi = $MaSp . "." . $DuoiFile;*/
                                            $File = $_FILES["hinhanh"]["name"];
                                            $TenFileMoi = "img/products/" .$_FILES["hinhanh"]["name"];
                                            move_uploaded_file( $_FILES["hinhanh"]["tmp_name"], $TenFileMoi);
                                        }
                                    }
                                }
                        // require_once ("php/UploadFile.php");
                        ?>
            <tr>
                            <td>Image:</td>
                            <td>
                                <img class="hinhDaiDien" id="anhDaiDienSanPhamThem" src="">
                                <input type="file" name="hinhanh" onchange="CapNhatAnhSanPham(this.files, 'anhDaiDienSanPhamThem', '<?php echo $TenFileMoi; ?>')">
                                <input style="display: none;" type="text" id="hinhanh" value="">
                            </td>
                        </tr>
            <tr>
                <td>Price:</td>
                <td><input type="text" value="` + Sp.DonGia + `"></td>
            </tr>
            <tr>
                <td>Stars:</td>
                <td><input type="text" value="` + Sp.SoSao + `"></td>
            </tr>
            <tr>
                <td>Rating:</td>
                <td><input type="text" value="` + Sp.SoDanhGia + `"></td>
            </tr>
            <tr>
                <td>Promotion:</td>
                <td>
                    <select name="chonKhuyenMai" onchange="ShowGTKM()">`
                            var i = 1;
                            S += (`<option selected="selected" value="` + i++ + `">None</option>`);
                            S += (`<option value="` + i++ + `">Discount</option>`);
                            S += (`<option value="` + i++ + `">Online Cheap</option>`);
                            S += (`<option value="` + i++ + `">Installment</option>`);
                            S += (`<option value="` + i++ + `">New Launch</option>`);
                        S+=`</script>
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
                <td><input type="text" value="` + Sp.ManHinh + `"></td>
            </tr>
            <tr>
                <td>Operating System:</td>
                <td><input type="text" value="` + Sp.HDH + `"></td>
            </tr>
            <tr>
                <td>Rear Camera:</td>
                <td><input type="text" value="` + Sp.CamSau + `"></td>
            </tr>
            <tr>
                <td>Front Camera:</td>
                <td><input type="text" value="` + Sp.CamTruoc + `"></td>
            </tr>
            <tr>
                <td>CPU:</td>
                <td><input type="text" value="` + Sp.CPU + `"></td>
            </tr>
            <tr>
                <td>RAM:</td>
                <td><input type="text" value="` + Sp.Ram + `"></td>
            </tr>
            <tr>
                <td>Internal Storage:</td>
                <td><input type="text" value="` + Sp.Rom + `"></td>
            </tr>
            <tr>
                <td>Memory Card:</td>
                <td><input type="text" value="` + Sp.SDCard + `"></td>
            </tr>
            <tr>
                <td>Battery Capacity:</td>
                <td><input type="text" value="` + Sp.Pin + `"></td>
            </tr>
            <tr>
                <td colspan="2"  class="table-footer"> <button name="submit">SỬA</button> </td>
            </tr>
        </table>`

    var Khung = document.getElementById('khungSuaSanPham');
    Khung.innerHTML = S;
    Khung.style.transform = 'scale(1)';
}

// Update product image
function CapNhatAnhSanPham(Files, Id, Anh) {
    var Url = '';
    if (Files.length) Url = window.URL.createObjectURL(Files[0]);

    document.getElementById(Id).src = Url;
    document.getElementById('hinhanh').value = Anh;
}

// Sort products
function SortProductsTable(Loai) {
    var List = document.getElementsByClassName('sanpham')[0].getElementsByClassName("table-content")[0];
    var Tr = List.getElementsByTagName('tr');

    QuickSort(Tr, 0, Tr.length - 1, Loai, GetValueOfTypeInTableSanPham); // type allows sorting by code, name, price, etc. 
    Decrease = !Decrease;
}

// Get value of a specific data type (column) in the table
function GetValueOfTypeInTableSanPham(Tr, Loai) {
    var Td = Tr.getElementsByTagName('td');
    switch (Loai) {
        case 'stt':
            return Number(Td[0].innerHTML);
        case 'masp':
            return Number(Td[1].innerHTML);
        case 'ten':
            return Td[2].innerHTML.toLowerCase();
        case 'gia':
            return StringToNum(Td[3].innerHTML);
        case 'khuyenmai':
            return Td[4].innerHTML.toLowerCase();
    }
    return false;
}

// ========================= Orders ===========================
// Draw table

function RefreshTableDonHang() {
    $.ajax({
        type: "POST",
        url: "php/ProcessOrder.php",
        dataType: "json",
        // timeout: 1500, // stop after 1.5 seconds with no response => show error
        data: {
            request: "getall",
        },
        success: function(data, status, xhr) {
            AddTableDonHang(data);
            console.log(data);
        },
        error: function(e) {
            Swal.fire({
                type: "error",
                title: "Error loading customer data (admin.js > RefreshTableKhachHang)",
                html: e.responseText
            });
        }
    });
}
function AddTableDonHang(Data) {
    var Tc = document.getElementsByClassName('donhang')[0].getElementsByClassName('table-content')[0];
    var S = `<table class="table-outline hideImg">`;

    TONGTIEN = 0;
    for (var i = 0; i < Data.length; i++) {
        var D = Data[i];
        S += `<tr>
            <td style="width: 5%">` + (i + 1) + `</td>
            <td style="width: 13%">` + D.MaHD + `</td>
            <td style="width: 7%">` + D.MaND + `</td>
            <td style="width: 20%">` + /*D.sp*/ + `</td>
            <td style="width: 15%">` + D.TongTien + `</td>
            <td style="width: 10%">` + D.NgayLap + `</td>
            <td style="width: 10%">` + D.TinhTrang + `</td>
            <td style="width: 10%">
                <div class="tooltip">
                    <i class="fa fa-check" onclick="Duyet('` + D.MaHD + `', true)"></i>
                    <span class="tooltiptext">Approve</span>
                </div>
                <div class="tooltip">
                    <i class="fa fa-remove" onclick="Duyet('` + D.MaHD + `', false)"></i>
                    <span class="tooltiptext">Cancel</span>
                </div>
                
            </td>
        </tr>`;
        TONGTIEN += StringToNum(D.tongtien);
    }

    S += `</table>`;
    Tc.innerHTML = S;
}

function GetListDonHang() {
    var U = getListUser();
    var Result = [];
    for (var i = 0; i < U.length; i++) {
        for (var j = 0; j < U[i].donhang.length; j++) {
            // Total amount
            var Tongtien = 0;
            for (var S of U[i].donhang[j].sp) {
                var Timsp = timKiemTheoMa(ListProducts, S.ma);
                if (Timsp.MaKM.name == 'giareonline') Tongtien += StringToNum(Timsp.MaKM.value);
                else Tongtien += StringToNum(Timsp.DonGia);
            }

            // Date time
            var X = new Date(U[i].donhang[j].ngaymua).toLocaleString();

            // Products
            var Sps = '';
            for (var S of U[i].donhang[j].sp) {
                Sps += `<p style="text-align: right">` + (timKiemTheoMa(ListProducts, S.ma).name + ' [' + S.soluong + ']') + `</p>`;
            }

            // Save to result
            Result.push({
                "ma": U[i].donhang[j].ngaymua.toString(),
                "khach": U[i].username,
                "sp": Sps,
                "tongtien": NumToString(Tongtien),
                "ngaygio": X,
                "tinhTrang": U[i].donhang[j].tinhTrang
            });
        }
    }
    return Result;
}

// Approve
function Duyet(MaDonHang, DuyetDon) {
    var U = getListUser();
    for (var i = 0; i < U.length; i++) {
        for (var j = 0; j < U[i].donhang.length; j++) {
            if (U[i].donhang[j].ngaymua == MaDonHang) {
                if (DuyetDon) {
                    if (U[i].donhang[j].tinhTrang == 'Pending') {
                        U[i].donhang[j].tinhTrang = 'Delivered';

                    } else if (U[i].donhang[j].tinhTrang == 'Cancelled') {
                        alert('Cannot approve cancelled order !');
                        return;
                    }
                } else {
                    if (U[i].donhang[j].tinhTrang == 'Pending') {
                        if (window.confirm('Are you sure you want to cancel this order. This action cannot be undone !'))
                            U[i].donhang[j].tinhTrang = 'Cancelled';

                    } else if (U[i].donhang[j].tinhTrang == 'Delivered') {
                        alert('Cannot cancel delivered order !');
                        return;
                    }
                }
                break;
            }
        }
    }

    // save
    setListUser(U);

    // redraw
    AddTableDonHang();
}

function LocDonHangTheoKhoangNgay() {
    var From = document.getElementById('fromDate').valueAsDate;
    var To = document.getElementById('toDate').valueAsDate;

    var ListTrTable = document.getElementsByClassName('donhang')[0].getElementsByClassName('table-content')[0].getElementsByTagName('tr');
    for (var Tr of ListTrTable) {
        var Td = Tr.getElementsByTagName('td')[5].innerHTML;
        var D = new Date(Td);

        if (D >= From && D <= To) {
            Tr.style.display = '';
        } else {
            Tr.style.display = 'none';
        }
    }
}

function TimKiemDonHang(Inp) {
    var KieuTim = document.getElementsByName('kieuTimDonHang')[0].value;
    var Text = Inp.value;

    // Filter
    var VitriKieuTim = {
        'ma': 1,
        'khachhang': 2,
        'trangThai': 6
    };

    var ListTrTable = document.getElementsByClassName('donhang')[0].getElementsByClassName('table-content')[0].getElementsByTagName('tr');
    for (var Tr of ListTrTable) {
        var Td = Tr.getElementsByTagName('td')[VitriKieuTim[KieuTim]].innerHTML.toLowerCase();

        if (Td.indexOf(Text.toLowerCase()) < 0) {
            Tr.style.display = 'none';
        } else {
            Tr.style.display = '';
        }
    }
}

// Sort
function SortDonHangTable(Loai) {
    var List = document.getElementsByClassName('donhang')[0].getElementsByClassName("table-content")[0];
    var Tr = List.getElementsByTagName('tr');

    QuickSort(Tr, 0, Tr.length - 1, Loai, GetValueOfTypeInTableDonHang);
    Decrease = !Decrease;
}

// Get value of a specific data type (column) in the table
function GetValueOfTypeInTableDonHang(Tr, Loai) {
    var Td = Tr.getElementsByTagName('td');
    switch (Loai) {
        case 'stt':
            return Number(Td[0].innerHTML);
        case 'ma':
            return new Date(Td[1].innerHTML); // convert to date format for date comparison
        case 'khach':
            return Td[2].innerHTML.toLowerCase(); // get customer name
        case 'sanpham':
            return Td[3].children.length; // get number of items in this order, length here is number of <p> tags
        case 'tongtien':
            return StringToNum(Td[4].innerHTML); // return as price format
        case 'ngaygio':
            return new Date(Td[5].innerHTML); // convert to date
        case 'trangthai':
            return Td[6].innerHTML.toLowerCase(); //
    }
    return false;
}

// ====================== Customers =============================
// Draw table
function RefreshTableKhachHang() {
    $.ajax({
        type: "POST",
        url: "php/ProcessCustomer.php",
        dataType: "json",
        // timeout: 1500, // stop after 1.5 seconds with no response => show error
        data: {
            request: "getall",
        },
        success: function(data, status, xhr) {
            AddTableKhachHang(data);
            //console.log(data);
        },
        error: function(e) {
            Swal.fire({
                type: "error",
                title: "Error loading customer data (admin.js > RefreshTableKhachHang)",
                html: e.responseText
            });
        }
    });
}

function ThayDoiTrangThaiND(Inp, Mand) {
    var Trangthai = (Inp.checked?1:0);  
    $.ajax({
        type: "POST",
        url: "php/ProcessCustomer.php",
        dataType: "json",
        // timeout: 1500, // stop after 1.5 seconds with no response => show error
        data: {
            request: "changeTT",
            key: Mand,
            trangThai: Trangthai
        },
        success: function(data, status, xhr) {
            //ListProducts = data; // global variable storing current product array
            // RefreshTableKhachHang();
            //console.log(data);
        },
        error: function(e) {
            // Swal.fire({
            //     type: "error",
            //     title: "Error loading customer data (admin.js > RefreshTableKhachHang)",
            //     html: e.responseText
            // });
            console.log(e.responseText);
        }
    });
}


function AddTableKhachHang(Data) {
    var Tc = document.getElementsByClassName('khachhang')[0].getElementsByClassName('table-content')[0];
    var S = `<table class="table-outline hideImg">`;


    for (var i = 0; i < Data.length; i++) {
        var U = Data[i];
        console.log(U.TrangThai)

        S += `<tr>
            <td >` + (i + 1) + `</td>
            <td >` + U.Ho + ' ' + U.Ten + `</td>
            <td >` + U.Email + `</td>
            <td >` + U.TaiKhoan + `</td>           
            <td >
                <div class="tooltip">
                    <label class="switch">
                        <input type="checkbox" `+(U.TrangThai==1?"checked":"")+` onclick="ThayDoiTrangThaiND(this, '`+U.MaND+`')">
                        <span class="slider round"></span>
                    </label>
                    <span class="tooltiptext">` + (U.TrangThai ?    'Active' : 'Locked') + `</span>
                </div>
                <div class="tooltip">
                    <i class="fa fa-remove" onclick="XoaNguoiDung('` + U.MaND + `')"></i>
                    <span class="tooltiptext">Delete</span>
                </div>
            </td>
        </tr>`;
    }

    S += `</table>`;
    Tc.innerHTML = S;
}

// Search
function TimKiemNguoiDung(Inp) {
    var KieuTim = document.getElementsByName('kieuTimKhachHang')[0].value;
    var Text = Inp.value;

    // Filter
    var VitriKieuTim = {
        'ten': 1,
        'email': 2,
        'taikhoan': 3
    };

    var ListTrTable = document.getElementsByClassName('khachhang')[0].getElementsByClassName('table-content')[0].getElementsByTagName('tr');
    for (var Tr of ListTrTable) {
        var Td = Tr.getElementsByTagName('td')[VitriKieuTim[KieuTim]].innerHTML.toLowerCase();

        if (Td.indexOf(Text.toLowerCase()) < 0) {
            Tr.style.display = 'none';
        } else {
            Tr.style.display = '';
        }
    }
}

function OpenThemNguoiDung() {
    window.alert('Not Available!');
}

// disable user (pause, prevent login)
function VoHieuHoaNguoiDung(TrangThai) {
    if (TrangThai == 1)
    {

    }
    var Span = inp.parentElement.nextElementSibling;
    Span.innerHTML = (inp.checked ? 'Locked' : 'Active');
}

// Delete user
function XoaNguoiDung(Mand) { 
    Swal.fire({
        title: "Are you sure you want to delete?",
        type: "question",
        showCancelButton: true,
        cancelButtonText: "Cancel"
    }).then((result)=>{
        if(result.value) {
            $.ajax({
                type: "POST",
                url: "php/ProcessCustomer.php",
                dataType: "json",
                // timeout: 1500, // stop after 1.5 seconds with no response => show error
                data: {
                    request: "delete",
                    mand: Mand
                },
                success: function(data, status, xhr) {
                    RefreshTableKhachHang();
                    //console.log(data);
                },
                error: function(e) {
                    // Swal.fire({
                    //     type: "error",
            //     title: "Error loading customer data (admin.js > RefreshTableKhachHang)",
                    //     html: e.responseText
                    // });
                    console.log(e.responseText);
                }
            });
        }
    })
}

// Sort
function SortKhachHangTable(Loai) {
    var List = document.getElementsByClassName('khachhang')[0].getElementsByClassName("table-content")[0];
    var Tr = List.getElementsByTagName('tr');

    QuickSort(Tr, 0, Tr.length - 1, Loai, GetValueOfTypeInTableKhachHang);
    Decrease = !Decrease;
}

function GetValueOfTypeInTableKhachHang(Tr, Loai) {
    var Td = Tr.getElementsByTagName('td');
    switch (Loai) {
        case 'stt':
            return Number(Td[0].innerHTML);
        case 'hoten':
            return Td[1].innerHTML.toLowerCase();
        case 'email':
            return Td[2].innerHTML.toLowerCase();
        case 'taikhoan':
            return Td[3].innerHTML.toLowerCase();
        case 'matkhau':
            return Td[4].innerHTML.toLowerCase();
    }
    return false;
}

// ================== Sort ====================
// https://github.com/HoangTran0410/First_html_css_js/blob/master/sketch.js
var Decrease = true; // Sort descending

// type is column name, func is function to get value from column type
function QuickSort(Arr, Left, Right, Loai, Func) {
    var Pivot,
        PartitionIndex;

    if (Left < Right) {
        Pivot = Right;
        PartitionIndex = Partition(Arr, Pivot, Left, Right, Loai, Func);

        //sort left and right
        QuickSort(Arr, Left, PartitionIndex - 1, Loai, Func);
        QuickSort(Arr, PartitionIndex + 1, Right, Loai, Func);
    }
    return Arr;
}

function Partition(Arr, Pivot, Left, Right, Loai, Func) {
    var PivotValue = Func(Arr[Pivot], Loai),
        PartitionIndex = Left;

    for (var i = Left; i < Right; i++) {
        if (decrease && Func(Arr[i], Loai) > PivotValue ||
            !decrease && Func(Arr[i], Loai) < PivotValue) {
            Swap(Arr, i, PartitionIndex);
            PartitionIndex++;
        }
    }
    Swap(Arr, Right, PartitionIndex);
    return PartitionIndex;
}

function Swap(Arr, I, J) {
    var Tempi = Arr[I].cloneNode(true);
    var Tempj = Arr[J].cloneNode(true);
    Arr[I].parentNode.replaceChild(Tempj, Arr[I]);
    Arr[J].parentNode.replaceChild(Tempi, Arr[J]);
}

// ================= additional functions ====================
// Convert promotion to string
function PromoToStringValue(Pr) {
    switch (Pr.name) {
        case 'tragop':
            return 'Installment ' + Pr.value + '%';
        case 'giamgia':
            return 'Discount ' + Pr.value;
        case 'giareonline':
            return 'Online (' + Pr.value + ')';
        case 'moiramat':
            return 'New';
    }
    return '';
}

function Progress(Percent, Bg, Width, Height) {

    return `<div class="Progress" style="width: ` + Width + `; height:` + Height + `">
                <div class="Progress-bar bg-info" style="width: ` + Percent + `%; background-color:` + Bg + `"></div>
            </div>`
}

// for(var i = 0; i < ListProducts.length; i++) {
//     ListProducts[i].masp = ListProducts[i].company.substring(0, 3) + vitriCompany(ListProducts[i], i);
// }

// console.log(JSON.stringify(ListProducts));
