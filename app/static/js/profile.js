import {showNotification, hideLogoutModal, showLogoutModal, confirmLogout} from "./common.js"
import {isAdult} from "./auth.js";

// Profile page functionality
let selectedInterests = []
let selectedPrefInterests = []
let currentPhotoSlot = 0
const uploadedPhotos = [
    null,
    null,
    null,
]

// Available interests
let availableInterests = []

document.addEventListener("DOMContentLoaded", async () => {
    await initProfilePage()
})

async function initProfilePage() {
    setupFormHandlers()
    setupDeleteAccountModal()
    setupBioCounter()
    setupFormValidation()
    setupLogoutModal()
    await setupProfileData();
    await setupPreferencesData();
    setupButtons();
}

function setupButtons() {
    const confirmLogoutBtn = document.getElementById("confirmLogoutBtn")
    confirmLogoutBtn.addEventListener("click", confirmLogout)

    const hideLogoutBtn = document.getElementById("hideLogoutBtn")
    hideLogoutBtn.addEventListener("click", hideLogoutModal)

    const showLogoutBtn = document.getElementById("showLogoutBtn")
    showLogoutBtn.addEventListener("click", showLogoutModal)
}

async function setupInterestsGrid() {
    const interestsGrid = document.getElementById("interestsGrid")
    if (!interestsGrid) return

    interestsGrid.innerHTML = ""

    availableInterests = await getInterests()

    availableInterests.forEach((interest) => {
        const item = document.createElement("div")
        item.className = "interest-item"
        item.textContent = interest

        if (selectedInterests.includes(interest)) {
            item.classList.add("selected")
        }

        item.addEventListener("click", function () {
            toggleInterest(selectedInterests, interest, this)
        })

        interestsGrid.appendChild(item)
    })
}

async function setupPrefInterestsGrid() {
    const interestsGrid = document.getElementById("interestsPrefGrid")
    if (!interestsGrid) return

    interestsGrid.innerHTML = ""

    availableInterests = await getInterests()

    availableInterests.forEach((interest) => {
        const item = document.createElement("div")
        item.className = "interest-item"
        item.textContent = interest

        if (selectedPrefInterests.includes(interest)) {
            item.classList.add("selected")
        }

        item.addEventListener("click", function () {
            toggleInterest(selectedPrefInterests, interest, this)
        })

        interestsGrid.appendChild(item)
    })
}

async function getInterests() {
    const response = await fetch("/api/profile/interests", {method: "GET"})
    if (!response.ok) return []
    return await response.json()
}

function toggleInterest(list, interest, element) {
    const index = list.indexOf(interest);

    if (index !== -1) {
        list.splice(index, 1); // змінює сам масив
        element.classList.remove("selected");
    } else {
        if (list.length < 5) {
            list.push(interest);
            element.classList.add("selected");
        } else {
            showNotification("Можна обрати максимум 5 інтересів", "warning");
        }
    }
}

function setupFormHandlers() {
    // Save button
    const saveBtn = document.querySelector("#save-profile-changes")
    if (saveBtn) {
        saveBtn.addEventListener("click", () => {
            saveProfile()
        })
    }

    const savePrefsBtn = document.querySelector("#save-preferences-changes")
    if (savePrefsBtn) {
        savePrefsBtn.addEventListener("click", () => {
            savePreferences()
        })
    }
}

function setupBioCounter() {
    const bioTextarea = document.getElementById("profile-bio")
    const charCount = document.getElementById("bioCharCount")

    if (bioTextarea && charCount) {
        function updateCounter() {
            const currentLength = bioTextarea.value.length
            const maxLength = 500

            charCount.textContent = currentLength

            // Update counter color based on length
            const counter = charCount.parentElement
            counter.classList.remove("warning", "danger")

            if (currentLength > maxLength * 0.9) {
                counter.classList.add("danger")
            } else if (currentLength > maxLength * 0.8) {
                counter.classList.add("warning")
            }
        }

        bioTextarea.addEventListener("input", updateCounter)
        updateCounter() // Initial count
    }
}

function setupFormValidation() {
    const form = document.querySelector(".profile-form")
    const requiredFields = form.querySelectorAll("[required]")

    requiredFields.forEach((field) => {
        field.addEventListener("blur", validateField)
        field.addEventListener("input", validateField)
    })
}

function validateField(event) {
    const field = event.target
    const isValid = field.checkValidity()

    if (isValid) {
        field.style.borderColor = "rgba(16, 185, 129, 0.5)"
    } else {
        field.style.borderColor = "rgba(239, 68, 68, 0.5)"
    }
}

