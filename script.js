document.getElementById('i-rw').addEventListener('change',function(){

document.getElementById('rw-extra').style.display=
this.value==='yes'
?'block'
:'none';

});

function v(id){
return document.getElementById(id).value;
}

function n(id){
return parseFloat(
document.getElementById(id).value
)||0;
}

function ni(id){
return parseInt(
document.getElementById(id).value
)||0;
}

function rr(x,d=2){
return parseFloat(x.toFixed(d));
}

function row(key,val,note,badge){

if(!key)return '';

let bHTML=
badge
?` <span class="badge ${badge[0]}">${badge[1]}</span>`
:'';

let nHTML=
note
?`<div class="r-note">${note}</div>`
:'';

return `

<div class="r-row">

<div class="r-key">
${key}
</div>

<div class="r-val">

${val}

${bHTML}

${nHTML}

</div>

</div>

`;

}

function section(icon,title,rows){

const content=
rows.filter(Boolean).join('');

if(!content)return '';

return `

<div class="r-section">

<div class="r-header">

<i class="ti ti-${icon}"></i>

<span class="r-header-title">

${title}

</span>

</div>

<div class="r-body">

${content}

</div>

</div>

`;

}

function runAll(){

const zone=v('i-zone'),
auth=v('i-auth'),
road=n('i-road'),
plot=n('i-plot'),
land=n('i-land');

const fly=v('i-fly'),
use=v('i-use'),
storeys=ni('i-storeys'),
ht=n('i-ht');

const units=ni('i-units'),
bua=n('i-bua'),
gcov=n('i-gcov'),
age=ni('i-age');

const bsmt=v('i-bsmt'),
green=v('i-green'),
appl=v('i-appl');

const rwAffected=
v('i-rw')==='yes';

const rwArea=n('i-rwarea'),
rwMethod=v('i-rwmethod'),
rwBtype=v('i-rwbtype');

const isRes=use==='res',
isComm=use==='comm',
isInst=use==='inst',
isInd=use==='ind',
isNR=use==='nonres';

let out='';

/* FAR */

let farRes=0,
farNR=0;

if(road<6.1){

farRes=1.5;
farNR=1.75;

}

else if(road<7.5){

farRes=2.0;
farNR=2.0;

}

else if(road<9.1){

farRes=2.5;
farNR=2.5;

}

else if(road<12.2){

farRes=2.5;
farNR=2.5;

}

else{

farRes=3.0;
farNR=3.0;

}

const chosenFAR=
isRes
?farRes
:farNR;

let incentiveFAR=0;

if(green==='griha3')
incentiveFAR=
rr(chosenFAR*0.03);

else if(green==='griha4')
incentiveFAR=
rr(chosenFAR*0.05);

else if(green==='griha5')
incentiveFAR=
rr(chosenFAR*0.07);

const effectiveFAR=
rr(chosenFAR+incentiveFAR);

const actualFARUsed=
rr(bua/plot,2);

const farOK=
actualFARUsed<=effectiveFAR;

/* HEIGHT */

let maxFloors='',
maxH=0;

if(road<6.1){

maxFloors='G+1';
maxH=7;

}

else if(road<7.5){

maxFloors='G+4';
maxH=16.4;

}

else if(road<9.1){

maxFloors='G+5';
maxH=19.25;

}

else if(road<12.2){

maxFloors='G+6';
maxH=23.1;

}

else{

maxFloors='As per MP';
maxH=40;

}

/* RISK */

let rHigh=0,
rMed=0;

if(ht>22)
rHigh++;

else if(ht>=17)
rMed++;

if(units>100)
rHigh++;

else if(units>=50)
rMed++;

if(fly==='within30')
rHigh++;

else if(fly==='medium')
rMed++;

if(isInst)
rHigh++;

else
rMed++;

if(age>60)
rHigh++;

else if(age>=50)
rMed++;

if(gcov>500)
rHigh++;

else if(gcov>300)
rMed++;

let riskCat='Low risk',
riskBadge='b-ok';

if(rHigh>=2){

riskCat='High risk';
riskBadge='b-err';

}

else if(rMed>=2||rHigh>=1){

riskCat='Medium risk';
riskBadge='b-warn';

}

/* PARKING */

let pkCars=0;

if(isRes){

pkCars=units;

}

else{

pkCars=
Math.ceil(bua/500);

}

/* SETBACKS */

let sbFront=0,
sbSide=0,
sbRear=0;

if(ht<=10){

sbFront=1.5;
sbSide=1;
sbRear=2;

}

else if(ht<=15){

sbFront=2;
sbSide=1.5;
sbRear=2;

}

else if(ht<=18){

sbFront=3;
sbSide=2;
sbRear=2;

}

else{

sbFront=4.5;
sbSide=3;
sbRear=3;

}

/* SUMMARY */

out+=`

<div class="summary-grid">

<div class="s-card">

<div class="s-label">
Permissible FAR
</div>

<div class="s-val">
${effectiveFAR}
</div>

<div class="s-sub">
Base ${chosenFAR}
</div>

</div>

<div class="s-card">

<div class="s-label">
Max Height
</div>

<div class="s-val">
${maxH}m
</div>

<div class="s-sub">
${maxFloors}
</div>

</div>

<div class="s-card">

<div class="s-label">
Risk
</div>

<div class="s-val">
${riskCat}
</div>

<div class="s-sub">

<span class="badge ${riskBadge}">
${riskCat}
</span>

</div>

</div>

<div class="s-card">

<div class="s-label">
Parking
</div>

<div class="s-val">
${pkCars}
</div>

<div class="s-sub">
Required
</div>

</div>

</div>

`;

/* WARNINGS */

if(!farOK){

out+=`

<div class="err-box">

<b>FAR violation:</b>

Your BUA exceeds permissible limit.

</div>

`;

}

if(ht>maxH){

out+=`

<div class="warn-box">

<b>Height violation:</b>

Height exceeds permissible limit.

</div>

`;

}

if(farOK&&ht<=maxH){

out+=`

<div class="ok-box">

<b>Approved:</b>

FAR and height within limits.

</div>

`;

}

/* FAR SECTION */

out+=section(
'layers-intersect',
'FAR & Height',
[

row(
'Road Width',
road+' m'
),

row(
'Base FAR',
chosenFAR
),

row(
'Effective FAR',
effectiveFAR
),

row(
'Max Permissible BUA',
rr(plot*effectiveFAR)+' sq.m'
),

row(
'Entered BUA',
bua+' sq.m',
null,
farOK
?['b-ok','OK']
:['b-err','Exceeded']
),

row(
'Max Height',
maxH+' m'
),

row(
'Entered Height',
ht+' m',
null,
ht<=maxH
?['b-ok','OK']
:['b-err','Exceeded']
)

]);

/* PARKING */

out+=section(
'car',
'Parking Requirements',
[

row(
'Required Parking',
pkCars
),

row(
'Parking Rule',
'1 car per residential unit'
)

]);

/* SETBACKS */

out+=section(
'arrows-minimize',
'Setbacks',
[

row(
'Front Setback',
sbFront+' m'
),

row(
'Side Setback',
sbSide+' m'
),

row(
'Rear Setback',
sbRear+' m'
)

]);

/* RISK */

out+=section(
'shield-check',
'Risk & Inspection',
[

row(
'Risk Category',
riskCat,
null,
[riskBadge,riskCat]
),

row(
'Inspection',
'Mandatory'
)

]);

document.getElementById('results')
.innerHTML=out;

/* SHOW PDF BUTTON */

document.getElementById(
'pdf-btn-wrap'
).innerHTML = `

<button class="download-btn"
onclick="downloadPDF()">

<i class="ti ti-download"></i>

Download PDF Report

</button>

`;

}

