function openConfirmationModal(linkId) {
    $(`#confirmationModal_${linkId}`).modal('show');
    console.log(linkId);
  }

  function confirmDelete(linkId) {
    document.getElementById(`deleteForm_${linkId}`).submit();
  }