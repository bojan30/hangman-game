(function(){
  const ul = document.getElementById('word-ul');
  const gameOver = document.getElementById('game-over');
  const keysLetters = document.getElementsByClassName('key-letter');
  //canvas and context refs
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  let numOfHits = 0;
  let numOfMisses = 0;
  const keys = Array.from(keysLetters);
  
  let words = ['dog','parrot','giraffe','iguana','jaguar','lion','elephant','horse'];

  //generating a random word

  function generateWord(words) {
    let random = Math.floor(Math.random() * words.length);
    return words[random];
  };

  //check if there is a letter with a pressed key inside a word

  function locations(word, letter) {
    let loc = [];
    for (let i = 0; i < word.length; i++) {
      if (word.toUpperCase().charAt(i) === letter) {
        loc.push(i);
      }
    }
    return loc;
  }

  //constructor for lines
  function Line(xStart, yStart, xEnd, yEnd, color) {
    this.startPos = {
      x: xStart,
      y: yStart
    },
      this.endPos = {
        x: xEnd,
        y: yEnd
      },
      this.color = color;
  }

  Line.prototype.draw = function (context) {
    context.beginPath();
    context.moveTo(this.endPos.x, this.endPos.y);
    context.lineTo(this.startPos.x, this.startPos.y);
    context.strokeStyle = this.color;
    context.lineWidth = 2;
    context.stroke();
    context.closePath();
  }

  function Circle(x, y, r, color) {
    this.position = {
      x: x,
      y: y
    },
      this.radius = r,
      this.color = color
  }

  Circle.prototype.draw = function (context) {
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
    context.strokeStyle = this.color;
    context.stroke();
    context.closePath();
  }

  //body parts
  let head = new Circle(150, 80, 10, '#fff');
  let neck = new Line(150, 90, 150, 100, '#fff');
  let leftArm = new Line(150, 100, 130, 120, '#fff');
  let rightArm = new Line(150, 100, 170, 120, '#fff');
  let body = new Line(150, 100, 150, 130, '#fff');
  let leftLeg = new Line(150, 130, 130, 150, '#fff');
  let rightLeg = new Line(150, 130, 170, 150, '#fff');

  function drawHanger(context) {
    let bars = [
      new Line(20, 200, 60, 200, '#fff'),
      new Line(40, 200, 40, 40, '#fff'),
      new Line(40, 40, 150, 40, '#fff'),
      new Line(150, 40, 150, 70, '#fff'),
    ];
    bars.forEach(function (bar) {
      bar.draw(context);
    })
  }
  function clearCanvas(context){
    context.clearRect(0,0,canvas.width,canvas.height);
  };
  drawHanger(context);

  function drawHangman(part, context) {
    part.draw(context);
  }

  //game over div display function
  function displayStatusDiv(message) {
    gameOver.classList.add('active');
    gameOver.innerHTML = `<p>${message}</p>
    <button id="retry">Retry</button>`;
  };

  //the WORD to find :D
  let word = generateWord(words);

  //create a li elements for letters

  function createLiTag(letter) {
    const li = document.createElement('LI');
    li.setAttribute('class', 'letter');
    li.innerHTML = `<a href = "#">${letter}</a>`;
    ul.appendChild(li);
  }

  //displaying word to find, but with hidden letters
  function displayWord(word) {
    for (letter of word) {
      createLiTag(letter.toUpperCase());
    }
  };

  displayWord(word);

  //all the letters li tags
  function revealLetters(arr){
    let listEl = document.getElementsByClassName('letter');
    for(let i = 0; i < arr.length; i++){
      listEl[arr[i]].children[0].style.visibility = 'visible';
    }
  };

  function win(hits,word){
    if(hits === word.length) return true;
  }

  keys.forEach(function (key) {
    key.addEventListener('click', clickHandler);
  });

  //main handler function
  function clickHandler(e) {
    //add class pressed to a keyboard button
    e.target.classList.add('pressed');
    //then remove event listener so that key can't be pressed any more
    e.target.removeEventListener('click', clickHandler);
    //check if there is a hit or no
    if (locations(word, e.target.innerText).length === 0) {
      //no hits at all
      numOfMisses++;
      //time to draw a hangman
      switch(numOfMisses){
        case 1: drawHangman(head,context); break;
        case 2: drawHangman(neck,context); break;
        case 3: drawHangman(leftArm,context); break;
        case 4: drawHangman(rightArm,context); break;
        case 5: drawHangman(body,context); break;
        case 6: drawHangman(leftLeg,context); break; 
        case 7: 
        drawHangman(rightLeg,context);
        //place to display game over
        displayStatusDiv('You lose!');
        const retry = document.getElementById('retry');

        retry.addEventListener('click', function () {
          reset();
          clearCanvas(context);
          drawHanger(context);
        });
        break;
      } 
    }
    else {
      //check how many revealed 
      //time to display some letters
      revealLetters(locations(word, e.target.innerText));
      numOfHits += locations(word, e.target.innerText).length;
      //check if all letters are hit
      if(win(numOfHits,word)){
        //display status for win
        displayStatusDiv('You win! Great job!');
        //than reset game on click of retry button
        const retry = document.getElementById('retry');

        retry.addEventListener('click', function () {
          reset();
          clearCanvas(context);
          drawHanger(context);
        });
      }
    }
  }
  function reset(){
    word = generateWord(words);
    //remove active class from display status div
    gameOver.classList.remove('active');
    //remove all list elements;
    while(ul.firstChild){
      ul.removeChild(ul.firstChild);
    }
    //display new word
    displayWord(word);
    //reset class for key letters
    keys.forEach(function(key){
      key.classList.remove('pressed');
      key.addEventListener('click',clickHandler);
    });
    //reset hits and misses to 0
    numOfHits = 0;
    numOfMisses = 0;
  };
})();
