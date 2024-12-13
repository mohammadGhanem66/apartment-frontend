import { apiFetch } from './apiHelper.js';

loadBuildings();
function loadBuildings() {
  const apiUrl = "https://apartman-service-production.up.railway.app/buildings/all";

  apiFetch(apiUrl)
    .then(data => {
      console.log(data);
      displayBuildings(data);
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
}
// Function to display buildings in the DOM
function displayBuildings(buildings) {
  const buildingsTableBody = document.querySelector('#buildingsTable tbody');
  buildingsTableBody.innerHTML = '';

  buildings.forEach(building => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="cursor: pointer; font-weight: bold"><a href="building.html?id=${building.id}" class="view-details">${building.name}</a></td>
      <td>${building.apartmentCount}</td>
      <td>${building.monthlyRentPrice}</td>
      <td>${building.monthlyFees ? building.monthlyFees : 'لا يوجد'}</td>
    `;
    buildingsTableBody.appendChild(row);
  });
}