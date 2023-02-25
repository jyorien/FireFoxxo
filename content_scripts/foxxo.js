
class HoverPanel {
  constructor(foxxo) {

    if (document.querySelector("#firefoxxo-hover-panel")) {
      document.querySelector("#firefoxxo-hover-panel").remove();
    }

    const panel = document.createElement("div");
    panel.id = "firefoxxo-hover-panel";
    panel.innerText = "🦊";
      
    foxxo.appendChild(panel);

    this.panel = panel;

  }

  updateDisplay(isHovered) {
    this.panel.style.display = isHovered ? "flex" : "none";
  }
}

class FoxxoPanel {
  constructor(foxxo) {
    if (document.querySelector("#firefoxxo-panel")) {
      document.querySelector("#firefoxxo-panel").remove();
    }

    this.initPanel(foxxo);
    this.searchGroup = this.initSearchPanel();
    this.switchTab("Search");

  }

  initPanel(foxxo) {
    const panel = document.createElement("div");
    panel.id = "firefoxxo-panel";
    panel.className = "right";
    panel.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    const foxxoThonko = document.createElement("div");
    foxxoThonko.id = "firefoxxo-foxxo-thonko";
    foxxoThonko.innerText = "🦊 foxxo is thonking... 💭";
    panel.appendChild(foxxoThonko);

    const foxxoTabs = document.createElement("div");
    foxxoTabs.id = "firefoxxo-foxxo-tabs";
    panel.appendChild(foxxoTabs);

    const switchTab = this.switchTab.bind(this);

    const tabs = [];

    for (const tab of ["Search", "Clipboard"]) {

      const foxxoTab = document.createElement("div");
      foxxoTab.className = "firefoxxo-foxxo-tab";
      foxxoTabs.appendChild(foxxoTab);

      const foxxoTabPresser = document.createElement("button");
      foxxoTabPresser.className = "firefoxxo-foxxo-tab-presser";
      foxxoTabPresser.innerText = tab;
      foxxoTab.appendChild(foxxoTabPresser);

      if (foxxoTabPresser.innerText === "Search") {
        foxxoTabPresser.classList.add("active");
      }

      foxxoTabPresser.addEventListener("click", (e) => {
        document.querySelectorAll(".firefoxxo-foxxo-tab-presser").forEach((el) => {
          el.classList.remove("active");
        });
        e.target.classList.add("active");
        switchTab(tab);
      });

      const tabFoxxo = document.createElement("div");
      tabFoxxo.className = "firefoxxo-tab-foxxo";
      foxxoTab.appendChild(tabFoxxo);

      const tabFoxxoSprite = document.createElement("img");
      tabFoxxoSprite.src = browser.runtime.getURL("assets/spritesheet.png");
      tabFoxxoSprite.draggable = false;
      tabFoxxoSprite.style.position = "absolute";
      tabFoxxoSprite.style.top = `-${3 * 64}px`;
      tabFoxxoSprite.style.left = `-${2 * 64}px`;
      tabFoxxo.appendChild(tabFoxxoSprite);

      tabs.push(foxxoTabPresser);

    }

    this.tabs = tabs;
      
    foxxo.appendChild(panel);
    this.panel = panel;
  }

  initSearchPanel() {
    const searchGroup = document.createElement("div");
    searchGroup.id = "firefoxxo-search-group";
    this.panel.appendChild(searchGroup);

    const searchInput = document.createElement("input");
    searchInput.id = "firefoxxo-search-input";
    searchInput.type = "text";
    searchInput.placeholder = "Search the web";
    searchGroup.appendChild(searchInput);

    const buttonsGroup = document.createElement("div");
    buttonsGroup.id = "firefoxxo-buttons-group";
    searchGroup.appendChild(buttonsGroup);

    (async () => {
      const enginesList = await browser.storage.local.get("enginesList");
      const engines = enginesList["enginesList"];

      for (const engine of engines) {
        const button = document.createElement("button");
        button.innerText = engine;
        button.addEventListener("click", (e) => {
          browser.runtime.sendMessage({
            url: searchInput.value,
            engine: engine
          });
          searchInput.value = "";
        });
        buttonsGroup.appendChild(button);
      }
    })();

    return searchGroup;

  }

