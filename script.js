function toggleForms() {
  const signup = document.getElementById("signup-form");
  const login = document.getElementById("login-form");
  signup.style.display = signup.style.display === "none" ? "block" : "none";
  login.style.display = login.style.display === "none" ? "block" : "none";
}

// Load intro
window.addEventListener("load", () => {
  setTimeout(() => {
    const intro = document.getElementById("intro");
    intro.style.opacity = "0";
    setTimeout(() => {
      intro.style.display = "none";
      const user = localStorage.getItem("loggedInUser");
      if (user) showChat();
      else document.getElementById("auth-container").style.display = "flex";
    }, 1000);
  }, 2500);
});

// Sign up
async function signup() {
  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();
  if (!username || !email || !password) return alert("Fill all fields!");

  // Secret admin auto login
  if (username === "admin" && password === "ayush123") {
    localStorage.setItem("loggedInUser", username);
    return showChat();
  }

  const res = await fetch("https://c9c8428f-7614-4a94-a4a6-b7ca87e60153-00-1z22thnwna9oh.riker.replit.dev/signup", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({username, email, password})
  });
  const data = await res.json();
  document.getElementById("auth-message").innerText = data.success || data.error;
  if (data.success) {
    localStorage.setItem("loggedInUser", username);
    showChat();
  }
}

// Login
async function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();
  if (!username || !password) return alert("Fill all fields!");

  if (username === "admin" && password === "ayush123") {
    localStorage.setItem("loggedInUser", username);
    return showChat();
  }

  const res = await fetch("https://c9c8428f-7614-4a94-a4a6-b7ca87e60153-00-1z22thnwna9oh.riker.replit.dev/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({username, password})
  });
  const data = await res.json();
  document.getElementById("auth-message").innerText = data.success || data.error;
  if (data.success) {
    localStorage.setItem("loggedInUser", username);
    showChat();
  }
}

// Show chat
function showChat() {
  document.getElementById("auth-container").style.display = "none";
  document.getElementById("main-content").style.display = "flex";
}

// Chat messages
function appendMessage(sender, message) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender);
  msgDiv.innerHTML = `<strong>${sender === "user" ? "You" : "AI"}:</strong> ${message}`;
  document.getElementById("chatBox").appendChild(msgDiv);
  document.getElementById("chatBox").scrollTop = document.getElementById("chatBox").scrollHeight;
}

// Send message
async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;
  appendMessage("user", message);
  input.value = "";

  appendMessage("ai", "Typing...");
  try {
    const res = await fetch("https://c9c8428f-7614-4a94-a4a6-b7ca87e60153-00-1z22thnwna9oh.riker.replit.dev/chat", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({message})
    });
    const data = await res.json();
    document.querySelector(".ai:last-child").remove();
    appendMessage("ai", data.reply || "⚠️ Error from AI.");
  } catch {
    document.querySelector(".ai:last-child").remove();
    appendMessage("ai", "⚠️ Could not connect to server.");
  }
}

