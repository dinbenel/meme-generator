'use strict';

//...KEY TO SAVE IN LOCAL STORAGE...........//
const MEMEKEY = 'meme';
const IMGKEY = 'img';

//.... EHCH MEME LINES THE USER EDITS ........//
let gMeme = {
    selectedImgId: 7,
    selectedLineIdx: 0,
    lines: [{
        txt: 'I Know!!',
        size: 50,
        family: 'Arial',
        align: 'left',
        color: 'white',
        stroke: 'black',
        txtAlign: 'center',
        idx: 200,
        idy: 50,
        isDragging: false
    }, {
        txt: 'you know!!',
        size: 50,
        family: 'Arial',
        align: 'left',
        color: 'white',
        stroke: 'black',
        txtAlign: 'center',
        idx: 200,
        idy: 300,
        isDragging: false
    }]
};

let gFilterBy;
let gKeyWords = [
    'kiss', 'trump', 'president', 'dutch', 'paint', 'cute', 'puppies', 'cat', 'dogs', 'love', 'star', 'sunshine', 'famous', 'professor', 'actor', 'happy', 'baby', 'funny', 'obama', 'dog', 'genius', 'yes!!', 'guys', 'got', 'stark'
];

const gUserSavedMems = [];
const gUserSavedImgs = [];

//............IMAGES ARRAY GLOBAL ..........//
let gImgs = [{
    id: 1,
    url: './img/1.jpg',
    keywords: ['trump', 'president']
},
{
    id: 2,
    url: './img/2.jpg',
    keywords: ['dogs', 'puppies']
},
{
    id: 3,
    url: './img/3.jpg',
    keywords: ['dog', 'baby']
},
{
    id: 4,
    url: './img/4.jpg',
    keywords: ['cat', 'cute']
},
{
    id: 5,
    url: './img/5.jpg',
    keywords: ['baby', 'yes!!']
},
{
    id: 6,
    url: './img/6.jpg',
    keywords: ['professor', 'genius']
},
{
    id: 7,
    url: './img/7.jpg',
    keywords: ['baby', 'cute']
},
{
    id: 8,
    url: './img/8.jpg',
    keywords: ['actor', 'happy']
},
{
    id: 9,
    url: './img/9.jpg',
    keywords: ['baby', 'happy']
},
{
    id: 10,
    url: './img/10.jpg',
    keywords: ['obama', 'president']
},
{
    id: 11,
    url: './img/11.jpg',
    keywords: ['kiss', 'guys']
},
{
    id: 12,
    url: './img/12.jpg',
    keywords: ['sunshine', 'famous']
},
{
    id: 13,
    url: './img/13.jpg',
    keywords: ['actor', 'famous']
},
{
    id: 14,
    url: './img/14.jpg',
    keywords: ['famous', 'actor']
},
{
    id: 15,
    url: './img/15.jpg',
    keywords: ['got', 'stark']
},
{
    id: 16,
    url: './img/16.jpg',
    keywords: ['star', 'happy']
},
{
    id: 17,
    url: './img/17.jpg',
    keywords: ['putin', 'happy']
},
{
    id: 18,
    url: './img/18.jpg',
    keywords: ['trump', 'president']
}
];

let gKeywordsNum = {
    'happy': 12,
    'funny puk': 1
};

function getFilterImgs() {
    let filterImgs = gImgs.filter(img => img.keywords.includes(gFilterBy))
    if (!filterImgs.length) return gImgs;
    return filterImgs
}

//....... GET THE CUURENT LINE TXT THE USER EDITS .........//
function getCurrLine() {
    if (!gMeme.lines[gMeme.selectedLineIdx]) return gMeme.lines[0];
    return gMeme.lines[gMeme.selectedLineIdx];
}

//...................... UPDATE MODEL FUNCTIONS ...............//

function addLine() {
    const line = {
        txt: 'you know!!',
        size: 50,
        family: 'Arial',
        align: 'left',
        color: 'white',
        stroke: 'black',
        txtAlign: 'center',
        idx: 50,
        idy: 300,
        isDragging: false
    }
    gMeme.lines.unshift(line);
}

function removeLine(lineId) {
    if (gMeme.lines.length === 1) gMeme.lines.splice(lineId);
    gMeme.lines.splice(lineId, 1);
}

function setCurImgIdx(idx) {
    gMeme.selectedImgId = idx;
}

function setNewLine(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt;
}

function nextLine() {
    gMeme.selectedLineIdx = (gMeme.selectedLineIdx === gMeme.lines.length - 1) ? 0 : gMeme.selectedLineIdx + 1;
}

function changeFontFamily(font) {
    gMeme.lines[gMeme.selectedLineIdx].family = font;
}

function setTxtAlign(txtAlign) {
    switch (txtAlign) {
        case 'center':
            gMeme.lines[gMeme.selectedLineIdx].txtAlign = 'center';
            break
        case 'right':
            gMeme.lines[gMeme.selectedLineIdx].txtAlign = 'right';
            break
        case 'left':
            gMeme.lines[gMeme.selectedLineIdx].txtAlign = 'left';
            break
    }
}

function updateMemeLine(line, val) {
    line.txt = val;
}

function setColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color;
}

function increaseFontSize() {
    gMeme.lines[gMeme.selectedLineIdx].size++;
}

function decreaseFontSize() {
    gMeme.lines[gMeme.selectedLineIdx].size--;
}

function moveLineUp(currLine) {
    currLine.idy -= 10;
}

function moveLineDown(currLine) {
    currLine.idy += 10;
}

function resetMeme() {
    gMeme = {
        selectedImgId: 7,
        selectedLineIdx: 0,
        lines: [{
            txt: 'I Know!!',
            size: 50,
            family: 'Arial',
            align: 'left',
            color: 'white',
            stroke: 'black',
            txtAlign: 'center',
            idx: 200,
            idy: 50,
            isDragging: false
        }, {
            txt: 'you know!!',
            size: 50,
            family: 'Arial',
            align: 'left',
            color: 'white',
            stroke: 'black',
            txtAlign: 'center',
            idx: 200,
            idy: 300,
            isDragging: false
        }]
    }
}

//...................... SAVE USER MEMES TO LOCAL STORAGE .................//
function saveUserMeme(userMeme, imgData) {
    gUserSavedImgs.push(imgData);
    gUserSavedMems.push(userMeme);
    saveToStorage(MEMEKEY, gUserSavedMems);
    saveToStorage(IMGKEY, gUserSavedImgs);
}

//................... GETS USER MEMES FROM LOCAL STORAGE ...............////
function getUserSaveMeme() {
    let userMeme = loadFromStorage(IMGKEY);
    return userMeme;
}

function setFilter(filerBy) {
    gFilterBy = filerBy;
}