<?php
	require_once ("../BackEnd/ConnectionDB/DatabaseClasses.php");

	if(!isset($_POST['request']) && !isset($_GET['request'])) die();

	session_start();

		switch ($_POST['request']) {
		case 'dangnhap':
			DangNhap();
			break;

		case 'dangxuat':
			DangXuat();
			break;

		case 'dangky':
			DangKy();
			break;

		case 'getCurrentUser':
			if(isset($_SESSION['CurrentUser'])) {
				die (json_encode($_SESSION['CurrentUser']));
			}
			die (json_encode(null));
			break;
		
		default:
			# code...
			break;
	}

	function DangXuat() {
		if(isset($_SESSION['CurrentUser'])) {
			unset($_SESSION['CurrentUser']);
			die ("ok");
		}
		die ("no_ok");
	}

	function DangNhap() {
		$TaiKhoan=$_POST['data_username'];
		$MatKhau=$_POST['data_pass'];
		$MatKhau=md5($MatKhau);

		$Sql = "SELECT * FROM nguoidung WHERE TaiKhoan='$TaiKhoan' AND MatKhau='$MatKhau' AND MaQuyen=1 AND TrangThai=1";
		$Result = (new DatabaseDriver())->GetRow($Sql);

		if($Result != false){
		    $_SESSION['CurrentUser']=$Result;
		    die (json_encode($Result)); 
		}  
		die (json_encode(null));
	}

	function DangKy() {
		$XuliHo=$_POST['data_ho'];
		$XuliTen=$_POST['data_ten'];
		$XuliSdt=$_POST['data_sdt'];
		$XuliEmail=$_POST['data_email'];
		$XuliDiaChi=$_POST['data_diachi'];
		$XuliNewUser=$_POST['data_newUser'];
		$XuliNewPass=$_POST['data_newPass'];
		$XuliNewPass=md5($XuliNewPass);

		$Status = (new NguoiDungBus())->AddNew(array(
			"MaND" => "",
			"Ho" => $XuliHo,
			"Ten" => $XuliTen,
			"SDT" => $XuliSdt,
			"Email" => $XuliEmail,
			"DiaChi" => $XuliDiaChi,
			"TaiKhoan" => $XuliNewUser,
			"MatKhau" => $XuliNewPass,
			"MaQuyen" => 1,
			"TrangThai" => 1
		));

		// login immediately
		$Sql = "SELECT * FROM nguoidung WHERE TaiKhoan='$XuliNewUser' AND MatKhau='$XuliNewPass' AND MaQuyen=1 AND TrangThai=1";
		$Result = (new DatabaseDriver())->GetRow($Sql);

		if($Result != false){
		    $_SESSION['CurrentUser']=$Result;
		    die (json_encode($Result)); 
		}  

		die (json_encode(null));
	}
?>