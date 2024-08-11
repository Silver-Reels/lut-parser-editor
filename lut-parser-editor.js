let body=document.body;
body.style.margin="0";
body.style.backgroundColor="#080808";
body.style.fontFamily="sans-serif";

async function fetchArrayBufferFromFile(){                                // using native File API
  //let x=await window.showOpenFilePicker()
    let x=await window.showOpenFilePicker({types:[{accept:{"*/*":[".lut"]}}],multiple:false,excludeAcceptAllOption:true})
        .then(response=>response[0].getFile())
            .then(data=>data.arrayBuffer());
    return x;
};

async function writeArrayBufferToFile(ArrayBuffer){
    //let space=await window.showSaveFilePicker()
    let space=await window.showSaveFilePicker({suggestedName:"untitled.lut"})
        .then(response=>response.createWritable());
    await space.write(ArrayBuffer);
    await space.close();
    return;
};

async function URLtoCanvas(url){    // works with internet (tested on localwebserver) and images in root dir
    let urlImg=document.createElement("img");
    urlImg.src=url;
    urlImg.crossOrigin="anonymous";
    urlImg.onload=()=>{
        referenceImage.src=urlImg.src;
    };
};

let referenceDiv=document.createElement("div");
referenceDiv.style.position="absolute";
referenceDiv.style.left="12vw";
referenceDiv.style.top="7vw";
referenceDiv.style.width="54vw";
referenceDiv.style.height="36vw";
referenceDiv.style.overflow="hidden";
referenceDiv.style.clipPath="polygon(0 0, 100% 0, 100% 100%, 0% 100%)";
referenceDiv.style.border="1px solid #FFFFFF";
referenceDiv.style.userSelect="none";

let referenceImage=document.createElement("img");
referenceImage.style.width="54vw";
referenceImage.style.height="36vw";
referenceImage.style.position="fixed"; // prevents interference with graph points

let canvas=document.createElement("canvas");
let context=canvas.getContext("2d");
canvas.style.position="fixed";

let referenceForm=document.createElement("form");
referenceForm.style.width="15vw";

let referencePath=document.createElement("input");
referencePath.type="text";
referencePath.placeholder="Reference image path (local or URL)...";
referencePath.style.position="absolute";
referencePath.style.top="1vw";
referencePath.style.right="12.5vw";
referencePath.style.width="15vw";

let referencePathButton=document.createElement("button");
referencePathButton.style.position="absolute";
referencePathButton.style.top="1vw";
referencePathButton.style.right="1vw";
referencePathButton.style.border="0";
referencePathButton.style.borderRadius="2px";
referencePathButton.style.fontSize="1vw";   
referencePathButton.innerText="Load Reference Image";

referenceForm.onsubmit=(e)=>{
    e.preventDefault();
    URLtoCanvas(referencePath.value)

    let h="http";let fetch=true;
    for (let i=0;i<h.length;i++){if (referencePath.value[i].toLowerCase()!=h[i]){fetch=false;break}};

    if (fetch){URLtoCanvas(referencePath.value)}
    else (referenceImage.src=referencePath.value);
    clearReference.style.backgroundColor="#FFFFFF";
    return;
};

let clearReference=document.createElement("button");
clearReference.style.position="absolute";
clearReference.style.top="3vw";
clearReference.style.right="15.5vw";
clearReference.style.backgroundColor="#808080";
clearReference.style.border="0";
clearReference.style.borderRadius="2px";
clearReference.innerText="Clear Reference Image";
clearReference.onmousedown=()=>{referenceImage.src="";referencePath.value="";clearReference.style.backgroundColor="#808080";return};

body.appendChild(clearReference);

let referenceOpacityLabel=document.createElement("p");
referenceOpacityLabel.innerText="Opacity";
referenceOpacityLabel.style.position="absolute";
referenceOpacityLabel.style.top="1.5vw";
referenceOpacityLabel.style.right="35vw";
referenceOpacityLabel.style.color="#FFFFFF";

let referenceOpacity=document.createElement("input");
referenceOpacity.style.position="absolute";
referenceOpacity.style.top="1vw";
referenceOpacity.style.right="34vw";
referenceOpacity.style.width="5vw";
referenceOpacity.type="range";
referenceOpacity.min=0;
referenceOpacity.max=100;
referenceOpacity.value=100;

referenceOpacity.oninput=()=>{referenceImage.style.opacity=`${referenceOpacity.value}%`};

body.appendChild(referenceOpacityLabel);
body.appendChild(referenceOpacity);

let referenceXvalue=0;
let referenceYvalue=0;
let referenceScaleValue=1;   // scale
let referenceStretchXvalue=1; // scaleX
let referenceStretchYvalue=1; // scaleY

let referenceXLabel=document.createElement("p");let referenceYLabel=document.createElement("p");
referenceXLabel.innerText="Move X";        referenceYLabel.innerText="Move Y";
referenceXLabel.style.position="absolute";      referenceYLabel.style.position="absolute";
referenceXLabel.style.top="1.5vw";              referenceYLabel.style.top="1.5vw";
referenceXLabel.style.right="57vw";           referenceYLabel.style.right="44vw";
referenceXLabel.style.color="#FFFFFF";          referenceYLabel.style.color="#FFFFFF";

let referenceXposition=document.createElement("input");
referenceXposition.style.position="absolute";
referenceXposition.style.top="1vw";
referenceXposition.style.right="52vw";
referenceXposition.style.width="12vw";
referenceXposition.type="range";
referenceXposition.min=-80;
referenceXposition.max=80;
referenceXposition.step=0.025;
referenceXposition.value=referenceXvalue;

let referenceYposition=document.createElement("input");
referenceYposition.style.position="absolute";
referenceYposition.style.top="1vw";
referenceYposition.style.right="39.5vw";
referenceYposition.style.width="12vw";
referenceYposition.type="range";
referenceYposition.min=-80;
referenceYposition.max=80;
referenceYposition.step=0.025;
referenceYposition.value=referenceYvalue;

referenceXposition.oninput=()=>{referenceXvalue=+referenceXposition.value;referenceImage.style.transform=`translate(${referenceXvalue}%, ${-referenceYvalue}%) scale(${referenceScaleValue}) scaleX(${referenceStretchXvalue}) scaleY(${referenceStretchYvalue})`};
referenceYposition.oninput=()=>{referenceYvalue=+referenceYposition.value;referenceImage.style.transform=`translate(${referenceXvalue}%, ${-referenceYvalue}%) scale(${referenceScaleValue}) scaleX(${referenceStretchXvalue}) scaleY(${referenceStretchYvalue})`};


body.appendChild(referenceXLabel);body.appendChild(referenceYLabel);
body.appendChild(referenceXposition);body.appendChild(referenceYposition);

let referenceSizeLabel=document.createElement("p");
referenceSizeLabel.innerText="Scale";
referenceSizeLabel.style.position="absolute";
referenceSizeLabel.style.top="1.5vw";
referenceSizeLabel.style.right="67vw";
referenceSizeLabel.style.color="#FFFFFF";

let referenceSize=document.createElement("input");
referenceSize.style.position="absolute";
referenceSize.style.top="1vw";
referenceSize.style.right="64.5vw";
referenceSize.style.width="7vw";
referenceSize.type="range";
referenceSize.value=referenceScaleValue;
referenceSize.min=1;
referenceSize.max=3;
referenceSize.step=0.025;

referenceSize.oninput=()=>{referenceScaleValue=+referenceSize.value;referenceImage.style.transform=`translate(${referenceXvalue}%, ${-referenceYvalue}%) scale(${referenceScaleValue}) scaleX(${referenceStretchXvalue}) scaleY(${referenceStretchYvalue})`};

body.appendChild(referenceSizeLabel);
body.appendChild(referenceSize);

let referenceStretchXLabel=document.createElement("p");
referenceStretchXLabel.innerText="Stretch X";
referenceStretchXLabel.style.position="absolute";
referenceStretchXLabel.style.top="1.5vw";
referenceStretchXLabel.style.right="81vw";
referenceStretchXLabel.style.color="#FFFFFF";

let referenceStretchX=document.createElement("input");
referenceStretchX.style.position="absolute";
referenceStretchX.style.top="1vw";
referenceStretchX.style.right="79.5vw";
referenceStretchX.style.width="7vw";
referenceStretchX.type="range";
referenceStretchX.min=1;
referenceStretchX.max=2;
referenceStretchX.step=0.025;
referenceStretchX.value=referenceStretchXvalue;

referenceStretchX.oninput=()=>{referenceStretchXvalue=+referenceStretchX.value;referenceImage.style.transform=`translate(${referenceXvalue}%, ${-referenceYvalue}%) scale(${referenceScaleValue}) scaleX(${referenceStretchXvalue}) scaleY(${referenceStretchYvalue})`};

body.appendChild(referenceStretchXLabel);
body.appendChild(referenceStretchX);

let referenceStretchYLabel=document.createElement("p");
referenceStretchYLabel.innerText="Stretch Y";
referenceStretchYLabel.style.position="absolute";
referenceStretchYLabel.style.top="1.5vw";
referenceStretchYLabel.style.right="73.5vw";
referenceStretchYLabel.style.color="#FFFFFF";

let referenceStretchY=document.createElement("input");
referenceStretchY.style.position="absolute";
referenceStretchY.style.top="1vw";
referenceStretchY.style.right="72vw";
referenceStretchY.style.width="7vw";
referenceStretchY.type="range";
referenceStretchY.min=1;
referenceStretchY.max=2;
referenceStretchY.step=0.025;
referenceStretchY.value=referenceStretchYvalue;

