<?php
	require_once('../BackEnd/ConnectionDB/DatabaseClasses.php');

	if(!isset($_POST['request']) && !isset($_GET['request'])) die(null);

	switch ($_POST['request']) {
    	// get all product types (brands)
    	case 'getall':
				$DsLsp = (new LoaiSanPhamBus())->SelectAll();
		    	die (json_encode($DsLsp));
    		break;
    	default:
    		# code...
    		break;
    }

?>