<?php
	require_once ("../BackEnd/ConnectionDB/DatabaseClasses.php");

	session_start();

	if (isset($_SESSION['CurrentUser'])) {
		$MaHd = $_GET['mahd'];
	
		$Sql="SELECT * FROM chitiethoadon WHERE MaHD=$MaHd";
		$DsCthd=(new DatabaseDriver())->GetList($Sql);

		for($I = 0; $I < sizeof($DsCthd); $I++) {
            $DsCthd[$I]["SP"] = (new SanPhamBus())->SelectById('*', $DsCthd[$I]['MaSP']);
        }

		echo '<table class="table table-striped" >
		<tr style="text-align:center;vertical-align:middle;font-size:20px;background-color:coral;color:black!important">
			<th scope="col" style="font-weight:600">Product</th>
			<th scope="col" style="font-weight:600">Quantity</th>
			<th scope="col" style="font-weight:600">Unit Price</th>
		</tr>';

		forEach($DsCthd as $Row) {

				echo '<tr>
					<td scope="col" style="text-align:center;vertical-align:middle;">
						<a href="ProductDetail.php?'.$Row['MaSP'].'">
							<img style="width:100px;height:100px;" src="'.$Row["SP"]["HinhAnh"].'"><br>
							'.$Row["SP"]["TenSP"].'
						</a>
					</td>
					<td scope="col" style="text-align:center;vertical-align:middle;">'.$Row["SoLuong"].'</td>
					<td scope="col" style="text-align:center;vertical-align:middle;">'.$Row["DonGia"].'</td>
				</tr>'	;	
		}
		echo   '</table>';
	}
?>		

<!--  -->