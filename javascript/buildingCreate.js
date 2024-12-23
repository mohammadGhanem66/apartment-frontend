import { apiPostOrPut } from './apiHelper.js';

$('form').on('submit', async function (e) {
  e.preventDefault();
  console.log("Building Post Funtion ..!");
  const apiUrl = "https://apartman-service-production.up.railway.app/buildings";
  const name = $('#name').val();
  const address = $('#address').val();
  const apartmentCount = $('#apartmentCount').val();
  const floorsCount = $('#floorsCount').val();
  const monthlyFees = $('#monthlyFees').val();
  const monthlyRentPrice = $('#monthlyRentPrice').val();

  const body = {
    name: name,
    address: address,
    apartmentCount: apartmentCount,
    floorsCount: floorsCount,
    monthlyFees: monthlyFees,
    monthlyRentPrice: monthlyRentPrice,
  };

  try {
    // Wait for API response
    const response = await apiPostOrPut(apiUrl, 'POST', body);
    console.log('Building Created Successfully:', response);
    $('#name').val('')
    $('#address').val('')
    $('#apartmentCount').val('')
    $('#floorsCount').val('')
    $('#monthlyFees').val('')
    $('#monthlyRentPrice').val('')
    alert("تم انشاء العمارة");
  } catch (error) {
    console.error('Error :', error);
    alert('يوجد مشكلة في السيرفر');
  }
});
