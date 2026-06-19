<?php
	
	require_once ("../BackEnd/ConnectionDB/DatabaseClasses.php");

	if(!isset($_POST['request']) && !isset($_GET['request'])) die();

	switch ($_POST['request']) {
		case 'themdonhang':
			$DuLieu = $_POST["dulieu"];

			$HoaDonBus = new HoaDonBus();
			$ChiTietHdBus = new ChiTietHoaDonBus();

			$HoaDonBus->AddNew(array(
				"MaHD" => "",
				"MaND" => $DuLieu["maNguoiDung"],
				"NgayLap" => $DuLieu["ngayLap"],
				"NguoiNhan" => $DuLieu["tenNguoiNhan"],
				"SDT" => $DuLieu["sdtNguoiNhan"],
				"DiaChi" => $DuLieu["diaChiNguoiNhan"],
				"PhuongThucTT" => $DuLieu["phuongThucTT"],
				"TongTien" => $DuLieu["tongTien"],
				"TrangThai" => 1
			));

			$HoaDonMaxID = $HoaDonBus->GetList("SELECT * FROM hoadon ORDER BY MaHD DESC LIMIT 0, 1");
			$MaHd = $HoaDonMaxID[0]["MaHD"];

			forEach($DuLieu["dssp"] as $Sp) {
				$DataSp = (new SanPhamBus())->SelectById("*", $Sp["masp"]);
				$DonGia = $DataSp["DonGia"];

				$ChiTietHdBus->AddNew(array($MaHd, $Sp["masp"], $Sp["soLuong"], $DonGia));
			}

			die (json_encode(true));

		break;
	}
?>