// Admin page functionality
const adminUsers = [
  {
    id: 1,
    name: "Анна Петренко",
    email: "anna@example.com",
    age: 25,
    zodiac: "♌ Лев",
    status: "active",
    joinDate: "2024-01-15",
    lastActive: "2024-01-20",
    matches: 12,
    likes: 45,
    reports: 0,
  },
  {
    id: 2,
    name: "Марія Коваленко",
    email: "maria@example.com",
    age: 28,
    zodiac: "♐ Стрілець",
    status: "active",
    joinDate: "2024-01-10",
    lastActive: "2024-01-19",
    matches: 8,
    likes: 32,
    reports: 1,
  },
  {
    id: 3,
    name: "Олена Сидоренко",
    email: "olena@example.com",
    age: 23,
    zodiac: "♊ Близнюки",
    status: "banned",
    joinDate: "2024-01-05",
    lastActive: "2024-01-18",
    matches: 15,
    likes: 67,
    reports: 3,
  },
  {
    id: 4,
    name: "Ірина Мельник",
    email: "irina@example.com",
    age: 30,
    zodiac: "♏ Скорпіон",
    status: "inactive",
    joinDate: "2023-12-20",
    lastActive: "2024-01-10",
    matches: 5,
    likes: 18,
    reports: 0,
  },
]

const adminStats = {
  totalUsers: 1247,
  activeUsers: 892,
  newUsersToday: 23,
  totalMatches: 3456,
  matchesToday: 89,
  totalMessages: 12847,
  messagesToday: 234,
  reportedUsers: 12,
  bannedUsers: 8,
}

document.addEventListener("DOMContentLoaded", () => {
  initAdminPage()
})

function initAdminPage() {
  renderUserTable()
  renderStatistics()
  setupAdminHandlers()
  setupNavigation()
}

function setupNavigation() {
  // Admin navigation
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", function () {
      const section = this.getAttribute("data-section")

      // Update active nav item
      document.querySelectorAll(".nav-item").forEach((nav) => nav.classList.remove("active"))
      this.classList.add("active")

      // Show corresponding section
      document.querySelectorAll(".admin-section").forEach((sec) => sec.classList.remove("active"))
      document.getElementById(section).classList.add("active")
    })
  })
}

function renderUserTable() {
  const tbody = document.getElementById("usersTableBody")
  if (!tbody) return

  tbody.innerHTML = ""

  adminUsers.forEach((user) => {
    const row = document.createElement("tr")
    row.innerHTML = `
      <td>
        <div class="user-info">
          <div class="user-avatar">${user.name.charAt(0)}</div>
          <div>
            <div class="user-name">${user.name}</div>
            <div class="user-email">${user.email}</div>
          </div>
        </div>
      </td>
      <td>${user.age}</td>
      <td>${user.zodiac}</td>
      <td>
        <span class="status-badge status-${user.status}">
          ${getStatusText(user.status)}
        </span>
      </td>
      <td>${formatDate(user.joinDate)}</td>
      <td>${formatDate(user.lastActive)}</td>
      <td>${user.matches}</td>
      <td>${user.likes}</td>
      <td>
        <span class="reports-count ${user.reports > 0 ? "has-reports" : ""}">
          ${user.reports}
        </span>
      </td>
      <td>
        <div class="action-buttons">
          <button class="btn-action edit" onclick="editUser(${user.id})" title="Редагувати">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-action ${user.status === "banned" ? "unban" : "ban"}" 
                  onclick="toggleUserStatus(${user.id})" 
                  title="${user.status === "banned" ? "Розблокувати" : "Заблокувати"}">
            <i class="fas fa-${user.status === "banned" ? "unlock" : "ban"}"></i>
          </button>
          <button class="btn-action delete" onclick="deleteUser(${user.id})" title="Видалити">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    `
    tbody.appendChild(row)
  })
}

function renderStatistics() {
  // Update stat cards
  document.getElementById("totalUsers").textContent = adminStats.totalUsers.toLocaleString()
  document.getElementById("activeUsers").textContent = adminStats.activeUsers.toLocaleString()
  document.getElementById("newUsersToday").textContent = adminStats.newUsersToday
  document.getElementById("totalMatches").textContent = adminStats.totalMatches.toLocaleString()
  document.getElementById("matchesToday").textContent = adminStats.matchesToday
  document.getElementById("totalMessages").textContent = adminStats.totalMessages.toLocaleString()
  document.getElementById("messagesToday").textContent = adminStats.messagesToday
  document.getElementById("reportedUsers").textContent = adminStats.reportedUsers
  document.getElementById("bannedUsers").textContent = adminStats.bannedUsers
}

function setupAdminHandlers() {
  // Search functionality
  const searchInput = document.getElementById("userSearch")
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      filterUsers(this.value)
    })
  }

  // Status filter
  const statusFilter = document.getElementById("statusFilter")
  if (statusFilter) {
    statusFilter.addEventListener("change", function () {
      filterUsersByStatus(this.value)
    })
  }

  // Export button
  const exportBtn = document.getElementById("exportBtn")
  if (exportBtn) {
    exportBtn.addEventListener("click", exportUsers)
  }
}

