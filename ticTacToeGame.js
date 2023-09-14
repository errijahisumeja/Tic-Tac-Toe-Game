const cells = document.querySelectorAll('.cell');
const resetBtn = document.querySelector('.reset');
const undoBtn = document.querySelector('.undo');
const currentTurn = document.querySelector('.current-turn');
const player1score = document.querySelector('.score1');
const player2score = document.querySelector('.score2');
const draw = document.querySelector('.draw');
const messageContent = document.querySelector('.content');
const closeMessage = document.querySelector('#close');
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('close');
const multiplayer = document.getElementById('multiplayer-b');
const singleplayer = document.getElementById('singleplayer-b');


//all the winner combinations
const winCombos = [
    [0, 1, 2],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],

]


let score1 = 0;
let score2 = 0
let ties = 0;


let player1 = {
    symbol : '<i class="fa fa-close"></i>',
    played: [],
    score: 0
}

let player2 = {
    symbol : '<i class="fa fa-circle-o"></i>',
    played: [],
    score: 0
}

let emptyCells  = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let turn = true;
let usedCells = [];
//when the variable computer is ture that means it's player vs comuter mode on
let computer = true;
let winner = false;


//clicking on btn multiplayer the comupter variable is false and the player vs player mode is on
multiplayer.addEventListener('click', function() {
    clearBoard();
    computer = false;
    multiplayer.style.color= "red";
    singleplayer.style.color = "white";
});

//clicking on singliplayer btn the computer variable is again true
singleplayer.addEventListener('click', function() {
    clearBoard();
    computer = true;
    singleplayer.style.color= "red";
    multiplayer.style.color = "white";
});

checkTurn(turn);

setInterval(aiEasy, 3000);


//this is the main part for playing. If we don't have the winner yet then it checking if there is i in emptyCells array. The default turn is fo player1 so
//it the turn is true that means it is the turn for player1. Player1 can play if the singleplayer mode is off. 
for (let i = 0; i < cells.length; i++){
    cells[i].addEventListener('click', () =>{
        if (!winner){
            if(isEmpty(i)){
                if (turn == true){
                    if(!computer){
                        addSymbol(player1, i);
                        checkwin(player1);
                    }   
                }else{
                    addSymbol(player2, i);
                    if(computer){
                        emptyCells.splice(emptyCells.indexOf(i), 1)
                    }
                    checkwin(player2);
                }
                checkTurn(turn);
            }
        } 
    });
}


//this is to close the message which inform us about results
closeMessage.addEventListener('click', () =>{
    document.getElementById('overlay').style.display = 'none';
    clearBoard();
})

//btn to reset the game
resetBtn.addEventListener('click', clearBoard);

//I used this array for undo btn
let previousMoves = [];

undoBtn.addEventListener('click', () =>{
    if (!winner && previousMoves.length > 0) {
        
        if(turn){
            player2.played.pop();
        }else{
            player1.played.pop();
        }

        const lastMove = previousMoves.pop();
        cells[lastMove.index].innerHTML = '';
        usedCells.splice(usedCells.indexOf(lastMove.index), 1);
        emptyCells.push(lastMove.index);
        turn = !turn;
        checkTurn(turn);
    }
    
});


function clearBoard(){
    cells.forEach(cell => {
        cell.innerHTML = '';
    });
    usedCells = [];
    player1.played = [];
    player2.played = [];
    emptyCells  = [0, 1, 2, 3, 4, 5, 6, 7, 8]

    winner = false;
    turn = true;
    checkTurn(turn);
}

function checkTurn(turn){
    if(usedCells.length < 9 && !winner){
        if (turn){
            currentTurn.innerHTML = player1.symbol;
        }else{
            currentTurn.innerHTML = player2.symbol;
        } 
    }else{
        currentTurn.innerHTML = '';   
    }
}

function addSymbol(player, i){
    cells[i].innerHTML = player.symbol;
    player.played.push(i);
    usedCells.push(i);
    previousMoves.push({ index: i, player: player });
    if (turn == true){
        turn = false
    }else{
        turn = true
    }
    
    
}


function isEmpty(i){
    if(usedCells.includes(i)){
        return false;
    }
    return true;
}


function showScore(){
    player1score.innerHTML = player1.score;
    player2score.innerHTML = player2.score;
    draw.innerHTML = ties;
}


function checkwin(player){
    if (!winner){
        winCombos.some(item =>{
            if(item.every(i => player.played.includes(i))){
                winner = true;
                player.score++;
                showScore();
                setTimeout(showMessage, 1300, player, winner);
            }
        })
    }

    if (!winner && usedCells.length == 9){
        ties++;
        showMessage();
        showScore();
    }
    
}


//if the winner is true it shows the message about result
function showMessage(player, winner){
    if(winner){ 
        messageContent.innerHTML = player.symbol +  ' is the <h2>Winner</h2>';
    }
    else{
        messageContent.innerHTML ='It is a <h2>Draw</h2>';
    }
    document.getElementById('overlay').style.display = 'flex';
}


//this function is for playe vs computer mode. I used random function to chose in which cell the computer plays. The computer is player1 by default.

function aiEasy(){
    
    if (computer && !winner && turn){
        
        let random  = Math.floor(Math.random() * emptyCells.length);
        addSymbol(player1, emptyCells[random]);
        emptyCells.splice(random, 1);
       
        checkwin(player1);
        checkTurn(turn);
    }
    
}

aiEasy();

