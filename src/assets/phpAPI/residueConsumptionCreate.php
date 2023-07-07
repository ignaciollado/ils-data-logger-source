<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';
require_once 'encrDecr.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$postedData = file_get_contents("php://input");
$request = json_decode($postedData, TRUE);

$sql = "INSERT INTO ils_consumption(companyId, companyDelegationId, aspectId, residueId,
reuse,
recycling,
incineration,
dump,
compost, quantity, fromDate, toDate) VALUES ("
.$request['companyId'].","
.$request['delegation'].","
.$request['aspectId'].","
.$request['residue'].","
.$request['reuse'].","
.$request['recycling'].","
.$request['incineration'].","
.$request['dump'].","
.$request['compost'].","
.$request['quantityResidue'].","
."STR_TO_DATE('".$request['fromDateResidue']."', '%Y-%m-%d'), STR_TO_DATE('".$request['toDateResidue']."', '%Y-%m-%d'))";

$result = mysqli_query($conn, $sql);

mysqli_close($conn);
if ($result) {
  header('Content-Type: application/json');
  echo  json_encode(array('user_id'=>$field[0], 'access_token' => $field[2], 'email'=>$field[4], 'password' => $field[2],'response_code'=>200));
} else  {
  echo http_response_code(401);
}

?>
