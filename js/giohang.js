var TotalPrice = 0;
window.onload = function() {
    KhoiTao();

    // add tags (keywords) to search box
    var Tags = ["Samsung", "iPhone", "Huawei", "Oppo", "Mobi"];
    for (var t of Tags) AddTags(t, "index.php?search=" + t)

    var ListGioHang = GetListGioHang();
    GetListFromDB(ListGioHang);
}

function GetListFromDB(List) {
    if (!List || !List.length) {
        AddProductToTable(List);
        return;
    };

    var ListID = [];
    for (var p of List) {
        ListID.push(p.masp);
    }

    $.ajax({
        type: "POST",
        url: "php/ProcessProduct.php",
        dataType: "json",
        timeout: 1500, // stop after 1.5 seconds with no response => show error
        data: {
            request: "getlistbyids",
            listID: ListID
        },
        success: function(data, status, xhr) {
            // addSanPhamToTable(data);
            for (var p of data) {
                for (var g of List) {
                    if (p.MaSP == g.masp) {
                    	if(p.SoLuong >= g.soLuong) { // check enough stock
                        	p.SoLuongTrongGio = g.soLuong;
                    	} else {
                    		p.SoLuongTrongGio = p.SoLuong;

                    		g.soLuong = Number(p.SoLuong); // also change in localstorage 
                    		SetListGioHang(List); // update localstorage
            				AnimateCartNumber();

                    		Swal.fire({
                    		title: "Not enough stock",
                    		type: "error",
                    		text: "Product " + p.TenSP + " has insufficient stock (" + p.SoLuong + " available)"
                    		})
                    	}
                    }
                }
            }
            AddProductToTable(data);
        },
        error: function(e) {
            console.log(e.responseText);
        }
    })
}

function AddProductToTable(listProduct) {
    var Table = document.getElementsByClassName('listSanPham')[0];

    var S = `
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
        Table.innerHTML = S;
        return;
    }

    var SumPrice = 0;
    for (var i = 0; i < listProduct.length; i++) {
        var p = listProduct[i];
        var Masp = p.MaSP;
        var SoluongSp = p.SoLuongTrongGio;
        var Price = Number(p.DonGia) - Number(p.KM.GiaTriKM);
        var Thanhtien = Price * SoluongSp;

        S += `
			<tr>
				<td class="noPadding">
					<a target="_blank" href="chitietsanpham.html?` + p.MaSP + `" title="View details">
						<img class="smallImg" src="` + p.HinhAnh + `">
						<br>
						` + p.TenSP + `
					</a>
				</td>
<td class="alignRight">` + NumToString(Price) + ` ₫</td>
                <td class="soluong" >
                    <button onclick="GiamSoLuong('` + Masp + `')"><i class="fa fa-minus"></i></button>
                    <input size="1" onchange="CapNhatSoLuongFromInput(this, '` + Masp + `')" value=` + SoluongSp + `>
                    <button onclick="TangSoLuong('` + Masp + `')"><i class="fa fa-plus"></i></button>
                </td>
                <td class="alignRight">` + NumToString(Thanhtien) + ` ₫</td>
                <td class="noPadding"> 
                    <i class="fa fa-trash" onclick="XoaSanPhamTrongGioHang(` + Masp + ",'" + p.TenSP + `')"></i> 
                </td>
            </tr>
        `;
        // Pay attention to quotes in GiamSoLuong, TangSoLuong
        SumPrice += Thanhtien;
    }

    TotalPrice = SumPrice;

    S += `
			<tr style="font-weight:bold; text-align:center">
				<td colspan="3">TOTAL: </td>
				<td class="alignRight" style="color:red">` + NumToString(SumPrice) + ` ₫</td>
				<td></td>
			</tr>
			<tr>
				<td colspan="5">
					<button class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" onclick="ThanhToan()">
						<i class="fa fa-usd"></i> Checkout 
					</button> 
					<button class="btn btn-danger" onclick="XoaHet()">
						<i class="fa fa-trash-o"></i> Clear All 
					</button>
				</td>
			</tr>
		</tbody>
	`;

    Table.innerHTML = S;
}

function XoaSanPhamTrongGioHang(Masp, Tensp) {

    Swal.fire({
        type: "question",
        title: "Confirm?",
        html: "Are you sure you want to remove <b style='color:red'>" + Tensp + "</b> ?",
        grow: "row",
        cancelButtonText: 'Cancel',
        showCancelButton: true

    }).then((result) => {
        if (result.value) {
            var ListProduct = GetListGioHang();

            for (var i = 0; i < ListProduct.length; i++) {
                if (ListProduct[i].masp == Masp) {
                    ListProduct.splice(i, 1);
                    break;
                }
            }

            CapNhatMoiThu(ListProduct);
        }
    });
}

function ThanhToan() {
    var ListProduct = GetListGioHang();
    if (!ListProduct.length) {
        Swal.fire({
            type: 'info',
            title: "Empty",
            grow: 'row',
            text: 'No items to checkout.'
        });
        return;
    }

    GetCurrentUser((user) => {
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
                    ShowTaiKhoan(true);
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
        	HtmlThanhToan(user);
        }

    }, (error) => {
        console.log(error.responseText);
    });
}

function HtmlThanhToan(UserHienTai) {
	console.log('abc')

	$("#thongtinthanhtoan").html(`
		<form>
		  	<div class="form-group">
		    <p>Total: <h2>` + TotalPrice.toLocaleString() + `đ </h2></p>
		  </div>
		  <div class="form-group">
		    <label for="inputTen">Recipient Name</label>
		    <input class="form-control input-sm" id="inputTen" required type="text" value="` + (UserHienTai.Ho + " " + UserHienTai.Ten) + `">
		  </div>
		   <div class="form-group">
		    <label for="inputSDT">Recipient Phone</label>
		    <input class="form-control input-sm" id="inputSDT" required type="text" pattern="\\d*" minlength="10" maxlength="12" value="` + UserHienTai.SDT + `">
		  </div>
		  <div class="form-group">
		    <label for="inputDiaChi">Delivery Address</label>
		    <input class="form-control input-sm" id="inputDiaChi" required type="text" value="` + UserHienTai.DiaChi + `">
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

