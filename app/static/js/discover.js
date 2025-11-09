import {
    confirmLogout,
    showLogoutModal,
    showNotification,
    setupLogoutModal,
    hideLogoutModal,
    getZodiacCompatibility,
    getZodiacPrediction,
    translateZodiacName,
    zodiacsNames
} from "./common.js"

let currentProfileIndex = 0
const likedProfiles = []
let currentSortType = "default"

let profiles = [];
let currentPage = 1;
let hasNext = true;
let total = 0;

document.addEventListener("DOMContentLoaded", async () => {
    await initDiscoverPage()
})

async function initDiscoverPage() {
    await uploadProfilesData()
    if (profiles.length === 0) showEmptyProfile()
    await updateProfileCard()
    await updateLikesCount()
    await updateMatchesCount()
    await updateTotalCount();
    await setupPrediction();
    setupKeyboardNavigation()
    setupTouchGestures()
    setupLogoutModal()
    setupButtons()
    setupMoreButton("tip-card-desc", "zodiac-description")
    setupMoreButton("tip-card-pred", "zodiac-prediction")
}

async function updateTotalCount() {
    const candidatesElement = document.getElementById("totalCount");
    const candidatesResponse = await fetch(`/api/discover/candidates-count`)
    const candidatesData = await candidatesResponse.json()
    if (candidatesElement) {
        candidatesElement.textContent = candidatesData || 0
    }
}

async function setupPrediction() {
    const data = await getZodiacPrediction()

    const zodiacName = translateZodiacName(data.sign)
    const prediction = data.prediction_ua;

    document.getElementById("zodiac-prediction").innerText = `Передбачення для ${zodiacName}\n\n${prediction}`
}

function setupButtons() {
    const resetSortButton = document.getElementById("reset-sort-btn");
    resetSortButton.addEventListener("click", resetSort)

    const sortSelect = document.getElementById("sortSelect");
    sortSelect.addEventListener("change", handleSortChange)

    const rejectButton = document.getElementById("reject-btn");
    if (rejectButton) {
        rejectButton.addEventListener("click", handleReject);
    }

    const likeButton = document.getElementById("like-btn");
    if (likeButton) {
        likeButton.addEventListener("click", handleLike);
    }

    const showLogoutButton = document.getElementById("show-logout-modal-btn");
    showLogoutButton.addEventListener("click", showLogoutModal);

    const hideLogoutButton = document.getElementById("hide-logout-modal-btn");
    hideLogoutButton.addEventListener("click", hideLogoutModal);

    const confirmLogoutBtn = document.getElementById("confirmLogoutBtn");
    confirmLogoutBtn.addEventListener("click", confirmLogout);
}


function getZodiacName(sign, addEmoji = false) {
    const zodiacData = zodiacsNames[sign];
    return `${addEmoji ? zodiacData.emj : ""} ${zodiacData.name}`
}

async function updateProfileCard() {
    const profile = profiles[currentProfileIndex];

    if (!profile) return

    const bioElement = document.getElementById("profileBio");
    const toggleElement = document.getElementById("bioToggle");
    setupBio(bioElement, toggleElement, profile.bio || "");

    const zodiacSign = profile.sign
    const compData = await getZodiacCompatibility(zodiacSign);

    document.getElementById("profileName").textContent = `${profile.name}, ${profile.age}`;
    document.getElementById("profileZodiac").textContent = getZodiacName(zodiacSign, true);
    document.getElementById("compatibilityScore").textContent = compData.percent;
    document.getElementById("zodiac-description").textContent = compData.description;
    document.getElementById("profileImage").src = profile.images[0];

    const interestsContainer = document.getElementById("profileInterests");
    interestsContainer.innerHTML = "";
    profile.interests.forEach((interest) => {
        const tag = document.createElement("span");
        tag.className = "interest-tag";
        tag.textContent = interest;
        interestsContainer.appendChild(tag);
    });
}

async function uploadProfilesData(sorting = "-id") {
    currentProfileIndex = 0;

    const includes = "age,sign,bio,interests,images";
    const response = await fetch(`/api/discover/users?sort=${sorting}&includes=${includes}`);
    if (!response.ok) showNotification("Помилка при отриманні профілів.", "error")

    const data = await response.json();
    hasNext = data.pagination.has_next;
    total = data.pagination.total;
    profiles = data.users;

}

async function handleLike() {
    const profile = profiles[currentProfileIndex]
    likedProfiles.push(profile.id)

    const card = document.getElementById("profileCard")
    card.style.transform = "translateX(100%) rotate(20deg)"
    card.style.opacity = "0"

    await likeUser();

    setTimeout(async () => {
        await nextProfile()
        card.style.transform = "translateX(0) rotate(0deg)"
        card.style.opacity = "1"
    }, 300)

    await updateLikesCount()
    await updateMatchesCount()
}

