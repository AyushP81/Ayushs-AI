
async function sendMessage() {
  const input = userInput.value.trim();
  if (!input) return;

  // Show user message
  const userMsg = document.createElement("div");
  userMsg.className = "message user";
  userMsg.textContent = `🧑‍💻 You: ${input}`;
  chatBox.appendChild(userMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  // Add to chatHistory
  chatHistory.push({ role: "user", content: input });

  // Only keep last 5 messages
  const recentHistory = chatHistory.slice(-5);

  // Show AI typing
  const typingMsg = document.createElement("div");
  typingMsg.className = "message ai typing";
  typingMsg.textContent = "🤖 Ayush’s AI is typing...";
  chatBox.appendChild(typingMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  userInput.value = "";

  try {
    const res = await fetch("https://c9c8428f-7614-4a94-a4a6-b7ca87e60153-00-1z22thnwna9oh.riker.replit.dev/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: input,
        history: recentHistory // only send last 5 messages
      })
    });

    const data = await res.json();
    typingMsg.remove(); // remove typing

    const aiMsg = document.createElement("div");
    aiMsg.className = "message ai";
    aiMsg.textContent = `🤖 Ayush’s AI: ${data.reply}`;
    chatBox.appendChild(aiMsg);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Add AI reply to chatHistory
    chatHistory.push({ role: "assistant", content: data.reply });

  } catch (err) {
    typingMsg.remove();
    const errorMsg = document.createElement("div");
    errorMsg.className = "message ai";
    errorMsg.textContent = `⚠️ Error: Could not connect to backend.`;
    chatBox.appendChild(errorMsg);
    chatBox.scrollTop = chatBox.scrollHeight;
    console.error(err);
  }
}



















