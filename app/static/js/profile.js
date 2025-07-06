// Profile page functionality
let selectedInterests = ["Подорожі", "Астрологія", "Йога"]

// Available interests
const availableInterests = [
  "Подорожі",
  "Музика",
  "Спорт",
  "Кулінарія",
  "Мистецтво",
  "Фотографія",
  "Йога",
  "Танці",
  "Читання",
  "Кіно",
  "Астрологія",
  "Медитація",
]

document.addEventListener("DOMContentLoaded", () => {
  initProfilePage()
})

function initProfilePage() {
  setupInterestsGrid()
  setupFormHandlers()
}

function setupInterestsGrid() {
  const interestsGrid = document.getElementById("interestsGrid")
  if (!interestsGrid) return

  interestsGrid.innerHTML = ""

  availableInterests.forEach((interest) => {
    const item = document.createElement("div")
    item.className = "interest-item"
    item.textContent = interest

    if (selectedInterests.includes(interest)) {
      item.classList.add("selected")
    }

    item.addEventListener("click", function () {
      toggleInterest(interest, this)
    })

    interestsGrid.appendChild(item)
  })
}

function toggleInterest(interest, element) {
  if (selectedInterests.includes(interest)) {
    selectedInterests = selectedInterests.filter((i) => i !== interest)
    element.classList.remove("selected")
  } else {
    if (selectedInterests.length < 5) {
      selectedInterests.push(interest)
      element.classList.add("selected")
    } else {
      showNotification("Можна обрати максимум 5 інтересів", "warning")
    }
  }
}

function setupFormHandlers() {
  // Save button
  const saveBtn = document.querySelector(".save-btn")
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      saveProfile()
    })
  }

  // Photo upload simulation
  document.querySelectorAll(".photo-slot.empty").forEach((slot) => {
    slot.addEventListener("click", () => {
      // Simulate photo upload
      showNotification("Функція завантаження фото буде доступна незабаром", "info")
    })
  })
}

function saveProfile() {
  // Collect form data
  const formData = {
    name: document.getElementById("profile-name")?.value,
    age: document.getElementById("profile-age")?.value,
    zodiac: document.getElementById("profile-zodiac")?.value,
    bio: document.getElementById("profile-bio")?.value,
    interests: selectedInterests,
    preferences: {
      minAge: document.getElementById("min-age")?.value,
      maxAge: document.getElementById("max-age")?.value,
      maxDistance: document.getElementById("max-distance")?.value,
    },
    privacy: {
      notifications: document.getElementById("notifications")?.checked,
      showOnline: document.getElementById("show-online")?.checked,
      showDistance: document.getElementById("show-distance")?.checked,
    },
  }

  // Simulate saving
  showNotification("Профіль збережено успішно! ✨", "success")

  // Store in localStorage for demo purposes
  localStorage.setItem("meetiacProfile", JSON.stringify(formData))
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
