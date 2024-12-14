import { apiFetch } from './apiHelper.js';

// Step 1: Get the apartment ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const apartmentId = urlParams.get('id');
console.log("Apartment Id is :- "+ apartmentId);
// Step 2: Fetch building details
if (apartmentId) {
  fetchApartmentDetails(apartmentId);
  fetchPayments(apartmentId);
} else {
  console.error('No Apartment ID provided in URL');
}

function fetchApartmentDetails(id) {
  const apiUrl = `https://apartman-service-production.up.railway.app/apartments/${id}`;
  
  apiFetch(apiUrl)
      .then(data => {
        displayApartmentInfo(data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
}
function fetchPayments(apartmentId) {
  console.log("Payments API");
  const apiUrl = `https://apartman-service-production.up.railway.app/payments/apartment-payments/${apartmentId}`;

  apiFetch(apiUrl)
      .then(data => {
        displayPayments(data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
}


function displayApartmentInfo(data) {
  document.getElementById('Aname').textContent = data.name;
  document.getElementById('Adescription').textContent = data.description;
  document.getElementById('AroomsCount').textContent = data.numberOfRooms;
  document.getElementById('AisAvaliable').textContent = data.available ? 'نعم' : 'لا';
  document.getElementById('ArentingValuePerMonth').textContent = data.monthlyRentValue;
}

function displayPayments(payments) {
  const paymentsTableBody = document.querySelector('#apartmentsTable tbody');
  paymentsTableBody.innerHTML = ''; // Clear any existing rows

  payments.forEach(payment => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="tx-success">${payment.value}</td>
      <td>${payment.paymentDate.split('T')[0]}</td>
      <td>${payment.month}</td>
      <td class="tx-warning">${payment.paymentType}</td>
      <td>${payment.chequeNumber ? payment.chequeNumber : '-'}</td>
      <td class="tx-danger">${payment.chequeDueDate ? payment.chequeDueDate.split('T')[0] : '-'}</td>
      <td>${payment.notes}</td>
      `;
      paymentsTableBody.appendChild(row);
  });
}
function checkPaymentType(){
  var paymentType = document.getElementById("paymentType").value;
  if (paymentType === "CASH") {
    document.getElementById("chequeNumber").style.display = "none";
    document.getElementById("chequeDueDate").style.display = "none";
    document.getElementById("labelchequeNumber").style.display = "none";
    document.getElementById("labelchequeDueDate").style.display = "none";
  }else {
    document.getElementById("chequeNumber").style.display = "block";
    document.getElementById("chequeDueDate").style.display = "block";
    document.getElementById("labelchequeNumber").style.display = "block";
    document.getElementById("labelchequeDueDate").style.display = "block";
  }
}

