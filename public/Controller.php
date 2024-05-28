<?php

require_once ('Model.php');

class Controller
{
    /*Athallah*/
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

    /*Fian*/
    function update($data)
    {
        $latitude = $data["latitude"];
        $longitude = $data["longitude"];
        $name = $data["name"];
        $description = $data["description"];

        // Argumen constructor Model ini perlu disesuaikan dengan konfigurasi database lokal agar proses CRUD bisa berjalan
        $model = new Model("localhost", "root", "uxn265zc14", "case_4", 33060);
        $status = $model->update($latitude, $longitude, $name, $description);
        echo $status ? "Data Updated" : "Failed to Update Data";
    }

    /*Adam*/
    function read()
    {
        require_once ('Model.php');
        $model = new Model("localhost", "root", "uxn265zc14", "case_4", 33060);
        $points = $model->read();
        echo $points;
    }

    /*Zahrina*/
    function delete($data)
    {
        $latitude = $data["latitude"];
        $longitude = $data["longitude"];

        require_once ('Model.php');
        $model = new Model("localhost", "root", "uxn265zc14", "case_4", 33060);
        $status = $model->delete($latitude, $longitude);
        echo $status ? "Data Deleted" : "Failed to Delete Data";
    }
}
