import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function calculateWinner(squares) {
    const lines = [
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
            return {player: squares[a], winningSquares: lines[i]};
        }
    }
    return null;
}

function checkDraw(squares){
    let isDraw = true;
    squares.forEach(square=>{
        if(square === null)
            isDraw = false
    })
    return isDraw;
}
function Square(props) {
    return (
        <button className={props.highlight ? 'square win-square' : 'square'} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square key={i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            highlight = {this.props.winner && this.props.winningSquares.includes(i) ? true : false}
        />;
    }

    render() {
        let boardSquares = [];
        let count = 0
        for (let i = 0; i < 3; i++) {
            boardSquares.push(<div key={'row-'+i} className="board-row"></div>)
            for (let j = 0; j < 3; j++) {
                boardSquares.push(this.renderSquare(count));
                count++;
            }
        }

        return (
            boardSquares
            /*<div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>*/
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                player: '',
                row: '',
                col: '',
                step: 0
            }],
            winningSquares: [],
            stepNumber: 0,
            xIsNext: true
        };
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }
    handleClick(i) {
        const history = this.state.history;
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares)|| squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        const row = Math.floor(i / 3);
        const col = i % 3;
        this.setState({
            stepNumber: history.length,
            history: history.concat([{
                squares: squares,
                player: squares[i],
                row: row, 
                col: col,
                step: history.length
            }]),
            xIsNext: !this.state.xIsNext,
        });
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const draw = checkDraw(current.squares);
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';

            const history =
                <li key={move} className={step.step == this.state.stepNumber ? 'font-weight-bold' : ''}>
                    <div className="row mb-1">
                        <div className='col-md-4'>
                            <span>{step.player ? `'${step.player}' Moves to (${step.row+1}, ${step.col+1})` : `Game Start`} </span>
                        </div>
                        <div className='col-md-4'>
                            <button className="btn btn-info btn-sm" onClick={() => this.jumpTo(move)}>{desc}</button>
                        </div>
                    </div>
                </li>
            return (
                history
            );
        });
        let status;
        if (winner) {
            status = 'Winner: ' + winner['player'];
            this.state.winningSquares = winner.winningSquares;
        } else {
            if(draw)
                status = 'DRAW!'
            else
                status = 'Current player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="container m-5">
                <div className="row">
                    <div className='col-md-2'>
                        <div className="game-board">
                            <Board
                                squares={current.squares}
                                onClick={(i) => this.handleClick(i)}
                                winner = {winner}
                                winningSquares = {this.state.winningSquares} />
                        </div>
                    </div>
                    <div className="col-md-6">

                        <div className="game-info">
                            <div>{status}</div>
                            <ol>{moves}</ol>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
