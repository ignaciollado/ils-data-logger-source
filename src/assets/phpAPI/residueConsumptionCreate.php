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
$monthResidueConsumption = $monthAndYear[0];
$yearResidueConsumption = $monthAndYear[1];

$sql = "INSERT INTO ils_consumption(companyId, companyDelegationId, aspectId, residueId,
year, `".$monthResidueConsumption;
$sql = $sql . "`) VALUES("
.$request['companyId'].","
.$request['delegation'].","
.$request['aspectId'].","
.$request['residue'].",'"
.$yearResidueConsumption."','"
.$request['quantityResidue']."/".$request['reuse']."/".$request['recycling']."/".$request['incineration']."/".$request['dump']."/".$request['compost']."') 
ON DUPLICATE KEY UPDATE `".$monthResidueConsumption."` = '".$request['quantityResidue']."/".$request['reuse']."/".$request['recycling']."/".$request['incineration']."/".$request['dump']."/".$request['compost']."'";

/* RESIDUE CASE:
INSERT INTO `ils_consumption` (companyId, companyDelegationId, aspectId, residueId, year,
`01`, `02`, `03`, `04`, `05`, `06`, `07`, `08`, `09`, `10`, `11`, `12`)
VALUES(284, 19, 3, 12, '2019',  '', '440/20/20/20/20/20', '', '', '', '', '', '', '', '', '', '') ON DUPLICATE KEY UPDATE
`02`='440/20/20/20/20/20' */

$result = mysqli_query($conn, $sql);

mysqli_close($conn);
if ($result) {
  header('Content-Type: application/json');
  echo  json_encode(array('user_id'=>$field[0], 'access_token' => $field[2], 'email'=>$field[4], 'password' => $field[2],'response_code'=>200));
} else  {
  echo http_response_code(401);
}

?>
