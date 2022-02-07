<?php

    #Retrieve data from json sent by front end 
	$inData = getRequestInfo();
	
    #Collect info about contact to be deleted from user
	$deleteFirstName = $inData["deleteFirstName"];
    $deleteLastName = $inData["deleteLastName"];
    $deleteEmail = $inData["deleteEmail"];
	$userId = $inData["userId"];
    $ID = $inData["ID"];

    #Connect to database
	$conn = new mysqli("localhost", "User2", "StayProtected", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        #Delete Contact information from database. Delete keys are case-sensitive
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ? AND UserID = ?");
		$stmt->bind_param("ii", $ID, $userId);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>