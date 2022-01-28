<?php

    # Gets data from the json sent by the front end.
    $inData = getRequestInfo();

    # Gathers identifying data about the User
    $userId = $inData["userId"];
    $login = $inData["login"];
    
    # Gathers information about the contact the User wants to add
    $newContactFirstName = $inData["contactFirstName"];
    $newContactLastName = $inData["contactLastName"];
    $newContactEmail = $inData["contactEmail"];

    # Creates a connection to the database using the given credentials.
    $connection = new mysqli("localhost", "User2", "StayProtected", "COP4331");

    if($connection -> connect_error)
    {
        # Returns an error message on why there is an eror and the closes the connection.
        returnWithError($connection -> connect_error);
        $connection->close();   
    }
    else
    {
        # Prepares and inserts a new contact into the Contacts Table in the database
        $stmt = $connection->prepare("INSERT INTO Contacts (ID, FirstName, LastName, email) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $userId, $newContactFirstName, $newContactLastName, $newContactEmail);
        $stmt->execute();

        # Closes the statement variable and the connection to the database
        $stmt->close();
        $connection->close();

        # Displays and returns information about the operation to the front-end
        successfullyAddedContact($login, $userId, $newContactFirstName, $newContactLastName, $email);
    }    


    function successfullyAddedContact($login, $userId, $newContactFirstName, $newContactLastName, $newContactEmail)
    {
        $returnVal = 
        '{
            "login": "' .$login. '", 
            "userId": "' .$userId.'",
            "newContactFirstName": "' .$newContactFirstName.'",
            "newContactLastName": "' .$newContactLastName. '",
            "newContactEmail": "' .$newContactEmail. '",
            "Message": "' .$newContactFirstName. ', ' .$newContactLastName. ' added as ' .$login. ' contact successfully."
        }';

        # Submits the $returnVal to be sent as a JSON back to the front-end.
        sendResultInfoAsJson($returnVal);	

    }

    function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

    function returnWithError( $err )
	{
		$retValue = '{"error ":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

    function getRequestInfo()
    {
        return json_decode(file_get_contents("php://input"), true);
    }


?>