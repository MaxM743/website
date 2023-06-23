let triangles = [];
let colors;
const steps = 15;


function setup() {
  triangles = [];
  colors = [
    color(0, 0, 0),
    color(0, 0, 1 * 255 / 5),
    color(0, 0, 2 * 255 / 5),
    color(0, 0, 3 * 255 / 5),
    color(0, 0, 4 * 255 / 5),
  ];

  const headerHeight = document.querySelector('header').offsetHeight;
  const footerHeight = document.querySelector('footer').offsetHeight;
  const canvasHeight = windowHeight - footerHeight - headerHeight;
  let canvas = createCanvas(0.8*windowWidth, 0.95*canvasHeight);
  canvas.parent('p5-sketch-main');
  stroke(0);
  strokeWeight(1);
  strokeJoin(BEVEL);
  rectMode(CENTER);
  
  const matrix = [];

  const s = width / steps;

  for (let i = 1; i < steps; i++) {
    const line_ = [];
    for (let j = 1; j < steps; j++) {
      const x = map(i, 0, steps, 0, width) + (j % 2 == 0 ? - s / 2 : 0) + lerp(-1, 1, random()) * s / 3;
      const y = map(j, 0, steps, 0, height) + lerp(-1, 1, random()) * s / 3;
      line_.push({ x, y });
      // point(x, y);
    }
    matrix.push(line_);
  }
  for (let i = 0; i < steps - 2; i++) {
    for (let j = 0; j < steps - 2; j++) {
      let pt1 = { x: matrix[j][i].x, y: matrix[j][i].y };
      let pt2 = { x: matrix[j + 1][i].x, y: matrix[j + 1][i].y };
      let pt3 = { x: matrix[j + (i % 2 == 0 ? 1 : 0)][i + 1].x, y: matrix[j + (i % 2 == 0 ? 1 : 0)][i + 1].y };
      triangles.push(new Triangle(pt1, pt2, pt3));


      let pt4 = { x: matrix[j + (i % 2 == 1 ? 1 : 0)][i].x, y: matrix[j + (i % 2 == 1 ? 1 : 0)][i].y };
      let pt5 = { x: matrix[j][i + 1].x, y: matrix[j][i + 1].y };
      let pt6 = { x: matrix[j + 1][i + 1].x, y: matrix[j + 1][i + 1].y };
      triangles.push(new Triangle(pt4, pt5, pt6));
    }
  }

}
function draw() {
  background('black');

  for (let tri of triangles) {
    if (tri.isMouseIn()) {
      if (!tri.isIn) {
        tri.isIn = true;
        let new_index = int(random(1, 5));
        while (new_index == tri.index) {
          new_index = int(random(1, 5));
        }
        tri.index = new_index;
      }
    }
    else {
      tri.isIn = false;
    }


    tri.show();
  }
}

function mouseClicked() {

  for (let i = 0; i < triangles.length; i++) {
    triangles[i].index = int(random(1, 5));
  }

}
function windowResized() {
  const headerHeight = document.querySelector('header').offsetHeight;
  const footerHeight = document.querySelector('footer').offsetHeight;
  const canvasHeight = windowHeight - footerHeight - headerHeight;

  resizeCanvas(0.8*windowWidth, 0.9*canvasHeight); // Resize the canvas to the full window width and calculated height

  setup(); // Call the setup function to reinitialize the sketch
}

class Triangle{
  constructor(pt1, pt2, pt3){
    this.pt1 = pt1;
    this.pt2 = pt2;
    this.pt3 = pt3;
    this.index = 0;
    this.isIn = false;
  }
  
  isMouseIn(){
    let mousePos = createVector(mouseX, mouseY);
    // Calculate vectors from the triangle vertices to the mouse position
    let v0 = createVector(this.pt3.x - this.pt1.x, this.pt3.y - this.pt1.y);
    let v1 = createVector(this.pt2.x - this.pt1.x, this.pt2.y - this.pt1.y);
    let v2 = createVector(mousePos.x - this.pt1.x, mousePos.y - this.pt1.y);

    // Compute dot products
    let dot00 = v0.dot(v0);
    let dot01 = v0.dot(v1);
    let dot02 = v0.dot(v2);
    let dot11 = v1.dot(v1);
    let dot12 = v1.dot(v2);


    // Compute barycentric coordinates
    let invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
    let u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    let v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    // Check if the point is inside the triangle
    return u >= 0 && v >= 0 && u + v <= 1;
  }
  show(){
    fill(colors[this.index]);
    strokeWeight(0.5);
    stroke('white');
  
    triangle(this.pt1.x, this.pt1.y, this.pt2.x, this.pt2.y, this.pt3.x, this.pt3.y)
  }
}

  
  
  