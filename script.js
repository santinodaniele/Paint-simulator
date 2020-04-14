console.log("ok")

import {
    Stroke
}from "./tools.js"

const w = 400
const h = 400

//recupero il riferimento al canvas che è come una sorta di tela in cui ci saranno un insieme di stroke ovvero tratti
const canvas = document.getElementById("canvas")

//imposto le dimensioni del canvas
canvas.width = w
canvas.height = h

//recupero il constesto
const ctx = canvas.getContext("2d");

const btnUndo = document.getElementById("btnUndo");
const colorPalette = document.getElementById("colorPalette");
const selectedColor = document.getElementById("selectedColor");

let currentColor = "FF0000";
let scheme = new ColorScheme;

const colorHue = document.getElementById("colorHue");
const colorSchemaSelect = document.getElementById("colorSchemaSelect");
const colorSchemaVariationSelect = document.getElementById("colorSchemaVariationSelect");

const makeColors = (hue,schema,variation) => {
    colorPalette.textContent = "";
    scheme.from_hue(colorHue.value).scheme(colorSchemaSelect.value).variation(colorSchemaVariationSelect.value);
    selectedColor.setAttribute("style", 'background-color: #' + currentColor + ';');
    scheme.colors().forEach(color => {
        let btn = document.createElement("button");
        btn.setAttribute("class", "btn btn-secondary");
        btn.setAttribute("style", 'background-color: #' + color + ';');
        btn.setAttribute("color-code", color);
        btn.innerHTML = "&nbsp;";
        btn.onclick = (e) => {
            selectedColor.setAttribute("style", 'background-color: #' + e.target.getAttribute("color-code") + ';');
            currentColor = color;
        }
        colorPalette.appendChild(btn);
    })
}

makeColors();


//quando viene spostato il colore
colorHue.oninput = (e) =>{
    makeColors();
}

colorSchemaSelect.onchange = (e) => {
    makeColors();
}
colorSchemaVariationSelect.onchange = (e) => {
    makeColors();
}

const clearCanvas = () =>{
    ctx.clearRect(0,0,w,h)
}

let strokes = [] //contiene ogni singolo tratto
let strokeWidth = 1;

const strokeSize = document.getElementById("strokeSize");
const strokeSizeD = document.getElementById("strokeSizeD");

strokeSize.oninput = () => {
    strokeWidth = strokeSize.value;
    strokeSizeD.textContent = strokeWidth;
}

//aggiungo i tratti a seconda degli eventi del mouse
let isDrawing = false;
const onMouseMove = (e) =>{
    if(!isDrawing) return;
    let x = e.pageX - canvas.offsetLeft;
    let y = e.pageY -canvas.offsetTop; //quanto è staccato dal bordo superiore

    strokes[strokes.length-1].addPoint({x,y}); //aggiungo un ulteriore stroke

}

canvas.onmousedown = (e) =>{
    isDrawing =  true;
    canvas.onmousemove = onMouseMove;
    let x = e.pageX - canvas.offsetLeft;
    let y = e.pageY - canvas.offsetTop; //quanto è staccato dal bordo superiore
    let tool = new Stroke({ctx,color:"#"+currentColor, size: strokeWidth});
    strokes.push(tool); //viene disegnato
    strokes[strokes.length-1].addPoint({x,y}); //aggiungo un ulteriore stroke
}

canvas.onmouseup = (e) =>{
    isDrawing = false;
    canvas.onmousemove = undefined;
}

btnUndo.onclick = (e) =>{
    strokes.pop(); //elimino dall'array degli strokes l'ultimo elemento
}

//funzione che prende il link element su cui lavorare e fa le operazioni
//associo la funzione sull'elemento download as png
const download = (linkElement) => {
    //due operazioni 1: trovo i dati
    const dataLink = canvas.toDataURL("image/png");
    linkElement.href = dataLink; //nel link c'è la nostra immagine
    linkElement.download = "image.png";

}

document.getElementById("downloadAsPNG").addEventListener("click",(e) =>{
    download(e.target); //oggetto cliccato ovvero il link stesso
},false); //false per impedire la propagazione

//devo rappresentare a video gli oggetti e definisco:

//disegna il canvas
function paint(){
    clearCanvas() // cancella il canvas e poi lo ridisegno
    strokes.forEach(stroke => stroke.draw())
    requestAnimationFrame(paint) //appena puoi disegna la funzione la prima volta chr la chiamo si esegue
}

requestAnimationFrame(paint)