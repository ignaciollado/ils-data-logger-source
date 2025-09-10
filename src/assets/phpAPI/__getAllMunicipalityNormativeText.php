<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$query = "SELECT * 
FROM `listado_ordenanzas` Order by Municipio";
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
header('Content-Type: application/json');
?>