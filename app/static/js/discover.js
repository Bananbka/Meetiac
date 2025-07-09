// Discover page functionality
let currentProfileIndex = 0
const likedProfiles = []

// Sample profile data
const profiles = [
    {
        id: 1,
        name: "Анна",
        age: 25,
        zodiac: "♌ Лев",
        compatibility: 95,
        distance: "2 км",
        bio: "Люблю подорожі та нові пригоди. Шукаю когось особливого для спільних моментів під зірками.",
        interests: ["Подорожі", "Йога", "Астрологія"],
        image: "https://www.georgetown.edu/wp-content/uploads/2022/02/Jkramerheadshot-scaled-e1645036825432-1050x1050-c-default.jpg",
    },
    {
        id: 2,
        name: "Марія",
        age: 28,
        zodiac: "♐ Стрілець",
        compatibility: 88,
        distance: "5 км",
        bio: "Творча особистість, яка вірить у силу зірок. Люблю мистецтво та глибокі розмови.",
        interests: ["Мистецтво", "Музика", "Фотографія"],
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&crop=face",
    },
    {
        id: 3,
        name: "Олена",
        age: 23,
        zodiac: "♊ Близнюки",
        compatibility: 92,
        distance: "1 км",
        bio: "Енергійна та позитивна. Шукаю когось, хто поділяє мою любов до життя та зірок.",
        interests: ["Спорт", "Танці", "Кулінарія"],
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&crop=face",
    },
]

document.addEventListener("DOMContentLoaded", () => {
    initDiscoverPage()
})

function initDiscoverPage() {
    updateProfileCard()
    updateLikesCount()
    setupKeyboardNavigation()
    setupTouchGestures()
    setupLogoutModal()
}

function updateProfileCard() {
    const profile = profiles[currentProfileIndex]

    document.getElementById("profileImage").src = profile.image
    document.getElementById("profileName").textContent = `${profile.name}, ${profile.age}`
    document.getElementById("profileZodiac").textContent = profile.zodiac
    document.getElementById("profileDistance").textContent = profile.distance
    document.getElementById("profileBio").textContent = profile.bio
    document.getElementById("compatibilityScore").textContent = profile.compatibility

    // Update interests
    const interestsContainer = document.getElementById("profileInterests")
    interestsContainer.innerHTML = ""
    profile.interests.forEach((interest) => {
        const tag = document.createElement("span")
        tag.className = "interest-tag"
        tag.textContent = interest
        interestsContainer.appendChild(tag)
    })
}

function handleLike() {
    const profile = profiles[currentProfileIndex]
    likedProfiles.push(profile.id)

    // Add animation effect
    const card = document.getElementById("profileCard")
    card.style.transform = "translateX(100%) rotate(20deg)"
    card.style.opacity = "0"

    setTimeout(() => {
        nextProfile()
        card.style.transform = "translateX(0) rotate(0deg)"
        card.style.opacity = "1"
    }, 300)

    updateLikesCount()
    showNotification("Вподобано! 💖", "success")
}

function handleReject() {
    const card = document.getElementById("profileCard")
    card.style.transform = "translateX(-100%) rotate(-20deg)"
    card.style.opacity = "0"

    setTimeout(() => {
        nextProfile()
        card.style.transform = "translateX(0) rotate(0deg)"
        card.style.opacity = "1"
    }, 300)
}

function nextProfile() {
    currentProfileIndex = (currentProfileIndex + 1) % profiles.length
    updateProfileCard()
}

function updateLikesCount() {
    const likesElement = document.getElementById("likesCount")
    if (likesElement) {
        likesElement.textContent = likedProfiles.length
    }
}

function setupKeyboardNavigation() {
    document.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "ArrowLeft":
                handleReject()
                break
            case "ArrowRight":
                handleLike()
                break
            case " ":
                e.preventDefault()
                handleLike()
                break
        }
    })
}

function setupTouchGestures() {
    let startX = 0
    let startY = 0
    let currentX = 0
    let currentY = 0
    let isDragging = false

    const profileCard = document.getElementById("profileCard")

    if (profileCard) {
        profileCard.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX
            startY = e.touches[0].clientY
            isDragging = true
        })

        profileCard.addEventListener("touchmove", function (e) {
            if (!isDragging) return

            currentX = e.touches[0].clientX
            currentY = e.touches[0].clientY

            const deltaX = currentX - startX
            const deltaY = currentY - startY

            // Only handle horizontal swipes
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                e.preventDefault()
                const rotation = deltaX * 0.1
                this.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`
                this.style.opacity = 1 - Math.abs(deltaX) / 300
            }
        })

        profileCard.addEventListener("touchend", function (e) {
            if (!isDragging) return
            isDragging = false

            const deltaX = currentX - startX

            if (Math.abs(deltaX) > 100) {
                if (deltaX > 0) {
                    handleLike()
                } else {
                    handleReject()
                }
            } else {
                // Snap back
                this.style.transform = "translateX(0) rotate(0deg)"
                this.style.opacity = "1"
            }
        })
    }
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

// Logout Function
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

      // Clear cookies if any
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
      })

      // Show success message
      showNotification("До побачення! 👋", "success")

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

    showNotification("Сесію завершено локально", "warning")
    hideLogoutModal()
    setTimeout(() => {
      window.location.href = ""
    }, 1500)
  }
}