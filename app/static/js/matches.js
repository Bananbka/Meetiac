// Mock data for demonstration
const mockMatches = [
  {
    id: "match1",
    name: "Олена",
    age: 24,
    location: "Київ",
    distance: 10,
    photo: "/placeholder.svg?height=60&width=60&text=Олена",
    isOnline: true,
    lastMessage: "Привіт! Як справи?",
    lastMessageTime: "10 хв тому",
    unreadCount: 2,
    isNew: true,
    isSuperMatch: false,
    isPremium: false,
  },
  {
    id: "match2",
    name: "Дмитро",
    age: 30,
    location: "Львів",
    distance: 50,
    photo: "/placeholder.svg?height=60&width=60&text=Дмитро",
    isOnline: false,
    lastMessage: "Зустрінемось завтра?",
    lastMessageTime: "1 год тому",
    unreadCount: 0,
    isNew: false,
    isSuperMatch: true,
    isPremium: true,
  },
  {
    id: "match3",
    name: "Марія",
    age: 27,
    location: "Одеса",
    distance: 20,
    photo: "/placeholder.svg?height=60&width=60&text=Марія",
    isOnline: true,
    lastMessage: "Дякую за лайк!",
    lastMessageTime: "3 год тому",
    unreadCount: 0,
    isNew: false,
    isSuperMatch: false,
    isPremium: false,
  },
  {
    id: "match4",
    name: "Андрій",
    age: 32,
    location: "Харків",
    distance: 15,
    photo: "/placeholder.svg?height=60&width=60&text=Андрій",
    isOnline: true,
    lastMessage: "Привіт!",
    lastMessageTime: "1 день тому",
    unreadCount: 1,
    isNew: true,
    isSuperMatch: false,
    isPremium: false,
  },
  {
    id: "match5",
    name: "Наталія",
    age: 29,
    location: "Дніпро",
    distance: 25,
    photo: "/placeholder.svg?height=60&width=60&text=Наталія",
    isOnline: false,
    lastMessage: "Як твій день?",
    lastMessageTime: "2 дні тому",
    unreadCount: 0,
    isNew: false,
    isSuperMatch: false,
    isPremium: false,
  },
]

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
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call

  let filteredMatches = [...mockMatches]

  // Apply search filter
  const searchTerm = document.getElementById("searchInput").value.toLowerCase()
  if (searchTerm) {
    filteredMatches = filteredMatches.filter(
      (match) => match.name.toLowerCase().includes(searchTerm) || match.lastMessage.toLowerCase().includes(searchTerm),
    )
  }

  // Apply chat status filter
  const chatStatus = filters.chatStatus || document.getElementById("chatStatusSelect").value
  if (chatStatus !== "all") {
    if (chatStatus === "active") {
      filteredMatches = filteredMatches.filter((match) => match.lastMessage && match.unreadCount === 0)
    } else if (chatStatus === "new") {
      filteredMatches = filteredMatches.filter((match) => match.isNew)
    } else if (chatStatus === "inactive") {
      filteredMatches = filteredMatches.filter((match) => !match.lastMessage || match.unreadCount === 0)
    }
  }

  // Apply online status filter
  const onlineStatus = filters.onlineStatus || document.getElementById("onlineStatusSelect").value
  if (onlineStatus !== "all") {
    if (onlineStatus === "online") {
      filteredMatches = filteredMatches.filter((match) => match.isOnline)
    } else if (onlineStatus === "recent") {
      // This would require more complex logic based on last seen timestamp
      // For now, let's just filter out offline users who haven't been online recently
      filteredMatches = filteredMatches.filter(
        (match) => match.isOnline || match.lastMessageTime.includes("год") || match.lastMessageTime.includes("день"),
      )
    }
  }

  // Apply sorting
  const sortBy = filters.sortBy || document.getElementById("sortSelect").value
  filteredMatches.sort((a, b) => {
    if (sortBy === "newest") {
      // Simple string comparison, in real app use timestamps
      return b.lastMessageTime.localeCompare(a.lastMessageTime)
    } else if (sortBy === "oldest") {
      return a.lastMessageTime.localeCompare(b.lastMessageTime)
    } else if (sortBy === "distance") {
      return a.distance - b.distance
    } else if (sortBy === "activity") {
      // Prioritize unread messages, then recent activity
      if (a.unreadCount > 0 && b.unreadCount === 0) return -1
      if (b.unreadCount > 0 && a.unreadCount === 0) return 1
      return b.lastMessageTime.localeCompare(a.lastMessageTime)
    }
    return 0
  })

  const matchesList = document.getElementById("matchesList")
  const emptyState = document.getElementById("emptyState")
  matchesList.innerHTML = ""

  if (filteredMatches.length === 0) {
    emptyState.style.display = "block"
    document.getElementById("loadMoreContainer").style.display = "none"
  } else {
    emptyState.style.display = "none"
    filteredMatches.forEach((match) => {
      matchesList.appendChild(createMatchCard(match))
    })
    document.getElementById("loadMoreContainer").style.display = "flex"
  }
  hideLoading()
  updateStats(filteredMatches)
}

