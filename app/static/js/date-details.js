// Mock data for demonstration
const mockMeetingDetails = {
  meet1: {
    id: "meet1",
    person: { id: "userA", name: "Олена", photo: "/placeholder.svg?height=60&width=60&text=Олена" },
    date: "2025-07-20",
    time: "19:00",
    place: 'Кафе "Зоряна Ніч"',
    address: "Вулиця Хрещатик, 24, Київ",
    coordinates: [50.4495, 30.5234], // Kyiv coordinates
    message: "Буду рада зустрічі! Сподіваюся, тобі сподобається це місце.",
    status: "confirmed",
    phone: "+380441234567",
  },
  meet2: {
    id: "meet2",
    person: { id: "userC", name: "Марія", photo: "/placeholder.svg?height=60&width=60&text=Марія" },
    date: "2025-07-25",
    time: "18:30",
    place: "Парк Шевченка",
    address: "Бульвар Тараса Шевченка, Київ",
    coordinates: [50.4437, 30.5165],
    message: "",
    status: "confirmed",
    phone: "",
  },
  meet3: {
    id: "meet3",
    person: { id: "userD", name: "Андрій", photo: "/placeholder.svg?height=60&width=60&text=Андрій" },
    date: "2025-06-15",
    time: "20:00",
    place: 'Ресторан "Сузір\'я"',
    address: "Вулиця Сагайдачного, 10, Київ",
    coordinates: [50.4637, 30.5195],
    message: "Дякую за чудовий вечір!",
    status: "completed",
    phone: "+380449876543",
  },
  meet4: {
    id: "meet4",
    person: { id: "userE", name: "Наталія", photo: "/placeholder.svg?height=60&width=60&text=Наталія" },
    date: "2025-07-22",
    time: "17:00",
    place: 'Кінотеатр "Космос"',
    address: "Вулиця Велика Васильківська, 114, Київ",
    coordinates: [50.4289, 30.52],
    message: "Хочеш сходити на новий фільм?",
    status: "pending",
    phone: "",
  },
}

let currentMeetingId = null
let map = null
let mapMarker = null
let countdownInterval = null

// Declare L variable before using it
const L = window.L

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search)
  currentMeetingId = urlParams.get("id")
  if (currentMeetingId) {
    loadMeetingDetails(currentMeetingId)
  } else {
    alert("Ідентифікатор зустрічі не знайдено.")
    goBack()
  }
})

function showLoading() {
  document.getElementById("loadingOverlay").style.display = "flex"
  document.getElementById("meetingContent").style.display = "none"
}

function hideLoading() {
  document.getElementById("loadingOverlay").style.display = "none"
  document.getElementById("meetingContent").style.display = "block"
}

async function loadMeetingDetails(meetingId) {
  showLoading()
  await new Promise((resolve) => setTimeout(resolve, 700)) // Simulate API call

  const meeting = mockMeetingDetails[meetingId]
  if (!meeting) {
    alert("Зустріч не знайдено.")
    goBack()
    return
  }

  // Set status badge
  const statusBadge = document.getElementById("statusBadge")
  statusBadge.className = `meeting-status-badge ${meeting.status}`
  statusBadge.querySelector("span").textContent = getStatusText(meeting.status)
  statusBadge.querySelector("i").className = getStatusIcon(meeting.status)

  // Set participants
  document.getElementById("partnerAvatar").src = meeting.person.photo
  document.getElementById("partnerAvatar").alt = meeting.person.name
  document.getElementById("partnerName").textContent = meeting.person.name

  // Set date and time
  document.getElementById("meetingDate").textContent = formatDate(meeting.date)
  document.getElementById("meetingTime").textContent = meeting.time

  // Set place details
  document.getElementById("placeName").textContent = meeting.place
  document.getElementById("placeAddress").textContent = meeting.address
  document.querySelector(".place-actions .action-btn:nth-child(2)").style.display = meeting.phone ? "flex" : "none"

  // Set message
  const messageCard = document.getElementById("messageCard")
  const messageContent = document.getElementById("messageContent")
  if (meeting.message) {
    messageContent.textContent = meeting.message
    messageCard.style.display = "block"
  } else {
    messageCard.style.display = "none"
  }

  // Initialize map
  if (map) {
    map.remove() // Remove existing map instance
  }
  map = L.map("map").setView(meeting.coordinates, 13)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map)
  mapMarker = L.marker(meeting.coordinates).addTo(map).bindPopup(meeting.place).openPopup()
  map.on("load", () => {
    document.getElementById("mapOverlay").style.display = "none"
  })
  // Fallback if map load event doesn't fire quickly
  setTimeout(() => {
    if (document.getElementById("mapOverlay").style.display !== "none") {
      document.getElementById("mapOverlay").style.display = "none"
    }
  }, 2000)

  // Load weather (mock for now)
  loadWeather(meeting.coordinates)

  // Set actions based on status
  renderMeetingActions(meeting.status)

  // Start countdown
  startCountdown(meeting.date, meeting.time)

  // Show edit button if confirmed or pending
  document.getElementById("editBtn").style.display =
    meeting.status === "confirmed" || meeting.status === "pending" ? "flex" : "none"

  hideLoading()
}

