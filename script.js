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
  const username = document.getElementById("signup-username").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  if (!username || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  localStorage.setItem("user", JSON.stringify({ username, email, password }));
  showMainContent();
}

function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;
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
  document.getElementById("main-content").style.display = "block";
}

// === CHAT SYSTEM ===
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");

document.getElementById("send-btn").addEventListener("click", sendMessage);

function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  userInput.value = "";

  setTimeout(() => {
    getAIResponse(message);
  }, 1000);
}

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function getAIResponse(userMessage) {
  let response = "";

  if (userMessage.toLowerCase().includes("hello")) {
    response = "Hi there! 😊 How can I assist you today?";
  } else if (userMessage.toLowerCase().includes("artificial intelligence")) {
    response = `
Artificial Intelligence (AI) is the simulation of human intelligence in machines. 
It allows computers to learn, reason, and make decisions.

AI is used in:
- Self-driving cars 🚗
- Virtual assistants (like Siri or Alexa)
- Recommendation systems (Netflix, YouTube)
- Healthcare and robotics 🤖

Would you like to learn about how AI *learns* or how it’s *used* in daily life?
    `;
  } else {
    response = "I'm still learning 🧠, but I’ll try my best to help you!";
  }

  showTypingEffect(response);
}

// === AI Typing Effect + "Read More" Toggle ===
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
