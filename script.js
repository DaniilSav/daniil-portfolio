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

const SEND_TARGETS = {
  email: 'daniilsavostin4@gmail.com',
  telegram: 'https://t.me/Daniil_Sozdanie_sait_bot',
  max: 'https://max.ru/u/f9LHodD0cOLB0avDDUJ9kRyvMIn_MPrRirk4h_VCeOk5sWPK8IcTrOg19NM',
};

const EMAILJS_SERVICE_ID = 'service_c36tb2x';
const EMAILJS_TEMPLATE_ID = 'template_dp5eods';
const EMAILJS_PUBLIC_KEY = 'lGdMLB5r-gmQqcRuT';

if (window.emailjs) {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

const CHANNEL_LABELS = {
  telegram: 'Telegram',
  max: 'MAX',
};

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

function validateConsent() {
  const checked = document.getElementById('consent').checked;
  const errorEl = document.getElementById('consentError');
  if (!checked) {
    errorEl.textContent = 'Необходимо согласие на обработку персональных данных';
    return false;
  }
  errorEl.textContent = '';
  return true;
}

['input', 'blur'].forEach((evt) => {
  document.getElementById('name').addEventListener(evt, validateName);
  document.getElementById('contact').addEventListener(evt, validateContact);
  document.getElementById('message').addEventListener(evt, validateMessage);
});

document.getElementById('consent').addEventListener('change', validateConsent);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  formSuccess.classList.remove('show');

  const isNameValid = validateName();
  const isContactValid = validateContact();
  const isMessageValid = validateMessage();
  const isConsentValid = validateConsent();

  if (!isNameValid || !isContactValid || !isMessageValid || !isConsentValid) {
    return;
  }

  const channel = form.querySelector('input[name="channel"]:checked').value;
  const name = document.getElementById('name').value.trim();
  const contact = document.getElementById('contact').value.trim();
  const message = document.getElementById('message').value.trim();
  const text = `Заявка с сайта\nИмя: ${name}\nКонтакт: ${contact}\nСообщение: ${message}`;

  if (channel === 'email') {
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    emailjs
      .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        name,
        contact,
        email: contact,
        from_name: name,
        reply_to: contact,
        message,
      })
      .then(() => {
        formSuccess.textContent = 'Спасибо! Заявка отправлена, я скоро свяжусь с вами.';
        formSuccess.classList.add('show');
        form.reset();
      })
      .catch(() => {
        alert('Не удалось отправить заявку. Попробуйте ещё раз или напишите на ' + SEND_TARGETS.email);
      })
      .finally(() => {
        submitBtn.disabled = false;
      });
  } else {
    const target = SEND_TARGETS[channel];
    if (target === '#') {
      alert(`Контакт для ${CHANNEL_LABELS[channel]} пока не указан. Свяжитесь через Email.`);
      return;
    }

    // Telegram bot deep-links can't pre-fill arbitrary free text (?text= only
    // works for user profiles/share links, and ?start= payloads are capped at
    // 64 chars from a restricted charset). Copy the message instead so the
    // user can paste it into the chat.
    if (channel === 'telegram' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
      formSuccess.textContent = 'Текст заявки скопирован — вставьте его в чат с ботом, который сейчас откроется.';
    } else {
      formSuccess.textContent = 'Спасибо! Заявка отправлена, я скоро свяжусь с вами.';
    }

    window.open(target, '_blank', 'noopener');
    formSuccess.classList.add('show');
    form.reset();
  }
});
