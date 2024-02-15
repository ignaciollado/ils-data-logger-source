<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$companyId = $_GET['companyId'];
$delegation = $_GET['delegation'];
$sql = "SELECT ils_company_delegation.name as delegation, year,
        (`01`+`02`+`03`) as 'Q1', (`04`+`05`+`06`) as 'Q2', 
            (`07`+`08`+`09`) as 'Q3', (`10`+`11`+`12`) as 'Q4'
        FROM ils_billing
        LEFT JOIN ils_company_delegation ON ils_billing.companyDelegationId=ils_company_delegation.companyDelegationId
        
        WHERE ils_billing.companyId = ".$companyId." AND ils_company_delegation.name = '".$delegation."'
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