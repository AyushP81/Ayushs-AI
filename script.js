

async function getResponse() {
  const input = document.getElementById("userInput").value;
  const responseBox = document.getElementById("responseBox");

  responseBox.innerHTML = "⏳ Thinking...";

  try {
    const response = await fetch("https://python-template.ayushpadaruth20.replit.dev/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: input })
    });

    const data = await response.json();
    responseBox.innerHTML = "🤖 Ayush's AI says: " + data.response;

  } catch (err) {
    responseBox.innerHTML = "⚠️ Error: Could not connect to backend.";
  }
}





