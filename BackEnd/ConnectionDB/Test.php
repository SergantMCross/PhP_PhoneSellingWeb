<?php
require_once('DatabaseClasses.php');

$NguoiDung = new NguoiDungBus();
// $NguoiDung->DeleteById("ND2");
 $NguoiDung->AddNew(array('ND3', 'Tran', 'Thu Hien', 'thuhien@gmail.com'));

ShowDataBusAsTable(new NguoiDungBus());
die();

// Check duplicates with getList