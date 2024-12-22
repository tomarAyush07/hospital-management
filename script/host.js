gsap.registerPlugin(Flip);

const body = document.body;
const content = document.querySelector(".content");
const enterButton = document.querySelector(".enter");
const fullview = document.querySelector(".fullview");
const grid = document.querySelector(".grid");
const gridRows = grid.querySelectorAll(".row");
let winsize = { width: window.innerWidth, height: window.innerHeight };
        window.addEventListener("resize", () => {
        winsize = { width: window.innerWidth, height: window.innerHeight };
});

let mousepos = { x: winsize.width / 2, y: winsize.height / 2 };
    const config = {
        translateX: true,
        skewX: false,
        contrast: true,
        scale: false,
        brightness: true
};
const numRows = gridRows.length;
const middleRowIndex = Math.floor(numRows / 2);
const middleRow = gridRows[middleRowIndex];
const middleRowItems = middleRow.querySelectorAll(".row__item");
const numRowItems = middleRowItems.length;
const middleRowItemIndex = Math.floor(numRowItems / 2); 
    const middleRowItemInner = middleRowItems[middleRowItemIndex].querySelector(
    ".row__item-inner"
);
const middleRowItemInnerImage = middleRowItemInner.querySelector(
  ".row__item-img"
);
middleRowItemInnerImage.classList.add("row__item-img--large");
const baseAmt = 0.1; 
const minAmt = 0.05; 
const maxAmt = 0.1; 
let renderedStyles = Array.from({ length: numRows }, (v, index) => {
  const distanceFromMiddle = Math.abs(index - middleRowIndex);
  const amt = Math.max(baseAmt - distanceFromMiddle * 0.03, minAmt);
  const scaleAmt = Math.min(baseAmt + distanceFromMiddle * 0.03, maxAmt);
            let style = { amt, scaleAmt };

            if (config.translateX) {
                style.translateX = { previous: 0, current: 0 };
            }
            if (config.skewX) {
                style.skewX = { previous: 0, current: 0 };
            }
            if (config.contrast) {
                style.contrast = { previous: 100, current: 100 };
            }
            if (config.scale) {
                style.scale = { previous: 1, current: 1 };
            }
            if (config.brightness) {
                style.brightness = { previous: 100, current: 100 };
            }

            return style;
});
let requestId;
const getMousePos = (ev) => {
  let posx = 0;
  let posy = 0;
        if (!ev) ev = window.event;
        if (ev.pageX || ev.pageY) {
            posx = ev.pageX;
            posy = ev.pageY;
        } else if (ev.clientX || ev.clientY) {
            posx =
            ev.clientX +
            document.body.scrollLeft +
            document.documentElement.scrollLeft;
            posy =
            ev.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        return { x: posx, y: posy };
};
const updateMousePosition = (ev) => {
  const pos = getMousePos(ev);
  mousepos.x = pos.x;
  mousepos.y = pos.y;
};
const lerp = (a, b, n) => (1 - n) * a + n * b;
const calculateMappedX = () => {
  return (((mousepos.x / winsize.width) * 2 - 1) * 40 * winsize.width) / 100;
};
const calculateMappedSkew = () => {
  return ((mousepos.x / winsize.width) * 2 - 1) * 3;
};
const calculateMappedContrast = () => {
  const centerContrast = 100;
  const edgeContrast = 330;
  const t = Math.abs((mousepos.x / winsize.width) * 2 - 1);
  const factor = Math.pow(t, 2);
  return centerContrast - factor * (centerContrast - edgeContrast);
};
const calculateMappedScale = () => {
  const centerScale = 1;
  const edgeScale = 0.95;
  return (
    centerScale -
    Math.abs((mousepos.x / winsize.width) * 2 - 1) * (centerScale - edgeScale)
  );
};
const calculateMappedBrightness = () => {
  const centerBrightness = 100;
  const edgeBrightness = 15;
  const t = Math.abs((mousepos.x / winsize.width) * 2 - 1);
  const factor = Math.pow(t, 2); 
  return centerBrightness - factor * (centerBrightness - edgeBrightness);
};

const getCSSVariableValue = (element, variableName) => {
  return getComputedStyle(element).getPropertyValue(variableName).trim();
};
const render = () => {
  const mappedValues = {
    translateX: calculateMappedX(),
    skewX: calculateMappedSkew(),
    contrast: calculateMappedContrast(),
    scale: calculateMappedScale(),
    brightness: calculateMappedBrightness()
  };
  gridRows.forEach((row, index) => {
    const style = renderedStyles[index];
    for (let prop in config) {
      if (config[prop]) {
        style[prop].current = mappedValues[prop];
        const amt = prop === "scale" ? style.scaleAmt : style.amt;
        style[prop].previous = lerp(
          style[prop].previous,
          style[prop].current,
          amt
        );
      }
    }
let gsapSettings = {};
    if (config.translateX) gsapSettings.x = style.translateX.previous;
    if (config.skewX) gsapSettings.skewX = style.skewX.previous;
    if (config.scale) gsapSettings.scale = style.scale.previous;
    if (config.contrast)
      gsapSettings.filter = `contrast(${style.contrast.previous}%)`;
    if (config.brightness)
      gsapSettings.filter = `${
        gsapSettings.filter ? gsapSettings.filter + " " : ""
      }brightness(${style.brightness.previous}%)`;

    gsap.set(row, gsapSettings);
  });
  requestId = requestAnimationFrame(render);
};
const startRendering = () => {
  if (!requestId) {
    render();
  }
};

const stopRendering = () => {
  if (requestId) {
    cancelAnimationFrame(requestId);
    requestId = undefined;
  }
};

const enterFullview = () => {
  const flipstate = Flip.getState(middleRowItemInner);
  fullview.appendChild(middleRowItemInner);
  const transContent = getCSSVariableValue(content, "--trans-content");
  const tl = gsap.timeline();
  tl.add(
    Flip.from(flipstate, {
      duration: 0.9,
      ease: "power4",
      absolute: true,
      onComplete: stopRendering
    })
  )
    .to(
      grid,
      {
        duration: 0.9,
        ease: "power4",
        opacity: 0.01
      },
      0
    )
    .to(
      middleRowItemInnerImage,
      {
        scale: 1.2,
        duration: 3,
        ease: "sine"
      },
      "<-=0.45"
    )
    .to(content, {
      y: transContent, 
      duration: 0.9,
      ease: "power4"
    });
  enterButton.classList.add("hidden");
  body.classList.remove("noscroll");
};
const init = () => {
  startRendering();
  enterButton.addEventListener("click", enterFullview);
  enterButton.addEventListener("touchstart", enterFullview);
};
window.addEventListener("mousemove", updateMousePosition);
window.addEventListener("touchmove", (ev) => {
  const touch = ev.touches[0];
  updateMousePosition(touch);
});

const initSmoothScrolling = () => {
  const lenis = new Lenis({ lerp: 0.15 });
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
};
initSmoothScrolling();
init();
