// Admin panel functionality
import {
    showNotification,
    zodiacsNames,
    formatDate,
    setupLogoutModal,
    showLogoutModal,
    hideLogoutModal,
    confirmLogout
} from "./common.js";

let currentSection = "dashboard"
let currentSubsection = "users-list"
let users = []
let meetings = []
let credentials = []
let matches = []
let mapInstance;
let mapMarker;

// Pagination state
let usersPagination = {page: 1, totalPages: 1, limit: 10}
let meetingsPagination = {page: 1, totalPages: 1, limit: 10}
let credentialsPagination = {page: 1, totalPages: 1, limit: 10}
let matchesPagination = {page: 1, totalPages: 1, limit: 10}

function initAdminPanel() {
    setupNavigation()
    setupSubsectionsNavigation()
    setupFilters()
    // setupLogoutModal викликається автоматично з common.js
    setupEditButtons()
    loadUsersData()
    updateStats()
}

function setupEditButtons() {
    // Додаємо делегування подій для кнопок редагування
    document.addEventListener('click', function (event) {
        // Кнопки для користувачів
        if (event.target.matches('[data-action="edit-user"]')) {
            const userId = parseInt(event.target.dataset.id);
            editUser(userId);
        }

        // Кнопки для зустрічей
        if (event.target.matches('[data-action="edit-meeting"]')) {
            const meetingId = parseInt(event.target.dataset.id);
            editMeeting(meetingId);
        }
        if (event.target.matches('[data-action="cancel-meeting"]')) {
            const meetingId = parseInt(event.target.dataset.id);
            cancelMeeting(meetingId);
        }
        if (event.target.matches('[data-action="restore-meeting"]')) {
            const meetingId = parseInt(event.target.dataset.id);
            restoreMeeting(meetingId);
        }

        // Кнопки для облікових даних
        if (event.target.matches('[data-action="edit-credential"]')) {
            const credentialId = parseInt(event.target.dataset.id);
            editCredential(credentialId);
        }

        // Кнопки для пар
        if (event.target.matches('[data-action="edit-match"]')) {
            const matchId = parseInt(event.target.dataset.id);
            editMatch(matchId);
        }
    });

    // Додаємо обробники для модальних вікон
    document.addEventListener('click', function (event) {
        if (event.target.matches('#editUserModal .btn-outline') ||
            event.target.matches('#editUserModal .close')) {
            closeEditModal();
        }
        if (event.target.matches('#editUserModal .btn-primary')) {
            saveUserChanges();
        }
        if (event.target.matches('#editMeetingModal .close') ||
            event.target.matches('#editMeetingModal .btn-outline') ||
            event.target.closest('#editMeetingModal .modal-close')) {
            closeEditMeetingModal();
        }
        if (event.target.matches('#editMatchModal .btn-outline') ||
            event.target.closest('#editMatchModal .modal-close')) {
            closeEditMatchModal();
        }
        if (event.target.matches('#editCredentialModal .btn-outline') ||
            event.target.closest('#editCredentialModal .modal-close')) {
            closeEditCredentialModal();
        }
        if (event.target.matches('#editMeetingModal .btn-primary')) {
            saveMeetingChanges();
        }
        if (event.target.matches('#editMatchModal .btn-primary')) {
            saveMatchChanges();
        }
        if (event.target.matches('#editCredentialModal .btn-primary')) {
            saveCredentialChanges();
        }
        if (event.target.matches('#logoutModal .logout-btn-cancel')) {
            hideLogoutModal();
        }
        if (event.target.matches('#logoutModal .logout-btn-confirm')) {
            confirmLogout();
        }
    });
    document.querySelector('.modal-close').addEventListener("click", closeEditModal);
}

initAdminPanel();

function setupNavigation() {
    const navItems = document.querySelectorAll(".nav-item")

    navItems.forEach((item) => {
        item.addEventListener("click", () => {
            const section = item.dataset.section
            switchSection(section)
        })
    })
}

function setupSubsectionsNavigation() {
    const subsectionBtns = document.querySelectorAll(".subsection-btn")

    subsectionBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const subsection = btn.dataset.subsection
            switchSubsection(subsection)
        })
    })
}

function switchSubsection(subsectionName) {
    // Update navigation
    document.querySelectorAll(".subsection-btn").forEach((btn) => {
        btn.classList.remove("active")
    })
    document.querySelector(`[data-subsection="${subsectionName}"]`).classList.add("active")

    // Update subsections
    document.querySelectorAll(".admin-subsection").forEach((section) => {
        section.classList.remove("active")
    })
    document.getElementById(subsectionName).classList.add("active")

    currentSubsection = subsectionName

    // Load data for the selected subsection
    switch (subsectionName) {
        case "users-list":
            loadUsersData()
            break
        case "meetings-list":
            loadMeetingsData()
            break
        case "credentials-list":
            loadCredentialsData()
            break
        case "matches-list":
            loadMatchesData()
            break
    }
}

function switchSection(sectionName) {
    // Update navigation
    document.querySelectorAll(".nav-item").forEach((item) => {
        item.classList.remove("active")
    })
    document.querySelector(`[data-section="${sectionName}"]`).classList.add("active")

    // Update sections
    document.querySelectorAll(".admin-section").forEach((section) => {
        section.classList.remove("active")
    })
    document.getElementById(sectionName).classList.add("active")

    currentSection = sectionName
}

function setupFilters() {
    // Users filters
    const userSearchInput = document.getElementById("userSearch")
    const userStatusFilter = document.getElementById("statusFilter")

    if (userSearchInput) {
        userSearchInput.addEventListener("input", () => filterUsers())
    }

    if (userStatusFilter) {
        userStatusFilter.addEventListener("change", () => filterUsers())
    }

    // Meetings filters
    const meetingSearchInput = document.getElementById("meetingSearch")
    const meetingStatusFilter = document.getElementById("meetingStatusFilter")

    if (meetingSearchInput) {
        meetingSearchInput.addEventListener("input", () => filterMeetings())
    }

    if (meetingStatusFilter) {
        meetingStatusFilter.addEventListener("change", () => filterMeetings())
    }

    // Credentials filters
    const credentialsSearchInput = document.getElementById("credentialsSearch")

    if (credentialsSearchInput) {
        credentialsSearchInput.addEventListener("input", () => filterCredentials())
    }

    // Matches filters
    const matchesSearchInput = document.getElementById("matchesSearch")
    const matchStatusFilter = document.getElementById("matchStatusFilter")

    if (matchesSearchInput) {
        matchesSearchInput.addEventListener("input", () => filterMatches())
    }

    if (matchStatusFilter) {
        matchStatusFilter.addEventListener("change", () => filterMatches())
    }
}

// Users data handling
async function loadUsersData(page = 1) {
    try {
        const response = await fetch(`/api/user/?page=${page}&limit=${usersPagination.limit}`)
        if (!response.ok) {
            throw new Error('Failed to load users data')
        }

        const data = await response.json()
        users = data.items || []
        usersPagination.page = page
        usersPagination.totalPages = Math.ceil(data.total / usersPagination.limit)

        renderUsersTable(users)
        renderPagination('usersPagination', usersPagination, loadUsersData)
    } catch (error) {
        console.error('Error loading users data:', error)
        showNotification('Помилка завантаження даних користувачів', 'error')
    }
}


