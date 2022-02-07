<?php

    #Retrieve data from json sent by front end 
	$inData = getRequestInfo();
	
    #Collect info about contact to be updated from user
	$newFirstName = $inData["newFirstName"];
    $newLastName = $inData["newLastName"];
    $newEmail = $inData["newEmail"];
    $ID = $inData["ID"];
	$userId = $inData["userId"];

    #Connect to database
	$conn = new mysqli("localhost", "User2", "StayProtected", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        #Update Contact information from database.
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, email = ? WHERE (ID = ? AND UserID = ?)");
		$stmt->bind_param("sssii", $newFirstName, $newLastName, $newEmail, $ID, $userId);
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
