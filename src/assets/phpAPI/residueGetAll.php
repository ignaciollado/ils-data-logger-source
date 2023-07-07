<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$id = mysqli_real_escape_string($conn, $_POST["id"]);
$query = "SELECT residueId, nameES, nameCA, reuse, recycling, incineration, dump, compost FROM residue Order by residueId";
$result = mysqli_query($conn, $query);
if ( $result ) {

    while( $residues = $reg=mysqli_fetch_array($result) )
    {
        $vec[] = $residues;
    }
    $cad = json_encode($vec);
}

mysqli_close($conn);
echo $cad;
return $cad;
?>