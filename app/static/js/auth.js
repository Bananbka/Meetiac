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

            tabTriggers.forEach((t) => t.classList.remove("active"))
            tabContents.forEach((c) => c.classList.remove("active"))

            this.classList.add("active")
            document.getElementById(targetTab).classList.add("active")
        })
    })

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

            // ВАЖЛИВО: Перевірка віку для форми реєстрації
            if (formId === "register") {
                const birthdateValue = payload["birthdate"]
                if (!isAdult(birthdateValue)) {
                    showNotification("Вам має бути не менше 18 років для реєстрації", "error")
                    const birthdateInput = form.querySelector("#birthdate")
                    birthdateInput.style.borderColor = "#ef4444"
                    return
                }
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

    addRippleEffect()
}

// Функція перевірки 18 років+
export function isAdult(dateString) {
    if (!dateString) return false
    const today = new Date()
    const birthDate = new Date(dateString)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }
    // return true;
    return age >= 18 // ПОТІМ ЗАМІНИТИ НА НОРМ

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
