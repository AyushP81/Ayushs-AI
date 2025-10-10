const chatBox = document.getElementById("chatBox");
const textarea = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

let isWaitingForAI = false;

sendBtn.addEventListener("click", () => {
  if (!isWaitingForAI) sendMessage();
});

textarea.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !isWaitingForAI) {
    e.preventDefault(); // prevent newline
    sendMessage();
  }
});

function addMessageToChat(content, role, typing = false) {
  const msg = document.createElement("div");
  msg.classList.add("message", role);
  if (typing) msg.classList.add("typing");
  msg.textContent = content;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}

function updateMessage(msgElement, newContent) {
  msgElement.textContent = newContent;
  msgElement.classList.remove("typing");
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
    await delay(500 + Math.random() * 800);

    updateMessage(typingMsg, data.reply);

  } catch (err) {
    updateMessage(typingMsg, `⚠️ Error: Could not get response. ${err.message}`);
  } finally {
    isWaitingForAI = false;
  }
}















