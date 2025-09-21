

function getResponse() {
  const input = document.getElementById("userInput").value.toLowerCase();
  const responseBox = document.getElementById("responseBox");

  let reply = "";

  // Rule-based AI
  if (input.includes("hello")) {
    reply = "Hey Ayush! 👋 Welcome to your AI.";
  } else if (input.includes("how are you")) {
    reply = "I'm doing great, thanks for asking! 😃";
  } else if (input.includes("bye")) {
    reply = "Goodbye Ayush! 👋";
  } else if (input.includes("who made you")) {
    reply = "I was created by Ayush Padaruth, the legend himself! 🚀";
  } else if (input.includes("joke")) {
    reply = "Why did the computer show up at work late? It had a hard drive! 😆";
  } else {
    reply = "Hmm 🤔 I don’t know that yet. Ayush can teach me more!";
  }

  responseBox.innerHTML = "🤖 Ayush's AI says: " + reply;
}







