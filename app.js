/* ==========================================================
   HOTEL NETWORK DIAGRAM
   Engine V3
   Part 6A
========================================================== */

const svg = document.getElementById("diagram");
const viewport = document.getElementById("viewport");

const nodesLayer = document.getElementById("nodes");
const linksLayer = document.getElementById("links");

const SVGNS = "http://www.w3.org/2000/svg";

let selectedNode = null;
let dragging = null;

let offsetX = 0;
let offsetY = 0;

let selectedElement = null;

let linkMode=false;
let firstLinkNode=null;

let contextTarget=null;
let panMode=false;

let panStartX=0;

let panStartY=0;

let viewX=0;

let viewY=0;
const NODE_WIDTH = 90;
const NODE_HEIGHT = 90;

/* ==========================================================
   DATA
========================================================== */

const nodes = [

{
    id:"isp1",
    type:"cloud",
    text:"ISP-1",
    x:80,
    y:70
},

{
    id:"isp2",
    type:"cloud",
    text:"ISP-2",
    x:80,
    y:220
},

{
    id:"router",
    type:"router",
    text:"Firewall",
    x:250,
    y:170
},

{
    id:"core",
    type:"switch",
    text:"Core Switch",
    x:470,
    y:170
},

{
    id:"bo",
    type:"switch",
    text:"BO Switch",
    x:700,
    y:20
},

{
    id:"guest",
    type:"switch",
    text:"sw Guest",
    x:620,
    y:150
},

{
    id:"cctv",
    type:"switch",
    text:"sw CCTV",
    x:620,
    y:280
},

{
    id:"server1",
    type:"pc",
    text:"Server",
    x:900,
    y:20
},

{
    id:"nas1",
    type:"nas",
    text:"NAS",
    x:900,
    y:120
},

{
    id:"dvr1",
    type:"dvr",
    text:"DVR",
    x:900,
    y:220
},

{
    id:"pabx1",
    type:"pabx",
    text:"PABX",
    x:900,
    y:320
}

];

const links = [

["isp1","router"],
["isp2","router"],

["router","core"],

["core","bo"],
["core","guest"],
["core","cctv"],

["bo","server1"],
["bo","nas1"],
["bo","dvr1"],
["bo","pabx1"]

];

/* ==========================================================
   START
========================================================== */

render();

/* ==========================================================
   RENDER
========================================================== */

function render(){

    nodesLayer.innerHTML="";
    linksLayer.innerHTML="";

    drawLinks();

    nodes.forEach(drawNode);

}

/* ==========================================================
   DRAW NODE
========================================================== */

