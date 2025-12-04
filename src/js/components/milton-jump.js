/**
 * Milton Jump Game Web Component.
 * Complete version with level selector.
 * 
 * @author Oliver Woodhouse
 * @version 5.0.0
 */

import './high-score.js'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tiny5&display=swap');
    @font-face {
  font-family: "Tiny5";
  src: url("./fonts/Tiny5.ttf") format("truetype");
    }

    :host {
    display: block;
    width: 100vw;
    height: 100vh;
}
    .game-container {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
    }
    
    /* Blå himmel - tar upp övre delen */
    .sky {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 70%; /* 70% av container = himmel */

    }
    
    /* Grönt gräs - tar upp nedre delen */
    .ground {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 30%; /* 30% av container = mark */
    }

    /* Grass container on ground */
    .grass-container {
      position:absolute;
      bottom:30%;
      left:0;
      width:100%;
      height:500px;
      z-index:0;
      overflow:hidden;
    }

    /* Individual grass sprites */
    .grass-sprite {
      position: absolute;
      bottom:0;
      width:1200px;
      height:250px;
    }
    
    /* Spelaren (din bild) */
    .player {
      position: absolute;
      bottom: 30%; /* Står på marken (samma som ground height) */
      left: 100px; /* Alltid på samma X-position */
      width: 190px;
      height: 190px;
      transition: bottom 0.3s ease-out; /* Smidig animation när den hoppar */
    }
    
    /* När spelaren hoppar */
    .player.jumping {
      bottom: calc(30% + 220px); /* Hoppar 150px uppåt från marken */
    }

    /* Trees */
    .obstacle {
      position: absolute;
      bottom: 30%;
      width: 140px;
      height: 120px;
      z-index: 1;
    }

    /* Clouds */
    .cloud {
      position: absolute;
      width: 200px;
      height: 140px;
      z-index: 0;
    }

    /* Bones */
    .bone {
      position: absolute;
      bottom: 32%;
      width: 100px;
      height: 100px;
      z-index: 1;
      animation: float 3s ease-in-out infinite;
    }

    .pre-waiting-screen {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 101;
    }

    .pre-waiting-screen.hidden {
      display:none;
    }

    .pre-waiting-text {
      font-family: 'Tiny5', sans-serif;
      font-size:40px;
      color:red;
      animation: blink 1.5s infinite;
      margin-top:20px;
    }

    .pre-waiting-screen .start-logo {
      animation: breatheLogo 3s ease-in-out infinite;
    }

    /* Start screen overlay? */
     .start-screen {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 100;
    }

    .start-screen.hidden {
      display:none;
    }

    .start-logo {
     width: 90%;               
     height: auto; 
     margin-top: -170px;  
     margin-bottom: -80px;
     animation: breatheLogo 3s ease-in-out infinite;   
    }

     .start-instruction {
      font-family: "Tiny5", sans-serif;
      font-weight: 150;
      font-size: 40px;
      color: #ff0000ff;
      animation: blink 1.5s infinite;
      margin-top:40px;
      margin-bottom:-30px;
    }

     .bone-text {
      position: absolute;
      top: 20px;
      left: 20px;
      font-family: 'Tiny5',  sans-serif;
      font-size: 30px;
      color: red;
      font-weight: 150;
      z-index: 10;
      opacity: 0;
      transition: opacity 0.5s;
    }

     @keyframes blink {
      0%, 50%, 100% { opacity: 1; }
      25%, 75% { opacity: 0.3; }
    }

     @keyframes float {
      0% { transform: translateY(0); }
      50% { transform: translateY(-30px); }
      100% { transform: translateY(0); }
    }

    @keyframes breatheLogo {
  0%, 100% { 
    transform: scale(1);
  }
  50% { 
    transform: scale(1.05);
  }
}

     /* Game Over skärm */
    .game-over-screen {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 100;
      margin-top:70px;
    }
    
    .game-over-screen.hidden {
      display: none;
    }

     .game-over-text {
      font-family: "Tiny5", sans-serif;
      font-weight: 900;
      font-size: 300px;
      color: red;
      margin-bottom: 90px;
      text-align:center;
    }
    
    .restart-instruction {
      font-family: "Tiny5", sans-serif;
      font-size: 40px;
      color: red;
      animation: blink 1.5s infinite;
      margin-bottom:200px;
    }
    
    /* Poäng-räknare */
    .score {
      position: absolute;
      top: 20px;
      right: 20px;
      font-family: "Tiny5", sans-serif;
      font-size: 30px;
      color: #ff0808ff;
      
      border-radius: 10px;
      z-index: 10;
    }

    .level-selector {
  font-family: "Tiny5", sans-serif;
  font-size: 35px;
  color: red;
  margin-bottom: -5px;
  display:flex;
  flex-direction: column;
  align-items:center;
  gap:15px;
  animation: blink 1.5s infinite;
  pointer-events: none;
}

