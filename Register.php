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
		$connect->close();
    }
    else
    {
		// Runs if the Login crediential does not already exist
		if(isLoginAvailable($connect, $login)) 
		{
			// Creates a new userId for the new user by getting the last ID in the database
			// and then incrementing it by 1
			$newUserId = getLastID($connect) + 1;

			$stmt = $connect->prepare("INSERT INTO Users (ID, Login, Password) VALUES (?, ?, ?)");
			$stmt->bind_param("iss", $newUserId, $login, $password);
	
			// Added the new user to the Users table in the COP4331 database
			$stmt->execute();
	
			// Ends the connection for stmt and connect
			$stmt->close();

			// Sends a JSON saying the User has been successfully created
			//successfulMessage($login);
			returnWithInfo($newUserId, $login, $password);
		}
		else
		{
			returnWithError("Login Credentials Already Exist, Try Different Credentials");
		}
		
		// Close the connection
		$connect->close();
    }

	// @param -> $connect: Connection to the database
	// @param -> $login: Login Credential being checked if it exists or not
	// @return -> Boolean: 
	//				-> True: If the Login credentials do not already exist
	//				-> False: If the Login credentials already exist
	function isLoginAvailable($connect, $login)
	{
		// Prepares a query to the database looking for a User with the Login equal to $login
		$stmt = $connect->prepare("SELECT * FROM Users WHERE Login = ?");
		$stmt->bind_param("s", $login);
		$stmt->execute();

		// Gets the results from the query
		$result = $stmt->get_result();

		// Closes the stmt
		$stmt->close();

		// If there is a user with the same Login, False is returned else True is returned
		if($result->fetch_assoc()) return False;
		else return True;
	}

	// @param -> $connect: Connection to the Database
	// @return -> UserID: Returns the last UserID in the Users Table in the COP4331 Database
	function getLastID($connect)
	{
		// Prepares a query to the Database finding the User with largest user ID
		$stmt = $connect->prepare("SELECT * FROM Users ORDER BY ID DESC LIMIT 1");
		$stmt->execute();
		$result = $stmt->get_result();

		// Retrieves the last entry based on userID
		$lastEntry = $result->fetch_assoc();

		// Returns the last UserID found
		return $lastEntry["ID"];
	}


	function returnWithInfo($userId, $login, $password) 
	{
		$returnVal = '{"userId": ' .$userId. ', "login": "' .$login. '", "password": "' .$password. '", "message": "' .$login. ' successfully created"}';
		sendResultInfoAsJson($returnVal);
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
		$retValue = '{"userId": -1, "error ":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>