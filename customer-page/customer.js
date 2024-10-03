document.addEventListener('DOMContentLoaded', function () {
    const logoutBtn = document.getElementById('logoutBtn');
    const userInfo = document.getElementById('userInfo');

    // Retrieve current user information from session storage
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    // Retrieve motorbikes from local storage
    let motorbikes = JSON.parse(localStorage.getItem('bikes')) || [];

    // Initialize rentals array from local storage or create a new one
    let rentals = JSON.parse(localStorage.getItem('rentals')) || [];

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            sessionStorage.removeItem('currentUser'); // Remove user session data
            window.location.href = '../bikerent-greetingpage.html'; // Redirect to the greeting page
        });
    }

    // Display user information if available
    if (userInfo && currentUser) {
        userInfo.textContent = `${currentUser.username}`;
    }

    // Customer page functionality
    const availableMotorbikeBody = document.getElementById('rent-container');
    const myRentalsTableBody = document.getElementById('myRentalsTableBody');

    // Display available motorbikes with search filtering
    function displayAvailableMotorbikes() {
        const searchBar = document.getElementById('searchBar');
        const searchQuery = searchBar.value.toLowerCase(); // Get and normalize the search query

        availableMotorbikeBody.innerHTML = ''; // Clear previous content

        motorbikes.forEach(motorbike => {
            // Check if the motorbike matches the search query and is not rented
            if (!isMotorbikeRented(motorbike.regNumber) &&
                (motorbike.title.toLowerCase().includes(searchQuery) ||
                    motorbike.description.toLowerCase().includes(searchQuery) ||
                    motorbike.model.toLowerCase().includes(searchQuery) ||
                    motorbike.brand.toLowerCase().includes(searchQuery) ||
                    motorbike.category.toLowerCase().includes(searchQuery))) {

                const bikeBox = document.createElement('div');
                bikeBox.classList.add('rent-box');
                bikeBox.innerHTML = `
                <img src="${motorbike.image}" alt="${motorbike.title}">
                <div class="rent-layer">
                    <h4>${motorbike.title}</h4>
                    <p>${motorbike.description}</p>
                    <p>Model: ${motorbike.model}</p>
                    <p>Brand: ${motorbike.brand}</p>
                    <p>Category: ${motorbike.category}</p>
                    <a href="#" onclick="rentMotorbike('${motorbike.regNumber}')"><i class='bx bx-link-external'></i></a>
                </div>
            `;
                availableMotorbikeBody.appendChild(bikeBox); // Append bike card to container
            }
        });
    }

    // Event listener to trigger the display function when the search query changes
    document.getElementById('searchBar').addEventListener('input', displayAvailableMotorbikes);



    // Check if a motorbike is currently rented
    function isMotorbikeRented(regNumber) {
        return rentals.some(rental => rental.regNumber === regNumber);
    }

    // Rent a motorbike
    window.rentMotorbike = function (regNumber) {
        const rental = {
            regNumber,
            username: currentUser.username,
            nic: currentUser.nic,
            number: currentUser.number,
            rentDate: new Date().toLocaleDateString(),
            status: "Pending" // Set initial status as "Pending"
        };
        rentals.push(rental); // Add new rental
        localStorage.setItem('rentals', JSON.stringify(rentals)); // Save rentals to local storage
        displayAvailableMotorbikes(); // Refresh available motorbikes display
     // Refresh user's rentals display
    };

    // Display user's rentals in a modal window
    function displayMyRentals() {
        document.getElementById('profileModal').style.display = 'none';

        if (!myRentalsTableBody) return; // Check if myRentalsTableBody exists
        myRentalsTableBody.innerHTML = ''; // Clear previous content

        rentals.forEach((rental, index) => {
            if (rental.username === currentUser.username) {
                const motorbike = motorbikes.find(mb => mb.regNumber === rental.regNumber);
                if (motorbike) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${motorbike.regNumber}</td>
                        <td>${motorbike.brand}</td>
                        <td>${motorbike.model}</td>
                        <td>${motorbike.category}</td>
                        <td>${rental.rentDate}</td>
                <td>${rental.status}</td> <!-- Display the rental status -->

                    `;
                    console.log(rental.status);
                    
                    myRentalsTableBody.appendChild(row); // Append row to rentals table
                }
            }
        });

        rentalsModal.style.display = 'block'; // Show the modal
    }

    // Event listener to close the modal
    closeRentalsModal.addEventListener('click', function () {
        rentalsModal.style.display = 'none'; // Hide the modal
    });

    // Optional: Close the modal if the user clicks outside the modal content
    window.addEventListener('click', function (event) {
        if (event.target === rentalsModal) {
            rentalsModal.style.display = 'none'; // Hide the modal
        }
    });

    document.getElementById('rentalhistory').addEventListener('click', displayMyRentals);
 // Initial display of user's rentals


    // Initialize displays on page load
    window.onload = function () {
        displayMyRentals(); 
        displayAvailableMotorbikes(); // Initial display of available motorbikes
    };
});


document.addEventListener('DOMContentLoaded', function () {
    const profileModal = document.getElementById('profileModal');
    const editProfileForm = document.getElementById('editProfileForm');
    const closeBtn = document.querySelector('.close');
    const userInfo = document.getElementById('userInfo');



    // Retrieve current user information from session storage
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    // Function to open the modal and populate the form
    function openProfileModal() {
        document.getElementById('rentalsModal').style.display = 'none';

        if (currentUser) {
            document.getElementById('username').value = currentUser.username || '';
            document.getElementById('nic').value = currentUser.nic || '';
            document.getElementById('number').value = currentUser.number || '';
            document.getElementById('password').value = currentUser.password || '';
        }
        profileModal.style.display = 'block'; // Show the modal
    }

    // Function to close the modal
    function closeProfileModal() {
        profileModal.style.display = 'none'; // Hide the modal
    }

    // Event listener for profile link to open the modal
    userInfo.addEventListener('click', openProfileModal);

    // Event listener for close button to close the modal
    closeBtn.addEventListener('click', closeProfileModal);

    // Event listener to close the modal if clicked outside of the content area
    window.addEventListener('click', function (event) {
        if (event.target === profileModal) {
            closeProfileModal();
        }
    });

    // Handle form submission for editing profile
    editProfileForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission

        // Get updated user information from form fields
        const updatedUser = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value
        };

        // Update session storage with the new user information
        sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));

        // Update user info on the page
        userInfo.textContent = updatedUser.username;

        // Close the modal
        closeProfileModal();

        alert('Profile updated successfully!');
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const myRentalsTableBody = document.getElementById('myRentalsTableBody');
    const rentalsModal = document.getElementById('rentalsModal');
    const closeRentalsModal = document.getElementById('closeRentalsModal');


    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const rentals = JSON.parse(localStorage.getItem('rentals')) || [];
    const motorbikes = JSON.parse(localStorage.getItem('bikes')) || [];

    
    
});