/* PDF */


/* NIGHT MODE */

const toggleBtn =
document.getElementById(
'themeToggle'
);

toggleBtn.addEventListener(
'click',
()=>{

document.body.classList.toggle(
'dark-mode'
);

toggleBtn.innerHTML =
document.body.classList.contains(
'dark-mode'
)
?'☀️'
:'🌙';

}
);


/* CUSTOM CURSOR */

const customCursor =
document.querySelector(
'.construction-cursor'
);

document.addEventListener(
'mousemove',
(e)=>{

customCursor.style.left =
e.clientX + 'px';

customCursor.style.top =
e.clientY + 'px';

});

function downloadPDF(){

const reportWindow =
window.open(
'',
'_blank'
);

const resultsHTML =
document.getElementById(
'results'
).innerHTML;

reportWindow.document.write(`

<html>

<head>

<title>
JBBL Report
</title>

<style>

body{

font-family:Arial;

padding:40px;

color:black;

background:white;
}

h1{

text-align:center;

margin-bottom:30px;
}

table{

width:100%;

border-collapse:collapse;

margin-bottom:30px;
}

th,td{

border:1px solid black;

padding:10px;

text-align:left;
}

th{

background:black;

color:white;
}

/* GENERATED REPORT */

.summary-grid{

display:grid;

grid-template-columns:
repeat(2,1fr);

gap:15px;

margin-bottom:30px;
}

.s-card{

border:1px solid black;

padding:15px;
}

.s-label{

font-size:12px;

margin-bottom:8px;
}

.s-val{

font-size:24px;

font-weight:bold;
}

.r-section{

border:1px solid black;

margin-bottom:25px;
}

.r-header{

padding:12px;

background:black;

color:white;

font-weight:bold;
}

.r-row{

display:flex;

justify-content:space-between;

padding:10px 15px;

border-bottom:1px solid #ccc;
}

.badge{

padding:4px 10px;

border:1px solid black;

font-size:12px;
}

.warn-box,
.err-box,
.ok-box{

border:1px solid black;

padding:15px;

margin-bottom:20px;
}

</style>

</head>

<body>

<div style="
text-align:center;
margin-bottom:20px;
">

<img src="assets/logo.png"
style="
width:90px;
margin-bottom:10px;
">

<h1>
JBBL Compliance Report
</h1>

</div>

<table>

<tr>
<th>Field</th>
<th>Value</th>
</tr>

<tr>
<td>Zone</td>
<td>${v('i-zone')}</td>
</tr>

<tr>
<td>Authority</td>
<td>${v('i-auth')}</td>
</tr>

<tr>
<td>Road Width</td>
<td>${n('i-road')} m</td>
</tr>

<tr>
<td>Plot Area</td>
<td>${n('i-plot')} sq.m</td>
</tr>

<tr>
<td>Building Use</td>
<td>${v('i-use')}</td>
</tr>

<tr>
<td>Storeys</td>
<td>${ni('i-storeys')}</td>
</tr>

<tr>
<td>Height</td>
<td>${n('i-ht')} m</td>
</tr>

<tr>
<td>Units</td>
<td>${ni('i-units')}</td>
</tr>

<tr>
<td>Built-up Area</td>
<td>${n('i-bua')} sq.m</td>
</tr>

</table>

${resultsHTML}

</body>

</html>

`);

reportWindow.document.close();

reportWindow.print();

}