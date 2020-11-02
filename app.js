// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
	apiKey: "AIzaSyByfIsaRRNC7pHMItzJkKoTyRM6DWBOcLg",
	authDomain: "hyperultratest.firebaseapp.com",
	databaseURL: "https://hyperultratest.firebaseio.com",
	projectId: "hyperultratest",
	storageBucket: "hyperultratest.appspot.com",
	messagingSenderId: "207712207231",
	appId: "1:207712207231:web:c920bdae91bb36c5899a4a",
	measurementId: "G-X23FGNS7CT"
};

firebase.initializeApp(firebaseConfig);



// Firebase Database Reference and the child
const dbRef = firebase.database().ref();
const usersRef = dbRef.child('users');






readUserData();

// --------------------------
// READ
// --------------------------
// function readUserData() {

//     const userListUI = document.getElementById("user-list");

//     usersRef.on("value", snap => {
//         userListUI.innerHTML = ""

//         snap.forEach(childSnap => {
//             let key = childSnap.key,
//                 value = childSnap.val()
//             let $li = document.createElement("li");


//             $li.innerHTML = value.name;


//             $li.setAttribute("user-key", key);
//             // $li.addEventListener("click", userClicked)
//             userListUI.append($li);

//          });
//     })
// }

// --------------------------
// READ
// --------------------------
function readUserData() {

	const userListUI = document.getElementById("user-list");

	usersRef.on("value", snap => {
		userListUI.innerHTML = ""

		snap.forEach(childSnap => {
			let key = childSnap.key,
				value = childSnap.val()
			let $li = document.createElement("li");

			// edit icon
			let editIconUI = document.createElement("span");
			editIconUI.class = "edit-user";
			editIconUI.innerHTML = " ✎";
			editIconUI.setAttribute("userid", key);
			editIconUI.addEventListener("click", editButtonClicked)

			// delete icon
			let deleteIconUI = document.createElement("span");
			deleteIconUI.class = "delete-user";
			deleteIconUI.innerHTML = " ☓";
			deleteIconUI.setAttribute("userid", key);
			deleteIconUI.addEventListener("click", deleteButtonClicked)


			$li.innerHTML = value.name;
			$li.append(editIconUI);
			$li.append(deleteIconUI);

			$li.setAttribute("user-key", key);
			$li.addEventListener("click", userClicked)
			userListUI.append($li);

		});
	})
}



// --------------------------
// DISPLAY USER INFO
// --------------------------
function userClicked(event) {
	var userID = event.target.getAttribute("user-key");
	const userRef = dbRef.child('users/' + userID);
	const userDetailUI = document.getElementById("user-detail");

	userRef.on("value", snap => {

		userDetailUI.innerHTML = ""

		snap.forEach(childSnap => {
			var $p = document.createElement("p");
			$p.innerHTML = childSnap.key + " - " + childSnap.val();
			userDetailUI.append($p);
		})
	});
}
// --------------------------
// ADD
// --------------------------

const addUserBtnUI = document.getElementById("add-user-btn");
addUserBtnUI.addEventListener("click", addUserBtnClicked)

function addUserBtnClicked() {

	const usersRef = dbRef.child('users');
	const addUserInputsUI = document.getElementsByClassName("user-input");
	// Cet objet va stocker les infos du nouvel utilisateur
	let newUser = {};
	// On fait une boucle pour récupérer les valeurs de chaque input dans le formulaire
	for (let i = 0, len = addUserInputsUI.length; i < len; i++) {
		// Ci dessous on récupère les key et value
		let key = addUserInputsUI[i].getAttribute('data-key');
		let value = addUserInputsUI[i].value;
		// Pour chaque CLé (age, name, et email on les associe à notre nouvel utilisateur)
		newUser[key] = value;
	}
	// on ajoute notre nouvel utilisateur dans la BDD
	usersRef.push(newUser);
	console.log("New User SAVED");
	console.log(`${newUser.name} il a ${newUser.age} ans`);
	document.getElementById('leFormulaireAjout').reset();
}

// --------------------------
// DELETE
// --------------------------
function deleteButtonClicked(event) {

	// e.stopPropagation();
	var userID = event.target.getAttribute("userid");
	const userRef = dbRef.child('users/' + userID);
	console.log(event)
	console.log(`ADIOS ${event.path[1].innerText}`);
	userRef.remove();
}


// --------------------------
// EDIT
// --------------------------
function editButtonClicked(e) {

	document.getElementById('edit-user-module').style.display = "block";

	//setup du userID sur le input caché hidden
	document.querySelector(".edit-userid").value = e.target.getAttribute("userid");

	const userRef = dbRef.child('users/' + e.target.getAttribute("userid"));

	// setup  des données sur les champs utilisateurs
	const editUserInputsUI = document.querySelectorAll(".edit-user-input");

	userRef.on("value", snap => {

		for (var i = 0, len = editUserInputsUI.length; i < len; i++) {

			var key = editUserInputsUI[i].getAttribute("data-key");
			editUserInputsUI[i].value = snap.val()[key];
		}

	});

	const saveBtn = document.querySelector("#edit-user-btn");
	saveBtn.addEventListener("click", saveUserBtnClicked)
}


// --------------------------
// EDIT - SAVE
// --------------------------
function saveUserBtnClicked(element) {

	const userID = document.querySelector(".edit-userid").value;
	const userRef = dbRef.child('users/' + userID);

	var editedUserObject = {};

	const editUserInputsUI = document.querySelectorAll(".edit-user-input");

	editUserInputsUI.forEach(function (textField) {
		let key = textField.getAttribute("data-key");
		let value = textField.value;
		// editedUserObject[textField.getAttribute("data-key")] = textField.value
		editedUserObject[key] = textField.value;
	});

	userRef.update(editedUserObject);
	console.log("USER UPDATED")
	document.getElementById('edit-user-module').style.display = "none";
}
