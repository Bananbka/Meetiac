// Mock data for demonstration
let meeting = {};

let currentMeetingId = null
let map = null
let mapMarker = null
let countdownInterval = null

// Declare L variable before using it
const L = window.L

document.addEventListener("DOMContentLoaded", async () => {
    const currentMeetingId = getMeetingId();

    if (currentMeetingId) {
        await loadMeetingDetails(currentMeetingId);
        map.invalidateSize()
        document.getElementById("submit-comment").addEventListener("click", submitComment)
    } else {
        alert("Ідентифікатор зустрічі не знайдено.");
        goBack();
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


async function fetchMeeting(id) {
    const resp = await fetch(`/api/meeting/${id}`)

    if (!resp.ok) {
        showNotification("Помилка завантаження зустрічі.", "error")
    }

    return await resp.json()
}

async function loadMeetingDetails(meetingId) {
    showLoading()

    meeting = await fetchMeeting(meetingId)
    if (!meeting) {
        showNotification("Зустріч не знайдена!")
        goBack()
        return
    }


    // Учасник
    const partner = meeting.meet_user
    document.getElementById("partnerAvatar").src = `/${partner.images[0]}` || "/static/uploads/blank.jpg"
    document.getElementById("partnerAvatar").alt = partner.name
    document.getElementById("partnerName").textContent = partner.name

    document.getElementById("userAvatar").src = `/${meeting.req_user.images[0]}` || "/static/uploads/blank.jpg"
    document.getElementById("userAvatar").alt = partner.name
    document.getElementById("userName").textContent = meeting.req_user.name


    // Дата й час
    const dateObj = new Date(meeting.meeting_date)
    document.getElementById("meetingDate").textContent = dateObj.toLocaleDateString("uk-UA", {
        year: "numeric", month: "long", day: "numeric"
    })
    document.getElementById("meetingTime").textContent = dateObj.toLocaleTimeString("uk-UA", {
        hour: "2-digit", minute: "2-digit"
    })

    // Локація
    const [lat, lng] = meeting.location.split(" ").map(parseFloat)

    // Повідомлення
    const meetMessage = meeting.meet_comment
    const reqMessage = meeting.req_comment
    const meetMessageContent = document.getElementById("meetMessageContent")
    const reqMessageContent = document.getElementById("reqMessageContent")

    meetMessageContent.innerHTML = meetMessage ? meetMessage : "*<i>Ваша пара поки не залишила коментаря...</i>*"
    reqMessageContent.innerHTML = reqMessage ? reqMessage : "*<i>Ви ще не залишили коментаря...</i>*"



    // Мапа
    if (map) {
        map.remove()
    }
    map = L.map("map").setView([lat, lng], 13)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)
    mapMarker = L.marker([lat, lng]).addTo(map).bindPopup("Місце зустрічі").openPopup()
    map.on("load", () => {
        document.getElementById("mapOverlay").style.display = "none"
    })
    setTimeout(() => {
        if (document.getElementById("mapOverlay").style.display !== "none") {
            document.getElementById("mapOverlay").style.display = "none"
        }
    }, 2000)

    // Погода
    loadWeather([lat, lng])

    // Кнопки дій (немає статусу, тому ховаємо)
    renderMeetingActions(null)

    // Таймер
    startCountdown(dateObj.toISOString())

    // Кнопка редагування схована
    document.getElementById("editBtn").style.display = "none"

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

function startCountdown(meetingDateString) {
    if (countdownInterval) {
        clearInterval(countdownInterval)
    }

    const targetDateTime = new Date(meetingDateString)

    const updateCountdown = () => {
        const now = new Date()
        const difference = targetDateTime.getTime() - now.getTime()

        if (difference <= 0) {
            clearInterval(countdownInterval)
            document.getElementById("countdown").innerHTML =
                '<div class="countdown-item"><span class="countdown-number">0</span><span class="countdown-label">днів</span></div><div class="countdown-item"><span class="countdown-number">0</span><span class="countdown-label">годин</span></div><div class="countdown-item"><span class="countdown-number">0</span><span class="countdown-label">хвилин</span></div>'
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
    countdownInterval = setInterval(updateCountdown, 60000)
}

async function fetchWeather(lat, lng) {
    const resp = await fetch(`/api/weather?lat=${lat}&lon=${lng}`)

    if (!resp.ok) {
        showNotification("Помилка завантаження погоди...", "error")
        return
    }

    return await resp.json()
}

async function loadWeather(coordinates) {
    const weatherInfo = document.getElementById("weatherInfo")
    weatherInfo.innerHTML = `
        <div class="weather-loading">
            <div class="loading-spinner"></div>
            <p>Завантаження прогнозу...</p>
        </div>
    `

    const weather = await fetchWeather(coordinates[0], coordinates[1])

    if (!weather) return

    const temp = `${Math.round(weather.main.temp)}°C`
    const description = weather.weather[0].description
    const iconCode = weather.weather[0].icon
    const humidity = `${weather.main.humidity}%`
    const wind = `${weather.wind.speed} м/с`

    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`

    weatherInfo.innerHTML = `
        <div class="weather-current">
            <img src="${iconUrl}" alt="${description}" class="weather-icon" />
            <div class="weather-details">
                <div class="weather-temp">${temp}</div>
                <div class="weather-desc">${description}</div>
            </div>
        </div>
        <div class="weather-extra">
            <span>Вологість: ${humidity}</span>
            <span>Вітер: ${wind}</span>
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
    if (meeting && meeting.location) {
        const [lat, lon] = meeting.location.split(" ").map(Number)

        if (!isNaN(lat) && !isNaN(lon)) {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`
            window.open(url, "_blank")
        } else {
            alert("Неправильний формат координат.")
        }
    } else {
        alert("Координати місця не доступні.")
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

async function submitComment() {
    const comment = document.getElementById("comment-input").value

    if (comment.trim() === "") {
        showNotification("Коментар не може бути пустим!", "info")
    }

    const meetingId = getMeetingId();
    const resp = await fetch(`/api/meeting/comment/${meetingId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "comment": comment,
        })
    })

    if (!resp.ok) {
        showNotification("Помилка під час надсилання коментаря.", "error")
        return
    }

    document.getElementById("reqMessageContent").innerText = comment;
    showNotification("Коментар залишено!")
}


function getMeetingId() {
    const pathParts = window.location.pathname.split("/");
    return pathParts[pathParts.length - 1];
}