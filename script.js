

async function getResponse() {
  let input = document.getElementById("userInput").value;
  let responseBox = document.getElementById("responseBox");

  responseBox.innerHTML = "⏳ Thinking...";

  const response = await fetch(
    "https://api-inference.huggingface.co/models/google/flan-t5-small",
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: input })
    }
  );

  const result = await response.json();

  if (result.error) {
    responseBox.innerHTML = "⚠️ Error: " + result.error;
  } else {
    responseBox.innerHTML = "🤖 Ayush's AI says: " + result[0].generated_text;
  }
}
