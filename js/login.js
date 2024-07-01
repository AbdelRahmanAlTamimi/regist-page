document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    login();
  });

async function login() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  let data = {
    email: email,
    password: password,
  };

  try {
    let response = await fetch("http://localhost:3000/users");
    let users = await response.json();
    let user = users.find(
      (user) => user.email === data.email && user.password === data.password
    );

    if (user) {
      document.getElementById("login-status").style.color = "green";
      document.getElementById("login-status").innerText = "Login successful!";
      setTimeout(() => {
        window.location.href = `../html/dashboard.html?id=${encodeURIComponent(
          user.id
        )}`;
      }, 1000);
    } else {
      document.getElementById("login-status").style.color = "red";
      document.getElementById("login-status").innerText =
        "Invalid email or password.";
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
