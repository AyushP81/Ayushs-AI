// Handle Sign Up
async function signup() {
  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();
  const messageBox = document.getElementById("auth-message");

  if (!username || !email || !password) {
    messageBox.innerText = "⚠️ Please fill in all fields.";
    return;
  }

  const res = await fetch(
    "https://c9c8428f-7614-4a94-a4a6-b7ca87e60153-00-1z22thnwna9oh.riker.replit.dev/signup",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    }
  );

  const data = await res.json();
  messageBox.innerText = data.error || data.success;

  if (data.success) {
    localStorage.setItem("username", username);
    showChat();
  }
}

// Handle Login
async function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const messageBox = document.getElementById("auth-message");

  if (!username || !password) {
    messageBox.innerText = "⚠️ Please fill in all fields.";
    return;
  }

  // Secret admin login
  if (username === "admin" && password === "ayushai123") {
    localStorage.setItem("username", username);
    showChat();
    return;
  }

  const res = await fetch(
    "https://c9c8428f-7614-4a94-a4a6-b7ca87e60153-00-1z22thnwna9oh.riker.replit.dev/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }
  );

  const data = await res.json();
  messageBox.innerText = data.error || data.success;

  if (data.success) {
    localStorage.setItem("username", username);
    showChat();
  }
}

// Display chat interface
function showChat() {
  document.querySelector(".auth-container").style.display = "none";
  document.getElementById("main-content").style.display = "flex";
}

// Check if already logged in
window.onload = () => {
  const user = localStorage.getItem("username");
  if (user) showChat();
};

// Chat system
async function sendMessage() {
  const userInput = document.getElementById("userInput");
  const chatBox = document.getElementById("chatBox");
  const message = userInput.value.trim();
  if (!message) return;

  // Display user message
  appendMessage("user-message", message);
  userInput.value = "";

  // Add typing animation
  const typingDiv = document.createElement("div");
  typingDiv.classList.add("message", "ai-message", "typing");
  typingDiv.innerHTML = `
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
  `;
  chatBox.appendChild(typingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

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
    typingDiv.remove();
    const reply = data.reply || "⚠️ Error: No response received.";
    typeTextEffect(reply);

  } catch (error) {
    typingDiv.remove();
    appendMessage("ai-message", "⚠️ Error: Could not connect to server.");
  }
}

function appendMessage(className, text) {
  const chatBox = document.getElementById("chatBox");
  const div = document.createElement("div");
  div.classList.add("message", className);
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Typewriter effect for AI response
function typeTextEffect(text) {
  const chatBox = document.getElementById("chatBox");
  const aiDiv = document.createElement("div");
  aiDiv.classList.add("message", "ai-message");
  chatBox.appendChild(aiDiv);

  let index = 0;
  const speed = 20;

  function type() {
    if (index < text.length) {
      aiDiv.textContent += text.charAt(index);
      index++;
      chatBox.scrollTop = chatBox.scrollHeight;
      setTimeout(type, speed);
    }
  }
  type();
}
