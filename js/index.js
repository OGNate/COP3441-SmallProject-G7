const urlBase = 'http://cop-4331.com/LAMPAPI';

let userId = 0;

function login() {
  
	userId = 0;
	
	let login = document.getElementById("formUsername").value;
	let password = document.getElementById("formPassword").value;
	var hash = md5(password);

	var loginAlert = document.getElementById("loginAlert");

	loginAlert.innerHTML = "";
	loginAlert.style.display = "none";
	loginAlert.classList.remove("alert-success", "alert-danger");

	var tmp = { login: login, password: hash };
	let jsonPayload = JSON.stringify(tmp);
	
	let url = urlBase + '/Login.php';
	let xhr = new XMLHttpRequest();
  
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  
	try {
    
		xhr.onreadystatechange = function() {
      
			if (this.readyState == 4 && this.status == 200) {
        
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.userId;
		
				if (userId < 1) {
					
					loginAlert.classList.add("alert-danger");
					loginAlert.innerHTML = "Invalid username or password!";
					loginAlert.style.display = "block";
					
				} else {
	
					username = login;
					saveCookie();
		
					window.location.href = "contacts.html";
				}
			}
		};
    
		xhr.send(jsonPayload);
    
	} catch(err) {
		loginAlert.classList.add("alert-danger");
		loginAlert.innerHTML = err.message;
		loginAlert.style.display = "block";
	}
}

function register() {
  
	userId = 0;
	
	let login = document.getElementById("registerUsername").value;
	let password = document.getElementById("registerPassword").value;
	var hash = md5(password);
	
	var registerAlert = document.getElementById("registerAlert");

	registerAlert.innerHTML = "";
	registerAlert.style.display = "none";
	
	loginAlert.classList.remove("alert-success", "alert-danger");
	registerAlert.classList.remove("alert-success", "alert-danger");

	var tmp = { login: login, password: hash };
	let jsonPayload = JSON.stringify(tmp);
	
	let url = urlBase + '/Register.php';
	let xhr = new XMLHttpRequest();
  
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  
	try {
    
		xhr.onreadystatechange = function() {
      
			if (this.readyState == 4 && this.status == 200) {

				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.userId;
		
				if (userId < 1) {

					registerAlert.classList.add("alert-danger");
					registerAlert.innerHTML = "Account already exists! Try logging in instead.";
					registerAlert.style.display = "block";
					
				} else {
					
					$('#registerModal').modal('hide');

					loginAlert.classList.add("alert-success");
					loginAlert.innerHTML = "Account successfully created!";
					loginAlert.style.display = "block";
				}
			}
		};
    
		xhr.send(jsonPayload);
    
	} catch(err) {
		registerAlert.classList.add("alert-danger");
		registerAlert.innerHTML = err.message;
	}
}

function saveCookie() {
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
  
	userId = -1;
	let data = document.cookie;
  
	let splits = data.split(",");
  
	for(var i = 0; i < splits.length; i++) {
    
		let currentString = splits[i].trim();

		let tokens = currentString.split("=");
		let tokenKey = tokens[0];
      
		if (tokenKey == "userId" && tokens.length >= 1) {
			userId = parseInt(tokens[1].trim());
		}
	}
	
	if (userId < 0) {
		window.location.href = "index.html";
    
	} else {
		//document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function logout() {
	userId = 0;
	document.cookie = "expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact() {

	readCookie();
  
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	let emailAddress = document.getElementById("emailAddress").value;

	//document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {
		userId: userId,
		contactFirstName: firstName,
		contactLastName: lastName,
		contactEmail: emailAddress
	};

	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/AddContact.php';
	let xhr = new XMLHttpRequest();
  
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  
	try {
    
		xhr.onreadystatechange = function() {
      
			if (this.readyState == 4 && this.status == 200) {
				// updateContacts();
				//document.getElementById("colorAddResult").innerHTML = "Color has been added";

				$('#newContactModal').modal('hide');
			}
		};
    
		xhr.send(jsonPayload);
    
	} catch(err) {
		console.log(err.message);
		//document.getElementById("colorAddResult").innerHTML = err.message;
	}
}

function searchContacts() {

	readCookie();
  
	let srch = document.getElementById("searchBar").value;
	let tmp = { search: srch, userId: userId };

	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SearchContact.php';
	let xhr = new XMLHttpRequest();

	let contacts = [];
	var columns = ["First Name", "Last Name", "Email Address", ""];
  
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
  try {
    
		xhr.onreadystatechange = function() {
      
			if (this.readyState == 4 && this.status == 200) {
        
				let jsonObject = JSON.parse(xhr.responseText);
				contacts = jsonObject.results;

			    // Retrieve the current table
			    var table = document.getElementById("contactsTable");
				
				for (var i = 0; i < contacts.length; i++) {

				    var contact = contacts[i];

				    console.log(contact);

				    // Create a new row for the contact
				    trow = table.insertRow(-1);

				    for (var j = 0; j < columns.length; j++) {

				    	var cell = trow.insertCell(-1);

				    	var curCellVal = "";

				    	switch (j) {

				    		case 0:
				    			curCellVal = contacts[i].FirstName;
				    			break;
				    		case 1:
				    			curCellVal = contacts[i].LastName;
				    			break;
				    		case 2:
				    			curCellVal = contacts[i].Email;
				    			break;
				    		default:
				    			curCellVal = "<button>Test</button> <button>Test2</button>"
				    	}

				    	console.log(curCellVal);
                     
                    	// Inserting the cell at particular place
                    	cell.innerHTML = curCellVal;//contacts[i][columns[j]];
				    }
				}
				
				//document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
    
		xhr.send(jsonPayload);
	
  } catch(err) {
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
}