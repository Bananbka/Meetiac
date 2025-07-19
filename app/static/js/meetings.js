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
    this.setMinDate()
  }

  setupEventListeners() {
    // Close modal when clicking outside
    document.addEventListener("click", (e) => {
      const modal = document.getElementById("addMeetingModal")
      if (e.target === modal) {
        this.closeAddMeeting()
      }
    })
  }

  setMinDate() {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const dateInput = document.getElementById("meetingDate")
    dateInput.min = tomorrow.toISOString().split("T")[0]
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
      this.populatePersonSelect()
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
            { id: 1, name: "Анна Коваленко", photo: "/placeholder.svg?height=50&width=50&text=Anna" },
            { id: 2, name: "Марія Петренко", photo: "/placeholder.svg?height=50&width=50&text=Maria" },
            { id: 3, name: "Олена Сидоренко", photo: "/placeholder.svg?height=50&width=50&text=Olena" },
            { id: 4, name: "Катерина Іваненко", photo: "/placeholder.svg?height=50&width=50&text=Kate" },
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
        place: 'Кафе "Львівська майстерня кави"',
        address: "вул. Хрещатик, 15, Київ",
        message: "Буду чекати біля входу. Одягнена в червону куртку 😊",
        status: "confirmed",
        type: "upcoming",
        createdBy: "me",
      },
      {
        id: 2,
        personId: 2,
        personName: "Марія Петренко",
        personPhoto: "/placeholder.svg?height=50&width=50&text=Maria",
        date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // In 3 days
        time: "18:30",
        place: 'Ресторан "Канапа"',
        address: "вул. Володимирська, 9, Київ",
        message: null,
        status: "pending",
        type: "pending",
        createdBy: "them",
      },
      {
        id: 3,
        personId: 3,
        personName: "Олена Сидоренко",
        personPhoto: "/placeholder.svg?height=50&width=50&text=Olena",
        date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        time: "20:00",
        place: 'Кінотеатр "Київ"',
        address: "вул. Велика Васильківська, 19, Київ",
        message: "Дякую за чудовий вечір!",
        status: "completed",
        type: "past",
        createdBy: "me",
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
        status: "pending",
        type: "pending",
        createdBy: "me",
      },
    ]

    return { meetings }
  }

  populatePersonSelect() {
    const select = document.getElementById("meetingPerson")
    select.innerHTML = '<option value="">Оберіть особу</option>'

    this.matches.forEach((match) => {
      const option = document.createElement("option")
      option.value = match.id
      option.textContent = match.name
      select.appendChild(option)
    })
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

    const statusText = {
      confirmed: "Підтверджено",
      pending: "Очікує",
      completed: "Завершено",
      cancelled: "Скасовано",
    }

    card.innerHTML = `
            <div class="meeting-header">
                <div class="meeting-avatar" style="background-image: url(${meeting.personPhoto})"></div>
                <div class="meeting-info">
                    <div class="meeting-name">${meeting.personName}</div>
                    <div class="meeting-status ${meeting.status}">${statusText[meeting.status]}</div>
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
                <div class="meeting-detail">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${meeting.place}</span>
                </div>
                ${
                  meeting.address
                    ? `
                    <div class="meeting-detail">
                        <i class="fas fa-location-arrow"></i>
                        <span>${meeting.address}</span>
                    </div>
                `
                    : ""
                }
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
      case "pending":
        if (meeting.createdBy === "them") {
          return `
                        <button class="action-btn-small accept" onclick="event.stopPropagation(); acceptMeeting(${meeting.id})">
                            <i class="fas fa-check"></i> Прийняти
                        </button>
                        <button class="action-btn-small decline" onclick="event.stopPropagation(); declineMeeting(${meeting.id})">
                            <i class="fas fa-times"></i> Відхилити
                        </button>
                    `
        } else {
          return `
                        <button class="action-btn-small cancel" onclick="event.stopPropagation(); cancelMeeting(${meeting.id})">
                            <i class="fas fa-times"></i> Скасувати
                        </button>
                    `
        }
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
    const past = this.meetings.filter((m) => m.type === "past").length
    const pending = this.meetings.filter((m) => m.type === "pending").length

    document.getElementById("upcomingBadge").textContent = upcoming
    document.getElementById("pastBadge").textContent = past
    document.getElementById("pendingBadge").textContent = pending
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

  async submitMeeting(event) {
    event.preventDefault()

    const formData = new FormData(event.target)
    const meetingData = {
      personId: document.getElementById("meetingPerson").value,
      date: document.getElementById("meetingDate").value,
      time: document.getElementById("meetingTime").value,
      place: document.getElementById("meetingPlace").value,
      message: document.getElementById("meetingMessage").value,
    }

    try {
      // Simulate API call
      await this.delay(500)

      this.showNotification("Запрошення відправлено! 📅")
      this.closeAddMeeting()

      // Reload meetings
      this.loadMeetings()
    } catch (error) {
      console.error("Error submitting meeting:", error)
      this.showError("Помилка відправки запрошення")
    }
  }

  async acceptMeeting(meetingId) {
    try {
      await this.delay(300)

      // Update meeting status
      const meeting = this.meetings.find((m) => m.id === meetingId)
      if (meeting) {
        meeting.status = "confirmed"
        meeting.type = "upcoming"
      }

      this.renderCurrentTab()
      this.updateBadges()
      this.showNotification("Зустріч підтверджено! ✅")
    } catch (error) {
      console.error("Error accepting meeting:", error)
      this.showError("Помилка підтвердження зустрічі")
    }
  }

  async declineMeeting(meetingId) {
    if (!confirm("Ви впевнені, що хочете відхилити цю зустріч?")) {
      return
    }

    try {
      await this.delay(300)

      // Remove meeting
      this.meetings = this.meetings.filter((m) => m.id !== meetingId)

      this.renderCurrentTab()
      this.updateBadges()
      this.showNotification("Зустріч відхилено")
    } catch (error) {
      console.error("Error declining meeting:", error)
      this.showError("Помилка відхилення зустрічі")
    }
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
        meeting.type = "past"
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

  showNotification(message) {
    const notification = document.createElement("div")
    notification.className = "notification"
    notification.textContent = message
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #4CAF50;
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

function showAddMeeting() {
  meetingsManager.showAddMeeting()
}

function closeAddMeeting() {
  meetingsManager.closeAddMeeting()
}

function submitMeeting(event) {
  meetingsManager.submitMeeting(event)
}

function acceptMeeting(meetingId) {
  meetingsManager.acceptMeeting(meetingId)
}

function declineMeeting(meetingId) {
  meetingsManager.declineMeeting(meetingId)
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
