

const chatBox = document.getElementById("chatBox");

function sendMessage() {
  const inputEl = document.getElementById("userInput");
  const input = inputEl.value.trim();
  if (!input) return;
  
  // Show user message
  const userMsg = document.createElement("div");
  userMsg.classList.add("message","user");
  userMsg.textContent = input;
  chatBox.appendChild(userMsg);

  inputEl.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  // Typing indicator
  const typing = document.createElement("div");
  typing.classList.add("message","ai","typing");
  typing.textContent = "Ayush's AI is typing...";
  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;

  setTimeout(() => {
    typing.remove();
    // AI response
    const aiMsg = document.createElement("div");
    aiMsg.classList.add("message","ai");
    aiMsg.textContent = getAIResponse(input.toLowerCase());
    chatBox.appendChild(aiMsg);
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 800 + Math.random()*800); // random typing delay
}

function getAIResponse(input) {
  let reply = ""; // make sure reply is defined

  if (input.includes("hello")) reply = "Hello there! 👋 Welcome to Ayush’s AI.";
  else if (input.includes("how are you")) reply = "I'm doing great, thanks for asking! 😃";
  else if (input.includes("bye")) reply = "Goodbye! 👋";
  else if (input.includes("who made you")) reply = "I was created by Ayush Padaruth, the legend himself! 🚀";
  else if (input.includes("joke")) reply = "Why did the computer show up at work late? It had a hard drive! 😆";
  else if (input.includes("do you know joshua martin")) reply = "Ah, Joshua Martin? Of course I know him! That guy is basically a legend in the F1 world of everyday life. 🏎️💨 He probably treats his breakfast like a pit stop, his homework like a Grand Prix, and his weekend like the championship race itself. Honestly, if he ever got behind the wheel of an actual F1 car, I’d bet he’d try to drift around every corner while cheering for his favorite driver at the same time! 😂";
  else if (input.includes("josh") && input.includes("f1")) reply = "Ah, Josh loves F1? No wonder he’s always racing to finish his homework! 🏎️💨😂";
  else if (input.includes("do you know thej moodley")) {
    const responses = [
        "Ah, Thej Moodley? With hair that long, I’m surprised he doesn’t get mistaken for a Marvel superhero! 🦸‍♂️✨",
        "Of course I know Thej! His hair is basically a Wi-Fi antenna… I swear my signal improves when he walks by! 📡😂",
        "Yep, Thej Moodley. Legend says his hair has its own weather forecast — cloudy with a chance of shampoo! 🌦️🧴",
        "Who doesn’t know Thej Moodley? With that hair, he could start his own shampoo commercial franchise! 💇‍♂️✨",
        "Oh, Thej? His hair is so long, I’m convinced he hides USB cables in there. 🔌😂"
    ];
    reply = responses[Math.floor(Math.random() * responses.length)];
  } else {
    reply = "Hmm 🤔 I don’t know that yet.";
  }

  return reply; // important: return the reply
}
















