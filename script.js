
// ========================
// CONFIG
// ========================
const BASE_URL = ""; // leave empty if backend is same origin

// ========================
// GLOBAL STATE
// ========================
let currentUser = null;
let currentUserId = null;

// ========================
// INTRO SCREEN
// ========================
window.addEventListener("load", () => {
  const intro = document.getElementById("intro");
  setTimeout(() => {
    intro.style.opacity = "0";
    setTimeout(() => {
      intro.style.display = "none";

      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        currentUser = user.username;
        currentUserId = user.user_id;
        showMainContent();
        updateProfileBar();
        loadPreviousMessages();
      } else {
        document.getElementById("auth-container").style.display = "flex";
      }
    }, 1000);
  }, 1500);
});

// ========================
// AUTH SYSTEM
// ========================
function toggleForms() {
  const signupForm = document.getElementById("signup-form");
  const loginForm = document.getElementById("login-form");
  signupForm.style.display = signupForm.style.display === "none" ? "flex" : "none";
  loginForm.style.display = loginForm.style.display === "none" ? "flex" : "none";
}

async function signup() {
  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();
  if (!username || !email || !password) return alert("Please fill in all fields.");

  try {
    const res = await fetch(`${BASE_URL}/signup2`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (data.error) alert(data.error);
    else loginUser(username, data.user_id);
  } catch (err) {
    alert("⚠️ Error connecting to server.");
  }
}

async function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();
  if (!username || !password) return alert("Please fill in all fields.");

  try {
    const res = await fetch(`${BASE_URL}/login2`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.error) alert(data.error);
    else loginUser(username, data.user_id);
  } catch (err) {
    alert("⚠️ Error connecting to server.");
  }
}

function loginUser(username, user_id) {
  currentUser = username;
  currentUserId = user_id;

  // store in localStorage
  localStorage.setItem("user", JSON.stringify({ username, user_id }));

  // show main content
  document.getElementById("auth-container").style.display = "none";
  showMainContent();
  updateProfileBar();
  loadPreviousMessages();
}

function logout() {
  currentUser = null;
  currentUserId = null;
  localStorage.removeItem("user");
  document.getElementById("main-content").style.display = "none";
  document.getElementById("auth-container").style.display = "flex";
  document.getElementById("chatBox").innerHTML = "";
}

// ========================
// PROFILE BAR
// ========================
function updateProfileBar() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  let profileBar = document.getElementById("profile");
  if (!profileBar) {
    const container = document.getElementById("main-content");
    profileBar = document.createElement("div");
    profileBar.id = "profile";
    profileBar.style.display = "flex";
    profileBar.style.justifyContent = "space-between";
    profileBar.style.alignItems = "center";
    profileBar.style.width = "100%";
    profileBar.style.marginBottom = "10px";

    const userText = document.createElement("span");
    userText.id = "profile-username";
    profileBar.appendChild(userText);

    const logoutBtn = document.createElement("button");
    logoutBtn.textContent = "Logout";
    logoutBtn.id = "logout-btn";
    logoutBtn.onclick = logout;
    profileBar.appendChild(logoutBtn);

    container.prepend(profileBar);
  }
  document.getElementById("profile-username").textContent = `Logged in as: ${user.username}`;
}

function showMainContent() {
  document.getElementById("auth-container").style.display = "none";
  document.getElementById("main-content").style.display = "block";
  updateProfileBar();
}

// ========================
// CHAT SYSTEM
// ========================
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
document.getElementById("send-btn").addEventListener("click", sendMessage);

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  userInput.value = "";

  const typingMsg = addMessage("...", "ai", true);

  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      chatBox.removeChild(typingMsg);
      showTypingEffect("⚠️ Error: You are not logged in.");
      return;
    }

    let reply;
    if (/who.*created.*you|who.*made.*you/i.test(message)) {
      reply = "I was created by Ayush.";
    } else {
      const res = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, user_id: user.user_id })
      });
      const data = await res.json();
      reply = data.reply || "⚠️ Error: No response from AI.";
    }

    chatBox.removeChild(typingMsg);
    showTypingEffect(reply);
  } catch (err) {
    chatBox.removeChild(typingMsg);
    showTypingEffect("⚠️ Error: Could not connect to backend.");
  }
}

function addMessage(text, sender, isTyping = false) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  if (isTyping) msg.classList.add("typing");
  return msg;
}

function showTypingEffect(fullText) {
  const msg = document.createElement("div");
  msg.classList.add("message", "ai");

  const textContainer = document.createElement("span");
  msg.appendChild(textContainer);
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;

  let index = 0;
  const typingSpeed = 20;

  function type() {
    if (index < fullText.length) {
      textContainer.textContent += fullText.charAt(index++);
      chatBox.scrollTop = chatBox.scrollHeight;
      setTimeout(type, typingSpeed);
    } else if (fullText.length > 400) {
      const shortText = fullText.slice(0, 400) + "...";
      textContainer.textContent = shortText;

      const readMore = document.createElement("button");
      readMore.textContent = "Read More";
      readMore.classList.add("read-more");

      let expanded = false;
      readMore.onclick = () => {
        textContainer.textContent = expanded ? shortText : fullText;
        readMore.textContent = expanded ? "Read More" : "Collapse";
        expanded = !expanded;
      };

      msg.appendChild(readMore);
    }
  }
  type();
}

// ========================
// LOAD PREVIOUS MESSAGES
// ========================
async function loadPreviousMessages() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  try {
    const res = await fetch(`${BASE_URL}/messages/load`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.user_id })
    });
    const data = await res.json();
    if (data.messages) {
      data.messages.forEach(msg => {
        const sender = msg.sender_id === user.user_id ? "user" : "ai";
        addMessage(msg.message, sender);
      });
    }
  } catch (err) {
    console.error("⚠️ Could not load previous messages.", err);
  }
}








