var TotalPrice = 0;
window.onload = function() {
    khoiTao();

    // add tags (keywords) to search box
    var tags = ["Samsung", "iPhone", "Huawei", "Oppo", "Mobi"];
    for (var t of tags) addTags(t, "index.php?search=" + t)

    var listGioHang = getListGioHang();
    getListFromDB(listGioHang);
}

function getListFromDB(list) {
    if (!list || !list.length) {
        addProductToTable(list);
        return;
    };

    var listID = [];
    for (var p of list) {
        listID.push(p.masp);
    }

    $.ajax({
        type: "POST",
        url: "php/xulysanpham.php",
        dataType: "json",
        timeout: 1500, // stop after 1.5 seconds with no response => show error
        data: {
            request: "getlistbyids",
            listID: listID
        },
        success: function(data, status, xhr) {
            // addSanPhamToTable(data);
            for (var p of data) {
                for (var g of list) {
                    if (p.MaSP == g.masp) {
                    	if(p.SoLuong >= g.soLuong) { // check enough stock
                        	p.SoLuongTrongGio = g.soLuong;
                    	} else {
                    		p.SoLuongTrongGio = p.SoLuong;

                    		g.soLuong = Number(p.SoLuong); // also change in localstorage 
                    		setListGioHang(list); // update localstorage
            				animateCartNumber();

                    		Swal.fire({
                    		title: "Not enough stock",
                    		type: "error",
                    		text: "Product " + p.TenSP + " has insufficient stock (" + p.SoLuong + " available)"
                    		})
                    	}
                    }
                }
            }
            addProductToTable(data);
        },
        error: function(e) {
            console.log(e.responseText);
        }
    })
}

function addProductToTable(listProduct) {
    var table = document.getElementsByClassName('listSanPham')[0];

    var s = `
		<tbody>
			<tr>
				<th>Product</th>
				<th>Price</th>
				<th>Quantity</th>
				<th>Subtotal</th>
				<th>Delete</th>
			</tr>`;

    if (!listProduct || listProduct.length == 0) {
        s += `
			<tr>
				<td colspan="7"> 
					<h1 style="color:green; background-color:white; font-weight:bold; text-align:center; padding: 15px 0;">
						Cart is empty!!
					</h1> 
				</td>
			</tr>
		`;
        table.innerHTML = s;
        return;
    }

    var totalPrice = 0;
    for (var i = 0; i < listProduct.length; i++) {
        var p = listProduct[i];
        var masp = p.MaSP;
        var soluongSp = p.SoLuongTrongGio;
        var price = Number(p.DonGia) - Number(p.KM.GiaTriKM);
        var thanhtien = price * soluongSp;

        s += `
			<tr>
				<td class="noPadding">
					<a target="_blank" href="chitietsanpham.html?` + p.MaSP + `" title="View details">
						<img class="smallImg" src="` + p.HinhAnh + `">
						<br>
						` + p.TenSP + `
					</a>
				</td>
				<td class="alignRight">` + numToString(price) + ` ₫</td>
				<td class="soluong" >
					<button onclick="giamSoLuong('` + masp + `')"><i class="fa fa-minus"></i></button>
					<input size="1" onchange="capNhatSoLuongFromInput(this, '` + masp + `')" value=` + soluongSp + `>
					<button onclick="tangSoLuong('` + masp + `')"><i class="fa fa-plus"></i></button>
				</td>
				<td class="alignRight">` + numToString(thanhtien) + ` ₫</td>
				<td class="noPadding"> 
					<i class="fa fa-trash" onclick="xoaSanPhamTrongGioHang(` + masp + ",'" + p.TenSP + `')"></i> 
				</td>
			</tr>
		`;
        // Pay attention to quotes in giamSoLuong, tangSoLuong
        totalPrice += thanhtien;
    }

    TotalPrice = totalPrice;

    s += `
			<tr style="font-weight:bold; text-align:center">
				<td colspan="3">TOTAL: </td>
				<td class="alignRight" style="color:red">` + numToString(totalPrice) + ` ₫</td>
				<td></td>
			</tr>
			<tr>
				<td colspan="5">
					<button class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" onclick="thanhToan()">
						<i class="fa fa-usd"></i> Checkout 
					</button> 
					<button class="btn btn-danger" onclick="xoaHet()">
						<i class="fa fa-trash-o"></i> Clear All 
					</button>
				</td>
			</tr>
		</tbody>
	`;

    table.innerHTML = s;
}

function xoaSanPhamTrongGioHang(masp, tensp) {

    Swal.fire({
        type: "question",
        title: "Confirm?",
        html: "Are you sure you want to remove <b style='color:red'>" + tensp + "</b> ?",
        grow: "row",
        cancelButtonText: 'Cancel',
        showCancelButton: true

    }).then((result) => {
        if (result.value) {
            var listProduct = getListGioHang();

            for (var i = 0; i < listProduct.length; i++) {
                if (listProduct[i].masp == masp) {
                    listProduct.splice(i, 1);
                    break;
                }
            }

            capNhatMoiThu(listProduct);
        }
    });
}

