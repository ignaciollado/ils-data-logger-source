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

/*$sql = "INSERT INTO `ils_billing` (companyId, companyDelegationId, year, `01`, `02`, `03`, `04`, `05`, `06`, `07`, `08`, `09`, `10`, `11`, `12`)
VALUES(1000, 19, '2019', '', '', '', '', '', '', '', '', '444/555', '', '', '') ON DUPLICATE KEY UPDATE
`09`='440/550'" */

/*$sql = "INSERT INTO `ils_billing` (companyId, companyDelegationId, year, month, quantity, objective)
VALUES(999, 999, '2019', '09', 1000, 950) ON DUPLICATE KEY UPDATE
quantity='500', objective='450'"
 */

$sql = "INSERT INTO ils_billing(companyId, companyDelegationId, quantity, objective, month, year)
VALUES ("
.$request['companyId'].","
.$request['delegation'].","
.$request['quantity'].","
.$request['objective'].",'"
.$monthBilling."','"
.$yearBilling."')";

$result = mysqli_query($conn, $sql);

mysqli_close($conn);
if ($result) {
  header('Content-Type: application/json');
  echo  json_encode(array('user_id'=>$field[0], 'access_token' => $field[2], 'email'=>$field[4], 'password' => $field[2],'response_code'=>200));
} else  {
  echo http_response_code(401);
}

?>