// Meetings data handling
async function loadMeetingsData(page = 1) {
    try {
        const response = await fetch(`/api/meeting/?page=${page}&limit=${meetingsPagination.limit}`)
        if (!response.ok) {
            throw new Error('Failed to load meetings data')
        }

        const data = await response.json()
        meetings = data.items || []
        meetingsPagination.page = page
        meetingsPagination.totalPages = Math.ceil(data.total / meetingsPagination.limit)

        renderMeetingsCards(meetings)
        renderPagination('meetingsPagination', meetingsPagination, loadMeetingsData)
    } catch (error) {
        console.error('Error loading meetings data:', error)
        showNotification('Помилка завантаження даних зустрічей', 'error')
    }
}


// Credentials data handling
async function loadCredentialsData(page = 1) {
    try {
        const response = await fetch(`/api/credentials/?page=${page}&limit=${credentialsPagination.limit}`)
        if (!response.ok) {
            throw new Error('Failed to load credentials data')
        }

        const data = await response.json()
        credentials = data.items || []
        credentialsPagination.page = page
        credentialsPagination.totalPages = Math.ceil(data.total / credentialsPagination.limit)

        renderCredentialsCards(credentials)
        renderPagination('credentialsPagination', credentialsPagination, loadCredentialsData)
    } catch (error) {
        console.error('Error loading credentials data:', error)
        showNotification('Помилка завантаження облікових даних', 'error')
    }
}


// Matches data handling
async function loadMatchesData(page = 1) {
    try {
        const response = await fetch(`/api/match/?page=${page}&limit=${matchesPagination.limit}`)
        if (!response.ok) {
            throw new Error('Failed to load matches data')
        }

        const data = await response.json()
        matches = data.items || []
        matchesPagination.page = page
        matchesPagination.totalPages = Math.ceil(data.total / matchesPagination.limit)

        renderMatchesCards(matches)
        renderPagination('matchesPagination', matchesPagination, loadMatchesData)
    } catch (error) {
        console.error('Error loading matches data:', error)
        showNotification('Помилка завантаження даних збігів', 'error')
    }
}


function renderUsersTable(usersToRender = users) {
    const tbody = document.getElementById("usersTableBody")
    if (!tbody) return

    tbody.innerHTML = ""

    if (usersToRender.length === 0) {
        const row = document.createElement("tr")
        row.innerHTML = `<td colspan="9" class="text-center">Користувачів не знайдено</td>`
        tbody.appendChild(row)
        return
    }

    usersToRender.forEach((user) => {
        const row = document.createElement("tr")
        row.innerHTML = `
      <td>
        <div class="user-info">
          <img src="${user.images[0] || '/static/uploads/blank.jpg'}" alt="${user.name}" class="user-avatar">
          <div>
            <div class="user-name">${user.name}</div>
          </div>
        </div>
      </td>
      <td>${user.age}</td>
      <td>${zodiacsNames[user.sign]["name"]}</td>
      <td>
        <span class="status-badge ${user.status}">
          ${user.is_active ? "Активний" : "Неактивний"}
        </span>
      </td>
      <td>${formatDate(user.registration_date)}</td>
      <td>
        <div class="action-buttons">
          <button class="action-btn edit" data-id="${user.user_id}" title="Редагувати">
            <i class="fas fa-edit"></i>
          </button>

          <button class="action-btn delete" data-id="${user.user_id}" title="Видалити">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    `
        // Add event listeners to buttons
        const editBtn = row.querySelector('.action-btn.edit');
        editBtn.addEventListener('click', () => editUser(parseInt(editBtn.dataset.id)));

        const deleteBtn = row.querySelector('.action-btn.delete');
        deleteBtn.addEventListener('click', () => deleteUser(parseInt(deleteBtn.dataset.id)));

        tbody.appendChild(row)
    })
}

function renderMeetingsCards(meetingsToRender = meetings) {
    const container = document.getElementById("meetingsContainer")
    if (!container) return

    container.innerHTML = ""

    if (meetingsToRender.length === 0) {
        container.innerHTML = `<div class="empty-message">Зустрічей не знайдено</div>`
        return
    }

    meetingsToRender.forEach((meeting) => {
        const card = document.createElement("div")
        card.className = "meeting-card"

        // Format date if available
        const meetingDate = meeting.meeting_date ? new Date(meeting.meeting_date).toLocaleString("uk-UA") : 'Не заплановано'

        card.innerHTML = `
            <div class="meeting-card-header">
                <h4>Зустріч #${meeting.meeting_id || ''}</h4>
                <span class="status-badge ${meeting.archived}">${meeting.archived ? "Архівована" : "Активна"}</span>
            </div>
            <div class="meeting-card-content">
                <p><strong>Запросив:</strong> ${meeting.req_user ? meeting.req_user.name : 'Невідомо'}</p>
                <p><strong>Зустріч з:</strong> ${meeting.meet_user ? meeting.meet_user.name : 'Невідомо'}</p>
                <p><strong>Місце:</strong> ${meeting.location || 'Не вказано'}</p>
                <p><strong>Дата:</strong> ${meetingDate}</p>
            </div>
            <div class="meeting-card-actions">
                <button class="action-btn edit" data-id="${meeting.meeting_id}" title="Редагувати">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" data-id="${meeting.meeting_id}" title="Видалити">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `

        // Add event listeners to buttons
        const editBtn = card.querySelector('.action-btn.edit');
        editBtn.addEventListener('click', () => editMeeting(parseInt(editBtn.dataset.id)));

        const deleteBtn = card.querySelector('.action-btn.delete');
        deleteBtn.addEventListener('click', () => deleteMeeting(parseInt(deleteBtn.dataset.id)));

        container.appendChild(card)
    })
}

const roles = {
    guest: "Гість",
    authorized: "Користувач",
    operator: "Оператор",
    admin: "Адміністратор"
};

function renderCredentialsCards(credentialsToRender = credentials) {
    const container = document.getElementById("credentialsContainer")
    if (!container) return

    container.innerHTML = ""

    if (credentialsToRender.length === 0) {
        container.innerHTML = `<div class="empty-message">Облікових даних не знайдено</div>`
        return
    }

    credentialsToRender.forEach((credential) => {
        console.log(credential)
        const card = document.createElement("div")
        card.className = "credential-card"

        card.innerHTML = `
            <div class="credential-card-header">
                <h4>Обліковий запис #${credential.key_id || ''}</h4>
            </div>
            <div class="credential-card-content">
                <p><strong>ID:</strong> ${credential.user_id || 'Не прив\'язано'}</p>
                <p><strong>Пошта:</strong> ${credential.login || ''}</p>
                <p><strong>Роль:</strong> ${credential.access_right ? roles[credential.access_right] : 'Відсутня'}</p>
            </div>
            <div class="credential-card-actions">
                <button class="action-btn edit" data-id="${credential.key_id}" title="Редагувати">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" data-id="${credential.key_id}" title="Видалити">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `

        // Add event listeners to buttons
        const editBtn = card.querySelector('.action-btn.edit');
        editBtn.addEventListener('click', () => editCredential(parseInt(editBtn.dataset.id)));

        const deleteBtn = card.querySelector('.action-btn.delete');
        deleteBtn.addEventListener('click', () => deleteCredential(parseInt(deleteBtn.dataset.id)));

        container.appendChild(card)
    })
}

