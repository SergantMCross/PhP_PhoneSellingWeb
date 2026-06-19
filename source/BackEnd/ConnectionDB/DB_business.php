<?php
require_once("DB_driver.php");

class DB_business extends DB_driver
{
    // Table name
    protected $_table_name = '';

    // Primary key name
    protected $_key = '';

    // Constructor
    function __construct()
    {
        parent::connect();
    }

    // set table_name and key function
    function setTable($tenBang, $khoaChinh)
    {
        // Declare table name
        $this->_table_name = $tenBang;

        // Declare ID field name
        $this->_key = $khoaChinh;
    }

    // Destructor
    function __destruct()
    {
        parent::dis_connect();
    }

    // Add new function
    function add_new($data)
    {
        return parent::insert($this->_table_name, $data);
    }

    // Delete by ID function
    function delete_by_id($id)
    {
        return $this->remove($this->_table_name, $this->_key . "='" . $id . "'");
    }

    // Update by ID function
    function update_by_id($data, $id)
    {
        return $this->update($this->_table_name, $data, $this->_key . "='" . $id . "'");
    }

    // select by ID function
    function select_by_id($select, $id)
    {
        $sql = "select $select from " . $this->_table_name . " where " . $this->_key . " = '" . $id . "'";
        return $this->get_row($sql);
    }

    // get all function
    function select_all()
    {
        $sql = "select * from " . $this->_table_name;
        return $this->get_list($sql);
    }
}
