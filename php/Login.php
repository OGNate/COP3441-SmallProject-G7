<?php

	$inData = getRequestInfo();
	
	$userId = $inData["userId"];
	$login = $inData["login"];
	$password = $inData["password"];

	$conn = new mysqli("localhost", "User2", "StayProtected", "COP4331"); 

	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
        
		$stmt = $conn->prepare("SELECT ID, Login, Password FROM Users WHERE Login=? AND Password =?");
		$stmt->bind_param("ss", $login, $password);
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc()  )
		{
			returnWithInfo( $row['Login'], $row['Password'], $row['ID'] );
		}
		else
		{
			returnWithError("No Records Found");
		}

		$stmt->close();
		$conn->close();
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
		$retValue = '{"userId":-1,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $login, $password, $userId )
	{
		$retValue = '{"userId": ' .$userId. ', "login": "' .$login. '", "password": "' .$password. '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>