// Photo Upload Functions
function uploadPhoto(slotIndex) {
    currentPhotoSlot = slotIndex
    const fileInput = document.getElementById("photoUpload")
    fileInput.click()
}


function handlePhotoUpload(event) {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
        showNotification("Будь ласка, оберіть файл зображення", "error")
        return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification("Розмір файлу не повинен перевищувати 5MB", "error")
        return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
        uploadedPhotos[currentPhotoSlot] = e.target.result
        updatePhotoGrid()
        showNotification("Фото успішно завантажено! 📸", "success")
    }

    reader.readAsDataURL(file)

    // Clear the input
    event.target.value = ""
}

function removePhoto(slotIndex) {
    uploadedPhotos[slotIndex] = null
    updatePhotoGrid()
    showNotification("Фото видалено", "info")
}

function updatePhotoGrid() {
    const photoGrid = document.querySelector(".photo-grid")
    photoGrid.innerHTML = ""

    uploadedPhotos.forEach((photo, index) => {
        const slot = document.createElement("div")

        if (photo) {
            slot.className = `photo-slot ${index === 0 ? "main" : "filled"}`
            slot.innerHTML = `
        <img src="${photo}" alt="Profile photo ${index + 1}">
        ${index === 0 ? '<div class="photo-badge">Головне</div>' : ""}
        <button class="photo-remove" onclick="removePhoto(${index})">
          <i class="fas fa-times"></i>
        </button>
      `
        } else {
            slot.className = "photo-slot empty"
            slot.innerHTML = `
        <i class="fas fa-camera"></i>
        <span>Додати фото</span>
      `
            slot.onclick = () => uploadPhoto(index)
        }

        photoGrid.appendChild(slot)
    })
}

async function saveProfile() {
    // Validate required fields
    const form = document.querySelector(".profile-form")
    const requiredFields = form.querySelectorAll("[required]")
    let isValid = true

    for (const field of requiredFields) {
        if (!field.checkValidity()) {
            isValid = false;
            field.style.borderColor = "rgba(239, 68, 68, 0.5)";
        }

        if (field.id === 'birthdate') {
            if (!isAdult(field.value)) {
                isValid = false;
                field.style.borderColor = "rgba(239, 68, 68, 0.5)";
                showNotification("Вам повинно бути більше 18 років.", "error");
                return; // Тепер це поверне з зовнішньої функції (наприклад saveProfile)
            }
        }
    }


    if (!isValid) {
        showNotification("Будь ласка, заповніть всі обов'язкові поля", "error")
        return
    }

    // Collect form data
    const formData = {
        name: document.getElementById("profile-name")?.value,
        surname: document.getElementById("profile-surname")?.value,
        birthdate: document.getElementById("birthdate")?.value,
        gender: document.getElementById("profile-gender")?.value,
        height: document.getElementById("profile-height")?.value,
        weight: document.getElementById("profile-weight")?.value,
        bio: document.getElementById("profile-bio")?.value,
        interests: selectedInterests,
        photos: uploadedPhotos,
        // preferences: {
        //     minAge: document.getElementById("min-age")?.value,
        //     maxAge: document.getElementById("max-age")?.value,
        //     lookingFor: document.getElementById("looking-for")?.value,
        // }
    }

    // Simulate saving with loading state
    const saveBtn = document.querySelector(".save-btn")
    const originalText = saveBtn.innerHTML
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Збереження...'
    saveBtn.disabled = true

    try {
        const res = await fetch("/api/profile/update-profile", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(formData)
        });

        const result = await res.json();
    } catch (err) {
        console.error('Upload error:', err);
    }

    setTimeout(() => {
        // Restore button
        saveBtn.innerHTML = originalText
        saveBtn.disabled = false

        // Show success message
        showNotification("Профіль збережено успішно! ✨", "success")

        // Store in localStorage for demo purposes
        localStorage.setItem("meetiacProfile", JSON.stringify(formData))
    }, 1500)
}

