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
            return squares[a];
        }
    }
    return null;
}
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />;
    }

    render() {
        return (
            <div>
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
            </div>
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
                rowCol: ''
            }],
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
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        const row = Math.floor(i / 3).toString();
        const col = i % 3;
        this.setState({
            stepNumber: history.length,
            history: history.concat([{
                squares: squares,
                player: squares[i],
                rowCol: `${row}, ${col}`,
                step: history.length
            }]),
            xIsNext: !this.state.xIsNext,
        });
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';

            let history =
                <li key={move} className={step.step == this.state.stepNumber ? 'font-weight-bold' : ''}>
                    <div className="row mb-1">
                        <div className='col-md-4'>
                            <span>{step.player ? `'${step.player}' Moves to (${step.rowCol})` : `Game Start`} </span>
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
            status = 'Winner: ' + winner;
        } else {
            status = 'Current player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="container m-5">
                <div className="row">
                    <div className={winner ? 'd-none' : 'col-md-2'}>
                        <div className="game-board">
                            <Board
                                squares={current.squares}
                                onClick={(i) => this.handleClick(i)} />
                        </div>
                    </div>
                    {/*To Do */}
                    <div className={winner ? 'col-md-2': 'd-none'}>
                        <div className="game-board">
                            <Board
                                squares={current.squares}
                                onClick={(i) => this.handleClick(i)} />
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
