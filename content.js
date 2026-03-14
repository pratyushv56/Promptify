

function waitForInput() {


  const inputArea = document.querySelector(
    '[role="textbox"][contenteditable="true"]'
  );

  const button = document.createElement("button");

  button.style.cursor ="pointer";

  async function getPrompt(userInput) {
    try {
      const response = await fetch("http://localhost:3000/get-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput }),
      });


       if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Request failed");
    }
      const data = await response.json();
      
      console.log("Prompt response:", data.response);

      
      return data.response;

    } catch (error) {
      console.error("Error fetching prompt:", error);
    }

  }

button.textContent="Promptify";
button.id="promptify-button";
button.style.backgroundColor="rgba(104, 59, 159, 0.8)";
button.style.color="white";
button.style.border="none";
button.style.padding="10px 20px";
button.style.borderRadius="10px";
button.style.marginLeft="78%";


let isLoading = false;

button.style.cursor ="pointer";


button.onclick = async(e) => {
  e.preventDefault();
  e.stopPropagation();
  const userInput = inputArea.innerText.trim();

  if(isLoading) {
    console.log("Already loading...");
    return;
  }

  if(userInput === "") {
    console.error("User input is empty");
    button.textContent="Promptify";
    return;
  }
 

  if (!userInput) {
    console.error("User input is empty");
    return;
  }
isLoading = true;
    button.textContent="...";
  button.style.backgroundColor="rgba(58, 31, 92, 0.73)";

  chrome.runtime.sendMessage(
    {
      type: "GET_PROMPT",
      userInput: userInput,
    },
    (response) => {
      if (response && response.success) {
        inputArea.innerText = response.response;
      } else {
        console.error("Failed to get prompt");
      }

        isLoading = false;
   button.style.backgroundColor="rgba(104, 59, 159, 0.8)";
  
    button.textContent="Promptify";
    }

  
  );
 
};
  //takes time for the input area to load, so we wait until it appears

  
  if (inputArea&&!document.getElementById("promptify-button")) { //second condtion ensures that button not added again if already exists.
    console.log("Found input");
    inputArea.parentElement.appendChild(button);
   

  }

    else {
    setTimeout(waitForInput, 500);
  }
  button.textContent="Promptify";










}

waitForInput();

  const observer = new MutationObserver(() => {
      //reacts to dynamic changes in DOM caused by react or similar frameworks...adds button if absent.
      waitForInput();
    
  });

   observer.observe(document.body, { childList: true, subtree: true });