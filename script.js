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

  if (signupForm.style.display === "none") {
    signupForm.style.display = "flex";
    loginForm.style.display = "none";
  } else {
    signupForm.style.display = "none";
    loginForm.style.display = "flex";
  }
}

function signup() {
  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();

  if (!username || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  localStorage.setItem("user", JSON.stringify({ username, email, password }));
  showMainContent();
}

function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  // Secret admin login
  if (username === "admin" && password === "admin123") {
    showMainContent();
    return;
  }

  if (!storedUser) {
    alert("No account found. Please sign up first.");
    return;
  }

  if (storedUser.username === username && storedUser.password === password) {
    showMainContent();
  } else {
    alert("Incorrect username or password.");
  }
}

function showMainContent() {
  document.getElementById("auth-container").style.display = "none";
  document.getElementById("main-content").style.display = "flex";
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

  showTyping();

  try {
    const response = await fetch("https://c9c8428f-7614-4a94-a4a6-b7ca87e60153-00-1z22thnwna9oh.riker.replit.dev/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    removeTyping();

    const aiText = data?.response || "⚠️ Could not get a response.";
    showTypingEffect(aiText);

  } catch (error) {
    removeTyping();
    addMessage("⚠️ Could not connect to server.", "ai");
    console.error(error);
  }
}

// === MESSAGES ===
function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// === TYPING INDICATOR ===
function showTyping() {
  const typingDiv = document.createElement("div");
  typingDiv.id = "typing";
  typingDiv.classList.add("message", "ai");
  typingDiv.textContent = "🤖 Ayush’s AI is typing...";
  chatBox.appendChild(typingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTyping() {
  const typingDiv = document.getElementById("typing");
  if (typingDiv) typingDiv.remove();
}

// === AI TYPING EFFECT + READ MORE / COLLAPSE ===
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
      textContainer.textContent += fullText.charAt(index);
      index++;
      chatBox.scrollTop = chatBox.scrollHeight;
      setTimeout(type, typingSpeed);
    } else {
      // Add Read More if text is long
      if (fullText.length > 400) {
        const shortText = fullText.slice(0, 400) + "...";
        textContainer.textContent = shortText;

        const readMore = document.createElement("button");
        readMore.textContent = "Read More";
        readMore.classList.add("read-more");

        let expanded = false;
        readMore.onclick = () => {
          if (!expanded) {
            textContainer.textContent = fullText;
            readMore.textContent = "Collapse";
            expanded = true;
          } else {
            textContainer.textContent = shortText;
            readMore.textContent = "Read More";
            expanded = false;
          }
        };

        msg.appendChild(readMore);
      }
    }
  }
  type();
}
