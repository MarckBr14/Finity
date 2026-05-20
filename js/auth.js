const token = localStorage.getItem("token");

if (!token) {

    redirecionarLogin();

}

function redirecionarLogin() {

    localStorage.clear();

    window.location.href = "/html/login.html";
}