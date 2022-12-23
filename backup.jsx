import "../App.css"
import { useState } from "react";
import { frameHeight, frameWidth, gridRows, gridColumns } from "./const";
import { useEffect } from "react";
import { useRef } from "react";


const getCellId = (row, col) => {
    return "r" + String(row).padStart(2, '0') + "c" + String(col).padStart(2, '0')
}
const clamp = (num) => {
    return Math.min(Math.max(num, 2), 0)
}

const generateCells = () => {
    var cells = [];
    for (let i = 0; i < gridRows; i++) {
        for (let j = 0; j < gridColumns; j++) {
            cells.push({
                row: i,
                col: j,
                frontImg: "front_" + String(i).padStart(2, '0') + "_" + String(j).padStart(2, '0') + ".jpg",
                backImg: "back_" + String(i).padStart(2, '0') + "_" + String(j).padStart(2, '0') + ".jpg",
                id: getCellId(i, j)
            })
        }
    }
    return cells;
}

const generateCellStates = (cells) => {
    var cellStates = {};
    cells.map(cell => {
        cellStates[cell.id] = false
    })
    return cellStates;
}

const computeDirection = (v, v0) => {
    // const direction = { x: v[0] - v0[0], y: v[1] - v0[1] }
    return
    // return direction
}

const Portrait = () => {
    const wrapperRef = useRef(null);
    const cells = generateCells();
    const cellStatesInit = generateCellStates(cells);
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const [cellStates, setCellStates] = useState(cellStatesInit);

    const handleCellStates = (cell) => {
        const direction = computeDirection(coords)
        // console.log(direction)
        var newCellStates = [];
        newCellStates.push(cell.id)
        newCellStates.push(getCellId(clamp(cell.row - 1), clamp(cell.col - 1)))
        newCellStates.forEach(id => {
            setCellStates(state => ({ ...state, [id]: !(state[id]) }))
        })
    }

    const handleMouseMove = event => {
        var bounding = wrapperRef.current.getBoundingClientRect();
        var x = event.clientX - bounding.left
        var y = event.clientY - bounding.top
        var vectorize = Math.sqrt(event.movementX ** 2 + event.movementY ** 2);
        var vx = vectorize ? event.movementX / vectorize : 0;
        var vy = vectorize ? event.movementY / vectorize : 0
        console.log(vx, vy)
        
    };


    return (
        <div className="wrapper" onMouseMove={handleMouseMove} ref={wrapperRef}>
            <div className="grid">
                {cells.map(cell => (
                    <div className="outer"
                        onMouseEnter={() => handleCellStates(cell)}
                    >
                        <div className={"inner " + `${cellStates[cell.id] ? "flip" : ""}`}>
                            <div className="back">
                                {/* b */}
                                <img src={`/assets/${cell.frontImg}`}
                                    width={`${frameWidth}`} height={`${frameHeight}`}
                                    onerror="this.onerror=null; this.remove();" />
                            </div>
                            <div className="front">
                                {/* f */}
                                <img src={`/assets/${cell.backImg}`}
                                    width={`${frameWidth}`} height={`${frameHeight}`}
                                    onerror="this.onerror=null; this.remove();" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

}

export default Portrait;


#css

:root {
    --gridHeight: 1000px;
    --gridWidth: 1000px;
    --gridColumns: 50;
    --gridRows: 50; 
}

.wrapper {
    align-items: center;
    justify-content: center;
    display: flex;
    height: 1000px;
    width: 1000px;
}

.portraitWrapper {
    height: 1000px;
    width: 1000px;
}

.circle {
    background: red;
    border-radius: 50%;
    width: 20px;
    height: 20px;
}

.grid {
    height: 1000px;
    width: 1000px;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
}
/* height: var(--gridHeight);
width: var(--gridWidth); */
.outer {
    flex: 0 0 0.02;
    height: 20px;
    width: 20px;
    perspective: 1000px;

}
/* flex: 0 0 1/var(--gridColumns);
    height: calc(var(--gridHeight)/var(--gridRows));
    width: calc(var(--gridWidth)/var(--gridColumns));
    perspective: 1000px; */
.inner {
    position: relative;
    transition: transform 0.8s;
}

.inner.flip {
    transform: rotateY(180deg);
    transform-style: preserve-3d;

}

.front,
.back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
}

/* .back { #before
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
} */


.front {
    transform: rotateY(0deg);
}

.back {
    transform: rotateY(180deg);
}


import "../App.css"
import { useRef } from "react";
import { cells, cellStatesInit } from "../initialCells";
import actions from "../state/actionCreators"
import { useSelector } from 'react-redux'

const getCellId = (row, col) => {
    return "r" + String(row).padStart(2, '0') + "c" + String(col).padStart(2, '0')
}

const Portrait = () => {
    const cellStates = useSelector(state => state.cellStates)
    const wrapperRef = useRef(null);

    const onMouseMove = event => { //set direction
        var bounding = wrapperRef.current.getBoundingClientRect();
        var x = event.clientX - bounding.left
        var y = event.clientY - bounding.top
        var vectorize = Math.sqrt(event.movementX ** 2 + event.movementY ** 2);
        var vx = vectorize ? event.movementX / vectorize : 0;
        var vy = vectorize ? event.movementY / vectorize : 0;
        if (vx === 0 && vy === 0) return;
        const waveFrontRadius = 75
        const waveFrontCenter = { x: x - waveFrontRadius * 10 * vx, y: y - waveFrontRadius * 10 * vy }
        // console.log("x", x, "y", y)
        // console.log("vx", vx, "vy", vy)
        // console.log("wx", waveFrontCenter.x, "wy", waveFrontCenter.y)
        const isInWaveFront = (cell) => {
            return waveFrontRadius * 10 > Math.sqrt(((cell.col + 0.5) * 10 - waveFrontCenter.x) ** 2 + ((cell.row + 0.5) * 10 - waveFrontCenter.y) ** 2)
        }
        const stateIsDot = cellStates[getCellId(Math.floor(y / 10), Math.floor(x / 10))] //means its going to flip to pic
        console.log("cellid", getCellId(Math.floor(y / 10), Math.floor(x / 10)))
        console.log("stateIsDot", stateIsDot)
        // const currToggle = 
        var newCellStates = [];
        cells.forEach(cell => {
            if (isInWaveFront(cell)) {
                newCellStates.push(cell.id)
            }
        })
        newCellStates.forEach(id => {
            actions.setCellStates(id);
        })
        const stateIsDot2 = cellStates[getCellId(Math.floor(y / 10), Math.floor(x / 10))] //means its going to flip to pic
        console.log("stateIsDot2", stateIsDot2)
    };

    return (
        <div className="wrapper" onMouseMove={onMouseMove} ref={wrapperRef}>
            <div className="grid">
                {cells.map(cell => (
                    <div className="cellWrapper">
                        {cell.isInCircle && <div className="outer">
                            <div className={"inner" + `${cellStates[cell.id] ? " flip" : ""}`}>
                                <div className="front">
                                </div>
                                <div className="back">
                                    <div className="circle"></div>
                                </div>
                            </div>
                        </div>}
                    </div>
                ))}
            </div>
            <img src="/assets/jeryong.png" />

        </div>
    )

}

export default Portrait;

