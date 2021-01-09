import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const SIZE = 20;

function Square(props) {
    return (
        <button
            className="square"
            onClick={() => props.onClick()}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        let boardRow = [], board = [];
        for(let i = 0; i < SIZE; i++){
            for(let j = 0; j < SIZE; j++){
                boardRow.push(this.renderSquare(i*SIZE + j));
            }
            board.push(<div className="board-row">{boardRow}</div>);
            boardRow = [];
        }
        return (
            <div>
                {board}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(SIZE * SIZE).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true
        };
    }

    handleClick(i) {
        const history = this.state.history;
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares, SIZE) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares, SIZE);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });
        let status;
        if (winner) {
            status = 'THE WINNER IS: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <div className="game-status">{status}</div>
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}/>
                </div>
                <div className="game-info">
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);

function calculateWinner(squares, size) {
    // check rows
    for (let i = 0; i < size; i++) {
        for (let j = 2; j < size - 2; j++) {
            let index = i * SIZE + j;
            if (squares[index] && squares[index] === squares[index - 1] && squares[index] === squares[index - 2]
                && squares[index] === squares[index + 1] && squares[index] === squares[index + 2]) {
                return squares[index];
            }
        }
    }

    //check columns
    for (let j = 0; j < size; j++) {
        for (let i = 2; i < size - 2; i++) {
            let index = i * SIZE + j;
            if (squares[index] && squares[index] === squares[index - SIZE] && squares[index] === squares[index - 2*SIZE]
                && squares[index] === squares[index + SIZE] && squares[index] === squares[index + 2*SIZE]) {
                return squares[index];
            }
        }
    }

    //check cross lines?
    for (let i = 2; i < size - 2; i++) {
        for (let j = 2; j < size - 2; j++) {
            let index = i * SIZE + j;
            if (squares[index] && squares[index] === squares[index - SIZE - 1] && squares[index] === squares[index - 2*SIZE - 2]
                && squares[index] === squares[index + SIZE + 1] && squares[index] === squares[index + 2*SIZE + 2]) {
                return squares[index];
            }
        }
    }

    for (let i = 2; i < size - 2; i++) {
        for (let j = size - 2; j > 2; j--) {
            let index = i * SIZE + j;
            if (squares[index] && squares[index] === squares[index - SIZE + 1] && squares[index] === squares[index - 2*SIZE + 2]
                && squares[index] === squares[index + SIZE - 1] && squares[index] === squares[index + 2*SIZE - 2]) {
                return squares[index];
            }
        }
    }
    return null;

}


/*   const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }

    // check rows
    for(let i = 0; i < size; i++){
        for(let j = 2; j < size -2; j++){
            if(squares[i][j] && squares[i][j] === squares[i][j-1] && squares[i][j] === squares[i][j-2]
                && squares[i][j] === squares[i][j+1] && squares[i][j] === squares[i][j+2]){
                return squares[i][j];
            }
        }
    }

    //check columns
    for(let j = 0; j < size; j++){
        for(let i = 2; i < size -2; i++){
            if(squares[i][j] && squares[i][j] === squares[i-1][j] && squares[i][j] === squares[i-2][j]
                && squares[i][j] === squares[i+1][j] && squares[i][j] === squares[i+2][j]){
                return squares[i][j];
            }
        }
    }

    //check cross lines?
    for(let i = 2; i < size -2; i++){
        for(let j = 2; j < size -2; j++){
            if(squares[i][j] && squares[i][j] === squares[i-1][j-1] && squares[i][j] === squares[i-2][j-2]
                && squares[i][j] === squares[i+1][j+1] && squares[i][j] === squares[i+2][j+2]){
                return squares[i][j];
            }
        }
    }

    for(let i = 2; i < size -2; i++){
        for(let j = size -2; j > 2; j--){
            if(squares[i][j] && squares[i][j] === squares[i-1][j+1] && squares[i][j] === squares[i-2][j+2]
                && squares[i][j] === squares[i+1][j-1] && squares[i][j] === squares[i+2][j-2]){
                return squares[i][j];
            }
        }
    }

 */


