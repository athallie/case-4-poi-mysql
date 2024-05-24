<?php
class Model
{
    protected $db;

    public function __constructor($hostname, $username, $password, $dbname, $port) {
        $this->db = new mysqli($hostname, $username, $password, $dbname, $port);
    }

    public function create()
    {

    }
    public function read()
    {

    }
    public function update()
    {

    }
    public function delete()
    {

    }
}