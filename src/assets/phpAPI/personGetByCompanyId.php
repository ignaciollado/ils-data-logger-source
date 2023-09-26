<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$companyId = $_GET['companyId'];

$sql = "SELECT ils_company_delegation.name as delegation, ils_persons.year, 
        ils_persons.01 as 'jan', ils_persons.02 as 'feb', ils_persons.03 as 'mar', ils_persons.04 as 'apr',
        ils_persons.05 as 'may', ils_persons.06 as 'jun', ils_persons.07 as 'jul', ils_persons.08 as 'aug', 
        ils_persons.09 as 'sep', ils_persons.10 as 'oct', ils_persons.11 as 'nov', ils_persons.12 as 'dec',
        ils_persons.Id, ils_persons.companyId, ils_persons.companyDelegationId,
        ils_company_delegation.address

FROM ils_persons
LEFT JOIN ils_company_delegation ON ils_persons.companyDelegationId=ils_company_delegation.companyDelegationId
WHERE ils_persons.companyId =".$companyId;

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
