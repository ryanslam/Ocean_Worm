// Worm class
export default class Tentacle {
      
    constructor(p, arrX, arrY, num, length, userMouse, c1, c2, c3, rotation){
        this.p = p;
        this.arrX = arrX;
        this.arrY = arrY;
        this.num = num;
        this.length = length; 
        this.userMouse = userMouse
        this.c1 = c1;
        this.c2 = c2;
        this.c3 = c3;
        this.setVals();
        this.rotation = rotation;
    };
      
    // Sets the arrays of the segments
    setVals = () =>{
      for (let i = 0; i < this.num; i++) {
        this.arrX[i] = 0;
        this.arrY[i] = 0;
      }
    };
  
    // Sets the postition to the user mouse coordinates.
    setToMouse = () =>{
      this.userx = this.p.mouseX;
      this.usery = this.p.mouseY;
    };
  
    // Works on movingaround the segement 
    dragSegment = (i, xin, yin, mult) => {
      const dx = xin - this.arrX[i];
      const dy = yin - this.arrY[i];
      const angle = this.p.atan2(dy, dx);
      this.arrX[i] = xin - this.p.cos(angle) * this.length;
      this.arrY[i] = yin - this.p.sin(angle) * this.length;
      this.buildAndColorSeg(i, mult, angle, this.c1, this.c2, this.c3);
    };
  
    // Creates the entire tentacle
    makeTentacle = (t, mult) => { 
    if(this.userMouse){
    this.setToMouse();
    }
    else{
        this.userx = (this.x1(t)-this.x2(t));
        this.usery = (this.y1(t)-this.y2(t));
    }  
      this.dragSegment(0, this.userx, this.usery, mult);
  
      this.p.strokeWeight(8);
      this.p.stroke(255);
      for (let i = 0; i < this.arrX.length - 1; i++) {
        this.dragSegment(i + 1, this.arrX[i], this.arrY[i], mult);
        // this.arrX[i] += this.p.random(-1, 1);
        // this.arrY[i] += this.p.random(-1, 1);
      }
    };
  
    // Asigns the color to the segments and constructs each
    buildAndColorSeg = (i, mult, angle, c1, c2, c3) =>{
      this.p.stroke(c1);
      this.segment(this.arrX[i]*mult, this.arrY[i]*mult, angle);
      this.p.stroke(c2);
      this.segment(this.arrX[i]*mult, this.arrY[i]*mult, angle*2);
      this.p.stroke(c3);
      this.segment(this.arrX[i]*mult, this.arrY[i]*mult, angle/2);
    }
  
    // Creates a single segment
    segment = (x, y, a) => {
      this.p.push();
      this.p.translate(x, y);
      this.p.rotate(a);
      this.p.line(0, 0, this.length, 0);
      this.p.pop();
    };
  
    // In charge of the path that the worm AI take
    x1 = (t) =>{
      return (this.p.sin(t/10)*125+this.p.sin(t/20)*125+this.p.sin(t/30)*125);
    };
  
    y1 = (t) =>{
      return (this.p.cos(t/10)*125+this.p.cos(t/20)*125+this.p.cos(t/30)*125);
    };
  
    x2 = (t) =>{
      return (this.p.sin(t/15)*125+this.p.sin(t/25)*125+this.p.sin(t/35)*125);
    };
  
    y2 = (t) =>{
      return (this.p.cos(t/15)*125+this.p.cos(t/25)*125+this.p.cos(t/35)*125);
    };
  };