const editButton = document.querySelector('#edit-profile-button')
const editForm = document.querySelector('#edit-profile');

const cancelButton = document.querySelector('#cancel-button');

editButton.addEventListener('click', () => {
  editForm.classList.remove('hidden');
})

cancelButton.addEventListener('click', () => {
  editForm.classList.add('hidden');
})