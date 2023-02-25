
class Foxxo {

  static FRAMES = {
    Walk: [
      ...Array.from(Array(8).keys()).map(i => [2, i])
    ],
    Idle: [
      ...Array.from(Array(14).keys()).map(i => [1, i])
    ]
  };

  static STATES = {
    Walk: "Walk",
    Idle: "Idle",
  };

  constructor() {
    [this.foxxo, this.spritesheet] = this.initFoxxo();
    this.speed = 1;
    this.state = Foxxo.STATES.Walk;

    document.addEventListener("mousemove", (e) => {
      const intendedState = this.foxxo.matches(":hover") ? Foxxo.STATES.Idle : Foxxo.STATES.Walk;
      if (this.state !== intendedState) {
        this.currFrame = 0;
      }
      this.state = intendedState;
    });
      

    this.run();
  }

  initFoxxo() {
    if (document.querySelector("#firefoxxo-overlay")) {
      document.querySelector("#firefoxxo-overlay").remove();
    }
    window.foxxoExists = true;
  
    const foxxoOverlay = document.createElement("div");
    foxxoOverlay.id = "firefoxxo-overlay";
    foxxoOverlay.style.height = "100vh";
    foxxoOverlay.style.width = "100vw";
    foxxoOverlay.style.pointerEvents = "none";
    foxxoOverlay.style.position = "fixed";
    foxxoOverlay.style.top = "0";
    foxxoOverlay.style.left = "0";
    document.body.appendChild(foxxoOverlay);
  
    const foxxo = document.createElement("div");
    foxxo.style.height = "64px";
    foxxo.style.width = "64px";
    foxxo.style.overflow = "hidden";
    foxxo.style.position = "absolute";
    foxxo.style.bottom = "0";
    foxxo.style.left = "0";
    foxxo.style.pointerEvents = "auto";
    foxxoOverlay.appendChild(foxxo);
  
    const spritesheet = document.createElement("img");
    spritesheet.src = browser.runtime.getURL("assets/spritesheet.png");
    spritesheet.draggable = false;
    spritesheet.style.position = "absolute";
    spritesheet.style.top = "0";
    spritesheet.style.left = "0";
    foxxo.appendChild(spritesheet);

    return [foxxo, spritesheet];
  }

  setSprite(row, col) {
    this.spritesheet.style.top = `-${row * 64}px`;
    this.spritesheet.style.left = `-${col * 64}px`;
  }

  animate() {
    this.currFrame = 0;
    setInterval(() => {
      const frames = Foxxo.FRAMES[this.state];
      const [x, y] = frames[this.currFrame];
      this.setSprite(x, y);
      this.currFrame = (this.currFrame + 1) % frames.length;
    }, 100);
  }

  move() {
    let x = 0;
    let dx = this.speed;
    setInterval(() => {
      if (this.state === Foxxo.STATES.Idle) {
        return;
      } else {
        if (x > window.innerWidth - 64) {
          dx = -this.speed;
          this.foxxo.style.transform = "scaleX(-1)";
        } else if (x < 0) {
          dx = this.speed
          this.foxxo.style.transform = "scaleX(1)";
        }
        x += dx;
        this.foxxo.style.left = `${x}px`;
      }
    }, 10);
  }

  run() {
    this.animate();
    this.move();
  }
}

(() => {
  /**
     * Check and set a global guard variable.
     * If this content script is injected into the same page again,
     * it will do nothing next time.
     */
  if (window.foxxoExists) {
    return;
  }
  new Foxxo();
})();