.level-controls {
  display: flex;
  align-items: center;
  gap: 30px;
}

    .level-arrow {
      cursor:pointer;
      font-size:50px;
      user-select:none;
      transition: transform 0.2s;
      pointer-events: auto;
    }

    .level-arrow:hover {
      transform:scale(1.2)
    }

    .level-name {
      min-width:200px;
      text-align:center;
      text-transform:uppercase;
    }

    /* Mobile responsiveness */
    @media (max-width: 800px) {

      .game-container {
        width: 100vw;
        height: 100vh;
        margin: 0;
        border: none;
      }

      .player {
        width: 100px;
        height: 100px;
        left: 20px;
      }

       .player.jumping {
      bottom: calc(30% + 120px); /* Hoppar 150px uppåt från marken */
    }

      .obstacle {
        width: 60px;
        height: 65px;
      }

      .cloud {
        width: 20px;
        height: 20px;
      }

      .grass {
        width: 50;
        height: 20;
      }

      .bone {
        width: 60px;
        height: 60px;
        bottom: 31%;
      }

       .start-logo {
        width: 90%;
        max-width: 650px;
        margin-bottom: -20px;
      }

      .pre-waiting-text {
        font-size: 28px;
        text-align: center;
        padding: 0 20px;
      }

      .pre-waiting-screen .start-logo {
        width: 90%;
        max-width: 650px;
        margin-bottom: 20px;
      }

      .start-instruction {
        font-size: 28px;
        text-align:center;
        margin-top:-20px;
      }

      .game-over-text {
        font-size: 60px;
        
      }

      .restart-instruction {
        font-size: 24px;
      }

      .score {
        font-size: 24px;
        top: 10px;
        right: 10px;
        left: auto;
      }

      .bone-text {
        font-size: 20px;
        top: 10px;
        left: 10px;
      }

    .level-selector {
  font-size: 24px;
  gap: 10px;
  margin-bottom: 30px;
}

.level-controls {
  gap: 20px;
}

.level-arrow {
  font-size: 35px;
  pointer-events:auto;
}
  
  .level-name {
    min-width: 150px;
  }
    }

    @media (max-width: 1100px) and (orientation: landscape) {
  .game-container {
    height: 100vh;
  }

  .start-logo {
    width: 70%;
    max-width: 800px;
    margin-top: -100px;
    margin-bottom: -40px;
  }

  .start-instruction {
    font-size: 20px;
    margin-top:-20px;
  }

  .pre-waiting-text {
    font-size: 20px;
    margin-top: 10px;
  }

  .pre-waiting-screen .start-logo {
    width: 70%;
    max-width: 800px;
    margin-top: -100px;
    margin-bottom: -40px;
  }

 .level-selector {
  font-size: 24px;
  gap: 10px;
  margin-bottom: 30px;
}

.level-controls {
  gap: 20px;
}

.level-arrow {
  font-size: 35px;
  pointer-events:auto;
}

  .level-name {
    min-width: 120px;
  }

  .game-over-text {
    font-size: 80px;
    margin-bottom: 40px;
  }

  .restart-instruction {
    font-size: 20px;
  }

  .player {
    width: 110px;
    height: 110px;
    left: 60px;
  }

  .obstacle {
    width: 75px;
    height: 80px;
  }

  .cloud {
    width: 20px;
    height: 20px;
  }

  .bone {
    width: 80px;
    height: 80px;
    bottom: 33%;
  }

  .score {
    font-size: 22px;
    top: 10px;
    right: 10px;
  }

  .bone-text {
    font-size: 18px;
    top: 10px;
    left: 10px;
  }

  .player.jumping {
      bottom: calc(30% + 150px); /* Hoppar 150px uppåt från marken */
    }
}

  </style>
  
  <div class="game-container">
    <div class="sky"></div>
    <div class="ground"></div>
    <div class="grass-container"></div>
    <img class="player" alt="Player">
    <div class="score">SCORE: 0</div>
    <div class="bone-text"></div>
    
    <div class="pre-waiting-screen">
        <img class="start-logo" src="images/newlogo.png" alt="milton-jump">
        <div class="pre-waiting-text">PRESS ANYWHERE TO ENTER</div>
      </div>

    <!-- Start-skärm -->
    <div class="start-screen hidden">
      <img class="start-logo" src="images/newlogo.png" alt="milton-jump">

      

    <div class="level-selector">
  <div>LEVEL SELECT:</div>
  <div class="level-controls">
    <div class="level-arrow left-arrow">←</div>
    <div class="level-name"></div>
    <div class="level-arrow right-arrow">→</div>
  </div>
</div>

    <div class="start-instruction">PRESS TO START GAME</div>
</div>

    <!-- Game Over skärm -->
    <div class="game-over-screen hidden">
      <div class="game-over-text">GAME OVER</div>
      <high-score></high-score>
    <div class="level-selector">
  <div>LEVEL SELECT:</div>
  <div class="level-controls">
    <div class="level-arrow left-arrow-go">←</div>
    <div class="level-name-go"></div>
    <div class="level-arrow right-arrow-go">→</div>
  </div>
</div>
      <div class="restart-instruction">PRESS TO TRY AGAIN</div>

    </div>
  </div>
