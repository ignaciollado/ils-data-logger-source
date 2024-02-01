<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$companyId = $_GET['companyId'];
$sql = "SELECT ils_company_delegation.name as delegation, ils_energy.nameES as energyName, year,
        sum(`01`) as 'jan',sum(`02`) as 'feb',sum(`03`) as 'mar',sum(`04`) as 'apr',sum(`05`) as 'may',sum(`06`) as 'jun',sum(`07`) as 'jul',
        sum(`08`) as 'aug',sum(`09`) as 'sep',sum(`10`) as 'oct',sum(`11`) as 'nov',sum(`12`) as 'dec'

        FROM ils_consumption

        LEFT JOIN ils_energy ON ils_consumption.energyId=ils_energy.energyId
        LEFT JOIN ils_company_delegation ON ils_consumption.companyDelegationId=ils_company_delegation.companyDelegationId

        WHERE ils_consumption.aspectId = 1 AND ils_consumption.companyId = ".$companyId."
        GROUP BY energyName
        ORDER by ils_consumption.energyId, Year, ils_consumption.companyDelegationId";

$result = mysqli_query($conn, $sql);

while($consumptions = mysqli_fetch_array($result, MYSQLI_ASSOC)){
    $vec[] = $consumptions;
}

$cad = json_encode($vec);
mysqli_close($conn);
echo $cad;
header('Content-Type: application/json');
?>
