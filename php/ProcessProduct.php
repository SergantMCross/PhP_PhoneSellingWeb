<?php
    require_once('../BackEnd/ConnectionDB/DatabaseClasses.php');

    if(!isset($_POST['request']) && !isset($_GET['request'])) die(null);

    switch ($_POST['request']) {
    	// get all products
    	case 'getall':
				$DsSp = (new SanPhamBus())->SelectAll();
                for($I = 0; $I < sizeof($DsSp); $I++) {
                    // add promotion info
                    $DsSp[$I]["KM"] = (new KhuyenMaiBus())->SelectById('*', $DsSp[$I]['MaKM']);
                    // add brand info
                    $DsSp[$I]["LSP"] = (new LoaiSanPhamBus())->SelectById('*', $DsSp[$I]['MaLSP']);
                }
		    	die (json_encode($DsSp));
    		break;

        case 'getbyid':
            $Sp = (new SanPhamBus())->SelectById("*", $_POST['id']);
            // add promotion and brand info
            $Sp["KM"] = (new KhuyenMaiBus())->SelectById('*', $Sp['MaKM']);
            $Sp["LSP"] = (new LoaiSanPhamBus())->SelectById('*', $Sp['MaLSP']);

            die (json_encode($Sp));
            break;

        case 'getlistbyids':
            $ListID = $_POST['listID'];
            $Sql = "SELECT * FROM SanPham WHERE ";

            forEach($ListID as $Id) {
                $Sql .= "MaSP=".$Id." OR ";
            }
            $Sql.=" 1=0";

            $Result = (new DatabaseDriver())->GetList($Sql);
            
            for($I = 0; $I < sizeof($Result); $I++) {
            // add promotion info
                $Result[$I]["KM"] = (new KhuyenMaiBus())->SelectById('*', $Result[$I]['MaKM']);
            // add brand info
                $Result[$I]["LSP"] = (new LoaiSanPhamBus())->SelectById('*', $Result[$I]['MaLSP']);
            }

            die (json_encode($Result));
            break;

        case 'phanTich_Filters':
            PhanTichFilters();
            break;

        case 'addFromWeb1':
            AddFromWeb1();
            break;

        //add
        case 'add':
                $Data = $_POST['dataAdd'];
                $SpAddArr = array(
                    'MaSP' => $Data['masp'],
                    'MaLSP' => $Data['company'],
                    'TenSP' => $Data['name'],
                    'DonGia' => $Data['price'],
                    'SoLuong' => $Data['amount'],
                    'HinhAnh' => $Data['img'],
                    'MaKM' => $Data['promo']['name'],
                    'ManHinh' => $Data['detail']['screen'],
                    'HDH' => $Data['detail']['os'],
                    'CamSau' => $Data['detail']['camara'],
                    'CamTruoc' => $Data['detail']['camaraFront'],
                    'CPU' => $Data['detail']['cpu'],
                    'Ram' => $Data['detail']['ram'],
                    'Rom' => $Data['detail']['rom'],
                    'SDCard' => $Data['detail']['microUSB'],
                    'Pin' => $Data['detail']['battery'],
                    'SoSao' => $Data['star'],
                    'SoDanhGia' => $Data['rateCount'],
                    'TrangThai' => $Data['TrangThai']
                );

                $SpBus = new SanPhamBus();
                die (json_encode($SpBus->AddNew($SpAddArr)));
            break;

        // delete
        case 'delete':
                $SpBus = new SanPhamBus();
                $MaSpDel = $_POST['maspdelete'];
                die (json_encode($SpBus->DeleteById($MaSpDel)));
            break;

        case 'hide' :
            $Id = $_POST["id"];
            $TrangThai = $_POST["trangthai"];
            die (json_encode((new SanPhamBus())->CapNhapTrangThai($TrangThai, $Id)));
            break;
    	
    	default:
    		# code...
    		break;
    }

    function PhanTichFilters() {
        $Filters = $_POST['filters'];
        $Ori = "SELECT * FROM SanPham WHERE TrangThai=1 AND SoLuong>0 AND ";
        $Sql = $Ori;
        $Db = new DatabaseDriver();
        $Db->Connect();

        // $page = null;
        $TenThanhPhanCanSort = null;
        $TypeSort = null;

        forEach($Filters as $Filter) {
            $DauBang = explode("=", $Filter);
            switch ($DauBang[0]) {
                case 'search':
                    $DauBang[1] = explode("+", $DauBang[1]);
                    $DauBang[1] = join(" ", $DauBang[1]);
                    $DauBang[1] = mysqli_escape_string($Db->__conn, $DauBang[1]);
                    $Sql .= ($Sql==$Ori?"":" AND ") . " TenSP LIKE '%$DauBang[1]%' ";
                    break;

                case 'price':
                    $Prices = explode("-", $DauBang[1]);
                    $GiaTu = (int)$Prices[0];
                    $GiaDen = (int)$Prices[1];

                    // if max price = 0 then set max price to 100 million
                    if($GiaDen == 0) $GiaDen = 1000000000;

                    $Sql .= ($Sql==$Ori?"":" AND ") . " DonGia >= $GiaTu AND DonGia <= $GiaDen";
                    break;

                case 'company':
                    $CompanyID = $DauBang[1];
                    $Sql .= ($Sql==$Ori?"":" AND ") . " MaLSP='$CompanyID'";
                    break;

                case 'star':
                    $SoSao = (int)$DauBang[1];
                    $Sql .= ($Sql==$Ori?"":" AND ") . " SoSao >= $SoSao";
                    break;

                case 'promo':
                    // get promotion id
                    $LoaiKm = $DauBang[1];
                    $KhuyenMai = (new DatabaseDriver())->GetRow("SELECT * FROM KhuyenMai WHERE LoaiKM='$LoaiKm'");
                    $KhuyenMaiID = $KhuyenMai["MaKM"];
                    
                    $Sql .= ($Sql==$Ori?"":" AND ") . " MaKM='$KhuyenMaiID'";
                    break;

                case 'sort':
                    $S = explode("-", $DauBang[1]);
                    $TenThanhPhanCanSort = $S[0];
                    $TypeSort = ($S[1]=="asc"?"ASC":"DESC");
                    break;

                // case 'page':
                //     $page = $DauBang[1];
                //     break;
                
                default:
                    # code...
                    break;
            }
        }

        // sort must be at the end
        if($TenThanhPhanCanSort != null && $TypeSort != null) {
            $Sql .= ($Sql==$Ori?" 1=1 ":""); // fix extra AND keyword 
            $Sql .= " ORDER BY $TenThanhPhanCanSort $TypeSort";
        }

        // Pagination
        // if($page != 0 || $page == null) { // if == 0 then return all
        //     if($page == null) $page = 1; // default is page 1 (if nothing is specified)
        //     $productsPerPage = 10; // number of products per page
        //     $startIndex = ($page-1)*$productsPerPage;
        //     $sql .= ($sql==$ori?" 1=1 ":""); // fix extra where keyword
        //     $sql .= " LIMIT $startIndex,$productsPerPage";
        // }

        // run sql
        $Result = $Db->GetList($Sql);
        $Db->Disconnect();

        for($I = 0; $I < sizeof($Result); $I++) {
            // add promotion info
            $Result[$I]["KM"] = (new KhuyenMaiBus())->SelectById('*', $Result[$I]['MaKM']);
            // add brand info
            $Result[$I]["LSP"] = (new LoaiSanPhamBus())->SelectById('*', $Result[$I]['MaLSP']);
        }
        die (json_encode($Result));
    }

    function AddFromWeb1() {
        $SpBus = new SanPhamBus();

        $Sp = $_POST['sanpham'];
        $LoaiSanPham = (new DatabaseDriver())->GetRow("SELECT * FROM LoaiSanPham WHERE TenLSP='".$Sp["company"]."'");

        $SanPhamArr = array(
            'MaSP' => "",
            'MaLSP' => $LoaiSanPham['MaLSP'],
            'TenSP' => $Sp['name'],
            'DonGia' => $Sp['price'],
            'SoLuong' => 10,
            'HinhAnh' => $Sp['img'],
            'MaKM' => $Sp['MaKM'],
            'ManHinh' => $Sp['detail']['screen'],
            'HDH' => $Sp['detail']['os'],
            'CamSau' => $Sp['detail']['camara'],
            'CamTruoc' => $Sp['detail']['camaraFront'],
            'CPU' => $Sp['detail']['cpu'],
            'Ram' => $Sp['detail']['ram'],
            'Rom' => $Sp['detail']['rom'],
            'SDCard' => $Sp['detail']['microUSB'],
            'Pin' => $Sp['detail']['battery'],
            'SoSao' => 0,
            'SoDanhGia' => 0,
            'TrangThai' => 1
        ); 
        
        die (json_encode($SpBus->AddNew($SanPhamArr)));
    }
?>
