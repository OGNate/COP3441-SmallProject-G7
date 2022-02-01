<?php

	#Gets data from json object from front end and stores it in inData
	$inData = getRequestInfo();

	$searchResults = "";
	$searchCount = 0;
	
	#Gathers the search key from the user
	#Can be sequence of characters in either first name, last name, or email
	$search_key = $inData["search"];

	#Creates a connection to the database
	$conn = new mysqli("localhost", "User2", "StayProtected", "COP4331");

	if ($conn->connect_error) 
	{
		#If connection fails. close connection and display error message
		returnWithError( $conn->connect_error );
	} 

	else
	{

		//Selects rows from Contacts table where search key is contained in either FirstName, LastLame, or email and where user ID matches
		$stmt = $conn->prepare("SELECT * FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ? OR email LIKE ?) AND ID = ?");
		$search_key = "%" . $search_key . "%";
		$stmt->bind_param("sssi", $search_key, $search_key, $search_key, $inData["userId"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		

		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= 
			'{
				"FirstName": "' . $row["FirstName"] . '",
				"LastName": "' . $row["LastName"] . '",
				"Email": "' . $row["email"] . '"
			}';
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResult );
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
		$retValue = 
		'{
			"ID":0,
			"FirstName":"",
			"LastName":"",
			"email":"",
			"error":"' . $err . '"
		}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = 
		'{
			"results":[' . $searchResults . '],
			"error":""
		}';
		sendResultInfoAsJson( $retValue );
	}

?>
