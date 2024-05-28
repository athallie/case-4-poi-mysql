<?php

require_once ("Controller.php");

$data = json_decode(file_get_contents("php://input"), true);
$method = $data["method"];
$controller = new Controller();

if (method_exists($controller, $method)) {
    $controller->create($data);
}

if (method_exists($controller, $method)) {
    $controller->$method($data);
}
