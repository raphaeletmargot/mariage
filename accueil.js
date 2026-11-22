const guestForm = document.querySelector('#guest-form');
const formStatus = document.querySelector('#form-status');

function normalizeName(value) {
  return value.trim().toLocaleLowerCase('fr').normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[-‐‑‒–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshtein(a, b) {
  let previous = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    previous = current;
  }
  return previous[b.length];
}

function maxTypos(value) {
  return value.length >= 6 ? 2 : 1;
}

function findSuggestion(firstName, lastName) {
  let best = null;
  let bestScore = Infinity;
  let tie = false;
  // Surprise guests are never suggested so their presence is not revealed.
  for (const guest of window.guestInvitations || []) {
    if (guest.site === 'surprise') continue;
    const guestFirst = normalizeName(guest.firstName);
    const guestLast = normalizeName(guest.lastName);
    const firstDistance = levenshtein(firstName, guestFirst);
    const lastDistance = levenshtein(lastName, guestLast);
    if (firstDistance > maxTypos(guestFirst) || lastDistance > maxTypos(guestLast)) continue;
    const score = firstDistance + lastDistance;
    if (score < bestScore) {
      best = guest;
      bestScore = score;
      tie = false;
    } else if (score === bestScore) {
      tie = true;
    }
  }
  return tie ? null : best;
}

function showSuggestion(guest) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'suggestion-button';
  button.textContent = `${guest.firstName} ${guest.lastName}`;
  button.addEventListener('click', () => {
    guestForm.elements.firstName.value = guest.firstName;
    guestForm.elements.lastName.value = guest.lastName;
    guestForm.requestSubmit();
  });
  formStatus.replaceChildren('Vouliez-vous dire ', button, ' ?');
  formStatus.hidden = false;
}

guestForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const firstName = normalizeName(guestForm.elements.firstName.value);
  const lastName = normalizeName(guestForm.elements.lastName.value);
  const matches = (window.guestInvitations || []).filter((guest) =>
    normalizeName(guest.firstName) === firstName && normalizeName(guest.lastName) === lastName
  );

  if (firstName && lastName && matches.length === 1 && matches[0].site === 'surprise') {
    window.location.href = 'surprise.html';
    return;
  }

  if (firstName && lastName && matches.length === 1 && [0, 1, 2].includes(matches[0].site)) {
    const version = ['magdeleine', 'ragueneau', 'cyrano'][matches[0].site];
    window.location.href = `invitation.html?version=${version}`;
    return;
  }

  const suggestion = firstName && lastName && matches.length === 0 && findSuggestion(firstName, lastName);
  if (suggestion) {
    showSuggestion(suggestion);
    return;
  }

  formStatus.textContent = "Nous ne vous trouvons pas sur la liste. Vérifiez l'orthographe. Si ça ne fonctionne toujours pas, contactez-nous.";
  formStatus.hidden = false;
});

guestForm.addEventListener('input', () => {
  formStatus.hidden = true;
});