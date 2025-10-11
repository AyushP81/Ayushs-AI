// Elements
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("send-btn");
const authMessage = document.getElementById("auth-message");

const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const authContainer = document.getElementById("auth-container");
const mainContent = document.getElementById("main-content");

let chat_history = [];

// Check if first-time user
window.onload = () => {
  const isReturning = localStorage.getItem("ayush_ai_user");
  if (isReturning) {
    signupForm.style.display = "none";
    loginForm.style.display = "flex";
  } else {
    signupForm.style.display = "flex";
    loginForm.style.display = "none";
  }
};

// Append messages to chat
function appendMessage(sender, message) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender);
  msgDiv.innerHTML = `<strong>${sender === "user" ? "🧑‍💻 You" : "🤖 Ayush’s AI"}:</strong> ${message}`;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Show typing animation
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

// Send chat message
async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;
  appendMessage("user", message);
  userInput.value = "";
  showTyping();

  try {
    const response = await fetch("https://c9c8428f-7614-4a94-a4a6-b7ca87e60153-00-1z22thnwna9oh.riker.replit.dev/chat", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    removeTyping();
    appendMessage("ai", data.reply || "⚠️ Error: Could not get response.");
  } catch (error) {
    removeTyping();
    appendMessage("ai", "⚠️ Error: Could not connect to server.");
  }
}

sendBtn.addEventListener("click", sendMessage);

// SIGNUP
async function signup() {
  const username = document.getElementById("signup-username").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  if (!username || !email || !password) {
    authMessage.innerText = "⚠️ Please fill all fields.";
    return;
  }

  try {
    const res = await fetch("https://c9c8428f-7614-4a94-a4a6-b7ca87e60153-00-1z22thnwna9oh.riker.replit.dev/signup", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({username, email, password})
    });
    const data = await res.json();

    if (data.success) {
      localStorage.setItem("ayush_ai_user", username);
      authContainer.style.display = "none";
      mainContent.style.display = "flex";
    } else {
      authMessage.innerText = data.error || "⚠️ Signup failed.";
    }
  } catch (err) {
    authMessage.innerText = "⚠️ Could not connect to server.";
  }
}

// LOGIN
async function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  if (!username || !password) {
    authMessage.innerText = "⚠️ Please fill all fields.";
    return;
  }

  try {
    const res = await fetch("https://c9c8428f-7614-4a94-a4a6-b7ca87e60153-00-1z22thnwna9oh.riker.replit.dev/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({username, password})
    });
    const data = await res.json();

    if (data.success) {
      localStorage.setItem("ayush_ai_user", username);
      authContainer.style.display = "none";
      mainContent.style.display = "flex";
    } else {
      authMessage.innerText = data.error || "⚠️ Login failed.";
    }
  } catch (err) {
    authMessage.innerText = "⚠️ Could not connect to server.";
  }
}