function drawNode(node){

    const g=document.createElementNS(SVGNS,"g");

    g.classList.add("node");
    g.dataset.id=node.id;

    g.setAttribute(
        "transform",
        `translate(${node.x},${node.y})`
    );

    //------------------------------------
    // Background
    //------------------------------------

    const circle=document.createElementNS(SVGNS,"circle");

    circle.setAttribute("cx",45);
    circle.setAttribute("cy",30);
    circle.setAttribute("r",26);

    circle.setAttribute("class","deviceIcon");

    g.appendChild(circle);

    //------------------------------------
    // ICON GROUP
    //------------------------------------

    const icon=document.createElementNS(SVGNS,"g");

    icon.setAttribute("stroke","#ffffff");
    icon.setAttribute("stroke-width","2");
    icon.setAttribute("fill","none");
    icon.setAttribute("stroke-linecap","round");
    icon.setAttribute("stroke-linejoin","round");

   if(node.type==="cloud"){
    drawCloud(icon);
}

if(node.type==="router"){
    drawRouter(icon);
}

if(node.type==="switch"){
    drawSwitch(icon);
}

    //------------------------------------
    // AP
    //------------------------------------

    if(node.type==="ap"){

        const c=document.createElementNS(SVGNS,"circle");

        c.setAttribute("cx",45);
        c.setAttribute("cy",31);
        c.setAttribute("r",4);

        icon.appendChild(c);

        [10,16,22].forEach(r=>{

            const arc=document.createElementNS(SVGNS,"path");

            arc.setAttribute(
                "d",
                `M${45-r} 31 A${r} ${r} 0 0 1 ${45+r} 31`
            );

            icon.appendChild(arc);

        });

    }
//------------------------------------
// PC
//------------------------------------

if(node.type==="pc"){

    const s=document.createElementNS(SVGNS,"rect");

    s.setAttribute("x",34);
    s.setAttribute("y",20);
    s.setAttribute("width",22);
    s.setAttribute("height",16);
    s.setAttribute("rx",2);

    icon.appendChild(s);

    const stand=document.createElementNS(SVGNS,"line");

    stand.setAttribute("x1",45);
    stand.setAttribute("y1",36);
    stand.setAttribute("x2",45);
    stand.setAttribute("y2",42);

    icon.appendChild(stand);

    const base=document.createElementNS(SVGNS,"line");

    base.setAttribute("x1",39);
    base.setAttribute("y1",42);
    base.setAttribute("x2",51);
    base.setAttribute("y2",42);

    icon.appendChild(base);

}

/*----------------------------------*/
// NAS
/*----------------------------------*/

if(node.type==="nas"){

    const body=document.createElementNS(SVGNS,"rect");

    body.setAttribute("x",36);
    body.setAttribute("y",18);
    body.setAttribute("width",18);
    body.setAttribute("height",24);
    body.setAttribute("rx",2);

    icon.appendChild(body);

    for(let i=0;i<3;i++){

        const d=document.createElementNS(SVGNS,"circle");

        d.setAttribute("cx",40);
        d.setAttribute("cy",24+i*6);
        d.setAttribute("r",1);

        d.setAttribute("fill","#ffffff");

        icon.appendChild(d);

    }

}

/*----------------------------------*/
// CAMERA
/*----------------------------------*/

if(node.type==="camera"){

    const body=document.createElementNS(SVGNS,"rect");

    body.setAttribute("x",34);
    body.setAttribute("y",26);
    body.setAttribute("width",18);
    body.setAttribute("height",8);

    icon.appendChild(body);

    const lens=document.createElementNS(SVGNS,"line");

    lens.setAttribute("x1",52);
    lens.setAttribute("y1",30);

    lens.setAttribute("x2",60);
    lens.setAttribute("y2",26);

    icon.appendChild(lens);

}

/*----------------------------------*/
// DVR
/*----------------------------------*/

if(node.type==="dvr"){

    const body=document.createElementNS(SVGNS,"rect");

    body.setAttribute("x",31);
    body.setAttribute("y",23);

    body.setAttribute("width",28);
    body.setAttribute("height",16);

    icon.appendChild(body);

    const h=document.createElementNS(SVGNS,"circle");

    h.setAttribute("cx",53);
    h.setAttribute("cy",31);

    h.setAttribute("r",2);

    h.setAttribute("fill","#ffffff");

    icon.appendChild(h);

}

/*----------------------------------*/
// PABX
/*----------------------------------*/

if(node.type==="pabx"){

    const body=document.createElementNS(SVGNS,"rect");

    body.setAttribute("x",34);
    body.setAttribute("y",20);

    body.setAttribute("width",22);
    body.setAttribute("height",20);

    icon.appendChild(body);

    const line=document.createElementNS(SVGNS,"line");

    line.setAttribute("x1",45);
    line.setAttribute("y1",20);

    line.setAttribute("x2",45);
    line.setAttribute("y2",40);

    icon.appendChild(line);

}
    //------------------------------------

    g.appendChild(icon);

    //------------------------------------

    const text=document.createElementNS(SVGNS,"text");

    text.setAttribute("x",45);
    text.setAttribute("y",80);

    text.setAttribute("text-anchor","middle");

    const lines=node.text.split("\n");

    if(lines.length===1){

        text.textContent=node.text;

    }else{

        lines.forEach((line,index)=>{

            const t=document.createElementNS(SVGNS,"tspan");

            t.setAttribute("x",45);

            t.setAttribute(
                "dy",
                index===0?"0":"1.2em"
            );

            t.textContent=line;

            text.appendChild(t);

        });

    }

    g.appendChild(text);

    g.addEventListener("mousedown",startDrag);

    g.addEventListener("click",function(e){

    selectedElement=g;

    selectNode(e);

});
g.addEventListener("contextmenu",function(e){

    e.preventDefault();

    contextTarget=node;

    contextMenu.style.display="block";

    contextMenu.style.left=e.pageX+"px";

    contextMenu.style.top=e.pageY+"px";

});
nodesLayer.appendChild(g);

}
function drawCloud(icon){

    const path=document.createElementNS(SVGNS,"path");

    path.setAttribute(
        "d",
        "M30 35 Q30 28 37 28 Q39 21 47 23 Q53 20 58 26 Q65 26 65 34 Q65 39 59 39 L36 39 Q30 39 30 35"
    );

    icon.appendChild(path);

}

