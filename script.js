const chatBox = document.getElementById("chatBox");
const textarea = document.getElementById("userInput");
const sendBtn = document.getElementById("send-btn");

let isWaitingForAI = false;

// Button click
sendBtn.addEventListener("click", () => {
  if (!isWaitingForAI) sendMessage();
});

// Enter key
textarea.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey && !isWaitingForAI) {
    e.preventDefault();
    sendMessage();
  }
});

// Add message to chat
function addMessageToChat(content, role, typing = false) {
  const msg = document.createElement("div");
  msg.classList.add("message", role);
  if (typing) msg.classList.add("typing");
  msg.textContent = content;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}

// Update existing message (used for typing)
function updateMessage(msgElement, newContent) {
  msgElement.textContent = newContent;
  msgElement.classList.remove("typing");
}

// Simple delay function
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Send message function
async function sendMessage() {
  const message = textarea.value.trim();
  if (!message) return;

  textarea.value = "";
  addMessageToChat(message, "user");

  isWaitingForAI = true;
  const typingMsg = addMessageToChat("Ayush’s AI is typing...", "ai", true);

  try {
    const response = await fetch("YOUR_BACKEND_URL/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) throw new Error(`HTTP error ${response.status}`);

    const data = await response.json();
    // small delay to simulate typing
    await delay(500 + Math.random() * 800);

    updateMessage(typingMsg, data.reply);

  } catch (err) {
    updateMessage(typingMsg, `⚠️ Error: Could not get response. ${err.message}`);
  } finally {
    isWaitingForAI = false;
  }
}










