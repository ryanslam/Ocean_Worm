export default class Bubbles {

    constructor(p,tempx,tempy, size){
        this.p = p;
        this.x = tempx;
        this.y = tempy;
        this.size = size;
        this.r = this.p.random(255,240);
        this.g = this.p.random(255,240);
        this.b = this.p.random(255,240);
    }

    // Moves the bubbles upward
    move(){
        this.x += this.p.random(-4,4);
        this.y += this.p.random(-5,-2);
        // Tests to see if the bubbles surpass the screen
        if (this.y < 0){
            this.y = this.p.random(this.p.windowHeight,this.p.windowHeight+100);
        }
        if (this.x>this.p.windowwidth){
            this.x = 0;
        }
        if (this.x < 0){
            this.x = this.p.windowwidth;
        }
    }
    
    // Creates the shape of the bubbles
    show(){
        this.p.stroke(255);
        this.p.strokeWeight(3);
        this.p.fill(this.r,this.g,this.b,100);
        this.p.ellipse(this.x,this.y,this.size,this.size);
    }
}