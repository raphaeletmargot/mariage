const guestForm = document.querySelector('#guest-form');
const formStatus = document.querySelector('#form-status');

function normalizeName(value) {
  return value.trim().toLocaleLowerCase('fr').normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

guestForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const firstName = normalizeName(guestForm.elements.firstName.value);
  const lastName = normalizeName(guestForm.elements.lastName.value);
  const matches = (window.guestInvitations || []).filter((guest) =>
    normalizeName(guest.firstName) === firstName && normalizeName(guest.lastName) === lastName
  );

  if (firstName && lastName && matches.length === 1 && [0, 1, 2].includes(matches[0].site)) {
    const version = 3 - matches[0].site;
    window.location.href = `invitation-1.html?version=${version}`;
    return;
  }

  formStatus.textContent = 'Nous ne retrouvons pas ce nom. Vérifiez son orthographe et réessayez, ou appelez-nous si le problème persiste.';
  formStatus.hidden = false;
});

guestForm.addEventListener('input', () => {
  formStatus.hidden = true;
});