function getStatusText(status) {
  switch (status) {
    case "active":
      return "Активний"
    case "inactive":
      return "Неактивний"
    case "banned":
      return "Заблокований"
    default:
      return status
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("uk-UA")
}

function editUser(userId) {
  const user = adminUsers.find((u) => u.id === userId)
  if (!user) return

  // Show edit modal
  showEditUserModal(user)
}

function showEditUserModal(user) {
  const modal = document.getElementById("editUserModal")
  if (!modal) return

  // Populate form
  document.getElementById("editUserId").value = user.id
  document.getElementById("editUserName").value = user.name
  document.getElementById("editUserEmail").value = user.email
  document.getElementById("editUserAge").value = user.age
  document.getElementById("editUserZodiac").value = user.zodiac.split(" ")[1]

  modal.style.display = "flex"
}

function closeEditModal() {
  const modal = document.getElementById("editUserModal")
  if (modal) {
    modal.style.display = "none"
  }
}

function saveUserChanges() {
  const userId = Number.parseInt(document.getElementById("editUserId").value)
  const name = document.getElementById("editUserName").value
  const email = document.getElementById("editUserEmail").value
  const age = Number.parseInt(document.getElementById("editUserAge").value)
  const zodiac = document.getElementById("editUserZodiac").value

  const userIndex = adminUsers.findIndex((u) => u.id === userId)
  if (userIndex !== -1) {
    adminUsers[userIndex].name = name
    adminUsers[userIndex].email = email
    adminUsers[userIndex].age = age
    adminUsers[userIndex].zodiac = `♌ ${zodiac}` // Simplified for demo

    renderUserTable()
    closeEditModal()
    showNotification("Користувача оновлено успішно!", "success")
  }
}

function toggleUserStatus(userId) {
  const user = adminUsers.find((u) => u.id === userId)
  if (!user) return

  if (user.status === "banned") {
    user.status = "active"
    showNotification(`Користувача ${user.name} розблоковано`, "success")
  } else {
    user.status = "banned"
    showNotification(`Користувача ${user.name} заблоковано`, "warning")
  }

  renderUserTable()
}

function deleteUser(userId) {
  const user = adminUsers.find((u) => u.id === userId)
  if (!user) return

  if (confirm(`Ви впевнені, що хочете видалити користувача ${user.name}?`)) {
    const index = adminUsers.findIndex((u) => u.id === userId)
    adminUsers.splice(index, 1)
    renderUserTable()
    showNotification(`Користувача ${user.name} видалено`, "success")
  }
}

function filterUsers(searchTerm) {
  const rows = document.querySelectorAll("#usersTableBody tr")

  rows.forEach((row) => {
    const name = row.querySelector(".user-name").textContent.toLowerCase()
    const email = row.querySelector(".user-email").textContent.toLowerCase()

    if (name.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase())) {
      row.style.display = ""
    } else {
      row.style.display = "none"
    }
  })
}

function filterUsersByStatus(status) {
  const rows = document.querySelectorAll("#usersTableBody tr")

  rows.forEach((row) => {
    const statusBadge = row.querySelector(".status-badge")

    if (status === "all" || statusBadge.classList.contains(`status-${status}`)) {
      row.style.display = ""
    } else {
      row.style.display = "none"
    }
  })
}

function exportUsers() {
  const csvContent =
    "data:text/csv;charset=utf-8," +
    "Ім'я,Email,Вік,Знак зодіаку,Статус,Дата реєстрації,Остання активність,Збіги,Лайки,Скарги\n" +
    adminUsers
      .map(
        (user) =>
          `${user.name},${user.email},${user.age},${user.zodiac},${getStatusText(user.status)},${user.joinDate},${user.lastActive},${user.matches},${user.likes},${user.reports}`,
      )
      .join("\n")

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", "meetiac_users.csv")
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  showNotification("Дані експортовано успішно!", "success")
}

function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotification = document.querySelector(".notification")
  if (existingNotification) {
    existingNotification.remove()
  }

  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
    <div class="notification-content">
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `

  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    padding: 1rem 1.5rem;
    border-radius: 0.75rem;
    color: white;
    font-weight: 500;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
  `

  // Set background color based on type
  switch (type) {
    case "success":
      notification.style.background = "linear-gradient(135deg, #10b981, #059669)"
      break
    case "error":
      notification.style.background = "linear-gradient(135deg, #ef4444, #dc2626)"
      break
    case "warning":
      notification.style.background = "linear-gradient(135deg, #f59e0b, #d97706)"
      break
    default:
      notification.style.background = "linear-gradient(135deg, #ec4899, #f472b6)"
  }

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Close button functionality
  const closeBtn = notification.querySelector(".notification-close")
  closeBtn.addEventListener("click", () => {
    removeNotification(notification)
  })

  // Auto remove after 4 seconds
  setTimeout(() => {
    removeNotification(notification)
  }, 4000)
}

function removeNotification(notification) {
  notification.style.transform = "translateX(100%)"
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification)
    }
  }, 300)
}
