let isSubmitting = false;


/**
 * Validates the contact form fields and enables or disables the submit button based on the overall validation result.
 */
function validateForm() {
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const message = document.getElementById("message");
    const privacy = document.getElementById("privacy");
    const submitBtn = document.getElementById("submitBtn");
    resetErrors();
    const valid = validateAll(name, email, message, privacy);
    if (valid) {
        enableSubmitButton(submitBtn);
    } else {
        disableSubmitButton(submitBtn);
    }
    return valid;
}

/**
 * Resets all form error messages by clearing the text content of each error field.
 */
function resetErrors() {
    document.getElementById("nameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("messageError").textContent = "";
    document.getElementById("privacyError").textContent = "";
}

/**
 * Displays an error message and applies error styling to the input field.
 * @param {*} input 
 * @param {*} errorId 
 * @param {*} message 
 */
function setError(input, errorId, message) {
    document.getElementById(errorId).textContent = message;
    input.classList.remove("input-valid");
    input.classList.add("input-error");
}

/**
 * Removes error styling and marks the input field as valid.
 * @param {*} input 
 */
function setValid(input) {
    input.classList.remove("input-error");
    input.classList.add("input-valid");
}

/**
 * Validates the name, email, message, privaycy field and checks if it is not empty. 
 */
function validateAll(name, email, message, privacy) {
    let valid = true;
    if (name.value.trim() === "") {
        setError(name, "nameError", "Your name is required");
        valid = false;
    } else {
        setValid(name);
    }
    if (email.value.trim() === "") {
        setError(email, "emailError", "Your email is required");
        valid = false;
    } else if (!email.value.includes("@")) {
        setError(email, "emailError", "Please enter a valid email address");
        valid = false;
    } else {
        setValid(email);
    }
    if (message.value.trim() === "") {
        setError(message, "messageError", "Your message is required");
        valid = false;
    } else {
        setValid(message);
    }
    if (!privacy.checked) {
        document.getElementById("privacyError").textContent =
            "Your privacy is required";
        valid = false;
    } else {
        document.getElementById("privacyError").textContent = "";
    }
    return valid;
}

/**
 * Enables the submit button and applies active styling.
 * @param {*} submitBtn 
 */
function enableSubmitButton(submitBtn) {
    submitBtn.disabled = false;
    submitBtn.classList.add("enabled");
    submitBtn.classList.remove("disabled");
}

/**
 * Disables the submit button and applies disabled styling.
 * @param {*} submitBtn 
 */
function disableSubmitButton(submitBtn) {
    submitBtn.disabled = true;
    submitBtn.classList.add("disabled");
    submitBtn.classList.remove("enabled");
}

/**
 * Handles form submission.
 * @param {Event} e 
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    if (!validateForm()) {
        return;
    } try {
        const result = await sendContactRequest(getFormData());
        if (result.success) {
            handleSuccess();
            clearErrors();
        } else {
            handleError(result.error);
        }
    } catch {
        showToast('Connection error', true);
    }
}

/**
 * Collects form data.
 */
function getFormData() {
    return {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };
}

function clearErrors() {
    document.querySelectorAll(".error-message")
        .forEach(el => el.textContent = "");
    document.querySelectorAll("input, textarea").forEach(el => {
        el.classList.remove("input-error", "input-valid");
    });
}

/**
 * Handles a successful submission.
 */
function handleSuccess() {
    showToast('Nachricht erfolgreich übermittelt.');
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('message').value = '';
    document.getElementById('privacy').checked = false;
    validateForm();
}

/**
 * Handles submission errors.
 * @param {string} error 
 */
function handleError(error) {
    showToast('✗ ' + error, true);
}

/**
 * Displays a temporary toast notification message.
 * @param {*} message 
 */
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('show');
    void toast.offsetWidth;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/**
 * Adds the submit event listener to the contact form after the page has loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("contactForm")
        .addEventListener("submit", handleFormSubmit);
});
