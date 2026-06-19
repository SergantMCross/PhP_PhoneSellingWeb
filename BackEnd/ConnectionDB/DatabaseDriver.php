<?php
// Database Processing Library
class DatabaseDriver
{
    // Connection storage variable
    public $Conn,
        $Localhost = "localhost",
        $User = "root",
        $Pass = "",
        $DbName = "web2";

    // Connect function
    function Connect()
    {
        // If not connected, establish connection
        if (!$this->Conn) {
            // Connect
            $this->Conn = mysqli_connect($this->Localhost, $this->User, $this->Pass, $this->DbName) or die('Connection error');

            // Handle UTF8 query to avoid font errors
            mysqli_query($this->Conn, "SET character_set_results = 'utf8', character_set_client = 'utf8', character_set_database = 'utf8', character_set_server = 'utf8'");

            mysqli_query($this->Conn, "set names 'utf8'");
            mysqli_set_charset($this->Conn, "utf8");
        }
    }

    // Disconnect function
    function Disconnect()
    {
        // If connected, disconnect
        if ($this->Conn) {
            mysqli_close($this->Conn);
        }
    }

    // Insert function
    function Insert($Table, $Data)
    {
        // Connect
        $this->Connect();

        // Store field list (temporarily not needed)
        // $FieldList = '';
        // Store list of values corresponding to fields
        $ValueList = '';

        // Loop through data
        foreach ($Data as $Key => $Value) {
            // $FieldList .= ",$Key";
            $ValueList .= ",'" . mysqli_escape_string($this->Conn, $Value) . "'";
        }

        // After the loop, variables will have an extra comma, so we use trim to remove it
        // $Sql = 'INSERT INTO ' . $Table . '(' . trim($FieldList, ',') . ') VALUES (' . trim($ValueList, ',') . ')';
        $Sql = 'INSERT INTO ' . $Table . ' VALUES (' . trim($ValueList, ',') . ')';

        return mysqli_query($this->Conn, $Sql);
        //return $Sql;
    }

    // Update function
    function Update($Table, $Data, $Where)
    {
        // Connect
        $this->Connect();
        $Sql = '';
        // Loop through data
        foreach ($Data as $Key => $Value) {
            $Sql .= "$Key = '" . mysqli_escape_string($this->Conn, $Value) . "',";
        }

        // After the loop, $Sql will have an extra comma, so we use trim to remove it
        $Sql = 'UPDATE ' . $Table . ' SET ' . trim($Sql, ',') . ' WHERE ' . $Where;

        return mysqli_query($this->Conn, $Sql);
    }

    // Delete function
    function Remove($Table, $Where)
    {
        // Connect
        $this->Connect();

        // Delete
        $Sql = "DELETE FROM $Table WHERE $Where";
        return mysqli_query($this->Conn, $Sql);
    }

    // Get list function
    function GetList($Sql)
    {
        // Connect
        $this->Connect();

        $Result = mysqli_query($this->Conn, $Sql);

        if (!$Result) {
            die('Query error ' . $Sql);
        }

        $Return = array();

        // Loop through results to add to array
        while ($Row = mysqli_fetch_assoc($Result)) {
            $Return[] = $Row;
        }

        // Free result from memory
        mysqli_free_result($Result);

        return $Return;
    }

    // Get single record function used for detail retrieval
    function GetRow($Sql)
    {
        // Connect
        $this->Connect();

        $Result = mysqli_query($this->Conn, $Sql);

        if (!$Result) {
            die('Query error ' . $Sql);
        }

        $Row = mysqli_fetch_assoc($Result);

        // Free result from memory
        mysqli_free_result($Result);

        if ($Row) {
            return $Row;
        }

        return false;
    }
}
