function openConfirmationModal(linkId) {
    $(`#confirmationModal_${linkId}`).modal('show');
    console.log(linkId);
  }

  function confirmDelete(linkId) {
    document.getElementById(`deleteForm_${linkId}`).submit();
  }


  function validateCategories() {
    const checkboxes = document.querySelectorAll('input[name="category"]:checked');
    
    // Check if at least one checkbox is checked
    if (checkboxes.length < 1) {
      alert('Please select at least one category!');
      return false;
    }
    
    return true;
  }