referenceStretchY.oninput=()=>{referenceStretchYvalue=+referenceStretchY.value;referenceImage.style.transform=`translate(${referenceXvalue}%, ${-referenceYvalue}%) scale(${referenceScaleValue}) scaleX(${referenceStretchXvalue}) scaleY(${referenceStretchYvalue})`};

body.appendChild(referenceStretchYLabel);
body.appendChild(referenceStretchY);

body.backgroundColor="#808080"

let dataLoadButton=document.createElement("button");
dataLoadButton.style.position="absolute";
dataLoadButton.style.top="5vw";
dataLoadButton.style.right="1vw";
dataLoadButton.style.border="0";
dataLoadButton.style.borderRadius="2px";
dataLoadButton.style.fontSize="1.1vw";
dataLoadButton.innerText="Load LUT...";

let lines={};
let sorted=[];
// warning: so far these 2 will reference the same values

dataLoadButton.onmousedown=async()=>{
    let buffer=await fetchArrayBufferFromFile();
    lines=parseLUT(buffer);

    while (dataWindow.childElementCount>1){dataWindow.children[1].remove()};                // clears current DataWindow
    // keeps children[0] because that's the 'addButton' div

    sorted=Object.entries(lines);

    for (let i=0;i<sorted.length;i++){
        let x=sorted[i][1].data[0];                                                         // +1 bias for all 'x'
        if (x.length){sorted[i][1].data[0]=`${(+x)+1}`};                                    // (for sorting)
    };                                                                                      // sorted will have 2 precision points after '.'

    // bias exists because sorting method below will equate empty strings in 'data' as 0
    // and '0' as 0. we would prefer to keep all comment-only lines at the top, separate from
    // lines with entries. so all entries with data are min=1, then unbiased again
    
    sorted=sorted.sort((a,b)=>+a[1].data[0]-(+b[1].data[0]));                               // sort ascending by x

    for (let i=0;i<sorted.length;i++){
        let x=sorted[i][1].data[0];                                                         // unbias
        //console.log(x.length);
        if (x.length){sorted[i][1].data[0]=`${(+x)-1}`};
    };


    for (let i=0;i<sorted.length-1;i++){                                                    // remove duplicate
        if (+sorted[i][1].data[0]===+sorted[i+1][1].data[0] && sorted[i][1].data[0].length){  // values of same x
            for (let j=i+1;j<sorted.length;j++){sorted[j-1]=sorted[j]};                     // (latest is kept)
            sorted.length-=1;
            i--;
        };
    };

    for (let i=0;i<sorted.length;i++){
        if (sorted[i][1].data[0].length){                                                   // if not 'comment-only' line
            createDataPoint(+sorted[i][1].data[0],+sorted[i][1].data[1]);
        };
    };
    
    autoGraphSize();
    drawGraph();drawGraphHandler();
    makeGrid();
    return;
};


let dataWindow=document.createElement("div");
dataWindow.style.position="absolute";
dataWindow.style.display="flex";
dataWindow.style.top="7vw";
dataWindow.style.right="1vw";
dataWindow.style.width="15vw";
dataWindow.style.height="35vw";
dataWindow.style.backgroundColor="#000000";
dataWindow.style.overflowY="scroll";
dataWindow.style.overflowX="hidden";
dataWindow.style.flexDirection="column";
dataWindow.style.rowGap="0.66vw";
dataWindow.style.padding="0.66vw";
dataWindow.style.borderRadius="3px";
dataWindow.style.scrollbarColor="#000000";

let addDiv=document.createElement("div");
addDiv.style.display="grid";
addDiv.style.gridTemplateColumns="4vw 4vw 3vw";
addDiv.style.columnGap="0.33vw";
addDiv.style.marginBottom="1vw";

let xAdd=document.createElement("input");xAdd.value=0;xAdd.type="number";xAdd.min=0;xAdd.step=1;xAdd.style.border="0";xAdd.style.borderRadius="2px";
let yAdd=document.createElement("input");yAdd.value=0;yAdd.type="number";yAdd.min=0;yAdd.step=1;yAdd.style.border="0";yAdd.style.borderRadius="2px";

let addButton=document.createElement("button");addButton.innerText="+";
addButton.style.backgroundColor="#209020";
addButton.style.cursor="pointer";
addButton.style.border="0";
addButton.style.width="2vw";
addButton.style.borderRadius="2px";
addButton.onmousedown=(e)=>{
    
    let xSelected=e.srcElement.parentElement.firstChild.value;
    let ySelected=e.srcElement.parentElement.children[1].value;

    if (!sorted.length){
        sorted.push(["1",{data:[`${+xAdd.value}`,`${+yAdd.value}`],comment:""}]);
        //console.log("ADDBUTTON PATH A");
        refreshDataWindow();return;
    };// started with empty sorted

    if (+xSelected<(+sorted[0][1].data[0])){
        sorted.unshift([`${sorted[0][0]}`,{data:[`${+xAdd.value}`,`${+yAdd.value}`],comment:""}]);
        for (let i=1;i<sorted.length;i++){sorted[i][0]=`${+sorted[i][0]+1}`};
        //console.log("ADDBUTTON PATH B");
        refreshDataWindow();return;
    };// add element to beginning of sorted, update all 'lines' accordingly

    if (+xSelected>(+sorted[sorted.length-1][1].data[0])){
        sorted.push([`${+sorted[sorted.length-1][0]+1}`,{data:[`${+xAdd.value}`,`${+yAdd.value}`],comment:""}]);
        //console.log("ADDBUTTON PATH C");
        refreshDataWindow();return;
    };// add element to end of sorted


    // test if added element can replace entry with same 'x', or should go inbetween 2 entries
    for (let i=0;i<sorted.length;i++){
        let xTested=+sorted[i][1].data[0];


        if (xTested===+xSelected){sorted[i][1].data[1]=`${+ySelected}`;/*console.log("ADDBUTTON PATH D");*/refreshDataWindow();return};

        // 'inbetween' route
        if (sorted[i+1]!=undefined && +xSelected>xTested && +xSelected<(+sorted[i+1][1].data[0])){

            sorted.push(sorted[sorted.length-1]);                           // duplicate last item

            //for (let j=i+1;j<sorted.length-1;j++){sorted[j+1]=sorted[j]};

            for (let j=sorted.length-1;j>i+1;j--){sorted[j]=sorted[j-1]};   // move over items right of 'i' by 1

            for (let j=i+1;j<sorted.length;j++){
                sorted[j][0]=`${+(sorted[j][0])+1}`;                        // increase 'line' of everything after 'i' by +1
            };
            sorted[i+1]=[`${+sorted[i+1][0]-1}`,{data:[`${+xAdd.value}`,`${+yAdd.value}`],comment:""}]; // insert new item
            //console.log("ADDBUTTON PATH E");
            refreshDataWindow();
            return;
        };
    }
    //console.log("ADDBUTTON PATH F");
    return;
};

addDiv.appendChild(xAdd);addDiv.appendChild(yAdd);addDiv.appendChild(addButton);
dataWindow.appendChild(addDiv);

function refreshDataWindow(){

    while (dataWindow.childElementCount>1){dataWindow.children[1].remove()};                // clears current DataWindow
    // keeps children[0] because that's the 'addButton' div

    for (let i=0;i<sorted.length;i++){
        let x=sorted[i][1].data[0];                                                         // +1 bias for all 'x'
        if (x.length){sorted[i][1].data[0]=`${+x+1}`};                                      // (for sorting)
    };
    sorted=sorted.sort((a,b)=>+a[1].data[0]-(+b[1].data[0]));                               // sort ascending by x
    for (let i=0;i<sorted.length;i++){
        let x=sorted[i][1].data[0];                                                         // unbias
        if (x.length){sorted[i][1].data[0]=`${(+x)-1}`};
    };

    for (let i=0;i<sorted.length-1;i++){                                                    // remove duplicate values of
        if (+sorted[i][1].data[0]===+sorted[i+1][1].data[0] && sorted[i][1].data[0].length){  // same x
            for (let j=i+1;j<sorted.length;j++){sorted[j-1]=sorted[j]};                     // (latest is kept)
            sorted.length-=1;i--;
        };
    };
    
    for (let i=0;i<sorted.length;i++){                                                      // add entires that aren't 'comment-only'
        if (sorted[i][1].data[0].length){createDataPoint(+sorted[i][1].data[0],+sorted[i][1].data[1])};
    };
    drawGraph();
    drawGraphHandler();
   return;
};

function showSorted(){ // diagnostic
    let string=``;
    for (let i=0;i<sorted.length;i++){
        string+=`line ${sorted[i][0]}\t [${sorted[i][1].data[0]}, ${sorted[i][1].data[1]}]\t\tcomment =\t${sorted[i][1].comment}\n`;
    }
    string+=`LENGTH ${sorted.length}`;
    console.log(string);
    return;
};

let COMMENT_SVG_DATA=`<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <style>
      .cls-1 {fill: none;}
      .cls-1, .cls-2 {stroke: #231f20;stroke-miterlimit: 10;}
      .cls-2{fill: #8fa6d6;}
    </style>
  </defs>
  <path class="cls-2" d="m76.34,5.96H22.92C11.82,5.96,2.82,14.96,2.82,26.07v21.97c0,10.49,8.04,19.1,18.3,20.01l-14.5,27.76,48.49-27.67h21.23c11.1,0,20.1-9,20.1-20.1v-21.97c0-11.1-9-20.1-20.1-20.1Z"/>
  <line class="cls-1" x1="17.7" y1="16.37" x2="81.19" y2="16.37"/>
  <line class="cls-1" x1="17.7" y1="26.24" x2="81.19" y2="26.24"/>
  <line class="cls-1" x1="17.7" y1="36.11" x2="81.19" y2="36.11"/>
  <line class="cls-1" x1="17.7" y1="45.98" x2="81.19" y2="45.98"/>
</svg>`;


