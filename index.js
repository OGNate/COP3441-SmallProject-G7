const urlBase = 'http://cop-4331.com/LAMPAPI';

let userId = 0;
let actionId = 0;

function login() {

    userId = 0;

    let login = document.getElementById("formUsername").value;
    let password = document.getElementById("formPassword").value;
    var hash = md5(password);

    var loginAlert = document.getElementById("loginAlert");

    loginAlert.innerHTML = "";
    loginAlert.style.display = "none";
    loginAlert.classList.remove("alert-success", "alert-danger");

    var tmp = {
        login: login,
        password: hash
    };

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

    } catch (err) {
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

    var tmp = {
        login: login,
        password: hash
    };
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

                    loginLink = '<a href="#" id="loginAnchor" data-dismiss="modal">signing in</a>.'

                    registerAlert.classList.add("alert-danger");
                    registerAlert.innerHTML = "Username already exists! Select a different username or try " + loginLink;
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

    } catch (err) {
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

    for (var i = 0; i < splits.length; i++) {

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

function updateActionId(element) {

    parentNode = element.parentNode;
    contactId = parentNode.parentNode.id;

    idStrArray = contactId.split("contact");

    if (idStrArray.length > 1) {
        actionId = parseInt(idStrArray[1]);
    }
}

function addContact() {

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

                updateContactList();
                //document.getElementById("colorAddResult").innerHTML = "Color has been added";

                $('#newContactModal').modal('hide');
            }
        };

        xhr.send(jsonPayload);

    } catch (err) {
        console.log(err.message);
        //document.getElementById("colorAddResult").innerHTML = err.message;
    }
}

function updateContactList() {
    searchContactList("");
}

function searchContacts() {
    let srch = document.getElementById("searchBar").value;
    searchContactList(srch);
}

function searchContactList(searchTerm) {

    let tmp = {
        search: searchTerm,
        userId: userId
    };

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
                
                $("#contactsTable tbody").remove();
                // 15 PM ContactHub

                let jsonObject = JSON.parse(xhr.responseText);
                contacts = jsonObject.results;

                // Retrieve the current table
                var table = document.getElementById("contactsTable");
                let tableBody = table.createTBody();

                for (var i = 0; i < contacts.length; i++) {

                    var contact = contacts[i];

                    // Create a new row for the contact
                    trow = tableBody.insertRow(-1);
                    trow.id = "contact" + contact.ContactID;

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
                                curCellVal = document.getElementById("contactActionTemplate").innerHTML;
                        }

                        // Inserting the cell at particular place
                        cell.innerHTML = curCellVal; //contacts[i][columns[j]];
                    }
                }

                //document.getElementsByTagName("p")[0].innerHTML = colorList;
            }
        };

        xhr.send(jsonPayload);

    } catch (err) {
        document.getElementById("contactResult").innerHTML = err.message;
    }
}

function updateEditForm(element) {

    updateActionId(element);

    var nearestRow = element.closest('tr');
    var tableFields = nearestRow.getElementsByTagName('td');

    // Fill form with loaded contact data
    document.getElementById("newFirstName").value = tableFields[0].innerHTML;
    document.getElementById("newLastName").value = tableFields[1].innerHTML;
    document.getElementById("newEmailAddress").value = tableFields[2].innerHTML;
}

function editContact() {

    let newFirst = document.getElementById("newFirstName").value;
    let newLast = document.getElementById("newLastName").value;
    let newEmailAddress = document.getElementById("newEmailAddress").value;

    let tmp = {
        userId: userId,
        ID: actionId,
        newFirstName: newFirst,
        newLastName: newLast,
        newEmail: newEmailAddress
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/EditContact.php';
    let xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {

        xhr.onreadystatechange = function() {

            if (this.readyState == 4 && this.status == 200) {

                updateContactList();
                //document.getElementById("colorAddResult").innerHTML = "Color has been added";

                $('#editContactModal').modal('hide');
            }
        };

        xhr.send(jsonPayload);

    } catch (err) {
        console.log(err.message);
        //document.getElementById("colorAddResult").innerHTML = err.message;
    }
}

function deleteContact() {
    
    let tmp = {
        userId: userId,
        ID: actionId
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/DeleteContact.php';
    let xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {

        xhr.onreadystatechange = function() {

            if (this.readyState == 4 && this.status == 200) {

                $('#deleteContactModal').modal('hide');
                
                //document.getElementById("contact" + actionId).remove();
                updateContactList();
            }
        };

        xhr.send(jsonPayload);

    } catch (err) {
        console.log(err.message);
        //document.getElementById("colorAddResult").innerHTML = err.message;
    }
}