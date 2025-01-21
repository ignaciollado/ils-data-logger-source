<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$query = "SELECT DISTINCT Ambito FROM `textos_normativos_vector` WHERE 1 ORDER By Ambito";
$result = mysqli_query($conn, $query);
if ( $result ) {
    while( $regID = $reg=mysqli_fetch_array($result) )
    {
      $vec[] = $regID;
    }
    $cad = json_encode($vec);
}
mysqli_close($conn);
echo $cad;
header('Content-Type: application/json');
?>