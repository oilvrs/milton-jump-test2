/**
 * High-score Web Component for Milton jump game.
 * 
 * @author Oliver Woodhouse
 * @version 1.0.0
 */

const template = document.createElement('template')
template.innerHTML = `
  <style>
 
@font-face {
  font-family: "Tiny5";
  src: url("./fonts/Tiny5.ttf") format("truetype");
}

@keyframes blink {
      0%, 50%, 100% { opacity: 1; }
      25%, 75% { opacity: 0.3; }
    }
    
:host {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom:60px;
}

.high-scores {
  font-family: "Tiny5", sans-serif;
  font-size: 40px;
  color: red;
  text-align: center;
}

.high-scores h3 {
  margin-bottom: 20px;
  margin-top: 0;
  font-size: 40px;
  font-weight: 300;
}

.high-scores ol {
  list-style: none;
  padding: 0;
  margin: 0;
}

.high-scores li {
  margin: 8px 0;
  font-size: 28px;
  font-weight: 300;
}

.name-input-container {
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  transition: all 0.2s;
}

.name-input-container.hidden {
  display: none;
}

.name-input {
  font-family: "Tiny5", sans-serif;
  font-size: 32px;
  font-weight: 300;
  color: red;
  text-align: center;
  max-width: 200px;
  background: transparent;
  border: none;
  outline: none;
  font-weight: 300;
  animation: blink 1.5s infinite;
}

.name-input::placeholder {
  color: rgba(255, 0, 0, 0.5);
  
}

.submit-score-btn {
  font-family: "Tiny5", sans-serif;
  font-size: 28px;
  font-weight: 300;
  padding: 10px 30px;
  background: red;
  color: white;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
  font-weight: 300;
}

.submit-score-btn:hover {
  transform: scale(1.01);
  background-color:  #c60a0aff;
}

.clear-scores-btn {
  font-family: "Tiny5", sans-serif;
   font-size: 28px;
  font-weight: 300;
  padding: 10px 30px;
  background: red;
  color: white;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
  font-weight: 300;
}

.clear-scores-btn:hover {
  color: white;
  transform: scale(1.01);
  background-color: #c60a0aff;
}

.submit-score-btn,
.clear-scores-btn {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

/* Mobile */
@media (max-width: 800px) {
  .high-scores {
    font-size: 20px;
  }
  
  .high-scores h3 {
    font-size: 26px;
    margin-bottom: 15px;
  }
  
  .high-scores li {
    font-size: 18px;
    margin: 5px 0;
  }
  
  .name-input {
    font-size: 22px;
    padding: 4px 8px;
    max-width: 200px;
  }
  
  .submit-score-btn {
    font-size: 20px;
    padding: 8px 20px;
  }
  
  .name-input-container {
    margin-bottom: 20px;
    gap: 15px;
  }

  .clear-scores-btn {
    font-size: 16px;
    padding: 6px 15px;
    margin-top: 15px;
  }
}

@media (max-width: 1100px) and (orientation: landscape) {
  .high-scores {
    font-size: 22px;
  }
  
  .high-scores h3 {
    font-size: 28px;
    margin-bottom: 10px;
  }
  
  .high-scores li {
    font-size: 18px;
    margin: 4px 0;
  }
  
  .name-input {
    font-size: 20px;
    padding: 4px 8px;
    max-width: 250px;
  }
  
  .submit-score-btn {
    font-size: 18px;
    padding: 8px 20px;
  }
  
  .name-input-container {
    margin-bottom: 15px;
    gap: 12px;
  }

  .clear-scores-btn {
    font-size: 16px;
    padding: 6px 15px;
    margin-top: 10px;
  }
}
  </style>
  <div class="high-scores">
    <h3>HIGH SCORE:</h3>
    <ol class="high-scores-list"></ol>
    
  </div>

  <div class="name-input-container hidden">
    <input type="text" class="name-input" placeholder=">enter name<" maxlength="10">
    <button class="submit-score-btn">submit score:</button>
    <button class="clear-scores-btn">CLEAR ALL SCORES</button>
  </div>
  
  
`

