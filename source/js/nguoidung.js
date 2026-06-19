var currentUser;
var tongTienTatCaDonHang = 0; // store total amount from all purchased orders
var tongSanPhamTatCaDonHang = 0;

window.onload = function () {
    khoiTao();

    // add tags (keywords) to search box
    var tags = ["Samsung", "iPhone", "Huawei", "Oppo", "Mobi"];
    for (var t of tags) addTags(t, "index.php?search=" + t);

    getCurrentUser((data) => {
        if(data) {

            $.ajax({
                type: "GET",
                url: "php/tabledonhang.php",
                success: function(data) {
                    $(".listDonHang").html(data);
                },
                error: function(e) {
                    console.log(e.responseText);
                }
            })

        } else {
            var warning = `<h2 style="color: red; font-weight:bold; text-align:center; font-size: 2em; padding: 50px;">
                            You are not logged in!!
                        </h2>`;
            document.getElementsByClassName('infoUser')[0].innerHTML = warning;
        }

    }, (e)=> {
        console.log(e.responseText);
    })
}

function xemChiTiet(mahd) {
    $.ajax({
        type: "GET",
        url: "php/tablechitietdonhang.php",
        data: {
            mahd: mahd
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
function addInfoUser(user) {
    if (!user) return;
    document.getElementsByClassName('infoUser')[0].innerHTML = `
    <hr>
    <table>
        <tr>
            <th colspan="3">CUSTOMER INFORMATION</th>
        </tr>
        <tr>
            <td>Username: </td>
            <td> <input type="text" value="` + user.username + `" readonly> </td>
            <td> <i class="fa fa-pencil" onclick="changeInfo(this, 'username')"></i> </td>
        </tr>
        <tr>
            <td>Password: </td>
            <td style="text-align: center;"> 
                <i class="fa fa-pencil" id="butDoiMatKhau" onclick="openChangePass()"> Change password</i> 
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
                            <div><button onclick="changePass()">Confirm</button></div> 
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td>Last name: </td>
            <td> <input type="text" value="` + user.ho + `" readonly> </td>
            <td> <i class="fa fa-pencil" onclick="changeInfo(this, 'ho')"></i> </td>
        </tr>
        <tr>
            <td>First name: </td>
            <td> <input type="text" value="` + user.ten + `" readonly> </td>
            <td> <i class="fa fa-pencil" onclick="changeInfo(this, 'ten')"></i> </td>
        </tr>
        <tr>
            <td>Email: </td>
            <td> <input type="text" value="` + user.email + `" readonly> </td>
            <td> <i class="fa fa-pencil" onclick="changeInfo(this, 'email')"></i> </td>
        </tr>
        <tr>
            <td colspan="3" style="padding:5px; border-top: 2px solid #ccc;"></td>
        </tr>
        <tr>
            <td>Total spent: </td>
            <td> <input type="text" value="` + numToString(tongTienTatCaDonHang) + `₫" readonly> </td>
            <td></td>
        </tr>
        <tr>
            <td>Products purchased: </td>
            <td> <input type="text" value="` + tongSanPhamTatCaDonHang + `" readonly> </td>
            <td></td>
        </tr>
    </table>`;
}

function openChangePass() {
    var khungChangePass = document.getElementById('khungDoiMatKhau');
    var actived = khungChangePass.classList.contains('active');
    if (actived) khungChangePass.classList.remove('active');
    else khungChangePass.classList.add('active');
}

function changePass() {
    var khungChangePass = document.getElementById('khungDoiMatKhau');
    var inps = khungChangePass.getElementsByTagName('input');
    if (inps[0].value != currentUser.pass) {
        Swal.fire({
            type: 'error',
            title: 'Wrong password'
        }).then((result) => {
            inps[0].focus();
        });
        return;
    }
    if (inps[1] == '') {
        Swal.fire({
            type: 'error',
            title: 'New password not entered!'
        })
        inps[1].focus();
    }
    if (inps[1].value != inps[2].value) {
        Swal.fire({
            type: 'error',
            title: 'Passwords do not match'
        }).then((result) => {
            inps[2].focus();
        });
        return;
    }

    var temp = copyObject(currentUser);
    currentUser.pass = inps[1].value;

    // update product list in localstorage
    setCurrentUser(currentUser);
    updateListUser(temp, currentUser);

    // Update on header
    capNhat_ThongTin_CurrentUser();

    // notification
    Swal.fire({
        type: 'success',
        title: 'Done',
        text: 'Password changed successfully.'
    }).then((result) => {
        inps[0].value = inps[1].value = inps[2].value = "";
        openChangePass();    
    });
    // addAlertBox('Password changed successfully.', '#5f5', '#000', 4000);
}

function changeInfo(iTag, info) {
    var inp = iTag.parentElement.previousElementSibling.getElementsByTagName('input')[0];

    // Currently showing
    if (!inp.readOnly && inp.value != '') {

        if (info == 'username') {
            var users = getListUser();
            for (var u of users) {
                if (u.username == inp.value && u.username != currentUser.username) {
                    alert('Username already taken!!');
                    inp.value = currentUser.username;
                    return;
                }
            }
            // Change name in order list
            if (!currentUser.donhang.length) {
                document.getElementsByClassName('listDonHang')[0].innerHTML = `
                    <h3 style="width=100%; padding: 50px; color: green; font-size: 2em; text-align: center"> 
                        Hello ` + inp.value + `. You have no orders yet.
                    </h3>`;
            }


        } else if (info == 'email') {
            var users = getListUser();
            for (var u of users) {
                if (u.email == inp.value && u.username != currentUser.username) {
                    alert('Email already in use!!');
                    inp.value = currentUser.email;
                    return;
                }
            }
        }

        var temp = copyObject(currentUser);
        currentUser[info] = inp.value;

        // update product list in localstorage
        setCurrentUser(currentUser);
        updateListUser(temp, currentUser);

        // Update on header
        capNhat_ThongTin_CurrentUser();

        iTag.innerHTML = '';

    } else {
        iTag.innerHTML = 'Confirm';
        inp.focus();
        var v = inp.value;
        inp.value = '';
        inp.value = v;
    }

    inp.readOnly = !inp.readOnly;
}


// Order information section
function addTatCaDonHang(user) {
    if (!user) {
        document.getElementsByClassName('listDonHang')[0].innerHTML = `
            <h3 style="width=100%; padding: 50px; color: red; font-size: 2em; text-align: center"> 
                You are not logged in!!
            </h3>`;
        return;
    }
    if (!user.donhang.length) {
        document.getElementsByClassName('listDonHang')[0].innerHTML = `
            <h3 style="width=100%; padding: 50px; color: green; font-size: 2em; text-align: center"> 
                Hello ` + currentUser.username + `. You have no orders yet.
            </h3>`;
        return;
    }
    for (var dh of user.donhang) {
        addDonHang(dh);
    }
}

function addDonHang(dh) {
    var div = document.getElementsByClassName('listDonHang')[0];

    var s = `
            <table class="listSanPham">
                <tr> 
                    <th colspan="6">
                        <h3 style="text-align:center;"> Order date: ` + new Date(dh.ngaymua).toLocaleString() + `</h3> 
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

    var totalPrice = 0;
    for (var i = 0; i < dh.sp.length; i++) {
        var masp = dh.sp[i].ma;
        var soluongSp = dh.sp[i].soluong;
        var p = timKiemTheoMa(list_products, masp);
        var price = (p.promo.name == 'giareonline' ? p.promo.value : p.price);
        var thoigian = new Date(dh.sp[i].date).toLocaleString();
        var thanhtien = stringToNum(price) * soluongSp;

        s += `
                <tr>
                    <td>` + (i + 1) + `</td>
                    <td class="noPadding imgHide">
                        <a target="_blank" href="chitietsanpham.php?` + p.name.split(' ').join('-') + `" title="View details">
                            ` + p.name + `
                            <img src="` + p.img + `">
                        </a>
                    </td>
                    <td class="alignRight">` + price + ` ₫</td>
                    <td class="soluong" >
                         ` + soluongSp + `
                    </td>
                    <td class="alignRight">` + numToString(thanhtien) + ` ₫</td>
                    <td style="text-align: center" >` + thoigian + `</td>
                </tr>
            `;
        totalPrice += thanhtien;
        tongSanPhamTatCaDonHang += soluongSp;
    }
    tongTienTatCaDonHang += totalPrice;

    s += `
                <tr style="font-weight:bold; text-align:center; height: 4em;">
                    <td colspan="4">TOTAL: </td>
                    <td class="alignRight">` + numToString(totalPrice) + ` ₫</td>
                    <td > ` + dh.tinhTrang + ` </td>
                </tr>
            </table>
            <hr>
        `;
    div.innerHTML += s;
}