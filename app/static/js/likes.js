// Mock data for demonstration
let mockLikes = [];
let curPage = 1;

let isFilterPanelOpen = false;

document.addEventListener("DOMContentLoaded", () => {
    loadLikes()
})

function showLoading() {
    document.getElementById("loadingOverlay").style.display = "flex"
}

function hideLoading() {
    document.getElementById("loadingOverlay").style.display = "none"
}

async function loadLikes() {
    showLoading()
    const response = await fetch("/api/reactions/likes")
    mockLikes = await response.json()

    loadCards();

    curPage = mockLikes.pagination.page;

    updateBadges()
    hideLoading()
}

function loadCards() {
    const likes = mockLikes["likes"]

    const gridElement = document.getElementById(`sentLikes`)
    const emptyStateElement = document.getElementById(`sentEmpty`)
    gridElement.innerHTML = ""

    if (likes.length === 0) {
        emptyStateElement.style.display = "block"
        document.getElementById("loadMoreContainer").style.display = "none"
    } else {
        emptyStateElement.style.display = "none"
        likes.forEach((like) => {
            gridElement.appendChild(createLikeCard(like))
        })
        document.getElementById("loadMoreContainer").style.display = "flex" // Show load more if there's data
    }
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
    time.textContent = formatDate(like.created_at) // функція для красивого часу
    infoDiv.appendChild(time)

    const actionsDiv = document.createElement("div")
    actionsDiv.className = "like-card-actions"

    const viewProfileBtn = document.createElement("button")
    viewProfileBtn.className = "action-btn-small like"
    viewProfileBtn.textContent = "Переглянути"
    viewProfileBtn.onclick = (e) => {
        e.stopPropagation()
        goToUserProfile(like.to_user.user_id)
    }

    const deleteLikeBtn = document.createElement("button")
    deleteLikeBtn.className = "action-btn-small like"
    deleteLikeBtn.textContent = "Видалити"
    deleteLikeBtn.onclick = (e) => {
        e.stopPropagation()
        deleteLike(like.id)
    }

    actionsDiv.appendChild(viewProfileBtn)
    actionsDiv.appendChild(deleteLikeBtn)

    infoDiv.appendChild(actionsDiv)

    card.appendChild(imageDiv)
    card.appendChild(infoDiv)

    return card
}

async function deleteLike(id) {
    const response = await fetch(`/api/discover/clear-like/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        showNotification("Помилка при видаленні лайку!", "danger")
    }

    loadLikes()
    updateBadges()
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
    // Implement actual filtering logic and reload current tab
    loadLikes()
}

function resetFilters() {
    document.getElementById("sortSelect").value = "newest"
    document.getElementById("statusSelect").value = "all"
    alert("Фільтри скинуто!")
    // Implement actual reset logic and reload current tab
    loadLikes()
}

async function loadMore() {
    const loadMoreBtn = document.getElementById("loadMoreBtn")
    const loadMoreText = loadMoreBtn.querySelector(".load-more-text")
    const loadMoreSpinner = loadMoreBtn.querySelector(".load-more-spinner")

    loadMoreText.style.display = "none"
    loadMoreSpinner.style.display = "block"
    loadMoreBtn.disabled = true

    const pagination = mockLikes.pagination;
    if (pagination.has_next) {
        curPage += 1;
        const response = await fetch(`/api/reactions/likes?page=${curPage}`)
        data = await response.json()

        mockLikes.likes = [...mockLikes.likes, ...data.likes]
        mockLikes.pagination = data.pagination

        if (data.pagination.has_next) {
            loadMoreBtn.disabled = false
        } else {
            loadMoreText.textContent = "Це усі лайки!"
        }

    } else {
        loadMoreText.textContent = "Це усі лайки!"
    }

    console.log(mockLikes)
    loadMoreText.style.display = "block"
    loadMoreSpinner.style.display = "none"

    loadCards();
    updateBadges()
}

async function clearLikes() {
    const response = await fetch('/api/discover/clear-likes', {
        method: "DELETE"
    });
    if (!response.ok) {
        return
    }
    loadLikes()
    updateBadges()
}


function goToUserProfile(userId) {
    window.location.href = `user-profile/${userId}`;
}

function goToProfile() {
    window.location.href = 'profile';
}

function goToDiscover() {
    window.location.href = 'discover';
}

function showMatchModal(matchedUserId) {
    document.getElementById("matchModal").classList.add("show")
    // Set user images in modal
    document.getElementById("matchUser1").src = "/placeholder.svg?height=60&width=60&text=You"
    const matchedUser =
        mockLikes.received.find((u) => u.id === matchedUserId) ||
        mockLikes.sent.find((u) => u.id === matchedUserId) ||
        mockLikes.super.find((u) => u.id === matchedUserId)
    document.getElementById("matchUser2").src = matchedUser
        ? matchedUser.photo
        : "/placeholder.svg?height=60&width=60&text=Match"
}

function closeMatchModal() {
    document.getElementById("matchModal").classList.remove("show")
}

function startChatFromMatch() {
    closeMatchModal()
    alert("Перехід до чату!")
    // window.location.href = 'chat.html?matchId=...';
}

function goBack() {
    window.history.back()
}

function updateBadges() {
    console.log(mockLikes)
    document.getElementById("sentBadge").textContent = mockLikes["likes"].length
}
