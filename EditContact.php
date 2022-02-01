<?php

    #Retrieve data from json sent by front end 
	$inData = getRequestInfo();
	
    #Collect info about contact to be updated from user
	$newFirstName = $inData["newFirstName"];
    $newLastName = $inData["newLastName"];
    $newEmail = $inData["newEmail"];
    $oldFirstName = $inData["oldFirstName"];
    $oldLastName = $inData["oldLastName"];
    $oldEmail = $inData["oldEmail"];
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
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, email = ? WHERE (FirstName = ? AND LastName = ? AND email = ? AND ID = ?)");
		$stmt->bind_param("ssssssi", $newFirstName, $newLastName, $newEmail, $oldFirstName, $oldLastName, $oldEmail, $userId);
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