function renderMatchesCards(matchesToRender = matches) {
    const container = document.getElementById("matchesContainer")
    if (!container) return

    container.innerHTML = ""

    if (matchesToRender.length === 0) {
        container.innerHTML = `<div class="empty-message">Збігів не знайдено</div>`
        return
    }

    matchesToRender.forEach((match) => {
        const card = document.createElement("div")
        card.className = "match-card"

        card.innerHTML = `
    <div class="match-card-header">
        <h4>Збіг #${match.match_id}</h4>
        <span class="status-badge ${match.status}">${match.archived ? "Активна" : "Архівована"}</span>
    </div>
    <div class="match-card-content">
        <div class="match-users">
            <div class="match-user">
                <img src="${match.req_user?.images?.[0] || '/static/img/default.png'}" 
                     alt="${match.req_user?.name || 'User'}" 
                     class="match-avatar">
                <p>${match.req_user?.name || 'Невідомо'}</p>
            </div>
            <div class="match-arrow">❤️</div>
            <div class="match-user">
                <img src="${match.match_user?.images?.[0] || '/static/img/default.png'}" 
                     alt="${match.match_user?.name || 'User'}" 
                     class="match-avatar">
                <p>${match.match_user?.name || 'Невідомо'}</p>
            </div>
        </div>
        <p><strong>Оцінка збігу:</strong> ${`${match.score}%` || 'Н/Д'}</p>
        <p><strong>Створено:</strong> ${formatDate(match.created_at)}</p>
    </div>
    <div class="match-card-actions">
        <button class="action-btn edit" data-id="${match.match_id}" title="Редагувати">
            <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn delete" data-id="${match.match_id}" title="Видалити">
            <i class="fas fa-trash"></i>
        </button>
    </div>
`

        // Add event listeners to buttons
        const editBtn = card.querySelector('.action-btn.edit');
        editBtn.addEventListener('click', () => editMatch(parseInt(editBtn.dataset.id)));

        const deleteBtn = card.querySelector('.action-btn.delete');
        deleteBtn.addEventListener('click', () => deleteMatch(parseInt(deleteBtn.dataset.id)));

        container.appendChild(card)
    })
}

function renderPagination(containerId, paginationState, loadFunction) {
    const container = document.getElementById(containerId)
    if (!container) return

    container.innerHTML = ''

    if (paginationState.totalPages <= 1) return

    // Previous button
    const prevBtn = document.createElement('button')
    prevBtn.className = 'pagination-btn'
    prevBtn.innerHTML = '&laquo;'
    prevBtn.disabled = paginationState.page === 1
    prevBtn.addEventListener('click', () => loadFunction(paginationState.page - 1))
    container.appendChild(prevBtn)

    // Page buttons
    const startPage = Math.max(1, paginationState.page - 2)
    const endPage = Math.min(paginationState.totalPages, startPage + 4)

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button')
        pageBtn.className = `pagination-btn ${i === paginationState.page ? 'active' : ''}`
        pageBtn.textContent = i
        pageBtn.addEventListener('click', () => loadFunction(i))
        container.appendChild(pageBtn)
    }

    // Next button
    const nextBtn = document.createElement('button')
    nextBtn.className = 'pagination-btn'
    nextBtn.innerHTML = '&raquo;'
    nextBtn.disabled = paginationState.page === paginationState.totalPages
    nextBtn.addEventListener('click', () => loadFunction(paginationState.page + 1))
    container.appendChild(nextBtn)
}

async function updateStats() {
    const totalUsersEl = document.getElementById("totalUsers")
    const activeUsersEl = document.getElementById("activeUsers")
    const activeUsersTodayEl = document.getElementById("newUsersToday")
    const activeUsersPercentEl = document.getElementById("activeUsersPercent")
    const totalMatchesEl = document.getElementById("totalMatches")
    const matchesTodayEl = document.getElementById("matchesToday")
    const refusalCountEl = document.getElementById("refusalCount")
    const couplesCountEl = document.getElementById("couplesCount")

    const usersStats = await fetchUserStats();
    if (usersStats) {
        if (totalUsersEl) totalUsersEl.textContent = usersStats.total_users
        if (activeUsersEl) activeUsersEl.textContent = usersStats.active_users_month
        if (activeUsersTodayEl) activeUsersTodayEl.textContent = usersStats.active_users_today
        if (activeUsersPercentEl) {
            activeUsersPercentEl.textContent =
                ((usersStats.active_users_month / usersStats.total_users) * 100).toFixed(2);
        }
    }

    const matchesStats = await fetchMatchStats();
    if (matchesStats) {
        if (totalMatchesEl) totalMatchesEl.textContent = matchesStats.total_matches
        if (matchesTodayEl) matchesTodayEl.textContent = matchesStats.today_matches
    }

    const refusalStats = await fetchRefusalCount();
    if (refusalStats) {
        refusalCountEl.innerText = refusalStats
    }

    const couplesStats = await fetchSuccessfulCouplesCount()
    if (couplesStats) {
        couplesCountEl.innerText = couplesStats
    }

    await updateRegisterStats();
    await updateZodiacStats();
    await updateQuartalStats();
    await updateRecentRegistrations();
    await updateGenderStats();

    await updateSuccessfulCouples();
    await updatePlannedMeetings();
    await updateAttendanceByGender();
}


const daysMap = {
    mon: "Пн",
    tue: "Вт",
    wed: "Ср",
    thu: "Чт",
    fri: "Пт",
    sat: "Сб",
    sun: "Нд"
};

async function updateRegisterStats() {
    const regData = await fetchRegistrationStats()
    const maxVal = Math.max(...Object.values(regData), 1);
    for (const [id, day] of Object.entries(daysMap)) {
        const percent = (regData[day] / maxVal * 100).toFixed(2);
        document.getElementById(id).style.height = `${percent}%`;
        const numEl = document.getElementById(`${id}-num`);
        if (numEl) {
            numEl.textContent = regData[day];
        }
    }
}

async function updateZodiacStats() {
    const zodiacData = await fetchZodiacStats()
    const zodiacStatsContainer = document.querySelector(".zodiac-stats");

    const maxVal = Math.max(...Object.values(zodiacData));

    Object.entries(zodiacData).forEach(([key, count]) => {
        const {name, emj} = zodiacsNames[key];
        const percent = (count / maxVal) * 100;

        const item = document.createElement("div");
        item.classList.add("zodiac-item");

        item.innerHTML = `
        <span class="zodiac-sign">${emj}</span>
        <span class="zodiac-name">${name}</span>
        <div class="zodiac-bar">
            <div class="zodiac-fill" style="width: ${percent}%"></div>
        </div>
        <span class="zodiac-count">${count}</span>
    `;

        zodiacStatsContainer.appendChild(item);
    });
}

