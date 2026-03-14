chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_PROMPT") {
    fetch("https://promptify-server-59a4.onrender.com/get-prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "serverKey": "22445009jjj"
      },
      body: JSON.stringify({ userInput: message.userInput}),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Request failed");
        }
        return response.json();
      })
      .then((data) => {
        sendResponse({ success: true, response: data.response });
      })
      .catch((error) => {
        console.error("Background fetch error:", error);
        sendResponse({ success: false });
      });

    return true; // IMPORTANT: keeps sendResponse alive for async
  }
});