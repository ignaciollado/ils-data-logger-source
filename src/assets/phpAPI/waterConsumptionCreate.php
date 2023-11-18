<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';
require_once 'encrDecr.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$postedData = file_get_contents("php://input");
$request = json_decode($postedData, TRUE);





    /* $sql = "UPDATE `ils_consumption`
            SET `".$monthEnergyConsumption."` = '".$request['quantity'].'/'.$request['objective']."'
            WHERE  companyId=". $request['companyId']."
            AND companyDelegationId =". $request['delegation']."
            AND aspectId =". $request['aspectId']."
            AND energyId =". $request['energy']."
            AND year ='". $yearEnergyConsumption."'";  */

    $sql = "INSERT INTO `ils_consumption` (companyId, companyDelegationId, aspectId, year
           ) VALUES("
          .$request['companyId'].","
          .$request['delegation'].","
          .$request['aspectId'].",'"
          .$request['yearWater']
          ."')";

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
