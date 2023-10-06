<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';
require_once 'encrDecr.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$postedData = file_get_contents("php://input");
$request = json_decode($postedData, TRUE);

$fromDate = $request['yearEmission']."-01-01";
$toDate =   $request['yearEmission']."-12-31";

$sql = "INSERT INTO ils_consumption(companyId, companyDelegationId, aspectId,
 quantity, year, scopeOne, scopeTwo, fromDate, toDate) VALUES ("
.$request['companyId'].","
.$request['delegation'].","
.$request['aspectId'].","
.$request['quantityEmission'].",'"
.$request['yearEmission']."',"
.$request['scopeone'].","
.$request['scopetwo'].","

."STR_TO_DATE('".$fromDate."', '%Y-%m-%d'), STR_TO_DATE('".$toDate."', '%Y-%m-%d'))";

/* EMISSION CASE:
INSERT INTO `ils_consumption` (companyId, companyDelegationId, aspectId, year,
`01`, `02`, `03`, `04`, `05`, `06`, `07`, `08`, `09`, `10`, `11`, `12`)
VALUES(284, 19, 5, '2019', '', '', '2000/1500/500', '', '', '', '', '', '', '', '', '') ON DUPLICATE KEY UPDATE
`03`='2000/1500/500'  */

$result = mysqli_query($conn, $sql);

mysqli_close($conn);
if ($result) {
  header('Content-Type: application/json');
  echo  json_encode(array('user_id'=>$field[0], 'access_token' => $field[2], 'email'=>$field[4], 'password' => $field[2],'response_code'=>200));
} else  {
  echo http_response_code(401);
}

?>
