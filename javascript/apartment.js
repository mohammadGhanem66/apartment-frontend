import { apiFetch, apiPostOrPut } from './apiHelper.js';

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
        checkRenttingInfo(data);
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
function checkRenttingInfo(data){
  if(data.rentalDetails == null){
    $('#renttingAppartmentDiv').show();
    $('#UnRenttingAppartmentDiv').hide();
  }else {
    $('#renttingAppartmentDiv').hide();
    $('#UnRenttingAppartmentDiv').show();
  }
}

function displayApartmentInfo(data) {
  document.getElementById('Aname').textContent = data.name;
  document.getElementById('Adescription').textContent = data.description;
  document.getElementById('AroomsCount').textContent = data.numberOfRooms;
  document.getElementById('AisAvaliable').textContent = data.available ? 'نعم' : 'لا';
  document.getElementById('ArentingValuePerMonth').textContent = data.monthlyRentValue;
  //Inputs for editing
  $('#appartmentNameEdit').val(data.name);
  $('#appartmentDescriptionEdit').val(data.description);
  $('#appartmentRoomsNumberEdit').val(data.numberOfRooms);
 
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

const button = document.getElementById('EditBtn');

button.addEventListener('click', async  function() {
  console.log("Appartment Put Function ....!");
  const apiUrl = "https://apartman-service-production.up.railway.app/apartments/"+apartmentId;
  const name = $('#appartmentNameEdit').val();
  const description = $('#appartmentDescriptionEdit').val();
  const roomsCount = $('#appartmentRoomsNumberEdit').val();
  console.log(apiUrl);
  if(localStorage.getItem('buildingId') == null || localStorage.getItem('buildingId') == ""){
    alert("يوجد مشكلة في السيرفر");
    return;
  }
  const body = {
    name: name,
    description: description,
    numberOfRooms: roomsCount,
    type: "APARTMENT",
    version: 0,
    buildingId: localStorage.getItem('buildingId'),
  };
  //localStorage.removeItem('buildingId');
  try {
    const response = await apiPostOrPut(apiUrl, 'PUT', body);
    console.log('Appartment updated Successfully:', response);
    alert("تم التعديل بنجاح");
  } catch (error) {
    console.error('Error :', error);
    alert('يوجد مشكلة في السيرفر');
  }
});

const rentAppBTN = document.getElementById('rentAppBTN');
rentAppBTN.addEventListener('click', async  function() {
  console.log("Rent Post Function ....!");
  const apiUrl = "https://apartman-service-production.up.railway.app/apartments/rent-apartment/"+apartmentId;
  const name = $('#rentingUserName').val();
  const phone = $('#rentingUserPhone').val();
  const monthlyRentValue = $('#rentingUserPay').val();
  const currency = $('#currencyRenting').val();
  const rentalType = $('#rentalType').val();
  const dateInput = $('#rentalStartDate').val();
  const rentalStartDate = new Date(dateInput).toISOString();

  const body = {
    monthlyRentValue: monthlyRentValue,
    currency: currency,
    rentalType: rentalType,
    paymentDue: "MONTHLY",
    rentalStartDate: rentalStartDate,
    tenant:{
      name: name,
      phone: phone,
    }
  };
  try {
    const response = await apiPostOrPut(apiUrl, 'POST', body);
    console.log('Appartment rendted Successfully:', response);
    alert("تم تأجير الشقة");
    $('#rentingUserName').val('');
    $('#rentingUserPhone').val('');
    $('#rentingUserPay').val('');
    $('#rentalStartDate').val('');
  } catch (error) {
    console.error('Error :', error);
    alert('يوجد مشكلة في السيرفر');
  }

});


const unRentingBTN = document.getElementById('unRentingBTN');
unRentingBTN.addEventListener('click', async  function() {
  const isConfirmed = confirm("هل أنت متأكد أنك تريد إلغاء تأجير الشقة؟");
  if (!isConfirmed) {
    return;
  }

  console.log("UnRent Post Function ....!");
  const apiUrl = "https://apartman-service-production.up.railway.app/apartments/vacate-apartment/"+apartmentId;
  const body = {};
  try {
    const response = await apiPostOrPut(apiUrl, 'POST', body);
    alert("تم الغاء تأجير الشقة");
    location.reload();
  } catch (error) {
    console.error('Error :', error);
    alert('يوجد مشكلة في السيرفر');
  }
});