function createDataPoint(xVal,yVal){
    let div=document.createElement("div");
    div.style.display="grid";
    div.style.gridTemplateColumns="4vw 4vw 2vw 3vw";
    div.style.columnGap="0.33vw";

    let x=document.createElement("input");x.type="number";x.value=xVal;x.min=0;x.step=1;x.style.border="0";x.style.borderRadius="2px";
    let y=document.createElement("input");y.type="number";y.value=yVal;y.min=0;y.step=1;y.style.border="0";y.style.borderRadius="2px";
    x.setAttribute("x-old-value",xVal); // used to update 'sorted' when 'onchange'
    y.setAttribute("x-old-value",yVal);

    x.onchange=(e)=>{
        let xSelected=+e.srcElement.parentElement.children[0].attributes.getNamedItem("x-old-value").value;
        for (let i=0;i<sorted.length;i++){
            let xTested=+sorted[i][1].data[0];
            if (xTested===xSelected){
                sorted[i][1].data[0]=x.value;
                e.srcElement.parentElement.children[0].setAttribute("x-old-value",x.value);
                break;
            };
        };
        refreshDataWindow();return;
    };
    y.onchange=(e)=>{
        let xSelected=+e.srcElement.parentElement.children[0].attributes.getNamedItem("x-old-value").value;  // still finding by 'x'
        for (let i=0;i<sorted.length;i++){                                                                  //  even though we're changing 'y'
            let xTested=+sorted[i][1].data[0];
            if (xTested===xSelected){
                sorted[i][1].data[1]=y.value;
                e.srcElement.parentElement.children[1].setAttribute("x-old-value",y.value);
                break;
            };
        };
        refreshDataWindow();return;
    };
    /*
    let comment=document.createElement("img");
    comment.src="comment.svg";
    comment.style.height="1.5vw";
    comment.style.cursor="pointer";
    */
    let comment=document.createElement("svg");
    comment.style.height="1.5vw";
    comment.style.cursor="pointer";
    comment.innerHTML=COMMENT_SVG_DATA;
    

    comment.onmousedown=(e)=>{
        commentX=+e.srcElement.parentElement.parentElement.parentElement.firstChild.value
        loadComment(commentX);
        commentDescription.innerText=`Comment for point (${commentX}, ${+e.srcElement.parentElement.parentElement.parentElement.children[1].value} )`;
        openOverlay();
        return;
    };


    let del=document.createElement("button");del.innerText="X";
    del.style.backgroundColor="#902020";
    del.style.cursor="pointer";
    del.style.border="0";
    del.style.width="2vw";
    del.style.borderRadius="2px";
    del.onmousedown=(e)=>{
        let xSelected=+e.srcElement.parentElement.firstChild.value;
        //console.log(`CALLING DEL FOR (${xSelected},${+e.srcElement.parentElement.children[1].value})`);

        for (let i=0;i<sorted.length;i++){                                      // delete relevant item from 'sorted'
            if (!sorted[i][1].data[0].length){continue};
            let xTested=+sorted[i][1].data[0];
            if (xTested===xSelected){

                for (let j=i;j<sorted.length-1;j++){                            // deleting and moving over
                    sorted[j]=sorted[j+1];
                    sorted[j][0]=`${+sorted[j][0]-1}`;                          // making line = line-1
                };
                sorted.length-=1;
                break;
            }
        };
        refreshDataWindow();return;                                              // delete relevant 'div' from dataWindow
    };

    div.onmouseenter=(e)=>{                                                     // HIGHLIGHT points when hovering data
        let xSelected=+e.srcElement.firstChild.value;
        for (let i=2;i<referenceDiv.childElementCount;i++){
            if (xSelected===+referenceDiv.children[i].getAttribute("x-old-x")){
                referenceDiv.children[i].style.border="3px solid #FFFFFF";
                referenceDiv.children[i].style.backgroundColor="#000000";
                return;
            };
        };
    };

    div.onmouseleave=()=>{
        for (let i=2;i<referenceDiv.childElementCount;i++){
            referenceDiv.children[i].style.border="0";
            referenceDiv.children[i].style.backgroundColor=pointColor;          // remove highlights
        };
    };

    div.appendChild(x);
    div.appendChild(y);
    div.appendChild(comment);   
    div.appendChild(del);

    dataWindow.appendChild(div);
    return;
};


referenceForm.appendChild(referencePathButton);
referenceForm.appendChild(referencePath);
body.appendChild(referenceForm);

referenceDiv.appendChild(referenceImage);
body.appendChild(referenceDiv);
canvas.width=referenceDiv.clientWidth;
canvas.height=referenceDiv.clientHeight;
referenceDiv.appendChild(canvas);

body.appendChild(dataLoadButton);
body.appendChild(dataWindow);


let minX=0;
let minY=0;
let maxX=100;
let maxY=100;
let graphTolerance=0;

let minXControl=document.createElement("input");
let minYControl=document.createElement("input");
let maxXControl=document.createElement("input");
let maxYControl=document.createElement("input");
let graphToleranceControl=document.createElement("input");

minXControl.type="number";
minYControl.type="number";
maxXControl.type="number";
maxYControl.type="number";
graphToleranceControl.type="number";
minXControl.value=minX;
minYControl.value=minY;
maxXControl.value=maxX;
maxYControl.value=maxY;
graphToleranceControl.value=graphTolerance;
minXControl.style.border="0";
minYControl.style.border="0";
maxXControl.style.border="0";
maxYControl.style.border="0";
graphToleranceControl.style.border="0";
minXControl.style.borderRadius="2px";
minYControl.style.borderRadius="2px";
maxXControl.style.borderRadius="2px";
maxYControl.style.borderRadius="2px";
graphToleranceControl.style.borderRadius="2px";
minXControl.step=1;
minYControl.step=1;
maxXControl.step=1;
maxYControl.step=1;
graphToleranceControl.step=1;

minXControl.onchange=()=>{minX=+minXControl.value+graphTolerance;drawGraph();drawGraphHandler();makeGrid();return};
minYControl.onchange=()=>{minY=+minYControl.value+graphTolerance;drawGraph();drawGraphHandler();makeGrid();return};
maxXControl.onchange=()=>{maxX=+maxXControl.value+graphTolerance;drawGraph();drawGraphHandler();makeGrid();return};
maxYControl.onchange=()=>{maxY=+maxYControl.value+graphTolerance;drawGraph();drawGraphHandler();makeGrid();return};

graphToleranceControl.onchange=()=>{
    graphTolerance=+graphToleranceControl.value;
    minX=+minXControl.value-graphTolerance;
    minY=+minYControl.value-graphTolerance;
    maxX=+maxXControl.value+graphTolerance;
    maxY=+maxYControl.value+graphTolerance;
    drawGraph();drawGraphHandler();makeGrid();return;
};

minXControl.style.position="absolute";
minYControl.style.position="absolute";
maxXControl.style.position="absolute";
maxYControl.style.position="absolute";
graphToleranceControl.style.position="absolute";
minXControl.style.left="3vw";
minYControl.style.left="3vw";
maxXControl.style.left="6.5vw";
maxYControl.style.left="6.5vw";
graphToleranceControl.style.left="6.5vw";
minXControl.style.top="18vw";
minYControl.style.top="20vw";
maxXControl.style.top="18vw";
maxYControl.style.top="20vw";
graphToleranceControl.style.top="23vw";

minXControl.style.width="3vw";
minYControl.style.width="3vw";
maxXControl.style.width="3vw";
maxYControl.style.width="3vw";
graphToleranceControl.style.width="3vw";

minXControl.style.height="1.5vw";
minYControl.style.height="1.5vw";
maxXControl.style.height="1.5vw";
maxYControl.style.height="1.5vw";
graphToleranceControl.style.height="1.5vw";

let label1=document.createElement("p");
let label2=document.createElement("p");
let label3=document.createElement("p");
let label4=document.createElement("p");
let label5=document.createElement("p");

label1.style.position="absolute";
label2.style.position="absolute";
label3.style.position="absolute";
label4.style.position="absolute";
label5.style.position="absolute";
label1.style.lineHeight="0";
label2.style.lineHeight="0";
label3.style.lineHeight="0";
label4.style.lineHeight="0";
label5.style.lineHeight="0";

label1.style.fontSize="1vw";
label2.style.fontSize="1vw";
label3.style.fontSize="1vw";
label4.style.fontSize="1vw";
label5.style.fontSize="1vw";

label1.style.color="#FFFFFF";
label2.style.color="#FFFFFF";
label3.style.color="#FFFFFF";
label4.style.color="#FFFFFF";
label5.style.color="#FFFFFF";

label1.innerText="X";
label2.innerText="Y";
label3.innerText="min";
label4.innerText="max";
label5.innerText="margin";

label1.style.top="18vw";
label1.style.left="2vw";

label2.style.top="20vw";
label2.style.left="2vw";

label3.style.top="16vw";
label3.style.left="4vw";

label4.style.top="16vw";
label4.style.left="7vw";

label5.style.top="23vw";
label5.style.left="3vw";

