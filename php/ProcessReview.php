<?php
	require_once ("../BackEnd/ConnectionDB/DatabaseClasses.php");
	if(!isset($_POST['request']) && !isset($_GET['request'])) die();

	switch ($_POST['request']) {
		case 'thembinhluan':
			$MaSp = $_POST['masp'];
			$MaNd = $_POST['mand'];
			$SoSao = $_POST['sosao'];
			$BinhLuan = $_POST['binhluan'];
			$ThoiGian = $_POST['thoigian'];

			$Status = (new DatabaseDriver())->Insert("danhgia", array(
				"MASP" => $MaSp,
				"MaND" => $MaNd,
				"SoSao" => $SoSao,
				"BinhLuan" => $BinhLuan,
				"NgayLap" => $ThoiGian
			));

			$SpBus = new SanPhamBus();

			die (json_encode($SpBus->ThemDanhGia($MaSp)));
			break;

		case 'getbinhluan':
			$MaSp = $_POST['masp'];
			$DsBl = (new DatabaseDriver())->GetList("SELECT * FROM danhgia WHERE MaSP=$MaSp");

			for($I = 0; $I < sizeof($DsBl); $I++) {
				$DsBl[$I]["ND"] = (new NguoiDungBus())->SelectById('*', $DsBl[$I]['MaND']);
			}

			die (json_encode($DsBl));
			break;
	}

?>