  switchTab(tab) {
    this.searchGroup.style.display = tab === "Search" ? "flex" : "none";
  }


  updateDisplay(show) {
    this.panel.style.display = show ? "flex" : "none";

    const boundingBox = this.panel.getBoundingClientRect();
    const x = boundingBox.x;

    console.log(x, x + boundingBox.width, window.innerWidth);

    if (x < 0) {
      this.panel.className = "right";
    } else if (x + boundingBox.width > window.innerWidth) {
      this.panel.className = "left";
    }
  }
}

class Foxxo {

  static FRAMES = {
    Walk: [
      ...Array.from(Array(8).keys()).map(i => [2, i])
    ],
    Idle: [
      ...Array.from(Array(14).keys()).map(i => [1, i])
    ],
    Sleep: [
      ...Array.from(Array(6).keys()).map(i => [5, i])
    ]
  };

  static STATES = {
    Walk: "Walk",
    Idle: "Idle",
    Sleep: "Sleep"
  };

  constructor() {
    [this.foxxoBoxxo, this.foxxo, this.spritesheet] = this.initFoxxo();
    this.speed = 1;
    this.state = Foxxo.STATES.Walk;

    this.hoverPanel = new HoverPanel(this.foxxoBoxxo);
    this.panel = new FoxxoPanel(this.foxxoBoxxo);

    document.addEventListener("mousemove", (e) => {
      if (this.state === Foxxo.STATES.Sleep) {
        return;
      }
      const isHovered = this.foxxo.matches(":hover");
      const intendedState = isHovered ? Foxxo.STATES.Idle : Foxxo.STATES.Walk;
      if (this.state !== intendedState) {
        this.currFrame = 0;
      }
      this.state = intendedState;
      this.hoverPanel.updateDisplay(isHovered);
    });

    document.addEventListener("click", (e) => {
      this.panel.updateDisplay(false);
      this.state = Foxxo.STATES.Idle;
      this.currFrame = 0;
    });

    this.foxxo.addEventListener("click", (e) => {
      e.stopPropagation();
      this.hoverPanel.updateDisplay(false);
      this.panel.updateDisplay(true);
      this.state = Foxxo.STATES.Sleep;
      this.currFrame = 0;
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
    foxxoOverlay.style.boxSizing = "border-box";
    foxxoOverlay.style.height = "100vh";
    foxxoOverlay.style.width = "100vw";
    foxxoOverlay.style.pointerEvents = "none";
    foxxoOverlay.style.position = "fixed";
    foxxoOverlay.style.top = "0";
    foxxoOverlay.style.left = "0";
    document.body.appendChild(foxxoOverlay);

    const foxxoBoxxo = document.createElement("div");
    foxxoBoxxo.style.height = "64px";
    foxxoBoxxo.style.width = "64px";
    foxxoBoxxo.style.position = "absolute";
    foxxoBoxxo.style.bottom = "0";
    foxxoBoxxo.style.left = "0";
    foxxoOverlay.appendChild(foxxoBoxxo);
  
    const foxxo = document.createElement("div");
    foxxo.style.height = "64px";
    foxxo.style.width = "64px";
    foxxo.style.overflow = "hidden";
    foxxo.style.position = "absolute";
    foxxo.style.bottom = "0";
    foxxo.style.left = "0";
    foxxo.style.pointerEvents = "auto";
    foxxoBoxxo.appendChild(foxxo);
  
    const spritesheet = document.createElement("img");
    spritesheet.src = browser.runtime.getURL("assets/spritesheet.png");
    spritesheet.draggable = false;
    spritesheet.style.position = "absolute";
    spritesheet.style.top = "0";
    spritesheet.style.left = "0";
    foxxo.appendChild(spritesheet);

    return [foxxoBoxxo, foxxo, spritesheet];
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
      if (this.state === Foxxo.STATES.Idle || this.state === Foxxo.STATES.Sleep) {
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
        this.foxxoBoxxo.style.left = `${x}px`;
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
  try {
    new Foxxo();
  } catch (e) {
    console.error(e);
  }
})();