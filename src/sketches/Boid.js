// Altered version of Boid class from p5.js example
import * as p5 from "p5";
// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Boid class
// Methods for Separation, Cohesion, Alignment added

export default class Boid {
  constructor(p,x,y) {
    this.p = p;
    this.acceleration = p.createVector(0, 0);
    this.velocity = p.createVector(p.random(-1, 1), p.random(-1, 1));
    this.position = p.createVector(x, y);
    this.r = 4.0;
    this.maxspeed = 3;    // Maximum speed
    this.maxforce = 0.05; // Maximum steering force
    this.size = p.random (5,10);
    this.c1 = this.p.random(255)
    this.c2 = this.p.random(255)
    this.c3 = this.p.random(255)
  }

  run = (boids) =>{
    this.flock(boids);
    this.update();
    this.borders();
    this.render();
  }

  applyForce = (force) =>{
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }

  // We accumulate a new acceleration each time based on three rules
  flock = (boids) => {
    let sep = this.separate(boids);   // Separation
    let ali = this.align(boids);      // Alignment
    let coh = this.cohesion(boids);   // Cohesion
    // Arbitrarily weight these forces
    sep.mult(1.5);
    ali.mult(1.0);
    coh.mult(1.0);
    // Add the force vectors to acceleration
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
  }

  // Method to update location
  update = () =>{
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelertion to 0 each cycle
    this.acceleration.mult(0);
  }

  // A method that calculates and applies a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  seek = (target) =>{
    let desired = p5.Vector.sub(target,this.position);  // A vector pointing from the location to the target
    // Normalize desired and scale to maximum speed
    desired.normalize();
    desired.mult(this.maxspeed);
    // Steering = Desired minus Velocity
    let steer = p5.Vector.sub(desired,this.velocity);
    steer.limit(this.maxforce);  // Limit to maximum steering force
    return steer;
  }

  render = () =>{
    // Draw a triangle rotated in the direction of velocity
    let theta = this.velocity.heading() + this.p.radians(90);
    this.p.fill(127);
    this.p.stroke(this.p.color(this.c1,this.c2,this.c3));
    this.p.push();
    this.p.triangle (this.position.x, this.position.y, this.position.x,this.position.y+this.size, 
      this.position.x+this.size, this.position.y+this.size/2);
    this.p.ellipse (this.position.x+this.size*2.5, this.position.y+this.size/2, this.size*3, 
      this.size);
    // this.p.rotate(theta);
    // this.p.beginShape();
    // this.p.vertex(0, -this.r * 2);
    // this.p.vertex(-this.r, this.r * 2);
    // this.p.vertex(this.r, this.r * 2);
    // this.p.endShape(this.p.CLOSE);
    this.p.pop();
  }

  // Wraparound
  borders = () =>{
    if (this.position.x < -this.r)  this.position.x = this.p.winidowWidth + this.r;
    if (this.position.y < -this.r)  this.position.y = this.p.windowHeight + this.r;
    if (this.position.x > this.p.windowWidth + this.r) this.position.x = -this.r;
    if (this.position.y > this.p.windowHeight + this.r) this.position.y = -this.r;
  }

  // Separation
  // Method checks for nearby boids and steers away
  separate = (boids) =>{
    let desiredseparation = 25.0;
    let steer = this.p.createVector(0, 0);
    let count = 0;
    // For every boid in the system, check if it's too close
    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.position,boids[i].position);
      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
      if ((d > 0) && (d < desiredseparation)) {
        // Calculate vector pointing away from neighbor
        let diff = p5.Vector.sub(this.position, boids[i].position);
        diff.normalize();
        diff.div(d);        // Weight by distance
        steer.add(diff);
        count++;            // Keep track of how many
      }
    }
    // Average -- divide by how many
    if (count > 0) {
      steer.div(count);
    }

    // As long as the vector is greater than 0
    if (steer.mag() > 0) {
      // Implement Reynolds: Steering = Desired - Velocity
      steer.normalize();
      steer.mult(this.maxspeed);
      steer.sub(this.velocity);
      steer.limit(this.maxforce);
    }
    return steer;
  }

  // Alignment
  // For every nearby boid in the system, calculate the average velocity
  align = (boids) =>{
    let neighbordist = 50;
    let sum = this.p.createVector(0,0);
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.position,boids[i].position);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(boids[i].velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxspeed);
      let steer = p5.Vector.sub(sum, this.velocity);
      steer.limit(this.maxforce);
      return steer;
    } else {
      return this.p.createVector(0, 0);
    }
  }

  // Cohesion
  // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
  cohesion = (boids) => {
    let neighbordist = 50;
    let sum = this.p.createVector(0, 0);   // Start with empty vector to accumulate all locations
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.position,boids[i].position);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(boids[i].position); // Add location
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return this.seek(sum);  // Steer towards the location
    } else {
      return this.p.createVector(0, 0);
    }
  }
}