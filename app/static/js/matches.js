// Mock data for demonstration
let curMatchesPage = 1
let mockMatches = {
    matches: [],
    pagination: {}
}

let isSearchBarVisible = false
let isFilterPanelOpen = false

document.addEventListener("DOMContentLoaded", () => {
    loadMatches()
    updateStats()
})

function showLoading() {
    document.getElementById("loadingOverlay").style.display = "flex"
}

function hideLoading() {
    document.getElementById("loadingOverlay").style.display = "none"
}

async function loadMatches(filters = {}) {
    showLoading()

    const response = await fetch(`/api/match/matches?page=${curMatchesPage}`)
    const data = await response.json()

    if (curMatchesPage === 1) mockMatches = data
    else mockMatches.matches = [...mockMatches.matches, ...data.matches]

    mockMatches.pagination = data.pagination

    // Apply search & sort
    const searchTerm = document.getElementById("searchInput").value.toLowerCase()
    let filteredMatches = [...mockMatches.matches]

    if (searchTerm) {
        filteredMatches = filteredMatches.filter(
            (match) =>
                match.name.toLowerCase().includes(searchTerm) ||
                match.lastMessage.toLowerCase().includes(searchTerm)
        )
    }

    const sortBy = filters.sortBy || document.getElementById("sortSelect").value
    filteredMatches.sort((a, b) => {
        if (sortBy === "newest") return b.created_at.localeCompare(a.created_at)
        else if (sortBy === "oldest") return a.created_at.localeCompare(b.created_at)
        return 0
    })

    renderMatches(filteredMatches)

    hideLoading()
    updateStats(filteredMatches)
}

