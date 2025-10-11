const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("send-btn");

function appendMessage(sender, message) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender);
  msgDiv.innerHTML = `<strong>${sender==="user"?"🧑‍💻 You":"🤖 Ayush's AI"}:</strong> ${message}`;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showTyping() {
  const typingDiv = document.createElement("div");
  typingDiv.id = "typing";
  typingDiv.classList.add("message", "ai");
  typingDiv.innerHTML = `<strong>🤖 Ayush's AI:</strong> <span class="dots">Typing<span>.</span><span>.</span><span>.</span></span>`;
  chatBox.appendChild(typingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTyping() {
  const typingDiv = document.getElementById("typing");
  if (typingDiv) typingDiv.remove();
}

sendBtn.addEventListener("click", sendMessage);

async function sendMessage() {
  const message = userInput.value.trim();
  if(!message) return;
  appendMessage("user", message);
  userInput.value="";
  showTyping();

  try {
    const res = await fetch("YOUR_BACKEND_URL/chat", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({message})
    });
    const data = await res.json();
    removeTyping();
    appendMessage("ai", data.reply || "⚠️ Error: Could not get response.");
  } catch (e) {
    removeTyping();
    appendMessage("ai","⚠️ Error: Could not connect to server.");
  }
}

// --- Sign-up/Login ---
async function signup() {
  const username = document.getElementById("signup-username").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  // replace with your backend
  const res = await fetch("YOUR_BACKEND_URL/signup", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({username,email,password})
  });
  const data = await res.json();
  const msg = document.getElementById("auth-message");
  msg.innerText = data.error || data.success;
  if(data.success){
    document.getElementById("signup-form").style.display="none";
    document.getElementById("login-form").style.display="flex";
  }
}

async function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  const res = await fetch("YOUR_BACKEND_URL/login", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({username,password})
  });
  const data = await res.json();
  const msg = document.getElementById("auth-message");
  msg.innerText = data.error || data.success;

  if(data.success){
    document.querySelector(".auth-container").style.display="none";
    document.getElementById("main-content").style.display="flex";
  }
}
