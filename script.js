

async function getResponse() {
  const input = document.getElementById("userInput").value;
  const responseBox = document.getElementById("responseBox");

  responseBox.innerHTML = "⏳ Thinking...";

  try {
    const response = await fetch("https://c9c8428f-7614-4a94-a4a6-b7ca87e60153-00-1z22thnwna9oh.riker.replit.dev/chat", {
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






