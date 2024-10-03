document.addEventListener('DOMContentLoaded', function () {
    const rentContainer = document.getElementById('rent-container');

    // Sample bike data
    // const bikes = [
    //     {
    //         image: 'bike1.jpg',
    //         title: 'Mountain Bike',
    //         description: 'A sturdy mountain bike for rough terrains.',
    //         regNumber: '001',
    //         brand: '360',
    //         model: 'classic',
    //         category: '3'
    //     },
    //     {
    //         image: 'bike2.jpg',
    //         title: 'Mountain Bike',
    //         description: 'A sturdy mountain bike for rough terrains.',
    //         regNumber: '002',
    //         brand: '360',
    //         model: 'classic',
    //         category: '3'
    //     },

    // ];
    const bikes = JSON.parse(localStorage.getItem('bikes')) || [];

    function createBikeCard(bike) {
        const bikeBox = document.createElement('div');
        bikeBox.classList.add('rent-box');

        bikeBox.innerHTML = `
            <img src="${bike.image}" alt="${bike.title}">
            <div class="rent-layer">
                <h4>${bike.title}</h4>
                <p>${bike.description}</p>
                 <p>${bike.model}</p>
                  <p>${bike.brand}</p>
                   <p>${bike.category}</p>   
                <a href="login.html"><i class='bx bx-link-external'></i></a>
            </div>
    
        `;

        return bikeBox;
    }

    function displayBikes() {
        bikes.forEach(bike => {
            const bikeCard = createBikeCard(bike);
            rentContainer.appendChild(bikeCard);
        });
    }

    displayBikes();
});



