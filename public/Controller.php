<?php

require_once ('Model.php');

class Controller
{
    function create($data)
    {
        $latitude = $data["latitude"];
        $longitude = $data["longitude"];
        $name = $data["name"];
        $description = $data["description"];

        //Argumen constructor Model ini perlu disesuaikan dengan konfigurasi database lokal agar proses CRUD bisa berjalan
        $model = new Model("localhost", "root", "uxn265zc14", "case_4", 33060);
        $status = $model->create($latitude, $longitude, $name, $description);
        echo $status ? "Data Added" : "Failed to Add Data";
    }
    
    function update($data)
    {
        $latitude = $data["latitude"];
        $longitude = $data["longitude"];
        $name = $data["name"];
        $description = $data["description"];

        //Argumen constructor Model ini perlu disesuaikan dengan konfigurasi database lokal agar proses CRUD bisa berjalan
        $model = new Model("localhost", "root", "uxn265zc14", "case_4", 33060);
        $status = $model->update($latitude, $longitude, $name, $description);
        echo $status ? "Data Updated" : "Failed to Update Data";
    }
}