function thanhToan() {
    var listProduct = getListGioHang();
    if (!listProduct.length) {
        Swal.fire({
            type: 'info',
            title: "Empty",
            grow: 'row',
            text: 'No items to checkout.'
        });
        return;
    }

    getCurrentUser((user) => {
        if (user == null) {
            Swal.fire({
                title: 'Hello!',
                text: 'You need to login to purchase',
                type: 'info',
                grow: 'row',
                confirmButtonText: 'Login',
                cancelButtonText: 'Go back',
                showCancelButton: true
            }).then((result) => {
                if (result.value) {
                    showTaiKhoan(true);
                }
            })

        } else if (user.TrangThai == 0) {
            Swal.fire({
                title: 'Account Locked!',
                text: 'Your account is currently locked so you cannot make purchases!',
                type: 'error',
                grow: 'row',
                confirmButtonText: 'Go back',
                footer: '<a href>Contact Admin</a>'
            });
        } else {
        	UserHienTai = user;  // global variable
        	htmlThanhToan(user);
        }

    }, (error) => {
        console.log(error.responseText);
    });
}

function htmlThanhToan(userHienTai) {
	console.log('abc')

	$("#thongtinthanhtoan").html(`
		<form>
		  	<div class="form-group">
		    <p>Total: <h2>` + TotalPrice.toLocaleString() + `đ </h2></p>
		  </div>
		  <div class="form-group">
		    <label for="inputTen">Recipient Name</label>
		    <input class="form-control input-sm" id="inputTen" required type="text" value="` + (userHienTai.Ho + " " + userHienTai.Ten) + `">
		  </div>
		   <div class="form-group">
		    <label for="inputSDT">Recipient Phone</label>
		    <input class="form-control input-sm" id="inputSDT" required type="text" pattern="\\d*" minlength="10" maxlength="12" value="` + userHienTai.SDT + `">
		  </div>
		  <div class="form-group">
		    <label for="inputDiaChi">Delivery Address</label>
		    <input class="form-control input-sm" id="inputDiaChi" required type="text" value="` + userHienTai.DiaChi + `">
		  </div>
		  <div class="form-group">
		    <select class="browser-default custom-select" id="selectHinhThucTT">
		      <option value="" disabled selected>Payment Method</option>
			  <option value="Cash on delivery">Cash on delivery</option>
			  <option value="Bank card">Bank card</option>
			</select>
		  </div>
		</form>
	 `);
}

function xacNhanThanhToan() {
	var dulieu = {
		maNguoiDung: UserHienTai.MaND,
		tenNguoiNhan: $("#inputTen").val(),
		sdtNguoiNhan: $("#inputSDT").val(),
		diaChiNguoiNhan: $("#inputDiaChi").val(),
		phuongThucTT: $("#selectHinhThucTT").val(),
		dssp: getListGioHang(),
		tongTien: TotalPrice,
		ngayLap: new Date().toMysqlFormat()
	}

	$.ajax({
		type: "POST",
		url: "php/xulythanhtoan.php",
		dataType: "json",
		data: {
			request: "themdonhang",
			dulieu: dulieu
		},
		success: function(data) {
			capNhatMoiThu([]);
		},
		error: function(e) {
			console.log(e.responseText)
		}

	})

	return false;
}

function xoaHet() {
    var listProduct = getListGioHang();

    if (listProduct.length) {
        Swal.fire({
            title: 'Clear All?',
            text: 'Are you sure you want to remove all items from cart! This cannot be undone.',
            type: 'warning',
            grow: 'row',
            confirmButtonText: 'I agree',
        cancelButtonText: 'Cancel',
            showCancelButton: true

        }).then((result) => {
            if (result.value) {
                listProduct = [];
                capNhatMoiThu(listProduct);
            }
        })
    }
}

// Update quantity when entering quantity in input
function capNhatSoLuongFromInput(inp, masp) {
    var soLuongMoi = Number(inp.value);
    if (!soLuongMoi || soLuongMoi <= 0) soLuongMoi = 1;

    var listProduct = getListGioHang();

    for (var p of listProduct) {
        if (p.masp == masp && p.soLuong > 0) {
            p.soLuong = soLuongMoi;
        }
    }

    capNhatMoiThu(listProduct);
}

function tangSoLuong(masp) {
    var listProduct = getListGioHang();

    for (var p of listProduct) {
        if (p.masp == masp) {
            p.soLuong++;
        }
    }

    capNhatMoiThu(listProduct);
}

function giamSoLuong(masp) {
    var listProduct = getListGioHang();

    for (var p of listProduct) {
        if (p.masp == masp && p.soLuong > 1) {
            p.soLuong--;
        }
    }

    capNhatMoiThu(listProduct);
}

function capNhatMoiThu(list) { // Everything
    animateCartNumber();

    setListGioHang(list);

    // update product list in table
    getListFromDB(list);
}