const quartalMap = {
    "1": "first",
    "2": "second",
    "3": "third",
    "4": "fourth"
}

async function updateQuartalStats() {
    const statsData = await fetchQuartalStats();

    const maxVal = Math.max(...statsData.map(q => q.active_users_count), 1);
    statsData.forEach(q => {
        const id = quartalMap[q.quarter];

        const percent = (q.active_users_count / maxVal * 100).toFixed(2);
        const barEl = document.getElementById(`${id}`);
        if (barEl) {
            barEl.style.height = `${percent}%`;
        }

        const numEl = document.getElementById(`${id}-num`);
        if (numEl) {
            numEl.textContent = q.active_users_count;
        }

        const regEl = document.getElementById(`${id}-reg`);
        if (regEl) {
            regEl.textContent = q.registered_count;
        }
    });
}

async function updateRecentRegistrations() {
    const statsData = await fetchRecentRegistrations();

    // беремо максимум для масштабу висоти барів
    const maxVal = Math.max(statsData.last_6_months, statsData.last_month, 1);

    // шестимісячний бар
    const sixMonthBar = document.getElementById("six-month");
    if (sixMonthBar) {
        const percent = (statsData.last_6_months / maxVal * 100).toFixed(2);
        sixMonthBar.style.width = `${percent}%`;
        const numEl = document.getElementById("six-month-num");
        if (numEl) numEl.textContent = statsData.last_6_months;
    }

    // одномісячний бар
    const oneMonthBar = document.getElementById("one-month");
    if (oneMonthBar) {
        const percent = (statsData.last_month / maxVal * 100).toFixed(2);
        oneMonthBar.style.width = `${percent}%`;
        const numEl = document.getElementById("one-month-num");
        if (numEl) numEl.textContent = statsData.last_month;
    }
}

const genderEmojis = {
    male: {emj: "👨", name: "Чоловік"},
    female: {emj: "👩", name: "Жінка"},
    other: {emj: "🧑", name: "Інше"}
};

async function updateGenderStats() {
    const genderData = await fetchGenderStats();
    const genderStatsContainer = document.querySelector(".gender-stats");

    if (!genderData) return;

    const maxVal = Math.max(...Object.values(genderData), 1);

    Object.entries(genderData).forEach(([gender, count]) => {
        const emj = genderEmojis[gender]["emj"] || "❓";
        const name = genderEmojis[gender]["name"];
        const percent = (count / maxVal) * 100;

        const item = document.createElement("div");
        item.classList.add("zodiac-item");

        item.innerHTML = `
            <span class="zodiac-sign">${emj}</span>
            <span class="zodiac-name">${name}</span>
            <div class="zodiac-bar">
                <div class="zodiac-fill" style="width: ${percent}%"></div>
            </div>
            <span class="zodiac-count">${count}</span>
        `;

        genderStatsContainer.appendChild(item);
    });
}

async function updateSuccessfulCouples() {
    const couplesData = await fetchSuccessfulCouples();
    const listContainer = document.querySelector(".matches-list");

    if (!couplesData) return;

    listContainer.innerHTML = ""; // очистка

    couplesData.forEach(({match, meeting}) => {
        const u1 = match.match_user;
        const u2 = match.req_user;

        // форматування дати
        const date = new Date(meeting.meeting_date).toLocaleString("uk-UA", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });

        // місце
        const location = meeting.location?.replace(" ", ", ") || "—";

        const item = document.createElement("div");
        item.classList.add("meeting-item");

        item.innerHTML = `
            <div class="avatars">
                <img src="${u1.images[0] || 'static/default.png'}" class="avatar">
                <img src="${u2.images[0] || 'static/default.png'}" class="avatar">
            </div>
            <div class="meeting-info">
                <div class="meeting-names">
                    <span>${u1.name} (${u1.age}р, ♑)</span>
                    ❤️
                    <span>${u2.name} (${u2.age}р, ♑)</span>
                </div>
                <div class="meeting-meta">
                    ${date}
                </div>
            </div>
        `;

        listContainer.appendChild(item);
    });
}

async function updatePlannedMeetings() {
    const meetingsData = await fetchPlannedMeetings();
    const listContainer = document.querySelector(".meetings-list");

    if (!meetingsData) return;

    listContainer.innerHTML = ""; // очистка перед заповненням

    meetingsData.forEach(({meet_user, req_user, meeting_date, location}) => {
        // форматування дати
        const date = new Date(meeting_date).toLocaleString("uk-UA", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });

        // форматування місця
        const loc = location?.replace(" ", ", ") || "—";

        const item = document.createElement("div");
        item.classList.add("meeting-item");

        item.innerHTML = `
            <div class="avatars">
                <img src="${meet_user.images[0] || 'static/default.png'}" class="avatar">
                <img src="${req_user.images[0] || 'static/default.png'}" class="avatar">
            </div>
            <div class="meeting-info">
                <div class="meeting-names">
                    <span>${meet_user.name} (${meet_user.age}р, ♑)</span>
                    🤝
                    <span>${req_user.name} (${req_user.age}р, ♑)</span>
                </div>
                <div class="meeting-meta">
                    ${date}
                </div>
            </div>
        `;

        listContainer.appendChild(item);
    });
}

async function updateAttendanceByGender() {
    const attendanceData = await fetchAttendanceByGender();
    const listContainer = document.querySelector(".gender-list");

    if (!attendanceData) return;

    listContainer.innerHTML = ""; // очистка перед заповненням

    const genders = ["female", "male", "other"];

    genders.forEach(gender => {
        const users = attendanceData[gender];
        if (!users || users.length === 0) return;

        // Додаємо заголовок по гендеру
        const genderHeader = document.createElement("div");
        genderHeader.classList.add("gender-header");
        genderHeader.textContent = gender === "female" ? "Жінки" : gender === "male" ? "Чоловіки" : "Інші";
        listContainer.appendChild(genderHeader);

        users.forEach(user => {
            const item = document.createElement("div");
            item.classList.add("meeting-item");
            item.innerHTML = `
                <div class="meeting-names">
                    ${user.name} ${genderEmoji(user.gender)}
                </div>
            `;
            listContainer.appendChild(item);
        });
    });
}

// функція для емодзі за гендером
function genderEmoji(gender) {
    if (gender === "female") return "♀️";
    if (gender === "male") return "♂️";
    return "⚧";
}

async function fetchAttendanceByGender() {
    const resp = await fetch("/api/admin/get-attendance-by-gender");
    if (!resp.ok) {
        showNotification("Помилка отримання даних про відвідуваність", "error");
        return null;
    }
    return await resp.json();
}

async function fetchPlannedMeetings() {
    const resp = await fetch("/api/admin/get-planned-meetings");
    if (!resp.ok) {
        showNotification("Помилка отримання запланованих зустрічей", "error");
        return null;
    }
    return await resp.json();
}

async function fetchSuccessfulCouples() {
    const resp = await fetch("/api/admin/get-successful-couples-info");
    if (!resp.ok) {
        showNotification("Помилка отримання успішних зустрічей", "error");
        return null;
    }
    return await resp.json();
}

