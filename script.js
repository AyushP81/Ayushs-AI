const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("send-btn");

// Append user/AI messages
function appendMessage(sender, message) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender);
  msgDiv.innerHTML = `<strong>${sender === "user" ? "🧑‍💻 You" : "🤖 Ayush’s AI"}:</strong> ${message}`;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
}

// Typing animation
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

// Send user message to backend
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
    appendMessage("ai", data.reply || "⚠️ Error: Could not get response.");

  } catch (error) {
    removeTyping();
    appendMessage("ai", "⚠️ Error: Could not connect to server.");
  }
}

sendBtn.addEventListener("click", sendMessage);


async function signup() {
    const username = document.getElementById("signup-username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    const res = await fetch("YOUR_BACKEND_URL/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, email, password})
    });
    const data = await res.json();
    document.getElementById("auth-message").innerText = data.error || data.success;
}

async function login() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const res = await fetch("YOUR_BACKEND_URL/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password})
    });
    const data = await res.json();
    document.getElementById("auth-message").innerText = data.error || data.success;
}











