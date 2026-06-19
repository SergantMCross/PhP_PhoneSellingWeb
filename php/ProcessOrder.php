<?php
    require_once('../BackEnd/ConnectionDB/DatabaseClasses.php');

    if(!isset($_POST['request']) && !isset($_GET['request'])) die(null);

    switch ($_POST['request']) {
    	case 'getall':
				$DonHang = (new HoaDonBus())->SelectAll();
                $CtDonHang = (new ChiTietHoaDonBus())->SelectAll();
		    	die (json_encode($DonHang));
    		break;

		default:
	    		# code...
	    		break;
    }
?>