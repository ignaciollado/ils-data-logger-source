<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$consumptionId = $_GET['consumptionId'];
$postedData = file_get_contents("php://input");
$request = json_decode($postedData, TRUE);

$sql = "UPDATE `ils_consumption` SET
quantity=".$request['quantity'].",
scopeOne=".$request['scopeOne'].",
scopeTwo=".$request['scopeTwo']."
WHERE consumptionId = " .$consumptionId;

$result = mysqli_query($conn, $sql);
mysqli_close($conn);

if ($result) {
  header('Content-Type: application/json');
  echo  http_response_code(200);
} else  {
  echo http_response_code(401);
}
?>
