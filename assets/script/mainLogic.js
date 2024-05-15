const baseUrl = "https://tarmeezacademy.com/api/v1/"
const addPostButton = document.getElementById("add");
const RegisterButton = document.getElementById("register-btn");
const LoginButton = document.getElementById("login-btn");
const logoutButton = document.getElementById("logout-btn");
const logout = document.getElementById("logout");
const LoginButtonsGroup = document.getElementById("btns-group");


async function login(username, pass) {
  let response = await fetch(`${baseUrl}login`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: username,
      password: pass
    })
  });

  if (response.ok) {
    let data = await response.json();
    window.localStorage.setItem("token", data.token);
    window.localStorage.setItem("user", JSON.stringify(data.user));
    hideModel("loginModel");
    setUiAfterLoginAndRegister();
    showSuccessAlert(`Login successful! Welcome, ${data.user.username} !`);
  } else {
    let data = await response.json();
    showDangerAlert(data.message);
  }
}
