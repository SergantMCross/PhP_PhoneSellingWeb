<?php
    require_once('../BackEnd/ConnectionDB/DatabaseClasses.php');

    if(!isset($_POST['request']) && !isset($_GET['request'])) die(null);

    switch ($_POST['request']) {
    	case 'getall':
				$KhachHang = (new NguoiDungBus())->SelectAll();
                
		    	die (json_encode($KhachHang));
    		break;

    	case 'changeTT':
				$KhachHangBus = new NguoiDungBus();
				$Key = $_POST['key'];
				$TrangThai = $_POST['trangThai'];
				
		    	die (json_encode($KhachHangBus->CapNhapTrangThai($TrangThai, $Key)));
    		break;

	    case 'delete':
				$KhachHangBus = new NguoiDungBus();
				$MaNd = $_POST['mand'];
					
			    die (json_encode($KhachHangBus->DeleteById($MaNd)));
	    	break;


	default:
    		# code...
    		break;
    }
?>