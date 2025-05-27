"# perplexity_hackathon" 


social media related, fact checking from online posts etc, reading in between lines and all
----
1. Fact-Checking & Misinformation Detector:
    * Concept: A browser extension or web app that can analyze claims from articles, social media posts, or news headlines and instantly provide a factual assessment with relevant citations from trustworthy sources.
    * Sonar Use: Sonar's core strength in factuality and citations makes this a natural fit. It can quickly cross-reference claims against current web information.
    * Innovation: Could integrate with news aggregators or social media feeds to provide "on-the-fly" fact-checks.
----
2. Fact-Checking Browser Extension
   - Description: Develop a browser extension that uses the Sonar API to fact-check claims on web pages in real time. Users highlight text, and the extension verifies the information using Sonar’s search capabilities, displaying results with citations in a pop-up.
   - Why It Fits: Sonar’s real-time web access and focus on factuality (evidenced by its high SimpleQA benchmark score) make it perfect for verifying information. The API’s citation feature ensures transparency.[](https://www.analyticsvidhya.com/blog/2025/01/perplexity-sonar-api/)[](https://www.reddit.com/r/perplexity_ai/comments/1i6rd9b/introducing_sonar_perplexitys_api_sonar_is_the/)
   - Features:
     - Highlight-to-check functionality for quick fact verification.
     - Visual indicators (e.g., green for verified, red for disputed) with source citations.
     - Option to dive deeper into claims using Sonar Deep Research.
     - Support for multiple languages or domains using search_domain_filter.
   - Tech Stack: JavaScript for the browser extension, Sonar API for fact-checking, and a simple UI for displaying results.
   - Hackathon Alignment: Addresses reasoning through complex tasks by helping users critically evaluate online information.
----
3. "Fact or Myth" Chrome Extension  
    Idea: Highlight text on any webpage → Sonar checks its accuracy (e.g., "Is it true that Vikings wore horned helmets?").  
    Features:  
    - One-click fact-checking with cited sources.  
    - Save disputed claims to a personal "fact library."  

    Why?  
    Combats misinformation, aligning with Perplexity’s mission.

****