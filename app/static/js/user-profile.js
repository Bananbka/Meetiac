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

