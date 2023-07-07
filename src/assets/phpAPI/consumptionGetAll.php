<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$sql = "SELECT * FROM consumption Order by consumptionId";

$sql = "SELECT consumption.consumptionId, consumption.companyId,
consumption.quantity, consumption.fromDate, consumption.toDate, consumption.createAt,
consumption.updatedAt, 
fuel.nameES, fuel.nameCA, fuel.aspectId, fuel.unit, fuel.pci
FROM consumption
LEFT JOIN fuel ON consumption.fuelId=fuel.fuelId Order by consumptionId";

$result = mysqli_query($conn, $sql);

while($consumptions = mysqli_fetch_array($result, MYSQLI_ASSOC)){
    $vec[] = $consumptions;
}

$cad = json_encode($vec);
mysqli_close($conn);
echo $cad;
header('Content-Type: application/json');
?>