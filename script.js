// -------------------- Main JS for Ayush's AI frontend --------------------

// IDs used in your HTML:
// #intro, .auth-container, .auth-card, #signup-form, #login-form, #auth-message
// #main-content, #chatBox, #userInput, #send-btn

const BACKEND_URL = "YOUR_BACKEND_URL_HERE"; // <-- replace with your real backend URL

// DOM refs
const introEl = document.getElementById("intro");
const authContainer = document.getElementById("auth-container");
const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const authMessage = document.getElementById("auth-message");
const mainContent = document.getElementById("main-content");
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("send-btn");

// secret admin login (bypass backend)
const ADMIN = { username: "admin", password: "admin123" };

// ---------------- Intro handling ----------------
window.addEventListener("load", () => {
  // If already logged in, skip intro quickly
  const loggedUser = localStorage.getItem("loggedInUser");
  if (loggedUser) {
    // hide intro immediately and show chat
    introEl.style.opacity = "0";
    introEl.style.display = "none";
    showMain();
    return;
  }

  // otherwise show intro for 3s then reveal auth
  setTimeout(() => {
    introEl.style.opacity = "0";
    setTimeout(() => {
      introEl.style.display = "none";
      authContainer.style.display = "flex";
      // default to signup visible
      signupForm.style.display = "flex";
      loginForm.style.display = "none";
    }, 700);
  }, 3000);
});

// ---------------- Form switching ----------------
function toggleForms() {
  if (signupForm.style.display === "none" || signupForm.style.display === "") {
    signupForm.style.display = "flex";
    loginForm.style.display = "none";
    authMessage.textContent = "";
  } else {
    signupForm.style.display = "none";
    loginForm.style.display = "flex";
    authMessage.textContent = "";
  }
}

// allow the toggleForms to be used by the links in HTML
window.toggleForms = toggleForms;

// ---------------- Signup / Login ----------------
async function signup() {
  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;

  if (!username || !email || !password) {
    authMessage.style.color = "#ff9a9a";
    authMessage.textContent = "⚠️ Please fill in all fields.";
    return;
  }

  // admin shortcut (for testing)
  if (username === ADMIN.username && password === ADMIN.password) {
    localStorage.setItem("loggedInUser", username);
    showMain();
    return;
  }

  // If you have a backend signup endpoint, call it here.
  // For now, we store locally (demo only).
  try {
    // --- Demo local save (replace with backend call if needed) ---
    localStorage.setItem("demo_user_username", username);
    localStorage.setItem("demo_user_email", email);
    localStorage.setItem("demo_user_password", password);

    localStorage.setItem("loggedInUser", username);
    authMessage.style.color = "#9fffbf";
    authMessage.textContent = "✅ Signed up successfully.";
    setTimeout(showMain, 600);
  } catch (err) {
    authMessage.style.color = "#ff9a9a";
    authMessage.textContent = "⚠️ Signup failed.";
  }
}
window.signup = signup;

async function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;

  if (!username || !password) {
    authMessage.style.color = "#ff9a9a";
    authMessage.textContent = "⚠️ Please fill in all fields.";
    return;
  }

  // admin shortcut
  if (username === ADMIN.username && password === ADMIN.password) {
    localStorage.setItem("loggedInUser", username);
    showMain();
    return;
  }

  // demo local check (replace with backend call)
  const stored = localStorage.getItem("demo_user_username");
  const storedPw = localStorage.getItem("demo_user_password");
  if (stored && username === stored && password === storedPw) {
    localStorage.setItem("loggedInUser", username);
    authMessage.style.color = "#9fffbf";
    authMessage.textContent = "✅ Login successful";
    setTimeout(showMain, 500);
    return;
  }

  // if you have backend login endpoint, call it:
  // try {
  //   const res = await fetch(`${BACKEND_URL}/login`, {...});
  //   ...
  // } catch(err){ ... }

  authMessage.style.color = "#ff9a9a";
  authMessage.textContent = "⚠️ Invalid username or password.";
}
window.login = login;

// ---------------- show main (chat) ----------------
function showMain() {
  authContainer.style.display = "none";
  mainContent.style.display = "flex";
  chatBox.innerHTML = ""; // clear old messages
  // optional welcome message
  appendAI("Hey! I'm Ayush's AI — how can I help?");
}

// ---------------- Chat helpers ----------------
function appendUser(text) {
  const d = document.createElement("div");
  d.className = "message user";
  d.textContent = text;
  chatBox.appendChild(d);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendAIDots() {
  const d = document.createElement("div");
  d.className = "message ai";
  // keep container empty for typing dots
  const dots = document.createElement("div");
  dots.className = "typing";
  dots.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
  d.appendChild(dots);
  chatBox.appendChild(d);
  chatBox.scrollTop = chatBox.scrollHeight;
  return d; // return the placeholder element so we can remove it later
}

function appendAI(text) {
  const d = document.createElement("div");
  d.className = "message ai";
  chatBox.appendChild(d);
  typewriter(d, text);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// typewriter: types characters one by one into element
function typewriter(element, text, charDelay = 18) {
  element.innerHTML = ""; // start empty
  const title = document.createElement("strong");
  title.textContent = "🤖 Ayush’s AI: ";
  element.appendChild(title);
  const span = document.createElement("span");
  element.appendChild(span);

  let i = 0;
  function step() {
    if (i < text.length) {
      span.textContent += text.charAt(i);
      i++;
      chatBox.scrollTop = chatBox.scrollHeight;
      setTimeout(step, charDelay);
    }
  }
  step();
}

// ---------------- sendMessage (calls backend) ----------------
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  // append user
  appendUser(text);
  userInput.value = "";

  // show typing indicator
  const typingPlaceholder = appendAIDots();

  // send to backend
  try {
    const res = await fetch(`${BACKEND_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    // If backend returns non-JSON or errors, handle gracefully
    const data = await (res.ok ? res.json() : Promise.reject(new Error("Bad response")));
    // remove dots
    typingPlaceholder.remove();

    // If your backend returns `.reply` or `.message`, adapt here:
    const reply = data.reply ?? data.message ?? data.output ?? "⚠️ No reply.";
    appendAI(String(reply));

  } catch (err) {
    // Remove dots and show error
    typingPlaceholder.remove();
    appendAI("⚠️ Could not connect to the server. Try again.");
    console.error("Chat error:", err);
  }
}
window.sendMessage = sendMessage;

// send on button
sendBtn.addEventListener("click", sendMessage);

// send on Enter
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
