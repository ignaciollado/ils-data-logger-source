<?php
header('Access-Control-Allow-Origin: *');
header('Header set Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$companyDelegationId = $_GET['companyDelegationId'];
/* $sql = "UPDATE pindust_company_delegation SET 
deleted = 1 
WHERE companyDelegationId = '" .$companyDelegationId. "' Order by name"; */
$sql = "DELETE FROM ils_company_delegation WHERE companyDelegationId = '" .$companyDelegationId. "' Order by name";
echo $sql;
$result = mysqli_query($conn, $sql);
echo $result;
if ($result==1) {
    header('Content-Type: application/json');
    echo  json_encode(array('action'=>'OK', 'response_code'=>200));
  } else  {
    echo http_response_code(401);
  }
?>