async function fetchGenderStats() {
    const resp = await fetch("/api/admin/get-conducted-meetings-by-gender");

    if (!resp.ok) {
        showNotification("Помилка отримання статистики зустрічей за ґендером", "error");
        return null;
    }
    return await resp.json();
}

async function fetchRecentRegistrations() {
    const resp = await fetch("/api/admin/get-recent-registrations");
    if (!resp.ok) {
        showNotification("Помилка отримання статистики реєстрацій", "error");
        return {last_6_months: 0, last_month: 0};
    }
    return await resp.json();
}

async function fetchRefusalCount() {
    const resp = await fetch("/api/admin/get-refusal-count");
    if (!resp.ok) {
        showNotification("Помилка отримання кількості відмов", "error");
        return
    }
    return await resp.json();
}

async function fetchSuccessfulCouplesCount() {
    const resp = await fetch("/api/admin/get-successful-couples");
    if (!resp.ok) {
        showNotification("Помилка отримання кількості пар", "error");
        return
    }
    return await resp.json();
}

async function fetchUserStats() {
    const resp = await fetch("/api/admin/get-user-stats")

    if (!resp.ok) {
        showNotification("Помилка отримання статистики про юзерів", "error")
        return
    }
    return await resp.json()
}

async function fetchMatchStats() {
    const resp = await fetch("/api/admin/get-match-stats")

    if (!resp.ok) {
        showNotification("Помилка отримання статистики про збіги", "error")
        return
    }
    return await resp.json()
}

async function fetchRegistrationStats() {
    const resp = await fetch("/api/admin/get-registration-stats")

    if (!resp.ok) {
        showNotification("Помилка отримання статистики про реєстрацію", "error")
        return
    }
    return await resp.json()
}


async function fetchZodiacStats() {
    const resp = await fetch("/api/admin/get-zodiac-stats")

    if (!resp.ok) {
        showNotification("Помилка отримання статистики про знаки зодіаків", "error")
        return
    }
    return await resp.json()
}

async function fetchQuartalStats() {
    const resp = await fetch("/api/admin/get-quarterly-clients")

    if (!resp.ok) {
        showNotification("Помилка отримання статистики про клієнтів за квартал", "error")
        return
    }
    return await resp.json()
}

// User editing functions
function editUser(userId) {
    const user = users.find((u) => u.user_id === userId)
    if (!user) return

    console.log(user)
    // Заповнюємо форму поточними даними користувача
    document.getElementById("editUserId").value = user.user_id
    document.getElementById("editFirstName").value = user.first_name || ""
    document.getElementById("editLastName").value = user.last_name || ""
    document.getElementById("editBio").value = user.bio || ""
    document.getElementById("editIsActive").checked = !!user.is_active
    document.getElementById("editIsAdmin").checked = !!user.is_admin

    // Показуємо модалку
    document.getElementById("editUserModal").style.display = "flex"
    document.body.style.overflow = "hidden"
}

function closeEditModal() {
    document.getElementById("editUserModal").style.display = "none"
    document.body.style.overflow = ""
}

async function saveUserChanges() {
    const userId = Number.parseInt(document.getElementById("editUserId").value)
    const first_name = document.getElementById("editFirstName").value
    const last_name = document.getElementById("editLastName").value
    const bio = document.getElementById("editBio").value
    const is_active = document.getElementById("editIsActive").checked
    const is_admin = document.getElementById("editIsAdmin").checked

    try {
        const response = await fetch(`/api/user/${userId}`, {
            method: "POST", // бо у тебе у Flask `methods=['POST']`
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({first_name, last_name, bio, is_active, is_admin}),
        })

        if (!response.ok) {
            throw new Error("Failed to update user")
        }

        // Update the user in the local array
        const userIndex = users.findIndex((u) => u.user_id === userId)
        if (userIndex !== -1) {
            users[userIndex] = {
                ...users[userIndex],
                first_name,
                last_name,
                bio,
                is_active,
                is_admin
            }
        }

        // Re-render the table
        renderUsersTable()

        // Close the modal
        closeEditModal()

        // Show success notification
        showNotification("Користувача успішно оновлено ✅", "success")
    } catch (error) {
        console.error("Error updating user:", error)
        showNotification("Не вдалося оновити користувача ❌", "error")
    }
}

// Meeting editing functions
function editMeeting(meetingId) {
    const meeting = meetings.find(m => m.meeting_id === meetingId);
    if (!meeting) return;

    // Create modal if it doesn't exist
    let modal = document.getElementById('editMeetingModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'editMeetingModal';
        modal.className = 'modal';
        modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Редагувати зустріч</h2> 
                <button class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="editMeetingForm">
                    <input type="hidden" id="editMeetingId">

                    <div class="form-group">
                        <label for="editMeetingDate">Дата:</label>
                        <input type="datetime-local" id="editMeetingDate" class="form-control">
                    </div>

                    <!-- Map block -->
                    <div class="form-group">
                        <label>Місце:</label>
                        <div id="editMeetingMap" style="height: 250px; border-radius: 8px;"></div>
                        <input type="hidden" id="editMeetingLocation">
                    </div>

                    <div class="form-group">
                        <label for="editMeetingUser1Comment">Коментар користувача 1:</label>
                        <textarea id="editMeetingUser1Comment" class="form-control"></textarea>
                    </div>

                    <div class="form-group">
                        <label for="editMeetingUser2Comment">Коментар користувача 2:</label>
                        <textarea id="editMeetingUser2Comment" class="form-control"></textarea>
                    </div>

                    <div class="form-group">
                        <label for="editMeetingResult">Результат:</label>
                        <select id="editMeetingResult" class="form-control">
                            <option value="">—</option>
                            <option value="success">Успіх</option>
                            <option value="fail">Неуспіх</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="editMeetingArchived"> Архівувати
                        </label>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline">Скасувати</button>
                <button type="button" class="btn btn-primary">Зберегти</button>
            </div>
        </div>
        `;
        document.body.appendChild(modal);
    }

    // Fill form with meeting data
    document.getElementById('editMeetingId').value = meeting.meeting_id;
    document.getElementById('editMeetingUser1Comment').value = meeting.user1_comment || '';
    document.getElementById('editMeetingUser2Comment').value = meeting.user2_comment || '';
    document.getElementById('editMeetingResult').value = meeting.result || '';
    document.getElementById('editMeetingArchived').checked = !!meeting.archived;

    if (meeting.meeting_date) {
        const date = new Date(meeting.meeting_date);
        document.getElementById('editMeetingDate').value = date.toISOString().slice(0, 16);
    } else {
        document.getElementById('editMeetingDate').value = '';
    }

    // Видаляємо стару карту і маркер, якщо існують
    if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
        mapMarker = null;
    }

    // Ініціалізація карти
    setTimeout(() => {
        mapInstance = L.map('editMeetingMap').setView([50.4501, 30.5234], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(mapInstance);

        // Створюємо маркер для поточного місця
        if (meeting.location) {
            const coords = meeting.location.split(' ').map(Number);
            if (!isNaN(coords[0]) && !isNaN(coords[1])) {
                const [lat, lng] = coords;
                mapMarker = L.marker([lat, lng]).addTo(mapInstance);
                mapInstance.setView([lat, lng], 14);
                document.getElementById('editMeetingLocation').value = `${lat} ${lng}`;
            }
        }

        // Клік по карті оновлює маркер і поле
        mapInstance.on('click', function (e) {
            if (mapMarker) mapMarker.setLatLng(e.latlng);
            else mapMarker = L.marker(e.latlng).addTo(mapInstance);
            document.getElementById('editMeetingLocation').value = `${e.latlng.lat} ${e.latlng.lng}`;
        });
    }, 200);

    // Show modal
    modal.style.display = 'flex';
}

function closeEditMeetingModal() {
    const modal = document.getElementById('editMeetingModal')
    if (modal) modal.style.display = 'none'
}

function closeEditMatchModal() {
    const modal = document.getElementById('editMatchModal')
    if (modal) modal.style.display = 'none'
}

async function saveMeetingChanges() {
    const meetingId = document.getElementById('editMeetingId').value;
    const meetingData = {
        meeting_date: document.getElementById('editMeetingDate').value || null,
        location: document.getElementById('editMeetingLocation').value || null,
        user1_comment: document.getElementById('editMeetingUser1Comment').value,
        user2_comment: document.getElementById('editMeetingUser2Comment').value,
        result: document.getElementById('editMeetingResult').value,
        archived: document.getElementById('editMeetingArchived').checked
    };

    try {
        const response = await fetch(`/api/meeting/${meetingId}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(meetingData)
        });

        if (!response.ok) throw new Error('Не вдалося оновити зустріч');

        const updatedMeeting = await response.json();

        // Оновлюємо локальний масив meetings
        const index = meetings.findIndex(m => m.meeting_id == meetingId);
        if (index !== -1) {
            meetings[index] = {...meetings[index], ...meetingData};
        }

        // Перерендерюємо картки
        renderMeetingsCards();

        // Закриваємо модалку
        closeEditMeetingModal();

        showNotification('Зустріч успішно оновлено', 'success');

    } catch (err) {
        console.error(err);
        showNotification('Не вдалося оновити зустріч', 'error');
    }
}