async function handleReject() {
    const card = document.getElementById("profileCard")
    card.style.transform = "translateX(-100%) rotate(-20deg)"
    card.style.opacity = "0"

    await dislikeUser();

    setTimeout(async () => {
        await nextProfile()
        card.style.transform = "translateX(0) rotate(0deg)"
        card.style.opacity = "1"
    }, 300)
}

async function likeUser() {
    const profile = profiles[currentProfileIndex];
    const userId = profile.user_id;

    const response = await fetch("/api/discover/like", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({to_user_id: userId})
    })

    if (!response.ok) {
        showNotification("Цей користувач уже був лайкнутий!")
    }

    const data = await response.json();

    if (data.match) {
        playMatchAnimation()

    }
}

async function dislikeUser() {
    const profile = profiles[currentProfileIndex];
    const userId = profile.user_id;

    const response = await fetch("/api/discover/dislike", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({to_user_id: userId})
    })

    if (!response.ok) {
        showNotification("Цей користувач уже був дізлайкнутий!")
    }
}

async function nextProfile() {
    currentProfileIndex += 1;

    if (currentProfileIndex >= profiles.length) {
        if (!hasNext) {
            showEmptyProfile();
            return;
        }

        currentProfileIndex = 0;
        currentPage += 1;
        await uploadProfilesData();

        if (profiles.length === 0) {
            showEmptyProfile()
            return;
        }
    }

    updateProfileCard();
}

async function updateLikesCount() {
    const likesElement = document.getElementById("likesCount")
    const likeResponse = await fetch(`/api/discover/like-count`)
    const likeData = await likeResponse.json()
    if (likesElement) {
        likesElement.textContent = likeData || 0
    }
}

async function updateMatchesCount() {
    const matchesElement = document.getElementById("matchesCount")
    const matchesResponse = await fetch(`/api/match/count`)
    const matchesData = await matchesResponse.json()
    if (matchesElement) {
        matchesElement.textContent = matchesData || 0
    }
}

function setupKeyboardNavigation() {
    let isProcessing = false;

    document.addEventListener("keydown", async (e) => {
        if (currentProfileIndex >= profiles.length) return

        if (isProcessing) return;

        if (["ArrowLeft", "ArrowRight", " "].includes(e.key)) {
            e.preventDefault();
            isProcessing = true;


            if (e.key === "ArrowLeft") {
                await handleReject();
            } else {
                await handleLike();
            }

            setTimeout(() => {
                isProcessing = false;
            }, 400);
        }
    });
}


