//===========================Delete Link Modal=========================
function openConfirmationModal(linkId) {
    $(`#confirmationModal_${linkId}`).modal('show');
    console.log(linkId);
  }

  function confirmDelete(linkId) {
    document.getElementById(`deleteForm_${linkId}`).submit();
  }

//========================Category validation======================
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

//========================Delete Note Modal======================

  function openConfirmationModal(noteId) {
    $(`#confirmationModal_${noteId}`).modal('show');
    console.log(noteId);
  }

  function confirmDelete(noteId) {
    document.getElementById(`deleteForm_${noteId}`).submit();
  }

//========================Delete Note Modal======================