<?php
        session_start();
        $TaiKhoan=$_POST['data_username'];
        $MatKhau=md5($_POST['data_password']);
        
        // After logging in
        require ("../BackEnd/ConnectionDB/DatabaseDriver.php");

        $Db = new DatabaseDriver();
        $Db->Connect();

        $TaiKhoan = mysqli_escape_string($Db->__conn, $TaiKhoan);
        $MatKhau = mysqli_escape_string($Db->__conn, $MatKhau);

        // mysqli_set_charset($connSanPham,"utf8");
        $Sql = "SELECT * FROM nguoidung WHERE TaiKhoan = '$TaiKhoan' AND MatKhau='$MatKhau' AND MaQuyen!='1' AND TrangThai=1";

        $DsAd = $Db->GetList($Sql);

        if(sizeof($DsAd) > 0){
            $_SESSION['CurrentUser'] = $DsAd[0];   
            // header('Location: http://localhost/myweb/themplate/admin.php');
            echo "yes";

        } else  echo "no";

        $Db->Disconnect();
        ?>