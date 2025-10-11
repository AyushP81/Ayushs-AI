// ====== CONFIG ======
const ADMIN_USERNAME = "ayushadmin";
const ADMIN_PASSWORD = "maxver";

// ====== ON LOAD ======
window.addEventListener("load", () => {
  const loggedInUser = localStorage.getItem("loggedInUser");

  // Show intro screen for 3s before continuing
  setTimeout(() => {
    document.getElementById("intro").style.display = "none";
    if (loggedInUser) {
      showChat();
    } else {
      showSignup();
    }
  }, 3000);
});

// ====== SIGNUP ======
function signup() {
  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();

  if (!username || !email || !password) {
    showMessage("Please fill in all fields.", "error");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Check duplicate
  if (users.some(u => u.username === username)) {
    showMessage("Username already exists. Please login.", "error");
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
  const user = users.find(u => u.username === username && u.password === password);

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

// ====== DISPLAY CONTROLS ======
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

  // Add logout button in top-right
  if (!document.getElementById("logout-btn")) {
    const logoutBtn = document.createElement("button");
    logoutBtn.id = "logout-btn";
    logoutBtn.textContent = "Logout";
    logoutBtn.onclick = logout;
    logoutBtn.style.position = "absolute";
    logoutBtn.style.top = "15px";
    logoutBtn.style.right = "15px";
    logoutBtn.style.padding = "8px 15px";
    logoutBtn.style.borderRadius = "10px";
    logoutBtn.style.border = "none";
    logoutBtn.style.background = "linear-gradient(90deg, #ff4b2b, #ff416c)";
    logoutBtn.style.color = "#fff";
    logoutBtn.style.cursor = "pointer";
    logoutBtn.style.fontWeight = "600";
    document.body.appendChild(logoutBtn);
  }
}

// ====== MESSAGE FEEDBACK ======
function showMessage(message, type) {
  const msg = document.getElementById("auth-message");
  msg.textContent = message;
  msg.style.color = type === "error" ? "#ff4d4d" : "#6cff9e";
  msg.style.opacity = "1";
  setTimeout(() => (msg.style.opacity = "0"), 2500);
}

// ====== AI CHAT FUNCTION ======
function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;

  const chatBox = document.getElementById("chatBox");

  // Add user message
  const userMsg = document.createElement("div");
  userMsg.className = "chat-message user";
  userMsg.innerText = text;
  chatBox.appendChild(userMsg);

  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  // AI "thinking"
  const aiMsg = document.createElement("div");
  aiMsg.className = "chat-message ai";
  aiMsg.innerHTML = "🤖 Thinking...";
  chatBox.appendChild(aiMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  // Simulated AI response
  setTimeout(() => {
    const responses = [
      `That's interesting! Tell me more.`,
      `I like how you think! 😄`,
      `Good question. Let's explore that further.`,
      `Hmm... I’d say it depends on how you look at it.`,
      `🤔 Fascinating! Want to dive deeper?`
    ];
    const reply = responses[Math.floor(Math.random() * responses.length)];

    aiMsg.innerHTML = `<p>${reply}</p>`;
    aiMsg.style.whiteSpace = "pre-line";

    chatBox.scrollTop = chatBox.scrollHeight;
  }, 1000);
}
