// Mock data for demonstration
let mockLikes = [];
let mockDislikes = [];
let curLikesPage = 1;
let curDislikesPage = 1;

let isFilterPanelOpen = false;
let currentTab = 'likes';

// DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    switchTab("likes")
})

function showLoading() {
    document.getElementById("loadingOverlay").style.display = "flex"
}

function hideLoading() {
    document.getElementById("loadingOverlay").style.display = "none"
}

async function loadLikes() {
    showLoading()

    if (currentTab === "likes") {
        const response = await fetch(`/api/reactions/likes?page=${curLikesPage}`)
        const data = await response.json()
        if (curLikesPage === 1) mockLikes = data
        else mockLikes.likes = [...mockLikes.likes, ...data.likes]
        mockLikes.pagination = data.pagination
    } else if (currentTab === "dislikes") {
        const response = await fetch(`/api/reactions/dislikes?page=${curDislikesPage}`)
        const data = await response.json()
        if (curDislikesPage === 1) mockDislikes = data
        else mockDislikes.dislikes = [...mockDislikes.dislikes, ...data.dislikes]
        mockDislikes.pagination = data.pagination
    }

    loadCards()
    updateBadges()
    hideLoading()
}

function loadCards() {
    const likes = mockLikes["likes"] || []
    const dislikes = mockDislikes["dislikes"] || []

    const likesGrid = document.getElementById("likesLikes")
    const likesEmpty = document.getElementById("likesEmpty")
    const loadMoreBtn = document.getElementById("loadMoreBtn")
    const loadMoreText = loadMoreBtn.querySelector(".load-more-text")
    const loadMoreSpinner = loadMoreBtn.querySelector(".load-more-spinner")

    likesGrid.innerHTML = ""

    if (currentTab === "likes") {
        if (likes.length === 0) {
            likesEmpty.style.display = "block"
            document.getElementById("loadMoreContainer").style.display = "none"
        } else {
            likesEmpty.style.display = "none"
            likes.forEach((like) => {
                likesGrid.appendChild(createLikeCard(like))
            })
            document.getElementById("loadMoreContainer").style.display = "flex"

            if (!mockLikes.pagination?.has_next) {
                loadMoreBtn.disabled = true
                loadMoreText.textContent = "Це все!"
            } else {
                loadMoreBtn.disabled = false
                loadMoreText.textContent = "Завантажити ще"
            }
        }
    } else if (currentTab === "dislikes") {
        if (dislikes.length === 0) {
            likesEmpty.style.display = "block"
            document.getElementById("loadMoreContainer").style.display = "none"
        } else {
            likesEmpty.style.display = "none"
            dislikes.forEach((dislike) => {
                likesGrid.appendChild(createLikeCard(dislike))
            })
            document.getElementById("loadMoreContainer").style.display = "flex"

            if (!mockDislikes.pagination?.has_next) {
                loadMoreBtn.disabled = true
                loadMoreText.textContent = "Це все!"
            } else {
                loadMoreBtn.disabled = false
                loadMoreText.textContent = "Завантажити ще"
            }
        }
    }
}

async function loadMore() {
    const loadMoreBtn = document.getElementById("loadMoreBtn")
    const loadMoreText = loadMoreBtn.querySelector(".load-more-text")
    const loadMoreSpinner = loadMoreBtn.querySelector(".load-more-spinner")

    loadMoreText.style.display = "none"
    loadMoreSpinner.style.display = "block"
    loadMoreBtn.disabled = true

    if (currentTab === "likes" && mockLikes.pagination?.has_next) {
        curLikesPage += 1
        await loadLikes()
    } else if (currentTab === "dislikes" && mockDislikes.pagination?.has_next) {
        curDislikesPage += 1
        await loadLikes()
    } else {
        loadMoreText.textContent = "Це все!"
    }

    loadMoreText.style.display = "block"
    loadMoreSpinner.style.display = "none"
}

