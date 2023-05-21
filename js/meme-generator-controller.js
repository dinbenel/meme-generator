'use strict';

let gCanvas;
let gCtx;
let gStPos;
let gTouchEvs = ['touchmove', 'touchstart', 'touchend'];

//................ ACTIVES FROM DOM, AFTER DOM LOADS ........//
function onInit() {
    gCanvas = document.querySelector('.canvas');
    gCtx = gCanvas.getContext('2d');
    addListeners();
    renderGalery();
}

//.......... DISPLAY IMAGES FROM GLOBAL TO THE DOM ...........// 
function renderGalery() {
    let filterImgs = getFilterImgs();
    let imgs = filterImgs;
    let imgStrHtml = imgs.map(img => {
        return `
        <div onclick="renderMemeEditor(${img.id})" class="card pointer border">
        <div class="img-filter trans"></div>
        <img src="${img.url}" class="radius">
        </div>`;
    }).join('');
    const elGallery = document.querySelector('.gallery');
    elGallery.innerHTML = imgStrHtml;
    const elKeyWords = document.querySelector('.key-words');
    let strHtml = gKeyWords.map(word => {
        return `
        <span class="pointer">${word}... </span>`;
    }).join('');
    elKeyWords.innerHTML = strHtml;
}

function renderMemeEditor(idx) {
    ontoggleGallery();
    setCurImgIdx(idx);
    renderCanvas();
}

//..... DISPLAY TEXT AND SELECTED IMAGE ON CANVAS......//
function renderCanvas() {
    drawImgOnCanvas(gMeme.selectedImgId);
    setTimeout(() => {
        drawTxt();
    }, 20);
}

function onLoadFromTab() {
    console.log(gUserSavedMems);
    console.log(gUserSavedImgs);
    //    renderCanvas();
}

//.........DRAW SELECTED IMAGE ON CANVAS.....//
function drawImgOnCanvas(id) {
    var img = new Image();
    img.src = `./img/${id}.jpg`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
    }
    resizeCanvasContainer();
}

function resizeCanvasContainer() {
    const elContainer = document.querySelector('.canvas-container');
    elContainer.style.width = gCanvas.width + 'px';
    elContainer.style.height = gCanvas.height + 'px';
}

//....DRAW TXT ON CANVAS.......//
function drawTxt() {
    gMeme.lines.forEach(line => {
        gCtx.beginPath();
        gCtx.strokeStyle = `${line.color}`;
        gCtx.font = `${line.size}px ${line.family}`;
        gCtx.textAlign = `${line.txtAlign}`;
        gCtx.fillStyle = `${line.color}`;
        gCtx.fillText(line.txt, line.idx, line.idy);
        gCtx.strokeText(line.txt, line.idx, line.idy);
    })
}

//.... ERASE ALL CANVAS DRAW, TEXT AND IMAGE........//
function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
}


///////.............................DOM EVENTS .......................////////
// ........... SWITCH DISPLAY GALLERY AND DISPLAY EDITOR ...........//
function ontoggleGallery() {
    const elMemeEditor = document.querySelector('.meme-editor');
    // const elUserTab = document.querySelector('.user-save-tab');
    const elMainContent = document.querySelector('.content-container');
    elMainContent.classList.toggle('hide');
    elMemeEditor.classList.toggle('hide');
    // let class = 
    // if(!elUserTab.classList.contains('hide')) 

    resetMeme();
}

function onDownloadMeme(elLink) {
    const data = gCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'my-meme.jpg';
}

//.......... OPEN HAMBURGER MENU DROP DOWN MENU ....//
function onOpenHamburgerMenu() {
    if (window.innerWidth > 675) return;
    const elDropDown = document.querySelector('.drop-down-menu');
    elDropDown.classList.toggle('hide');
    elDropDown.classList.toggle('flex');
    onToggleHamburgerIcon();
    onToggleOvelay();
}

function onToggleHamburgerIcon() {
    const elXSign = document.querySelector('.fa-times');
    const elHamburgerSign = document.querySelector('.fa-bars');
    elXSign.classList.toggle('hide');
    elHamburgerSign.classList.toggle('hide');
}

