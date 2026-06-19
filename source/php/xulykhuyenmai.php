<?php
	require_once('../BackEnd/ConnectionDB/DB_classes.php');

	if(!isset($_POST['request']) && !isset($_GET['request'])) die(null);

	switch ($_POST['request']) {
    	// get all promotions
    	case 'getall':
				$dskm = (new KhuyenMaiBUS())->select_all();
		    	die (json_encode($dskm));
    		break;

        // get promotion by id
        case 'theoID':
                $km = (new KhuyenMaiBUS())->select_by_id('*', $_POST['id']);
                die (json_encode($km));
            break;
    	default:
    		# code...
    		break;
    }

?>