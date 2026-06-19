var CurrentUser;
var TongTienTatCaDonHang = 0; // store total amount from all purchased orders
var TongSanPhamTatCaDonHang = 0;

window.onload = function () {
    KhoiTao();

    // add tags (keywords) to search box
    var Tags = ["Samsung", "iPhone", "Huawei", "Oppo", "Mobi"];
    for (var t of Tags) AddTags(t, "index.php?search=" + t);

    GetCurrentUser((data) => {
        if(data) {

            $.ajax({
                type: "GET",
                url: "php/OrderTable.php",
                success: function(data) {
                    $(".listDonHang").html(data);
                },
                error: function(e) {
                    console.log(e.responseText);
                }
            })

        } else {
            var Warning = `<h2 style="color: red; font-weight:bold; text-align:center; font-size: 2em; padding: 50px;">
                            You are not logged in!!
                        </h2>`;
            document.getElementsByClassName('infoUser')[0].innerHTML = warning;
        }

    }, (e)=> {
        console.log(e.responseText);
    })
}

function XemChiTiet(Mahd) {
    $.ajax({
        type: "GET",
        url: "php/OrderDetailTable.php",
        data: {
            mahd: Mahd
        },
        success: function(data) {
            $("#chitietdonhang").html(data);
        },
        error: function(e) {
            console.log(e.responseText);
        }
    });
}

// User information section
function AddInfoUser(User) {
    if (!User) return;
    document.getElementsByClassName('infoUser')[0].innerHTML = `
    <hr>
    <table>
        <tr>
            <th colspan="3">CUSTOMER INFORMATION</th>
        </tr>
        <tr>
            <td>Username: </td>
            <td> <input type="text" value="` + User.username + `" readonly> </td>
            <td> <i class="fa fa-pencil" onclick="ChangeInfo(this, 'username')"></i> </td>
        </tr>
        <tr>
            <td>Password: </td>
            <td style="text-align: center;"> 
                <i class="fa fa-pencil" id="butDoiMatKhau" onclick="OpenChangePass()"> Change password</i> 
            </td>
            <td></td>
        </tr>
        <tr>
            <td colspan="3" id="khungDoiMatKhau">
                <table>
                    <tr>
                        <td> <div>Old password:</div> </td>
                        <td> <div><input type="password"></div> </td>
                    </tr>
                    <tr>
                        <td> <div>New password:</div> </td>
                        <td> <div><input type="password"></div> </td>
                    </tr>
                    <tr>
                        <td> <div>Confirm password:</div> </td>
                        <td> <div><input type="password"></div> </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td> 
                            <div><button onclick="ChangePass()">Confirm</button></div> 
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td>Last name: </td>
            <td> <input type="text" value="` + User.ho + `" readonly> </td>
            <td> <i class="fa fa-pencil" onclick="ChangeInfo(this, 'ho')"></i> </td>
        </tr>
        <tr>
            <td>First name: </td>
            <td> <input type="text" value="` + User.ten + `" readonly> </td>
            <td> <i class="fa fa-pencil" onclick="ChangeInfo(this, 'ten')"></i> </td>
        </tr>
        <tr>
            <td>Email: </td>
            <td> <input type="text" value="` + User.email + `" readonly> </td>
            <td> <i class="fa fa-pencil" onclick="ChangeInfo(this, 'email')"></i> </td>
        </tr>
        <tr>
            <td colspan="3" style="padding:5px; border-top: 2px solid #ccc;"></td>
        </tr>
        <tr>
            <td>Total spent: </td>
            <td> <input type="text" value="` + NumToString(TongTienTatCaDonHang) + `₫" readonly> </td>
            <td></td>
        </tr>
        <tr>
            <td>Products purchased: </td>
            <td> <input type="text" value="` + TongSanPhamTatCaDonHang + `" readonly> </td>
            <td></td>
        </tr>
    </table>`;
}

function OpenChangePass() {
    var KhungChangePass = document.getElementById('khungDoiMatKhau');
    var Actived = KhungChangePass.classList.contains('active');
    if (Actived) KhungChangePass.classList.remove('active');
    else KhungChangePass.classList.add('active');
}

function ChangePass() {
    var KhungChangePass = document.getElementById('khungDoiMatKhau');
    var Inps = KhungChangePass.getElementsByTagName('input');
    if (Inps[0].value != CurrentUser.pass) {
        Swal.fire({
            type: 'error',
            title: 'Wrong password'
        }).then((result) => {
            Inps[0].focus();
        });
        return;
    }
    if (Inps[1] == '') {
        Swal.fire({
            type: 'error',
            title: 'New password not entered!'
        })
        Inps[1].focus();
    }
    if (Inps[1].value != Inps[2].value) {
        Swal.fire({
            type: 'error',
            title: 'Passwords do not match'
        }).then((result) => {
            Inps[2].focus();
        });
        return;
    }

    var Temp = CopyObject(CurrentUser);
    CurrentUser.pass = Inps[1].value;

    // update product list in localstorage
    SetCurrentUser(CurrentUser);
    UpdateListUser(Temp, CurrentUser);

    // Update on header
    CapNhatThongTinCurrentUser();

    // notification
    Swal.fire({
        type: 'success',
        title: 'Done',
        text: 'Password changed successfully.'
    }).then((result) => {
        Inps[0].value = Inps[1].value = Inps[2].value = "";
        OpenChangePass();    
    });
    // addAlertBox('Password changed successfully.', '#5f5', '#000', 4000);
}