body.appendChild(label1);
body.appendChild(label2);
body.appendChild(label3);
body.appendChild(label4);
body.appendChild(label5);

body.appendChild(minXControl);
body.appendChild(minYControl);
body.appendChild(maxXControl);
body.appendChild(maxYControl);
body.appendChild(graphToleranceControl);

let curveWidth=2;
let curveColor="#FFFF00";

let pointSize=10;
let pointColor="#FFFF00";

let widthControl=document.createElement("input");
widthControl.type="range";
widthControl.min=0.5;
widthControl.max=4;
widthControl.step=0.1;
widthControl.value=curveWidth;

widthControl.oninput=()=>{curveWidth=+widthControl.value;drawGraphHandler();return};

widthControl.style.position="absolute";
widthControl.style.top="28vw";
widthControl.style.left="1vw";

body.appendChild(widthControl);

let widthControlLabel=document.createElement("p");
widthControlLabel.innerText="Line Width";
widthControlLabel.style.position="absolute";
widthControlLabel.style.top="26vw";
widthControlLabel.style.left="3vw";
widthControlLabel.style.color="#FFFFFF";

body.appendChild(widthControlLabel);

let pointControlLabel=document.createElement("p");
pointControlLabel.innerText="Point Size";
pointControlLabel.style.position="absolute";
pointControlLabel.style.top="29vw";
pointControlLabel.style.left="3vw";
pointControlLabel.style.color="#FFFFFF";

body.appendChild(pointControlLabel);

let pointControl=document.createElement("input");
pointControl.type="range";
pointControl.min=2;
pointControl.max=15;
pointControl.step=1;
pointControl.value=pointSize;

pointControl.oninput=()=>{pointSize=+pointControl.value;drawGraph();return};

pointControl.style.position="absolute";
pointControl.style.top="31vw";
pointControl.style.left="1vw";

body.appendChild(pointControl);

let colorControl=document.createElement("input");
colorControl.type="color";
colorControl.style.position="absolute";
colorControl.style.top="41vw";
colorControl.style.left="2vw";
colorControl.style.width="2vw";
colorControl.style.border="0";
colorControl.style.borderRadius="2px";
colorControl.value=curveColor;

colorControl.oninput=()=>{curveColor=colorControl.value;pointColor=colorControl.value;drawGraph();drawGraphHandler();return};

body.appendChild(colorControl);

let colorControlLabel=document.createElement("p");
colorControlLabel.innerText="Graph";
colorControlLabel.style.color="#FFFFFF";
colorControlLabel.style.position="absolute";
colorControlLabel.style.top="38.5vw";
colorControlLabel.style.left="1.6vw";

body.appendChild(colorControlLabel);


function autoGraphSize(){

    let minYFound=0;
    let maxYFound=0;
    let tested=0;
    for (let i=0;i<sorted.length;i++){
        tested=sorted[i][1].data[1];
        if (!tested.length){continue};
        if (+tested>maxYFound){maxYFound=+tested};
        if (+tested<minYFound){minYFound=+tested};
    };

    minX=+dataWindow.children[1].children[0].value-graphTolerance;
    minY=minYFound-graphTolerance;
    maxX=+dataWindow.children[dataWindow.childElementCount-1].children[0].value+graphTolerance;
    maxY=maxYFound+graphTolerance;

    minXControl.value=minX+graphTolerance;
    minYControl.value=minY+graphTolerance;
    maxXControl.value=maxX-graphTolerance;
    maxYControl.value=maxY-graphTolerance;
    return;
};

let cursorLocator=document.createElement("p");
cursorLocator.style.position="absolute";
cursorLocator.innerText=`(x,y)`;
cursorLocator.style.top="6vw";
cursorLocator.style.right="28vw";
cursorLocator.style.color="#FFFFFF";
cursorLocator.style.fontSize="1.2vw";
cursorLocator.style.width="5vw";

body.appendChild(cursorLocator);

let referenceControlsLabel=document.createElement("p");
referenceControlsLabel.style.position="absolute";
referenceControlsLabel.innerText="Reference Image Controls:";
referenceControlsLabel.style.top="0.2vw";
referenceControlsLabel.style.left="3vw";
referenceControlsLabel.style.lineHeight="1";
referenceControlsLabel.style.color="#FFFFFF";
referenceControlsLabel.style.width="12vw";
referenceControlsLabel.style.pointerEvents="none";

body.appendChild(referenceControlsLabel);

let disclaimer=document.createElement("p");
disclaimer.innerHTML=`DISCLAIMER: Use only in fullscreen browser window on desktop. Do not resize the window. Requires modern browser with JavaScript enabled. Assigning the same 'X' value to multiple points will overwrite them (whether by typing values or dragging/clicking points). Exercise caution with floating point operations. Only positive numbers are currently supported by parser & writer. Always double-check all data. Loading reference images from URL is only possible from sources that allow anonymous fetching. Use reference images that are preferably already cropped to min & max on both axes for accuracy. No user data of any kind is collected. MIT License applies. 'LUT Parser & Editor Tool' developed by Mikhail Leon for entertainment purposes only, 2024. Read more information on <a target="_blank" href="https://github.com/Silver-Reels/lut-parser-editor">Github</a>.`;
disclaimer.style.position="absolute";
disclaimer.style.color="#FFFFFF";
//disclaimer.style.pointerEvents="none";
disclaimer.style.bottom="0vw";
disclaimer.style.left="0vw";
disclaimer.style.padding="0 1vw";
disclaimer.style.fontSize="0.7vw";


body.appendChild(disclaimer);

function drawGraph(){ // ONLY POINTS!
    // graph offsets = referenceDiv.offsetTop & referenceDiv.offsetLeft
    //console.log(`minX: ${minX} | maxX: ${maxX} | minY: ${minY} | maxY: ${maxY}`);

    while (referenceDiv.childElementCount>2){                               // wiping any possible previous graph points, leaving only the initial 
        referenceDiv.children[referenceDiv.childElementCount-1].remove();   // 2 chilren - referenceImage and canvas
    };

    for (let i=0;i<sorted.length;i++){
        if (!sorted[i][1].data[0].length){continue};
        let x=sorted[i][1].data[0];
        let y=sorted[i][1].data[1];
        referenceDiv.appendChild(giveDraggablePoint(x,y)); // strings
    };
    return;
}

let activePoint=null; // or num

function giveDraggablePoint(x,y){ // strings
    let point=document.createElement("div");
    point.style.width=`${pointSize}px`;
    point.style.height=`${pointSize}px`;
    point.style.backgroundColor=pointColor;
    point.style.position="fixed";
    point.style.borderRadius="200px";
    point.setAttribute("x-old-x",x); // used for some realtime comparisons where the 'known' x (old) may not be the same as the 'read' x (overwritten)
    point.setAttribute("x-old-y",y);

    let xFraction = (x-minX) / (maxX-minX);
    let yFraction = (y-minY) / (maxY-minY);
    let centerDifference=pointSize/2;

    //console.log(`data: xP = ${xPixelsPerUnit} | yP = ${yPixelsPerUnit} | xF = ${xFraction} | yF = ${yFraction}`);

    point.style.transform=`translateX(${(referenceDiv.clientWidth*xFraction)-centerDifference}px) translateY(${(referenceDiv.clientHeight-(referenceDiv.clientHeight*yFraction))-centerDifference}px)`;
    
    // FOR DRAGGING
    point.onmousedown=(e)=>{activePoint=+point.getAttribute("x-old-x");return};

    // FOR HIGHLIGHTING
    point.onmouseenter=(e)=>{
        //console.log(`MOUSEENTER: X = ${x} ${typeof x}`);
        for (let i=1;i<dataWindow.childElementCount;i++){
            if (dataWindow.children[i].children[0].value===point.getAttribute("x-old-x")){
                dataWindow.children[i].style.backgroundColor="#DDDDDD";
                break;
            }
        }
        return;
    }
    point.onmouseleave=(e)=>{
        //console.log(`MOUSELEAVE`);
        for (let i=1;i<dataWindow.childElementCount;i++){
            dataWindow.children[i].style.backgroundColor="#000000";
        }
        return;
    }

    return point;
};


window.onmousemove=(e)=>{
    if (overlayActive){return};

    let cursorDecimalPrecision=0;
    // for text indicating where cursor is pointing

    // always updating cursorLocator if inside graph window
    if (e.clientX>referenceDiv.offsetLeft && e.clientX<(referenceDiv.clientWidth+referenceDiv.offsetLeft)){
        if (e.clientY>referenceDiv.offsetTop && e.clientY<(referenceDiv.clientHeight+referenceDiv.offsetTop)){
            cursorLocator.innerText=`(${((((e.clientX-referenceDiv.offsetLeft)/referenceDiv.clientWidth)*(maxX-minX))+minX).toFixed(cursorDecimalPrecision)},${(((1-((e.clientY-referenceDiv.offsetTop)/referenceDiv.clientHeight))*(maxY-minY))+minY).toFixed(cursorDecimalPrecision)})`;
        } else {cursorLocator.innerText=`(x,y)`};
    } else {cursorLocator.innerText=`(x,y)`};

    if (activePoint===null){return};

    // for dragging existing points
    let decimalPrecision=2;
    // some precision is good, but full 64-bit float precision is bad and WILL interfere with actions such as 'dragging' by making faulty operations

    //console.log(`dragging detected: activePoint = ${activePoint}`);
    for (let i=0;i<sorted.length;i++){
        if (+(+sorted[i][1].data[0]).toFixed(decimalPrecision)===+activePoint){
            if (e.clientX<referenceDiv.offsetLeft || e.clientX>(referenceDiv.clientWidth+referenceDiv.offsetLeft)){return};
            if (e.clientY<referenceDiv.offsetTop || e.clientY>(referenceDiv.clientHeight+referenceDiv.offsetTop)){return};

            let newX=`${((((e.clientX-referenceDiv.offsetLeft)/referenceDiv.clientWidth)*(maxX-minX))+minX).toFixed(decimalPrecision)}`;
            let newY=`${(((1-((e.clientY-referenceDiv.offsetTop)/referenceDiv.clientHeight))*(maxY-minY))+minY).toFixed(decimalPrecision)}`;
            //console.log(`mousemove: (${newX},${newY})`);
            sorted[i][1].data[0]=newX;
            sorted[i][1].data[1]=newY;
            activePoint=+newX;
            refreshDataWindow();
            return;
        };
        //console.log(`activePoint different from ${sorted[i][1].data[0]}`);
    };
    return;
};
// current behavior: dragging across another point on the x-axis wil delete that point, generally because we're only checking x to validate
// and refreshDataWindow()->createDataPoint(x,y), which deletes duplicates.
// if you drag fast enough or there is enough value decimal point precision to make EXACT x==x values unlikely, it doesn't delete