function renderMatches(matches) {
    const matchesList = document.getElementById("matchesList")
    const emptyState = document.getElementById("emptyState")
    const loadMoreBtn = document.getElementById("loadMoreBtn")
    const loadMoreText = loadMoreBtn.querySelector(".load-more-text")

    matchesList.innerHTML = ""

    if (matches.length === 0) {
        emptyState.style.display = "block"
        document.getElementById("loadMoreContainer").style.display = "none"
    } else {
        emptyState.style.display = "none"
        matches.forEach((match) => {
            matchesList.appendChild(createMatchCard(match))
        })
        document.getElementById("loadMoreContainer").style.display = "flex"

        if (!mockMatches.pagination?.has_next) {
            loadMoreBtn.disabled = true
            loadMoreText.textContent = "Це все!"
        } else {
            loadMoreBtn.disabled = false
            loadMoreText.textContent = "Завантажити ще"
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

    if (mockMatches.pagination?.has_next) {
        curMatchesPage += 1
        await loadMatches()
    } else {
        loadMoreText.textContent = "Це все!"
    }

    loadMoreText.style.display = "block"
    loadMoreSpinner.style.display = "none"
}

function createMatchCard(match) {
    console.log(match)
    user = match.match_user
    const card = document.createElement("div")
    card.className = `match-card`
    card.onclick = () => openMeetingModal(match)

    const header = document.createElement("div")
    header.className = "match-header"

    const avatar = document.createElement("div")
    avatar.className = "match-avatar"
    avatar.style.backgroundImage = `url('${user.images[0]}')`
    header.appendChild(avatar)

    const info = document.createElement("div")
    info.className = "match-info"

    const name = document.createElement("div")
    name.className = "match-name"
    name.textContent = `${user.name}, ${user.age}`
    info.appendChild(name)

    const time = document.createElement("div")
    time.className = "match-time" // ТУТ ЧАС КОЛИ БУЛО СТВОРЕНО
    time.textContent = formatDate(match.created_at);
    info.appendChild(time)

    header.appendChild(info)
    card.appendChild(header)

    const preview = document.createElement("div")
    preview.className = "match-preview"

    card.appendChild(preview)

    const actions = document.createElement("div")
    actions.className = "match-actions"


    const unmatchBtn = document.createElement("button")
    unmatchBtn.className = "action-btn-small unmatch"
    unmatchBtn.innerHTML = `<i class="fas fa-heart-broken"></i> Розпарувати`
    unmatchBtn.onclick = (e) => {
        e.stopPropagation()
        handleUnmatch(match.match_id)
    }
    actions.appendChild(unmatchBtn)

    card.appendChild(actions)

    return card
}

function toggleSearch() {
    isSearchBarVisible = !isSearchBarVisible
    document.getElementById("searchBar").classList.toggle("show", isSearchBarVisible)
    document.getElementById("searchInput").value = ""
    document.querySelector(".clear-search").style.display = "none"
    loadMatches() // Reload matches when search bar is toggled
}

function toggleFilter() {
    isFilterPanelOpen = !isFilterPanelOpen
    document.getElementById("filterPanel").classList.toggle("show", isFilterPanelOpen)
}

function searchMatches() {
    const searchTerm = document.getElementById("searchInput").value
    document.querySelector(".clear-search").style.display = searchTerm ? "block" : "none"
    loadMatches()
}

function clearSearch() {
    document.getElementById("searchInput").value = ""
    document.querySelector(".clear-search").style.display = "none"
    loadMatches()
}

function applyFilters() {
    showNotification("Фільтри застосовано!")
    toggleFilter()
    loadMatches()
}

function resetFilters() {
    document.getElementById("sortSelect").value = "newest"
    showNotification("Фільтри скинуто!")
    loadMatches()
}

async function handleUnmatch(matchId) {
    const resp = await fetch(`/api/match/${matchId}`, {
        method: "DELETE"
    })
    if (resp.ok) {
        showNotification("Успішно розпаровано!", 'success')
    }
    else {
        showNotification("Помилка розпарування", 'danger')
    }


    loadMatches()
}

function goToDiscover() {
    window.location.href = 'discover';
}

function goBack() {
    window.history.back()
}

async function updateStats() {
    const matchesResponse = await fetch(`/api/match/count`)
    const matchesData = await matchesResponse.json()

    document.getElementById("totalMatches").textContent = matchesData || 0
}

let map, marker

function openMeetingModal(match) {
    const user = match.match_user
    const targetUserId = user.user_id

    document.getElementById("meetingUserId").value = targetUserId
    document.getElementById("meetingDateTime").value = ""
    document.getElementById("meetingLat").value = ""
    document.getElementById("meetingLng").value = ""

    document.getElementById("meetingModal").style.display = "flex"

    // Показати карту з центром у Києві
    setTimeout(() => {
        if (!map) {
            map = L.map('map').setView([50.45, 30.52], 12) // Київ

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap'
            }).addTo(map)

            map.on('click', function (e) {
                const {lat, lng} = e.latlng
                document.getElementById("meetingLat").value = lat
                document.getElementById("meetingLng").value = lng

                if (marker) {
                    marker.setLatLng(e.latlng)
                } else {
                    marker = L.marker(e.latlng).addTo(map)
                }
            })
        } else {
            map.invalidateSize()
        }
    }, 100) // Дати час DOM'у промалюватися
}

function closeMeetingModal() {
    document.getElementById("meetingModal").style.display = "none"
}

document.getElementById("meetingForm").addEventListener("submit", async (e) => {
    e.preventDefault()

    const user2_id = document.getElementById("meetingUserId").value
    const meeting_date = document.getElementById("meetingDateTime").value
    const lat = document.getElementById("meetingLat").value
    const lng = document.getElementById("meetingLng").value

    // Перевірка координат
    if (!lat || !lng) {
        showNotification("Оберіть точку на карті.")
        return
    }

    // Перевірка дати
    const selectedDate = new Date(meeting_date)
    const now = new Date()

    if (isNaN(selectedDate.getTime())) {
        showNotification("Некоректна дата.", 'danger')
        return
    }

    if (selectedDate <= now) {
        showNotification("Дата та час зустрічі мають бути в майбутньому.", "danger")
        return
    }

    console.log({user2_id, meeting_date, lat, lng})

    // Надсилання запиту
    const res = await fetch('/api/meeting/', {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            user2_id: user2_id,
            datetime: meeting_date,
            location: `${lat} ${lng}`
        })
    })

    if (res.ok) {
        showNotification("Зустріч призначено!", "success")
        closeMeetingModal()
    } else {
        showNotification("Помилка при створенні зустрічі", "danger")
    }
})
