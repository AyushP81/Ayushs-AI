// Elements
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("send-btn");
const authMessage = document.getElementById("auth-message");
const authContainer = document.getElementById("auth-container");
const mainContent = document.getElementById("main-content");

// --- Messages in chat ---
function appendMessage(sender, message) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", sender);
    msgDiv.innerHTML = `<strong>${sender === "user" ? "🧑‍💻 You" : "🤖 Ayush’s AI"}:</strong> ${message}`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Typing animation
function showTyping() {
    const typingDiv = document.createElement("div");
    typingDiv.id = "typing";
    typingDiv.classList.add("message", "ai");
    typingDiv.innerHTML = `<strong>🤖 Ayush’s AI:</strong> <span class="dots">Typing<span>.</span><span>.</span><span>.</span></span>`;
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTyping() {
    const typingDiv = document.getElementById("typing");
    if (typingDiv) typingDiv.remove();
}

// --- Chat message ---
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage("user", message);
    userInput.value = "";

    showTyping();

    try {
        const response = await fetch(
            "https://c9c8428f-7614-4a94-a4a6-b7ca87e60153-00-1z22thnwna9oh.riker.replit.dev/chat",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            }
        );

        const data = await response.json();
        removeTyping();
        appendMessage("ai", data.reply || "⚠️ Error: Could not get response.");

    } catch (error) {
        removeTyping();
        appendMessage("ai", "⚠️ Error: Could not connect to server.");
    }
}

sendBtn.addEventListener("click", sendMessage);

// Allow Enter key to send
userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});

// --- Signup ---
async function signup() {
    const username = document.getElementById("signup-username").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();

    if (!username || !email || !password) {
        authMessage.innerText = "⚠️ Please fill all fields.";
        return;
    }

    try {
        const res = await fetch("https://c9c8428f-7614-4a94-a4a6-b7ca87e60153-00-1z22thnwna9oh.riker.replit.dev/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await res.json();
        authMessage.innerText = data.error || data.success;

        if (data.success) {
            authContainer.style.display = "none";
            mainContent.style.display = "flex";
        }

    } catch (err) {
        authMessage.innerText = "⚠️ Could not connect to server.";
    }
}

// --- Login ---
async function login() {
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!username || !password) {
        authMessage.innerText = "⚠️ Please fill all fields.";
        return;
    }

    try {
        const res = await fetch("https://c9c8428f-7614-4a94-a4a6-b7ca87e60153-00-1z22thnwna9oh.riker.replit.dev/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        authMessage.innerText = data.error || data.success;

        if (data.success) {
            authContainer.style.display = "none";
            mainContent.style.display = "flex";
        }

    } catch (err) {
        authMessage.innerText = "⚠️ Could not connect to server.";
    }
}

// --- Intro logic ---
setTimeout(() => {
    document.getElementById("intro").style.display = "none";
    authContainer.style.display = "flex"; // Show login/signup first
}, 4000); // 4-second intro