function onToggleOvelay() {
    const elOverLay = document.querySelector('.overlay-filter');
    elOverLay.classList.toggle('hide');
}

function onSearchKeyWord(inputVal) {
    setFilter(inputVal);
    renderGalery();
}

// ................. EVENTS FROM MEME EDITOR ...........//
function onChangeColor(color) {
    setColor(color);
    renderCanvas();
}

function onAlignTxt(txtAlign) {
    setTxtAlign(txtAlign);
    renderCanvas();
}

function onMoveNxtLine() {
    nextLine();
    (!getCurrLine().txt)
    document.querySelector('input[name="write-meme"]').value = getCurrLine().txt;
}

function onChangeFontFamily() {
    const font = document.querySelector('select[name="fonts"]').value;
    changeFontFamily(font);
    renderCanvas();
}

function onIncreaseFontSize() {
    increaseFontSize();
    renderCanvas();
}

function onDrawTextOnCanvas(txt) {
    const currLine = getCurrLine();
    updateMemeLine(currLine, txt);
    renderCanvas();
}

function onDecreaseFontSize() {
    decreaseFontSize();
    renderCanvas();
}

function onAddLine() {
    addLine();
    renderCanvas();
}

function onRemoveLine() {
    removeLine(gMeme.selectedLineIdx);
    renderCanvas();
}

function onSaveToTab() {
    const data = gCanvas.toDataURL();
    saveUserMeme(gMeme, data);
}

function renderUserTab() {
    const userMeme = getUserSaveMeme();

    if (!userMeme) return;
    const elImg = document.querySelector('.img-container');
    const elUserTab = document.querySelector('.uesr-save-tab');
    elUserTab.classList.toggle('hide');
    let strHtml = userMeme.map(data => {
        return `<img class="meme" src="${data}">`;
    }).join('');
    elImg.innerHTML = strHtml;
}

//................... DRAG AND DROP MEME ..................//
//.......... ADD LISINERS FO TOUCH SCREENS AND MOUSE ............//
function addListeners() {
    gCanvas.addEventListener('mousedown', onDown);
    gCanvas.addEventListener('mousemove', onMove);
    gCanvas.addEventListener('mouseup', onUp);
    gCanvas.addEventListener('touchmove', onMove)
    gCanvas.addEventListener('touchstart', onDown)
    gCanvas.addEventListener('touchend', onUp)
}

addEventListener('touchmove', onMove)
addEventListener('touchstart', onDown)
addEventListener('touchend', onUp)

function onDown(ev) {
    const pos = getEvPos(ev);
    if (!isLineClicked(pos.x, pos.y)) return;
    gMeme.lines[gMeme.selectedLineIdx].isDragging = true;
    gStPos = pos;
    document.body.style.cursor = 'grabbing';
}

function onMove(ev) {
    const pos = getEvPos(ev);
    if (!gMeme.lines[gMeme.selectedLineIdx]) return;
    if (gMeme.lines[gMeme.selectedLineIdx].isDragging) {
        let diffX = pos.x - gStPos.x;
        let diffY = pos.y - gStPos.y;
        gMeme.lines[gMeme.selectedLineIdx].idx += diffX;
        gMeme.lines[gMeme.selectedLineIdx].idy += diffY;
        gStPos = pos;
        renderCanvas()
    }
}

function onUp() {
    gMeme.lines[gMeme.selectedLineIdx].isDragging = false;
    document.body.style.cursor = 'grab';
}

function isLineClicked(xPos, yPos) {
    let linePosx = getCurrLine().idx;
    let linePosy = getCurrLine().idy;
    let txtWidth = gCtx.measureText(getCurrLine().txt).width;
    let lineHeight = (getCurrLine().size * 1.25);
    let distanceX = Math.sqrt((linePosx - xPos) ** 2);
    let distanceY = Math.sqrt((linePosy - yPos) ** 2);
    return (distanceX <= (txtWidth / 2) && distanceY <= lineHeight);
}

function getEvPos(ev) {
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}