`

customElements.define('milton-jump',

  /**
   * Milton-jump, a simple jump game application inspired by dino jump.
   */
  class extends HTMLElement {

    // Theme configuration for different levels.
    #themeConfig = {
      default: {
        skyColor: '#6dcff6ff',
        groundColor: '#62bc2f',
        grassWidth: null,
        grassHeight: null,
        grassContainerHeight: null,
        cloudWidth: 200,
        cloudHeight: 200
      },
      mountains: {
        skyColor: '#3432c6ff',
        groundColor: '#9398d7ff',
        grassWidth: 400,
        grassHeight: 180,
        grassContainerHeight: 400,
        cloudWidth: 40,
        cloudHeight: 40
      },
      desert: {
        skyColor: '#bbf2ff',
        groundColor: '#e6b239ff',
        grassWidth: 600,
        grassHeight: 250,
        grassContainerHeight: 500,
        cloudWidth: 200,
        cloudHeight: 140
      },
      city: {
        skyColor: '#b2e6feff',
        groundColor: '#66656aff',
        grassWidth: 1200,
        grassHeight: 250,
        grassContainerHeight: 500,
        cloudWidth: 200,
        cloudHeight: 140
      }
    }

    #currentTheme = null

    /**
     * GAME STATE - 'waiting', 'playing', 'game_over'
     * 
     * @type {string}
     */

    #gameState = 'PRE_WAITING'

    /**
     * Reference to the player icon (image)
     * 
     * @type {HTMLImageElement}
     */

    #playerElement

    /**
     * Reference to game container.
     * 
     * @type {HTMLDivElement}
     */
    #gameContainer

    /**
   * Reference to grass container.
   * 
   * @type {HTMLDivElement}
   */
    #grassContainer

    /**
     * Reference to pre-waiting-screen
     * 
     * @type {HTMLDivElement}
     */
    #preWaitingScreen

    /**
     * Reference to bone text element
     * 
     * @type {HTMLDivElement}
     */
    #boneTextElement

    /**
 * Reference to start logo element.
 * @type {HTMLImageElement}
 */
#startLogo

/**
 * Image src for logo 1.
 * @type {string}
 */
#logo1

/**
 * Image src for logo 2.
 * @type {string}
 */
#logo2

/**
 * Current logo frame (1 or 2)
 * @type {number}
 */
#currentLogoFrame = 1

/**
 * Interval ID for logo animation
 * @type {number}
 */
#logoIntervalId

    /**
     * Keeps track on if player is jumping
     * If true - player cannot jump again (no double jumping allowed)
     * 
     * @type {HTMLImageElement}
     */

    #isJumping = false

    /**
     * Sound that plays while you jump
     * 
     * @type {HTMLAudioElement}
     */

    #jumpSound

    /**
     * Main menu music
     * Plays during WAITING stage.
     * 
     * @type {HTMLAudioElement}
     */
    #mainMenuMusic

    /**
     * Game theme music 
     * Plays during PLAYING stage.
     */
    #mainThemeMusic

    /**
     * sound that plays when you eat a bone
     * 
     * @type {HTMLAudioElement}
     */
    #eatSound

    /**
     * Array with obstacles present on screen.
     * 
     * @type {Array<{element: HTMLImageElement, x: number}>}
     */
    #obstacles = []

    /**
     * Array with grass.
     * 
     * @type {Array<{element: HTMLImageElement, x: number}>}
     */
    #grass = []

    /**
     * Array with bones giving extra points.
     * 
     * @type {Array<{element: HTMLImageElement, x: number}>}
     */
    #bones = []

    /**
     * Array with all clouds
     * 
     * @type {Array<{element: HTMLImageElement, x: number}>}
     */
    #clouds = []

    /**
     * Array with all grass sprites
     * 
     * @type {Array<{element: HTMLImageElement, x: number}>}
     */
    #grassSprites = []

    /**
     * Reference to high-score component
     * @type {HTMLElement}
     */
    #highScoreComponent

    /**
     * SRC for obstacles image
     * 
     * @type {string}
     */
    #obstacleImage

    /**
     * SRC for bones image.
     * 
     * @type {string}
     */
    #boneImage

    /**
     * SRC for grass image 1.
     * 
     * @type {string}
     */
    #grassImage1

    /**
     * SRC for grass image 2.
     * @type {string}
     */
    #grassImage2

    /**
     * SRC for cloud image
     * 
     * @type {string}
     */
    #cloudImage

    /**
     * Image src for run avatar 1.
     * 
     * @type {string}
     */
    #runImage1

    /**
     * Image src for run avatar 2.
     * 
     * @type {string}
     */
    #runImage2

    /**
     * Image src for run avatar 3.
     * 
     * @type {string}
     */
    #runImage3

    /**
     * Image src for jump avatar.
     * 
     * @type {string}
     */
    #jumpImage

    /**
     * Image src for eating
     * 
     * @private
     */
    #eatImage

    /**
     * What run frame is displayed right now. (1 or 2)
     * 
     * @type {number}
     */
    #currentRunFrame = 0

    /**
     * What grass image is displayed right now. (1 or 2)
     * 
     * @type {number}
     */
    #currentGrassFrame = 1

    /**
     * Interval-id for sprite animation
     * 
     * @type {number}
     */
    #spriteIntervalId

    /**
     * Interval-id for grass animation.
     * 
     * @type {number}
     */
    #grassSpriteIntervalId

    /**
     * Interval id for when grass should scroll.
     * 
     * @type {number}
     */
    #grassScrollIntervalId

    /**
     * ID for animation frame (used to stop game loop)
     * 
     * @type {number}
     */
    #animationFrameId

    /**
     * ID for cloud animation frame
     * 
     * @type {number}
     */
    #cloudAnimationId

    /**
     * Timestamp for next obstacle.
     * 
     * @type {number}
     */
    #nextObstacleTime = 0

    /**
     * Timestamp for next bone.
     * 
     * @type {number}
     */
    #nextBoneTime = 0

    /**
     * Timestamp for next cloud.
     * 
     * @type {number}
     */
    #nextCloudTime = 0
    /**
     * Score tracker
     * 
     * @type {number}
     */
    #score = 0

    /**
     * Reference to score element
     * 
     * @type {HTMLDivElement}
     */
    #scoreElement

    /**
     * Fast mode
     * 
     * @type {string}
     */
    #fastMode

    /**
     * Reference to start screen
     * 
     * @type {HTMLDivElement}
     */
    #startScreen

    /**
     * Reference to GAME OVER screen
     * 
     * @type {HTMLDivElement}
     */
    #gameOverScreen

    /**
     * Avaliable themes
     * @type {Array<string>}
     */
    #availableThemes = ['default', 'mountains', 'desert', 'city']

    /**
     * Current selected theme index
     * @type {number}
     */
    #selectedThemeIndex = 0

    /**
     * Reference to level name element.
     * @type {HTMLDivElement}
     */
    #levelNameElement

    /**
     * Reference to level name element in GAME OVER
     * 
     * @type {HTMLDivElement}
     */
    #levelNameElementGO

    /**
     * Sets up a new instance of game
     * 
     * @constructor
     */
    constructor() {
      super()

      // Creates shadow DOM
      this.attachShadow({ mode: 'open' })
      // Adds template to shadow DOM
      this.shadowRoot.appendChild(template.content.cloneNode(true))

      // Find and create a references
      this.#playerElement = this.shadowRoot.querySelector('.player')
      this.#gameContainer = this.shadowRoot.querySelector('.game-container')
      this.#grassContainer = this.shadowRoot.querySelector('.grass-container')
      this.#scoreElement = this.shadowRoot.querySelector('.score')
      this.#startScreen = this.shadowRoot.querySelector('.start-screen')
      this.#gameOverScreen = this.shadowRoot.querySelector('.game-over-screen')
      this.#boneTextElement = this.shadowRoot.querySelector('.bone-text')
      this.#levelNameElement = this.shadowRoot.querySelector('.level-name')
      this.#levelNameElementGO = this.shadowRoot.querySelector('.level-name-go')
       this.#highScoreComponent = this.shadowRoot.querySelector('high-score')
      this.#startLogo = this.shadowRoot.querySelector('.start-screen .start-logo')
      this.#preWaitingScreen = this.shadowRoot.querySelector('.pre-waiting-screen')
    }

    /**
     * Reads attributes and sets up event Listeners.
     */
    connectedCallback() {
      // Wait until DOM is ready
      setTimeout(() => {
        this.#setupEventListeners()
      }, 0)
      // Reads image and sound from attributes.
      this.#runImage1 = this.getAttribute('run1')
      this.#runImage2 = this.getAttribute('run2')
      this.#runImage3 = this.getAttribute('run3')
      this.#eatImage = this.getAttribute('eatimage')

      // Grass images
      this.#grassImage1 = this.getAttribute('grass1')
      this.#grassImage2 = this.getAttribute('grass2')

      // Jump avatar
      this.#jumpImage = this.getAttribute('jump')

      // Music (menu and main)
     this.#mainMenuMusic = null
     this.#mainThemeMusic = null

      // Initial run image (run1)
      if (this.#runImage1) {
        this.#playerElement.src = this.#runImage1
      }

      const soundSrc = this.getAttribute('sound')
      if (soundSrc) {
        this.#jumpSound = new Audio(soundSrc)
      }

      const eatSrc = this.getAttribute('eat')
      if (eatSrc) {
        this.#eatSound = new Audio(eatSrc)
      } 

      const obstacleSrc = this.getAttribute('obstacle')
      if (obstacleSrc) {
        this.#obstacleImage = obstacleSrc
      }

      const boneSrc = this.getAttribute('bone')
      if (boneSrc) {
        this.#boneImage = boneSrc
      }

      const cloudSrc = this.getAttribute('cloud')
      if (cloudSrc) {
        this.#cloudImage = cloudSrc
      }

      // Logo animation:
      this.#logo1 = this.getAttribute('logo1') || 'images/newlogo.png'
      this.#logo2 = this.getAttribute('logo2')

      // Set initial logo
      if (this.#logo1) {
        this.#startLogo.src = this.#logo1
      }

      // Start logo animation if we have both images
      if (this.#logo1 && this.#logo2) {
        this.#startLogoAnimation()
      }

      // Theme set up for levels
      const initalTheme = this.getAttribute('theme') || 'default'
      this.#selectedThemeIndex = this.#availableThemes.indexOf(initalTheme)
      if (this.#selectedThemeIndex === -1) this.#selectedThemeIndex = 0

      this.#currentTheme = this.#themeConfig[this.#availableThemes[this.#selectedThemeIndex]]
      this.#applyTheme()
      this.#updateLevelDisplay()
      this.#loadThemeImages()

      // Initializes the clouds and the grass (present even i WAITING mode)
      this.#initializeGrass()
      this.#startGrassSpriteAnimation()
      this.#startCloudAnimation()
    }


    /**
     * Sets up all event listeners
     * @private
     */
    #setupEventListeners() {
  // Add level query selector listeners
  const leftArrow = this.shadowRoot.querySelector('.left-arrow')
  const rightArrow = this.shadowRoot.querySelector('.right-arrow')
  const leftArrowGO = this.shadowRoot.querySelector('.left-arrow-go')
  const rightArrowGO = this.shadowRoot.querySelector('.right-arrow-go')

  if (leftArrow) {
    leftArrow.addEventListener('touchstart', (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.#changeLevel(-1)
    }, { passive: false })
  }

  if (rightArrow) {
    rightArrow.addEventListener('touchstart', (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.#changeLevel(1)
    }, { passive: false })
  }

  // Game Over screen level selectors
  if (leftArrowGO) {
    leftArrowGO.addEventListener('touchstart', (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.#changeLevel(-1)
    }, { passive: false })
  }

  if (rightArrowGO) {
    rightArrowGO.addEventListener('touchstart', (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.#changeLevel(1)
    }, { passive: false })
  }

  // Listen to button presses
  document.addEventListener('keydown', (event) => {
    this.#handleKeyPress(event)
  })

  // Touch / click support - använd ANTINGEN touch ELLER click, inte både
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  
  if (this.#gameContainer) {
    if (isTouchDevice) {
      this.#gameContainer.addEventListener('touchend', (event) => {
        // Ignore touches on level selector components
        const target = event.target
        if (target && (
          target.closest('.level-selector') || 
          target.closest('.start-screen') ||
          target.closest('.game-over-screen')
        )) {
          return
        }
        event.preventDefault()
        this.#handleTouch(event)
      }, { passive: false })
    } else {
      this.#gameContainer.addEventListener('click', (event) => {
        this.#handleTouch(event)
      })
    }
  }

  // Special handling för pre-waiting screen
  if (this.#preWaitingScreen) {
    if (isTouchDevice) {
      this.#preWaitingScreen.addEventListener('touchend', (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (this.#gameState === 'PRE_WAITING') {
          this.#enterWaitingState()
        }
      }, { passive: false })
      // Special handling for start screen
  if (this.#startScreen) {
    if (isTouchDevice) {
      this.#startScreen.addEventListener('touchend', (e) => {
        // Only handle if not clicking on level selector
        if (e.target.closest('.level-selector')) {
          return
        }
        e.preventDefault()
        e.stopPropagation()
        if (this.#gameState === 'WAITING') {
          this.#startGame()
        }
      }, { passive: false })
    } else {
      this.#startScreen.addEventListener('click', (e) => {
        if (e.target.closest('.level-selector')) {
          return
        }
        e.stopPropagation()
        if (this.#gameState === 'WAITING') {
          this.#startGame()
        }
      })
    }
  }

  // Special handling for game over screen
  if (this.#gameOverScreen) {
    if (isTouchDevice) {
      this.#gameOverScreen.addEventListener('touchend', (e) => {
        if (e.target.closest('.level-selector')) {
          return
        }
        e.preventDefault()
        e.stopPropagation()
        if (this.#gameState === 'GAME_OVER') {
          this.#restartGame()
        }
      }, { passive: false })
    } else {
      this.#gameOverScreen.addEventListener('click', (e) => {
        if (e.target.closest('.level-selector')) {
          return
        }
        e.stopPropagation()
        if (this.#gameState === 'GAME_OVER') {
          this.#restartGame()
        }
      })
    }
  }
    } else {
      this.#preWaitingScreen.addEventListener('click', (e) => {
        e.stopPropagation()
        if (this.#gameState === 'PRE_WAITING') {
          this.#enterWaitingState()
        }
      })
    }
  }
}

    /**
     * Moves from PRE_WAITING to WAITING
     * @private
     */
    async #enterWaitingState () {
      this.#gameState = 'WAITING'
      this.#preWaitingScreen.classList.add('hidden')
      this.#startScreen.classList.remove('hidden')

      // Load music now if not loaded
      if (!this.#mainMenuMusic) {
    const menuMusicSrc = this.getAttribute('music1')
    if (menuMusicSrc) {
      this.#mainMenuMusic = await this.#loadAudio(menuMusicSrc)
    }
  }
      this.#updateMusic()
    }

    /**
     * Loads audio files dynamically
     * @param {string} src - Audio file path
     * @returns {Promise<HTMLAudioElement>}
     * @private
     */
    #loadAudio(src) {
      return new Promise((resolve) => {
        const audio = new Audio()
        audio.addEventListener('canplaythrough', () => resolve(audio), { once: true })
        audio.loop = true
        audio.volume = 0.6
        audio.src = src
      })
    }
    
    /**
     * Handles music in application.
     */
    #updateMusic() {
      // Stop both songs.
      if (this.#mainMenuMusic) this.#mainMenuMusic.pause();
      if (this.#mainThemeMusic) this.#mainThemeMusic.pause();

      if (this.#gameState === 'WAITING' ) {
        if (this.#mainMenuMusic) {
          this.#mainMenuMusic.currentTime = 0;
          this.#mainMenuMusic.play().catch(() => { });
        }
      }

      if (this.#gameState === 'PLAYING') {
        if (this.#mainThemeMusic) {
          this.#mainThemeMusic.currentTime = 0;
          this.#mainThemeMusic.play().catch(() => { });
        }
      }
    }
    /**
     * Applies the selected theme.
     * @private
     */
    #applyTheme () {
      const sky = this.shadowRoot.querySelector('.sky')
      const ground = this.shadowRoot.querySelector('.ground')
      const grassContainer = this.shadowRoot.querySelector('.grass-container')

      sky.style.backgroundColor = this.#currentTheme.skyColor
      ground.style.backgroundColor = this.#currentTheme.groundColor
      grassContainer.style.height = `${this.#currentTheme.grassContainerHeight}px`

      const styleSheet = this.shadowRoot.styleSheets[0]

      // Remove old rules if there are any?
      for (let i = styleSheet.cssRules.length - 1; i >= 0; i--) {
        if (styleSheet.cssRules[i].selectorText === '.grass-sprite' || 
        styleSheet.cssRules[i].selectorText === '.cloud') {
      styleSheet.deleteRule(i)
      }
    }

    // New rules
    if (this.#currentTheme.grassWidth) {
      styleSheet.insertRule(`
      .grass-sprite {
      position: absolute;
      bottom: 0;
      width: ${this.#currentTheme.grassWidth}px;
      height: ${this.#currentTheme.grassHeight}px;
      }
      `, styleSheet.cssRules.length)
    }

    styleSheet.insertRule(`
      .cloud {
      position: absolute;
      width: ${this.#currentTheme.cloudWidth}px;
      height: ${this.#currentTheme.cloudHeight}px;
      z-index: 0;
      }
      `, styleSheet.cssRules.length)
    }

    /**
     * Changes the selected level
     * @param {number} direction - -1 for left, 1 for right.
     * @private
     */
    #changeLevel( direction) {
      this.#selectedThemeIndex += direction

      // Wrap around
      if (this.#selectedThemeIndex < 0) {
        this.#selectedThemeIndex = this.#availableThemes.length - 1
      } else if (this.#selectedThemeIndex >= this.#availableThemes.length) {
        this.#selectedThemeIndex = 0
      }

      // Apply new theme
      const themeName = this.#availableThemes[this.#selectedThemeIndex]
      this.#currentTheme = this.#themeConfig[themeName]
      this.#applyTheme()
      this.#loadThemeImages()
      this.#updateLevelDisplay()

      // Re-initialize grass with new dimensions
      this.#grassSprites.forEach(grass => grass.element.remove())
      this.#grassSprites = []
      this.#initializeGrass()
      this.#startGrassSpriteAnimation()
    }

    /**
 * Loads theme-specific images
 * @private
 */
