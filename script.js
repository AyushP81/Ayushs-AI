// -------------------- DOM Elements --------------------
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("send-btn");
const authContainer = document.getElementById("auth-container");
const mainContent = document.getElementById("main-content");
const authMessage = document.getElementById("auth-message");

// Secret admin login
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

// -------------------- Intro & Auth --------------------
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("intro").style.display = "none";
    checkLoginState();
  }, 3000); // 3 seconds intro
});

function checkLoginState() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (loggedInUser) {
    showMainContent();
  } else {
    authContainer.style.display = "flex";
    document.getElementById("signup-form").style.display = "block";
    document.getElementById("login-form").style.display = "none";
  }
}

function toggleForms() {
  const signup = document.getElementById("signup-form");
  const login = document.getElementById("login-form");
  if (signup.style.display === "block") {
    signup.style.display = "none";
    login.style.display = "block";
  } else {
    signup.style.display = "block";
    login.style.display = "none";
  }
}

function showMainContent() {
  authContainer.style.display = "none";
  mainContent.style.display = "flex";
}

// -------------------- Signup/Login --------------------
async function signup() {
  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;

  if (!username || !email || !password) {
    authMessage.innerText = "⚠️ Please fill in all fields.";
    return;
  }

  // Secret admin check
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    localStorage.setItem("loggedInUser", username);
    showMainContent();
    return;
  }

  try {
    const res = await fetch("https://c9c8428f-7614-4a94-a4a6-b7ca87e60153-00-1z22thnwna9oh.riker.replit.dev/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (data.success) {
      authMessage.innerText = data.success;
      localStorage.setItem("loggedInUser", username);
      showMainContent();
    } else {
      authMessage.innerText = data.error || "Signup failed.";
    }
  } catch (err) {
    authMessage.innerText = "⚠️ Could not connect to server.";
  }
}

async function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;

  if (!username || !password) {
    authMessage.innerText = "⚠️ Please fill in all fields.";
    return;
  }

  // Secret admin check
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    localStorage.setItem("loggedInUser", username);
    showMainContent();
    return;
  }

  try {
    const res = await fetch("https://c9c8428f-7614-4a94-a4a6-b7ca87e60153-00-1z22thnwna9oh.riker.replit.dev/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem("loggedInUser", username);
      showMainContent();
    } else {
      authMessage.innerText = data.error || "Login failed.";
    }
  } catch (err) {
    authMessage.innerText = "⚠️ Could not connect to server.";
  }
}

// -------------------- Chat --------------------
let chatHistory = [];

function appendMessage(sender, message) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender);
  chatBox.appendChild(msgDiv);

  if (sender === "ai") {
    typeText(msgDiv, message);
  } else {
    msgDiv.innerHTML = `<strong>🧑‍💻 You:</strong> ${message}`;
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}

function typeText(element, text) {
  element.innerHTML = `<strong>🤖 Ayush’s AI:</strong> `;
  let i = 0;
  const interval = setInterval(() => {
    element.innerHTML = `<strong>🤖 Ayush’s AI:</strong> ` + text.substring(0, i);
    i++;
    if (i > text.length) clearInterval(interval);
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 15); // typing speed
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage("user", message);
  userInput.value = "";

  const typingDiv = document.createElement("div");
  typingDiv.classList.add("message", "ai");
  typingDiv.innerHTML = `<strong>🤖 Ayush’s AI:</strong> <span class="typing">Typing...</span>`;
  chatBox.appendChild(typingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch("https://c9c8428f-7614-4a94-a4a6-b7ca87e60153-00-1z22thnwna9oh.riker.replit.dev/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();
    typingDiv.remove();
    appendMessage("ai", data.reply || "⚠️ Error: Could not get response.");
  } catch (err) {
    typingDiv.remove();
    appendMessage("ai", "⚠️ Error: Could not connect to server.");
  }
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

