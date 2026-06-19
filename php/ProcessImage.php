<?php
    if(!isset($_POST['request']) && !isset($_GET['request'])) die(null);

    // Reference at https://stackoverflow.com/questions/17122218/get-all-the-images-from-a-folder-in-php 

    switch ($_POST['request']) {
    	// get all banner images
    	case 'getallbanners':
				$Directory = "../img/banners";
                // get image files with png or gif format
                $Images = glob($Directory . "/*.{png,gif}", GLOB_BRACE); 
                die (json_encode($Images));
    		break;

        case 'getsmallbanner':
                $Directory = "../img/smallBanners";
                $Images = glob($Directory . "/*.{gif}", GLOB_BRACE); 
                die (json_encode($Images));
            break;
    	
    	default:
    		# code...
    		break;
    }
?>