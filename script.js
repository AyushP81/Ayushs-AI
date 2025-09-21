

function getResponse() {
  const input = document.getElementById("userInput").value.toLowerCase();
  const responseBox = document.getElementById("responseBox");

  let reply = "";

  // Rule-based AI responses
  if (input.includes("hello")) {
    reply = "Hey Ayush! 👋 Welcome to your AI.";
  } else if (input.includes("how are you")) {
    reply = "I'm doing great, thanks for asking! 😃";
  } else if (input.includes("bye")) {
    reply = "Goodbye Entity! 👋";
  } else if (input.includes("who made you")) {
    reply = "I was created by Ayush Padaruth, the legend himself! 🚀";
  } else if (input.includes("joke")) {
    reply = "Why did the computer show up at work late? It had a hard drive! 😆";
  } else if (input.includes("do you know joshua martin?")) {
    reply = "Ah, Joshua Martin? Of course I know him! That guy is basically a legend in the F1 world of everyday life. 🏎️💨 He probably treats his breakfast like a pit stop, his homework like a Grand Prix, and his weekend like the championship race itself. Honestly, if he ever got behind the wheel of an actual F1 car, I’d bet he’d try to drift around every corner while cheering for his favorite driver at the same time! 😂";
  } else if (input.includes("josh") && input.includes("f1")) {
    reply = "Ah, Joshua Martin loves F1? No wonder he’s always racing to finish his homework! 🏎️💨😂";
  } else {
    reply = "Hmm 🤔 I don’t know that yet. Ayush still needs to teach me!";
  }

  // Clear previous text
  responseBox.innerHTML = "";
  let i = 0;

  // Smooth typing effect
  function typeWriter() {
    if (i < reply.length) {
      responseBox.innerHTML += reply.charAt(i);
      i++;
      setTimeout(typeWriter, 20); // adjust speed here
    }
  }
  typeWriter();
}