function createLikeCard(like) {
    const card = document.createElement("div")
    card.className = "like-card"
    card.onclick = () => goToUserProfile(like.to_user.user_id)

    const imageDiv = document.createElement("div")
    imageDiv.className = "like-card-image"

    const imageUrl = like.to_user.images?.[0] || "/static/default.png"
    imageDiv.style.backgroundImage = `url('${imageUrl}')`

    const badge = document.createElement("span")
    badge.className = "like-type-badge sent"
    badge.textContent = "Відправлено"
    imageDiv.appendChild(badge)

    const infoDiv = document.createElement("div")
    infoDiv.className = "like-card-info"

    const name = document.createElement("div")
    name.className = "like-card-name"
    name.textContent = like.to_user.name
    infoDiv.appendChild(name)

    const details = document.createElement("div")
    details.className = "like-card-details"
    infoDiv.appendChild(details)

    const time = document.createElement("div")
    time.className = "like-card-time"
    time.textContent = formatDate(like.created_at)
    infoDiv.appendChild(time)

    const actionsDiv = document.createElement("div")
    actionsDiv.className = "like-card-actions"

    if (currentTab === "likes") {
        const viewProfileBtn = document.createElement("button")
        viewProfileBtn.className = "action-btn-small like"
        viewProfileBtn.textContent = "Переглянути"
        viewProfileBtn.onclick = (e) => {
            e.stopPropagation()
            goToUserProfile(like.to_user.user_id)
        }
        actionsDiv.appendChild(viewProfileBtn)
    }

    const deleteLikeBtn = document.createElement("button")
    deleteLikeBtn.className = "action-btn-small like"
    deleteLikeBtn.textContent = "Видалити"
    deleteLikeBtn.onclick = (e) => {
        e.stopPropagation()
        if (currentTab === "likes") {
            deleteLike(like.id)
        } else if (currentTab === "dislikes") {
            deleteDislike(like.id)
        }
    }

    actionsDiv.appendChild(deleteLikeBtn)

    infoDiv.appendChild(actionsDiv)
    card.appendChild(imageDiv)
    card.appendChild(infoDiv)

    return card
}

async function deleteLike(id) {
    const response = await fetch(`/api/discover/clear-like/${id}`, {
        method: "DELETE"
    })

    if (!response.ok) {
        showNotification("Помилка при видаленні лайку!", "danger")
    }

    loadLikes()
    updateBadges()
}

async function deleteDislike(id) {
    const response = await fetch(`/api/discover/clear-dislike/${id}`, {
        method: "DELETE"
    })

    if (!response.ok) {
        showNotification("Помилка при видаленні дизлайку!", "danger")
    }

    loadLikes()
    updateBadges()
}

async function clearLikes() {
    const response = await fetch('/api/discover/clear-likes', {
        method: "DELETE"
    });

    if (!response.ok) {
        showNotification("Помилка при очищенні лайків!", "danger")
        return;
    }

    curLikesPage = 1;
    await loadLikes();
}

async function clearDislikes() {
    const response = await fetch('/api/discover/clear-dislikes', {
        method: "DELETE"
    });

    if (!response.ok) {
        showNotification("Помилка при очищенні дизлайків!", "danger")
        return;
    }

    curDislikesPage = 1;
    await loadLikes();
}

function clearAll() {
    if (currentTab === "likes") {
        clearLikes();
    } else if (currentTab === "dislikes") {
        clearDislikes();
    }
}

function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleString("uk-UA", {
        dateStyle: "short",
        timeStyle: "short"
    })
}

function toggleFilter() {
    isFilterPanelOpen = !isFilterPanelOpen
    document.getElementById("filterPanel").classList.toggle("show", isFilterPanelOpen)
}

function applyFilters() {
    alert("Фільтри застосовано!")
    toggleFilter()
    if (currentTab === "likes") curLikesPage = 1
    if (currentTab === "dislikes") curDislikesPage = 1
    loadLikes()
}

function resetFilters() {
    document.getElementById("sortSelect").value = "newest"
    document.getElementById("statusSelect").value = "all"
    alert("Фільтри скинуто!")
    if (currentTab === "likes") curLikesPage = 1
    if (currentTab === "dislikes") curDislikesPage = 1
    loadLikes()
}

function goToUserProfile(userId) {
    window.location.href = `user-profile/${userId}`
}

function goToProfile() {
    window.location.href = 'profile'
}

function goToDiscover() {
    window.location.href = 'discover'
}

function closeMatchModal() {
    document.getElementById("matchModal").classList.remove("show")
}

function startChatFromMatch() {
    closeMatchModal()
    alert("Перехід до чату!")
}

function goBack() {
    window.history.back()
}

async function updateBadges() {
    const likeResponse = await fetch(`/api/discover/like-count`)
    const likeData = await likeResponse.json()
    document.getElementById("likesBadge").textContent = likeData || 0

    const dislikeResponse = await fetch(`/api/discover/dislike-count`)
    const dislikeData = await dislikeResponse.json()
    document.getElementById("dislikesBadge").textContent = dislikeData || 0

}

function switchTab(tabName) {
    currentTab = tabName
    document.querySelectorAll(".tab-btn").forEach((btn) => {
        btn.classList.remove("active")
    })
    document.querySelector(`.tab-btn[data-tab="${tabName}"]`).classList.add("active")

    if (tabName === "likes") curLikesPage = 1
    if (tabName === "dislikes") curDislikesPage = 1
    loadLikes()
}
