<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

mysqli_query($conn, "SET NAMES 'utf8'");

$consumptionId = mysqli_real_escape_string($conn, $_GET["consumptionId"]);

$query = "DELETE FROM ils_consumption WHERE consumptionId = ". $consumptionId;

$result = mysqli_query($conn, $query);

return $result;

mysqli_close($conn);

?>
