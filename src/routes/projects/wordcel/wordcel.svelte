<script>
    import p5 from 'p5';
    import dictionary from './dictionary.txt';
    
    export let words = [];
    
    export default {
      onMount() {
        this.p5 = new p5(this.$refs.canvas);
        this.p5.setup(() => {
          this.p5.createCanvas(windowWidth, windowHeight);
        });
      },
    
      render() {
        return (
          <div>
            <canvas ref="canvas" />
          </div>
        );
      },
    
      update() {
        this.p5.draw(() => {
          this.p5.background(255);
    
          for (let i = 0; i < words.length; i++) {
            let word = words[i];
            word.display();
            word.update();
          }
        });
      },
    
      createWord() {
        let randomIndex = floor(random(dictionary.length));
        let randomWord = dictionary[randomIndex];
        let word = new Word(randomWord, random(width), random(height), millis());
        words.push(word);
      }
    };
    </script>