<?php

class Controller
{
    function create($data)
    {
        $latitude = $data["latitude"];
        $longitude = $data["longitude"];
        $name = $data["name"];
        $description = $data["description"];

        require_once ('Model.php');
        $model = new Model("localhost", "root", "uxn265zc14", "case_4", 33060);
        $status = $model->create($latitude, $longitude, $name, $description);
        echo $status ? "Data Added" : "Failed to Add Data";
    }
}