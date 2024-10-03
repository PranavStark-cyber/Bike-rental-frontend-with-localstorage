document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const userInfo = document.getElementById('userInfo');

    // Load data from localStorage
    let users = JSON.parse(localStorage.getItem('customers')) || [];
    let motorbikes = JSON.parse(localStorage.getItem('bikes')) || [];
    let rentals = JSON.parse(localStorage.getItem('rentals')) || [];

    // Check if user is logged in
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        if (currentUser === 'customer') {
            window.location.href = './customer-page/customer.html';
        }
    }

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = './customer-page/customer.html';
            } else {
                alert('Invalid credentials');
            }
        });
    }

    // Register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;
            const nic = document.getElementById('registerNIC').value;
            const number = document.getElementById('registernumber').value;
            const licence = document.getElementById('registerlicence').value;


            if (users.some(u => u.username === username)) {
                alert('Username already exists');
                return;
            }

            const newUser = { username, password, nic, number, licence };
            users.push(newUser);
            localStorage.setItem('customers', JSON.stringify(users));
            alert('Registration successful. Please login.');
            registerForm.reset();
        });
    }

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            sessionStorage.removeItem('currentUser');
            window.location.href = '../bikerent-greetingpage.html';
        });
    }

    // Display user info
    if (userInfo && currentUser) {
        userInfo.textContent = `${currentUser.username}`;
    }


    // Customer functionality
    if (window.location.pathname.includes('./customer-page/customer.html')) {
        const availableMotorbikeBody = document.getElementById('rent-container');
        const myRentalsTableBody = document.getElementById('myRentalsTableBody');

        // Display available motorbikes
        function displayAvailableMotorbikes() {
            availableMotorbikeBody.innerHTML = '';
            motorbikes.forEach((motorbike, index) => {
                if (!isMotorbikeRented(motorbike.regNumber)) {
                    const bikeBox = document.createElement('div');
                    bikeBox.classList.add('rent-box');
                    bikeBox.innerHTML = `
                    <img src="${bike.image}" alt="${bike.title}">
            <div class="rent-layer">
                <h4>${motorbike.title}</h4>
                <p>${motorbike.description}</p>
                 <p>${motorbike.model}</p>
                  <p>${motorbike.brand}</p>
                   <p>${motorbike.category}</p>   
                <a href="#" onclick="rentMotorbike('${motorbike.regNumber}')" ><i class='bx bx-link-external'>Rent</i></a>
            </div>
                    `;
                    availableMotorbikeBody.appendChild(bikeBox);
                }
            });
        }

        // Check if motorbike is rented
        function isMotorbikeRented(regNumber) {
            return rentals.some(rental => rental.regNumber === regNumber);
        }

        // Rent motorbike
        window.rentMotorbike = function (regNumber) {
            const rental = {
                regNumber,
                username: currentUser.username,
                rentDate: new Date().toLocaleDateString()
            };
            rentals.push(rental);
            localStorage.setItem('rentals', JSON.stringify(rentals));
            displayAvailableMotorbikes();
            displayMyRentals();
        };

        // Display user's rentals
        function displayMyRentals() {
            myRentalsTableBody.innerHTML = '';
            rentals.forEach((rental, index) => {
                if (rental.username === currentUser.username) {
                    const motorbike = motorbikes.find(mb => mb.regNumber === rental.regNumber);
                    const row = document.createElement('tr');
                    row.innerHTML = `
                          <td>${motorbike.regNumber}</td>
                          <td>${motorbike.brand}</td>
                          <td>${motorbike.model}</td>
                          <td>${motorbike.category}</td>
                          <td>${rental.rentDate}</td>
                          <td><button class="btn btn-danger btn-sm" onclick="returnMotorbike(${index})">Return</button></td>
                      `;
                    myRentalsTableBody.appendChild(row);
                }
            });
        }
        displayAvailableMotorbikes();
        displayMyRentals();
    }
});



