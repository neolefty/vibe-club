# Seminar Plan: A Hands-On Intro to Vibe Coding with Gemini

**Goal:** For participants to experience the "flow" of conversational development and leave feeling confident they can use an AI assistant for a real task.

**Total Time:** ~60 minutes

---

#### **1. The Concept & The Hook (5-10 mins)**

*   **What is "Vibe Coding"?**
    *   Start by defining it in simple terms. It's less about giving precise, rigid commands and more about having a conversation with your AI development partner. It's about expressing *intent* and iterating quickly.
    *   **Analogy:** Frame it like pair programming. Gemini is your partner who has encyclopedic knowledge and can type really, really fast. Your job is to be the navigator, guiding the overall direction.
*   **The "Aha!" Moment:**
    *   Explain the goal isn't to replace developers, but to eliminate tedious tasks, accelerate prototyping, and help you stay in a creative flow state. You focus on the "what," and the AI helps with the "how."
*   **Why Gemini CLI?**
    *   Briefly mention what you told me: it's easy to set up, has a great free tier, and works directly in the terminal, where developers live.

---

#### **2. The "Hello, World" Moment (5 mins)**

This part is crucial for getting everyone comfortable and proving the tool works.

*   **First Interaction:** Have everyone start in this same `gemini-tutorial` directory.
*   **Icebreaker Command:** Ask them to tell Gemini: `Can you list the files here?`
    *   This is a safe, simple command that immediately shows the AI understanding the context of the current directory.
*   **Second Interaction:** Have them try: `Read the README.md file.`
    *   This demonstrates the AI's ability to interact with file content.

---

#### **3. Guided Project: Let's Mod the Snake Game (20-25 mins)**

This is the core of the seminar. Guide them through making a small, visible change to the snake game. It's visual, satisfying, and a great example.

*   **Step 1: Understand the Code.**
    *   **Prompt:** `I want to make a change to the snake game. First, can you show me the code for it?`
    *   Gemini will use `read_file` on `snake-game/snake_game.py`. Everyone sees the code and gets context.

*   **Step 2: Make a Simple Change (The Vibe in Action).**
    *   **Prompt:** `This is great. In the snake game code, can you change the snake's color from green to a nice blue?`
    *   This is a perfect "vibe" prompt. It's conversational and based on intent. I will find the `GREEN = (0, 255, 0)` variable (or similar) and replace its value. This demonstrates the power of modifying code with natural language.

*   **Step 3: Verify the Change.**
    *   **Prompt:** `Awesome. How do I run the game to see the change?`
    *   I should check the `README.md` and tell them to run `python snake-game/snake_game.py`.
    *   When they run it, they'll see a **blue snake**. This is the payoff moment!

---

#### **4. The Freestyle: Your Turn to Vibe (15 mins)**

Now that they've seen the workflow, let them drive. This is where the learning solidifies.

*   **Give them a list of "challenge" ideas:**
    *   "Change the food color to purple."
    *   "Make the background of the game black."
    *   "Double the snake's starting speed." (This is a bit harder and encourages them to ask me to find the right line of code first).
    *   "Now, let's look at the other project. Can you add a header to the `index.html` file in the tower defense game that says 'Welcome to Tower Defense!'?"
    *   "Create a new file called `ideas.md` and add some ideas for improving the snake game."

*   Encourage them to talk to Gemini naturally. If they get stuck, they can just ask, "I want to change the speed, but I'm not sure where it is in the code. Can you find it for me?"

---

#### **5. The Debrief & Best Practices (5-10 mins)**

*   **Group Discussion:** Ask everyone about their experience. What was surprising? What was cool? Where could they see themselves using this?
*   **Share Best Practices:**
    *   **Review the Code:** Always treat the AI's output like a code review from a junior developer. It's usually right, but you're still responsible for the final result.
    *   **Use Version Control:** Just like we did, commit changes frequently. It's your safety net.
    *   **Be Specific When Needed:** If a "vibe" prompt doesn't work, get a little more specific. Instead of "make it faster," you might say, "find the variable that controls speed and set it to 20."