function showEmptyProfile() {
    const profileCard = document.getElementById("profileCard");
    if (profileCard) {
        profileCard.innerHTML = `
            <div class="no-profiles-message">
                <p>Нових людей за вашими вимогами не знайдено 🙁</p>
            </div>
            <div class="empty-buttons-section">
                <button class="action-btn btn-outline like" id="refresh-btn">
                    <i class="fas fa-refresh"></i>
                </button>
                <div class="empty-buttons">
                    <button class="btn btn-primary" id="clear-likes-btn">Очистити лайки</button>
                    <button class="btn btn-primary" id="clear-dislikes-btn">Очистити дизлайки</button>
                </div>
            </div>
                
        `;

        const dislikesBtn = document.getElementById('clear-dislikes-btn');
        const likesBtn = document.getElementById('clear-likes-btn');
        const refreshBtn = document.getElementById('refresh-btn');

        dislikesBtn.addEventListener('click', async () => {
            const response = await fetch('/api/discover/clear-dislikes', {
                method: "DELETE"
            });
            if (!response.ok) {
                showNotification("Помилка при очищенні.", "error")
                return
            }
            showNotification("Дизлайки очищещно!")
        })

        likesBtn.addEventListener('click', async () => {
            const response = await fetch('/api/discover/clear-likes', {
                method: "DELETE"
            });
            if (!response.ok) {
                showNotification("Помилка при очищенні.", "error")
                return
            }
            showNotification("Лайки очищено!")
        })

        refreshBtn.addEventListener('click', async () => {
            await uploadProfilesData()

            profileCard.innerHTML = `
                <div class="profile-image">
                    <img alt="Profile" id="profileImage">
                    <div class="compatibility-badge">
                        <i class="fas fa-star"></i>
                        <span id="compatibilityScore">95</span>% сумісність
                    </div>
                </div>
    
                <div class="profile-info">
                    <div class="profile-header">
                        <h2 id="profileName"></h2>
                        <div class="profile-details">
                            <span id="profileZodiac"></span>
                        </div>
                    </div>
    
                    <p id="profileBio"></p>
                    <span id="bioToggle" class="bio-toggle" style="display: none;">Далі...</span>
    
                    <div class="interests" id="profileInterests">
                    </div>
    
                    <!-- Action Buttons -->
                    <div class="action-buttons">
                        <button class="action-btn reject" id="reject-btn">
                            <i class="fas fa-times"></i>
                        </button>

                        <button class="action-btn like" id="like-btn">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            `
            if (profiles.length === 0) showEmptyProfile()
            await updateProfileCard()
            setupButtons()
        })
    }
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

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                e.preventDefault()
                const rotation = deltaX * 0.1
                this.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`
                this.style.opacity = 1 - Math.abs(deltaX) / 300
            }
        })

        profileCard.addEventListener("touchend", async function (e) {
            if (!isDragging) return
            isDragging = false

            const deltaX = currentX - startX

            if (Math.abs(deltaX) > 100) {
                if (deltaX > 0) {
                    await handleLike()
                } else {
                    await handleReject()
                }
            } else {
                this.style.transform = "translateX(0) rotate(0deg)"
                this.style.opacity = "1"
            }
        })
    }
}


function setupBio(bioElement, toggleElement, fullText) {
    bioElement.textContent = fullText;
    bioElement.style.marginBottom = "25px";
    toggleElement.style.display = "none";
    toggleElement.textContent = "Далі...";
    bioElement.classList.remove("expanded");

    requestAnimationFrame(() => {
        const isOverflowing = bioElement.scrollHeight > bioElement.clientHeight;

        if (isOverflowing) {
            bioElement.style.marginBottom = "0";
            toggleElement.style.display = "inline-block";
        }
    });

    toggleElement.onclick = () => {
        const expanded = bioElement.classList.toggle("expanded");
        toggleElement.textContent = expanded ? "Менше" : "Далі...";
    };
}


async function handleSortChange() {
    const sortSelect = document.getElementById("sortSelect")
    const sortType = sortSelect.value
    currentSortType = sortType

    currentProfileIndex = 0

    switch (sortType) {
        case "default":
            await uploadProfilesData()
            break
        case "height-asc":
            await uploadProfilesData("height")
            break
        case "height-desc":
            await uploadProfilesData("-height")
            break
        case "weight-asc":
            await uploadProfilesData("weight")
            break
        case "weight-desc":
            await uploadProfilesData("-weight")
            break
        case "age-asc":
            await uploadProfilesData("age")
            break
        case "age-desc":
            await uploadProfilesData("-age")
            break
        case "shuffle":
            await uploadProfilesData("shuffle")
            break
    }

    updateProfileCard()
    showNotification(`Сортування змінено: ${getSortDisplayName(sortType)}`, "info")
}

function shuffleArray(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

function getSortDisplayName(sortType) {
    const sortNames = {
        default: "Звичайне",
        "height-asc": "По росту ↑",
        "height-desc": "По росту ↓",
        "weight-asc": "По вазі ↑",
        "weight-desc": "По вазі ↓",
        "age-asc": "По віку ↑",
        "age-desc": "По віку ↓",
        shuffle: "Перемішано",
    }
    return sortNames[sortType] || "Невідомо"
}

function resetSort() {
    const sortSelect = document.getElementById("sortSelect")
    sortSelect.value = "default"
    currentSortType = "default"
    currentProfileIndex = 0
    profiles = [...profiles]
    updateProfileCard()
    showNotification("Сортування скинуто", "success")
}

function playMatchAnimation() {
    if (document.getElementById("matchAnimationOverlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "matchAnimationOverlay";
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.zIndex = "9999";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.flexDirection = "column";
    overlay.style.animation = "fadeOut 0.5s ease-out 2.5s forwards";

    const heart = document.createElement("div");
    heart.innerHTML = "💖";
    heart.style.fontSize = "8rem";
    heart.style.animation = "pop 0.8s ease";

    const text = document.createElement("div");
    text.innerText = "Це взаємність!";
    text.style.color = "white";
    text.style.fontSize = "2rem";
    text.style.marginTop = "1rem";
    text.style.animation = "fadeInUp 1s ease";

    overlay.appendChild(heart);
    overlay.appendChild(text);
    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.remove();
    }, 3000);
}

function setupMoreButton(tipCardId, elementId) {
    const tipCard = document.getElementById(tipCardId);
    const desc = document.getElementById(elementId);

    const btn = document.createElement("button");
    btn.className = "show-more-btn";
    btn.textContent = "Показати більше";

    if (desc.scrollHeight > desc.clientHeight) {
        tipCard.appendChild(btn);
    }

    btn.addEventListener("click", () => {
        tipCard.classList.toggle("expanded");
        btn.textContent = tipCard.classList.contains("expanded")
            ? "Показати менше"
            : "Показати більше";
    });
}


