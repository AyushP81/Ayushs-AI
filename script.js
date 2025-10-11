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

async function signup() {
  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();

  if (!username || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const res = await fetch("https://c9c8428f-7614-4a94-a4a6-b7ca87e60153-00-1z22thnwna9oh.riker.replit.dev/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      alert(data.success);
      showMainContent();
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
    const res = await fetch("https://c9c8428f-7614-4a94-a4a6-b7ca87e60153-00-1z22thnwna9oh.riker.replit.dev/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      alert(data.success);
      showMainContent();
    }
  } catch (err) {
    alert("⚠️ Error connecting to server.");
  }
}

function showMainContent() {
  document.getElementById("auth-container").style.display = "none";
  document.getElementById("main-content").style.display = "block";
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
    const res = await fetch("https://c9c8428f-7614-4a94-a4a6-b7ca87e60153-00-1z22thnwna9oh.riker.replit.dev/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    if (data.reply) {
      chatBox.removeChild(typingMsg);
      showTypingEffect(data.reply);
    } else {
      chatBox.removeChild(typingMsg);
      showTypingEffect("⚠️ Error: No response from AI.");
    }
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

// === AI Typing Effect + "Read More" ===
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
      // Add Read More button if text is long
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

