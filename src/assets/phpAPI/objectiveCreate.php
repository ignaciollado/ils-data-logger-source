<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';
require_once 'encrDecr.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$postedData = file_get_contents("php://input");
$request = json_decode($postedData, TRUE);

$sql = "INSERT INTO ils_objective(companyId, companyDelegationId, aspectId,
 theRatioType, chapterItemId, year, 
 `01`, `02`, `03`, `04`, `05`, `06`, `07`, `08`, `09`, `10`, `11`, `12`) VALUES ("
.$request['companyId'].",".$request['companyDelegationId'].",".$request['aspectId'].",'"
.$request['theRatioType']."','".$request['chapterItemId']."','".$request['year']."',"
.$request['jan'].","
.$request['feb'].","
.$request['mar'].","
.$request['apr'].","
.$request['may'].","
.$request['jun'].","
.$request['jul'].","
.$request['aug'].","
.$request['sep'].","
.$request['oct'].","
.$request['nov'].","
.$request['dec'].")";

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
