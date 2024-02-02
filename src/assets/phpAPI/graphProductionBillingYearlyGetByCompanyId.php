<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$companyId = $_GET['companyId'];
$sql = "SELECT ils_company_delegation.name as delegation, year,
        `01`+`02`+`03`+`04`+`05`+`06`+`07`+`08`+`09`+`10`+`11`+`12` as totalYear
        FROM ils_billing
        LEFT JOIN ils_company_delegation ON ils_billing.companyDelegationId=ils_company_delegation.companyDelegationId
        WHERE ils_billing.companyId = ".$companyId."
        ORDER BY year, ils_billing.companyDelegationId"; 

$result = mysqli_query($conn, $sql);

while($consumptions = mysqli_fetch_array($result, MYSQLI_ASSOC)){
    $vec[] = $consumptions;
}

$cad = json_encode($vec);
mysqli_close($conn);
echo $cad;
header('Content-Type: application/json');
?>