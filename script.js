// Mobile navigation toggle
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Contact form validation
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+()\d][\d()\s-]{6,}$/;

function setError(fieldId, errorId, message) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(errorId);
  const group = field.closest('.form-group');

  if (message) {
    group.classList.add('invalid');
    errorEl.textContent = message;
  } else {
    group.classList.remove('invalid');
    errorEl.textContent = '';
  }
}

function validateName() {
  const value = document.getElementById('name').value.trim();
  if (!value) {
    setError('name', 'nameError', 'Пожалуйста, укажите имя');
    return false;
  }
  if (value.length < 2) {
    setError('name', 'nameError', 'Слишком короткое имя');
    return false;
  }
  setError('name', 'nameError', '');
  return true;
}

function validateContact() {
  const value = document.getElementById('contact').value.trim();
  if (!value) {
    setError('contact', 'contactError', 'Укажите телефон или email');
    return false;
  }
  if (!EMAIL_RE.test(value) && !PHONE_RE.test(value)) {
    setError('contact', 'contactError', 'Введите корректный телефон или email');
    return false;
  }
  setError('contact', 'contactError', '');
  return true;
}

function validateMessage() {
  const value = document.getElementById('message').value.trim();
  if (!value) {
    setError('message', 'messageError', 'Опишите, какой сайт нужен');
    return false;
  }
  if (value.length < 10) {
    setError('message', 'messageError', 'Расскажите чуть подробнее (от 10 символов)');
    return false;
  }
  setError('message', 'messageError', '');
  return true;
}

['input', 'blur'].forEach((evt) => {
  document.getElementById('name').addEventListener(evt, validateName);
  document.getElementById('contact').addEventListener(evt, validateContact);
  document.getElementById('message').addEventListener(evt, validateMessage);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  formSuccess.classList.remove('show');

  const isNameValid = validateName();
  const isContactValid = validateContact();
  const isMessageValid = validateMessage();

  if (isNameValid && isContactValid && isMessageValid) {
    // Placeholder: replace with real submission logic (fetch/EmailJS/etc.)
    formSuccess.classList.add('show');
    form.reset();
  }
});
