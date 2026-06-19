<?php
    if(!isset($_POST['request']) && !isset($_GET['request'])) die(null);

    // Reference at https://stackoverflow.com/questions/17122218/get-all-the-images-from-a-folder-in-php 

    switch ($_POST['request']) {
    	// get all banner images
    	case 'getallbanners':
				$directory = "../img/banners";
                // get image files with png or gif format
                $images = glob($directory . "/*.{png,gif}", GLOB_BRACE); 
                die (json_encode($images));
    		break;

        case 'getsmallbanner':
                $directory = "../img/smallBanners";
                $images = glob($directory . "/*.{gif}", GLOB_BRACE); 
                die (json_encode($images));
            break;
    	
    	default:
    		# code...
    		break;
    }
?>