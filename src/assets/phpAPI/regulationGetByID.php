<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$regID = $_GET['regID'];
$sql = "SELECT * FROM `textos_normativos_vector` WHERE regId ='".$regID."'";

$result = mysqli_query($conn, $sql);

while($aspects = mysqli_fetch_array($result, MYSQLI_ASSOC)){
    $vec[] = $aspects;
}

$cad = json_encode($vec);
mysqli_close($conn);
echo $cad;
header('Content-Type: application/json');
?>