function XacNhanThanhToan() {
	var Dulieu = {
		maNguoiDung: UserHienTai.MaND,
		tenNguoiNhan: $("#inputTen").val(),
		sdtNguoiNhan: $("#inputSDT").val(),
		diaChiNguoiNhan: $("#inputDiaChi").val(),
		phuongThucTT: $("#selectHinhThucTT").val(),
		dssp: GetListGioHang(),
		tongTien: TotalPrice,
		ngayLap: new Date().ToMysqlFormat()
	}

	$.ajax({
		type: "POST",
		url: "php/ProcessPayment.php",
		dataType: "json",
		data: {
			request: "themdonhang",
			dulieu: Dulieu
		},
		success: function(data) {
			CapNhatMoiThu([]);
		},
		error: function(e) {
			console.log(e.responseText)
		}

	})

	return false;
}

function XoaHet() {
    var ListProduct = GetListGioHang();

    if (ListProduct.length) {
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
                ListProduct = [];
                CapNhatMoiThu(ListProduct);
            }
        })
    }
}

// Update quantity when entering quantity in input
function CapNhatSoLuongFromInput(Inp, Masp) {
    var SoLuongMoi = Number(Inp.value);
    if (!SoLuongMoi || SoLuongMoi <= 0) SoLuongMoi = 1;

    var ListProduct = GetListGioHang();

    for (var p of ListProduct) {
        if (p.masp == Masp && p.soLuong > 0) {
            p.soLuong = SoLuongMoi;
        }
    }

    CapNhatMoiThu(ListProduct);
}

function TangSoLuong(Masp) {
    var ListProduct = GetListGioHang();

    for (var p of ListProduct) {
        if (p.masp == Masp) {
            p.soLuong++;
        }
    }

    CapNhatMoiThu(ListProduct);
}

function GiamSoLuong(Masp) {
    var ListProduct = GetListGioHang();

    for (var p of ListProduct) {
        if (p.masp == Masp && p.soLuong > 1) {
            p.soLuong--;
        }
    }

    CapNhatMoiThu(ListProduct);
}

function CapNhatMoiThu(List) { // Everything
    AnimateCartNumber();

    SetListGioHang(List);

    // update product list in table
    GetListFromDB(List);
}