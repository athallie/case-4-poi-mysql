<?php

class Controller
{
    function getData() {
        return json_encode(file_get_contents('php://input', true));
    }
    function create()
    {
        $data = $this->getData();
        $latitude = $data["latitude"];
        $longitude = $data["longitude"];
        $name = $data["name"];
        $description = $data["description"];

        require_once ('Model.php');
        $model = new Model("localhost", "root", "uxn265zc14", "case_4", 33060);
        echo $model->create($latitude, $longitude, $name, $description);
    }
}