<?php
    $inData = getRequestInfo();  // Gets the request

    // Takes in data from the $inData JSON
    $userId = $inData["userId"];
    $login = $inData["login"];
    $password = $inData["password"];

    // Connects to the database named COP4331
    $connect = new mysqli("localhost" , "User2", "StayProtected", "COP4331");

    if($connect -> connect_error)
    {
        returnWithError($connect -> connect_error);
    }
    else
    {
        $stmt = $connect->prepare("INSERT INTO Users (ID, Login, Password) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $userId, $login, $password);

        // Added the new user to the Users table in the COP4331 database
        $stmt->execute();

        // Ends the connection for stmt and connect
        $stmt->close();
        $connect->close();
        

        successfulMessage($login);
    }

    // Gets the information from the request
    function getRequestInfo()
    {
        return json_decode(file_get_contents("php://input"), true);
    }

    function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}

    function successfulMessage($login)
    {
        $retValue = '{"User":"' . $login . ' Successfully Added"}';
        sendResultInfoAsJson($retValue);
    }
	
	function returnWithError( $err )
	{
		$retValue = '{"error ":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>