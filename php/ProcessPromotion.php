<?php
	require_once('../BackEnd/ConnectionDB/DatabaseClasses.php');

	if(!isset($_POST['request']) && !isset($_GET['request'])) die(null);

	switch ($_POST['request']) {
    	// get all promotions
    	case 'getall':
				$DsKm = (new KhuyenMaiBus())->SelectAll();
		    	die (json_encode($DsKm));
    		break;

        // get promotion by id
        case 'theoID':
                $Km = (new KhuyenMaiBus())->SelectById('*', $_POST['id']);
                die (json_encode($Km));
            break;
    	default:
    		# code...
    		break;
    }

?>