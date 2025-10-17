$(document).ready(function() {
    // Event listener for form submission
    $('form').on('submit', function(e) {
      e.preventDefault();
  
      // Create FormData object to handle file upload and form data
      var formData = new FormData();
      
      // Append text inputs to FormData
      formData.append("name", $('#name').val());
      formData.append("address", $('#address').val());
      formData.append("apartmentCount", parseInt($('#apartmentCount').val()));
      formData.append("floorsCount", parseInt($('#floorsCount').val()));
      formData.append("monthlyFees", parseFloat($('#monthlyFees').val()));
      formData.append("monthlyRentPrice", parseFloat($('#monthlyRentPrice').val()));
  
      // Append file input (multiple files support)
      var fileInput = $('#buildingImages')[0].files;
      for (var i = 0; i < fileInput.length; i++) {
        formData.append("buildingImages[]", fileInput[i]);break;
      }
  
      // Make AJAX request
      $.ajax({
        url: '89.116.110.164:8080/buildings',
        type: 'POST',
        data: formData,
        contentType: false, // Important for file uploads
        processData: false, // Don't process FormData
        success: function(response) {
          // Handle success response
          console.log('Building created successfully:', response);
          alert('Building created successfully!');
        },
        error: function(xhr, status, error) {
          // Handle error response
          console.error('Error creating building:', error);
          alert('Failed to create building.');
        }
      });
    });
  });