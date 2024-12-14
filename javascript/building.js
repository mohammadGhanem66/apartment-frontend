import { apiFetch } from './apiHelper.js';

// Step 1: Get the building ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const buildingId = urlParams.get('id');
console.log("Building Id is :- "+ buildingId);
// Step 2: Fetch building details
if (buildingId) {
  fetchBuildingDetails(buildingId);
  fetchApartments(buildingId);
} else {
  console.error('No building ID provided in URL');
}


function fetchBuildingDetails(id) {
  const apiUrl = `https://apartman-service-production.up.railway.app/buildings/${id}`;
  
  apiFetch(apiUrl)
    .then(data => {
      displayBuildingInfo(data);
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
}
function fetchApartments(buildingId) {
  const apiUrl = `https://apartman-service-production.up.railway.app/apartments/building-apartments/${buildingId}`;

  apiFetch(apiUrl)
    .then(data => {
      displayApartments(data);
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
}


function displayBuildingInfo(building) {
  document.getElementById('Bname').textContent = building.name;
  document.getElementById('Blocation').textContent = building.address;
  document.getElementById('BroomsCount').textContent = building.apartmentCount;
  document.getElementById('BfloorsCount').textContent = building.floorsCount;
  document.getElementById('BtotalServices').textContent = building.monthlyFees || '-';
  document.getElementById('BtotalCollection').textContent = building.monthlyRentPrice;
}
function displayApartments(apartments) {
  const apartmentsTableBody = document.querySelector('#apartmentsTable tbody');
  apartmentsTableBody.innerHTML = ''; // Clear any existing rows

  apartments.forEach(apartment => {
    const row = document.createElement('tr');
    // <td class="pd-l-20"><img src="https://via.placeholder.com/800x533" class="wd-55" alt="Image"></td>
    row.innerHTML = `
      <td style="cursor: pointer; font-weight: bold"><a href="apartment.html?id=${apartment.id}" class="view-details tx-14 tx-medium d-block">${apartment.name}</a></td>
      <td class="valign-middle"><span class="tx-success">${apartment.rentalDetails.monthlyRentValue} </span></td>
      <td class="valign-middle">${apartment.rentalDetails.currency}</td>
      <td class="valign-middle"><span class="tx-success tx-14 tx-${apartment.available ? 'success' : 'danger'}">${apartment.available ? 'متاح' : 'مؤجرة'}</span></td>
      <td class="valign-middle">${apartment.numberOfRooms}</td>
      <td>${apartment.description}</td>
    `;
    apartmentsTableBody.appendChild(row);
  });
}


document.addEventListener('DOMContentLoaded', function () {
  const toggleLink = document.querySelector('[href="#collapseExample"]');

  toggleLink.addEventListener('click', function (event) {
      // Delay to ensure the collapsible section has opened
      setTimeout(() => {
          const targetElement = document.querySelector('#collapseExample');
          if (targetElement) {
              targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
      }, 300); // Match Bootstrap's default collapse animation duration
  });
});


