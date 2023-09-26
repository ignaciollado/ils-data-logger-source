<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$companyId = $_GET['companyId'];

$sql = "SELECT ils_company_delegation.name as delegation, ils_billing.year, 
        ils_billing.01 as 'jan', ils_billing.02 as 'feb', ils_billing.03 as 'mar', ils_billing.04 as 'apr',
        ils_billing.05 as 'may', ils_billing.06 as 'jun', ils_billing.07 as 'jul', ils_billing.08 as 'aug', 
        ils_billing.09 as 'sep', ils_billing.10 as 'oct', ils_billing.11 as 'nov', ils_billing.12 as 'dic',
        ils_billing.Id, ils_billing.companyId, ils_billing.companyDelegationId,
        ils_company_delegation.address

FROM ils_billing
LEFT JOIN ils_company_delegation ON ils_billing.companyDelegationId=ils_company_delegation.companyDelegationId
WHERE ils_billing.companyId =".$companyId;

$sql .= " ORDER BY delegation, year";

$result = mysqli_query($conn, $sql);

while($billings = mysqli_fetch_array($result, MYSQLI_ASSOC)){
    $vec[] = $billings;
}

$cad = json_encode($vec);
mysqli_close($conn);
echo $cad;
header('Content-Type: application/json');
?>