#loadThemeImages() {
  const themeImages = {
    default: {
      grass1: null, 
      grass2: null,
      obstacle: 'images/bush.png',
      cloud: 'images/cloud.png'
    },
    mountains: {
      grass1: 'images/mountains1.png',
      grass2: 'images/mountains2.png',
      obstacle: 'images/nighttree.png',
      cloud: 'images/star1.png'
    },
    desert: {
      grass1: 'images/pyramid1.png',
      grass2: 'images/pyramid2.png',
      obstacle: 'images/cactus.png',
      cloud: 'images/newcloud.png'
    },
    city: {
      grass1: 'images/stockholmwater1.png',
      grass2: 'images/stockholmwater2.png',
      obstacle: 'images/trashcan.png',
      cloud: 'images/newcloud.png'
    }
  }
  
  const themeName = this.#availableThemes[this.#selectedThemeIndex]
  const images = themeImages[themeName]
  
  this.#grassImage1 = images.grass1
  this.#grassImage2 = images.grass2
  this.#obstacleImage = images.obstacle
  this.#cloudImage = images.cloud
}

    /**
     * Updates the level name display
     * @private
     */
    #updateLevelDisplay() {
      const themeName = this.#availableThemes[this.#selectedThemeIndex]
      this.#levelNameElement.textContent = themeName.toUpperCase()
      if (this.#levelNameElementGO) {
        this.#levelNameElementGO.textContent = themeName.toUpperCase()
      }
    }

    /**
     * Creates grass sprites that filles the screen.
     */
    #initializeGrass() {
      if (!this.#grassImage1 || !this.#currentTheme.grassWidth) return

      const containerWidth = this.#gameContainer.offsetWidth
      const grassWidth = this.#currentTheme.grassWidth
      const numGrass = Math.ceil(containerWidth / grassWidth) + 2

      for (let i = 0; i < numGrass; i++) {
        const grass = document.createElement('img')
        grass.src = this.#grassImage1
        grass.className = 'grass-sprite'
        grass.style.left = `${i * grassWidth}px`
        this.#grassContainer.appendChild(grass)

        this.#grassSprites.push({
          element: grass,
          x: i * grassWidth
        })
      }
    }

    /**
     * Starts the sprite animation for grass (changes between 1 and 2).
     * Always runs no matter GAME STATE
     */
    #startGrassSpriteAnimation() {
      // Stop old animation if running
      if (this.#grassSpriteIntervalId) {
        clearInterval(this.#grassSpriteIntervalId)
        this.#grassSpriteIntervalId = null
      }

      // Only start if images exist
      if (!this.#grassImage1 || !this.#grassImage2) return

      this.#grassSpriteIntervalId = setInterval(() => {
        this.#grassSprites.forEach(grass => {
          if (this.#currentGrassFrame === 1) {
            grass.element.src = this.#grassImage2
          } else {
            grass.element.src = this.#grassImage1
          }
        })
        this.#currentGrassFrame = this.#currentGrassFrame === 1 ? 2 : 1
      }, 1000)
    }

    /**
 * Starts the logo sprite animation (alternating between logo1 and logo2)
 * @private
 */
