// Admin panel functionality
import {showNotification, zodiacsNames} from "./common.js";

let currentSection = "dashboard"
let users = []

function initAdminPanel() {
    users = [] // fetch
    setupNavigation()
    setupFilters()
    setupLogoutModal()
    renderUsersTable()
    updateStats()
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
    const searchInput = document.getElementById("userSearch")
    const statusFilter = document.getElementById("statusFilter")

    if (searchInput) {
        searchInput.addEventListener("input", filterUsers)
    }

    if (statusFilter) {
        statusFilter.addEventListener("change", filterUsers)
    }
}

function filterUsers() {
    const searchTerm = document.getElementById("userSearch").value.toLowerCase()
    const statusFilter = document.getElementById("statusFilter").value

    const filteredUsers = users.filter((user) => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm) || user.email.toLowerCase().includes(searchTerm)
        const matchesStatus = statusFilter === "all" || user.status === statusFilter

        return matchesSearch && matchesStatus
    })

    renderUsersTable(filteredUsers)
}

function renderUsersTable(usersToRender = users) {
    const tbody = document.getElementById("usersTableBody")
    if (!tbody) return

    tbody.innerHTML = ""

    usersToRender.forEach((user) => {
        const row = document.createElement("tr")
        row.innerHTML = `
      <td>
        <div class="user-info">
          <img src="${user.avatar}" alt="${user.name}" class="user-avatar">
          <div>
            <div class="user-name">${user.name}</div>
            <div class="user-email">${user.email}</div>
          </div>
        </div>
      </td>
      <td>${user.age}</td>
      <td>${user.zodiac}</td>
      <td>
        <span class="status-badge ${user.status}">
          ${getStatusText(user.status)}
        </span>
      </td>
      <td>${formatDate(user.registrationDate)}</td>
      <td>${formatDate(user.lastActivity)}</td>
      <td>${user.matches}</td>
      <td>${user.likes}</td>
      <td>
        <div class="action-buttons">
          <button class="action-btn edit" onclick="editUser(${user.id})" title="Редагувати">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn ${user.status === "banned" ? "unban" : "ban"}" 
                  onclick="${user.status === "banned" ? "unbanUser" : "banUser"}(${user.id})" 
                  title="${user.status === "banned" ? "Розблокувати" : "Заблокувати"}">
            <i class="fas fa-${user.status === "banned" ? "unlock" : "ban"}"></i>
          </button>
          <button class="action-btn delete" onclick="deleteUser(${user.id})" title="Видалити">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    `
        tbody.appendChild(row)
    })
}

function getStatusText(status) {
    const statusMap = {
        active: "Активний",
        inactive: "Неактивний",
        banned: "Заблокований",
    }
    return statusMap[status] || status
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

function editUser(userId) {
    const user = users.find((u) => u.id === userId)
    if (!user) return

    // Populate edit modal
    document.getElementById("editUserId").value = user.id
    document.getElementById("editUserName").value = user.name
    document.getElementById("editUserEmail").value = user.email
    document.getElementById("editUserAge").value = user.age
    document.getElementById("editUserZodiac").value = user.zodiac

    // Show modal
    document.getElementById("editUserModal").style.display = "flex"
    document.body.style.overflow = "hidden"
}

function closeEditModal() {
    document.getElementById("editUserModal").style.display = "none"
    document.body.style.overflow = ""
}

function saveUserChanges() {
    const userId = Number.parseInt(document.getElementById("editUserId").value)
    const user = users.find((u) => u.id === userId)

    if (user) {
        user.name = document.getElementById("editUserName").value
        user.email = document.getElementById("editUserEmail").value
        user.age = Number.parseInt(document.getElementById("editUserAge").value)
        user.zodiac = document.getElementById("editUserZodiac").value

        renderUsersTable()
        closeEditModal()
        showNotification("Користувача успішно оновлено", "success")
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

function setupLogoutModal() {
    // Close modal when clicking outside
    document.addEventListener("click", (event) => {
        const modal = document.getElementById("logoutModal")
        if (event.target === modal) {
            hideLogoutModal()
        }
    })

    // Close modal with Escape key
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            const modal = document.getElementById("logoutModal")
            if (modal && modal.classList.contains("show")) {
                hideLogoutModal()
            }
        }
    })
}

function showLogoutModal() {
    const modal = document.getElementById("logoutModal")
    modal.classList.add("show")
    document.body.style.overflow = "hidden"
}

function hideLogoutModal() {
    const modal = document.getElementById("logoutModal")
    modal.classList.remove("show")
    document.body.style.overflow = ""
}

async function confirmLogout() {
    const confirmBtn = document.getElementById("confirmLogoutBtn")
    const logoutText = confirmBtn.querySelector(".logout-text")

    // Show loading state
    confirmBtn.disabled = true
    logoutText.innerHTML = `
    <div class="logout-loading">
      <div class="logout-spinner"></div>
      Виходимо...
    </div>
  `

    try {
        // Send logout request to backend
        const response = await fetch("/api/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
            },
            credentials: "include",
        })

        if (response.ok) {
            // Clear local storage
            localStorage.removeItem("meetiacProfile")
            localStorage.removeItem("userSession")
            localStorage.removeItem("authToken")
            localStorage.removeItem("adminSession")

            // Clear cookies if any
            document.cookie.split(";").forEach((c) => {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
            })

            // Show success message
            showNotification("Адміністративну сесію завершено! 👋", "success")

            // Hide modal and redirect
            hideLogoutModal()
            setTimeout(() => {
                window.location.href = ""
            }, 1500)
        } else {
            throw new Error("Logout failed")
        }
    } catch (error) {
        console.error("Logout error:", error)

        // Even if backend fails, clear local data and redirect
        localStorage.removeItem("meetiacProfile")
        localStorage.removeItem("userSession")
        localStorage.removeItem("authToken")
        localStorage.removeItem("adminSession")

        showNotification("Сесію завершено локально", "warning")
        hideLogoutModal()
        setTimeout(() => {
            window.location.href = ""
        }, 1500)
    }
}
