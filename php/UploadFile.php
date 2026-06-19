<?php
    $TargetDir = "img/products/";
    $TargetFile = $TargetDir . basename($_FILES["hinhanh"]["name"]);
    $UploadOk = 1;
    $ImageFileType = strtolower(pathinfo($TargetFile,PATHINFO_EXTENSION));
    // Check if image file is a actual image or fake image
    if(isset($_POST["submit"])) {
        $Check = getimagesize($_FILES["hinhanh"]["tmp_name"]);
        if($Check !== false) {
            echo "File is an image - " . $Check["mime"] . ".";
            $UploadOk = 1;
        } else {
            echo "File is not an image.";
            $UploadOk = 0;
        }
    }
    // Check if file already exists
    if (file_exists($TargetFile)) {
        echo "Sorry, file already exists.";
        $UploadOk = 0;
    }
    // Check file size
    if ($_FILES["hinhanh"]["size"] > 500000) {
        echo "Sorry, your file is too large.";
        $UploadOk = 0;
    }
    // Allow certain file formats
    if($ImageFileType != "jpg" && $ImageFileType != "png" && $ImageFileType != "jpeg"
    && $ImageFileType != "gif" ) {
        echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
        $UploadOk = 0;
    }
    // Check if $UploadOk is set to 0 by an error
    if ($UploadOk == 0) {
        echo "Sorry, your file was not uploaded.";
    // if everything is ok, try to upload file
    } else {
        if (move_uploaded_file($_FILES["hinhanh"]["tmp_name"], $TargetFile)) {
            echo "The file ". basename( $_FILES["hinhanh"]["name"]). " has been uploaded.";
        } else {
            echo "Sorry, there was an error uploading your file.";
        }
    }
?>