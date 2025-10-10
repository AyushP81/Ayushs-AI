


const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("send-btn");

// Replace with your backend URL
const BACKEND_URL = "https://python.ayushpadaruth20.repl.co/chat";

// Add message function
function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Send message function with typing animation
async function sendMessage() {
  const input = userInput.value.trim();
  if (!input) return;

  addMessage("user", input);
  userInput.value = "";

  // Typing indicator
  const typingMsg = document.createElement("div");
  typingMsg.classList.add("ai", "typing");
  typingMsg.textContent = "🤖 Ayush’s AI is typing...";
  chatBox.appendChild(typingMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await response.json();

    // Simulate typing delay
    setTimeout(() => {
      typingMsg.remove();
      addMessage("ai", data.reply);
    }, 1000 + Math.min(input.length * 50, 2000));

  } catch (error) {
    typingMsg.remove();
    addMessage("ai", "⚠️ Error: Could not connect to backend.");
    console.error(error);
  }
}

// Send on button click
sendBtn.addEventListener("click", sendMessage);

// Send on Enter key
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});



















