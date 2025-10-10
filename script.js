const chatBox = document.getElementById("chatBox");
const textarea = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", sendMessage);
textarea.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// Add a message to the chat
function addMessageToChat(content, role, typing = false) {
  const msg = document.createElement("div");
  msg.classList.add("message", role);
  if (typing) msg.classList.add("typing");
  msg.textContent = content;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}

// Update a message (used for replacing typing placeholder)
function updateMessage(msgElement, newContent) {
  msgElement.textContent = newContent;
  msgElement.classList.remove("typing");
}

// Simulate typing delay
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendMessage() {
  const message = textarea.value.trim();
  if (!message) return;

  // Show user's message
  addMessageToChat(message, "user");
  textarea.value = "";

  // Show AI typing
  const typingMsg = addMessageToChat("Ayush’s AI is typing...", "ai", true);

  try {
    const response = await fetch("YOUR_BACKEND_URL/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) throw new Error(`HTTP error ${response.status}`);

    const data = await response.json();
    
    // Small delay to simulate typing
    await delay(500 + Math.random() * 800);

    updateMessage(typingMsg, data.reply);

  } catch (err) {
    updateMessage(typingMsg, `⚠️ Error: Could not get response. ${err.message}`);
  }
}
















