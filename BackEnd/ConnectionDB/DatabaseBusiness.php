<?php
require_once("DatabaseDriver.php");

class DatabaseBusiness extends DatabaseDriver
{
    // Table name
    protected $_TableName = '';

    // Primary key name
    protected $_Key = '';

    // Constructor
    function __construct()
    {
        parent::Connect();
    }

    // set TableName and Key function
    function SetTable($TenBang, $KhoaChinh)
    {
        // Declare table name
        $this->_TableName = $TenBang;

        // Declare ID field name
        $this->_Key = $KhoaChinh;
    }

    // Destructor
    function __destruct()
    {
        parent::Disconnect();
    }

    // Add new function
    function AddNew($Data)
    {
        return parent::Insert($this->_TableName, $Data);
    }

    // Delete by ID function
    function DeleteById($Id)
    {
        return $this->Remove($this->_TableName, $this->_Key . "='" . $Id . "'");
    }

    // Update by ID function
    function UpdateById($Data, $Id)
    {
        return $this->Update($this->_TableName, $Data, $this->_Key . "='" . $Id . "'");
    }

    // select by ID function
    function SelectById($Select, $Id)
    {
        $Sql = "select $Select from " . $this->_TableName . " where " . $this->_Key . " = '" . $Id . "'";
        return $this->GetRow($Sql);
    }

    // get all function
    function SelectAll()
    {
        $Sql = "select * from " . $this->_TableName;
        return $this->GetList($Sql);
    }
}
