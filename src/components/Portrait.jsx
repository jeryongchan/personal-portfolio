import React from "react";
import { fabric } from "fabric";
import { hexColors } from "./const"

const Portrait = (props) => {
    const fabricRef = React.useRef(null);
    const canvasRef = React.useRef(null);
    const { setLoaded, setPortraitHovered, setShowWigglingText } = props

    React.useEffect(() => {
        const canvasWidth = 500;
        const canvasHeight = 500;
        const maxRow = 40;
        const maxCol = 40;
        const flipDuration = 250;
        const interval = 25;
        const startWaveRadius = 100;
        const getRow = cellIndex => { return Math.floor(cellIndex / maxRow); }
        const getCol = cellIndex => { return cellIndex % maxCol; }
        const getTop = cellIndex => { return (0.5 + getRow(cellIndex)) * canvasHeight / maxRow; }
        const getLeft = cellIndex => { return (0.5 + getCol(cellIndex)) * canvasWidth / maxCol; }
        const getCellIndex = (x, y) => { return Math.floor(x / canvasWidth * maxCol) + Math.floor(y / canvasHeight * maxRow) * maxCol }
        const getWaveCenter = (cellIndex) => { return { x: getLeft(cellIndex), y: getTop(cellIndex) } }
        const isInWave = (cellIndex, waveRadius, waveCenter) => {
            return waveRadius >= Math.sqrt((getLeft(cellIndex) - waveCenter.x) ** 2 + (getTop(cellIndex) - waveCenter.y) ** 2);
        }

        const setIntervalX = (callback, delay, repetitions) => {
            var x = 0;
            var intervalID = window.setInterval(function () {

                callback();

                if (++x === repetitions) {
                    window.clearInterval(intervalID);
                }
            }, delay);
            return intervalID
        }

        const initFabric = () => {
            fabricRef.current = new fabric.Canvas(canvasRef.current, {
                width: canvasWidth,
                height: canvasHeight,
                selection: false,
                backgroundColor: "#141414",
                // renderOnAddRemove: false,
            });
        };

        const disposeFabric = () => {
            fabricRef.current.dispose();
        };

        const log = (obj) => {
            return JSON.parse(JSON.stringify(obj))
        }

        const test = async () => {
            var canvas = fabricRef.current;
            var pastFocusedCell = []
            var currCellIndex;
            var mousePosition;
            var mouseMoveCanChangeState = true;
            var imageScale;
            var cells = [];
            var cellIndexToFlip = [];
            var flippedCells = []
            var stateIsImageOnEnter = false;
            var firstTimeEnter = true;
            var intervalIDs = [];
            var nextCanvasChangeAllowed = true;
            var imgs = []

            await loadImage()
                .then((src) => {
                    if (!canvas.lowerCanvasEl) { return }
                    let imageLoadpromises = src.map(imgFromSRC);
                    Promise.all(imageLoadpromises)
                        .then(function (images) {
                            images.forEach(img => {
                                canvas.add(img);
                                imgs.push(img)
                            });
                            const dots = generateDots();
                            dots.forEach((dot, i) => {
                                cells.push({
                                    isFlipping: false,
                                    isImage: false,
                                    dot: {
                                        dot: dot,
                                        startTime: null,
                                        progress: 0,
                                    },
                                    img: {
                                        img: imgs[i],
                                        startTime: null,
                                        progress: 0,
                                    }
                                })
                            })


                            setLoaded(true);

                            onInitFlip();
                        })
                })

            function onInitFlip() {
                const pastCellIndex = 739
                const stateOnEnter = cells[pastCellIndex].isImage
                var x = setIntervalX(
                    function () {
                        if (cells[pastCellIndex].waveRadius) {
                            cells[pastCellIndex].waveRadius += canvasWidth / maxCol;
                            const waveCenter = getWaveCenter(pastCellIndex);
                            for (let i = 0; i < cells.length; i++) {
                                if (!cells[i].isFlipping && !flippedCells.includes(i)) {
                                    if (cells[i].isImage === stateOnEnter) {
                                        if (isInWave(i, cells[pastCellIndex].waveRadius, waveCenter)) {
                                            cells[i].waveCenter = waveCenter;
                                            cells[i].img.progress = 0;
                                            cells[i].dot.progress = 0;
                                            cells[i].isFlipping = true;
                                            flippedCells.push(i)
                                        }
                                    } else {
                                        if (isInWave(i, cells[pastCellIndex].waveRadius, waveCenter)) {
                                            cells[i].waveCenter = waveCenter;
                                            cells[i].img.progress = 0;
                                            cells[i].dot.progress = 0;
                                            cells[i].isFlipping = true;
                                            flippedCells.push(i)
                                        }
                                    }
                                }
                            }
                        } else {
                            cells[pastCellIndex].waveRadius = startWaveRadius;
                        }
                        if (flippedCells.length === maxRow * maxCol) {
                            nextCanvasChangeAllowed = false
                            mouseMoveCanChangeState = true;
                            pastFocusedCell.forEach(i => {
                                cells[i].waveRadius = null
                            })
                            intervalIDs.forEach(x => clearInterval(x))
                            stateIsImageOnEnter = !stateIsImageOnEnter
                            flippedCells = []
                            setTimeout(function () {
                                cells.forEach(cell => { if (cell.waveCenter) { cell.waveCenter = null } })
                                nextCanvasChangeAllowed = true
                                setShowWigglingText(true)
                            }, flipDuration + 200)
                            // setTimeout(() => {
                            //     setShowWigglingText(true);
                            // }, 1000)
                        }
                        requestAnimationFrame(animate)


                    }, interval, maxCol * 2
                )
                intervalIDs.push(x)

            }


            canvas.on('mouse:over', function (e) {
                setPortraitHovered(true);
                // console.log("mouseOverPre", "nextCanvasChangeAllowed",nextCanvasChangeAllowed,"mouseMoveCanChangeState", mouseMoveCanChangeState, "firstTime", firstTimeEnter)
                if (!nextCanvasChangeAllowed) {
                    return
                }
                if (!mouseMoveCanChangeState) {
                    return
                }
                if (firstTimeEnter && (flippedCells.length < maxCol * maxRow && flippedCells.length > 0)) {
                    return
                }
                mousePosition = canvas.getPointer(e.e)
                currCellIndex = getCellIndex(mousePosition.x, mousePosition.y)
                const currWaveCenter = getWaveCenter(currCellIndex)
                // console.log(log(stateIsImageOnEnter), log(cells[currCellIndex].isImage))
                if ((stateIsImageOnEnter && cells[currCellIndex].isImage) || (!stateIsImageOnEnter && !cells[currCellIndex].isImage)) {
                    pastFocusedCell.push(currCellIndex)
                    const pastCellIndex = currCellIndex;
                    const stateOnEnter = cells[pastCellIndex].isImage
                    var x = setIntervalX(
                        function () {
                            var anyCellInCircleFlipping = false
                            if (cells[pastCellIndex].waveRadius) {
                                cells[pastCellIndex].waveRadius += canvasWidth / maxCol;
                                const waveCenter = getWaveCenter(pastCellIndex);
                                for (let i = 0; i < cells.length; i++) {
                                    if (!cells[i].isFlipping && !flippedCells.includes(i)) {
                                        if (cells[i].isImage === stateOnEnter) {
                                            if (isInWave(i, cells[pastCellIndex].waveRadius, waveCenter)) {
                                                cells[i].waveCenter = waveCenter;
                                                cells[i].img.progress = 0;
                                                cells[i].dot.progress = 0;
                                                cells[i].isFlipping = true;
                                                anyCellInCircleFlipping = true;
                                                flippedCells.push(i)
                                            }
                                        } else {
                                            if (isInWave(i, cells[pastCellIndex].waveRadius, waveCenter)) {
                                                cells[i].waveCenter = waveCenter;
                                                cells[i].img.progress = 0;
                                                cells[i].dot.progress = 0;
                                                cells[i].isFlipping = true;
                                                anyCellInCircleFlipping = true;
                                                flippedCells.push(i)
                                            }
                                        }
                                    }
                                }
                            } else {
                                cells[pastCellIndex].waveRadius = startWaveRadius;
                            }
                            if (anyCellInCircleFlipping) {
                                if (flippedCells.length === maxRow * maxCol) {
                                    nextCanvasChangeAllowed = false
                                    mouseMoveCanChangeState = true;
                                    pastFocusedCell.forEach(i => {
                                        cells[i].waveRadius = null
                                    })
                                    cells.forEach(cell => { if (cell.waveCenter) { cell.waveCenter = null } })
                                    intervalIDs.forEach(x => clearInterval(x))
                                    stateIsImageOnEnter = !stateIsImageOnEnter
                                    flippedCells = []
                                    setTimeout(function () {
                                        nextCanvasChangeAllowed = true
                                    }, 100)
                                }
                            }
                        }, interval, maxCol * 1.5
                    )
                }
                intervalIDs.push(x)
                cells.forEach((cell, i) => {
                    if (!cell.isFlipping && !flippedCells.includes(i)) {
                        if (isInWave(i, startWaveRadius, currWaveCenter)) {
                            cellIndexToFlip.push(i);
                            if (stateIsImageOnEnter && cell.isImage) { // animate imgs to dots
                                cell.img.progress = 0;
                                cell.dot.progress = 0;
                                cell.isFlipping = true;
                                flippedCells.push(i)
                            } else if (!stateIsImageOnEnter && !cell.isImage) { // animate dots to imgs
                                cell.img.progress = 0;
                                cell.dot.progress = 0;
                                cell.isFlipping = true;
                                flippedCells.push(i)
                            }
                        }
                        if (flippedCells.length === maxRow * maxCol) {
                            nextCanvasChangeAllowed = false
                            mouseMoveCanChangeState = true;
                            pastFocusedCell.forEach(i => {
                                cells[i].waveRadius = null
                            })
                            cells.forEach(cell => { if (cell.waveCenter) { cell.waveCenter = null } })
                            intervalIDs.forEach(x => clearInterval(x))
                            stateIsImageOnEnter = !stateIsImageOnEnter
                            flippedCells = []
                            setTimeout(function () {
                                nextCanvasChangeAllowed = true
                            }, 100)
                        }
                    }
                })
                firstTimeEnter = false;
                requestAnimationFrame(animate);
            });

            canvas.on('mouse:out', function (e) {
                if (e.e.type === "mouseout") {
                    firstTimeEnter = true;
                    if (flippedCells.length > 0 && flippedCells.length < maxCol * maxRow) {
                        mouseMoveCanChangeState = false;
                    }
                    currCellIndex = null;
                }
            });

            function getOptionFunction(i) {
                var angleRefPoint;
                if (cells[i].waveCenter) {
                    angleRefPoint = cells[i].waveCenter;
                } else {
                    angleRefPoint = mousePosition
                }
                var angle = Math.atan((angleRefPoint.x - getLeft(i)) / (getTop(i) - angleRefPoint.y)) * 180 / Math.PI - 90;
                if (!angle) {
                    angle = 0
                }
                var configs;
                var direction = Math.round(angle / -22.5) % 8;
                switch (direction) {
                    case 0:
                        configs = cells[i].isImage ? [1, 1, 0, 0, 0, 1, 0, 0] : [0, 1, 0, 0, 1, 1, 0, 0];
                        break;
                    case 2:
                        configs = cells[i].isImage ? [1, 1, 0, 0, 0.5, 0.5, 0.5, 0.5] : [0.5, 0.5, 0.5, 0.5, 1, 1, 0, 0];
                        break;
                    case 4:
                        configs = cells[i].isImage ? [1, 1, 0, 0, 1, 0, 0, 0] : [1, 0, 0, 0, 1, 1, 0, 0];
                        break;
                    case 6:
                        configs = cells[i].isImage ? [1, 1, 0, 0, 0.5, 0.5, -0.5, -0.5] : [0.5, 0.5, -0.5, -0.5, 1, 1, 0, 0];
                        break;
                    case 1:
                        configs = cells[i].isImage ? [1, 1, 0, 0, 0.27, 0.65, 0.27, 0.65] : [0.27, 0.65, 0.27, 0.65, 1, 1, 0, 0];
                        break;
                    case 3:
                        configs = cells[i].isImage ? [1, 1, 0, 0, 0.65, 0.27, 0.65, 0.27] : [0.65, 0.27, 0.65, 0.27, 1, 1, 0, 0];
                        break;
                    case 5:
                        configs = cells[i].isImage ? [1, 1, 0, 0, 0.65, -0.27, 0.65, -0.27] : [0.65, -0.27, 0.65, -0.27, 1, 1, 0, 0];
                        break;
                    case 7:
                        configs = cells[i].isImage ? [1, 1, 0, 0, -0.27, 0.65, -0.27, 0.65] : [-0.27, 0.65, -0.27, 0.65, 1, 1, 0, 0];
                        break;
                }

                var startScaleX = configs[0],
                    startScaleY = configs[1],
                    startSkewX = configs[2],
                    startSkewY = configs[3],
                    endScaleX = configs[4],
                    endScaleY = configs[5],
                    endSkewX = configs[6],
                    endSkewY = configs[7]

                return function (progress) {
                    const mT =
                        [
                            imageScale * (startScaleX + progress * (endScaleX - startScaleX)),
                            imageScale * (startSkewY + progress * (endSkewY - startSkewY)),
                            imageScale * (startSkewX + progress * (endSkewX - startSkewX)),
                            imageScale * (startScaleY + progress * (endScaleY - startScaleY)),
                            0, 0
                        ]
                    if (direction === 0 || direction === 4) {
                        return {
                            scaleX: mT[0],
                            scaleY: mT[3],
                        };
                    } else {
                        var x = fabric.util.qrDecompose(mT)
                        return x;
                    }
                };
            }

            function animate(timestamp) {
                var anyCellFlipping = false;
                // console.log("animate")
                for (var i = 0; i < maxRow * maxCol; i++) {
                    if (cells[i].isFlipping) {
                        anyCellFlipping = true;
                        if (cells[i].isImage) { // image to dots
                            if (cells[i].img.progress < 1) {
                                if (cells[i].img.progress === 0) {
                                    cells[i].img.startTime = timestamp - 10;
                                    cells[i].img.optFunc = getOptionFunction(i);
                                }
                                cells[i].img.progress = Math.min(1, (timestamp - cells[i].img.startTime) / flipDuration);
                                cells[i].img.img.set(cells[i].img.optFunc(cells[i].img.progress));
                            }
                            else {
                                if (cells[i].dot.progress === 0) {
                                    var angleRefPoint;
                                    if (cells[i].waveCenter) {
                                        angleRefPoint = cells[i].waveCenter;
                                    } else {
                                        angleRefPoint = mousePosition
                                    }
                                    var angle = Math.atan((angleRefPoint.x - getLeft(i)) / (getTop(i) - angleRefPoint.y)) * 180 / Math.PI - 90;
                                    if (!angle) {
                                        angle = 0
                                    }
                                    cells[i].dot.dot.set({ angle: angle })
                                    cells[i].dot.startTime = timestamp - 10;
                                    cells[i].img.img.set({ angle: 0, scaleX: 0, scaleY: 0, skewX: 0, skewY: 0, });
                                }
                                cells[i].dot.progress = Math.min(1, (timestamp - cells[i].dot.startTime) / flipDuration);
                                cells[i].dot.dot.set({ scaleX: cells[i].dot.progress })
                                if (cells[i].dot.progress === 1) {
                                    cells[i].isFlipping = false;
                                    cells[i].isImage = false;
                                }
                            }
                        }
                        else { // dots to images
                            if (cells[i].dot.progress < 1) {
                                if (cells[i].dot.progress === 0) {
                                    cells[i].dot.startTime = timestamp - 10;
                                    var angleRefPoint;
                                    if (cells[i].waveCenter) {
                                        angleRefPoint = cells[i].waveCenter;
                                    } else {
                                        angleRefPoint = mousePosition
                                    }
                                    var angle = Math.atan((angleRefPoint.x - getLeft(i)) / (getTop(i) - angleRefPoint.y)) * 180 / Math.PI - 90;
                                    if (!angle) {
                                        angle = 0
                                    }
                                    cells[i].dot.dot.set({ angle: angle })
                                }
                                cells[i].dot.progress = Math.min(1, (timestamp - cells[i].dot.startTime) / flipDuration);
                                cells[i].dot.dot.set({ scaleX: 1 - cells[i].dot.progress });
                            }
                            else {
                                if (cells[i].img.progress === 0) {
                                    cells[i].img.startTime = timestamp - 10;
                                    cells[i].img.optFunc = getOptionFunction(i);
                                }
                                cells[i].img.progress = Math.min(1, (timestamp - cells[i].img.startTime) / flipDuration);
                                cells[i].img.img.set(cells[i].img.optFunc(cells[i].img.progress));
                                if (cells[i].img.progress === 1) {
                                    cells[i].isFlipping = false;
                                    cells[i].isImage = true;
                                    cells[i].img.img.set({ angle: 0, scaleX: imageScale, scaleY: imageScale, skewX: 0, skewY: 0, });
                                }
                            }
                        }
                    }
                }
                if (anyCellFlipping) {
                    requestAnimationFrame(animate);
                    canvas.requestRenderAll();
                }
            }

            function generateDots() {
                var dots = [];
                for (var i = 0; i < maxRow * maxCol; i++) {
                    var dot = new fabric.Circle({
                        left: getLeft(i),
                        top: getTop(i),
                        originX: "center",
                        originY: "center",
                        scaleX: 1,
                        radius: canvasHeight / maxRow / 2,
                        fill: hexColors[i],
                        objectCaching: false,
                        selectable: false
                    });
                    canvas.add(dot);
                    dots.push(dot)
                };
                return dots
            }

            function imgFromSRC(url, index) {
                return new Promise(function (resolve, reject) {
                    var tmpImg = fabric.util.createImage();
                    tmpImg.src = url;
                    tmpImg.onload = function () {
                        const img = new fabric.Image(tmpImg, {
                            left: getLeft(index),
                            top: getTop(index),
                            originX: "center",
                            originY: "center",
                            selectable: false,
                            scaleX: 0,
                            scaleY: imageScale,
                            objectCaching: true,

                        });
                        resolve(img)
                    }
                    tmpImg.onerror = reject
                });
            }

            function loadImage() {
                var src = []
                return new Promise(function (resolve, reject) {
                    fabric.Image.fromURL("/assets/jeryong.jpg", function (rawImg) {
                        imageScale = canvasWidth / rawImg.width;
                        const tileWidth = rawImg.width / maxCol;
                        const tileHeight = rawImg.height / maxRow;
                        var tmpCanvasEl = fabric.util.createCanvasElement();
                        tmpCanvasEl.width = tileWidth;
                        tmpCanvasEl.height = tileHeight;
                        var tmpCtx = tmpCanvasEl.getContext('2d');
                        for (var i = 0; i < maxRow * maxCol; i++) {
                            tmpCtx.clearRect(0, 0, tmpCanvasEl.width, tmpCanvasEl.height);
                            tmpCtx.drawImage(rawImg._element, -getCol(i) * tileWidth, -getRow(i) * tileHeight);
                            src.push(tmpCanvasEl.toDataURL('image/png'));
                        }
                        resolve(src);
                    });
                })
            }
        }

        initFabric();
        test();

        return () => {
            disposeFabric();
        };
    }, []);

    return <canvas ref={canvasRef} />;
};

export default Portrait;