// === INTRO ANIMATION ===
window.addEventListener("load", () => {
  const intro = document.getElementById("intro");
  setTimeout(() => {
    intro.style.opacity = "0";
    setTimeout(() => {
      intro.style.display = "none";
      document.getElementById("auth-container").style.display = "flex";
    }, 1000);
  }, 1500);
});

// === AUTH SYSTEM ===
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
    const res = await fetch("/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (data.error) alert(data.error);
    else {
      alert(data.success);
      loginUser(username);
    }
  } catch (err) {
    alert("⚠️ Error connecting to server.");
  }
}

async function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!username || !password) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const res = await fetch("YOUR_BACKEND_URL/login2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      localStorage.setItem("user", JSON.stringify(data.user));
      showMainContent();
      updateProfileBar();
    }
  } catch (err) {
    alert("⚠️ Error connecting to server.");
  }
}

function updateProfileBar() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    document.getElementById("profile-username").textContent = user.username;
  }
}

document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("user");
  document.getElementById("main-content").style.display = "none";
  document.getElementById("auth-container").style.display = "flex";
});

window.addEventListener("load", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    showMainContent();
    updateProfileBar();
  }
});


// === LOGIN & PROFILE DISPLAY ===
let currentUser = null;

function loginUser(username) {
  currentUser = username;
  document.getElementById("auth-container").style.display = "none";
  document.getElementById("main-content").style.display = "block";
  showProfile();
}

function showProfile() {
  const profileContainer = document.getElementById("profile");
  if (!profileContainer) {
    const container = document.getElementById("main-content");
    const profileDiv = document.createElement("div");
    profileDiv.id = "profile";
    profileDiv.style.display = "flex";
    profileDiv.style.justifyContent = "space-between";
    profileDiv.style.alignItems = "center";
    profileDiv.style.width = "100%";
    profileDiv.style.marginBottom = "10px";

    const userText = document.createElement("span");
    userText.textContent = `Logged in as: ${currentUser}`;
    profileDiv.appendChild(userText);

    const logoutBtn = document.createElement("button");
    logoutBtn.textContent = "Logout";
    logoutBtn.id = "logout-btn";
    logoutBtn.onclick = logout;
    profileDiv.appendChild(logoutBtn);

    container.prepend(profileDiv);
  }
}

function logout() {
  currentUser = null;
  document.getElementById("main-content").style.display = "none";
  document.getElementById("auth-container").style.display = "flex";
  document.getElementById("chatBox").innerHTML = "";
}

// === CHAT SYSTEM ===
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
document.getElementById("send-btn").addEventListener("click", sendMessage);

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  userInput.value = "";

  // Show typing indicator
  const typingMsg = addMessage("...", "ai", true);

  try {
    let reply;
    // Intercept AI origin question
    if (/who.*created.*you|who.*made.*you/i.test(message)) {
      reply = "I was created by Ayush.";
    } else {
      const res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
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

// === AI Typing Effect + Read More ===
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