async function cancelMeeting(meetingId) {
    if (!confirm('Ви впевнені, що хочете скасувати цю зустріч?')) return

    try {
        const response = await fetch(`/api/meeting/${meetingId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({status: 'cancelled'})
        })

        if (!response.ok) {
            throw new Error('Failed to cancel meeting')
        }

        // Update meeting in local array
        const meetingIndex = meetings.findIndex(m => m.meeting_id === meetingId)
        if (meetingIndex !== -1) {
            meetings[meetingIndex].status = 'cancelled'
        }

        // Re-render meetings
        renderMeetingsCards()

        // Show success notification
        showNotification('Зустріч скасовано', 'success')
    } catch (error) {
        console.error('Error cancelling meeting:', error)
        showNotification('Не вдалося скасувати зустріч', 'error')
    }
}

async function restoreMeeting(meetingId) {
    try {
        const response = await fetch(`/api/meeting/${meetingId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({status: 'pending'})
        })

        if (!response.ok) {
            throw new Error('Failed to restore meeting')
        }

        // Update meeting in local array
        const meetingIndex = meetings.findIndex(m => m.meeting_id === meetingId)
        if (meetingIndex !== -1) {
            meetings[meetingIndex].status = 'pending'
        }

        // Re-render meetings
        renderMeetingsCards()

        // Show success notification
        showNotification('Зустріч відновлено', 'success')
    } catch (error) {
        console.error('Error restoring meeting:', error)
        showNotification('Не вдалося відновити зустріч', 'error')
    }
}

// Credential editing functions
function editCredential(credentialId) {
    const credential = credentials.find(c => c.key_id === credentialId)
    if (!credential) return

    // Create modal if it doesn't exist
    let modal = document.getElementById('editCredentialModal')
    if (!modal) {
        modal = document.createElement('div')
        modal.id = 'editCredentialModal'
        modal.className = 'modal'
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Редагувати обліковий запис</h2>
                    <button class="modal-close"">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="editCredentialForm">
                        <input type="hidden" id="editCredentialId">
                        <div class="form-group">
                            <label for="editCredentialLogin">Пошта</label>
                            <input type="email" id="editCredentialLogin" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="editCredentialPassword">Новий пароль:</label>
                            <input type="password" id="editCredentialPassword" class="form-control" placeholder="Залиште порожнім, щоб не змінювати">
                        </div>
                        <div class="form-group">
                            <label for="editCredentialAccess">Права доступу:</label>
                            <select id="editCredentialAccess" class="form-control">
                                <option value="guest">Гість</option>
                                <option value="authorized">Користувач</option>
                                <option value="operator">Оператор</option>
                                <option value="admin">Адміністратор</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline"">Скасувати</button>
                    <button type="button" class="btn btn-primary">Зберегти</button>
                </div>
            </div>
        `
        document.body.appendChild(modal)
    }

    // Fill form with credential data
    document.getElementById('editCredentialId').value = credential.key_id
    document.getElementById('editCredentialLogin').value = credential.login
    document.getElementById('editCredentialPassword').value = ''
    document.getElementById('editCredentialAccess').value = credential.access_right || 'guest'

    // Show modal
    modal.style.display = 'flex'
}

function isValidEmail(email) {
    return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email);
}

function closeEditCredentialModal() {
    const modal = document.getElementById('editCredentialModal')
    if (modal) modal.style.display = 'none'
}

async function saveCredentialChanges() {
    const credentialId = document.getElementById('editCredentialId').value
    const login = document.getElementById('editCredentialLogin').value
    const password = document.getElementById('editCredentialPassword').value
    const accessRight = document.getElementById('editCredentialAccess').value

    if (!isValidEmail(login)) {
        showNotification("Введіть правильну пошту")
        return
    }

    const credentialData = {login, access_right: accessRight}
    if (password.trim() !== '') {
        credentialData.password = password
    }

    try {
        const response = await fetch(`/api/credentials/${credentialId}`, {
            method: 'POST', // бо бекенд чекає POST
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentialData)
        })

        if (!response.ok) {
            throw new Error('Failed to update credential')
        }

        // Update credential in local array
        const credentialIndex = credentials.findIndex(c => c.key_id === parseInt(credentialId))
        if (credentialIndex !== -1) {
            credentials[credentialIndex] = {...credentials[credentialIndex], ...credentialData}
        }

        renderCredentialsCards()
        closeEditCredentialModal()
        showNotification('Обліковий запис успішно оновлено', 'success')
    } catch (error) {
        console.error('Error updating credential:', error)
        showNotification('Не вдалося оновити обліковий запис', 'error')
    }
}

// Match editing functions
async function editMatch(matchId) {
    const match = matches.find(m => m.match_id === matchId)
    if (!match) return

    let modal = document.getElementById('editMatchModal')
    if (!modal) {
        modal = document.createElement('div')
        modal.id = 'editMatchModal'
        modal.className = 'modal'
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Редагувати збіг</h2>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="editMatchForm">
                        <input type="hidden" id="editMatchId">

                        <div class="form-group">
                            <label for="editMatchUser1">Користувач 1:</label>
                            <select id="editMatchUser1" class="form-control" size="10"></select>
                        </div>
                        <div class="form-group">
                            <label for="editMatchUser2">Користувач 2:</label>
                            <select id="editMatchUser2" class="form-control" size="10"></select>
                        </div>

                        <div class="form-group">
                            <label for="editMatchArchived">
                                Архівовано:
                                <input type="checkbox" id="editMatchArchived">
                            </label>
                        </div>

                        <div class="form-group">
                            <label for="editMatchComment">Коментар:</label>
                            <textarea id="editMatchComment" class="form-control"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline">Скасувати</button>
                    <button type="button" class="btn btn-primary">Зберегти</button>
                </div>
            </div>
        `
        document.body.appendChild(modal)
    }

    // Заповнюємо загальні поля
    document.getElementById('editMatchId').value = match.match_id
    document.getElementById('editMatchArchived').checked = !!match.archived
    document.getElementById('editMatchComment').value = match.comment || ''

    // --- Загальна підвантаження користувачів ---
    const allUsers = []
    let page = 1, pages = 1, loading = false

    async function loadUsersPage() {
        if (loading || page > pages) return false
        loading = true
        const resp = await fetch(`/api/user/?page=${page}&per_page=20`)
        const data = await resp.json()
        pages = data.pages
        allUsers.push(...(data.items || []))
        page++
        loading = false
        return true
    }

    await loadUsersPage()

    // --- Функція для заповнення селектора ---
    function fillSelect(selectEl, currentUser) {
        selectEl.innerHTML = ''

        // Поточного користувача ставимо першим
        if (currentUser) {
            const option = document.createElement('option')
            option.value = currentUser.user_id
            option.textContent = currentUser.name
            option.selected = true
            selectEl.appendChild(option)
        }

        allUsers.forEach(u => {
            if (!currentUser || u.user_id !== currentUser.user_id) {
                const option = document.createElement('option')
                option.value = u.user_id
                option.textContent = u.name
                selectEl.appendChild(option)
            }
        })
    }

    const select1 = document.getElementById('editMatchUser1')
    const select2 = document.getElementById('editMatchUser2')
    fillSelect(select1, match.req_user)
    fillSelect(select2, match.match_user)

    // Lazy loading при скролі, але однакові дані для обох селекторів
    async function handleScroll(el) {
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
            if (await loadUsersPage()) {
                fillSelect(select1, match.req_user)
                fillSelect(select2, match.match_user)
            }
        }
    }

    select1.addEventListener('scroll', () => handleScroll(select1))
    select2.addEventListener('scroll', () => handleScroll(select2))

    modal.style.display = 'flex'
}

