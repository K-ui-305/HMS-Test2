// all global variable declarations
let allUserInfo = [];
let regForm = document.querySelector(".reg-form");
let loginForm = document.querySelector(".login-form");
let allInput = regForm.querySelectorAll("input");
let allLoginInput = loginForm.querySelectorAll("input");
let regBtn = regForm.querySelector("button");
let loginBtn = loginForm.querySelector("button");

// On page load, initialize `allUserInfo` with data from localStorage if it exists
document.addEventListener("DOMContentLoaded", () => {
    const savedUsers = localStorage.getItem("users");
    allUserInfo = savedUsers ? JSON.parse(savedUsers) : [];
});

// Update localStorage with the new user after registration
function saveUserData(user) {
    allUserInfo.push(user);
    localStorage.setItem("users", JSON.stringify(allUserInfo)); // Store updated users in localStorage
}

// Registration button text update and disable during processing
regForm.onsubmit = (e) => {
    e.preventDefault();

    const email = allInput[4].value;
    const password = allInput[5].value;
    if (!validateEmail(email)) {
        swal("Failed!", "Please enter a valid email", "warning");
        return;
    }

    if (password.length < 6) {
        swal("Failed!", "Password must be at least 6 characters long", "warning");
        return;
    }

    let checkEmail = allUserInfo.find((data) => data.email === email);
    if (checkEmail === undefined) {
        let data = {};
        allInput.forEach((el) => {
            data[el.name] = el.value;
        });

        regBtn.innerText = "Processing....";
        regBtn.disabled = true; // Disable button to prevent multiple submissions

        setTimeout(() => {
            fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
                .then(response => response.json())
                .then(result => {
                    regBtn.disabled = false;
                    regBtn.innerText = "Register";
                    if (result.message === 'User created successfully') {
                        saveUserData(result.user); // Save user data after successful registration
                        swal("Good Job!", 'Registration success', 'success');
                    } else {
                        swal("Failed!", 'Registration failed', 'warning');
                    }
                })
                .catch(error => {
                    regBtn.disabled = false;
                    regBtn.innerText = "Register";
                    swal("Error", 'Something went wrong', 'error');
                });
        }, 2000);
    } else {
        swal("Failed!", "Already Registered", "warning");
    }
};


// Login success, save token in sessionStorage
loginBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const loginData = {
        email: allLoginInput[0].value,
        password: allLoginInput[1].value,
    };

    if (!loginData.email || !loginData.password) {
        swal("Failed!", "Both fields are required", "warning");
        return;
    }

    loginBtn.innerText = "Logging in...";
    loginBtn.disabled = true;

    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
    })
        .then(response => response.json())
        .then(result => {
            loginBtn.disabled = false;
            loginBtn.innerText = "Login";
            if (result.message === 'Login successful') {
                sessionStorage.setItem("token", result.token); // Store the JWT token
                sessionStorage.setItem("user", JSON.stringify(result.user)); // Store the user data
                window.location = "profile/profile.html"; // Redirect to profile
            } else {
                swal("Warning", 'Wrong credentials', 'warning');
            }
        })
        .catch(error => {
            loginBtn.disabled = false;
            loginBtn.innerText = "Login";
            swal("Error", 'Something went wrong', 'error');
        });
});

function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}
