//===========================Delete Modal=========================
function openConfirmationModal(linkId) {
    $(`#confirmationModal_${linkId}`).modal('show');
    console.log(linkId);
  }

  function confirmDelete(linkId) {
    document.getElementById(`deleteForm_${linkId}`).submit();
  }

//========================Category validation======================
  // function validateCategories() {
  //   const checkboxes = document.querySelectorAll('input[name="category"]:checked');
    
  //   // Check if at least one checkbox is checked
  //   if (checkboxes.length < 1) {
  //     alert('Please select at least one category!');
  //     return false;
  //   }
    
  //   return true;
  // }

  function validateCategories() {
    const checkboxes = document.querySelectorAll('input[name="category"]:checked');
    
    // Check if at least one checkbox is checked
    if (checkboxes.length < 1) {
      // Display the modal
      const alertModal = new bootstrap.Modal(document.getElementById('alertModal'));
      alertModal.show();
      return false; // Prevent form submission
    }
    
    return true; // Allow form submission
  }