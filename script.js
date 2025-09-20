

function getResponse() {
  let input = document.getElementById("userInput").value;
  let responseBox = document.getElementById("responseBox");

  // For now: just a fake AI response
  responseBox.innerHTML = "🤖 Ayush's AI says: " + input.split("").reverse().join("");
}