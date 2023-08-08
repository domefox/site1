<script>
    import p5 from 'p5';

    let sketch = (p) => {
        let dictionary;
        let words = [];
        let colorChangeDelay = 500;
        let colorChangeRate = 0.2;
        let collisionDelay = 1000;

        p.preload = function() {
            dictionary = p.loadStrings('dictionary.txt');
        }

        p.setup = function() {
            p.createCanvas(p.windowWidth, p.windowHeight);
            p.textSize(14);
            p.textAlign(p.CENTER, p.CENTER);
        }

        p.draw = function() {
            p.background(255);

            for (let i = 0; i < words.length; i++) {
                let word = words[i];
                word.display();
                word.update();

                for (let j = i + 1; j < words.length; j++) {
                    let otherWord = words[j];
                    if (p.millis() - word.creationTime > collisionDelay) {
                        if (word.isColliding(otherWord)) {
                            word.collide(otherWord);
                        }
                    }
                }
            }
        }

        p.mousePressed = function() {
            createWord(p.mouseX, p.mouseY);
        }

        p.mouseDragged = function() {
            createWord(p.mouseX, p.mouseY);
        }

        function createWord(x, y) {
            let randomIndex = p.floor(p.random(dictionary.length));
            let randomWord = dictionary[randomIndex];
            let word = new Word(randomWord, x, y, p.millis());
            words.push(word);
        }

        class Word {
            constructor(word, x, y, creationTime) {
                this.word = word;
                this.position = p.createVector(x, y);
                this.velocity = p.createVector(p.random(-1, 1), p.random(-1, 1));
                this.velocity.normalize();
                this.velocity.mult(p.random(0.5, 4));
                this.color = p.color(p.random(255), p.random(255), p.random(255));
                this.colorChangeTime = p.millis();
                this.creationTime = creationTime;
                this.rotationSpeed = p.random(-0.02, 0.02);
            }

            display() {
                p.fill(this.color);
                p.push();
                p.translate(this.position.x, this.position.y);
                p.rotate(p.frameCount * this.rotationSpeed);
                p.text(this.word, 0, 0);
                p.pop();
            }

            update() {
                this.position.add(this.velocity);

                if (this.position.x + p.textWidth(this.word)/2 > p.width || this.position.x - p.textWidth(this.word)/2 < 0) {
                    this.velocity.x *= -1;
                }
                
                if (this.position.y > p.height || this.position.y < 0) {
                    this.velocity.y *= -1;
                }

                let colorChangeElapsed = p.millis() - this.colorChangeTime;
                if (colorChangeElapsed >= colorChangeDelay) {
                    this.colorChangeTime = p.millis();
                    this.updateColor();
                }
            }

            updateColor() {
                let r = p.red(this.color);
                let g = p.green(this.color);
                let b = p.blue(this.color);

                r += p.random(-colorChangeRate, colorChangeRate);
                g += p.random(-colorChangeRate, colorChangeRate);
                b += p.random(-colorChangeRate, colorChangeRate);

                r = p.constrain(r, 0, 255);
                g = p.constrain(g, 0, 255);
                b = p.constrain(b, 0, 255);

                this.color = p.color(r, g, b);
            }

            isColliding(otherWord) {
                let distance = p5.Vector.dist(this.position, otherWord.position);
                let combinedRadius = p.textWidth(this.word) / 2 + p.textWidth(otherWord.word) / 2;
                return distance < combinedRadius;
            }

            collide(otherWord) {
                let newVelocity = p5.Vector.add(this.velocity, otherWord.velocity);
                newVelocity.normalize();
                newVelocity.mult(p.random(0.5, 1.5));

                let randomIndex = p.floor(p.random(dictionary.length));
                let randomWord = dictionary[randomIndex];
                let newWord = new Word(randomWord, this.position.x, this.position.y, p.millis());
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
    }

    let myp5 = new p5(sketch);
</script>

<style>
    canvas {
        display: block;
    }
</style>

<canvas></canvas>
