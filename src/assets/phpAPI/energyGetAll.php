<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$id = mysqli_real_escape_string($conn, $_POST["id"]);
$query = "SELECT energyId, nameES, nameCA, aspectId, unit, pci, convLKg, created_at, updated_at 
FROM ils_energy Order by nameES";
$result = mysqli_query($conn, $query);
if ( $result ) {

    while( $fuels = $reg=mysqli_fetch_array($result) )
    {
        $vec[] = $fuels;
    }
    $cad = json_encode($vec);
}

mysqli_close($conn);
echo $cad;
return $cad;
?>