function drawRouter(icon){

    const r=document.createElementNS(SVGNS,"rect");

    r.setAttribute("x",33);
    r.setAttribute("y",22);
    r.setAttribute("width",24);
    r.setAttribute("height",16);
    r.setAttribute("rx",3);

    icon.appendChild(r);

    for(let i=0;i<4;i++){

        const l=document.createElementNS(SVGNS,"line");

        l.setAttribute("x1",36+i*6);
        l.setAttribute("y1",41);

        l.setAttribute("x2",36+i*6);
        l.setAttribute("y2",46);

        icon.appendChild(l);

    }

}

function drawSwitch(icon){

    const r=document.createElementNS(SVGNS,"rect");

    r.setAttribute("x",31);
    r.setAttribute("y",24);

    r.setAttribute("width",28);
    r.setAttribute("height",14);

    icon.appendChild(r);

    for(let i=0;i<6;i++){

        const p=document.createElementNS(SVGNS,"line");

        p.setAttribute("x1",34+i*4);
        p.setAttribute("y1",28);

        p.setAttribute("x2",34+i*4);
        p.setAttribute("y2",34);

        icon.appendChild(p);

    }

}

/* ==========================================================
   DRAW LINKS
========================================================== */

function drawLinks(){

    links.forEach(link=>{

        const from=findCenter(link[0]);
        const to=findCenter(link[1]);

        // garis klik (tidak terlihat)
        const hit=document.createElementNS(SVGNS,"line");

        hit.setAttribute("x1",from.x);
        hit.setAttribute("y1",from.y);
        hit.setAttribute("x2",to.x);
        hit.setAttribute("y2",to.y);

        hit.setAttribute("stroke","transparent");
        hit.setAttribute("stroke-width","16");
        hit.style.pointerEvents="stroke";

        hit.dataset.from=link[0];
        hit.dataset.to=link[1];

        hit.addEventListener("click",function(e){

            e.stopPropagation();

            if(confirm("Hapus link ini?")){

                const idx=links.findIndex(l=>

                    l[0]===this.dataset.from &&
                    l[1]===this.dataset.to

                );

                if(idx>=0){

                    links.splice(idx,1);

                    render();

                }

            }

        });

        // garis yang terlihat
        const line=document.createElementNS(SVGNS,"line");

        line.classList.add("link");

        line.setAttribute("x1",from.x);
        line.setAttribute("y1",from.y);
        line.setAttribute("x2",to.x);
        line.setAttribute("y2",to.y);

        linksLayer.appendChild(hit);
        linksLayer.appendChild(line);

    });

}

/* ==========================================================
   FIND CENTER
========================================================== */

function findCenter(id){

    const n=nodes.find(x=>x.id===id);

    return{

        x:n.x+(NODE_WIDTH/2),
        y:n.y+32

    };

}

/* ==========================================================
   SELECT NODE
========================================================== */

function selectNode(e){

    document
        .querySelectorAll(".node")
        .forEach(n=>n.classList.remove("selected"));

    e.currentTarget.classList.add("selected");

    const id=e.currentTarget.dataset.id;

    selectedNode=nodes.find(x=>x.id===id);
if(linkMode){

    if(firstLinkNode==null){

        firstLinkNode=selectedNode;

        document.getElementById("statusBar").textContent=
        "LINK MODE : pilih device kedua";

        return;

    }

    if(firstLinkNode.id!==selectedNode.id){

        links.push([
            firstLinkNode.id,
            selectedNode.id
        ]);

    }

    firstLinkNode=null;

    linkMode=false;

    render();

    document.getElementById("statusBar").textContent="Ready";

    return;

}

    document.getElementById("propName").value=
        selectedNode.text;

    document.getElementById("propIP").value=
        selectedNode.ip || "";

    document.getElementById("propModel").value=
        selectedNode.model || "";

    document.getElementById("propLocation").value=
        selectedNode.location || "";

    document.getElementById("propNotes").value=
        selectedNode.notes || "";

}

/* ==========================================================
   UPDATE PROPERTY
========================================================== */

