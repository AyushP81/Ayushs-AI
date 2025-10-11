const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("send-btn");

function appendMessage(sender, message) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = message;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;
  appendMessage("user", message);
  userInput.value = "";

  try {
    const res = await fetch("https://your-backend-url/chat", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    appendMessage("ai", data.reply || "⚠️ No response from AI.");
  } catch {
    appendMessage("ai", "⚠️ Error connecting to server.");
  }
}

sendBtn.addEventListener("click", sendMessage);

// Auth System
async function signup() {
  const username = document.getElementById("signup-username").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  const res = await fetch("https://your-backend-url/signup", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ username, email, password })
  });
  const data = await res.json();
  document.getElementById("auth-message").innerText = data.error || data.success;
  if (data.success) showChat();
}

async function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  const res = await fetch("https://your-backend-url/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  document.getElementById("auth-message").innerText = data.error || data.success;
  if (data.success) showChat();
}

function showChat() {
  document.getElementById("auth-container").style.display = "none";
  document.getElementById("main-content").style.display = "flex";
}