async function saveMatchChanges() {
    const matchId = document.getElementById('editMatchId').value
    const archived = document.getElementById('editMatchArchived').checked
    const comment = document.getElementById('editMatchComment').value
    const user1_id = parseInt(document.getElementById('editMatchUser1').value)
    const user2_id = parseInt(document.getElementById('editMatchUser2').value)

    if (user1_id === user2_id) {
        showNotification('user1 і user2 не можуть бути однаковими', 'error')
        return
    }

    const matchData = {archived, comment, user1_id, user2_id}

    try {
        const response = await fetch(`/api/match/${matchId}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(matchData)
        })

        if (!response.ok) throw new Error('Failed to update match')

        const result = await response.json()
        const updatedMatch = result.match

        // Оновлюємо локальний масив matches
        const matchIndex = matches.findIndex(m => m.match_id == matchId)
        if (matchIndex !== -1) {
            matches[matchIndex] = updatedMatch
        }

        // Оновлюємо картки на сторінці
        renderMatchesCards()

        closeEditMatchModal()
        showNotification('Збіг успішно оновлено', 'success')
    } catch (error) {
        console.error('Error updating match:', error)
        showNotification('Не вдалося оновити збіг', 'error')
    }
}


function showDeleteModal() {
    const modal = document.getElementById("deleteModal");
    const cancelBtn = modal.querySelector(".delete-btn-cancel");
    const confirmBtn = modal.querySelector("#confirmDeleteBtn");

    modal.style.display = "flex";

    cancelBtn.replaceWith(cancelBtn.cloneNode(true));
    confirmBtn.replaceWith(confirmBtn.cloneNode(true));

    const newCancelBtn = modal.querySelector(".delete-btn-cancel");

    newCancelBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });
}

function deleteMatch(id) {
    showDeleteModal();

    const modal = document.getElementById("deleteModal");
    const newConfirmBtn = modal.querySelector("#confirmDeleteBtn");

    // натискання "Видалити"
    newConfirmBtn.addEventListener("click", async () => {
        try {
            const response = await fetch(`/api/match/a/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                modal.style.display = "none";

                // видаляємо зі списку matches
                matches = matches.filter(m => m.match_id !== id);

                // прибираємо картку з DOM
                renderMatchesCards()
                showNotification("Збіг успішно видалено!", "success")
            } else {
                modal.style.display = "none";
                showNotification("Помилка при видаленні.", "warning")
            }
        } catch (error) {
            console.error("Помилка запиту:", error);
            modal.style.display = "none";
            showNotification("Помилка під час видалення.", "error")
        }
    });
}


function deleteUser(id) {
    showDeleteModal();

    const modal = document.getElementById("deleteModal");
    const newConfirmBtn = modal.querySelector("#confirmDeleteBtn");

    newConfirmBtn.addEventListener("click", async () => {
        try {
            const response = await fetch(`/api/user/${id}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"}
            });

            if (response.ok) {
                modal.style.display = "none";
                users = users.filter(u => u.user_id !== id); // оновлюємо масив
                renderUsersTable(users); // функція рендеру
                showNotification("Користувача успішно видалено!", "success");
            } else {
                modal.style.display = "none";
                showNotification("Помилка при видаленні користувача.", "warning");
            }
        } catch (err) {
            console.error(err);
            modal.style.display = "none";
            showNotification("Помилка при видаленні користувача.", "error");
        }
    });
}

function deleteMeeting(id) {
    showDeleteModal();

    const modal = document.getElementById("deleteModal");
    const newConfirmBtn = modal.querySelector("#confirmDeleteBtn");

    newConfirmBtn.addEventListener("click", async () => {
        try {
            const response = await fetch(`/api/meeting/${id}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"}
            });

            if (response.ok) {
                modal.style.display = "none";
                meetings = meetings.filter(m => m.meeting_id !== id);
                renderMeetingsCards();
                showNotification("Зустріч успішно видалена!", "success");
            } else {
                modal.style.display = "none";
                showNotification("Помилка при видаленні зустрічі.", "warning");
            }
        } catch (err) {
            console.error(err);
            modal.style.display = "none";
            showNotification("Помилка при видаленні зустрічі.", "error");
        }
    });
}

