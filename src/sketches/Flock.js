// Altered version of Flock class from p5.js example
// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Flock object
// Does very little, simply manages the array of all the boids

export default class Flock {
    constructor(p){
      // An array for all the boids
      this.p = p;
      this.boids = []; // Initialize the array
    }
  
    run = () => {
      for (let i = 0; i < this.boids.length; i++) {
        this.boids[i].run(this.boids);  // Passing the entire list of boids to each boid individually
      }
    }
  
    addBoid = (b) =>{
      this.boids.push(b);
    }
  }