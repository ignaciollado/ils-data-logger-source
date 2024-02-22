<?php

$mysqlhost = 'vl21655.dinaserver.com';
$username = 'jwti_rdwpoYT';
$password = 'FDdG6R43^4)/';
$dbname = 'jwti_raQWdf';

// Crear la conexión

$conn = mysqli_connect($mysqlhost, $username, $password, $dbname);

// Comprobar si se ha conectado correctamente.

if (!$conn) {

    die("Connexió fallida: " . mysqli_connect_error());

}
// Change character set to utf8
mysqli_set_charset($conn,"utf8");
// echo "Connected successfully";
return $conn;

// mysqli_close($conn);
?>