// ===== Видалення Credential =====
function deleteCredential(id) {
    showDeleteModal();

    const modal = document.getElementById("deleteModal");
    const newConfirmBtn = modal.querySelector("#confirmDeleteBtn");

    newConfirmBtn.addEventListener("click", async () => {
        try {
            const response = await fetch(`/api/credentials/${id}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"}
            });

            if (response.ok) {
                modal.style.display = "none";
                credentials = credentials.filter(c => c.key_id !== id);
                renderCredentialsCards();
                showNotification("Облікові дані успішно видалено!", "success");
            } else {
                modal.style.display = "none";
                showNotification("Помилка при видаленні облікових даних.", "warning");
            }
        } catch (err) {
            console.error(err);
            modal.style.display = "none";
            showNotification("Помилка при видаленні облікових даних.", "error");
        }
    });
}


document.getElementById("runSqlBtn").addEventListener("click", async () => {
    const query = document.getElementById("sqlInput").value.trim();
    const output = document.getElementById("sqlOutput");

    if (!query) {
        output.textContent = "Будь ласка, введіть SQL-запит.";
        return;
    }

    try {
        const res = await fetch("/api/admin/sql", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({query})
        });

        const data = await res.json();
        if (res.ok) {
            output.textContent = JSON.stringify(data, null, 2);
        } else {
            output.textContent = "Помилка: " + (data.message || "невідома");
        }
    } catch (err) {
        output.textContent = "Помилка виконання: " + err;
    }
});


// Фільтрація та пошук усього на світі (майже)
let allUsers = []
let isUsersLoaded = false
let isLoadingUsers = false

async function loadAllUsers() {
    if (isUsersLoaded || isLoadingUsers) return
    isLoadingUsers = true

    let currentPage = 1
    let totalPages = null
    allUsers = []

    try {
        while (totalPages === null || currentPage <= totalPages) {
            const data = await fetchUsersPage(currentPage)
            if (data.items) {
                allUsers = allUsers.concat(data.items)
            }

            if (data.pages) {
                totalPages = data.pages
            }

            currentPage++
        }
        isUsersLoaded = true
    } catch (err) {
        console.error("❌ Помилка при завантаженні:", err)
    } finally {
        isLoadingUsers = false
    }
}

async function filterUsers() {
    const searchTerm = document.getElementById("userSearch").value.toLowerCase()
    const statusFilter = document.getElementById("statusFilter").value

    await loadAllUsers()

    const filtered = allUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm)
        const matchesStatus = statusFilter === "all" || `${user.is_active}` === statusFilter
        return matchesSearch && matchesStatus
    })

    renderUsersTable(filtered)
}

async function fetchUsersPage(page) {
    const response = await fetch(`/api/user/?page=${page}&limit=50`)
    if (!response.ok) throw new Error(`Помилка завантаження сторінки ${page}`)
    return await response.json()
}


// --- Matches ---
let allMatches = []
let isMatchesLoaded = false
let isLoadingMatches = false

async function loadAllMatches() {
    if (isMatchesLoaded || isLoadingMatches) return
    isLoadingMatches = true

    let currentPage = 1
    let totalPages = null
    allMatches = []

    try {
        while (totalPages === null || currentPage <= totalPages) {
            const data = await fetchMatchesPage(currentPage)
            if (data.items) {
                allMatches = allMatches.concat(data.items)
            }

            if (data.pages) {
                totalPages = data.pages
            }

            currentPage++
        }
        isMatchesLoaded = true
    } catch (err) {
        console.error("❌ Помилка при завантаженні матчів:", err)
    } finally {
        isLoadingMatches = false
    }
}

async function filterMatches() {
    const searchTerm = document.getElementById("matchesSearch").value.toLowerCase()
    const statusFilter = document.getElementById("matchStatusFilter").value

    await loadAllMatches()

    const filtered = allMatches.filter(match => {
        const matchesSearch =
            (match.req_user && match.req_user.name.toLowerCase().includes(searchTerm)) ||
            (match.match_user && match.match_user.name.toLowerCase().includes(searchTerm))

        const matchesStatus = statusFilter === "all" || `${match.archived}` === statusFilter

        return matchesSearch && matchesStatus
    })

    renderMatchesCards(filtered)
}

async function fetchMatchesPage(page) {
    const response = await fetch(`/api/match/?page=${page}&limit=50`)
    if (!response.ok) throw new Error(`Помилка завантаження сторінки матчів ${page}`)
    return await response.json()
}


// --- Credentials ---
let allCredentials = []
let isCredentialsLoaded = false
let isLoadingCredentials = false

async function loadAllCredentials() {
    if (isCredentialsLoaded || isLoadingCredentials) return
    isLoadingCredentials = true

    let currentPage = 1
    let totalPages = null
    allCredentials = []

    try {
        while (totalPages === null || currentPage <= totalPages) {
            const data = await fetchCredentialsPage(currentPage)
            if (data.items) {
                allCredentials = allCredentials.concat(data.items)
            }

            if (data.pages) {
                totalPages = data.pages
            }

            currentPage++
        }
        isCredentialsLoaded = true
    } catch (err) {
        console.error("❌ Помилка при завантаженні credentials:", err)
    } finally {
        isLoadingCredentials = false
    }
}

async function filterCredentials() {
    const searchTerm = document.getElementById("credentialsSearch").value.toLowerCase()

    await loadAllCredentials()

    const filtered = allCredentials.filter(credential =>
        credential.login.toLowerCase().includes(searchTerm)
    )

    renderCredentialsCards(filtered)
}

async function fetchCredentialsPage(page) {
    const response = await fetch(`/api/credentials/?page=${page}&limit=50`)
    if (!response.ok) throw new Error(`Помилка завантаження сторінки credentials ${page}`)
    return await response.json()
}

// --- Meetings ---
let allMeetings = []
let isMeetingsLoaded = false
let isLoadingMeetings = false

async function loadAllMeetings() {
    if (isMeetingsLoaded || isLoadingMeetings) return
    isLoadingMeetings = true

    let currentPage = 1
    let totalPages = null
    allMeetings = []

    try {
        while (totalPages === null || currentPage <= totalPages) {
            const data = await fetchMeetingsPage(currentPage)
            if (data.items) {
                allMeetings = allMeetings.concat(data.items)
            }

            if (data.pages) {
                totalPages = data.pages
            }

            currentPage++
        }
        isMeetingsLoaded = true
    } catch (err) {
        console.error("❌ Помилка при завантаженні meetings:", err)
    } finally {
        isLoadingMeetings = false
    }
}

async function filterMeetings() {
    const searchTerm = document.getElementById("meetingSearch").value.toLowerCase()
    const statusFilter = document.getElementById("meetingStatusFilter").value

    await loadAllMeetings()

    const filtered = allMeetings.filter(meeting => {
        const matchesSearch =
            (meeting.location && meeting.location.toLowerCase().includes(searchTerm)) ||
            (meeting.req_user && meeting.req_user.name.toLowerCase().includes(searchTerm)) ||
            (meeting.meet_user && meeting.meet_user.name.toLowerCase().includes(searchTerm))
        const matchesStatus = statusFilter === "all" || `${meeting.archived}` === statusFilter
        return matchesSearch && matchesStatus
    })

    renderMeetingsCards(filtered)
}

async function fetchMeetingsPage(page) {
    const response = await fetch(`/api/meeting/?page=${page}&limit=50`)
    if (!response.ok) throw new Error(`Помилка завантаження сторінки meetings ${page}`)
    return await response.json()
}