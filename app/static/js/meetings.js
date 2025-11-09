import {goToDiscover, showNotification} from "./common.js";

let currentTab = "upcoming";
let isCalendarView = false;
let currentDate = new Date();
let meetings = [];
let pagination = {};

function initMeetingsPage() {
    loadMeetings();
    setupButtons();
}

function setupButtons() {
    const toDiscoverButton = document.getElementById("to-discover-btn");
    toDiscoverButton.addEventListener("click", goToDiscover);

    const switchToUpcomingButton = document.getElementById("switch-to-upcoming-btn");
    switchToUpcomingButton.addEventListener("click", ()=>{switchTab("upcoming")});

    const switchToArchiveButton = document.getElementById("switch-to-archive-btn");
    switchToArchiveButton.addEventListener("click", ()=>{switchTab("archive")});

    const toggleCalendarButton = document.getElementById("toggle-calendar-btn");
    toggleCalendarButton.addEventListener("click", toggleCalendarView);

    const prevMonthButton = document.getElementById("prev-month-btn");
    prevMonthButton.addEventListener("click", previousMonth)

    const nextMonthButton = document.getElementById("next-month-btn");
    nextMonthButton.addEventListener("click", nextMonth)

    const loadMoreBtn = document.getElementById("loadMoreBtn");
    loadMoreBtn.addEventListener("click", loadMore);

    const toMatchesButton = document.getElementById("to-matches-btn");
    toMatchesButton.addEventListener("click", goToMatches)

}

let currentPage = 1;
let isLoading = false;

async function loadMeetings(page = 1) {
    if (isLoading) return;
    isLoading = true;
    showLoading(true);

    try {
        const data = await fetchMeetings(page);

        if (page === 1) {
            meetings = data.meetings;
        } else {
            meetings = [...meetings, ...data.meetings];
        }

        pagination = data.pagination;
        currentPage = page;

        renderCurrentTab();
        updateBadges();
        renderPagination();
        updateLoadMoreButton();
    } catch (error) {
        console.error("Error loading meetings:", error);
        showError("Помилка завантаження зустрічей");
    } finally {
        showLoading(false);
        isLoading = false;
    }
}

async function fetchMeetings(page = 1) {
    const resp = await fetch(`/api/meeting/meetings?page=${page}`);
    if (!resp.ok) {
        showNotification("Помилка при отриманні зустрічей!", "danger");
        return {meetings: [], pagination: {}};
    }
    return await resp.json();
}

function renderPagination() {
    const container = document.getElementById("paginationContainer");
    if (!container || !pagination.pages) return;

    container.innerHTML = "";
    for (let i = 1; i <= pagination.pages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = `pagination-btn ${i === pagination.page ? "active" : ""}`;
        btn.onclick = () => loadMeetings(i);
        container.appendChild(btn);
    }
}

function renderCurrentTab() {
    const filtered = meetings.filter(m => getMeetingType(m) === currentTab);
    const tabEl = document.getElementById(`${currentTab}Tab`);
    const listEl = tabEl.querySelector(".meetings-list");
    const emptyEl = tabEl.querySelector(".empty-state");

    listEl.innerHTML = "";
    if (filtered.length === 0) {
        listEl.style.display = "none";
        emptyEl.style.display = "block";
    } else {
        listEl.style.display = "flex";
        emptyEl.style.display = "none";
        filtered.forEach(m => listEl.appendChild(createMeetingCard(m)));
    }
}

function getMeetingType(meeting) {
    const date = new Date(meeting.meeting_date);
    const now = new Date();

    const isDateValid = date > now;
    let isArchived = meeting.archived;

    if (!isArchived && !isDateValid) {
        isArchived = true;
        meeting.archived = isArchived;
        sendMeetingToArchive(meeting.meeting_id);
    }

    return !isArchived && isDateValid ? "upcoming" : "archive";
}

async function sendMeetingToArchive(id) {
    const resp = await fetch(`/api/meeting/archive/${id}`, {method: "PATCH"});
    if (!resp.ok) {
        showNotification("Помилка!", "danger")
    }
}

