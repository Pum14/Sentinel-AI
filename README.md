# Sentinel-AI
An AI companion that de-escalates negativity.

# 🧠 Algorithmic De-escalator

# Project Overview
The **Algorithmic De-escalator** is a web-based chat application designed to detect toxic language in user messages, rephrase them into respectful language, and provide real-time de-escalation responses. It helps create a positive and safe online conversation environment by moderating abusive or aggressive messages.

## Key features:
- Detects toxic language using Hugging Face's `toxic-bert` model.
- Replaces abusive words with polite alternatives.
- Provides calming responses to potentially aggressive messages.
- Blocks users temporarily if messages repeatedly contain toxic content.
- Provides friendly responses for positive and neutral messages.
- Displays toxicity analysis in real-time.

---

## Project Structure
Algorithmic-De-escalator/
├── index.html # HTML structure of the chat interface
├── style.css # Styling and layout of the chat application
├── script.js # JavaScript logic for toxicity detection, sentiment analysis, and chat handling
└── README.md # Project documentation

---

## Technologies & Tools Used
- **HTML5** – Structure of the webpage
- **CSS3** – Styling and layout
- **JavaScript (ES6)** – Client-side logic
- **Hugging Face API** – For toxicity detection and sentiment analysis
  - Model for toxicity: `unitary/toxic-bert`
  - Model for sentiment: `facebook/bart-large-mnli`
- **Web Browser** – Chrome, Edge, or Firefox recommended

---

## Prerequisites
- Internet connection (required for Hugging Face API requests)
- Modern web browser (Chrome, Firefox, Edge)
- Text editor (VS Code, Sublime Text, or similar)
- Optional: Local server (like **Live Server** extension in VS Code) for better HTML rendering

---

## Setup & Usage

1. Clone or download the project repository:
```bash
git clone <your-repo-url>

2. Open the project folder in a code editor.

3. Install the Live Server extension (if using VS Code) or use any local server to host the index.html file.

4. Open index.html in your browser. The chat interface will appear.

5. Type messages in the input box and click Send or press Enter.

6. Observe the following:

Toxic messages are rephrased automatically.
Calming messages are displayed for repeated toxic behavior.
Users may be temporarily blocked if violations continue.
Friendly responses appear for neutral or positive messages.
Toxicity analysis is displayed below the chat box.

7. To run this project, rename config.example.js to config.js and add your Hugging Face API token.

## API Configuration
1. Replace the HF_TOKEN variable in script.js with your Hugging Face API key.

const HF_TOKEN = "your_huggingface_api_key_here";

2. The models used in this project:

unitary/toxic-bert → Detects toxic language
facebook/bart-large-mnli → Detects sentiment of messages


## Usage Example
User sends: "You are so stupid!"
System rephrases: "You are so silly!"
Bot responds with: "Let's try to keep things respectful 😊"

User sends a positive message: "I love this chat!"
Bot responds with: "That's nice! 😄"


## Notes
The application works best with a reliable internet connection since API requests are sent to Hugging Face servers.

Violation thresholds and block durations can be adjusted in script.js:

const maxShortBlock = 6;   // Maximum allowed violations before a long block
Toxicity threshold is currently set to 0.7 (70%).


## Credits
Hugging Face: https://huggingface.co
BERT and BART models for NLP tasks
Icons and emojis used in chat interface


## License
This project is open-source and free to use for educational purposes.