document
.getElementById("btnUpdate")
.onclick=function(){

    if(!selectedNode) return;

    selectedNode.text=
        document.getElementById("propName").value;

    selectedNode.ip=
        document.getElementById("propIP").value;

    selectedNode.model=
        document.getElementById("propModel").value;

    selectedNode.location=
        document.getElementById("propLocation").value;

    selectedNode.notes=
        document.getElementById("propNotes").value;

    render();

};
/* ==========================================================
   DRAG ENGINE
========================================================== */
svg.addEventListener("mousedown",function(e){

    if(e.button!==2) return;

    panMode=true;

    panStartX=e.clientX-viewX;

    panStartY=e.clientY-viewY;

});
function startDrag(e){

    dragging=e.currentTarget;

    const id=dragging.dataset.id;

    selectedNode=nodes.find(n=>n.id===id);

    const pt=svg.createSVGPoint();

    pt.x=e.clientX;
    pt.y=e.clientY;

    const p = pt.matrixTransform(
    viewport.getScreenCTM().inverse()

    );

    offsetX=p.x-selectedNode.x;
    offsetY=p.y-selectedNode.y;

}
svg.addEventListener("contextmenu",function(e){

    if(panMode){

        e.preventDefault();

    }

});
svg.addEventListener("mousemove",function(e){

    if(panMode){

    viewX=e.clientX-panStartX;

    viewY=e.clientY-panStartY;

    updateView();

    return;

}

if(!dragging) return;
    const pt=svg.createSVGPoint();

    pt.x=e.clientX;
    pt.y=e.clientY;

    const p = pt.matrixTransform(
    viewport.getScreenCTM().inverse()

    );

    selectedNode.x=p.x-offsetX;
    selectedNode.y=p.y-offsetY;

    dragging.setAttribute(
        "transform",
        `translate(${selectedNode.x},${selectedNode.y})`
    );

    drawLinksOnly();

});

window.addEventListener("mouseup",function(){

    panMode=false;

    dragging=null;

});

/* ==========================================================
   REDRAW LINKS ONLY
========================================================== */

function drawLinksOnly(){

    linksLayer.innerHTML="";

    links.forEach(link=>{

        const from=findCenter(link[0]);
        const to=findCenter(link[1]);

        const hit=document.createElementNS(SVGNS,"line");

        hit.setAttribute("x1",from.x);
        hit.setAttribute("y1",from.y);
        hit.setAttribute("x2",to.x);
        hit.setAttribute("y2",to.y);

        hit.setAttribute("stroke","transparent");
        hit.setAttribute("stroke-width","16");
        hit.style.pointerEvents="stroke";

        hit.dataset.from=link[0];
        hit.dataset.to=link[1];

        hit.addEventListener("click",function(e){

            e.stopPropagation();

            if(confirm("Hapus link ini?")){

                const idx=links.findIndex(l=>

                    l[0]===this.dataset.from &&
                    l[1]===this.dataset.to

                );

                if(idx>=0){

                    links.splice(idx,1);

                    render();

                }

            }

        });

        const line=document.createElementNS(SVGNS,"line");

        line.classList.add("link");

        line.setAttribute("x1",from.x);
        line.setAttribute("y1",from.y);
        line.setAttribute("x2",to.x);
        line.setAttribute("y2",to.y);

        linksLayer.appendChild(hit);
        linksLayer.appendChild(line);

    });

}
/* ==========================================================
   ZOOM ENGINE
========================================================== */

let zoom = 1;
function updateView(){

    viewport.setAttribute(
        "transform",
        `translate(${viewX},${viewY}) scale(${zoom})`
    );

}


document.addEventListener("wheel",function(e){

    if(!e.ctrlKey) return;

    e.preventDefault();

    if(e.deltaY<0){

        zoom*=1.1;

    }else{

        zoom/=1.1;

    }

    if(zoom<0.3) zoom=0.3;
    if(zoom>4) zoom=4;

    updateView();

},{passive:false});


/* ==========================================================
   SAVE LAYOUT
========================================================== */

function createLayoutData(){

    return{

        nodes:nodes.map(node=>({

            id:node.id,
            type:node.type,
            text:node.text,
            ip:node.ip || "",
            model:node.model || "",
            location:node.location || "",
            notes:node.notes || "",
            x:node.x,
            y:node.y

        })),

        links:links.map(link=>[
            link[0],
            link[1]
        ]),

        zoom:zoom,
        viewX:viewX,
        viewY:viewY

    };

}

function saveLayout(){

    const data=createLayoutData();

    const blob=new Blob(
        [JSON.stringify(data,null,4)],
        {type:"application/json"}
    );

    const url=URL.createObjectURL(blob);

    const a=document.createElement("a");

    a.href=url;
    a.download="hotel-network-diagram.json";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

}


/* ==========================================================
   LOAD LAYOUT
========================================================== */

