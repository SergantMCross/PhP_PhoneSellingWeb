<?php
// Database Processing Library
class DB_driver
{
    // Connection storage variable
    public $__conn,
        $localhost = "localhost",
        $user = "root",
        $pass = "",
        $DbName = "web2";

    // Connect function
    function connect()
    {
        // If not connected, establish connection
        if (!$this->__conn) {
            // Connect
            $this->__conn = mysqli_connect($this->localhost, $this->user, $this->pass, $this->DbName) or die('Connection error');

            // Handle UTF8 query to avoid font errors
            mysqli_query($this->__conn, "SET character_set_results = 'utf8', character_set_client = 'utf8', character_set_database = 'utf8', character_set_server = 'utf8'");

            mysqli_query($this->__conn, "set names 'utf8'");
            mysqli_set_charset($this->__conn, "utf8");
        }
    }

    // Disconnect function
    function dis_connect()
    {
        // If connected, disconnect
        if ($this->__conn) {
            mysqli_close($this->__conn);
        }
    }

    // Insert function
    function insert($table, $data)
    {
        // Connect
        $this->connect();

        // Store field list (temporarily not needed)
        // $field_list = '';
        // Store list of values corresponding to fields
        $value_list = '';

        // Loop through data
        foreach ($data as $key => $value) {
            // $field_list .= ",$key";
            $value_list .= ",'" . mysqli_escape_string($this->__conn, $value) . "'";
        }

        // After the loop, variables will have an extra comma, so we use trim to remove it
        // $sql = 'INSERT INTO ' . $table . '(' . trim($field_list, ',') . ') VALUES (' . trim($value_list, ',') . ')';
        $sql = 'INSERT INTO ' . $table . ' VALUES (' . trim($value_list, ',') . ')';

        return mysqli_query($this->__conn, $sql);
        //return $sql;
    }

    // Update function
    function update($table, $data, $where)
    {
        // Connect
        $this->connect();
        $sql = '';
        // Loop through data
        foreach ($data as $key => $value) {
            $sql .= "$key = '" . mysqli_escape_string($this->__conn, $value) . "',";
        }

        // After the loop, $sql will have an extra comma, so we use trim to remove it
        $sql = 'UPDATE ' . $table . ' SET ' . trim($sql, ',') . ' WHERE ' . $where;

        return mysqli_query($this->__conn, $sql);
    }

    // Delete function
    function remove($table, $where)
    {
        // Connect
        $this->connect();

        // Delete
        $sql = "DELETE FROM $table WHERE $where";
        return mysqli_query($this->__conn, $sql);
    }

    // Get list function
    function get_list($sql)
    {
        // Connect
        $this->connect();

        $result = mysqli_query($this->__conn, $sql);

        if (!$result) {
            die('Query error ' . $sql);
        }

        $return = array();

        // Loop through results to add to array
        while ($row = mysqli_fetch_assoc($result)) {
            $return[] = $row;
        }

        // Free result from memory
        mysqli_free_result($result);

        return $return;
    }

    // Get single record function used for detail retrieval
    function get_row($sql)
    {
        // Connect
        $this->connect();

        $result = mysqli_query($this->__conn, $sql);

        if (!$result) {
            die('Query error ' . $sql);
        }

        $row = mysqli_fetch_assoc($result);

        // Free result from memory
        mysqli_free_result($result);

        if ($row) {
            return $row;
        }

        return false;
    }
}
