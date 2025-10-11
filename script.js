// -------------------- Initial Setup --------------------
window.onload = () => {
  const username = localStorage.getItem("username");

  // If user is already logged in, skip intro/auth
  if (username) {
    document.getElementById("intro").style.display = "none";
    showChat();
  } else {
    // Show intro for 4 seconds then show auth container
    setTimeout(() => {
      document.getElementById("intro").style.display = "none";
      document.getElementById("auth-container").style.display = "flex";
    }, 4000);
  }
};

// -------------------- Form Switching --------------------
function toggleForms() {
  const signupForm = document.getElementById("signup-form");
  const loginForm = document.getElementById("login-form");
  if (signupForm.style.display === "none") {
    signupForm.style.display = "block";
    loginForm.style.display = "none";
  } else {
    signupForm.style.display = "none";
    loginForm.style.display = "block";
  }
}

// -------------------- Auth Logic --------------------
// Secret admin login
const ADMIN = { username: "admin", password: "admin123" };

async function signup() {
  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();
  const authMessage = document.getElementById("auth-message");

  if (!username || !email || !password) {
    authMessage.innerText = "⚠️ Fill in all fields";
    return;
  }

  // Save to localStorage for demo (replace with backend DB in production)
  localStorage.setItem("username", username);
  localStorage.setItem("email", email);
  localStorage.setItem("password", password);

  authMessage.innerText = "✅ Sign-up successful! Redirecting...";
  setTimeout(showChat, 1000);
}

async function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const authMessage = document.getElementById("auth-message");

  if (!username || !password) {
    authMessage.innerText = "⚠️ Fill in all fields";
    return;
  }

  // Secret admin login
  if (username === ADMIN.username && password === ADMIN.password) {
    localStorage.setItem("username", username);
    authMessage.innerText = "✅ Admin login successful! Redirecting...";
    setTimeout(showChat, 500);
    return;
  }

  // Check stored credentials (demo)
  const storedUsername = localStorage.getItem("username");
  const storedPassword = localStorage.getItem("password");

  if (username === storedUsername && password === storedPassword) {
    authMessage.innerText = "✅ Login successful! Redirecting...";
    setTimeout(showChat, 500);
  } else {
    authMessage.innerText = "⚠️ Incorrect username or password";
  }
}

// -------------------- Show Chat --------------------
function showChat() {
  document.getElementById("auth-container").style.display = "none";
  document.getElementById("main-content").style.display = "flex";
}

// -------------------- Chat Functionality --------------------
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("send-btn");

// Append messages
function appendMessage(sender, message) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender);
  chatBox.appendChild(msgDiv);

  // Smooth typing effect
  let i = 0;
  function typeWriter() {
    if (i < message.length) {
      msgDiv.innerHTML = `<strong>${sender === "user" ? "🧑‍💻 You" : "🤖 Ayush’s AI"}:</strong> ${message.slice(0, i + 1)}`;
      i++;
      setTimeout(typeWriter, 20); // typing speed
    }
  }
  typeWriter();
  chatBox.scrollTop = chatBox.scrollHeight;
}

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

// Send message
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
    appendMessage("ai", data.reply || "⚠️ Could not get a response.");
  } catch (error) {
    removeTyping();
    appendMessage("ai", "⚠️ Could not connect to server.");
  }
}

sendBtn.addEventListener("click", sendMessage);