function createMatchCard(match) {
  const card = document.createElement("div")
  card.className = `match-card ${match.isNew ? "new" : ""} ${match.isSuperMatch ? "super" : ""}`
  card.onclick = () => goToChat(match.id)

  const header = document.createElement("div")
  header.className = "match-header"

  const avatar = document.createElement("div")
  avatar.className = "match-avatar"
  avatar.style.backgroundImage = `url('${match.photo}')`
  if (match.isOnline) {
    const onlineIndicator = document.createElement("div")
    onlineIndicator.className = "online-indicator"
    avatar.appendChild(onlineIndicator)
  }
  header.appendChild(avatar)

  const info = document.createElement("div")
  info.className = "match-info"

  const name = document.createElement("div")
  name.className = "match-name"
  name.textContent = `${match.name}, ${match.age}`
  info.appendChild(name)

  const details = document.createElement("div")
  details.className = "match-details"
  details.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${match.location} (${match.distance} км)`
  info.appendChild(details)

  const time = document.createElement("div")
  time.className = "match-time"
  time.textContent = match.lastMessageTime
  info.appendChild(time)

  header.appendChild(info)
  card.appendChild(header)

  const badges = document.createElement("div")
  badges.className = "match-badges"
  if (match.isNew) {
    const newBadge = document.createElement("span")
    newBadge.className = "match-badge new"
    newBadge.textContent = "Новий"
    badges.appendChild(newBadge)
  }
  if (match.isSuperMatch) {
    const superBadge = document.createElement("span")
    superBadge.className = "match-badge super"
    superBadge.textContent = "Супер"
    badges.appendChild(superBadge)
  }
  if (match.isPremium) {
    const premiumBadge = document.createElement("span")
    premiumBadge.className = "match-badge premium"
    premiumBadge.textContent = "Преміум"
    badges.appendChild(premiumBadge)
  }
  card.appendChild(badges)

  const preview = document.createElement("div")
  preview.className = "match-preview"

  const lastMessage = document.createElement("p")
  lastMessage.className = "last-message"
  lastMessage.textContent = match.lastMessage
  preview.appendChild(lastMessage)

  const messageStatus = document.createElement("div")
  messageStatus.className = "message-status"
  messageStatus.innerHTML = `<span>Останнє повідомлення</span>`
  if (match.unreadCount > 0) {
    const unreadCount = document.createElement("span")
    unreadCount.className = "unread-count"
    unreadCount.textContent = match.unreadCount
    messageStatus.appendChild(unreadCount)
  }
  preview.appendChild(messageStatus)
  card.appendChild(preview)

  const actions = document.createElement("div")
  actions.className = "match-actions"

  const messageBtn = document.createElement("button")
  messageBtn.className = "action-btn-small message"
  messageBtn.innerHTML = `<i class="fas fa-comment"></i> Повідомлення`
  messageBtn.onclick = (e) => {
    e.stopPropagation()
    goToChat(match.id)
  }
  actions.appendChild(messageBtn)

  const unmatchBtn = document.createElement("button")
  unmatchBtn.className = "action-btn-small unmatch"
  unmatchBtn.innerHTML = `<i class="fas fa-heart-broken"></i> Розпарувати`
  unmatchBtn.onclick = (e) => {
    e.stopPropagation()
    handleUnmatch(match.id)
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
  alert("Фільтри застосовано!")
  toggleFilter()
  loadMatches()
}

function resetFilters() {
  document.getElementById("sortSelect").value = "newest"
  document.getElementById("chatStatusSelect").value = "all"
  document.getElementById("onlineStatusSelect").value = "all"
  alert("Фільтри скинуто!")
  loadMatches()
}

function loadMore() {
  const loadMoreBtn = document.getElementById("loadMoreBtn")
  const loadMoreText = loadMoreBtn.querySelector(".load-more-text")
  const loadMoreSpinner = loadMoreBtn.querySelector(".load-more-spinner")

  loadMoreText.style.display = "none"
  loadMoreSpinner.style.display = "block"
  loadMoreBtn.disabled = true

  // Simulate loading more data
  setTimeout(() => {
    alert("Завантажено більше збігів!")
    // In a real app, append more data to the matchesList
    loadMoreText.style.display = "block"
    loadMoreSpinner.style.display = "none"
    loadMoreBtn.disabled = false
  }, 1000)
}

function goToChat(matchId) {
  alert(`Перехід до чату з ${matchId}`)
  // window.location.href = `chat.html?id=${matchId}`;
}

function handleUnmatch(matchId) {
  if (confirm(`Ви впевнені, що хочете розпаруватись з ${matchId}?`)) {
    alert(`Розпаровано з ${matchId}`)
    // Remove from mockMatches and reload
    mockMatches.splice(
      mockMatches.findIndex((m) => m.id === matchId),
      1,
    )
    loadMatches()
  }
}

function goToDiscover() {
  alert("Перехід до сторінки пошуку")
  // window.location.href = 'discover.html';
}

function goBack() {
  window.history.back()
}

function updateStats(currentMatches = mockMatches) {
  document.getElementById("totalMatches").textContent = currentMatches.length
  document.getElementById("newMatches").textContent = currentMatches.filter((m) => m.isNew).length
  document.getElementById("activeChats").textContent = currentMatches.filter(
    (m) => m.lastMessage && m.unreadCount === 0,
  ).length
}
