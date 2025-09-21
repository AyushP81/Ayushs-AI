

async function getResponse() {
  let input = document.getElementById("userInput").value;
  let responseBox = document.getElementById("responseBox");

  responseBox.innerHTML = "⏳ Thinking...";

  try {
    const response = await fetch("https://ayush-ai-backend.ayush.repl.co/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    });

    const data = await response.json();
    responseBox.innerHTML = "🤖 Ayush's AI says: " + data.response;
  } catch (err) {
    responseBox.innerHTML = "⚠️ Error: Could not connect to backend.";
  }
}


