const URL = "/api/restore"
const restoreModal = document.getElementById('restore-modal');
const forgotLink = document.getElementById('forgot-password-link');

const stepEls = {
    1: restoreModal.querySelector('.step[data-step="1"]'),
    2: restoreModal.querySelector('.step[data-step="2"]'),
    3: restoreModal.querySelector('.step[data-step="3"]'),
    4: restoreModal.querySelector('.step[data-step="4"]'),
};

const emailForm = document.getElementById('restore-email-form');
const codeForm = document.getElementById('restore-code-form');
const passForm = document.getElementById('restore-password-form');

const emailInput = document.getElementById('restore-email');
const emailError = document.getElementById('restore-email-error');

const emailPreview = document.getElementById('restore-email-preview');
const codeInput = document.getElementById('restore-code');
const codeError = document.getElementById('restore-code-error');

const pass1 = document.getElementById('new-password');
const pass2 = document.getElementById('new-password-confirm');
const passError = document.getElementById('restore-password-error');

const codeTimerEl = document.getElementById('code-timer');
const resendBtn = document.getElementById('resend-code-btn');
const backToEmailBtn = document.getElementById('back-to-email');
const backToCodeBtn = document.getElementById('back-to-code');

let restoreState = {
    email: null,
    token: null,
    timerId: null,
    expiresAt: null, // epoch ms
};

function openModal() {
    restoreModal.classList.add('open');
    showStep(1);
    clearErrors();
    emailInput.value = '';
    codeInput.value = '';
    pass1.value = '';
    pass2.value = '';
}

function closeModal() {
    restoreModal.classList.remove('open');
    stopTimer();
}

function showStep(n) {
    Object.values(stepEls).forEach(el => el.classList.add('hidden'));
    stepEls[n].classList.remove('hidden');
}

function setLoading(btn, isLoading) {
    if (!btn) return;
    btn.disabled = isLoading;
    btn.dataset.loading = isLoading ? '1' : '0';
    if (isLoading) {
        btn.dataset._label = btn.textContent;
        btn.textContent = 'Зачекайте…';
    } else if (btn.dataset._label) {
        btn.textContent = btn.dataset._label;
        delete btn.dataset._label;
    }
}

function clearErrors() {
    emailError.textContent = '';
    codeError.textContent = '';
    passError.textContent = '';
}

function startTimer(seconds = 15 * 60) {
    stopTimer();
    const end = Date.now() + seconds * 1000;
    restoreState.expiresAt = end;
    tick();
    restoreState.timerId = setInterval(tick, 1000);

    function tick() {
        const left = Math.max(0, Math.floor((end - Date.now()) / 1000));
        const m = String(Math.floor(left / 60)).padStart(2, '0');
        const s = String(left % 60).padStart(2, '0');
        codeTimerEl.textContent = `${m}:${s}`;
        if (left <= 0) stopTimer();
    }
}

function stopTimer() {
    if (restoreState.timerId) {
        clearInterval(restoreState.timerId);
        restoreState.timerId = null;
    }
}

// API helpers
async function apiPost(url, payload) {
    const res = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
        credentials: 'same-origin',
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const msg = data?.message || data?.error || 'Помилка запиту';
        const status = res.status;
        const err = new Error(msg);
        err.status = status;
        err.payload = data;
        throw err;
    }
    return data;
}

// Open/close
forgotLink?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
});
restoreModal.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', closeModal);
});

// Step 1: send code
emailForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const email = emailInput.value.trim();
    if (!email) {
        emailError.textContent = 'Введіть email.';
        return;
    }

    const btn = document.getElementById('send-code-btn');
    try {
        setLoading(btn, true);
        await apiPost(`${URL}/get-code`, {email});
        restoreState.email = email;
        emailPreview.textContent = email;
        showStep(2);
        startTimer(15 * 60);
    } catch (err) {
        emailError.textContent = err.message || 'Не вдалося надіслати код.';
    } finally {
        setLoading(btn, false);
    }
});

// Resend code
resendBtn.addEventListener('click', async () => {
    if (!restoreState.email) return;
    try {
        setLoading(resendBtn, true);
        await apiPost(`${URL}/get-code`, {email: restoreState.email});
        startTimer(15 * 60);
        codeError.textContent = 'Код повторно відправлено.';
    } catch (err) {
        codeError.textContent = err.message || 'Не вдалося відправити код.';
    } finally {
        setLoading(resendBtn, false);
    }
});

// Back buttons
backToEmailBtn.addEventListener('click', () => {
    stopTimer();
    showStep(1);
});
backToCodeBtn.addEventListener('click', () => {
    showStep(2);
});

// Step 2: verify code
codeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const code = codeInput.value.trim();
    if (!/^\d{6}$/.test(code)) {
        codeError.textContent = 'Код має містити 6 цифр.';
        return;
    }

    const btn = document.getElementById('verify-code-btn');
    try {
        setLoading(btn, true);
        const data = await apiPost(`${URL}/restore-account`, {
            email: restoreState.email,
            code,
        });
        restoreState.token = data?.token;
        if (!restoreState.token) throw new Error('Не отримано токен.');
        showStep(3);
    } catch (err) {
        if (err.status === 401) {
            codeError.textContent = 'Код прострочений. Надішліть новий.';
        } else {
            codeError.textContent = err.message || 'Код невірний.';
        }
    } finally {
        setLoading(btn, false);
    }
});

// Step 3: set new password
passForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const p1 = pass1.value;
    const p2 = pass2.value;

    if (p1 !== p2) {
        passError.textContent = 'Паролі не співпадають.';
        return;
    }

    const btn = document.getElementById('set-password-btn');
    try {
        setLoading(btn, true);
        await apiPost(`${URL}/reset-password`, {
            token: restoreState.token,
            password: p1,
        });
        stopTimer();
        showStep(4);
    } catch (err) {
        passError.textContent = err.message || 'Не вдалося змінити пароль.';
    } finally {
        setLoading(btn, false);
    }
});