function getStatusText(status) {
  switch (status) {
    case "confirmed":
      return "Підтверджено"
    case "pending":
      return "Очікує підтвердження"
    case "completed":
      return "Завершено"
    case "cancelled":
      return "Скасовано"
    default:
      return ""
  }
}

function getStatusIcon(status) {
  switch (status) {
    case "confirmed":
      return "fas fa-check-circle"
    case "pending":
      return "fas fa-hourglass-half"
    case "completed":
      return "fas fa-calendar-check"
    case "cancelled":
      return "fas fa-times-circle"
    default:
      return "fas fa-clock"
  }
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" }
  return new Date(dateString).toLocaleDateString("uk-UA", options)
}

function startCountdown(dateString, timeString) {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }

  const targetDateTime = new Date(`${dateString}T${timeString}:00`)

  const updateCountdown = () => {
    const now = new Date()
    const difference = targetDateTime.getTime() - now.getTime()

    if (difference <= 0) {
      clearInterval(countdownInterval)
      document.getElementById("countdown").innerHTML =
        '<div class="countdown-item"><span class="countdown-number">0</span><span class="countdown-label">днів</span></div><div class="countdown-item"><span class="countdown-number">0</span><span class="countdown-label">годин</span></div><div class="countdown-item"><span class="countdown-number">0</span><span class="countdown-label">хвилин</span></div>'
      // Optionally update meeting status to completed if it was upcoming
      return
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))

    document.getElementById("days").textContent = days
    document.getElementById("hours").textContent = hours
    document.getElementById("minutes").textContent = minutes
  }

  updateCountdown()
  countdownInterval = setInterval(updateCountdown, 60000) // Update every minute
}

async function loadWeather(coordinates) {
  const weatherInfo = document.getElementById("weatherInfo")
  weatherInfo.innerHTML = `
        <div class="weather-loading">
            <div class="loading-spinner"></div>
            <p>Завантаження прогнозу...</p>
        </div>
    `
  // Simulate API call to weather service
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock weather data
  const mockWeather = {
    temp: "22°C",
    description: "Сонячно",
    icon: "fas fa-sun",
    humidity: "60%",
    wind: "5 м/с",
  }

  weatherInfo.innerHTML = `
        <div class="weather-current">
            <i class="${mockWeather.icon} weather-icon"></i>
            <div class="weather-details">
                <div class="weather-temp">${mockWeather.temp}</div>
                <div class="weather-desc">${mockWeather.description}</div>
            </div>
        </div>
        <div class="weather-extra">
            <span>Вологість: ${mockWeather.humidity}</span>
            <span>Вітер: ${mockWeather.wind}</span>
        </div>
    `
}

function renderMeetingActions(status) {
  const actionsContainer = document.getElementById("meetingActions")
  actionsContainer.innerHTML = ""

  if (status === "pending") {
    actionsContainer.innerHTML = `
            <button class="action-btn-large success" onclick="handleMeetingAction('accept')">
                <i class="fas fa-check"></i> Прийняти зустріч
            </button>
            <button class="action-btn-large danger" onclick="handleMeetingAction('decline')">
                <i class="fas fa-times"></i> Відхилити зустріч
            </button>
        `
  } else if (status === "confirmed") {
    actionsContainer.innerHTML = `
            <button class="action-btn-large primary" onclick="goToChat()">
                <i class="fas fa-comment"></i> Написати повідомлення
            </button>
            <button class="action-btn-large secondary" onclick="handleMeetingAction('cancel')">
                <i class="fas fa-ban"></i> Скасувати зустріч
            </button>
        `
  } else if (status === "completed") {
    actionsContainer.innerHTML = `
            <button class="action-btn-large primary" onclick="goToChat()">
                <i class="fas fa-comment"></i> Написати повідомлення
            </button>
            <button class="action-btn-large secondary" onclick="handleMeetingAction('rate')">
                <i class="fas fa-star"></i> Оцінити зустріч
            </button>
        `
  } else if (status === "cancelled") {
    actionsContainer.innerHTML = `
            <p style="text-align: center; color: #ef4444; font-weight: 600;">Цю зустріч скасовано.</p>
            <button class="action-btn-large secondary" onclick="goBack()">
                <i class="fas fa-arrow-left"></i> Повернутися до зустрічей
            </button>
        `
  }
}