async function savePreferences() {
    const form = document.getElementById("preferences-form");
    if (!form) {
        showNotification("Форму не знайдено", "error");
        return;
    }

    const minAge = parseInt(form.min_age.value);
    const maxAge = parseInt(form.max_age.value);
    const minHeight = parseInt(form.min_height.value) || null;
    const maxHeight = parseInt(form.max_height.value) || null;
    const minWeight = parseInt(form.min_weight.value) || null;
    const maxWeight = parseInt(form.max_weight.value) || null;

    // Валідація меж
    if (minAge > maxAge) {
        showNotification("Мінімальний вік не може бути більшим за максимальний", "warning");
        return;
    }
    if (minHeight !== null && maxHeight !== null && minHeight > maxHeight) {
        showNotification("Мінімальний зріст не може бути більшим за максимальний", "warning");
        return;
    }
    if (minWeight !== null && maxWeight !== null && minWeight > maxWeight) {
        showNotification("Мінімальна вага не може бути більшою за максимальну", "warning");
        return;
    }

    const formData = {
        min_age: minAge,
        max_age: maxAge,
        min_height: minHeight,
        max_height: maxHeight,
        min_weight: minWeight,
        max_weight: maxWeight,
        zodiac_signs: Array.from(form["zodiac_signs"].selectedOptions).map(opt => opt.value),
        interests: selectedPrefInterests,
        looking_for: form["looking_for"].value
    };

    try {
        const response = await fetch("/api/profile/update-preferences", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            showNotification("Переваги збережено успішно ✨", "success");
        } else {
            showNotification(result.message || "Помилка збереження переваг", "error");
        }
    } catch (error) {
        console.error("Помилка при збереженні переваг:", error);
        showNotification("Не вдалося з'єднатися з сервером", "error");
    }
}


// Delete Account Modal Functions
function setupDeleteAccountModal() {
    const deleteBtn = document.querySelector(".disable-account-btn")
    const reasonSelect = document.getElementById("deleteReason")
    const otherReasonGroup = document.getElementById("otherReasonGroup")
    const confirmCheckbox = document.getElementById("confirmDelete")

    if (deleteBtn) {
        deleteBtn.addEventListener("click", () => {
            document.getElementById("deleteAccountModal").style.display = "flex"
        })
    }

    if (reasonSelect) {
        reasonSelect.addEventListener("change", function () {
            if (this.value === "other") {
                otherReasonGroup.style.display = "block"
                document.getElementById("other-reason").required = true
            } else {
                otherReasonGroup.style.display = "none"
                document.getElementById("other-reason").required = false
            }
            checkDeleteFormValidity()
        })
    }

    if (confirmCheckbox) {
        confirmCheckbox.addEventListener("change", checkDeleteFormValidity)
    }

    // Check form validity on input
    document.getElementById("deleteAccountForm").addEventListener("input", checkDeleteFormValidity)
}

function checkDeleteFormValidity() {
    const reasonSelect = document.getElementById("deleteReason")
    const otherReason = document.getElementById("other-reason")
    const confirmCheckbox = document.getElementById("confirmDelete")
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn")

    let isValid = true

    // Check if reason is selected
    if (!reasonSelect.value) {
        isValid = false
    }

    // Check if "other" reason is filled when selected
    if (reasonSelect.value === "other" && !otherReason.value.trim()) {
        isValid = false
    }

    // Check if confirmation checkbox is checked
    if (!confirmCheckbox.checked) {
        isValid = false
    }

    confirmDeleteBtn.disabled = !isValid
}

function closeDeleteModal() {
    const modal = document.getElementById("deleteAccountModal")
    if (modal) {
        modal.style.display = "none"
        // Reset form
        document.getElementById("deleteAccountForm").reset()
        document.getElementById("otherReasonGroup").style.display = "none"
        document.getElementById("confirmDeleteBtn").disabled = true
    }
}

function confirmDeleteAccount() {
    const formData = {
        reason: document.getElementById("deleteReason").value,
        "other-reason": document.getElementById("other-reason").value,
        "additional-comments": document.getElementById("additional-comments").value,
        timestamp: new Date().toISOString(),
    }

    // Show loading state
    const confirmBtn = document.getElementById("confirmDeleteBtn")
    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Видалення...'
    confirmBtn.disabled = true

    const response = fetch('api/auth/disable-account', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(formData)
    })
    // Simulate API call
    setTimeout(() => {
        // Store deletion reason for analytics (in real app, send to server)
        localStorage.setItem("meetiacDeletionReason", JSON.stringify(formData))

        // Show final confirmation
        showFinalDeleteConfirmation()
    }, 2000)
}

