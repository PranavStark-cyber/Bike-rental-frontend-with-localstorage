

function dashboardshow() {
    document.getElementById('dashboardcontainer').style.display = 'block';
    document.getElementById('customerdcontainer').style.display = 'none';
    document.getElementById('rentaldcontainer').style.display = 'none';
    document.getElementById('overduedcontainer').style.display = 'none';
    document.getElementById('returncontainer').style.display = 'none';
    document.getElementById('generatecontainer').style.display = 'none';

    // console.log("tamil");
}

document.addEventListener('DOMContentLoaded', function () {
    const addBikeForm = document.getElementById('add-bike-form');
    const bikesTableBody = document.getElementById('bikes-table').querySelector('tbody');

    // Hardcoded bike data

    // Function to display bikes in the table
    function displayBikes() {
        const bikes = JSON.parse(localStorage.getItem('bikes')) || [];
        bikesTableBody.innerHTML = ''; // Clear existing rows

        bikes.forEach((bike, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${bike.image}" alt="Bike Image" style="width: 100px; height: auto;"></td>
                <td>${bike.title}</td>
                <td>${bike.description}</td>
                <td>${bike.regNumber}</td>
                <td>${bike.brand}</td>
                <td>${bike.model}</td>
                <td>${bike.category}</td>
                <td><button class="delete-button" data-index="${index}">Delete</button></td>
            `;
            bikesTableBody.appendChild(row);
        });

        // Add event listeners for delete buttons
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', function () {
                const index = this.getAttribute('data-index');
                const bikes = JSON.parse(localStorage.getItem('bikes')) || [];
                bikes.splice(index, 1);
                localStorage.setItem('bikes', JSON.stringify(bikes));
                displayBikes(); // Refresh the table
            });
        });
    }

    // Initialize bikes in localStorage if empty
    function initializeBikes() {
        const bikes = JSON.parse(localStorage.getItem('bikes'));
        if (!bikes || bikes.length === 0) {
            localStorage.setItem('bikes', JSON.stringify(initialBikes));
        }
    }

    addBikeForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const title = document.getElementById('add-bike-title').value.trim();
        const description = document.getElementById('add-bike-description').value.trim();
        const regNumber = document.getElementById('add-bike-reg-number').value.trim();
        const brand = document.getElementById('add-bike-brand').value.trim();
        const model = document.getElementById('add-bike-model').value.trim();
        const category = document.getElementById('add-bike-category').value.trim();
        const imageInput = document.getElementById('add-bike-image');

        if (!title || !description || !regNumber || !brand || !model || !category) {
            alert('All fields are required.');
            return;
        }

        // Convert image to Base64
        const reader = new FileReader();
        reader.onloadend = function () {
            const base64Image = reader.result;

            // Retrieve existing bikes or initialize an empty array
            const bikes = JSON.parse(localStorage.getItem('bikes')) || [];

            // Add new bike to the array
            bikes.push({ image: base64Image, title, description, regNumber, brand, model, category });

            // Store updated array back in localStorage
            localStorage.setItem('bikes', JSON.stringify(bikes));

            addBikeForm.reset();
            displayBikes(); // Refresh the table
        };

        if (imageInput.files[0]) {
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            alert('Please choose an image file.');
        }
    });

    // Initialize bikes and display them
    initializeBikes();
    displayBikes();
});

function updateCustomerWithRentalHistory() {
    let customers = JSON.parse(localStorage.getItem('customers')) || [];
    let rentals = JSON.parse(localStorage.getItem('rentals')) || [];

    // Add rental history to each customer
    customers = customers.map(customer => {
        const customerRentals = rentals.filter(rental => rental.nic === customer.nic);
        const rentalHistory = customerRentals.map(rental => ({
            regNumber: rental.regNumber,
            rentDate: rental.rentDate
        }));
        return {
            ...customer,
            rentalHistory
        };
    });

    // Save updated customers array back to localStorage
    localStorage.setItem('customers', JSON.stringify(customers));
}

// Call this function once to update the data
updateCustomerWithRentalHistory();



// customer show
function customershow() {
    document.getElementById('customerdcontainer').style.display = 'block';
    document.getElementById('dashboardcontainer').style.display = 'none';
    document.getElementById('rentaldcontainer').style.display = 'none';
    document.getElementById('overduedcontainer').style.display = 'none';
    document.getElementById('generatecontainer').style.display = 'none';
    document.getElementById('returncontainer').style.display = 'none';
}

function displayCustomers() {
    let customers = JSON.parse(localStorage.getItem('customers')) || [];
    let rentals = JSON.parse(localStorage.getItem('rentals')) || [];
    const customerTable = document.getElementById('customer-body');
    customerTable.innerHTML = '';

    customers.forEach(customer => {
        const row = document.createElement('tr');
        // Find rentals for the current customer
        const customerRentals = rentals.filter(rental => rental.nic === customer.nic);

        let rentalHistory = '<ul>';
        customerRentals.forEach(rental => {
            rentalHistory += `<li> Reg: ${rental.regNumber},Date: ${rental.rentDate}</li>`;
        });
        rentalHistory += '</ul>';

        row.innerHTML = `
            <td>${customer.username}</td>
            <td>${customer.nic}</td>
            <td>${customer.licence}</td>        
            <td>${customer.number}</td>
            <td>${rentalHistory}</td>
        `;
        customerTable.appendChild(row);
    });

    if (customers.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="6">No customers found.</td>';
        customerTable.appendChild(row);
    }
}

displayCustomers(); 
// Load customers on page load
window.onload = displayCustomers;




// rental show function
// Function to show the rental section and hide others
function rentalshow() {
    document.getElementById('dashboardcontainer').style.display = 'none';
    document.getElementById('customerdcontainer').style.display = 'none';
    document.getElementById('rentaldcontainer').style.display = 'block';
    document.getElementById('overduedcontainer').style.display = 'none';
    document.getElementById('generatecontainer').style.display = 'none';
    document.getElementById('returncontainer').style.display = 'none';
}

// Function to display all rentals in the manager's dashboard
function displayrentals() {
    let rentals = JSON.parse(localStorage.getItem('rentals')) || [];
    const rentalTable = document.getElementById('rental-body');
    rentalTable.innerHTML = '';
console.log(rentals)
    rentals.forEach((rental, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${rental.nic}</td>
            <td>${rental.username}</td>
            <td>${rental.number}</td>
            <td>${rental.regNumber}</td>
            <td>${rental.rentDate}</td>
            <td>${rental.status}</td>
            <td>
                <button class="btn btn-success btn-sm" class="acceptbtn" onclick="acceptRental(${index})">Accept</button>
                <button class="btn btn-danger btn-sm" class="acceptbtn"  onclick="rejectRental(${index})">Reject</button>
            </td>
        `;
        rentalTable.appendChild(row);
    });

    if (rentals.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="7">No rentals found.</td>';
        rentalTable.appendChild(row);
    }
}

// Function to accept a rental request
function acceptRental(index) {
    let rentals = JSON.parse(localStorage.getItem('rentals')) || [];
    rentals[index].status = "Accepted";
    localStorage.setItem('rentals', JSON.stringify(rentals));
    displayrentals(); // Refresh the manager's rental table
}

// Function to reject a rental request
function rejectRental(index) {
    let rentals = JSON.parse(localStorage.getItem('rentals')) || [];
    rentals.splice(index, 1); // Remove the rental from the array
    localStorage.setItem('rentals', JSON.stringify(rentals));
    displayrentals(); // Refresh the manager's rental table
}

// Initialize the rental display on page load

    displayrentals();




// overdue alert
function overdueshow() {
    document.getElementById('dashboardcontainer').style.display = 'none';
    document.getElementById('customerdcontainer').style.display = 'none';
    document.getElementById('rentaldcontainer').style.display = 'none';
    document.getElementById('overduedcontainer').style.display = 'block';
    document.getElementById('generatecontainer').style.display = 'none';
    document.getElementById('returncontainer').style.display = 'none';
    // console.log("tamil");
}

function checkOverdueRentals() {
let customers = JSON.parse(localStorage.getItem('customers')) || [];
console.log(customers)
    const now = new Date();
    const overdueList = document.getElementById('overdue-list');
    overdueList.innerHTML = '';

    customers.forEach(customer => {
        customer.rentalHistory.forEach(rental => {
            const returnDate = new Date(rental.returnDate);
            if (!rental.returnProcessed && returnDate < now) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${customer.nic}</td>
                     <td>${customer.username}</td>
                    <td>${rental.regNumber}</td>
                    <td>${new Date(rental.rentalDate).toLocaleString()}</td>
                    <td>${returnDate.toLocaleString()}</p>
                    <td>${(now - returnDate) / (1000 * 60 * 60)}</td>
                `;
                overdueList.appendChild(row);
            }
        });
    });

    if (overduelist.innerHTML === '') {
        overduelist.innerHTML = 'No overdue rentals found';
    }
}
window.onload = checkOverdueRentals();


// Function to show the return section
function returnshow() {
    document.getElementById('customerdcontainer').style.display = 'none';
    document.getElementById('dashboardcontainer').style.display = 'none';
    document.getElementById('rentaldcontainer').style.display = 'none';
    document.getElementById('overduedcontainer').style.display = 'none';
    document.getElementById('returncontainer').style.display = 'block';
    document.getElementById('generatecontainer').style.display = 'none';

}

// Function to handle motorbike return
function returnMotorbike() {
    // Retrieve customers and motorbikes from localStorage
    let customers = JSON.parse(localStorage.getItem('customers')) || [];
    let motorbikes = JSON.parse(localStorage.getItem('bikes')) || [];
    let rentals = JSON.parse(localStorage.getItem('rentals')) || []; // Assuming you have a 'rentals' array in localStorage

    const nic = document.getElementById('return-nic').value;
    const registrationNumber = document.getElementById('return-registration').value;

    // Find customer and motorbike
    const customer = customers.find(c => c.nic === nic);
    const motorbike = motorbikes.find(m => m.regNumber === registrationNumber);

    // Check if customer and motorbike exist
    if (!customer) {
        alert('Customer not found');
        return;
    }

    if (!motorbike) {
        alert('Motorbike not found');
        return;
    }

    // Find the rental record in the customer's rental history
    const rentalIndex = customer.rentalHistory.findIndex(r => r.regNumber === registrationNumber && !r.returnProcessed);
    if (rentalIndex === -1) {
        alert('Rental record not found or already processed');
        return;
    }

    // Update rental status and motorbike quantity
    customer.rentalHistory[rentalIndex].returnProcessed = true;
    motorbike.quantity += 1;

    // Find and remove the rental record from the rentals array
    const rentalRecordIndex = rentals.findIndex(r => r.nic === nic && r.regNumber === registrationNumber && !r.returnProcessed);
    if (rentalRecordIndex !== -1) {
        rentals.splice(rentalRecordIndex, 1); // Remove the rental record
    }

    // Save updated data to localStorage
    saveToLocalStorage(customers, motorbikes, rentals);

    alert('Motorbike returned successfully!');
    document.getElementById('return-motorbike-form').reset(); 
}

// Function to save updated data to localStorage
function saveToLocalStorage(customers, motorbikes, rentals) {
    localStorage.setItem('customers', JSON.stringify(customers));
    localStorage.setItem('bikes', JSON.stringify(motorbikes));
    localStorage.setItem('rentals', JSON.stringify(rentals));
}

// Attach form submission handler
window.onload = function() {
    const form = document.getElementById('return-motorbike-form');
    form.onsubmit = function(event) {
        event.preventDefault(); // Prevent form submission to server
        returnMotorbike();
    };
};

//report
function ReportMenu(reportType) {
    // Hide all sections
    document.getElementById('dashboardcontainer').style.display = 'none';
    document.getElementById('customerdcontainer').style.display = 'none';
    document.getElementById('rentaldcontainer').style.display = 'none';
    document.getElementById('overduedcontainer').style.display = 'none';
    document.getElementById('returncontainer').style.display = 'none';
    document.getElementById('generatecontainer').style.display = 'block';
    
        // Hide all report containers
        document.getElementById('rental-report-container').style.display = 'none';
        document.getElementById('customer-report-container').style.display = 'none';
        document.getElementById('bike-report-container').style.display = 'none';  

    // Show the selected report container
    if (reportType === 'rental') {
        document.getElementById('rental-report-container').style.display = 'block';
    } else if (reportType === 'customer') {
        document.getElementById('customer-report-container').style.display = 'block';
    } else if (reportType === 'bike') {
        document.getElementById('bike-report-container').style.display = 'block';
    }
}


window.onload = function() {
    generateReports();
};

function generateReports() {
    generateRentalReport();
    generateCustomerReport();
    generateBikeReport();
}

function generateRentalReport() {
    let rentals = JSON.parse(localStorage.getItem('rentals')) || [];
    const rentalTableBody = document.getElementById('rental-report-table').getElementsByTagName('tbody')[0];

    // Clear existing rows
    rentalTableBody.innerHTML = '';

    rentals.forEach(rental => {
        let row = rentalTableBody.insertRow();



        row.insertCell(0).textContent = rental.nic;
        row.insertCell(1).textContent = rental.regNumber;
        row.insertCell(2).textContent = rental.rentDate;
        row.insertCell(3).textContent = rental.returnProcessed ? 'Yes' : 'No';
    });
}

function generateCustomerReport() {
    let customers = JSON.parse(localStorage.getItem('customers')) || [];
    const customerTableBody = document.getElementById('customer-report-table').getElementsByTagName('tbody')[0];

    // Clear existing rows
    customerTableBody.innerHTML = '';

    customers.forEach(customer => {
        let row = customerTableBody.insertRow();

        row.insertCell(0).textContent = customer.nic;
        row.insertCell(1).textContent = customer.username;
        row.insertCell(2).textContent = customer.licence;
        row.insertCell(3).textContent = customer.number;
        row.insertCell(4).textContent = customer.rentalHistory.length;
    });
}

function generateBikeReport() {
    let motorbikes = JSON.parse(localStorage.getItem('bikes')) || [];
    const bikeTableBody = document.getElementById('bike-report-table').getElementsByTagName('tbody')[0];

    // Clear existing rows
    bikeTableBody.innerHTML = '';

    motorbikes.forEach(bike => {
        let row = bikeTableBody.insertRow();

        row.insertCell(0).textContent = bike.regNumber;
        row.insertCell(1).textContent = bike.brand;
        row.insertCell(2).textContent = bike.model;
        row.insertCell(3).textContent = bike.category;
        row.insertCell(4).textContent = bike.quantity;
    });
}
