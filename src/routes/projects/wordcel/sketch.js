let dictionary;
let words = [];
let colorChangeDelay = 500; // Delay in milliseconds for color change
let colorChangeRate = 0.2; // Rate of color change
let collisionDelay = 1000; // Delay in milliseconds before words can start colliding

function preload() {
  dictionary = loadStrings('dictionary.txt'); // Load the dictionary file
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(14);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(255); // White background

  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    word.display();
    word.update();

    for (let j = i + 1; j < words.length; j++) {
      let otherWord = words[j];
      if (millis() - word.creationTime > collisionDelay) {
        if (word.isColliding(otherWord)) {
          word.collide(otherWord);
        }
      }
    }
  }
}

function mousePressed() {
  createWord(mouseX, mouseY);
}

function mouseDragged() {
  createWord(mouseX, mouseY);
}

function createWord(x, y) {
  let randomIndex = floor(random(dictionary.length));
  let randomWord = dictionary[randomIndex];
  let word = new Word(randomWord, x, y, millis());
  words.push(word);
}

class Word {
  constructor(word, x, y, creationTime) {
    this.word = word;
    this.position = createVector(x, y);
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    this.velocity.normalize();
    this.velocity.mult(random(0.5, 4));
    this.color = color(random(255), random(255), random(255));
    this.colorChangeTime = millis();
    this.creationTime = creationTime;
    this.rotationSpeed = random(-0.02, 0.02); // Rotation speed
  }

  display() {
    fill(this.color);
    push();
    translate(this.position.x, this.position.y);
    rotate(frameCount * this.rotationSpeed); // Apply rotation
    text(this.word, 0, 0);
    pop();
  }

  update() {
    this.position.add(this.velocity);

    // Check boundaries and reverse velocity if hitting the edge
    if (this.position.x + textWidth(this.word)/2 > width || this.position.x -       textWidth(this.word)/2 < 0) {
      this.velocity.x *= -1; // Reverse x velocity
    }
    
    if (this.position.y > height || this.position.y < 0) {
      this.velocity.y *= -1; // Reverse y velocity
    }

    // Color change
    let colorChangeElapsed = millis() - this.colorChangeTime;
    if (colorChangeElapsed >= colorChangeDelay) {
      this.colorChangeTime = millis();
      this.updateColor();
    }
  }

  updateColor() {
    let r = red(this.color);
    let g = green(this.color);
    let b = blue(this.color);

    r += random(-colorChangeRate, colorChangeRate);
    g += random(-colorChangeRate, colorChangeRate);
    b += random(-colorChangeRate, colorChangeRate);

    r = constrain(r, 0, 255);
    g = constrain(g, 0, 255);
    b = constrain(b, 0, 255);

    this.color = color(r, g, b);
  }

  isColliding(otherWord) {
    let distance = p5.Vector.dist(this.position, otherWord.position);
    let combinedRadius = textWidth(this.word) / 2 + textWidth(otherWord.word) / 2;
    return distance < combinedRadius;
  }

  collide(otherWord) {
    let newVelocity = p5.Vector.add(this.velocity, otherWord.velocity);
    newVelocity.normalize();
    newVelocity.mult(random(0.5, 1.5));

    let randomIndex = floor(random(dictionary.length));
    let randomWord = dictionary[randomIndex];
    let newWord = new Word(randomWord, this.position.x, this.position.y, millis());
    newWord.velocity = newVelocity;

    words.push(newWord);
    this.remove();
    otherWord.remove();
  }

  remove() {
    let index = words.indexOf(this);
    if (index !== -1) {
      words.splice(index, 1);
    }
  }
}
