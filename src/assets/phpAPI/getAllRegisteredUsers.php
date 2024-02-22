<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_jwt.php';

require_once 'encrDecr.php';

mysqli_query($conn, "SET NAMES 'utf8'");

$sql = "SELECT * FROM users";

$result = mysqli_query($conn, $sql);

while($registeredUsers = mysqli_fetch_array($result, MYSQLI_ASSOC)){
  $vec[] = $registeredUsers;
}

$cad = json_encode($vec);
mysqli_close($conn);
echo $cad;
header('Content-Type: application/json');
?>