window.onmouseup=(e)=>{
    if (overlayActive){return};
    
    if (activePoint===null){
        let decimalPrecision=2;
        // for adding new point with click

        if (e.clientX<referenceDiv.offsetLeft || e.clientX>(referenceDiv.clientWidth+referenceDiv.offsetLeft)){return};
        if (e.clientY<referenceDiv.offsetTop || e.clientY>(referenceDiv.clientHeight+referenceDiv.offsetTop)){return};
        // guarantee no point creation if mouse-release outside the graph window

        // ADD NEW POINT FROM CLICK. COPIED/ADAPTED FROM ADDBUTTON CODE ABOVE //
        let xSelected=`${((((e.clientX-referenceDiv.offsetLeft)/referenceDiv.clientWidth)*(maxX-minX))+minX).toFixed(decimalPrecision)}`;
        let ySelected=`${(((1-((e.clientY-referenceDiv.offsetTop)/referenceDiv.clientHeight))*(maxY-minY))+minY).toFixed(decimalPrecision)}`;

        //console.log(`creating new point from click (${xSelected},${ySelected})`);

        if (!sorted.length){
            sorted.push(["1",{data:[xSelected,ySelected],comment:""}]);
            refreshDataWindow();return;
        };// started with empty sorted

        if (+xSelected<(+sorted[0][1].data[0])){
            sorted.unshift([`${sorted[0][0]}`,{data:[xSelected,ySelected],comment:""}]);
            for (let i=1;i<sorted.length;i++){sorted[i][0]=`${+sorted[i][0]+1}`};
            refreshDataWindow();return;
        };// add element to beginning of sorted, update all 'lines' accordingly

        if (+xSelected>(+sorted[sorted.length-1][1].data[0])){
            sorted.push([`${+sorted[sorted.length-1][0]+1}`,{data:[xSelected,ySelected],comment:""}]);
            refreshDataWindow();return;
        };// add element to end of sorted

        // test if added element can replace entry with same 'x', or should go inbetween 2 entries
        for (let i=0;i<sorted.length;i++){
            let xTested=sorted[i][1].data[0];
            if (xTested===xSelected){sorted[i][1].data[1]=ySelected;refreshDataWindow();return};

            // 'inbetween' route
            if (sorted[i+1]!=undefined && +xSelected>+xTested && +xSelected<(+sorted[i+1][1].data[0])){
                sorted.push(sorted[sorted.length-1]);                           // duplicate last item
                for (let j=sorted.length-1;j>i+1;j--){sorted[j]=sorted[j-1]};   // move over items right of 'i' by 1

                for (let j=i+1;j<sorted.length;j++){
                    sorted[j][0]=`${+(sorted[j][0])+1}`;                        // increase 'line' of everything after 'i' by +1
                };
                sorted[i+1]=[`${+sorted[i+1][0]-1}`,{data:[xSelected,ySelected],comment:""}]; // insert new item
                refreshDataWindow();
                return;
            };
        };
        return;
        ////////////////////////////////////////////////////////////////////////
    };

    activePoint=null; // deactivates onmousemove
    return;
};


let gridXdivisions=5;
let gridYdivisions=5;
let gridColor="#FFFFFF";
let gridWidth=2;        // px
let gridLineOffset=10;  // px
let gridOpacity=5;     // percent

let gridDiv=document.createElement("div");
gridDiv.style.position="fixed";
gridDiv.style.pointerEvents="none";
gridDiv.style.userSelect="none";
gridDiv.style.zIndex="2";
gridDiv.style.width="100%";
gridDiv.style.height="100%";
gridDiv.style.opacity=`${gridOpacity}%`;
body.appendChild(gridDiv);

function makeGrid(){

    // clear
    while (gridDiv.childElementCount>0){gridDiv.children[0].remove()};

    // for grid text indicators
    let decimalPrecision=2;

    // vertical
    for (let i=1;i<gridXdivisions;i++){

        // LINES
        let gridLine=document.createElement("div");
        gridLine.style.position="absolute";
        gridLine.style.width=`${gridWidth}px`;
        gridLine.style.height=`${referenceDiv.clientHeight+gridLineOffset}px`;
        gridLine.style.top=`${referenceDiv.offsetTop-gridLineOffset}px`;
        gridLine.style.left=`${referenceDiv.offsetLeft+((referenceDiv.clientWidth/gridXdivisions)*i)}px`;
        gridLine.style.backgroundColor=`${gridColor}`;
        gridDiv.appendChild(gridLine);

        // NUMBERS
        let gridNumber=document.createElement("p");
        gridNumber.style.position="absolute";
        gridNumber.style.color="#FFFFFF";
        gridNumber.style.lineHeight="0";
        gridNumber.style.top=`${referenceDiv.offsetTop-(gridLineOffset*4)}px`;
        gridNumber.style.left=`${referenceDiv.offsetLeft+((referenceDiv.clientWidth/gridXdivisions)*i)-(gridLineOffset*2)}px`;
        gridNumber.innerText=`${((((maxX-minX)/gridXdivisions)*i)+minX).toFixed(decimalPrecision)}`;
        gridDiv.appendChild(gridNumber);
    };

    // horizontal
    for (let i=1;i<gridYdivisions;i++){

        // LINES
        let gridLine=document.createElement("div");
        gridLine.style.position="absolute";
        gridLine.style.height=`${gridWidth}px`;
        gridLine.style.width=`${referenceDiv.clientWidth+gridLineOffset}px`;
        gridLine.style.left=`${referenceDiv.offsetLeft}px`;
        gridLine.style.top=`${referenceDiv.offsetTop+((referenceDiv.clientHeight/gridYdivisions)*i)}px`;
        gridLine.style.backgroundColor=`${gridColor}`;
        gridDiv.appendChild(gridLine);

        // NUMBERS
        let gridNumber=document.createElement("p");
        gridNumber.style.position="absolute";
        gridNumber.style.color="#FFFFFF";
        gridNumber.style.lineHeight="0";
        gridNumber.style.fontSize="1vw";
        gridNumber.style.left=`${referenceDiv.offsetLeft+referenceDiv.clientWidth+(gridLineOffset*2)}px`;
        gridNumber.style.top=`${(referenceDiv.offsetTop+referenceDiv.clientHeight-((referenceDiv.clientHeight/gridYdivisions)*i))-(gridLineOffset*1.5)}px`;
        gridNumber.innerText=`${((((maxY-minY)/gridYdivisions)*i)+minY).toFixed(decimalPrecision)}`;
        gridDiv.appendChild(gridNumber);
    };
    return;
};
makeGrid();

let gridXdivisionsControl=document.createElement("input");
gridXdivisionsControl.type="number";
gridXdivisionsControl.min=1;
gridXdivisionsControl.max=20;
gridXdivisionsControl.value=gridXdivisions;
gridXdivisionsControl.style.position="absolute";
gridXdivisionsControl.style.top="34.5vw";
gridXdivisionsControl.style.left="2vw";
gridXdivisionsControl.style.width="2vw";
gridXdivisionsControl.style.height="1.5vw";
gridXdivisionsControl.style.border="0";
gridXdivisionsControl.style.borderRadius="2px";


let gridYdivisionsControl=document.createElement("input");
gridYdivisionsControl.type="number";
gridYdivisionsControl.min=1;
gridYdivisionsControl.max=20;
gridYdivisionsControl.value=gridYdivisions;
gridYdivisionsControl.style.position="absolute";
gridYdivisionsControl.style.top="34.5vw";
gridYdivisionsControl.style.left="7vw";
gridYdivisionsControl.style.width="2vw";
gridYdivisionsControl.style.height="1.5vw";
gridYdivisionsControl.style.border="0";
gridYdivisionsControl.style.borderRadius="2px";

gridXdivisionsControl.onchange=()=>{gridXdivisions=+gridXdivisionsControl.value;makeGrid();return};
gridYdivisionsControl.onchange=()=>{gridYdivisions=+gridYdivisionsControl.value;makeGrid();return};

body.appendChild(gridXdivisionsControl);
body.appendChild(gridYdivisionsControl);

let gridDivisionsLabel=document.createElement("p");
gridDivisionsLabel.innerText="Grid Divisions";
gridDivisionsLabel.style.position="absolute";
gridDivisionsLabel.style.color="#FFFFFF";
gridDivisionsLabel.style.top="32vw";
gridDivisionsLabel.style.left="2.5vw";

