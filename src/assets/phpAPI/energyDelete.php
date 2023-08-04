<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

mysqli_query($conn, "SET NAMES 'utf8'");

$energyId = mysqli_real_escape_string($conn, $_GET["energyId"]);

$query = "DELETE FROM ils_energy WHERE energyId = ". $energyId;

$result = mysqli_query($conn, $query);

return $result;

mysqli_close($conn);

?>
