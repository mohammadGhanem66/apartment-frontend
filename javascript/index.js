import { apiFetch, apiPostOrPut } from './apiHelper.js';

loadBuildings();
loadStatistics();
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
      <td style="cursor: pointer; font-weight: bold"><a href="javascript:deleteBuilding(${building.id})" class="view-details tx-danger">حذف</a></td>
    `;
    buildingsTableBody.appendChild(row);
  });
}
function loadStatistics() {
  console.log("loadStatistics Function");
  const apiUrl = "https://apartman-service-production.up.railway.app/statistics/main-page-statistics";

  apiFetch(apiUrl)
    .then(data => {
      console.log(data);
      displayStatistics(data);
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
}
function displayStatistics(data){
  document.getElementById('stat1').textContent = data.rentedApartments;
  document.getElementById('stat2').textContent = data.vacatedApartments;
  document.getElementById('stat3').textContent = data.paidAmounts;
  document.getElementById('stat4').textContent = data.unpaidOwedAmounts;
}
window.deleteBuilding = async function(buildingId) {
  const apiUrl = `https://apartman-service-production.up.railway.app/buildings/${buildingId}`;
  const body = {};
  const isConfirmed = confirm("هل أنت متأكد ؟");
  if (!isConfirmed) {
    return;
  }
    try {
      // Wait for API response
      const response = await apiPostOrPut(apiUrl, 'DELETE', body);
      alert('تم حذف العمارة بنجاح');
      loadBuildings();
    } catch (error) {
      console.error('Error :', error);
      alert('يوجد مشكلة في السيرفر');
    }
};