function showFinalDeleteConfirmation() {
    const modal = document.getElementById("deleteAccountModal")
    const modalBody = modal.querySelector(".modal-body")
    const modalFooter = modal.querySelector(".modal-footer")

    modalBody.innerHTML = `
    <div class="final-confirmation">
      <div class="success-icon">
        <i class="fas fa-check-circle"></i>
      </div>
      <h3>Акаунт буде деактивовано</h3>
      <p>Дякуємо за ваш відгук. Ви більше не зможете повернутися до даного акаунту.</p>
      <p>Якщо ви передумаєте, ви більше не зможете скасувати видалення, адже ця дія є перманентною.</p>
    </div>
  `

    modalFooter.innerHTML = `
    <button class="btn btn-primary" id="home-btn">
      <i class="fas fa-home"></i>
      На головну
    </button>
  `

    const homeBtn = document.getElementById("home-btn");
    homeBtn.addEventListener("click", redirectToHome)

    // Add styles for final confirmation
    const style = document.createElement("style")
    style.textContent = `
    .final-confirmation {
      text-align: center;
      padding: 2rem 0;
    }
    
    .success-icon {
      font-size: 4rem;
      color: #10b981;
      margin-bottom: 1rem;
    }
    
    .final-confirmation h3 {
      color: white;
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    
    .final-confirmation p {
      color: #d1d5db;
      margin-bottom: 1rem;
      line-height: 1.6;
    }
  `
    document.head.appendChild(style)
}

function redirectToHome() {
    // Clear all user data
    localStorage.clear()

    // Show final notification
    showNotification("Акаунт успішно деактивовано. До побачення! 👋", "success")

    // Redirect to home page
    setTimeout(() => {
        window.location.href = ""
    }, 2000)
}

// Close modal when clicking outside
document.addEventListener("click", (event) => {
    const modal = document.getElementById("deleteAccountModal")
    if (event.target === modal) {
        closeDeleteModal()
    }
})

// Close modal with Escape key
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        const modal = document.getElementById("deleteAccountModal")
        if (modal && modal.style.display === "flex") {
            closeDeleteModal()
        }
    }
})


function setupLogoutModal() {
    // Close modal when clicking outside
    document.addEventListener("click", (event) => {
        const modal = document.getElementById("logoutModal")
        if (event.target === modal) {
            hideLogoutModal()
        }
    })

    // Close modal with Escape key
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            const modal = document.getElementById("logoutModal")
            if (modal && modal.classList.contains("show")) {
                hideLogoutModal()
            }
        }
    })
}


async function setupProfileData() {
    const res = await fetch("/api/profile/get-profile-data");
    const data = await res.json();
    if (res.ok) {
        document.getElementById("profile-name").value = data.name;
        document.getElementById("profile-surname").value = data.surname;
        document.getElementById("profile-gender").value = data.gender;
        document.getElementById("birthdate").value = data.birthdate;
        document.getElementById("profile-height").value = data.height;
        document.getElementById("profile-weight").value = data.weight;
        document.getElementById("profile-bio").value = data.bio;
        document.getElementById("bioCharCount").innerText = (data.bio || "").length;
        selectedInterests = data.interests
        await setupInterestsGrid()
        await loadProfilePhotos();
    }
}

async function setupPreferencesData() {
    const res = await fetch("/api/profile/preferences");
    const data = await res.json();

    if (res.ok) {
        document.getElementById("min-age").value = data.min_age;
        document.getElementById("max-age").value = data.max_age;
        document.getElementById("min-height").value = data.min_height;
        document.getElementById("max-height").value = data.max_height;
        document.getElementById("min-weight").value = data.min_weight;
        document.getElementById("max-weight").value = data.max_weight;
        document.getElementById("looking-for").value = data.gender;

        const selectedZodiacs = data.zodiacs || [];
        const selector = document.getElementById("preferred-zodiacs");
        Array.from(selector.options).forEach(option => {
            option.selected = selectedZodiacs.includes(option.value);
        });

        selectedPrefInterests = data.interests || [];
        console.log(data.interests)

        await setupPrefInterestsGrid();
    }
}


async function loadProfilePhotos() {
    try {
        const res = await fetch("/api/profile/photos");
        const data = await res.json();

        if (res.ok) {
            // Обнуляємо масив
            console.log(data.photos)
            for (let i = 0; i < 3; i++) {

                const photo = data.photos[i]
                if (photo !== undefined) {
                    const filename = photo.split('/').pop();
                    const index = filename.split('_')[2].split('.')[0];
                    uploadedPhotos[index] = photo;
                }
            }
            console.log(uploadedPhotos)

            updatePhotoGrid();
        } else {
            console.error("Помилка завантаження фото:", data.error);
        }
    } catch (err) {
        console.error("Помилка з'єднання:", err);
    }
}

window.handlePhotoUpload = handlePhotoUpload
window.uploadPhoto = uploadPhoto
window.closeDeleteModal = closeDeleteModal
window.confirmDeleteAccount = confirmDeleteAccount
window.removePhoto = removePhoto
window.showLogoutModal = showLogoutModal
window.confirmLogout = confirmLogout
