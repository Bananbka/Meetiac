import {getZodiacCompatibility, goToReactions, showNotification} from "./common.js";

let mockUserProfile = {}

let currentPhotoIndex = 0
let totalPhotos = 0

document.addEventListener("DOMContentLoaded", async () => {
    await loadUserProfile();
    checkPredictionOverflow();
    setupButtons();

})

function setupButtons() {
    const backButton = document.getElementById("back-btn");
    backButton.addEventListener("click", goToReactions);

    const prevPhotoButton = document.getElementById("prev-photo-btn");
    prevPhotoButton.addEventListener("click", previousPhoto);

    const nextPhotoButton = document.getElementById("next-photo-btn");
    nextPhotoButton.addEventListener("click", nextPhoto);
}

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

    const userZodiacElement = document.getElementById("userZodiac");

    const prediction = await getZodiacCompatibility(user.sign);
    console.log(prediction.percent)

    userZodiacElement.innerHTML = `<span>${prediction.zodiac1}</span> + <span>${prediction.zodiac2}</span>`;

    const compatibilityFill = document.querySelector("#compatibility .compatibility-fill")
    compatibilityFill.style.width = `${prediction.percent}%`
    document.querySelector("#compatibility .compatibility-percent").textContent = `${prediction.percent}%`
    document.getElementById("userPrediction").textContent = prediction.description

    const userInterestsElement = document.getElementById("userInterests")
    userInterestsElement.innerHTML = ""
    user.interests.forEach((interest) => {
        const span = document.createElement("span")
        span.className = "interest-tag"
        span.textContent = interest
        userInterestsElement.appendChild(span)
    })

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


function checkPredictionOverflow() {
    const card = document.getElementById("zodiac-card");
    const prediction = document.getElementById("userPrediction");

    if (card.querySelector(".show-more-btn")) return;

    if (prediction.scrollHeight > prediction.clientHeight) {
        const btn = document.createElement("button");
        btn.className = "show-more-btn";
        btn.textContent = "Показати більше";
        card.appendChild(btn);

        btn.addEventListener("click", () => {
            card.classList.toggle("expanded");
            btn.textContent = card.classList.contains("expanded")
                ? "Показати менше"
                : "Показати більше";
        });
    }
}