body.appendChild(gridDivisionsLabel);


let gridOpacityControl=document.createElement("input");
gridOpacityControl.type="range";
gridOpacityControl.min=0;
gridOpacityControl.max=100;
gridOpacityControl.step=1;
gridOpacityControl.value=gridOpacity;
gridOpacityControl.style.position="absolute";
gridOpacityControl.style.top="38vw";
gridOpacityControl.style.left="3vw";
gridOpacityControl.style.width="5vw";

gridOpacityControl.oninput=()=>{gridOpacity=gridOpacityControl.value;gridDiv.style.opacity=`${gridOpacity}%`;return};

body.appendChild(gridOpacityControl);

let gridOpacityControlLabel=document.createElement("p");
gridOpacityControlLabel.innerText="Grid Opacity";
gridOpacityControlLabel.style.position="absolute";
gridOpacityControlLabel.style.top="36vw";
gridOpacityControlLabel.style.left="2.5vw";
gridOpacityControlLabel.style.color="#FFFFFF";

body.appendChild(gridOpacityControlLabel);

let gridColorControl=document.createElement("input");
gridColorControl.type="color";
gridColorControl.style.position="absolute";
gridColorControl.style.top="41vw";
gridColorControl.style.left="7vw";
gridColorControl.style.width="2vw";
gridColorControl.style.border="0";
gridColorControl.style.borderRadius="2px";
gridColorControl.value=gridColor;

gridColorControl.oninput=()=>{gridColor=gridColorControl.value;makeGrid();return};

body.appendChild(gridColorControl);

let gridColorControlLabel=document.createElement("p");
gridColorControlLabel.innerText="Grid";
gridColorControlLabel.style.color="#FFFFFF";
gridColorControlLabel.style.position="absolute";
gridColorControlLabel.style.top="38.5vw";
gridColorControlLabel.style.left="7vw";

body.appendChild(gridColorControlLabel);

/////////////////////////////////////////////////////////
let overlayActive=false;
let commentX=null; // or num

let overlay=document.createElement("div");
overlay.style.zIndex=98;
overlay.style.position="fixed";
overlay.style.width="100%";
overlay.style.height="100%";
overlay.style.backdropFilter="blur(20px";
overlay.style.transition="linear 0.2s";
overlay.style.cursor="pointer";
overlay.style.opacity="0";
overlay.style.pointerEvents="none";

let overlayX=document.createElement("p");
overlayX.innerText="Close";
overlayX.style.position="fixed";
overlayX.style.top="39%";
overlayX.style.color="#FFFFFF";
overlayX.style.left="85%";
overlayX.style.cursor="pointer";

let commentDiv=document.createElement("div");
commentDiv.style.zIndex=99;
commentDiv.style.position="fixed";
commentDiv.style.left="10%";
commentDiv.style.top="40%";
commentDiv.style.width="80%";
commentDiv.style.height="20%";
commentDiv.style.backgroundColor="#080808";
commentDiv.style.borderRadius="20px";
commentDiv.style.opacity="0";
commentDiv.style.pointerEvents="none";
commentDiv.style.transition="linear 0.2s";

let commentDescription=document.createElement("p");
commentDescription.style.position="absolute";
commentDescription.style.top="50%";
commentDescription.style.left="40%";
commentDescription.style.color="#FFFFFF";
commentDescription.innerText="Comment for point (x,y)";

let commentInput=document.createElement("input");
commentInput.style.position="relative";
commentInput.style.top="20%";
commentInput.style.left="5%";
commentInput.type="text";
commentInput.style.color="#000000";
commentInput.style.fontFamily="serif";
commentInput.style.lineHeight="1";
commentInput.style.width="90%";
commentInput.style.height="10%";

function openOverlay(){
    overlayActive=true;
    overlay.style.opacity="1";
    overlay.style.pointerEvents="all";
    commentDiv.style.opacity="1";
    commentDiv.style.pointerEvents="all";

    return;
}
function closeOverlay(){
    overlayActive=false;
    overlay.style.opacity="0";
    overlay.style.pointerEvents="none";
    commentDiv.style.opacity="0";
    commentDiv.style.pointerEvents="none";
    return;
}

commentInput.oninput=()=>{
    if (commentX===null){return};
    for (let i=0;i<sorted.length;i++){
        if (!sorted[i][1].data[0].length){continue};
        if (+sorted[i][1].data[0]===commentX){sorted[i][1].comment=commentInput.value;break};
    };
    return;
};

function loadComment(commentX){
    if (commentX===null){return};
    for (let i=0;i<sorted.length;i++){
        if (!sorted[i][1].data[0].length){continue};
        if (+sorted[i][1].data[0]===commentX){commentInput.value=sorted[i][1].comment;break};
    };
    return;
};


overlay.onmousedown=()=>{closeOverlay();return};
overlayX.onmousedown=()=>{closeOverlay();return};

commentDiv.appendChild(commentInput);
commentDiv.appendChild(commentDescription);
commentDiv.appendChild(overlayX)

body.append(commentDiv);
body.append(overlay);



function parseLUT(fileArrayBuffer){
    if (fileArrayBuffer.constructor.name!="ArrayBuffer"){throw Error(`Input for parseLUT must be an ArrayBuffer.`)}
    let uint=new Uint8Array(fileArrayBuffer);
    let char="";
    let expectingKey=true;      let readingKey=false;
    let expectingSeparator=false;
    let expectingNewLine=false;
    let expectingValue=false;   let readingValue=false;
    let hasDot=false;
    let key="";     let value="";   let comment="";
    let lines={};
    let line=1;

    for (let i=0;i<uint.length;i++){    // PARSING CHARS
        char=String.fromCharCode(uint[i]);

        if (expectingKey){
            // tab, space, \n, \r\n
            if (uint[i]===9 || uint[i]===32 || uint[i]===10 || (uint[i]===13 && uint[i+1]===10)){
                if (uint[i]===13){i++};
                if (uint[i]===10){line++};
                continue;
            };
            // ;
            if (uint[i]===59){
                i++;
                while (uint[i]!=10){
                    if (uint[i]===13){i++;continue};
                    if (i===uint.length){break};
                    comment+=String.fromCharCode(uint[i]);
                    i++;
                };
                lines[line]={data:[key,value],comment:comment};
                key="";value="";comment="";
                line++;
                continue;
            };
            // DIGITS
            if (uint[i]>47 && uint[i]<58){
                expectingKey=false;
                readingKey=true;
                key+=char;
                continue;
            };
            throw Error(`BAD SYNTAX ON LINE ${line}: FOUND CHAR ${char} WHILE EXPECTING NUMBER, SPACE, TAB, NEWLINE OR COMMENT (expectingKey)`);
        };
        if (readingKey){
            // DIGITS or DOT
            if (uint[i]>47 && uint[i]<58 || uint[i]===46){
                if (uint[i]===46){
                    if (i===uint.length-1 || uint[i+1]<48 || uint[i+1]>57){throw Error(`BAD SYNTAX ON LINE ${line}: FOUND A DOT WITHOUT FOLLOW-UP DIGIT (readingKey)`)};
                    if (hasDot===true){throw Error(`BAD SYNTAX ON LINE ${line}, i=${i}: FOUND DOT MORE THAN ONCE (readingKey)`)};
                    hasDot=true;
                };
                key+=char;
                continue;
            };
            // tab, space, |
            if (uint[i]===9 || uint[i]===32 || uint[i]===124){
                readingKey=false;
                hasDot=false;
                if (uint[i]===124){expectingValue=true} else {expectingSeparator=true};
                continue;
            };
            throw Error(`BAD SYNTAX ON LINE ${line}: FOUND CHAR ${char} WHILE EXPECTING NUMBER/SPACE/TAB (readingKey)`);
        };
        if (expectingSeparator){
            // tab, space
            if (uint[i]===9 || uint[i]===32){
                continue;
            };
            // |
            if (uint[i]===124){
                expectingSeparator=false;
                expectingValue=true;
                continue;
            };
            throw Error(`BAD SYNTAX ON LINE ${line}: FOUND CHAR ${char} WHILE AWAITING "|", SPACE OR TAB (expectingSeparator)`);
        };
        if (expectingValue){
            // tab, space
            if (uint[i]===9 || uint[i]===32){
                continue;
            };
            // digits
            if (uint[i]>47 && uint[i]<58){
                expectingValue=false;
                readingValue=true;
                value+=char;
                continue;
            };
            throw Error(`BAD SYNTAX ON LINE ${line}: FOUND CHAR ${char} WHILE EXPECTING NUMBER, SPACE OR TAB(readingValue)`);
        };
        if (readingValue){
            // digits or dot
            if (uint[i]>47 && uint[i]<58 || uint[i]===46){
                if (uint[i]===46){
                    if (i===uint.length-1 || uint[i+1]<48 || uint[i+1]>57){throw Error(`BAD SYNTAX ON LINE ${line}: FOUND A DOT WITHOUT FOLLOW-UP DIGIT (readingValue)`)};
                    if (hasDot===true){throw Error(`BAD SYNTAX ON LINE ${line}, i=${i}: FOUND DOT MORE THAN ONCE (readingValue)`)}
                    hasDot=true;
                };
                value+=char;
                if (i+1===uint.length){lines[line]={data:[key,value],comment:comment}};
                continue;
            };
            // tab, space
            if (uint[i]===9 || uint[i]===32){
                readingValue=false;
                hasDot=false;
                expectingNewLine=true;
                if (i+1===uint.length){lines[line]={data:[key,value],comment:comment}};
                continue;
            };
            // ;
            if (uint[i]===59){
                i++;
                readingValue=false;
                hasDot=false;
                while (uint[i]!=10){
                    if (uint[i]===13){i++;continue};
                    if (i===uint.length){break};
                    comment+=String.fromCharCode(uint[i]);
                    i++;
                };
                lines[line]={data:[key,value],comment:comment};
                key="";value="";comment="";
                line++;
                expectingKey=true;
                continue;
            };
            // \n, \r\n
            if (uint[i]===10 || (uint[i]===13 && uint[i+1]===10)){
                if (uint[i]===13){i++};
                readingValue=false;
                hasDot=false;
                lines[line]={data:[key,value],comment:comment}; // comment will always be "" here.. ?
                key="";value="";comment="";
                line++;
                expectingKey=true;
                continue;
            };
            throw Error(`BAD SYNTAX ON LINE ${line}: FOUND CHAR ${char} WHILE EXPECTING NUMBER, TAB, SPACE, NEWLINE OR COMMENT (readingValue)`);
        };
        if (expectingNewLine){
            if (uint[i]===9 || uint[i]==32){
                continue;
            };
            // ;
            if (uint[i]===59){
                i++;
                while (uint[i]!=10){
                    if (uint[i]===13){i++;continue};
                    if (i===uint.length){break};
                    comment+=String.fromCharCode(uint[i]);
                    i++;
                };
                expectingNewLine=false;
                lines[line]={data:[key,value],comment:comment};
                key="";value="";comment="";
                line++;
                expectingKey=true;
                continue;
            };
            throw Error(`BAD SYNTAX ON LINE ${line}: FOUND CHAR ${char} WHILE EXPECTING NEWLINE (expectingNewLine)`);
        };

    };
    return lines;
};