#startLogoAnimation() {
  this.#logoIntervalId = setInterval(() => {
    if (this.#currentLogoFrame === 1) {
      this.#startLogo.src = this.#logo2
      this.#currentLogoFrame = 2
    } else {
      this.#startLogo.src = this.#logo1
      this.#currentLogoFrame = 1
    }
  }, 1100) // Byter bild varje sekund
}

    /**
     * Starts scrolling of grass while PLAYING gamestate is active.
     */
    #startGrassScrolling () {
      if (!this.#currentTheme.grassWidth) return // Protects against null

      this.#grassScrollIntervalId = setInterval(() => {
        const containerWidth = this.#gameContainer.offsetWidth
        const grassWidth = this.#currentTheme.grassWidth
        const speed = 4 + Math.floor(this.#score / 5000)

        for (let i = 0; i < this.#grassSprites.length; i++) {
          const grass = this.#grassSprites[i]
          grass.x -= speed
        

        // When grass is out of screen, move to right.
        if (grass.x <= -grassWidth) {
          grass.x = containerWidth
        }

        grass.element.style.left = `${grass.x}px`
        }
      }, 50)
    }

    /**
     * Stops the grass scroll when game ends.
     */
    #stopGrassScrolling () {
      if (this.#grassScrollIntervalId) {
        clearInterval(this.#grassScrollIntervalId)
        this.#grassScrollIntervalId = null
      }
    }

    /**
     * Handles key presses and checks if space was pressed (for jumping).
     * 
     * @param {KeyboardEvent} event - The keyboard event in question
     * @private
     */
    #handleKeyPress(event) {
      // Check for PRE_WAITING state first
      if (this.#gameState === 'PRE_WAITING') {
        event.preventDefault()
        this.#enterWaitingState()
        return
      }
      // Check if pressed key was space
      // event.code is the name of the key that was pressed
      if (event.code === 'Space') {
        // Stops space from scrolling the page
        event.preventDefault()

        // Different outcomes based on game states:
        if (this.#gameState === 'WAITING') {
          // Start game
          this.#startGame()
        } else if (this.#gameState === 'PLAYING') {
          // Jump
          this.#jump()
        } else if (this.#gameState === 'GAME_OVER') {
          this.#restartGame()
        }
      }

      // For level selector
     if (this.#gameState === 'WAITING' || this.#gameState === 'GAME_OVER') {
  if (event.code === 'ArrowLeft') {
    event.preventDefault()
    this.#changeLevel(-1)
  } else if (event.code === 'ArrowRight') {
    event.preventDefault()
    this.#changeLevel(1)
  }
}
    }
