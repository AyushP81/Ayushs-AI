


document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chat-box");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");

  // Replace this with your actual Replit backend URL
  const BACKEND_URL = "https://c9c8428f-7614-4a94-a4a6-b7ca87e60153-00-1z22thnwna9oh.riker.replit.dev/chat";


  const typingMsg = document.createElement("div");
  typingMsg.classList.add("ai", "typing");
  typingMsg.textContent = "🤖 Ayush’s AI is typing...";
  chatBox.appendChild(typingMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  function addMessage(sender, text) {
    const msg = document.createElement("div");
    msg.classList.add(sender);
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  async function sendMessage() {
    const input = userInput.value.trim();
    if (!input) return;

    addMessage("user", `🧑‍💻 You: ${input}`);
    userInput.value = "";

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      addMessage("ai", `🤖 Ayush’s AI: ${data.reply}`);
    } catch (error) {
      addMessage("ai", "⚠️ Error: Could not connect to backend.");
      console.error(error);
    }
  }

  // Send message on button click
  sendBtn.addEventListener("click", sendMessage);

  // Send message when pressing Enter
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});




















