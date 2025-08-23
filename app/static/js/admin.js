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
        if (event.target.matches('[data-action="reset-password"]')) {
            const credentialId = parseInt(event.target.dataset.id);
            resetPassword(credentialId);
        }

        // Кнопки для пар
        if (event.target.matches('[data-action="edit-match"]')) {
            const matchId = parseInt(event.target.dataset.id);
            editMatch(matchId);
        }
        if (event.target.matches('[data-action="delete-match"]')) {
            const matchId = parseInt(event.target.dataset.id);
            deleteMatch(matchId);
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
            event.target.matches('#editMeetingModal .btn-outline')) {
            closeEditMeetingModal();
        }
        if (event.target.matches('#editMeetingModal .btn-primary')) {
            saveMeetingChanges();
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

function filterUsers() {
    const searchTerm = document.getElementById("userSearch").value.toLowerCase()
    const statusFilter = document.getElementById("statusFilter").value

    console.log(users)

    const filteredUsers = users.filter((user) => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm)
        const matchesStatus = statusFilter === "all" || user.status === statusFilter

        return matchesSearch && matchesStatus
    })

    renderUsersTable(filteredUsers)
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

function filterMeetings() {
    const searchTerm = document.getElementById("meetingSearch").value.toLowerCase()
    const statusFilter = document.getElementById("meetingStatusFilter").value

    const filteredMeetings = meetings.filter((meeting) => {
        const matchesSearch =
            (meeting.location && meeting.location.toLowerCase().includes(searchTerm)) ||
            (meeting.req_user && meeting.req_user.name.toLowerCase().includes(searchTerm)) ||
            (meeting.meet_user && meeting.meet_user.name.toLowerCase().includes(searchTerm))
        const matchesStatus = statusFilter === "all" || meeting.status === statusFilter

        return matchesSearch && matchesStatus
    })

    renderMeetingsCards(filteredMeetings)
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

function filterCredentials() {
    const searchTerm = document.getElementById("credentialsSearch").value.toLowerCase()

    const filteredCredentials = credentials.filter((credential) => {
        return credential.email.toLowerCase().includes(searchTerm)
    })

    renderCredentialsCards(filteredCredentials)
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

function filterMatches() {
    const searchTerm = document.getElementById("matchesSearch").value.toLowerCase()
    const statusFilter = document.getElementById("matchStatusFilter").value

    const filteredMatches = matches.filter((match) => {
        const matchesSearch =
            (match.req_user && match.req_user.name.toLowerCase().includes(searchTerm)) ||
            (match.match_user && match.match_user.name.toLowerCase().includes(searchTerm))
        const matchesStatus = statusFilter === "all" || match.status === statusFilter

        return matchesSearch && matchesStatus
    })

    renderMatchesCards(filteredMatches)
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

function getStatusText(status) {
    const statusMap = {
        active: "Активний",
        inactive: "Неактивний",
        banned: "Заблокований",
        confirmed: "Підтверджено",
        completed: "Завершено",
        cancelled: "Скасовано",
        rejected: "Відхилено",
        accepted: "Прийнято",
        expired: "Закінчився"
    }
    return statusMap[status] || status
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
                <h4>Зустріч #${meeting.id || ''}</h4>
                <span class="status-badge ${meeting.status}">${getStatusText(meeting.status)}</span>
            </div>
            <div class="meeting-card-content">
                <p><strong>Запросив:</strong> ${meeting.req_user ? meeting.req_user.name : 'Невідомо'}</p>
                <p><strong>Зустріч з:</strong> ${meeting.meet_user ? meeting.meet_user.name : 'Невідомо'}</p>
                <p><strong>Місце:</strong> ${meeting.location || 'Не вказано'}</p>
                <p><strong>Дата:</strong> ${meetingDate}</p>
            </div>
            <div class="meeting-card-actions">
                <button class="action-btn edit" data-id="${meeting.id}" title="Редагувати">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn ${meeting.status === 'cancelled' ? 'restore' : 'cancel'}" 
                        data-id="${meeting.id}" 
                        data-action="${meeting.status === 'cancelled' ? 'restore' : 'cancel'}"
                        title="${meeting.status === 'cancelled' ? 'Відновити' : 'Скасувати'}">
                    <i class="fas fa-${meeting.status === 'cancelled' ? 'undo' : 'times'}"></i>
                </button>
            </div>
        `

        // Add event listeners to buttons
        const editBtn = card.querySelector('.action-btn.edit');
        editBtn.addEventListener('click', () => editMeeting(parseInt(editBtn.dataset.id)));

        const actionBtn = card.querySelector('.action-btn.cancel, .action-btn.restore');
        actionBtn.addEventListener('click', () => {
            const id = parseInt(actionBtn.dataset.id);
            const action = actionBtn.dataset.action;
            if (action === 'cancel') {
                cancelMeeting(id);
            } else if (action === 'restore') {
                restoreMeeting(id);
            }
        });

        container.appendChild(card)
    })
}

function renderCredentialsCards(credentialsToRender = credentials) {
    const container = document.getElementById("credentialsContainer")
    if (!container) return

    container.innerHTML = ""

    if (credentialsToRender.length === 0) {
        container.innerHTML = `<div class="empty-message">Облікових даних не знайдено</div>`
        return
    }

    credentialsToRender.forEach((credential) => {
        const card = document.createElement("div")
        card.className = "credential-card"

        card.innerHTML = `
            <div class="credential-card-header">
                <h4>Обліковий запис #${credential.id || ''}</h4>
            </div>
            <div class="credential-card-content">
                <p><strong>Email:</strong> ${credential.email || ''}</p>
                <p><strong>Користувач ID:</strong> ${credential.user_id || 'Не прив\'язано'}</p>
                <p><strong>Створено:</strong> ${formatDate(credential.created_at)}</p>
            </div>
            <div class="credential-card-actions">
                <button class="action-btn edit" data-id="${credential.id}" title="Редагувати">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn reset" data-id="${credential.id}" title="Скинути пароль">
                    <i class="fas fa-key"></i>
                </button>
            </div>
        `

        // Add event listeners to buttons
        const editBtn = card.querySelector('.action-btn.edit');
        editBtn.addEventListener('click', () => editCredential(parseInt(editBtn.dataset.id)));

        const resetBtn = card.querySelector('.action-btn.reset');
        resetBtn.addEventListener('click', () => resetPassword(parseInt(resetBtn.dataset.id)));

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
        <span class="status-badge ${match.status}">${getStatusText(match.status)}</span>
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
        <p><strong>Оцінка збігу:</strong> ${match.score || 'Н/Д'}</p>
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
    const meeting = meetings.find(m => m.id === meetingId)
    if (!meeting) return

    // Create modal if it doesn't exist
    let modal = document.getElementById('editMeetingModal')
    if (!modal) {
        modal = document.createElement('div')
        modal.id = 'editMeetingModal'
        modal.className = 'modal'
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="closeEditMeetingModal()">&times;</span>
                <h2>Редагувати зустріч</h2>
                <form id="editMeetingForm">
                    <input type="hidden" id="editMeetingId">
                    <div class="form-group">
                        <label for="editMeetingStatus">Статус:</label>
                        <select id="editMeetingStatus" class="form-control">
                            <option value="pending">Очікує</option>
                            <option value="confirmed">Підтверджено</option>
                            <option value="completed">Завершено</option>
                            <option value="cancelled">Скасовано</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editMeetingLocation">Місце:</label>
                        <input type="text" id="editMeetingLocation" class="form-control">
                    </div>
                    <div class="form-group">
                        <label for="editMeetingDate">Дата:</label>
                        <input type="datetime-local" id="editMeetingDate" class="form-control">
                    </div>
                    <div class="form-group">
                        <label for="editMeetingNotes">Нотатки:</label>
                        <textarea id="editMeetingNotes" class="form-control"></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-primary" onclick="saveMeetingChanges()">Зберегти</button>
                        <button type="button" class="btn btn-secondary" onclick="closeEditMeetingModal()">Скасувати</button>
                    </div>
                </form>
            </div>
        `
        document.body.appendChild(modal)
    }

    // Fill form with meeting data
    document.getElementById('editMeetingId').value = meeting.id
    document.getElementById('editMeetingStatus').value = meeting.status
    document.getElementById('editMeetingLocation').value = meeting.location || ''

    if (meeting.meeting_date) {
        const date = new Date(meeting.meeting_date)
        document.getElementById('editMeetingDate').value = date.toISOString().slice(0, 16)
    } else {
        document.getElementById('editMeetingDate').value = ''
    }

    document.getElementById('editMeetingNotes').value = meeting.notes || ''

    // Show modal
    modal.style.display = 'block'
}

function closeEditMeetingModal() {
    const modal = document.getElementById('editMeetingModal')
    if (modal) modal.style.display = 'none'
}

async function saveMeetingChanges() {
    const meetingId = document.getElementById('editMeetingId').value
    const status = document.getElementById('editMeetingStatus').value
    const location = document.getElementById('editMeetingLocation').value
    const meetingDate = document.getElementById('editMeetingDate').value
    const notes = document.getElementById('editMeetingNotes').value

    const meetingData = {
        status,
        location,
        notes
    }

    if (meetingDate) {
        meetingData.meeting_date = new Date(meetingDate).toISOString()
    }

    try {
        const response = await fetch(`/api/meeting/${meetingId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(meetingData)
        })

        if (!response.ok) {
            throw new Error('Failed to update meeting')
        }

        // Update meeting in local array
        const meetingIndex = meetings.findIndex(m => m.id === parseInt(meetingId))
        if (meetingIndex !== -1) {
            meetings[meetingIndex] = {...meetings[meetingIndex], ...meetingData}
        }

        // Re-render meetings
        renderMeetingsCards()

        // Close modal
        closeEditMeetingModal()

        // Show success notification
        showNotification('Зустріч успішно оновлено', 'success')
    } catch (error) {
        console.error('Error updating meeting:', error)
        showNotification('Не вдалося оновити зустріч', 'error')
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
        const meetingIndex = meetings.findIndex(m => m.id === meetingId)
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
        const meetingIndex = meetings.findIndex(m => m.id === meetingId)
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
    const credential = credentials.find(c => c.id === credentialId)
    if (!credential) return

    // Create modal if it doesn't exist
    let modal = document.getElementById('editCredentialModal')
    if (!modal) {
        modal = document.createElement('div')
        modal.id = 'editCredentialModal'
        modal.className = 'modal'
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="closeEditCredentialModal()">&times;</span>
                <h2>Редагувати обліковий запис</h2>
                <form id="editCredentialForm">
                    <input type="hidden" id="editCredentialId">
                    <div class="form-group">
                        <label for="editCredentialEmail">Email:</label>
                        <input type="email" id="editCredentialEmail" class="form-control">
                    </div>
                    <div class="form-group">
                        <label for="editCredentialUserId">ID користувача:</label>
                        <input type="number" id="editCredentialUserId" class="form-control">
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-primary" onclick="saveCredentialChanges()">Зберегти</button>
                        <button type="button" class="btn btn-secondary" onclick="closeEditCredentialModal()">Скасувати</button>
                    </div>
                </form>
            </div>
        `
        document.body.appendChild(modal)
    }

    // Fill form with credential data
    document.getElementById('editCredentialId').value = credential.id
    document.getElementById('editCredentialEmail').value = credential.email
    document.getElementById('editCredentialUserId').value = credential.user_id || ''

    // Show modal
    modal.style.display = 'block'
}

function closeEditCredentialModal() {
    const modal = document.getElementById('editCredentialModal')
    if (modal) modal.style.display = 'none'
}

async function saveCredentialChanges() {
    const credentialId = document.getElementById('editCredentialId').value
    const email = document.getElementById('editCredentialEmail').value
    const userId = document.getElementById('editCredentialUserId').value

    const credentialData = {
        email
    }

    if (userId) {
        credentialData.user_id = parseInt(userId)
    }

    try {
        const response = await fetch(`/api/credentials/${credentialId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentialData)
        })

        if (!response.ok) {
            throw new Error('Failed to update credential')
        }

        // Update credential in local array
        const credentialIndex = credentials.findIndex(c => c.id === parseInt(credentialId))
        if (credentialIndex !== -1) {
            credentials[credentialIndex] = {...credentials[credentialIndex], ...credentialData}
        }

        // Re-render credentials
        renderCredentialsCards()

        // Close modal
        closeEditCredentialModal()

        // Show success notification
        showNotification('Обліковий запис успішно оновлено', 'success')
    } catch (error) {
        console.error('Error updating credential:', error)
        showNotification('Не вдалося оновити обліковий запис', 'error')
    }
}

async function resetPassword(credentialId) {
    if (!confirm('Ви впевнені, що хочете скинути пароль для цього облікового запису? Користувачу буде надіслано новий пароль на email.')) return

    try {
        const response = await fetch(`/api/credentials/${credentialId}/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            throw new Error('Failed to reset password')
        }

        // Show success notification
        showNotification('Пароль скинуто. Новий пароль надіслано на email користувача.', 'success')
    } catch (error) {
        console.error('Error resetting password:', error)
        showNotification('Не вдалося скинути пароль', 'error')
    }
}

// Match editing functions
function editMatch(matchId) {
    const match = matches.find(m => m.id === matchId)
    if (!match) return

    // Create modal if it doesn't exist
    let modal = document.getElementById('editMatchModal')
    if (!modal) {
        modal = document.createElement('div')
        modal.id = 'editMatchModal'
        modal.className = 'modal'
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="closeEditMatchModal()">&times;</span>
                <h2>Редагувати збіг</h2>
                <form id="editMatchForm">
                    <input type="hidden" id="editMatchId">
                    <div class="form-group">
                        <label for="editMatchStatus">Статус:</label>
                        <select id="editMatchStatus" class="form-control">
                            <option value="pending">Очікує</option>
                            <option value="accepted">Прийнято</option>
                            <option value="rejected">Відхилено</option>
                            <option value="expired">Закінчився</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editMatchScore">Оцінка збігу:</label>
                        <input type="number" id="editMatchScore" class="form-control" min="0" max="100">
                    </div>
                    <div class="form-group">
                        <label for="editMatchNotes">Нотатки:</label>
                        <textarea id="editMatchNotes" class="form-control"></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-primary" onclick="saveMatchChanges()">Зберегти</button>
                        <button type="button" class="btn btn-secondary" onclick="closeEditMatchModal()">Скасувати</button>
                    </div>
                </form>
            </div>
        `
        document.body.appendChild(modal)
    }

    // Fill form with match data
    document.getElementById('editMatchId').value = match.match_id
    document.getElementById('editMatchStatus').value = match.status
    document.getElementById('editMatchScore').value = match.score || ''
    document.getElementById('editMatchNotes').value = match.notes || ''

    // Show modal
    modal.style.display = 'block'
}

function closeEditMatchModal() {
    const modal = document.getElementById('editMatchModal')
    if (modal) modal.style.display = 'none'
}

async function saveMatchChanges() {
    const matchId = document.getElementById('editMatchId').value
    const status = document.getElementById('editMatchStatus').value
    const score = document.getElementById('editMatchScore').value
    const notes = document.getElementById('editMatchNotes').value

    const matchData = {
        status,
        notes
    }

    if (score) {
        matchData.score = parseInt(score)
    }

    try {
        const response = await fetch(`/api/match/${matchId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(matchData)
        })

        if (!response.ok) {
            throw new Error('Failed to update match')
        }

        // Update match in local array
        const matchIndex = matches.findIndex(m => m.match_id === parseInt(matchId))
        if (matchIndex !== -1) {
            matches[matchIndex] = {...matches[matchIndex], ...matchData}
        }

        // Re-render matches
        renderMatchesCards()

        // Close modal
        closeEditMatchModal()

        // Show success notification
        showNotification('Збіг успішно оновлено', 'success')
    } catch (error) {
        console.error('Error updating match:', error)
        showNotification('Не вдалося оновити збіг', 'error')
    }
}

async function deleteMatch(matchId) {
    if (!confirm('Ви впевнені, що хочете видалити цей збіг?')) return

    try {
        const response = await fetch(`/api/match/${matchId}`, {
            method: 'DELETE'
        })

        if (!response.ok) {
            throw new Error('Failed to delete match')
        }

        // Remove match from local array
        matches = matches.filter(m => m.id !== matchId)

        // Re-render matches
        renderMatchesCards()

        // Show success notification
        showNotification('Збіг видалено', 'success')
    } catch (error) {
        console.error('Error deleting match:', error)
        showNotification('Не вдалося видалити збіг', 'error')
    }
}

function banUser(userId) {
    const user = users.find((u) => u.id === userId)
    if (user && user.status !== "banned") {
        user.status = "banned"
        renderUsersTable()
        updateStats()
        showNotification(`Користувача ${user.name} заблоковано`, "warning")
    }
}

function unbanUser(userId) {
    const user = users.find((u) => u.id === userId)
    if (user && user.status === "banned") {
        user.status = "active"
        renderUsersTable()
        updateStats()
        showNotification(`Користувача ${user.name} розблоковано`, "success")
    }
}

function deleteUser(userId) {
    const user = users.find((u) => u.id === userId)
    if (user && confirm(`Ви впевнені, що хочете видалити користувача ${user.name}?`)) {
        users = users.filter((u) => u.id !== userId)
        renderUsersTable()
        updateStats()
        showNotification(`Користувача ${user.name} видалено`, "info")
    }
}

// Функцію setupLogoutModal видалено, оскільки вона імпортується з common.js

// Функції showLogoutModal та hideLogoutModal видалено, оскільки вони імпортуються з common.js

// Функцію confirmLogout видалено, оскільки вона імпортується з common.js
