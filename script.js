// ===== Simple local "database" using localStorage =====

// Secret admin login
const ADMIN_USERNAME = "ayushadmin";
const ADMIN_PASSWORD = "maxver";

// Check if a user is already logged in
window.onload = function () {
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (loggedInUser) {
    showChat();
  } else {
    showSignup();
  }
};

// ====== SIGN UP ======
function signup() {
  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();

  if (!username || !email || !password) {
    showMessage("Please fill in all fields.", "error");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Check if user already exists
  if (users.some((u) => u.username === username)) {
    showMessage("Username already exists. Please login instead.", "error");
    return;
  }

  users.push({ username, email, password });
  localStorage.setItem("users", JSON.stringify(users));
  showMessage("Signup successful! Please log in.", "success");
  showLogin();
}

// ====== LOGIN ======
function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!username || !password) {
    showMessage("Please fill in all fields.", "error");
    return;
  }

  // Admin instant login
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    localStorage.setItem("loggedInUser", ADMIN_USERNAME);
    showChat();
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.username === username && u.password === password);

  if (user) {
    localStorage.setItem("loggedInUser", username);
    showChat();
  } else {
    showMessage("Invalid username or password.", "error");
  }
}

// ====== LOGOUT ======
function logout() {
  localStorage.removeItem("loggedInUser");
  location.reload();
}

// ====== Show sections ======
function showSignup() {
  document.getElementById("auth-container").style.display = "flex";
  document.getElementById("signup-form").style.display = "block";
  document.getElementById("login-form").style.display = "none";
  document.getElementById("main-content").style.display = "none";
}

function showLogin() {
  document.getElementById("auth-container").style.display = "flex";
  document.getElementById("signup-form").style.display = "none";
  document.getElementById("login-form").style.display = "block";
  document.getElementById("main-content").style.display = "none";
}

function showChat() {
  document.getElementById("auth-container").style.display = "none";
  document.getElementById("main-content").style.display = "flex";
  document.getElementById("chatBox").innerHTML = "";
  showMessage(`Welcome back!`, "success");
}

// ====== Show message ======
function showMessage(message, type) {
  const msg = document.getElementById("auth-message");
  msg.textContent = message;
  msg.style.color = type === "error" ? "#ff5f5f" : "#6cff9e";
  msg.style.opacity = "1";
  setTimeout(() => (msg.style.opacity = "0"), 3000);
}

// ====== AI Chat Functionality ======
function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (message === "") return;

  const chatBox = document.getElementById("chatBox");

  const userMsg = document.createElement("div");
  userMsg.className = "chat-message user";
  userMsg.innerText = message;
  chatBox.appendChild(userMsg);

  input.value = "";

  setTimeout(() => {
    const aiMsg = document.createElement("div");
    aiMsg.className = "chat-message ai";
    aiMsg.innerText = "🤖 Thinking...";
    chatBox.appendChild(aiMsg);

    setTimeout(() => {
      aiMsg.innerText = `You said: "${message}" — that’s quite interesting! 😄`;
      chatBox.scrollTop = chatBox.scrollHeight;
    }, 1000);
  }, 500);

  chatBox.scrollTop = chatBox.scrollHeight;
}
