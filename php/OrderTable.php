<?php
	require_once ("../BackEnd/ConnectionDB/DatabaseClasses.php");
	session_start();

	if (isset($_SESSION['CurrentUser'])) {
		$MaNguoiDung = $_SESSION['CurrentUser']['MaND'];
	
		$Sql="SELECT * FROM hoadon WHERE MaND=$MaNguoiDung";
		$DsDh=(new DatabaseDriver())->GetList($Sql);

		if(sizeof($DsDh) > 0) {
			echo '<table class="table table-striped" >
				<tr style="text-align:center;vertical-align:middle;font-size:20px;background-color:coral;color:black!important">
				<th  style="font-weight:600">Order Code</th>
				<th  style="font-weight:600">User Code</th>
				<th  style="font-weight:600">Order Date</th>
				<th  style="font-weight:600">Recipient</th>
				<th  style="font-weight:600">Phone</th>
				<th  style="font-weight:600">Address</th>
				<th  style="font-weight:600">Payment Method</th>
				<th  style="font-weight:600">Total</th>
				<th  style="font-weight:600">Status</th>
				<th  style="font-weight:600">View Details</th>
			</tr>';

			forEach($DsDh as $Row) {
					echo '<tr>
						<td  style="text-align:center;vertical-align:middle;">'.$Row["MaHD"].'</td>
						<td  style="text-align:center;vertical-align:middle;">'.$Row["MaND"].'</td>
						<td  style="text-align:center;vertical-align:middle;">'.$Row["NgayLap"].'</td>
						<td  style="text-align:center;vertical-align:middle;">'.$Row["NguoiNhan"].'</td>
						<td  style="text-align:center;vertical-align:middle;">'.$Row["SDT"].'</td>
						<td  style="text-align:center;vertical-align:middle;">'.$Row["DiaChi"].'</td>
						<td  style="text-align:center;vertical-align:middle;">'.$Row["PhuongThucTT"].'</td>
						<td  style="text-align:center;vertical-align:middle;">'.$Row["TongTien"].'</td>
						<td  style="text-align:center;vertical-align:middle;">'.$Row["TrangThai"].'</td>
						<td  style="text-align:center;vertical-align:middle;">
							<button data-toggle="modal" data-target="#exampleModal" onclick="XemChiTiet(\''.$Row["MaHD"].'\')">View</button>
						</td>
					</tr>'	;	
			}
			echo '</table>';

		} else {
			echo '<h2 style="color:green; text-align:center;">
						No orders yet, 
						<a href="index.php" style="color:blue">Shop now</a>
					</h2>';
		}
	}
?>