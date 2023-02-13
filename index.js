//Elementos HTML
const board = document.getElementById("board");
const scoreBoard = document.getElementById("scoreBoard");
const startButton = document.getElementById("start");
const gameOverSign = document.getElementById("gameOver");

//game settings
//tamaño del tablero
const boardSize = 10;
//velocidad del juego 100 mls
const gameSpeed = 100;
//tipos de cuadrados y sus valores en el tablero
const squareTypes = {
  emptySquare: 0,
  snakeSquare: 1,
  foodSquare: 2,
};

const directions = {
  ArrowUp: -10,
  ArrowDown: 10,
  ArrowRight: 1,
  ArrowLeft: -1,
};

// variables del juego
let snake; //array donde se guarda la serpiente
let score;
let direction; //cada dirección en la que va el usuario
let boardSquares; //donde se guarda la informacion del tablero
let emptySquares; //lugares vacios para generar la comida de la serpiente en lugares aleatorios
let moveInterval; // se guarda el inv¿tervalo para hacer el movto de la serpiente

const drawSnake = () => {
  snake.forEach((square) => drawSquare(square, "snakeSquare")); //tomar los 4 elem de la snake y por cada cuadrado se dibuja de tipo snakeSquare
};

// drawSquare: rellna cada cuadrado del tablero
// @params
// square: posicion del cuadrado
// type: tipo de cuadrado (empty, snakeSquare, foodSquare)
const drawSquare = (square, type) => {
  const [row, column] = square.split(""); // separar la row de la columna
  boardSquares[row][column] = squareTypes[type]; //guardar el square y asignarle el value (foodsquare, snake...)
  const squareElement = document.getElementById(square); //llevarlo al HTML
  squareElement.setAttribute("class", `square ${type}`); //settear la clase a square y a tipo, se pinta depende del tipo que sea

  if (type === "emptySquares") {
    emptySquares.push(square); //se crea un cuadrado vacío
  } else {
    //si no es un emptySquare
    if (emptySquares.indexOf(square) !== -1) {
      //sacar el elemento del array de lugares vacios
      emptySquares.splice(emptySquares.indexOf(square), 1); //si existe el elemento se saca del array
    }
  }
};

const setDirection = (newDirection) => {
  //recibe una dirección y va a settear la variable direction
  direction = newDirection;
};

const directionEvent = (key) => {
  switch (
    key.code //se hacen para que si apreta una tecla no pueda apretar la opuesta porque sería un error, setDirection si corresponde, se settea una nueva direccion
  ) {
    case "ArrowUp":
      direction != "ArrowDown" && setDirection(key.code);
      break;
    case "ArrowDown":
      direction != "ArrowUp" && setDirection(key.code);
      break;
    case "ArrowLeft":
      direction != "ArrowRight" && setDirection(key.code);
      break;
    case "ArrowRight":
      direction != "ArrowRight" && setDirection(key.code);
      break;
  }
};

const moveSnake = () => {
  const newSquare = String(             //se crea un nuevo cuadrado al cual se moverá la serpiente
    Number(snake[snake.length - 1]) + directions[direction]
  ) //se crea un square (string) compuesto por el ultimo lugar de la serpiente y se le suma el valor de la dirección
    .padStart(2, "0");
  const [row, column] = newSquare.split(""); //se toman los valores para seleccionar en el square lo que se necesite
  if (
    newSquare < 0 || //si es menor que 0 porque se choca
    newSquare > boardSize * boardSize || //si se va más alla de 99 (el numero total de squares)
    (direction === "ArrowRight" && column == 0) || //si se va más allá de 0 en la derecha (el borde sería 0)
    (direction == "ArrowLeft" && column == 9) || //si se va más alla de 9 en la izquierda (el borde sería 10 por ej)
    boardSquares[row][column] === squareTypes.snakeSquare
  ) {
    //si en esa square está ocupada por sí misma (la serpeiete)
    gameOver(); //si pasan esas condiciones se acaba el juego
  } else {
    snake.push(newSquare);
    if (boardSquares[row][column] === squareTypes.foodSquare) {
      //crece la serpiente si come
      addFood();
    } else {
      const emptySquare = snake.shift(); //scar el primer elemento, el lugar que debe estar vacio cuando la serpiente se mueve
      drawSquare(emptySquare, "emptySquare");
    }
    drawSnake();
  }
};

const addFood = () => {
  score++; //subir el puntaje
  updateScore(); //cambiar el puntaje
  createRandomFood();
};

const gameOver = () => {
  gameOverSign.style.display = "block"; //muestra el aviso de gameover
  clearInterval(moveInterval); //frenamos el invervalo para que se deje de mover
  startButton.disabled = false; //para que pueda tocar start otra vez
};

createRandomFood = () => {
  randomEmptySquare =
    emptySquares[Math.floor(Math.random() * emptySquares.length)]; //para poner en un lugar random la comida
  drawSquare(randomEmptySquare, "foodSquare"); //usar la función drawSquare y le pasamos que es un lugar de comida
};

const updateScore = () => {
  scoreBoard.innerText = score;
};

const createBoard = () => {
  boardSquares.forEach((row, rowIndex) => {
    //se itera por cada fila y a la vez se itera por la fila cada columna
    row.forEach((column, columnIndex) => {
      const squareValue = `${rowIndex}${columnIndex}`; //crear un valor para cada cuadrado 0,0 0,1
      const squareElement = document.createElement("div"); //crear un elemento div
      squareElement.setAttribute("class", "square emptySquare"); //al elemento se le asigna una clase = emptySquare
      squareElement.setAttribute("id", squareValue); //id con su valor para el elemento
      board.appendChild(squareElement); //agregarle cada que se cree un elemento un elemento al board (tablero)
      emptySquares.push(squareValue); //hacer un push del valor del square (tamaño)
    });
  });
};

//configurar el juego cuando se le de a start
const setGame = () => {
  snake = ["00", "01", "02", "03"]; //lugares del array que ocupa la serpiente
  score = snake.length; //toma el valor de la extensión de la serpiente conforme a que vaya comiendo
  direction = "ArrowRight"; //que empiece para la derecha
  //se crea el tablero (estructura de datos que van en el array)
  boardSquares = Array.from(Array(boardSize), () =>
    new Array(boardSize).fill(squareTypes.emptySquare)
  ); //se crea un array del tamaño
  //del tablero(boardSize)(del tamaño de los elem o sea 10)
  //y cada uno de esos elem se convierten en otro array(new Array) tambien de 10 elementos y se rellena con lugares vacios (emptySquare)
  console.log(boardSquares);
  board.innerHTML = "";
  emptySquares = [];
  createBoard();
};

const startGame = () => {
  setGame();
  gameOverSign.style.display = "none"; //ocultar el gameOver
  startButton.disabled = true; // bloquear el start
  drawSnake();
  updateScore();
  createRandomFood();
  document.addEventListener("keydown", directionEvent); //agregar los event listeners al teclado del usuario
  moveInterval = setInterval(() => moveSnake(), gameSpeed); //cada x segundos se va a llamar a la funcion que mueve a la serpiente
};

startButton.addEventListener("click", startGame);
