import React from 'react';
import './App.css';
import Announcement from './Announcement'; //Thong bao
import ResetButton from './ResetButton';
import Tile from './Tile'; //O
class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      gameBoard: [
        ' ',' ',' ',
        ' ',' ',' ',
        ' ',' ',' '
      ],
      turn:'X',
      winner: null,
      //use for Minimax Algorithm
      maxPlayer: 'X',
      minPlayer: 'O'
    }
    // this.updateBoard = this.updateBoard.bind(this);
    this.resetBoard = this.resetBoard.bind(this);
    this.gameLoop = this.gameLoop.bind(this);
  }
  copyBoard(board){
    return board.slice(0);
  }
  resetBoard(){
    this.setState({
      gameBoard:[
        ' ',' ',' ',
        ' ',' ',' ',
        ' ',' ',' '
      ],
      turn:'X',
      winner: null,
      //use for Minimax Algorithm
      maxPlayer: 'X',
      minPlayer: 'O'
    })
  }
/*   updateBoard(loc, player){
    player === 'X'? player='Human': player='AI';
    if(this.state.gameBoard[loc] === 'O' || this.state.gameBoard[loc] === 'X' || this.state.winner)
      return;
    let currentGameBoard = this.state.gameBoard;
    currentGameBoard.splice(loc, 1, this.state.turn); //Xoa bo phan tu o vi tri loc, thay the bang turn
    this.setState({
      gameBoard: currentGameBoard
    });
    //Cac duong di co the dan den chien thang
    let topRow = this.state.gameBoard[0] + this.state.gameBoard[1] + this.state.gameBoard[2];
    if(topRow.match(/XXX|OOO/)){
      this.setState({winner: player});
      return;
    }
    let MiddleRow = this.state.gameBoard[3] + this.state.gameBoard[4] + this.state.gameBoard[5];
    if(MiddleRow.match(/XXX|OOO/)){
      this.setState({winner: player});
      return;
    }
    let bottomRow = this.state.gameBoard[6] + this.state.gameBoard[7] + this.state.gameBoard[8];
    if(bottomRow.match(/XXX|OOO/)){
      this.setState({winner: player});
      return;
    }
    let leftCol = this.state.gameBoard[0] + this.state.gameBoard[3] + this.state.gameBoard[6];
    if(leftCol.match(/XXX|OOO/)){
      this.setState({winner: player});
      return;
    }
    let middleCol = this.state.gameBoard[1] + this.state.gameBoard[4] + this.state.gameBoard[7];
    if(middleCol.match(/XXX|OOO/)){
      this.setState({winner: player});
      return;
    }
    let rightCol = this.state.gameBoard[2] + this.state.gameBoard[5] + this.state.gameBoard[8];
    if(rightCol.match(/XXX|OOO/)){
      this.setState({winner: player});
      return;
    }
    let leftDiag = this.state.gameBoard[0] + this.state.gameBoard[4] + this.state.gameBoard[8];
    if(leftDiag.match(/XXX|OOO/)){
      this.setState({winner: player});
      return;
    }
    let rightDiag = this.state.gameBoard[2] + this.state.gameBoard[4] + this.state.gameBoard[6];
    if(rightDiag.match(/XXX|OOO/)){
      this.setState({winner: player});
      return;
    }
    let tilesCantCheck = this.state.gameBoard.join('').replace(/ /g, '');
    if(tilesCantCheck.length === 9){ //Khong con o nao co the danh duoc
      this.setState({
        winner: 'No one'
      })
    }
    this.setState({
      turn: this.state.turn === 'X'? 'O': 'X'
    });
  } */
  whetherTheMatchIsDraw(board){
    let moves = board.join('').replace(/ /g, '');
    if(moves.length === 9)
      return true;
    return false;
  }
  amIWinner(board, player){
    if(
      (board[0] === player && board[1] === player && board[2] === player) ||
      (board[3] === player && board[4] === player && board[5] === player) ||
      (board[6] === player && board[7] === player && board[8] === player) ||
      (board[0] === player && board[3] === player && board[6] === player) ||
      (board[1] === player && board[4] === player && board[7] === player) ||
      (board[2] === player && board[5] === player && board[8] === player) ||
      (board[0] === player && board[4] === player && board[8] === player) ||
      (board[2] === player && board[4] === player && board[6] === player)
    )
      return true;
    else
      return false;
  }

  validMove(move, player, board){
    let newBoard = this.copyBoard(board);
    if(newBoard[move] === ' '){
      newBoard[move] = player;
      return newBoard;
    }
    else
      return null;
  }

  
  findTileAICanMove(board){
    let bestMoveScore = 100;
    let move = null;
    //Kiem tra tat ca duong di co the cua O khi game con co the tiep tuc choi duoc
    if(this.amIWinner(board, 'X') || this.amIWinner(board, 'O') || this.whetherTheMatchIsDraw(board)){
      return null;
    }
    for(let i = 0; i < board.length; i++){
      let newBoardWithOCanBet = this.validMove(i, this.state.minPlayer, board);
      if(newBoardWithOCanBet){
        let moveScore = this.maxScore(newBoardWithOCanBet);
        if(moveScore < bestMoveScore){
          bestMoveScore = moveScore;
          move = i;
        }
      }
    }
    return move;
  }

  minScore(board){
    if(this.amIWinner(board, 'X'))
      return 1;
    else if(this.amIWinner(board, 'O'))
      return -1;
    else if(this.whetherTheMatchIsDraw(board))
      return 0;
    else{
      let bestMoveValue = 100;
      for(let i = 0; i < board.length; i++){
        let newBoardWithOCanBet = this.validMove(i, this.state.minPlayer, board);
        if(newBoardWithOCanBet){
          let predictedMoveValue = this.maxScore(newBoardWithOCanBet);
          if(predictedMoveValue < bestMoveValue){
            bestMoveValue = predictedMoveValue;
          }
        }
      }
      return bestMoveValue;
    }
  }

  maxScore(board){
    if(this.amIWinner(board, 'X'))
      return 1;
    else if(this.amIWinner(board, 'O'))
      return -1;
    else if(this.whetherTheMatchIsDraw(board))
      return 0;
    else{
      let bestMoveValue = -100;
      for(let i = 0; i < board.length; i++){
        let newBoardWithOCanBet = this.validMove(i, this.state.maxPlayer, board);
        if(newBoardWithOCanBet){
          let predictedMoveValue = this.minScore(newBoardWithOCanBet);
          if(predictedMoveValue > bestMoveValue){
            bestMoveValue = predictedMoveValue;
          }
        }
      }
      return bestMoveValue;
    }
  }

  gameLoop(move){
    if(this.state.gameBoard[move] === 'O' || this.state.gameBoard[move] === 'X' || this.state.winner)
      return;
    let player = this.state.turn;
    let currentGameBoard = this.validMove(move, player, this.state.gameBoard);
    if(this.amIWinner(currentGameBoard, player)){
      this.setState({
        gameBoard: currentGameBoard,
         winner: player
      });
      return;
    }
    if(this.whetherTheMatchIsDraw(currentGameBoard)){
      this.setState({
        gameBoard: currentGameBoard,
         winner: 'No one'
      });
      return;
    }
    player = 'O';
    currentGameBoard = this.validMove(this.findTileAICanMove(currentGameBoard), player, currentGameBoard);
    if(this.amIWinner(currentGameBoard, player)){
      this.setState({
        gameBoard: currentGameBoard,
         winner: player
      });
      return;
    }
    if(this.whetherTheMatchIsDraw(currentGameBoard)){
      this.setState({
        gameBoard: currentGameBoard,
         winner: 'No one'
      });
      return;
    }
    this.setState({
      gameBoard: currentGameBoard
    });
  }

  
  render(){
    return(
      <div className="container">
        <div className="menu">
          <h1>Tic-Tac-Toe</h1>
          <Announcement winner={this.state.winner}/>
          <ResetButton reset={this.resetBoard} />
        </div>
        <div className="grid-container">
          {this.state.gameBoard.map((value, index)=>{
            return(
              <div className='grid-item'>
                <Tile key={index} loc={index} value={value} gameLoop={this.gameLoop} turn={this.state.turn}/>
              </div>
            )
          })}
        </div>
        
      </div>
    )
  }
}

export default App;
