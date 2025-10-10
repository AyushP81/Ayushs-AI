

document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chatBox");
  const userInput = document.getElementById("userInput");
  const sendBtn = document.querySelector("button.play");

  // Your working backend URL
  const BACKEND_URL = "https://c9c8428f-7614-4a94-a4a6-b7ca87e60153-00-1z22thnwna9oh.riker.replit.dev/chat";

  // Add message to chat
  function addMessage(sender, text) {
    // Limit message length
    if (text.length > 1000) text = text.substring(0, 1000) + "...";

    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.textContent = text; // safe rendering
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Send message to backend
  async function sendMessage() {
    const input = userInput.value.trim();
    if (!input) return;

    // Add user message
    addMessage("user", `🧑‍💻 You: ${input}`);
    userInput.value = "";

    // Add typing message
    const typingMsg = document.createElement("div");
    typingMsg.classList.add("message", "ai", "typing");
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

      // Remove typing message
      typingMsg.remove();

      // Get AI reply safely
      let reply = data.reply || "⚠️ Error: AI returned empty response";

      // Truncate extremely long responses
      if (reply.length > 1000) reply = reply.substring(0, 1000) + "...";

      // Simulate typing delay
      const typingDelay = Math.min(reply.length * 20, 1500); // 20ms per character, max 1.5s
      setTimeout(() => {
        addMessage("ai", `🤖 Ayush’s AI: ${reply}`);
      }, typingDelay);

    } catch (error) {
      typingMsg.remove();
      addMessage("ai", "⚠️ Error: Could not connect to backend.");
      console.error(error);
    }
  }

  // Send message on button click
  sendBtn.addEventListener("click", sendMessage);

  // Send message when pressing Enter (without shift)
  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
});



















