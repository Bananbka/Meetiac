class MeetingsManager {
    constructor() {
        this.currentTab = "upcoming"
        this.isCalendarView = false
        this.currentDate = new Date()
        this.meetings = []
        this.matches = []

        this.init()
    }

    init() {
        this.loadMeetings()
        this.loadMatches()
        this.setupEventListeners()
    }

    setupEventListeners() {

    }

    async loadMeetings() {
        this.showLoading(true)

        try {
            const data = await this.fetchMeetings()
            this.meetings = data.meetings
            this.renderCurrentTab()
            this.updateBadges()
        } catch (error) {
            console.error("Error loading meetings:", error)
            this.showError("Помилка завантаження зустрічей")
        } finally {
            this.showLoading(false)
        }
    }

    async loadMatches() {
        try {
            const data = await this.fetchMatches()
            this.matches = data.matches
        } catch (error) {
            console.error("Error loading matches:", error)
        }
    }

    async fetchMeetings() {
        // Simulate API call - replace with actual API endpoint
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockData = this.generateMockMeetings()
                resolve(mockData)
            }, 500)
        })
    }

    async fetchMatches() {
        // Simulate API call - replace with actual API endpoint
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    matches: [
                        {id: 1, name: "Анна Коваленко", photo: "/placeholder.svg?height=50&width=50&text=Anna"},
                        {id: 2, name: "Марія Петренко", photo: "/placeholder.svg?height=50&width=50&text=Maria"},
                        {id: 3, name: "Олена Сидоренко", photo: "/placeholder.svg?height=50&width=50&text=Olena"},
                        {id: 4, name: "Катерина Іваненко", photo: "/placeholder.svg?height=50&width=50&text=Kate"},
                    ],
                })
            }, 300)
        })
    }

    generateMockMeetings() {
        const now = new Date()
        const meetings = [
            {
                id: 1,
                personId: 1,
                personName: "Анна Коваленко",
                personPhoto: "/placeholder.svg?height=50&width=50&text=Anna",
                date: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
                time: "19:00",
                message: "Буду чекати біля входу. Одягнена в червону куртку 😊",
                createdBy: "me",
                type: "upcoming"
            },
            {
                id: 2,
                personId: 2,
                personName: "Марія Петренко",
                personPhoto: "/placeholder.svg?height=50&width=50&text=Maria",
                date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // In 3 days
                time: "18:30",
                message: null,
                createdBy: "them",
                type: "upcoming"
            },
            {
                id: 3,
                personId: 3,
                personName: "Олена Сидоренко",
                personPhoto: "/placeholder.svg?height=50&width=50&text=Olena",
                date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                time: "20:00",
                message: "Дякую за чудовий вечір!",
                createdBy: "me",
                type: "upcoming"
            },
            {
                id: 4,
                personId: 4,
                personName: "Катерина Іваненко",
                personPhoto: "/placeholder.svg?height=50&width=50&text=Kate",
                date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // In a week
                time: "17:00",
                place: "Парк Шевченка",
                address: "Парк імені Тараса Шевченка, Київ",
                message: "Прогулянка парком буде чудовою!",
                createdBy: "me",
                type: "upcoming"
            },
        ]

        return {meetings}
    }


    renderCurrentTab() {
        const filteredMeetings = this.meetings.filter((meeting) => meeting.type === this.currentTab)
        const tabContent = document.getElementById(`${this.currentTab}Tab`)
        const meetingsList = tabContent.querySelector(".meetings-list")
        const emptyState = tabContent.querySelector(".empty-state")

        meetingsList.innerHTML = ""

        if (filteredMeetings.length === 0) {
            meetingsList.style.display = "none"
            emptyState.style.display = "block"
        } else {
            meetingsList.style.display = "flex"
            emptyState.style.display = "none"

            filteredMeetings.forEach((meeting) => {
                const meetingCard = this.createMeetingCard(meeting)
                meetingsList.appendChild(meetingCard)
            })
        }
    }

    createMeetingCard(meeting) {
        const card = document.createElement("div")
        card.className = `meeting-card ${meeting.status}`
        card.onclick = () => this.viewMeetingDetails(meeting.id)

        const dateStr = meeting.date.toLocaleDateString("uk-UA", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })

        card.innerHTML = `
            <div class="meeting-header">
                <div class="meeting-avatar" style="background-image: url(${meeting.personPhoto})"></div>
                <div class="meeting-info">
                    <div class="meeting-name">${meeting.personName}</div>
                </div>
            </div>
            
            <div class="meeting-details">
                <div class="meeting-detail">
                    <i class="fas fa-calendar"></i>
                    <span>${dateStr}</span>
                </div>
                <div class="meeting-detail">
                    <i class="fas fa-clock"></i>
                    <span>${meeting.time}</span>
                </div>
                
            </div>
            
            ${
            meeting.message
                ? `
                <div class="meeting-message">
                    "${meeting.message}"
                </div>
            `
                : ""
        }
            
            <div class="meeting-actions">
                ${this.getMeetingActions(meeting)}
            </div>
        `

        return card
    }

    getMeetingActions(meeting) {
        switch (meeting.status) {
            case "confirmed":
                return `
                    <button class="action-btn-small view" onclick="event.stopPropagation(); viewMeetingDetails(${meeting.id})">
                        <i class="fas fa-eye"></i> Деталі
                    </button>
                    <button class="action-btn-small cancel" onclick="event.stopPropagation(); cancelMeeting(${meeting.id})">
                        <i class="fas fa-times"></i> Скасувати
                    </button>
                `
            default:
                return `
                    <button class="action-btn-small view" onclick="event.stopPropagation(); viewMeetingDetails(${meeting.id})">
                        <i class="fas fa-eye"></i> Переглянути
                    </button>
                `
        }
    }

    updateBadges() {
        const upcoming = this.meetings.filter((m) => m.type === "upcoming").length
        const archive = this.meetings.filter((m) => m.type === "archive").length

        document.getElementById("upcomingBadge").textContent = upcoming
        document.getElementById("archiveBadge").textContent = archive
    }

    switchTab(tab) {
        // Update active tab
        document.querySelectorAll(".tab-btn").forEach((btn) => {
            btn.classList.remove("active")
        })
        document.querySelector(`[data-tab="${tab}"]`).classList.add("active")

        // Update active content
        document.querySelectorAll(".tab-content").forEach((content) => {
            content.classList.remove("active")
        })
        document.getElementById(`${tab}Tab`).classList.add("active")

        this.currentTab = tab
        this.renderCurrentTab()
    }

    toggleCalendarView() {
        const calendarView = document.getElementById("calendarView")
        this.isCalendarView = !this.isCalendarView

        if (this.isCalendarView) {
            calendarView.style.display = "block"
            this.renderCalendar()
        } else {
            calendarView.style.display = "none"
        }
    }

    renderCalendar() {
        const calendarGrid = document.getElementById("calendarGrid")
        const calendarMonth = document.getElementById("calendarMonth")

        const year = this.currentDate.getFullYear()
        const month = this.currentDate.getMonth()

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

        // Clear calendar
        calendarGrid.innerHTML = ""

        // Add day headers
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

        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()
        const startingDayOfWeek = (firstDay.getDay() + 6) % 7 // Convert to Monday = 0

        // Add empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            const emptyDay = document.createElement("div")
            emptyDay.className = "calendar-day"
            emptyDay.style.background = "#f8f9fa"
            calendarGrid.appendChild(emptyDay)
        }

        // Add days of month
        const today = new Date()
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement("div")
            dayElement.className = "calendar-day"
            dayElement.textContent = day

            const currentDate = new Date(year, month, day)

            // Check if today
            if (currentDate.toDateString() === today.toDateString()) {
                dayElement.classList.add("today")
            }

            // Check if has meetings
            const hasMeeting = this.meetings.some((meeting) => {
                const meetingDate = new Date(meeting.date)
                return meetingDate.toDateString() === currentDate.toDateString()
            })

            if (hasMeeting) {
                dayElement.classList.add("has-meeting")
            }

            dayElement.onclick = () => this.selectCalendarDay(currentDate)
            calendarGrid.appendChild(dayElement)
        }
    }

    selectCalendarDay(date) {
        const dayMeetings = this.meetings.filter((meeting) => {
            const meetingDate = new Date(meeting.date)
            return meetingDate.toDateString() === date.toDateString()
        })

        if (dayMeetings.length > 0) {
            // Show meetings for this day
            console.log("Meetings for", date, dayMeetings)
        }
    }

    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1)
        this.renderCalendar()
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1)
        this.renderCalendar()
    }

    showAddMeeting() {
        const modal = document.getElementById("addMeetingModal")
        modal.classList.add("show")
    }

    closeAddMeeting() {
        const modal = document.getElementById("addMeetingModal")
        modal.classList.remove("show")

        // Reset form
        document.querySelector(".meeting-form").reset()
    }

    async cancelMeeting(meetingId) {
        if (!confirm("Ви впевнені, що хочете скасувати цю зустріч?")) {
            return
        }

        try {
            await this.delay(300)

            // Update meeting status
            const meeting = this.meetings.find((m) => m.id === meetingId)
            if (meeting) {
                meeting.status = "cancelled"
                meeting.type = "archive"
            }

            this.renderCurrentTab()
            this.updateBadges()
            this.showNotification("Зустріч скасовано")
        } catch (error) {
            console.error("Error cancelling meeting:", error)
            this.showError("Помилка скасування зустрічі")
        }
    }

    viewMeetingDetails(meetingId) {
        window.location.href = `date-details.html?id=${meetingId}`
    }

    goToMatches() {
        window.location.href = "matches.html"
    }

    goBack() {
        if (window.history.length > 1) {
            window.history.back()
        } else {
            window.location.href = "index.html"
        }
    }

    showLoading(show) {
        const loadingOverlay = document.getElementById("loadingOverlay")

        if (show) {
            loadingOverlay.style.display = "flex"
        } else {
            loadingOverlay.style.display = "none"
        }
    }

    showError(message) {
        const notification = document.createElement("div")
        notification.className = "notification error"
        notification.textContent = message
        notification.style.cssText = `
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
        `

        document.body.appendChild(notification)

        setTimeout(() => {
            notification.remove()
        }, 3000)
    }

    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
}

// Global functions for HTML onclick events
function switchTab(tab) {
    meetingsManager.switchTab(tab)
}

function toggleCalendarView() {
    meetingsManager.toggleCalendarView()
}

function previousMonth() {
    meetingsManager.previousMonth()
}

function nextMonth() {
    meetingsManager.nextMonth()
}

function cancelMeeting(meetingId) {
    meetingsManager.cancelMeeting(meetingId)
}

function viewMeetingDetails(meetingId) {
    meetingsManager.viewMeetingDetails(meetingId)
}

function goBack() {
    meetingsManager.goBack()
}

function goToMatches() {
    meetingsManager.goToMatches()
}

// Initialize when DOM is loaded
let meetingsManager
document.addEventListener("DOMContentLoaded", () => {
    meetingsManager = new MeetingsManager()
})
