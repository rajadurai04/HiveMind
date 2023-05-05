const firebaseConfig = {
  apiKey: "AIzaSyDu2PszGK5B_TexALRgxg-QmibugePlpT4",
  authDomain: "hivemind-43a95.firebaseapp.com",
  databaseURL: "https://hivemind-43a95-default-rtdb.firebaseio.com",
  projectId: "hivemind-43a95",
  storageBucket: "hivemind-43a95.appspot.com",
  messagingSenderId: "316978936264",
  appId: "1:316978936264:web:1f24047b964ac276f668fd",
  measurementId: "G-VXHLKX2TMY",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// let's code
var datab = firebase.database().ref("data");
function UserRegister() {
  var email = document.getElementById("eemail").value;
  var password = document.getElementById("lpassword").value;
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(function () {})
    .catch(function (error) {
      var errorcode = error.code;
      var errormsg = error.message;
    });
}
const auth = firebase.auth();
document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();
  var userInfo = datab.push();
  userInfo.set({
    name: getId("fname"),
    email: getId("eemail"),
    password: getId("lpassword"),
  });
  alert("Successfully Signed Up");
  window.location.href = "home.html";
  console.log("sent");
  document.getElementById("form").reset();
});
function getId(id) {
  return document.getElementById(id).value;
}
function login() {
  var email = document.getElementById("eemail");
  var password = document.getElementById("lpassword");
  const promise = auth.signInWithEmailAndPassword(email.value, password.value);
  alert("Signed In " + email.value);
  window.location.href = "home.html";
  promise.catch((e) => alert(e.message));
}
auth.OnAuthStateChanged(function (user) {
  if (user) {
    var email = user.email;
    alert("user " + email);
  } else {
    alert("No User Found");
  }
});
function signout() {
  auth.signOut();
  alert("Signed out");
}
