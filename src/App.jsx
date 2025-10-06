import { useState } from "react";

import "./App.css";

function Square({ value, onSquareClick, isWinningSquare }) {
    // Task 4: When someone wins, highlight the three squares that caused the win (and when no one wins, display a message about the result being a draw): 1.8 points.
    return (
        <button className={`square ${isWinningSquare ? "winning" : ""}`} onClick={onSquareClick}>
            {value}
        </button>
    );
}

function Board({ xIsNext, squares, onPlay }) {
    const [winner, winnerIndexes] = calculateWinner(squares);

    function handleClick(i) {
        if (winner || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = "X";
        } else {
            nextSquares[i] = "O";
        }
        onPlay(nextSquares, i);
    }

    let status;
    if (winner && winner !== "Draw") {
        status = "Winner: " + winner;
    } else if (winner && winner === "Draw") {
        // Task 4: When someone wins, highlight the three squares that caused the win (and when no one wins, display a message about the result being a draw): 1.8 points.
        status = "It's a draw!";
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    // Task 2: Rewrite the Board to use two loops to make the squares instead of hardcoding them: 1.8 points.
    const renderBoard = () => {
        return Array(3)
            .fill(null)
            .map((_, row) => (
                <div className="board-row" key={row}>
                    {Array(3)
                        .fill(null)
                        .map((_, col) => (
                            <Square
                                key={col}
                                value={squares[row * 3 + col]}
                                onSquareClick={() => handleClick(row * 3 + col)}
                                isWinningSquare={
                                    winnerIndexes && winnerIndexes.includes(row * 3 + col)
                                }
                            />
                        ))}
                </div>
            ));
    };

    return (
        <>
            <div className="status">{status}</div>
            {renderBoard()}
        </>
    );
}

export default function Game() {
    const [history, setHistory] = useState([
        {
            squares: Array(9).fill(null),
            moveIndex: {
                row: null,
                col: null,
            },
        },
    ]);
    const [currentMove, setCurrentMove] = useState(0);
    const [isAscending, setIsAscending] = useState(true);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove]?.squares;

    function handlePlay(nextSquares, moveIndex) {
        const nextHistory = [
            ...history.slice(0, currentMove + 1),
            {
                squares: nextSquares,
                moveIndex: {
                    row: Math.floor(moveIndex / 3) + 1,
                    col: (moveIndex % 3) + 1,
                },
            },
        ];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((squares, move) => {
        const { row, col } = squares.moveIndex;
        let description;
        if (move > 0 && move !== currentMove) {
            // Task 5: Display the location for each move in the format (row, col) in the move history list: 1.8 points.
            description = `Go to move #${move} (${row}, ${col})`;
        } else if (move === currentMove && move > 0) {
            // Task 1: For the current move only, show “You are at move #…” instead of a button: 1.8 points.
            description = `You are at move #${move} (${row}, ${col})`;
        } else {
            description = "Go to game start";
        }

        return (
            <li key={move}>
                {move === currentMove && move > 0 ? (
                    <span>{description}</span>
                ) : (
                    <button onClick={() => jumpTo(move)}>{description}</button>
                )}
            </li>
        );
    });

    const sortedMoves = isAscending ? moves : [moves[0], ...moves.slice(1).reverse()];

    // Task 1: For the current move only, show “You are at move #…” instead of a button: 1.8 points.
    const currentMoveInfo =
        currentMove > 0
            ? `You are at move #${currentMove} (${history[currentMove].moveIndex.row}, ${history[currentMove].moveIndex.col})`
            : "You are at game start";

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                {/* Task 3: Add a toggle button that lets you sort the moves in either ascending or descending order: 1.8 points. */}
                <button onClick={() => setIsAscending(!isAscending)}>
                    {isAscending ? "Sort Descending" : "Sort Ascending"}
                </button>

                <div className="history-container">
                    <ol>{sortedMoves}</ol>
                    <div className="current-move-sticky">{currentMoveInfo}</div>
                </div>
            </div>
        </div>
    );
}

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
            const winnerIndexes = [a, b, c];
            return [squares[a], winnerIndexes];
        }
    }

    // Task 4: When someone wins, highlight the three squares that caused the win (and when no one wins, display a message about the result being a draw): 1.8 points.
    if (squares.every((square) => square !== null)) {
        return ["Draw", null];
    }

    return [null, null];
}
