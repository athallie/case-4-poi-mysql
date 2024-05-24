<?php
class Model
{
    protected $db;

    public function __construct($hostname, $username, $password, $dbname, $port) {
        $this->db = new mysqli($hostname, $username, $password, $dbname, $port);
        if ($this->db->connect_error) {
            die("Connection failed: " . $this->db->connect_error);
        } else {
            echo "Connected successfully\n";
        }
    }

    public function create($latitude, $longitude, $name, $description)
    {
        $insert =
            "INSERT INTO case_4.points (latitude, longitude, name, description)" .
            " VALUES ('$latitude', '$longitude', '$name', '$description')";
        $prepared = $this->db->prepare($insert);
        return $prepared->execute();
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