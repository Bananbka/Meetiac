// Auth page functionality
document.addEventListener("DOMContentLoaded", () => {
    initAuthPage()
})

function initAuthPage() {
    const tabTriggers = document.querySelectorAll(".tab-trigger")
    const tabContents = document.querySelectorAll(".tab-content")

    tabTriggers.forEach((trigger) => {
        trigger.addEventListener("click", function () {
            const targetTab = this.getAttribute("data-tab")

            // Remove active class from all triggers and contents
            tabTriggers.forEach((t) => t.classList.remove("active"))
            tabContents.forEach((c) => c.classList.remove("active"))

            // Add active class to clicked trigger and corresponding content
            this.classList.add("active")
            document.getElementById(targetTab).classList.add("active")
        })
    })

    // Form submissions
    document.querySelectorAll(".auth-form").forEach((form) => {
        form.addEventListener("submit", async function (e) {
            e.preventDefault()

            const formId = form.closest(".tab-content").id
            const inputs = form.querySelectorAll("input[required], select[required]")
            let isValid = true
            const payload = {}

            inputs.forEach((input) => {
                if (!input.value.trim()) {
                    isValid = false
                    input.style.borderColor = "#ef4444"
                } else {
                    input.style.borderColor = "rgba(236, 72, 153, 0.5)"
                    payload[input.id] = input.value.trim()
                }
            })

            if (!isValid) {
                showNotification("Будь ласка, заповніть всі поля", "error")
                return
            }

            try {
                const endpoint = formId === "login" ? "/api/auth/login" : "/api/auth/register"
                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(payload)
                })

                const result = await response.json()
                if (response.ok) {
                    showNotification(result.message, "success")
                    setTimeout(() => {
                        window.location.href = "/discover"
                    }, 1000)
                } else {
                    showNotification(result.message, "error")
                }
            } catch (err) {
                showNotification("Сталася помилка", "error")
            }
        })
    })

    // Add ripple effect to buttons
    addRippleEffect()
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

function addRippleEffect() {
    document.querySelectorAll(".btn").forEach((button) => {
        button.addEventListener("click", function (e) {
            const ripple = document.createElement("span")
            const rect = this.getBoundingClientRect()
            const size = Math.max(rect.width, rect.height)
            const x = e.clientX - rect.left - size / 2
            const y = e.clientY - rect.top - size / 2

            ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `

            this.style.position = "relative"
            this.style.overflow = "hidden"
            this.appendChild(ripple)

            setTimeout(() => {
                ripple.remove()
            }, 600)
        })
    })
}
