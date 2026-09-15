async function hashPassword(password) {
    const data = new TextEncoder().encode(password);
    const hash = await crypto.subtle.digest("SHA-256", data);

    return Array.from(new Uint8Array(hash))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const username = document.getElementById("registerUsername").value.trim();
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const message = document.getElementById("registerMessage");

        if (username === "" || password === "" || confirmPassword === "") {
            message.textContent = "Please fill in all fields.";
            message.style.color = "red";
            return;
        }

        if (password.length < 8) {
            message.textContent = "Password must contain at least 8 characters.";
            message.style.color = "red";
            return;
        }

        if (!/[0-9]/.test(password)) {
            message.textContent = "Password must contain at least 1 number.";
            message.style.color = "red";
            return;
        }

        if (password !== confirmPassword) {
            message.textContent = "Passwords do not match.";
            message.style.color = "red";
            return;
        }

        const users = getUsers();

        const existingUser = users.find(
            user => user.username.toLowerCase() === username.toLowerCase()
        );

        if (existingUser) {
            message.textContent = "Username or email already exists.";
            message.style.color = "red";
            return;
        }

        const hashedPassword = await hashPassword(password);

        users.push({
            username: username,
            password: hashedPassword
        });

        saveUsers(users);

        message.textContent = "Registration successful!";
        message.style.color = "green";

        registerForm.reset();

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);
    });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const username = document.getElementById("loginUsername").value.trim();
        const password = document.getElementById("loginPassword").value;
        const message = document.getElementById("loginMessage");

        if (username === "" || password === "") {
            message.textContent = "Please enter username/email and password.";
            message.style.color = "red";
            return;
        }

        const users = getUsers();
        const hashedPassword = await hashPassword(password);

        const user = users.find(
            user =>
                user.username.toLowerCase() === username.toLowerCase() &&
                user.password === hashedPassword
        );

        if (!user) {
            message.textContent = "Invalid username/email or password.";
            message.style.color = "red";
            return;
        }

        localStorage.setItem("loggedInUser", user.username);

        window.location.href = "dashboard.html";
    });
}

if (window.location.pathname.endsWith("dashboard.html")) {
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (!loggedInUser) {
        window.location.href = "login.html";
    } else {
        const welcomeMessage = document.getElementById("welcomeMessage");
        welcomeMessage.textContent = "Logged in as: " + loggedInUser;
    }
}

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
    logoutButton.addEventListener("click", function() {
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    });
}