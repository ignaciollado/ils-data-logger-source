<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

require_once 'conectar_a_bbdd_pindust.php';

mysqli_query($conn, "SET NAMES 'utf8'");
$postedData = file_get_contents("php://input");
$request = json_decode($postedData, TRUE);

$questionnaireID = $_GET['questionnaireID'];
$completed = $_GET['completed'];
$companyDelegationId = $_GET['delegation'];

$userAnswers = $request['0'];
$userAnswers .= $request['1'];
$userAnswers .= $request['2'];
$userAnswers .= $request['3'];
$userAnswers .= $request['4'];
$userAnswers .= $request['5'];
$questionnaireSummary .= $request['6'];

$sql = "UPDATE globalQuestionaire SET
companyDelegationId =".$companyDelegationId.",
userAnswers ='".$userAnswers."',
completed ='".$completed."',
questionnaireSummary ='".$questionnaireSummary."'
 WHERE id = ".$questionnaireID;

/* echo "---->".strlen($questionnaireSummary)."<---";
echo $sql; */

mysqli_free_result($result);

if (strlen($questionnaireSummary) != 0) { /* si es 0 es que han cargado el cuestionario, no han modificado nada y han pulsado enviar */
  $result = mysqli_query($conn, $sql);
  mysqli_close($conn);
}

if ($result) {
  header('Content-Type: application/json');
  echo json_encode(array('response_code'=>200));
} else  {
  echo http_response_code(401);
}

?>
