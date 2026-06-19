<?php
	require_once('../BackEnd/ConnectionDB/DB_classes.php');

	if(!isset($_POST['request']) && !isset($_GET['request'])) die(null);

	switch ($_POST['request']) {
    	// get all product types (brands)
    	case 'getall':
				$dslsp = (new LoaiSanPhamBUS())->select_all();
		    	die (json_encode($dslsp));
    		break;
    	default:
    		# code...
    		break;
    }

?>