function loadLayout(data){

    if(!data) return;

    const layout=JSON.parse(data);

    const loadedNodes=Array.isArray(layout) ? layout : layout.nodes;

    if(Array.isArray(loadedNodes)){

        nodes.splice(0,nodes.length);

        loadedNodes.forEach(n=>{

            nodes.push({

                id:n.id,
                type:n.type,
                text:n.text,
                ip:n.ip || "",
                model:n.model || "",
                location:n.location || "",
                notes:n.notes || "",
                x:n.x,
                y:n.y

            });

        });

    }

    if(Array.isArray(layout.links)){

        links.splice(0,links.length);

        layout.links.forEach(link=>{

            if(Array.isArray(link) && link.length>=2){

                links.push([
                    link[0],
                    link[1]
                ]);

            }

        });

    }

    if(typeof layout.zoom==="number"){

        zoom=layout.zoom;

    }

    if(typeof layout.viewX==="number"){

        viewX=layout.viewX;

    }

    if(typeof layout.viewY==="number"){

        viewY=layout.viewY;

    }

}


/* ==========================================================
   INITIALIZE
========================================================== */

render();
updateView();
/* ==========================================================
   ADD DEVICE
========================================================== */

const btnOpen=document.getElementById("btnOpen");
const btnSave=document.getElementById("btnSave");
const fileOpen=document.getElementById("fileOpen");

const btnAddDevice=document.getElementById("btnAddDevice");
const btnAddLink=document.getElementById("btnAddLink");

const deviceModal=document.getElementById("deviceModal");

const btnCreateDevice=document.getElementById("btnCreateDevice");
const btnCloseDevice=document.getElementById("btnCloseDevice");

const deviceType=document.getElementById("deviceType");
const contextMenu=document.getElementById("contextMenu");

const cmRename=document.getElementById("cmRename");
const cmDuplicate=document.getElementById("cmDuplicate");
const cmDelete=document.getElementById("cmDelete");
btnSave.onclick=function(){

    saveLayout();

};
btnOpen.onclick=function(){

    fileOpen.click();

};
fileOpen.onchange=function(){

    const file=fileOpen.files[0];

    if(!file) return;

    const reader=new FileReader();

    reader.onload=function(){

        try{

            loadLayout(reader.result);

            selectedNode=null;
            selectedElement=null;

            render();
            updateView();

            document.getElementById("statusBar").textContent="Loaded "+file.name;

        }catch(e){

            alert("File JSON tidak valid");

        }

        fileOpen.value="";

    };

    reader.readAsText(file);

};
btnAddDevice.onclick=function(){

    deviceModal.style.display="flex";

};
btnAddLink.onclick=function(){

    linkMode=true;

    firstLinkNode=null;

    document.getElementById("statusBar").textContent=
        "LINK MODE : pilih device pertama";

};

btnCloseDevice.onclick=function(){

    deviceModal.style.display="none";

};

btnCreateDevice.onclick=function(){

    const type=deviceType.value;

    const count=nodes.filter(n=>n.type===type).length+1;

    const id=type+"_"+Date.now();

    const label=type.toUpperCase()+"-"+String(count).padStart(3,"0");

    nodes.push({

        id:id,

        type:type,

        text:label,

        x:350,

        y:220

    });

    deviceModal.style.display="none";

    render();

};
/* ==========================================================
   DELETE DEVICE
========================================================== */

document.addEventListener("keydown",function(e){

    if(e.key!=="Delete") return;

    if(!selectedNode) return;

    const idx=nodes.findIndex(n=>n.id===selectedNode.id);

    if(idx>=0){

        nodes.splice(idx,1);

    }

    for(let i=links.length-1;i>=0;i--){

        if(
            links[i][0]===selectedNode.id ||
            links[i][1]===selectedNode.id
        ){

            links.splice(i,1);

        }

    }

    selectedNode=null;
    selectedElement=null;

    render();

});
document.addEventListener("click",function(){

    contextMenu.style.display="none";

});

cmDelete.onclick=function(){

    if(!contextTarget) return;

    const idx=nodes.findIndex(n=>n.id===contextTarget.id);

    if(idx>=0){

        nodes.splice(idx,1);

    }

    for(let i=links.length-1;i>=0;i--){

        if(
            links[i][0]===contextTarget.id ||
            links[i][1]===contextTarget.id
        ){

            links.splice(i,1);

        }

    }

    contextTarget=null;

    contextMenu.style.display="none";

    render();

};
cmRename.onclick=function(){

    if(!contextTarget) return;

    const nama=prompt(
        "Nama Device",
        contextTarget.text
    );

    if(nama===null) return;

    contextTarget.text=nama.trim();

    contextMenu.style.display="none";

    render();

};
cmDuplicate.onclick=function(){

    if(!contextTarget) return;

    const copy={

        ...contextTarget,

        id:contextTarget.type+"_"+Date.now(),

        x:contextTarget.x+40,

        y:contextTarget.y+40

    };

    nodes.push(copy);

    contextMenu.style.display="none";

    render();

};