function ChangeInfo(ITag, Info) {
    var Inp = ITag.parentElement.previousElementSibling.getElementsByTagName('input')[0];

    // Currently showing
    if (!Inp.readOnly && Inp.value != '') {

        if (Info == 'username') {
            var Users = getListUser();
            for (var U of Users) {
                if (U.username == Inp.value && U.username != CurrentUser.username) {
                    alert('Username already taken!!');
                    Inp.value = CurrentUser.username;
                    return;
                }
            }
            // Change name in order list
            if (!CurrentUser.donhang.length) {
                document.getElementsByClassName('listDonHang')[0].innerHTML = `
                    <h3 style="width=100%; padding: 50px; color: green; font-size: 2em; text-align: center"> 
                        Hello ` + Inp.value + `. You have no orders yet.
                    </h3>`;
            }


        } else if (Info == 'email') {
            var Users = getListUser();
            for (var U of Users) {
                if (U.email == Inp.value && U.username != CurrentUser.username) {
                    alert('Email already in use!!');
                    Inp.value = CurrentUser.email;
                    return;
                }
            }
        }

        var Temp = CopyObject(CurrentUser);
        CurrentUser[Info] = Inp.value;

        // update product list in localstorage
        SetCurrentUser(CurrentUser);
        UpdateListUser(Temp, CurrentUser);

        // Update on header
        CapNhatThongTinCurrentUser();

        ITag.innerHTML = '';

    } else {
        ITag.innerHTML = 'Confirm';
        Inp.focus();
        var V = Inp.value;
        Inp.value = '';
        Inp.value = V;
    }

    Inp.readOnly = !Inp.readOnly;
}


// Order information section
function AddTatCaDonHang(User) {
    if (!User) {
        document.getElementsByClassName('listDonHang')[0].innerHTML = `
            <h3 style="width=100%; padding: 50px; color: red; font-size: 2em; text-align: center"> 
                You are not logged in!!
            </h3>`;
        return;
    }
    if (!User.donhang.length) {
        document.getElementsByClassName('listDonHang')[0].innerHTML = `
            <h3 style="width=100%; padding: 50px; color: green; font-size: 2em; text-align: center"> 
                Hello ` + CurrentUser.username + `. You have no orders yet.
            </h3>`;
        return;
    }
    for (var Dh of User.donhang) {
        AddDonHang(Dh);
    }
}

function AddDonHang(Dh) {
    var Div = document.getElementsByClassName('listDonHang')[0];

    var S = `
            <table class="listSanPham">
                <tr> 
                    <th colspan="6">
                        <h3 style="text-align:center;"> Order date: ` + new Date(Dh.ngaymua).toLocaleString() + `</h3> 
                    </th>
                </tr>
                <tr>
                    <th>No.</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>Added to cart</th> 
                </tr>`;

    var TotalPrice = 0;
    for (var i = 0; i < Dh.sp.length; i++) {
        var Masp = Dh.sp[i].ma;
        var SoluongSp = Dh.sp[i].soluong;
        var P = timKiemTheoMa(ListProducts, Masp);
        var Price = (P.promo.name == 'giareonline' ? P.promo.value : P.price);
        var Thoigian = new Date(Dh.sp[i].date).toLocaleString();
        var Thanhtien = StringToNum(Price) * SoluongSp;

        S += `
                <tr>
                    <td>` + (i + 1) + `</td>
                    <td class="noPadding imgHide">
                        <a target="_blank" href="ProductDetail.php?` + P.name.split(' ').join('-') + `" title="View details">
                            ` + P.name + `
                            <img src="` + P.img + `">
                        </a>
                    </td>
                    <td class="alignRight">` + Price + ` ₫</td>
                    <td class="soluong" >
                         ` + SoluongSp + `
                    </td>
                    <td class="alignRight">` + NumToString(Thanhtien) + ` ₫</td>
                    <td style="text-align: center" >` + Thoigian + `</td>
                </tr>
            `;
        TotalPrice += Thanhtien;
        TongSanPhamTatCaDonHang += SoluongSp;
    }
    TongTienTatCaDonHang += TotalPrice;

    S += `
                <tr style="font-weight:bold; text-align:center; height: 4em;">
                    <td colspan="4">TOTAL: </td>
                    <td class="alignRight">` + NumToString(TotalPrice) + ` ₫</td>
                    <td > ` + Dh.tinhTrang + ` </td>
                </tr>
            </table>
            <hr>
        `;
    Div.innerHTML += S;
}