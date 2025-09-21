

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
  if (input.includes("hello")) return "Hello there! 👋 Welcome to Ayush’s AI..";
  if (input.includes("how are you")) return "I'm doing great, thanks for asking! 😃";
  if (input.includes("bye")) return "Goodbye! 👋";
  if (input.includes("who made you")) return "I was created by Ayush Padaruth, the legend himself! 🚀";
  if (input.includes("joke")) return "Why did the computer show up at work late? It had a hard drive! 😆";
  if (input.includes("do you know joshua martin")) return "Ah, Joshua Martin? Of course I know him! That guy is basically a legend in the F1 world of everyday life. 🏎️💨 He probably treats his breakfast like a pit stop, his homework like a Grand Prix, and his weekend like the championship race itself. Honestly, if he ever got behind the wheel of an actual F1 car, I’d bet he’d try to drift around every corner while cheering for his favorite driver at the same time! 😂";
  if (input.includes("josh") && input.includes("f1")) return "Ah, Josh loves F1? No wonder he’s always racing to finish his homework! 🏎️💨😂";
  if (input.includes("do you know thej moodley")) return "Ah, Thej Moodley? 😏 Of course! With hair that long, I bet he has a Wi-Fi hotspot somewhere in there! 🌪️💻 Just don’t get caught in a breeze near him!"
  return "Hmm 🤔 I don’t know that yet. Ayush can teach me more!";
}













