

document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chatBox");
  const userInput = document.getElementById("userInput");
  const sendBtn = document.querySelector("button.play");

  // Your working backend URL
  const BACKEND_URL = "https://c9c8428f-7614-4a94-a4a6-b7ca87e60153-00-1z22thnwna9oh.riker.replit.dev/chat";

  // Clean repeated characters/emojis & limit total emojis
  function cleanAIReply(text) {
    // Limit sequences of more than 3 identical characters/emojis
    text = text.replace(/(.)\1{3,}/g, "$1$1$1");

    // Limit total emojis to max 10, replace excess with "…"
    let emojis = text.match(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu) || [];
    if (emojis.length > 10) {
      text = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim() + " …";
    }

    return text;
  }


  const recentMessages = chatHistory.slice(-6).map(msg => ({
    role: msg.sender === "user" ? "user" : "assistant",
    content: msg.text
}));
  // Add message to chat
  function addMessage(sender, text) {
    // Limit message length
    if (text.length > 1000) text = text.substring(0, 1000) + "...";

    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.textContent = text;
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
      typingMsg.remove();

      let reply = data.reply || "⚠️ Error: AI returned empty response";
      reply = cleanAIReply(reply);

      // Truncate extremely long responses
      if(reply.length > 1000) reply = reply.substring(0, 1000) + "...";

      // Simulate typing delay
      const typingDelay = Math.min(reply.length * 20, 1500);
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

  // Send message on Enter (without shift)
  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
});




















