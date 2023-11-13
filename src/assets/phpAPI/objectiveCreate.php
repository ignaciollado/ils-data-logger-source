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
 theRatioType, energyId, residueId, year, 
 `01`, `02`, `03`, `04`, `05`, `06`, `07`, `08`, `09`, `10`, `11`, `12`) VALUES ("
.$request['companyId'].",".$request['companyDelegationId'].",".$request['aspectId'].",'"
.$request['theRatioType']."',".$request['energyId'].",".$request['residueId'].",'".$request['year']."',"
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

/* CONTAR CUANTOS REGISTROS HAY */
/* $sqlCount = "SELECT *
FROM `ils_consumption`
WHERE  companyId=". $request['companyId']."
AND companyDelegationId =". $request['delegation']."
AND aspectId =". $request['aspectId']."
AND year ='". $request['yearEmission']."'";

if ($result=mysqli_query($conn,$sqlCount))
{
  $rowcount=mysqli_num_rows($result);
  if ($rowcount > 0) {
    $sql = "UPDATE `ils_consumption`
            SET quantity = ".$request['quantityEmission'].', objective = '.$request['objective'].",
            scopeOne = '".$request['scopeone']."',
            scopetwo = '".$request['scopetwo']."'

            WHERE  companyId=". $request['companyId']."
            AND companyDelegationId =". $request['delegation']."
            AND aspectId =". $request['aspectId']."
            AND year ='". $request['yearEmission']."'";
  } else {
    $sql = "INSERT INTO ils_consumption(companyId, companyDelegationId, aspectId,
      quantity, objective, year, scopeOne, scopeTwo, fromDate, toDate) VALUES ("
      .$request['companyId'].","
      .$request['delegation'].","
      .$request['aspectId'].","
      .$request['quantityEmission'].","
      .$request['objective'].",'"
      .$request['yearEmission']."',"
      .$request['scopeone'].","
      .$request['scopetwo'].","
      ."STR_TO_DATE('".$fromDate."', '%Y-%m-%d'), STR_TO_DATE('".$toDate."', '%Y-%m-%d'))";
  }
} */

mysqli_free_result($result);

echo $sql;

$result = mysqli_query($conn, $sql);

mysqli_close($conn);
if ($result) {
  header('Content-Type: application/json');
  echo  http_response_code(200);
} else  {
  echo http_response_code(401);
}
?>