function createMeetingCard(meeting) {
    const card = document.createElement("div");
    card.className = "meeting-card";
    card.onclick = () => viewMeetingDetails(meeting.meeting_id);

    const name = meeting.meet_user.name;
    const photo = meeting.meet_user.images[0] || "/placeholder.svg";
    const dateStr = new Date(meeting.meeting_date).toLocaleDateString("uk-UA", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    card.innerHTML = `
        <div class="meeting-header">
            <div class="meeting-avatar" style="background-image: url('${photo}')"></div>
            <div class="meeting-info">
                <div class="meeting-name">${name}</div>
            </div>
        </div>
        <div class="meeting-details">
            <div class="meeting-detail"><i class="fas fa-calendar"></i> <span>${dateStr}</span></div>
            <div class="meeting-detail"><i class="fas fa-clock"></i> <span>${new Date(meeting.meeting_date).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    })}</span></div>
        </div>
        <div class="meeting-actions">
            <button class="action-btn-small view" onclick="event.stopPropagation(); viewMeetingDetails(${meeting.meeting_id})">
                <i class="fas fa-eye"></i> Переглянути
            </button>
        </div>
    `;

    return card;
}

function updateBadges() {
    const upcomingCount = meetings.filter(m => getMeetingType(m) === "upcoming").length;
    const archiveCount = meetings.filter(m => getMeetingType(m) === "archive").length;

    document.getElementById("upcomingBadge").textContent = upcomingCount;
    document.getElementById("archiveBadge").textContent = archiveCount;
}

function switchTab(tab) {
    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelector(`[data-tab="${tab}"]`).classList.add("active");

    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    document.getElementById(`${tab}Tab`).classList.add("active");

    currentTab = tab;
    renderCurrentTab();
}

function viewMeetingDetails(id) {
    window.location.href = `meeting/${id}`;
}

function showLoading(show) {
    const overlay = document.getElementById("loadingOverlay");
    overlay.style.display = show ? "flex" : "none";
}

function showError(message) {
    const el = document.createElement("div");
    el.className = "notification error";
    el.textContent = message;
    el.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #f44336;
        color: white;
        padding: 1rem 2rem;
        border-radius: 25px;
        z-index: 3000;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
}

function updateLoadMoreButton() {
    const loadMoreContainer = document.getElementById("loadMoreContainer");
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    const loadMoreText = loadMoreBtn.querySelector(".load-more-text");

    loadMoreContainer.style.display = "flex";

    if (!pagination.has_next) {
        loadMoreBtn.disabled = true;
        loadMoreText.textContent = "Це все!";
    } else {
        loadMoreBtn.disabled = false;
        loadMoreText.textContent = "Завантажити ще";
    }
}

async function loadMore() {
    if (!pagination.has_next) return;

    const loadMoreBtn = document.getElementById("loadMoreBtn");
    const loadMoreText = loadMoreBtn.querySelector(".load-more-text");
    const loadMoreSpinner = loadMoreBtn.querySelector(".load-more-spinner");

    loadMoreBtn.disabled = true;
    loadMoreText.style.display = "none";
    loadMoreSpinner.style.display = "block";

    await loadMeetings(currentPage + 1);

    loadMoreText.style.display = "block";
    loadMoreSpinner.style.display = "none";
}


function toggleCalendarView() {
    const calendarView = document.getElementById("calendarView")
    isCalendarView = !isCalendarView

    if (isCalendarView) {
        calendarView.style.display = "block"
        renderCalendar()
    } else {
        calendarView.style.display = "none"
    }
}

function renderCalendar() {
    const calendarGrid = document.getElementById("calendarGrid")
    const calendarMonth = document.getElementById("calendarMonth")

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const monthNames = [
        "Січень",
        "Лютий",
        "Березень",
        "Квітень",
        "Травень",
        "Червень",
        "Липень",
        "Серпень",
        "Вересень",
        "Жовтень",
        "Листопад",
        "Грудень",
    ]

    calendarMonth.textContent = `${monthNames[month]} ${year}`

    calendarGrid.innerHTML = ""

    const dayHeaders = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"]
    dayHeaders.forEach((day) => {
        const dayHeader = document.createElement("div")
        dayHeader.className = "calendar-day-header"
        dayHeader.textContent = day
        dayHeader.style.cssText = `
                background: #f8f9fa;
                padding: 0.5rem;
                text-align: center;
                font-weight: 600;
                font-size: 0.8rem;
                color: #666;
            `
        calendarGrid.appendChild(dayHeader)
    })

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7

    for (let i = 0; i < startingDayOfWeek; i++) {
        const emptyDay = document.createElement("div")
        emptyDay.className = "calendar-day"
        emptyDay.style.background = "#f8f9fa"
        calendarGrid.appendChild(emptyDay)
    }

    const today = new Date()
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement("div")
        dayElement.className = "calendar-day"
        dayElement.textContent = day

        const currentDate = new Date(year, month, day)

        if (currentDate.toDateString() === today.toDateString()) {
            dayElement.classList.add("today")
        }

        const hasMeeting = meetings.some((meeting) => {
            const meetingDate = new Date(meeting.date)
            return meetingDate.toDateString() === currentDate.toDateString()
        })

        if (hasMeeting) {
            dayElement.classList.add("has-meeting")
        }

        dayElement.onclick = () => selectCalendarDay(currentDate)
        calendarGrid.appendChild(dayElement)
    }
}

function selectCalendarDay(date) {
    const dayMeetings = meetings.filter((meeting) => {
        const meetingDate = new Date(meeting.date)
        return meetingDate.toDateString() === date.toDateString()
    })

    if (dayMeetings.length > 0) {
        console.log("Meetings for", date, dayMeetings)
    }
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1)
    renderCalendar()
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1)
    renderCalendar()
}

document.addEventListener("DOMContentLoaded", initMeetingsPage);


function goBack() {
    if (window.history.length > 1) {
        window.history.back()
    } else {
        window.location.href = "index.html"
    }
}

function goToMatches() {
    window.location.href = "/matches";
}