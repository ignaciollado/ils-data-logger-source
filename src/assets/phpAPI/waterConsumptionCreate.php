<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';
require_once 'encrDecr.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$postedData = file_get_contents("php://input");

$request = json_decode($postedData, TRUE);

$monthAndYear = $request['monthYearDate'];

$monthAndYear = explode("/", $monthAndYear);
$monthBilling = $monthAndYear[0];
$yearBilling = $monthAndYear[1];

$query = "INSERT INTO ils_consumption(companyId, companyDelegationId, aspectId, energyId, quantity, month, year) VALUES ("
.$request['companyId'].","
.$request['delegation'].","
.$request['aspectId'].",0,"
.$request['quantityWater'].",'"
.$monthBilling."','"
.$yearBilling."')";

$result = mysqli_query($conn, $query);

mysqli_close($conn);
if ($result) {
  header('Content-Type: application/json');
  echo  json_encode(array('user_id'=>$field[0], 'access_token' => $field[2], 'email'=>$field[4], 'password' => $field[2],'response_code'=>200));
} else  {
  echo http_response_code(401);
}

?>