let xValuesForCurve=[]; // helper arrays with coordinate data from 'sorted'
let yValuesForCurve=[];

function populateCurveValues(){
    xValuesForCurve.length=0;
    yValuesForCurve.length=0;

    for (let i=0;i<sorted.length;i++){
        if (!sorted[i][1].data[0].length){continue};
        xValuesForCurve.push(+sorted[i][1].data[0]);
        yValuesForCurve.push(+sorted[i][1].data[1]);
    };
    return;
};

function giveSplineSegmentValues(i){ // in this scenario, desiring spline between i and i+1
    let x=xValuesForCurve; // lut values
    let y=yValuesForCurve; // array reference

    // basically 1-indexed, so x1,y1,t1 are the values for 'current' left point (i)
    let x0=x[i-1] || x[i]-(x[i+1]-x[i]);    // if no x[i-1], make it diametrically opposed to x[i+1],
    let x1= x[i];                           // which makes curves 'straight' regardless of point coordinates if there are only 2 points
    let x2= x[i+1];
    let x3=x[i+2] || x[i+1];
    
    let y0= y[i-1] || y[i]-(y[i+1]-y[i]);   // same for y[i-1]
    let y1= y[i];
    let y2= y[i+1];
    let y3= y[i+2] || y[i+1];

    let distance1=Math.sqrt(Math.pow(x1-x0,2)+Math.pow(y1-y0,2));   // p1 - p0 = (x1,y1) - (x0,y0) = sqrt( (x1-x0)^2 + (y1-y0)^2 )
    let distance2=Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));   // p2 - p1 = (x2,y2) - (x1,y1) = sqrt( (x2-x1)^2 + (y2-y1)^2 )
    let distance3=Math.sqrt(Math.pow(x3-x2,2)+Math.pow(y3-y2,2));   // p3 - p2 = (x3,y3) - (x2,y2) = sqrt( (x3-x2)^2 + (y3-y2)^2 )
    // pythagorean theorem

    let alpha=0.5; // depends on Catmull-Rom type. centripetal is 0.5, other usual values are 0 or 1
    let t0=0;
    let t1=Math.pow(distance1,alpha) + t0;
    let t2=Math.pow(distance2,alpha) + t1;
    let t3=Math.pow(distance3,alpha) + t2;

    let m1= (t2-t1)*(((y1-y0)/(t1-t0))-((y2-y0)/(t2-t0))+((y2-y1)/(t2-t1)));
    let m2= (t2-t1)*(((y2-y1)/(t2-t1))-((y3-y1)/(t3-t1))+((y3-y2)/(t3-t2)));

    if (isNaN(m1)){m1=0;/*console.log(`giveSplineSegmentValues(${i}) gave initial NaN for m1:\nx0 ${x0} | x1 ${x1} | x2 ${x2} | x3 ${x3}\ny0 ${y0} | y1 ${y1} | y2 ${y2} | y3 ${y3}\nt0 ${t0} | t1 ${t1} | t2 ${t2} | t3 ${t3}`)*/};
    if (isNaN(m2)){m2=0;/*console.log(`giveSplineSegmentValues(${i}) gave initial NaN for m2:\nx0 ${x0} | x1 ${x1} | x2 ${x2} | x3 ${x3}\ny0 ${y0} | y1 ${y1} | y2 ${y2} | y3 ${y3}\nt0 ${t0} | t1 ${t1} | t2 ${t2} | t3 ${t3}`)*/};

    let  a= (2*y1)-(2*y2)+m1+m2;
    let  b= (-3*y1)+(3*y2)-(2*m1)-m2;
    let  c= m1;
    let  d= y1;

    //console.log(`giveSplineSegmentValues(${i}) called:\nx0 = ${x0} | x1 = ${x1} | x2 = ${x2} | x3 = ${x3}\nt0 = ${t0} | t1 = ${t1} | t2 = ${t2} | t3 = ${t3}\nm1 = ${m1} | m2= ${m2}\na = ${a} | b = ${b} | c = ${c} | d = ${d}`);
    return [a,b,c,d];
};

// these comments are actually a bit wrong because i wasnt sure whether to use x, y or t (or some combo of them (vector multiplication etc))
// whenever the source says P, but actually it turns out you want y. final code above is written correctly

// p(t) = a*t^3 + b*t^2 + c*t + d
// p(0) = left point
// p(1) = right point
// t is x between point 1 and 2 expressed between 0 and 1
// t is non-linear because of alpha between 0 and 1 (centripetal alpha=0.5)
// t[0] = 0
// alpha = 0.5
// t[i] = t[i-1]+ Math.pow(Math.abs(x[i]-x[i-1]),alpha)

// a = 2*x[i] - 2*x[i+1] + m1 + m2
// b = -3*x[i] + 3*x[i+1] - 2*m1 - m2
// c = m1
// d = x[i]
// m1 = (t[i+1]-t[i])*(((x[i]-x[i-1])/(t[i]-t[i-1]))-((x[i+1]-x[i-1])/(t[i+1]-t[i-1]))+((x[i+1]-x[i])/(t[i+1]-t[i])))
// m2 = (t[i+1]-t[i])*(((x[i+1]-x[i])/(t[i+1]-t[i]))-((x[i+2]-x[i])/(t[i+2]-t[i]))+((x[i+2]-x[i+1])/(t[i+2]-t[i+1])))


// https://en.wikipedia.org/wiki/Centripetal_Catmull%E2%80%93Rom_spline
// https://qroph.github.io/2018/07/30/smooth-paths-using-catmull-rom-splines.html


function drawSplineGraph(){

    populateCurveValues();
    context.clearRect(0, 0, canvas.width, canvas.height);   // reset drawn curves
    let a=0;let b=0;let c=0;let d=0;
    let x=0;let y=0;let t=0;
    let xCoordinate=0;
    let xCoordinateLast=0;
    let yCoordinate=0;
    let nextY=0; // for sparseness test

    for (let i=0;i<xValuesForCurve.length-1;i++){
        [a,b,c,d]=giveSplineSegmentValues(i);
        //console.warn(`NEW SPLINE: i = ${i} | Values a = ${a} | b = ${b} | c = ${c} | d = ${d}`);
        
        xCoordinate=    Math.trunc(referenceDiv.clientWidth*((xValuesForCurve[i  ]-minX)/(maxX-minX))); // pixels
        xCoordinateLast=Math.trunc(referenceDiv.clientWidth*((xValuesForCurve[i+1]-minX)/(maxX-minX)));

        for (xCoordinate;xCoordinate<xCoordinateLast;xCoordinate++){
            
            x= ((xCoordinate/referenceDiv.clientWidth)*(maxX-minX))+minX // back into LUT x // TESTED: correct..ish? at least

            t= (x-xValuesForCurve[i])/(xValuesForCurve[i+1]-xValuesForCurve[i]); // 0 to 1
            
            y= (a*t*t*t) + (b*t*t) + (c*t) + d;
            
            yCoordinate=referenceDiv.clientHeight-Math.trunc(referenceDiv.clientHeight*((y-minY)/(maxY-minY))); // TESTED: y to yCoordinate algo is correct
            //console.log(`xCoordinate : ${xCoordinate} | yCoordinate : ${yCoordinate}`);
            //console.log(`draw at points (LUT units) (${x}, ${y}) | t = ${t}`);

            context.beginPath();
            context.arc(xCoordinate,yCoordinate,curveWidth,0,2*Math.PI);
            context.fillStyle=curveColor;
            context.fill();

            // SPARSENESS TEST ////////////////////////////////////////////////////////////////////////////////
            // sparseness test will determine if the curve is so steep that it would create gaps in the curve if only tested
            // once per x-pixel, and duplicates the current value closer to the next value until they are close enough
            x=(((xCoordinate+1)/referenceDiv.clientWidth)*(maxX-minX))+minX;
            t=(x-xValuesForCurve[i])/(xValuesForCurve[i+1]-xValuesForCurve[i]);
            y= (a*t*t*t) + (b*t*t) + (c*t) + d;
            nextY=referenceDiv.clientHeight-Math.trunc(referenceDiv.clientHeight*((y-minY)/(maxY-minY)));

            if (nextY<yCoordinate){ // if nextY smaller = graph goes up
                while (yCoordinate-nextY>curveWidth){
                    //console.log(`Sparseness Test i = ${i}: going UP | yCoordinate - nextY | ${yCoordinate} - ${nextY} > ${curveWidth}`);
                    yCoordinate-=curveWidth;
                    context.beginPath();
                    context.arc(xCoordinate,yCoordinate,curveWidth,0,2*Math.PI);
                    context.fillStyle=curveColor;
                    context.fill();
                };
            }
            else if (nextY>yCoordinate){ // if nextY bigger = graph goes down
                while (nextY-yCoordinate>curveWidth){
                    //console.log(`Sparseness Test i = ${i}: going DOWN | nextY - yCoordinate | ${nextY} - ${yCoordinate} > ${curveWidth}`);
                    yCoordinate+=curveWidth;
                    context.beginPath();
                    context.arc(xCoordinate,yCoordinate,curveWidth,0,2*Math.PI);
                    context.fillStyle=curveColor;
                    context.fill();
                };
            };
            // SPARSENESS TEST END ///////////////////////////////////////////////////////////////////////////
        };
    };
    return;
}

