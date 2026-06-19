<?php
require_once("DatabaseBusiness.php");

// display data from a database table as <table> 
function ShowDataBusAsTable($Bus)
{
    echo "<table cellspacing='15'>";
    foreach ($Bus->SelectAll() as $RowName => $Row) {
        echo "<tr>";
        foreach ($Row as $ColName => $Col) {
            echo "<td>" . $Col . "</td>";
        }
        echo "</tr>";
    }
    echo "</table>";
}

// Product class
class SanPhamBus extends DatabaseBusiness
{
    function __construct()
    {
        $this->SetTable("SanPham", "MaSP");
    }

    function CapNhapTrangThai($TrangThai, $Id) {
        $SanPham = $this->SelectById("*", $Id);
        $SanPham["TrangThai"] = $TrangThai;

        return $this->UpdateById($SanPham, $Id);
    }

    function ThemDanhGia($Id) {
        // update review count
        $SanPham = $this->SelectById("*", $Id);
        $SanPham["SoDanhGia"] = $SanPham["SoDanhGia"] + 1;

        // update average star rating
        $DsBl = (new DatabaseDriver())->GetList("SELECT * FROM danhgia WHERE MaSP=$Id");
        $TongSoSao = 0;
        for($i = 0; $i < sizeof($DsBl); $i++) {
            $TongSoSao += $DsBl[$i]["SoSao"];
        }
        $SanPham["SoSao"] = $TongSoSao / sizeof($DsBl);

        return $this->UpdateById($SanPham, $Id);
    }
}

// Product category class
class LoaiSanPhamBus extends DatabaseBusiness
{
    function __construct()
    {
        $this->SetTable("LoaiSanPham", "MaLSP");
    }
}

// Product detail class
class ChiTietSanPhamBus extends DatabaseBusiness
{
    function __construct()
    {
        $this->SetTable("ChiTietSanPham", "MaSP");
    }
}

// User class
class NguoiDungBus extends DatabaseBusiness
{
    function __construct()
    {
        $this->SetTable("NguoiDung", "MaND");
    }

    function AddNew($Data)
    {
        // check
        // duplicate username, duplicate email
        
        // add
        parent::AddNew($Data);
    }
}

// Invoice class
class HoaDonBus extends DatabaseBusiness
{
    function __construct()
    {
        $this->SetTable("HoaDon", "MaHD");
    }

    function GetHoaDonCuaNguoiDung($MaNd) {
        $Sql = "SELECT * FROM hoadon WHERE MaND=$MaNd";
        $DsDh = (new HoaDonBus())->GetList($Sql);
    }
}

// Account class
class TaiKhoanBus extends DatabaseBusiness
{
    function __construct()
    {
        $this->SetTable("TaiKhoan", "TenTaiKhoan");
    }
}

// Permission class
class PhanQuyenBus extends DatabaseBusiness
{
    function __construct()
    {
        $this->SetTable("PhanQuyen", "MaQuyen");
    }
}

// Promotion class
class KhuyenMaiBus extends DatabaseBusiness
{
    function __construct()
    {
        $this->SetTable("KhuyenMai", "MaKM");
    }
}

// Invoice detail class, has 2 primary keys
class ChiTietHoaDonBus extends DatabaseBusiness
{
    protected $Key2;

    function __construct()
    {
        $this->SetTable("ChiTietHoaDon", "MaHD");
        $this->_Key2 = "MaSP";
    }

    // Delete by invoice ID and product ID
    function DeleteBy2Id($Id, $Id2)
    {
        return $this->Remove($this->_TableName, $this->_Key . "='" . $Id . "' AND " . $this->_Key2 . "='" . $Id2 . "'");
    }

    // Update by invoice ID + product ID
    function UpdateBy2Id($Data, $Id, $Id2)
    {
        return $this->Update($this->_TableName, $Data, $this->_Key . "='" . $Id . "' AND " . $this->_Key2 . "='" . $Id2 . "'");
    }

    // select by invoice ID + product ID
    function SelectBy2Id($Select, $Id, $Id2)
    {
        $Sql = "select $Select from " . $this->_TableName . " where " . $this->_Key . " = '" . $Id . "' AND " . $this->_Key2 . "='" . $Id2 . "'";
        return $this->GetRow($Sql);
    }

    // get all details with given invoice ID
    function SelectAllInHoaDon($Id)
    {
        $Sql = "select * from " . $this->_TableName . " where " . $this->_Key . " ='" . $Id . "'";
        return $this->GetList($Sql);
    }
}
