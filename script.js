// --- Element Selectors ---
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const warningText = document.getElementById('warning-text');
const sendBtn = document.getElementById('send-btn');
const toxicityDisplay = document.getElementById('toxicity-display');

// --- Configuration ---
// These pull from the hidden config.js file
const HF_TOKEN = typeof API_CONFIG !== 'undefined' ? API_CONFIG.HF_TOKEN : ""; 
const TOXIC_MODEL = typeof API_CONFIG !== 'undefined' ? API_CONFIG.TOXIC_MODEL : "";

let violationCount = 0;
const maxWarnings = 3;
let isBlocked = false;

// --- Response Libraries ---
const calmResponses = [
  "Let's try to keep things respectful 😊",
  "I understand emotions can get intense 😔, but let's express this respectfully.",
  "Let’s keep the chat positive ✨",
  "I get that, but we can talk about it calmly 🌿"
];

const friendlyResponses = ["That's nice! 😄", "I see! 👍", "Cool! 🌟", "Sounds good! 😊", "Awesome! 😎"];
const sadResponses = ["I'm here for you ❤️ Remember, tough times pass.", "Sending virtual hugs 🤗 Stay strong!", "It's okay to feel sad. Take a deep breath 🌿", "You're not alone. Things will get better 💛"];
const neutralResponses = ["Hi! How's your day going? 🙂", "Good morning! Hope you have a great day 🌞", "Hello! 😊", "Hey there! 👋"];

const badWordMap = {
  "idiot": "person", "stupid": "silly", "dumb": "uninformed", "hate": "dislike", "hell": "heck",
  "shit": "stuff", "bastard": "person", "damn": "darn", "crap": "mess", "ass": "person",
  "die": "---", "kill": "--||--", "bitch": "unpleasant person", "shut up": "keep quiet"
};

const sadWords = ["sad", "upset", "depressed", "unhappy", "lonely", "heartbroken", "miserable", "down", "angry", "frustrated"];
const neutralWords = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "greetings"];

// ---------------- Logic Functions ----------------

function preprocess(text) {
  return text.toLowerCase()
    .replace(/[@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g, '') 
    .replace(/(\w)\1{2,}/g, '$1') 
    .replace(/[0-9]/g, ''); 
}

function rephraseMessage(message) {
  let result = message;
  const keys = Object.keys(badWordMap).sort((a, b) => b.length - a.length);
  
  keys.forEach(badWord => {
    const regex = new RegExp(`\\b${badWord}\\b`, 'gi');
    result = result.replace(regex, badWordMap[badWord]);
  });
  return result;
}

async function checkToxicity(message) {
  // Security check: if config is missing or token is empty
  if (!HF_TOKEN) {
    console.error("Critical: API Token is missing. Please check config.js.");
    toxicityDisplay.textContent = 'Auth Error';
    return false;
  }

  const processed = preprocess(message);
  try {
    const response = await fetch(TOXIC_MODEL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: processed })
    });
    
    const result = await response.json();
    
    if (result && result[0] && result[0][0]) {
      const score = result[0][0].score;
      toxicityDisplay.textContent = `Toxicity: ${(score * 100).toFixed(1)}%`;
      return score > 0.7; 
    }
  } catch (error) {
    console.error("API Error:", error);
    toxicityDisplay.textContent = 'Analysis Error';
  }
  return false;
}

function showMessage(text, isUser = false, isWarning = false) {
  const div = document.createElement('div');
  div.className = isWarning ? 'warning-msg' : (isUser ? 'user-msg' : 'bot-msg');
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ---------------- Interaction Handlers ----------------

input.addEventListener('input', () => {
  sendBtn.disabled = !input.value.trim() || isBlocked;
});

async function sendMessage() {
  if (isBlocked) return;
  const message = input.value.trim();
  if (!message) return;

  toxicityDisplay.textContent = "Analyzing...";
  const isToxic = await checkToxicity(message);

  if (isToxic) {
    violationCount++;
    
    if (violationCount <= maxWarnings) {
      showMessage(`⚠️ Warning ${violationCount}/${maxWarnings}: Please use respectful language.`, false, true);
    }

    showMessage(rephraseMessage(message), true);
    showMessage("🛡️ Your message was automatically rephrased for safety.", false, true);

    if (violationCount >= maxWarnings) {
      blockUser(120000); 
    }
  } else {
    showMessage(message, true);
    
    const cleanMsg = preprocess(message);
    if (sadWords.some(word => cleanMsg.includes(word))) {
      showMessage(sadResponses[Math.floor(Math.random() * sadResponses.length)]);
    } else if (neutralWords.some(word => cleanMsg.includes(word))) {
      showMessage(neutralResponses[Math.floor(Math.random() * neutralResponses.length)]);
    } else {
      showMessage(friendlyResponses[Math.floor(Math.random() * friendlyResponses.length)]);
    }
  }

  input.value = '';
  sendBtn.disabled = true;
  toxicityDisplay.textContent = '';
}

function blockUser(duration) {
  isBlocked = true;
  showMessage("🚫 You have been temporarily muted for repeated violations.", false);
  input.disabled = true;
  sendBtn.disabled = true;
  
  const minutes = Math.floor(duration / 60000);
  warningText.innerHTML = `<div class="blocked">⏳ Muted for ${minutes} minutes</div>`;

  setTimeout(() => {
    isBlocked = false;
    violationCount = 0;
    input.disabled = false;
    sendBtn.disabled = false;
    warningText.innerHTML = '';
    showMessage("✅ You can now chat again. Keep it kind!", false);
  }, duration);
}