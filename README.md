<!-- <div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div> -->
### Features
- Upload or drag-and-drop any component image 
- Multimodal Gemini 1.5 Flash understands what the product is
- Real-time Google Search for current market prices
- Smart RAG layer pulls specs & competitor data (just add documents that you want to be considered).
- Calculates your profit margin, ROI, and risk score for ReX


  
## Run The App

**Prerequisites:**  Node.js

```bash
git clone https://github.com/aaflakiyan/ReX-vision.git
cd ReX-vision
cp .env.example .env.local

# Get your api key → https://aistudio.google.com/app/apikey
# Paste it into .env.local as GEMINI_API_KEY=...

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` to your Gemini API key
3. Run the app:
   `npm run dev`
