<?php

class Model
{
    protected $db;

    public function __construct($hostname, $username, $password, $dbname, $port) {
        $this->db = new mysqli($hostname, $username, $password, $dbname, $port);
        if ($this->db->connect_error) {
            die("Connection failed: " . $this->db->connect_error);
        }
    }

    /*Athallah*/
    public function create($latitude, $longitude, $name, $description)
    {
        $insert =
            "INSERT INTO case_4.points (latitude, longitude, name, description)" .
            " VALUES ('$latitude', '$longitude', '$name', '$description')";
        $prepared = $this->db->prepare($insert);
        return $prepared->execute();
    }

    /*Adam*/
    public function read()
    {
        $query = "SELECT * FROM case_4.points";
        $result = $this->db->query($query);
        $points = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $points[] = $row;
            }
        }
        return json_encode($points);
    }

    /*Fian*/
    public function update($latitude, $longitude, $name, $description)
    {
        $update = "UPDATE case_4.points SET name = ?, description = ? WHERE latitude = ? AND longitude = ?";
        $prepared = $this->db->prepare($update);
        if ($prepared) {
            $prepared->bind_param("ssdd", $name, $description, $latitude, $longitude);
            $result = $prepared->execute();
            if ($result) {
                return true;
            } else {
                error_log("Update failed: " . $this->db->error);
                return false;
            }
            $prepared->close();
        } else {
            error_log("Prepared statement creation failed: " . $this->db->error);
            return false;
        }
    }

    /*Zahrina*/
    public function delete($latitude, $longitude)
    {
        $delete = "DELETE FROM case_4.points WHERE latitude = '$latitude' AND longitude = '$longitude'";
        $prepared = $this->db->prepare($delete);
        return $prepared->execute();
    }
}
