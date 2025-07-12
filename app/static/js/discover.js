// Discover page functionality
let currentProfileIndex = 0
const likedProfiles = []

// Sample profile data
let profiles = [];
let currentPage = 1;
let hasNext = true;

document.addEventListener("DOMContentLoaded", () => {
    initDiscoverPage()
})

async function initDiscoverPage() {
    await uploadProfilesData()
    if (profiles.length === 0) showEmptyProfile()
    updateProfileCard()
    updateLikesCount()
    setupKeyboardNavigation()
    setupTouchGestures()
    setupLogoutModal()

}


const zodiacsNames = {
    aquarius: {name: "Водолій", emj: "♒️"},
    pisces: {name: "Риби", emj: "♓️"},
    aries: {name: "Овен", emj: "♈️"},
    taurus: {name: "Телець", emj: "♉️"},
    gemini: {name: "Близнюки", emj: "♊️"},
    cancer: {name: "Рак", emj: "♋️"},
    leo: {name: "Лев", emj: "♌️"},
    virgo: {name: "Діва", emj: "♍️"},
    libra: {name: "Терези", emj: "♎️"},
    scorpio: {name: "Скорпіон", emj: "♏️"},
    sagittarius: {name: "Стрілець", emj: "♐️"},
    capricorn: {name: "Козеріг", emj: "♑️"}
}

function getZodiacName(sign, addEmoji = false) {
    const zodiacData = zodiacsNames[sign];
    return `${addEmoji ? zodiacData.emj : ""} ${zodiacData.name}`
}

function updateProfileCard() {
    const profile = profiles[currentProfileIndex];

    if (!profile) return

    const bioElement = document.getElementById("profileBio");
    const toggleElement = document.getElementById("bioToggle");
    setupBio(bioElement, toggleElement, profile.bio || "");

    document.getElementById("profileName").textContent = `${profile.name}, ${profile.age}`;
    document.getElementById("profileZodiac").textContent = getZodiacName(profile.sign, true);
    document.getElementById("compatibilityScore").textContent = profile.compatibility;
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

async function uploadProfilesData(page = 1) {
    currentProfileIndex = 0;

    const includes = "age,sign,bio,interests,images";
    const response = await fetch(`/api/discover/users?page=${page}&includes=${includes}`);
    if (!response.ok) showNotification("Помилка при отриманні профілів.", "error")

    const data = await response.json();
    hasNext = data.pagination.has_next;
    profiles = data.users;

}

async function handleLike() {
    const profile = profiles[currentProfileIndex]
    likedProfiles.push(profile.id)

    // Add animation effect
    const card = document.getElementById("profileCard")
    card.style.transform = "translateX(100%) rotate(20deg)"
    card.style.opacity = "0"

    await likeUser();

    setTimeout(async () => {
        await nextProfile()
        card.style.transform = "translateX(0) rotate(0deg)"
        card.style.opacity = "1"
    }, 300)

    updateLikesCount()
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

    console.log(currentProfileIndex)

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

function updateLikesCount() {
    const likesElement = document.getElementById("likesCount")
    if (likesElement) {
        likesElement.textContent = likedProfiles.length
    }
}

function setupKeyboardNavigation() {
    let isProcessing = false;

    document.addEventListener("keydown", async (e) => {
        if (currentProfileIndex >= profiles.length) return

        if (isProcessing) return;

        if (["ArrowLeft", "ArrowRight", " "].includes(e.key)) {
            e.preventDefault(); // блокуємо прокручування сторінки (особливо для Space)
            isProcessing = true;


            if (e.key === "ArrowLeft") {
                await handleReject();
            } else {
                await handleLike();
            }

            // sleep-затримка 400 мс
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
                        <button class="action-btn reject" onclick="handleReject()">
                            <i class="fas fa-times"></i>
                        </button>
                        <button class="action-btn message">
                            <i class="fas fa-comment"></i>
                        </button>
                        <button class="action-btn like" onclick="handleLike()">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            `
            if (profiles.length === 0) showEmptyProfile()
            updateProfileCard()
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

            // Only handle horizontal swipes
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

