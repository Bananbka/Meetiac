// Mock data for demonstration
let mockUserProfile = {}

let currentPhotoIndex = 0
let totalPhotos = 0

document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile()
})

function showLoading() {
    document.getElementById("loadingOverlay").style.display = "flex"
    document.getElementById("profileContent").style.display = "none"
}

function hideLoading() {
    document.getElementById("loadingOverlay").style.display = "none"
    document.getElementById("profileContent").style.display = "block"
}

async function loadUserProfile() {
    showLoading()

    const pathParts = window.location.pathname.split("/");
    const userId = pathParts[2];

    const response = await fetch(`/api/user/${userId}?is_detailed=True`)

    if (!response.ok) {
        showNotification("Помилка завантаження профілю!", "danger")
    }
    mockUserProfile = await response.json()

    const user = mockUserProfile

    console.log(user)

    document.getElementById("userName").textContent = user.name
    document.getElementById("userAge").textContent = user.age
    document.getElementById("userBio").textContent = user.bio
    document.getElementById("userHeight").textContent = `${user.height} см`
    document.getElementById("userWeight").textContent = `${user.weight} кг`
    document.getElementById("userGender").textContent = user.gender

    // Zodiac
    const zodiacIconMap = {
        aries: "♈",        // Овен
        taurus: "♉",       // Телець
        gemini: "♊",       // Близнюки
        cancer: "♋",       // Рак
        leo: "♌",          // Лев
        virgo: "♍",        // Діва
        libra: "♎",        // Терези
        scorpio: "♏",      // Скорпіон
        sagittarius: "♐",  // Стрілець
        capricorn: "♑",    // Козеріг
        aquarius: "♒",     // Водолій
        pisces: "♓"        // Риби
    }
    const userZodiacElement = document.getElementById("userZodiac");
    const zodiacSymbol = zodiacIconMap[user.sign.toLowerCase()] || "❓";

    userZodiacElement.innerHTML = `<span class="zodiac-icon">${zodiacSymbol}</span><span>${user.sign}</span>`;

    const compatibilityFill = document.querySelector("#compatibility .compatibility-fill")
    compatibilityFill.style.width = `${user.compatibility}%`
    document.querySelector("#compatibility .compatibility-percent").textContent = `${user.compatibility}%`

    // Interests
    const userInterestsElement = document.getElementById("userInterests")
    userInterestsElement.innerHTML = ""
    user.interests.forEach((interest) => {
        const span = document.createElement("span")
        span.className = "interest-tag"
        span.textContent = interest
        userInterestsElement.appendChild(span)
    })

    // Photos
    const photoSlider = document.getElementById("photoSlider")
    const photoIndicators = document.getElementById("photoIndicators")
    photoSlider.innerHTML = ""
    photoIndicators.innerHTML = ""
    totalPhotos = user.images.length

    user.images.forEach((photo, index) => {
        const slide = document.createElement("div")
        slide.className = "photo-slide"
        console.log(photo)
        slide.style.backgroundImage = `url('/${photo}')`
        photoSlider.appendChild(slide)

        const indicator = document.createElement("div")
        indicator.className = `photo-indicator ${index === 0 ? "active" : ""}`
        photoIndicators.appendChild(indicator)
    })


    hideLoading()
    updatePhotoSlider()
}

function updatePhotoSlider() {
    const photoSlider = document.getElementById("photoSlider")
    const photoIndicators = document.getElementById("photoIndicators")
    photoSlider.style.transform = `translateX(-${currentPhotoIndex * 100}%)`

    Array.from(photoIndicators.children).forEach((indicator, index) => {
        if (index === currentPhotoIndex) {
            indicator.classList.add("active")
        } else {
            indicator.classList.remove("active")
        }
    })
}

function nextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % totalPhotos
    updatePhotoSlider()
}

function previousPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + totalPhotos) % totalPhotos
    updatePhotoSlider()
}

function goBack() {
    window.history.back()
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