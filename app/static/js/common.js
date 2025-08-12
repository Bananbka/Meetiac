export function showNotification(message, type = "info") {
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

export function setupLogoutModal() {
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

export function showLogoutModal() {
    const modal = document.getElementById("logoutModal")
    modal.classList.add("show")
    document.body.style.overflow = "hidden"
}

export function hideLogoutModal() {
    const modal = document.getElementById("logoutModal")
    modal.classList.remove("show")
    document.body.style.overflow = ""
}

export async function confirmLogout() {
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
        const response = await fetch("/api/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
            },
            credentials: "include",
        })

        if (response.ok) {
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

export function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("uk-UA")
}

export async function getZodiacCompatibility(partnerSign) {
    const resp = await fetch(`/api/zodiac/compatibility?first_sign=${partnerSign}`)

    if (!resp.ok) {
        showNotification("Помилка при отриманні сумісності", "error")
        return
    }

    const data = await resp.json()
    const percent = data.percent;
    const description = data.description;
    const zodiac1 = translateZodiacName(data.sign1);
    const zodiac2 = translateZodiacName(data.sign2);

    return {
        percent,
        description,
        zodiac1,
        zodiac2,
    }
}

export function translateZodiacName(engName) {
    if (!engName || typeof engName !== "string") {
        throw new Error("Invalid zodiac name");
    }

    const translations = {
        Aries: "Овен",
        Taurus: "Телець",
        Gemini: "Близнюки",
        Cancer: "Рак",
        Leo: "Лев",
        Virgo: "Діва",
        Libra: "Терези",
        Scorpio: "Скорпіон",
        Sagittarius: "Стрілець",
        Capricorn: "Козоріг",
        Aquarius: "Водолій",
        Pisces: "Риби"
    };

    const normalizedName = engName.trim().charAt(0).toUpperCase() + engName.trim().slice(1).toLowerCase();

    return translations[normalizedName] || engName;
}


export function goToMeetings() {
    window.location.replace("/meetings");
}


export function goToMatches() {
    window.location.replace("/matches");
}

export function goToDiscover() {
    window.location.replace("/discover");
}

export function goToProfile() {
    window.location.replace('/profile');
}
export function goToReactions() {
    window.location.replace('/reactions');
}