<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';
require_once 'encrDecr.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$postedData = file_get_contents("php://input");
$request = json_decode($postedData, TRUE);

$yearBilling = $request['yearBilling'];

/* $sql = "INSERT INTO ils_billing (companyId, companyDelegationId, year, `".$monthBilling;
$sql = $sql . "`) VALUES("
.$request['companyId'].","
.$request['delegation'].",'"
.$yearBilling."','"
.$request['quantity']."') ON DUPLICATE KEY UPDATE `".$monthBilling."` = '".$request['quantity']."'"; */

$sql = "INSERT INTO ils_billing (companyId, companyDelegationId, year,
`01`, `02`, `03`, `04`, `05`, `06`, `07`, `08`, `09`, `10`, `11`, `12`) VALUES("
.$request['companyId'].","
.$request['companyDelegationId'].",'"
.$request['year']."','"
.$request['jan']."','"
.$request['feb']."','"
.$request['mar']."','"
.$request['apr']."','"
.$request['may']."','"
.$request['jun']."','"
.$request['jul']."','"
.$request['aug']."','"
.$request['sep']."','"
.$request['oct']."','"
.$request['nov']."','"
.$request['dec']."')";

$result = mysqli_query($conn, $sql);

mysqli_close($conn);
if ($result) {
  header('Content-Type: application/json');
  echo  json_encode(array('user_id'=>$field[0], 'access_token' => $field[2], 'email'=>$field[4], 'password' => $field[2],'response_code'=>200));
} else  {
  echo http_response_code(401);
}

?>
