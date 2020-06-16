import Tentacle from "./Tentacle";
import Bubbles from "./Bubbles";
import Flock from "./Flock";
import Boid from "./Boid";
import * as p5 from "p5";
import "p5/lib/addons/p5.sound";

function sketch(p) {
  // Mic variable
  let mic, micLevel;

  // Flock Variable from Flock class
  let flock;

  // Variables for tentacle
  let xAI = [],
    yAI = [],
    x = [],
    y = [],
    userTentacle,
    tentacleAI,
    tentacleAI2,
    tentacleAI3,
    segNum = 100,
    segLength = 8,
    t = 0;

  // Array for Bubbles
  let bubbles = [];

  // Variables for stars
  let totalPts = 150;
  let steps = totalPts + 2;

  // Center of the screen
  let loc1 = p.windowWidth / 2,
    loc2 = p.windowHeight / 2;

  // Worm variables
  let worm1X = p.random(1, 5),
    worm1Y = p.random(1, 8),
    worm2X = p.random(1, 8),
    worm2Y = p.random(1, 5),
    worm3X = p.random(1, 2),
    worm3Y = p.random(1, 8);

  // Background function
  p.setGradient = (x, y, w, h, c1, c2) => {
    for (let i = y; i <= y + h; i++) {
      let inter = p.map(i, y, y + h, 0, 1);
      let c = p.lerpColor(c1, c2, inter);
      p.stroke(c);
      p.line(x, i, x + w, i);
    }
  };

  // Auto adjusts the canvas (make canvas responsive);
  p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    window.addEventListener("resize", p.setup);
  };

  // Constructs Canvas and Initialize Tentacles
  p.setup = () => {
    mic = new p5.AudioIn();
    mic.start();

    // Flock class
    flock = new Flock(p);

    // Initializes Canvas
    p.createCanvas(p.windowWidth, p.windowHeight);

    // Creates all the worms
    userTentacle = new Tentacle(
      p,
      x,
      y,
      segNum,
      segLength,
      true,
      p.color(0),
      p.color(74, 177, 245),
      p.color(74, 177, 245)
    );
    tentacleAI = new Tentacle(
      p,
      xAI,
      yAI,
      p.floor(p.random(50, 150)),
      segLength,
      false,
      p.color(237, 124, 121),
      p.color(152, 122, 171),
      p.color(240, 182, 129)
    );
    tentacleAI2 = new Tentacle(
      p,
      xAI,
      yAI,
      p.floor(p.random(50, 150)),
      segLength,
      false,
      p.color(99, 116, 54),
      p.color(139, 165, 64),
      p.color(125, 172, 61)
    );
    tentacleAI3 = new Tentacle(
      p,
      xAI,
      yAI,
      p.floor(p.random(50, 150)),
      segLength,
      false,
      p.color(73, 62, 94),
      p.color(247, 105, 91),
      p.color(240, 160, 98)
    );

    // Bubbles
    for (let i = 0; i < 1; i++) {
      bubbles[i] = new Bubbles(
        p,
        p.random(p.windowWidth),
        p.random(400, 800),
        p.random(10, 50)
      );
      bubbles[i] = new Bubbles(
        p,
        p.random(p.windowWidth),
        p.random(400, 800),
        p.random(2, 10)
      );
    }

    // Add an initial set of boids into the system
    for (let i = 0; i < 100; i++) {
      let b = new Boid(p, p.windowWidth / 3, p.windowHeight / 3);
      flock.addBoid(b);
    }
  };

  // Drawing Canvas
  p.draw = () => {
    // Set gradient background
    p.setGradient(
      0,
      0,
      p.windowWidth,
      p.windowHeight,
      p.color(52, 122, 130),
      p.color(19, 24, 98)
    );
    p.tint(255, 127);

    // Allows for vortext to be dragged around
    micLevel = mic.getLevel();
    if (p.mouseIsPressed) {
      loc1 = p.mouseX;
      loc2 = p.mouseY;
      if (p.keyIsDown(p.CONTROL) || micLevel > 0.08)
        // Spawns more fish when control key is pressed or there is mic input
        flock.addBoid(new Boid(p, p.mouseX, p.mouseY));
    }

    // Creates the blackhole vortex
    p.blackHole(loc1, loc2);
    p.rotate(0);

    // Creates tentacle AIs
    p.translate(p.windowWidth / worm1X, p.windowHeight / worm1Y);
    tentacleAI.makeTentacle(t, 1 / 2);
    p.translate(-p.windowWidth / worm1X, -p.windowHeight / worm1Y);
    p.translate(p.windowWidth / worm2X, p.windowHeight / worm2Y);
    tentacleAI3.makeTentacle(t, 1);
    p.translate(-p.windowWidth / worm2X, -p.windowHeight / worm2Y);
    p.translate(p.windowWidth / worm3X, p.windowHeight / worm3Y);
    tentacleAI2.makeTentacle(t, 2);
    p.translate(-p.windowWidth / worm3X, -p.windowHeight / worm3Y);
    t += 0.15;

    // Initilizes user tentacle
    userTentacle.makeTentacle(t, 1);

    // Creates more bubbles
    if (bubbles.length < 25)
      p.append(
        bubbles,
        new Bubbles(
          p,
          p.random(p.windowWidth),
          p.random(p.windowHeight),
          p.random(10, 50)
        )
      );

    p.strokeWeight(2);
    p.stroke(p.color(237, 134, 120));

    // Runs flock class from p5.js/example
    flock.run();

    // Spawns the bubbles
    for (let i = 0; i < bubbles.length; i++) {
      bubbles[i].show();
      bubbles[i].move();
    }
  };
  // Stars function
  // p.stars = () => {
  //   let rand = 0;
  //   for (let i = 1; i < steps; i++) {
  //     p.strokeWeight(3);
  //     p.stroke(p.floor(p.random(0,256)));
  //     p.point((p.width / steps) * i, p.height / 8 + p.random(-p.windowWidth, p.windowWidth));
  //     rand += p.random(-p.windowHeight, p.windowHeight);
  //   }
  // }

  // vortex function
  p.blackHole = () => {
    let totalRotation = 0;

    p.translate(loc1, loc2);
    for (let x = 420; x >= 40; x = x / 1.08) {
      p.rotate(p.radians(p.frameCount * 0.5));
      p.fill(10, 100);
      p.stroke(p.color(19, 24, 98));
      p.strokeWeight(1);
      p.line(0, 0, x / 5, x / 5);
      totalRotation += p.radians(p.frameCount * 0.5);
      let s = 0.25;
      for (let d = 0.25; d < 2; d += s) {
        p.strokeWeight(p.random(5));
        p.stroke(p.color(255, 255, 255));
        p.line(
          (x / 5) * p.cos(d),
          (x / 5) * p.sin(d),
          (x / 5) * p.cos(d),
          (x / 5) * p.sin(d)
        );
      }
    }
    p.rotate(-totalRotation);
    p.translate(-loc1, -loc2);
  };
}

export default sketch;