#handleTouch(event) {
 // Will only handle jump, other states are handeled by event listeners.
    // Different outcomes based on game states:
        if (this.#gameState === 'WAITING') {
          // Start game
          this.#startGame()
        } else if (this.#gameState === 'PLAYING') {
          // Jump
          this.#jump()
        } else if (this.#gameState === 'GAME_OVER') {
          this.#restartGame()
        }
  }
}
    /**
     * Starts the game.
     * Hides the startsecreen and initializes game loop.
     * 
     * @private
     */
    async #startGame() {
      // Change state
      this.#gameState = 'PLAYING'

      // Load main theme if not loaded
      if (!this.#mainThemeMusic) {
    const mainMusicSrc = this.getAttribute('music2')
    if (mainMusicSrc) {
      this.#mainThemeMusic = await this.#loadAudio(mainMusicSrc)
    }
  }

      // Start music
      this.#updateMusic()

      // Hide start screen
      this.#startScreen.classList.add('hidden')

      // Running animation
      this.#startSpriteAnimation()

      // Grass animation
      this.#startGrassScrolling()

      // Reset score
      this.#score = 0
      this.#updateScore()

      // Select timestamp for first obstacle
      this.#nextObstacleTime = Date.now() + 2000 // 2 sec

      // Select timestamp for first bone
      this.#nextBoneTime = Date.now() + 8000 // 2 sec

      // Start game loop
      this.#gameLoop()
    }

    /**
     * Restarts game after game over
     * 
     * @private
     */
    #restartGame() {
      // remove all current obstacles
      this.#obstacles.forEach(obstacle => {
        obstacle.element.remove()
      })
      this.#obstacles = []

      // remove all current bones
      this.#bones.forEach(bone => {
        bone.element.remove()
      })
      this.#bones = []

      // Hide game over screen
      this.#gameOverScreen.classList.add('hidden')

      // Start game again
      this.#startGame()
    }

    /**
     * Starts sprite-animation (alternating between 1 and 2)
     * 
     * @private
     */
    #startSpriteAnimation() {
      // If we are jumping, do not use animation
      this.#spriteIntervalId = setInterval(() => {
        if (this.#isJumping) return

        // Alternate between 1, 2 and 3
        switch (this.#currentRunFrame) {
          case 0:
            this.#playerElement.src = this.#runImage2 // Next - legs behind
            this.#currentRunFrame = 1
            break
          case 1:
            this.#playerElement.src = this.#runImage1 // Back to start position
            this.#currentRunFrame = 2
            break
          case 2:
            this.#playerElement.src = this.#runImage3 // Legs forward
            this.#currentRunFrame = 3
            break
          case 3:
            this.#playerElement.src = this.#runImage1 // Back to start position
            this.#currentRunFrame = 0
            break
        }
      }, 110)
    }

    /**
     * Faster sprite animation after 500 points.
     * 
     * @private
     */
    #switchToFastAnimation() {

      //Stop old animation
      this.#stopSpriteAnimation()

      // Start faster animation
      this.#spriteIntervalId = setInterval(() => {
        if (this.#isJumping) return

        // Alternate between 1 and 2
        // Alternate between 1, 2 and 3
        switch (this.#currentRunFrame) {
          case 0:
            this.#playerElement.src = this.#runImage2 // Next - legs behind
            this.#currentRunFrame = 1
            break
          case 1:
            this.#playerElement.src = this.#runImage1 // Back to start position
            this.#currentRunFrame = 2
            break
          case 2:
            this.#playerElement.src = this.#runImage3 // Legs forward
            this.#currentRunFrame = 3
            break
          case 3:
            this.#playerElement.src = this.#runImage1 // Back to start position
            this.#currentRunFrame = 0
            break
        }
      }, 50)
    }

    /**
     * Stops the sprite animation
     * 
     * @private
     */
    #stopSpriteAnimation() {
      if (this.#spriteIntervalId) {
        clearInterval(this.#spriteIntervalId)
        this.#spriteIntervalId = null
      }
    }

    /**
     * Starts the cloud animation
     * 
     * @private
     */
    #startCloudAnimation() {
      this.#cloudLoop()
    }

    /**
     * Cloud loop - constantly updates clouds.
     * 
     * @private
     */
    #cloudLoop() {
      this.#spawnClouds()
      this.#updateClouds()

      // Continue to loop clouds
      this.#cloudAnimationId = requestAnimationFrame(() => this.#cloudLoop())
    }

    /**
     * Randomly creates new clouds.
     * 
     * @private
     */
    #spawnClouds() {
      const now = Date.now()

      // Time for a cloud?
      if (now >= this.#nextCloudTime) {
        this.#createCloud()

        // Next cloud in 3-7 seconds
        const delay = 3000 + Math.random() * 4000
        this.#nextCloudTime = now + delay
      }
    }

    /**
     * Creates a new cloud
     * 
     * @private
     */
    #createCloud() {
      if (!this.#cloudImage) return

      const cloud = document.createElement('img')
      cloud.src = this.#cloudImage
      cloud.className = 'cloud'

      // Start outside of screen to the right
      const containerWidth = this.#gameContainer.offsetWidth
      cloud.style.left = `${containerWidth}px`

      // Random height in sky
      const randomY = -10 + Math.random() * 40
      cloud.style.top = `${randomY}%`

      this.#gameContainer.appendChild(cloud)

      // Save in an array
      this.#clouds.push({
        element: cloud,
        x: containerWidth,
        y: randomY
      })
    }

    /**
     * Updates all clouds and moves them to the left
     * 
     * @private
     */
    #updateClouds() {
      for (let i = this.#clouds.length - 1; i >= 0; i--) {
        const cloud = this.#clouds[i]

        // Clouds movement speed
        cloud.x -= 4
        cloud.element.style.left = `${cloud.x}px`

        // Remove them if outside of screen
        if (cloud.x < -150) {
          cloud.element.remove()
          this.#clouds.splice(i, 1)
        }
      }
    }

    /**
     * Game loop - runs every frame
     * Handles everything happening in a loop
     * 
     * @private
     */
    #gameLoop() {
      // If game is not played anymore - abort loop
      if (this.#gameState !== 'PLAYING') {
        return
      }

      // Update all necessary components
      this.#updateObstacles()
      this.#checkCollisions()
      this.#spawnObstacles()
      this.#updateBones()
      this.#spawnBones()

      // Increase score
      this.#score += 1
      if (this.#score % 10 === 0) {
        this.#updateScore()
      }

      // Run next frame
      this.#animationFrameId = requestAnimationFrame(() => this.#gameLoop())
    }

    /**
     * Creates new obstacles randomly using Math.random
     * 
     * @private
     */
    #spawnObstacles() {
      const now = Date.now()

      // Is it time for a new obstacle?
      if (now >= this.#nextObstacleTime) {
        this.#createObstacle()

        // Randomize obstacles
        const delay = 1500 + Math.random() * 2000
        this.#nextObstacleTime = now + delay
      }
    }

    /**
     * Creates a new obstacle.
     * 
     * @private
     */
    #createObstacle() {
      // Reference to img element
      const obstacle = document.createElement('img')
      obstacle.src = this.#obstacleImage
      obstacle.className = 'obstacle'

      // Spawn obstacles out side of screen in beginning
      const containerWidth = this.#gameContainer.offsetWidth
      obstacle.style.left = `${containerWidth}px`

      // Add to container
      this.#gameContainer.appendChild(obstacle)

      // Save within array with start position
      this.#obstacles.push({
        element: obstacle,
        x: containerWidth
      })
    }

    /**
     * Updates all obstacles and moves them to the left
     * 
     * @private
     */
    #updateObstacles() {
      // Go through all obstacles
      for (let i = this.#obstacles.length - 1; i >= 0; i--) {
        const obstacle = this.#obstacles[i]

        //Speed gets faster and faster every 50 points
        // Speed is different if in vertical mobile mode
        const isMobile = window.innerWidth <= 800 && window.innerHeight > window.innerWidth
        const baseSpeed = isMobile ? 6 : 15
        const speed = baseSpeed + Math.floor(this.#score / 500)
        obstacle.x -= speed
        obstacle.element.style.left = `${obstacle.x}px`

        // If obstacle is outside of screen, remove it:
        if (obstacle.x < -100) {
          obstacle.element.remove()
          this.#obstacles.splice(i, 1)
        }
      }
    }

    /**
    * Creates new bones randomly using Math.random
    * 
    * @private
    */
    #spawnBones() {
      const now = Date.now()

      // Is it time for a new bone?
      if (now >= this.#nextBoneTime) {
        this.#createBone()

        // Randomize bones
        const delay = 1500 + Math.random() * 5000
        this.#nextBoneTime = now + delay
      }
    }

    /**
     * Creates a new bone in loop.
     * 
     * @private
     */
    #createBone() {
      // Reference to img element
      const bone = document.createElement('img')
      bone.src = this.#boneImage
      bone.className = 'bone'

      // Spawn bones out side of screen in beginning
      const containerWidth = this.#gameContainer.offsetWidth
      bone.style.left = `${containerWidth}px`

      // Add to container
      this.#gameContainer.appendChild(bone)

      // Save within array with start position
      this.#bones.push({
        element: bone,
        x: containerWidth
      })
    }

    /**
     * Updates all bones and moves them to the left
     * 
     * @private
     */
    #updateBones() {
      // Go through all bones
      for (let i = this.#bones.length - 1; i >= 0; i--) {
        const bone = this.#bones[i]

        //Speed gets faster and faster every 50 points
        // Also different on mobile
        const isMobile = window.innerWidth <= 800 && window.innerHeight > window.innerWidth
        const baseSpeed = isMobile ? 8 : 15
        const speed = baseSpeed + Math.floor(this.#score / 500)
        bone.x -= speed
        bone.element.style.left = `${bone.x}px`

        // If obstacle is outside of screen, remove it:
        if (bone.x < -100) {
          bone.element.remove()
          this.#bones.splice(i, 1)
        }
      }
    }


    /**
     * Checks for collisions between player and obstacles
     * 
     * @private
     */
    #checkCollisions() {
      const playerRect = this.#playerElement.getBoundingClientRect()

      // Kontrollera alla obstacles
      for (const obstacle of this.#obstacles) {
        const obstacleRect = obstacle.element.getBoundingClientRect()

        if (this.#isColliding(playerRect, obstacleRect)) {
          this.#gameOver()
          return
        }
      }

      // Kontrollera alla bones
      for (let i = this.#bones.length - 1; i >= 0; i--) {
        const bone = this.#bones[i]
        const boneRect = bone.element.getBoundingClientRect()

        if (this.#isColliding(playerRect, boneRect)) {
          this.#eatsBone(i) // skicka index för att ta bort benet
        }
      }
    }

    /**
     * Checks for collision between player and obstacles.
     * 
     * @param {DOMRect} rect1 - Första rektangeln
     * @param {DOMRect} rect2 - Andra rektangeln
     * @returns {boolean} True om de överlappar
     * @private
     */
    #isColliding(rect1, rect2) {
      return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
      )
    }

    /**
     * If players collides with bone.
     * 
     * @private
     */
    #eatsBone(index) {
      const bone = this.#bones[index]

      // Check if sprite animation is active
      const wasAnimating = this.#spriteIntervalId !== null

      // Stop animation if active
      if (wasAnimating) {
        clearInterval(this.#spriteIntervalId)
        this.#spriteIntervalId = null
      }

      // Switch avatar to eat avatar
      if (this.#eatImage) {
        this.#playerElement.src = this.#eatImage

        // Return to original animation.
        setTimeout(() => {
          this.#playerElement.src = this.#runImage1
          this.#currentRunFrame = 0 // Restart run sequence.

          if (wasAnimating && this.#gameState === 'PLAYING') {
            if (this.#fastMode) {
              this.#switchToFastAnimation()  // Fast mode (150ms)
            } else {
              this.#startSpriteAnimation()   // Normal (300ms)
            }
          }
        }, 400)
      }

      // Lägg till poäng
      this.#score += 1000
      this.#updateScore()

      // Ta bort benet
      bone.element.remove()
      this.#bones.splice(index, 1)

      // Visa text för poäng
      if (this.#boneTextElement) {
        this.#boneTextElement.textContent = 'Bacon Bone! + 100'
        this.#boneTextElement.style.opacity = 1

        setTimeout(() => {
          this.#boneTextElement.style.opacity = 0
        }, 1000)
      }

      // Spela eat-ljud
      if (this.#eatSound) {
        this.#eatSound.currentTime = 0
        this.#eatSound.play()
      }
    }

    /**
     * Handles GAME OVER
     * 
     * @private
     */
    #gameOver() {
      this.#gameState = 'GAME_OVER'

      // Stop music
      this.#updateMusic()

      // Stop sprite animation
      this.#stopSpriteAnimation()

      // Stop grass scroll
      this.#stopGrassScrolling()

      // Stops game loop
      if (this.#animationFrameId) {
        cancelAnimationFrame(this.#animationFrameId)
      }

      // Show game over screen
      this.#gameOverScreen.classList.remove('hidden')

      // Update high score component.
      if (this.#highScoreComponent) {
      this.#highScoreComponent.setScore(this.#score)
}
    }

    /**
     * Handles and updates the score of the game
     * 
     * @private
     */
    #updateScore() {
      const displayScore = Math.floor(this.#score / 10)
      this.#scoreElement.textContent = `score: ${displayScore}`

      // If we pass 500 - faster
      if (displayScore >= 50 && !this.#fastMode) {
        this.#fastMode = true
        this.#switchToFastAnimation()
      }
    }

    /**
     * Makes the player jump.
     * Adds CSS class, plays sound and removes it after a while.
     * 
     * @private
     */
    #jump() {
      // Check if we are already jumping:
      if (this.#isJumping) {
        return
      }

      // Mark that we are jumping right now
      this.#isJumping = true

      // Switch to jump avatar
      if (this.#jumpImage) {
        this.#playerElement.src = this.#jumpImage
      }

      // Play the jump sound on jump
      if (this.#jumpSound) {
        this.#jumpSound.currentTime = 0
        this.#jumpSound.play()
      }

      // Adds a jumping class from CSS.
      // This moves the player up as decided within <style>
      this.#playerElement.classList.add('jumping')

      // After 600 ms remove the jumping class
      // 0.3 up 0.3 down 
      setTimeout(() => {
        // Removes jumping
        this.#playerElement.classList.remove('jumping')

        //Return to run image
        this.#playerElement.src = this.#runImage1
        this.#currentRunFrame = 0 // Restart run sequence.

        // Mark that we are not jumping anymore so we can jump again.
        this.#isJumping = false
      }, 600)
    }
  }
)