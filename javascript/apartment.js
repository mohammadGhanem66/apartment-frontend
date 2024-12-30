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
  const currentYear = new Date().getFullYear();
  const apiUrl = `https://apartman-service-production.up.railway.app/payments/apartment-payments/${apartmentId}`+'?year='+currentYear;

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
    $('#payingDiv').hide();
  }else {
    $('#renttingAppartmentDiv').hide();
    $('#UnRenttingAppartmentDiv').show();
    $('#payingDiv').show();
  }
}

function displayApartmentInfo(data) {
  const rentalDetails = data.rentalDetails || {};
  const monthlyRentValue = rentalDetails?.monthlyRentValue ?? '-';
  const currency = rentalDetails?.currency ?? '-';
  const tenantName = rentalDetails?.tenant?.name ?? '-';
   
  document.getElementById('Aname').textContent = data.name;
  document.getElementById('Adescription').textContent = data.description;
  document.getElementById('AroomsCount').textContent = data.numberOfRooms;
  document.getElementById('AisAvaliable').textContent = data.available ? 'نعم' : 'لا';
  document.getElementById('ArentingValuePerMonth').textContent = monthlyRentValue + ' ' + currency;
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
      <td style="cursor: pointer; font-weight: bold"><a href="javascript:deletePayment(${payment.id})" class="view-details tx-danger">حذف</a></td>
      `;
      paymentsTableBody.appendChild(row);
  });
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
    version: 1,
    buildingId: localStorage.getItem('buildingId'),
  };
  //localStorage.removeItem('buildingId');
  try {
    const response = await apiPostOrPut(apiUrl, 'PUT', body);
    console.log('Appartment updated Successfully:', response);
    alert("تم التعديل بنجاح");
    location.reload();
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

const paymentBTN = document.getElementById('paymentBTN');

paymentBTN.addEventListener('click', async  function() {
  console.log("Payment Post Function ....!");
  const apiUrl = "https://apartman-service-production.up.railway.app/payments";
  const value = document.getElementById('paymentValue').value;
  const month = document.getElementById('month').value;
  const paymentType = document.getElementById('paymentType').value;
  const notes = document.getElementById('notes').value;
  const currency = document.getElementById('currency').value;
  const year = document.getElementById('paymentYear').value;
  if(value == "" || month == "" || paymentType == "" || notes == "" || currency == "" || year == ""){  
      alert("يجب ملئ جميع الحقول !");
      return;
  }
  const body = {
    value: document.getElementById('paymentValue').value,
    month: document.getElementById('month').value,
    paymentType: document.getElementById('paymentType').value,
    notes: document.getElementById('notes').value,
    currency: document.getElementById('currency').value,
    apartmentId: apartmentId,
    paymentDate: getCurrentISODate(),
    tenantId: 1,
    chequeNumber: document.getElementById('chequeNumber').value || null,
    chequeDueDate: formatToISO(document.getElementById('chequeDueDate').value) || null,
    year: document.getElementById('paymentYear').value,
  };
  try {
    const response = await apiPostOrPut(apiUrl, 'POST', body);
    console.log('Payment Successfully:', response);
    alert("تم تسجيل الدفعة !");
    $('#paymentValue').val('');
    $('#month').val('');
    $('#paymentType').val('');
    $('#notes').val('');
    $('#currency').val('');
    $('#chequeNumber').val('');
    $('#chequeDueDate').val('');
    $('#paymentYear').val('');
    fetchPayments(apartmentId);
  } catch (error) {
    console.error('Error :', error);
    alert('يوجد مشكلة في السيرفر');
  }
});
function formatToISO(dateString) {
  if (!dateString) return null; // Return null if dateString is empty
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date.toISOString(); // Ensure valid date
}
function getCurrentISODate() {
  return new Date().toISOString();
}

const fillterYearSelect = document.getElementById('yearsToFillter'); 

fillterYearSelect.addEventListener('change', async  function() {
  console.log("Filttering Year function ...!");
  const year = document.getElementById('yearsToFillter').value;
  const apiUrl = `https://apartman-service-production.up.railway.app/payments/apartment-payments/${apartmentId}`+'?year='+year;

  apiFetch(apiUrl)
      .then(data => {
        displayPayments(data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
});


window.deletePayment = async function(id) {
  const apiUrl = `https://apartman-service-production.up.railway.app/payments/${id}`;
  const body = {};
  const isConfirmed = confirm("هل أنت متأكد ؟");
  if (!isConfirmed) {
    return;
  }
    try {
      // Wait for API response
      const response = await apiPostOrPut(apiUrl, 'DELETE', body);
      alert('تم حذف الدفعة بنجاح');
      fetchPayments(apartmentId);
    } catch (error) {
      console.error('Error :', error);
      alert('يوجد مشكلة في السيرفر');
    }
};