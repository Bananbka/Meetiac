// Admin panel functionality
let currentSection = "dashboard"
let users = []

// Sample user data
const sampleUsers = [
  {
    id: 1,
    name: "Анна Петренко",
    email: "anna@example.com",
    age: 25,
    zodiac: "Лев",
    status: "active",
    registrationDate: "2024-01-15",
    lastActivity: "2024-01-20",
    matches: 12,
    likes: 45,
    reports: 0,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Марія Коваленко",
    email: "maria@example.com",
    age: 28,
    zodiac: "Стрілець",
    status: "active",
    registrationDate: "2024-01-10",
    lastActivity: "2024-01-19",
    matches: 8,
    likes: 32,
    reports: 1,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Олексій Іваненко",
    email: "alex@example.com",
    age: 30,
    zodiac: "Овен",
    status: "banned",
    registrationDate: "2024-01-05",
    lastActivity: "2024-01-18",
    matches: 3,
    likes: 15,
    reports: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
  },
  {
    id: 4,
    name: "Ірина Сидоренко",
    email: "irina@example.com",
    age: 26,
    zodiac: "Близнюки",
    status: "inactive",
    registrationDate: "2024-01-12",
    lastActivity: "2024-01-16",
    matches: 6,
    likes: 28,
    reports: 0,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face",
  },
  {
    id: 5,
    name: "Дмитро Мельник",
    email: "dmitro@example.com",
    age: 32,
    zodiac: "Скорпіон",
    status: "active",
    registrationDate: "2024-01-08",
    lastActivity: "2024-01-20",
    matches: 15,
    likes: 67,
    reports: 2,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
  },
]

document.addEventListener("DOMContentLoaded", () => {
  initAdminPanel()
})

function initAdminPanel() {
  users = [...sampleUsers]
  setupNavigation()
  setupFilters()
  setupLogoutModal()
  renderUsersTable()
  updateStats()
}

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
        <span class="reports-count ${user.reports > 0 ? "has-reports" : ""}">
          ${user.reports}
        </span>
      </td>
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

function updateStats() {
  const activeUsers = users.filter((u) => u.status === "active").length
  const bannedUsers = users.filter((u) => u.status === "banned").length
  const totalReports = users.reduce((sum, u) => sum + u.reports, 0)

  // Update DOM elements
  const totalUsersEl = document.getElementById("totalUsers")
  const activeUsersEl = document.getElementById("activeUsers")
  const bannedUsersEl = document.getElementById("bannedUsers")
  const reportedUsersEl = document.getElementById("reportedUsers")

  if (totalUsersEl) totalUsersEl.textContent = users.length.toLocaleString()
  if (activeUsersEl) activeUsersEl.textContent = activeUsers.toLocaleString()
  if (bannedUsersEl) bannedUsersEl.textContent = bannedUsers
  if (reportedUsersEl) reportedUsersEl.textContent = totalReports
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