function drawLinearGraph(){
    populateCurveValues();
    context.clearRect(0, 0, canvas.width, canvas.height);   // reset drawn curves

    let xCoordinate=0;let xCoordinateLast=0;
    let yCoordinate=0;
    let x=0;let y=0;let t=0;let distance=0;

    for (let i=0;i<xValuesForCurve.length-1;i++){
        xCoordinate=    Math.trunc(referenceDiv.clientWidth*((xValuesForCurve[i  ]-minX)/(maxX-minX)));
        xCoordinateLast=Math.trunc(referenceDiv.clientWidth*((xValuesForCurve[i+1]-minX)/(maxX-minX)));
        distance=yValuesForCurve[i+1]-yValuesForCurve[i];
        
        for (xCoordinate;xCoordinate<xCoordinateLast;xCoordinate++){
            x= ((xCoordinate/referenceDiv.clientWidth)*(maxX-minX))+minX // back into LUT x

            t= (x-xValuesForCurve[i])/(xValuesForCurve[i+1]-xValuesForCurve[i]); // 0 to 1

            y=yValuesForCurve[i]+(distance*t);

            //console.log(`x = ${x} | t = ${t} | distance = ${distance} | y = ${y} | xCoordinate = ${xCoordinate} | xCoordinateLast = ${xCoordinateLast}`);
            yCoordinate=referenceDiv.clientHeight-Math.trunc(referenceDiv.clientHeight*((y-minY)/(maxY-minY)));
            context.beginPath();
            context.arc(xCoordinate,yCoordinate,curveWidth,0,2*Math.PI);
            context.fillStyle=curveColor;
            context.fill();

            // SPARSENESS TEST ////////////////////////////////////////////////////////////////////////////////
            x=(((xCoordinate+1)/referenceDiv.clientWidth)*(maxX-minX))+minX;
            t=(x-xValuesForCurve[i])/(xValuesForCurve[i+1]-xValuesForCurve[i]);
            y=yValuesForCurve[i]+(distance*t);
            nextY=referenceDiv.clientHeight-Math.trunc(referenceDiv.clientHeight*((y-minY)/(maxY-minY)));

            if (nextY<yCoordinate){ // if nextY smaller = graph goes up
                while (yCoordinate-nextY>curveWidth){
                    //console.log(`Sparseness Test i = ${i}: going UP | yCoordinate - nextY | ${yCoordinate} - ${nextY} > ${curveWidth}`);
                    yCoordinate-=curveWidth;
                    context.beginPath();
                    context.arc(xCoordinate,yCoordinate,curveWidth,0,2*Math.PI);
                    context.fillStyle=curveColor;
                    context.fill();
                };
            }
            else if (nextY>yCoordinate){ // if nextY bigger = graph goes down
                while (nextY-yCoordinate>curveWidth){
                    //console.log(`Sparseness Test i = ${i}: going DOWN | nextY - yCoordinate | ${nextY} - ${yCoordinate} > ${curveWidth}`);
                    yCoordinate+=curveWidth;
                    context.beginPath();
                    context.arc(xCoordinate,yCoordinate,curveWidth,0,2*Math.PI);
                    context.fillStyle=curveColor;
                    context.fill();
                };
            };
            // SPARSENESS TEST END ///////////////////////////////////////////////////////////////////////////
        };
    };
    return;
};

let graphMode=1; // 0 = none, 1 = catmull, 2 = linear
function drawGraphHandler(){
    if (graphMode===0){context.clearRect(0, 0, canvas.width, canvas.height)};
    if (graphMode===1){drawSplineGraph()};
    if (graphMode===2){drawLinearGraph()};
    return;
};

let graphModeLabel=document.createElement("p");
graphModeLabel.innerText="Visual Interpolation:";
let graphMode0Button=document.createElement("button");
let graphMode1Button=document.createElement("button");
let graphMode2Button=document.createElement("button");
graphModeLabel.style.position="absolute";
graphMode0Button.style.position="absolute";
graphMode1Button.style.position="absolute";
graphMode2Button.style.position="absolute";
graphModeLabel.style.top="6.5vw";
graphModeLabel.style.lineHeight="0";
graphMode0Button.style.top="9vw";
graphMode1Button.style.top="11vw";
graphMode2Button.style.top="13vw";

graphModeLabel.style.left="0.8vw";
graphMode0Button.style.left="6.6vw";
graphMode1Button.style.left="6.5vw";
graphMode2Button.style.left="6.4vw";

graphMode0Button.style.border="0";
graphMode1Button.style.border="0";
graphMode2Button.style.border="0";

graphMode0Button.style.borderRadius="2px";
graphMode1Button.style.borderRadius="2px";
graphMode2Button.style.borderRadius="2px";

graphModeLabel.style.fontSize="1.1vw";
graphMode0Button.style.fontSize="1vw";
graphMode1Button.style.fontSize="1vw";
graphMode2Button.style.fontSize="1vw";

graphMode0Button.innerText="None";
graphMode1Button.innerText="Cubic";
graphMode2Button.innerText="Linear";

graphModeLabel.style.color="#FFFFFF";

graphMode0Button.style.backgroundColor="#808080";
graphMode1Button.style.backgroundColor="#FFFFFF";
graphMode2Button.style.backgroundColor="#808080";

graphMode0Button.onmousedown=()=>{graphMode=0;drawGraphHandler();graphMode0Button.style.backgroundColor="#FFFFFF";graphMode1Button.style.backgroundColor="#808080";graphMode2Button.style.backgroundColor="#808080";return};
graphMode1Button.onmousedown=()=>{graphMode=1;drawGraphHandler();graphMode0Button.style.backgroundColor="#808080";graphMode1Button.style.backgroundColor="#FFFFFF";graphMode2Button.style.backgroundColor="#808080";return};
graphMode2Button.onmousedown=()=>{graphMode=2;drawGraphHandler();graphMode0Button.style.backgroundColor="#808080";graphMode1Button.style.backgroundColor="#808080";graphMode2Button.style.backgroundColor="#FFFFFF";return};

body.appendChild(graphModeLabel);body.appendChild(graphMode0Button);body.appendChild(graphMode1Button);body.appendChild(graphMode2Button);




function writeLUT(){
    let MAX_SIZE=1073741824;    // 1GB
    let byteCount=0;            // to clamp later

    let uint=new Uint8Array(1073741824);
    let x="";
    let y="";
    let comment="";
    let j=0;

    for (let i=0;i<sorted.length;i++){
        x=sorted[i][1].data[0];
        y=sorted[i][1].data[1];
        comment=sorted[i][1].comment;
        j=0;

        while (j<x.length){
            uint[byteCount]=x.charCodeAt(j);
            byteCount++;
            j++;
        };

        if (j!=0){
            j=0;
            uint[byteCount  ]=9;    // \t
            uint[byteCount+1]=124;  // |
            uint[byteCount+2]=9;    // \t
            byteCount+=3;
        };

        while (j<y.length){
            uint[byteCount]=y.charCodeAt(j);
            byteCount++;
            j++;
        };

        if (comment.length){
            j=0;
            if (y.length){uint[byteCount]=9;byteCount++};     // \t
            uint[byteCount]=59;     // ;
            byteCount++;

            while (j<comment.length){
                uint[byteCount]=comment.charCodeAt(j);
                byteCount++;
                j++;
            }
        };
        uint[byteCount]=10;     // \n
        byteCount++;
    };
    uint=uint.slice(0,byteCount); // clamp
    writeArrayBufferToFile(uint.buffer);
    return;
};

let saveButton=document.createElement("button");
saveButton.style.position="absolute";
saveButton.style.top="5vw";
saveButton.style.right="10vw";
saveButton.style.border="0";
saveButton.style.borderRadius="2px";
saveButton.style.fontSize="1.1vw";
saveButton.innerText="Save as LUT";

saveButton.onmousedown=()=>{
    if (sorted.length){writeLUT()};
    return;
};

body.appendChild(saveButton);