let currentActionCallback = null
function handleMeetingAction(actionType) {
  const meeting = mockMeetingDetails[currentMeetingId]
  let title = ""
  let message = ""
  let confirmBtnText = ""

  if (actionType === "accept") {
    title = "Прийняти зустріч"
    message = `Ви впевнені, що хочете прийняти зустріч з ${meeting.person.name}?`
    confirmBtnText = "Прийняти"
    currentActionCallback = () => {
      meeting.status = "confirmed"
      alert("Зустріч підтверджено!")
      loadMeetingDetails(currentMeetingId)
      closeConfirmModal()
    }
  } else if (actionType === "decline") {
    title = "Відхилити зустріч"
    message = `Ви впевнені, що хочете відхилити зустріч з ${meeting.person.name}?`
    confirmBtnText = "Відхилити"
    currentActionCallback = () => {
      meeting.status = "cancelled"
      alert("Зустріч відхилено!")
      loadMeetingDetails(currentMeetingId)
      closeConfirmModal()
    }
  } else if (actionType === "cancel") {
    title = "Скасувати зустріч"
    message = `Ви впевнені, що хочете скасувати зустріч з ${meeting.person.name}?`
    confirmBtnText = "Скасувати"
    currentActionCallback = () => {
      meeting.status = "cancelled"
      alert("Зустріч скасовано!")
      loadMeetingDetails(currentMeetingId)
      closeConfirmModal()
    }
  } else if (actionType === "rate") {
    alert("Функціонал оцінки зустрічі буде додано пізніше!")
    return
  }

  document.getElementById("confirmTitle").textContent = title
  document.getElementById("confirmMessage").textContent = message
  document.getElementById("confirmBtn").textContent = confirmBtnText
  document.getElementById("confirmModal").classList.add("show")
}

function confirmAction() {
  if (currentActionCallback) {
    currentActionCallback()
  }
}

function closeConfirmModal() {
  document.getElementById("confirmModal").classList.remove("show")
  currentActionCallback = null
}

function openInMaps() {
  const meeting = mockMeetingDetails[currentMeetingId]
  if (meeting && meeting.coordinates) {
    const [lat, lon] = meeting.coordinates
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`
    window.open(url, "_blank")
  } else {
    alert("Координати місця не доступні.")
  }
}

function callPlace() {
  const meeting = mockMeetingDetails[currentMeetingId]
  if (meeting && meeting.phone) {
    window.location.href = `tel:${meeting.phone}`
  } else {
    alert("Номер телефону не доступний.")
  }
}

function toggleMapSize() {
  const mapElement = document.getElementById("map")
  mapElement.classList.toggle("expanded")
  // Invalidate map size to re-render tiles correctly after size change
  if (map) {
    map.invalidateSize()
  }
}

function shareMeeting() {
  const meeting = mockMeetingDetails[currentMeetingId]
  if (navigator.share) {
    navigator
      .share({
        title: `Зустріч з ${meeting.person.name} на Meetiac`,
        text: `Запрошую на зустріч ${formatDate(meeting.date)} о ${meeting.time} у ${meeting.place}.`,
        url: window.location.href,
      })
      .then(() => console.log("Successful share"))
      .catch((error) => console.log("Error sharing", error))
  } else {
    alert(`Поділитися деталями зустрічі:
        Зустріч з ${meeting.person.name}
        Дата: ${formatDate(meeting.date)}
        Час: ${meeting.time}
        Місце: ${meeting.place}, ${meeting.address}
        ${window.location.href}`)
  }
}

function editMeeting() {
  const meeting = mockMeetingDetails[currentMeetingId]
  document.getElementById("editDate").value = meeting.date
  document.getElementById("editTime").value = meeting.time
  document.getElementById("editPlace").value = meeting.place
  document.getElementById("editMessage").value = meeting.message
  document.getElementById("editMeetingModal").classList.add("show")
}

function closeEditMeeting() {
  document.getElementById("editMeetingModal").classList.remove("show")
}

async function updateMeeting(event) {
  event.preventDefault()
  const meeting = mockMeetingDetails[currentMeetingId]
  meeting.date = document.getElementById("editDate").value
  meeting.time = document.getElementById("editTime").value
  meeting.place = document.getElementById("editPlace").value
  meeting.message = document.getElementById("editMessage").value

  // In a real app, you'd send this to the backend
  showLoading()
  await new Promise((resolve) => setTimeout(resolve, 1000))
  alert("Зміни збережено!")
  closeEditMeeting()
  loadMeetingDetails(currentMeetingId) // Reload details to reflect changes
  hideLoading()
}

function goBack() {
  window.history.back()
}
