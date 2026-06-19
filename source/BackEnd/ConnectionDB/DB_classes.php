<?php
require_once("DB_business.php");

// display data from a database table as <table> 
function show_DataBUS_as_Table($bus)
{
    echo "<table cellspacing='15'>";
    foreach ($bus->select_all() as $rowname => $row) {
        echo "<tr>";
        foreach ($row as $colname => $col) {
            echo "<td>" . $col . "</td>";
        }
        echo "</tr>";
    }
    echo "</table>";
}

// Product class
class SanPhamBUS extends DB_business
{
    function __construct()
    {
        $this->setTable("SanPham", "MaSP");
    }

    function capNhapTrangThai($trangthai, $id) {
        $sanpham = $this->select_by_id("*", $id);
        $sanpham["TrangThai"] = $trangthai;

        return $this->update_by_id($sanpham, $id);
    }

    function themDanhGia($id) {
        // update review count
        $sanpham = $this->select_by_id("*", $id);
        $sanpham["SoDanhGia"] = $sanpham["SoDanhGia"] + 1;

        // update average star rating
        $dsbl = (new DB_driver())->get_list("SELECT * FROM danhgia WHERE MaSP=$id");
        $tongSoSao = 0;
        for($i = 0; $i < sizeof($dsbl); $i++) {
            $tongSoSao += $dsbl[$i]["SoSao"];
        }
        $sanpham["SoSao"] = $tongSoSao / sizeof($dsbl);

        return $this->update_by_id($sanpham, $id);
    }
}

// Product category class
class LoaiSanPhamBUS extends DB_business
{
    function __construct()
    {
        $this->setTable("LoaiSanPham", "MaLSP");
    }
}

// Product detail class
class ChiTietSanPhamBUS extends DB_business
{
    function __construct()
    {
        $this->setTable("ChiTietSanPham", "MaSP");
    }
}

// User class
class NguoiDungBUS extends DB_business
{
    function __construct()
    {
        $this->setTable("NguoiDung", "MaND");
    }

    function add_new($data)
    {
        // check
        // duplicate username, duplicate email
        
        // add
        parent::add_new($data);
    }
}

// Invoice class
class HoaDonBUS extends DB_business
{
    function __construct()
    {
        $this->setTable("HoaDon", "MaHD");
    }

    function getHoaDonCuaNguoiDung($mand) {
        $sql = "SELECT * FROM hoadon WHERE MaND=$mand";
        $dsdh = (new HoaDonBUS())->get_list($sql);
    }
}

// Account class
class TaiKhoanBUS extends DB_business
{
    function __construct()
    {
        $this->setTable("TaiKhoan", "TenTaiKhoan");
    }
}

// Permission class
class PhanQuyenBUS extends DB_business
{
    function __construct()
    {
        $this->setTable("PhanQuyen", "MaQuyen");
    }
}

// Promotion class
class KhuyenMaiBUS extends DB_business
{
    function __construct()
    {
        $this->setTable("KhuyenMai", "MaKM");
    }
}

// Invoice detail class, has 2 primary keys
class ChiTietHoaDonBUS extends DB_business
{
    protected $key2;

    function __construct()
    {
        $this->setTable("ChiTietHoaDon", "MaHD");
        $this->_key2 = "MaSP";
    }

    // Delete by invoice ID and product ID
    function delete_by_2id($id, $id2)
    {
        return $this->remove($this->_table_name, $this->_key . "='" . $id . "' AND " . $this->_key2 . "='" . $id2 . "'");
    }

    // Update by invoice ID + product ID
    function update_by_2id($data, $id, $id2)
    {
        return $this->update($this->_table_name, $data, $this->_key . "='" . $id . "' AND " . $this->_key2 . "='" . $id2 . "'");
    }

    // select by invoice ID + product ID
    function select_by_2id($select, $id, $id2)
    {
        $sql = "select $select from " . $this->_table_name . " where " . $this->_key . " = '" . $id . "' AND " . $this->_key2 . "='" . $id2 . "'";
        return $this->get_row($sql);
    }

    // get all details with given invoice ID
    function select_all_in_hoadon($id)
    {
        $sql = "select * from " . $this->_table_name . " where " . $this->_key . " ='" . $id . "'";
        return $this->get_list($sql);
    }
}
