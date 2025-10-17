import { apiFetch, apiPostOrPut } from './apiHelper.js';

// Step 1: Get the building ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const buildingId = urlParams.get('id');
console.log("Building Id is :- "+ buildingId);
// Step 2: Fetch building details
if (buildingId) {
  localStorage.setItem('buildingId', buildingId);
  fetchBuildingDetails(buildingId);
  fetchApartments(buildingId);
} else {
  console.error('No building ID provided in URL');
}


function fetchBuildingDetails(id) {
  const apiUrl = `http://89.116.110.164:8080/buildings/${id}`;
  
  apiFetch(apiUrl)
    .then(data => {
      displayBuildingInfo(data);
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
}
function fetchApartments(buildingId) {
  const apiUrl = `http://89.116.110.164:8080/apartments/building-apartments/${buildingId}`;

  apiFetch(apiUrl)
    .then(data => {
      console.log(data);
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
  localStorage.setItem('monthlyFees',  building.monthlyFees || '-');
}
function displayApartments(apartments) {
  const apartmentsTableBody = document.querySelector('#apartmentsTable tbody');
  apartmentsTableBody.innerHTML = ''; // Clear any existing rows

  apartments.forEach(apartment => {
    const rentalDetails = apartment.rentalDetails || {};
    const monthlyRentValue = rentalDetails?.monthlyRentValue ?? '-';
    const currency = rentalDetails?.currency ?? '-';
    const tenantName = rentalDetails?.tenant?.name ?? '-';

    const row = document.createElement('tr');
    // <td class="pd-l-20"><img src="https://via.placeholder.com/800x533" class="wd-55" alt="Image"></td>
    row.innerHTML = `
      <td style="cursor: pointer; font-weight: bold"><a href="apartment.html?id=${apartment.id}" class="view-details tx-14 tx-medium d-block">${apartment.name}</a></td>
      <td class="valign-middle"><span class="tx-info">${tenantName} </span></td>
      <td class="valign-middle"><span class="tx-success">${monthlyRentValue} </span></td>
      <td class="valign-middle">${currency}</td>
      <td class="valign-middle"><span class="tx-success tx-14 tx-${apartment.available ? 'success' : 'danger'}">${apartment.available ? 'متاح' : 'مؤجرة'}</span></td>
      <td class="valign-middle">${apartment.numberOfRooms}</td>
      <td>${apartment.description}</td>
      <td style="cursor: pointer; font-weight: bold"><a href="javascript:deleteApartment(${apartment.id})" class="view-details tx-danger">حذف</a></td>
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


$('form').on('submit', async function (e) {
  e.preventDefault();
  console.log("Apartment Post Function ..!");
  const apiUrl = "http://89.116.110.164:8080/apartments";
  const name = $('#name').val();
  const description = $('#description').val();
  const roomsCount = $('#roomsCount').val();
  
  const body = {
    name: name,
    description: description,
    numberOfRooms: roomsCount,
    type: "APARTMENT",
    available: true,
    buildingId: buildingId,
  };

  try {
    // Wait for API response
    const response = await apiPostOrPut(apiUrl, 'POST', body);
    console.log('Appartment Created Successfully:', response);
    $('#name').val('')
    $('#description').val('')
    $('#roomsCount').val('')
    alert("تم انشاء الشقة بنجاح");
    document.querySelector('form').reset();
    fetchApartments(buildingId);
  } catch (error) {
    console.error('Error :', error);
    alert('يوجد مشكلة في السيرفر');
  }
});

window.deleteApartment = async function(id) {
  const apiUrl = `http://89.116.110.164:8080/apartments/${id}`;
  const body = {};
  const isConfirmed = confirm("هل أنت متأكد ؟");
  if (!isConfirmed) {
    return;
  }
    try {
      // Wait for API response
      const response = await apiPostOrPut(apiUrl, 'DELETE', body);
      alert('تم حذف الشقة بنجاح');
      fetchApartments(buildingId);
    } catch (error) {
      console.error('Error :', error);
      alert('يوجد مشكلة في السيرفر');
    }
};