customElements.define('high-score',
  /**
   * High score components for milton jump.
   */
  class extends HTMLElement {
    /**
     * Reference to name input
     * @type {HTMLInputElement}
     */
    #nameInput

    /**
     * Reference to submit button
     * @type {HTMLButtonElement}
     */
    #submitBtn

    /**
     * Reference to high scores list
     * @type {HTMLOListElement}
     */
    #highScoresList

    /**
     * Reference to name input container
     * @type {HTMLDivElement}
     */
    #nameInputContainer

    /**
     * High scores array
     * @type {Array<{name: string, score: number}>}
     */
    #highScores = []

    /**
     * Current score from game
     * @type {number}
     */
    #score = 0

    /**
     * Clear score button.
     * 
     * @type {HTMLButtonElement}
     */
    #clearBtn

    /**
     * Sets up a new instance of high score.
     * 
     * @constructor
     */
    constructor() {
      super()

      // Create shadow DOM
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))

      // Get references to elements
      this.#nameInput = this.shadowRoot.querySelector('.name-input')
      this.#submitBtn = this.shadowRoot.querySelector('.submit-score-btn')
      this.#highScoresList = this.shadowRoot.querySelector('.high-scores-list')
      this.#nameInputContainer = this.shadowRoot.querySelector('.name-input-container')
      this.#clearBtn = this.shadowRoot.querySelector('.clear-scores-btn')
    }

    /**
     * Called when component is added to DOM
     */
    connectedCallback() {
  this.#loadHighScores()
  this.#displayHighScores()

  // ⛔ Stoppa ALLA pointer-events från att nå spelet
  this.addEventListener("pointerdown", e => e.stopPropagation())
  this.addEventListener("pointerup", e => e.stopPropagation())
  this.addEventListener("click", e => e.stopPropagation())

  // Submit score
  this.#submitBtn.addEventListener("pointerdown", (e) => {
    e.stopPropagation()
    this.#submitHighScore()
  })

  // Clear all scores
  this.#clearBtn.addEventListener("pointerdown", (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.#clearScores()
  })

  // Enter = submit
  this.#nameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      this.#submitHighScore()
    }
  })
}

    /**
 * Clears all high scores
 * @private
 */
#clearScores() {
  if (confirm('Are you sure you want to clear all high scores?')) {
    this.#highScores = []
    this.#saveHighScores()
    this.#displayHighScores()
  }
}

    /**
     * Sets the current score and shows/hides input based on if it qualifies
     * @param {number} score - The score to set
     */
    setScore(score) {
      this.#score = score
      
      // Show/hide name input based on if it's a high score
      if (this.#isHighScore()) {
        this.#nameInputContainer.classList.remove('hidden')
        this.#nameInput.focus()
      } else {
        this.#nameInputContainer.classList.add('hidden')
      }
    }

    /**
     * Loads high scores from localStorage
     * @private
     */
    #loadHighScores() {
      const saved = localStorage.getItem('milton-jump-highscores')
      if (saved) {
        this.#highScores = JSON.parse(saved)
      }
    }

    /**
     * Saves high scores to localStorage
     * @private
     */
    #saveHighScores() {
      localStorage.setItem('milton-jump-highscores', JSON.stringify(this.#highScores))
    }

    /**
     * Displays high scores
     * @private
     */
    #displayHighScores() {
      this.#highScoresList.innerHTML = ''

      if (this.#highScores.length === 0) {
        const li = document.createElement('li')
        this.#highScoresList.appendChild(li)
        return
      }

      this.#highScores.slice(0, 5).forEach((score, index) => {
        const li = document.createElement('li')
        li.textContent = `${index + 1}. ${score.name} - ${score.score}`
        this.#highScoresList.appendChild(li)
      })
    }

    /**
     * Submits a high score
     * @private
     */
    #submitHighScore() {
      const name = this.#nameInput.value.trim().toUpperCase() || 'PLAYER'
      const score = Math.floor(this.#score / 10)

      // Add to high scores
      this.#highScores.push({ name, score })

      // Sort by score (descending)
      this.#highScores.sort((a, b) => b.score - a.score)

      // Keep only top 5
      this.#highScores = this.#highScores.slice(0, 5)

      // Save and display
      this.#saveHighScores()
      this.#displayHighScores()

      // Hide input, show scores
      this.#nameInputContainer.classList.add('hidden')

      // Clear input for next time
      this.#nameInput.value = ''
    }

    /**
     * Checks if score qualifies for high score list
     * @private
     */
    #isHighScore() {
      const score = Math.floor(this.#score / 10)
      return this.#highScores.length < 5 || score > this.#highScores[4].score
    }
  }
)