<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';
require_once 'encrDecr.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$postedData = file_get_contents("php://input");
$request = json_decode($postedData, TRUE);

$sql = "INSERT INTO ils_consumption(companyId, companyDelegationId, aspectId,
 quantity, year, scopeOne, scopeTwo, fromDate, toDate) VALUES ("
.$request['companyId'].","
.$request['delegation'].","
.$request['aspectId'].","
.$request['quantityEmission'].",'"
.$request['yearEmission']."',"
.$request['scopeone'].","
.$request['scopetwo'].")"; 

echo $sql;

mysqli_free_result($result);

$result = mysqli_query($conn, $sql);

mysqli_close($conn);
if ($result) {
  header('Content-Type: application/json');
  echo  http_response_code(200);
} else  {
  echo http_response_code(401);
}

?>
