const d = JSON.parse(localStorage.getItem("data"));
const pages = document.getElementById("pages");

let pageNum = 1;
let currentPage;
let currentHeight = 0;

const PAGE_HEIGHT = 297 * 3.78; // px
const PADDING = 40 * 3.78;

/* إنشاء صفحة جديدة */
function newPage(){
  currentPage = document.createElement("div");
  currentPage.className = "page";
  currentPage.innerHTML = `<div class="footer"> ${pageNum++}</div>`;
  pages.appendChild(currentPage);
  currentHeight = PADDING;
}

/* إضافة عنصر مع حساب الارتفاع */
function addBlock(el){
  document.body.appendChild(el);
  const h = el.offsetHeight;
  document.body.removeChild(el);

  if(currentHeight + h > PAGE_HEIGHT - PADDING){
    newPage();
  }

  currentPage.insertBefore(el, currentPage.querySelector(".footer"));
  currentHeight += h;
}

/* ====== غلاف ====== */
newPage();
addBlock(Object.assign(document.createElement("div"),{
  className:"cover",
  innerHTML:`
    <div class="label">اسم التطبيق</div>
    <div class="value">${d.app}</div>
    <div class="label">نوع الباقة</div>
    <div class="value">${d.pack}</div>
  `
}));

/* ====== إشعارات ====== */
if(d.notifications.length){
  newPage();
  addBlock(Object.assign(document.createElement("h3"),{innerText:"الإشعارات"}));

  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>العنوان</th>
        <th>الرسالة</th>
        <th>الوقت</th>
        <th>السبب</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  addBlock(table);

  d.notifications.forEach(n=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${n.title}</td>
      <td>${n.msg}</td>
      <td>${n.time}</td>
      <td>${n.reason}</td>
    `;
    addBlock(tr);
    table.querySelector("tbody").appendChild(tr);
  });
}

/* ====== الإعلانات ====== */
if(d.ads.length){
  newPage();
  addBlock(Object.assign(document.createElement("h3"),{innerText:"الإعلانات"}));

  d.ads.forEach(a=>{
    const card = document.createElement("div");
    card.className="card";
    card.innerHTML=`
      <b>العنوان:</b> ${a.title}<br>
      <b>الرسالة:</b> ${a.msg}<br>
      <b>طريقة العرض:</b> ${a.display}<br>
      <b>المكان:</b> ${a.place}
    `;
    addBlock(card);
  });
}

/* ====== تعديلات التصميم ====== */
if(d.edits.length){
  newPage();
  addBlock(Object.assign(document.createElement("h3"),{innerText:"تعديلات التصميم"}));

  d.edits.forEach(e=>{
    const card=document.createElement("div");
    card.className="card";
    card.innerText=e;
    addBlock(card);
  });
}

/* ====== موسمية ====== */
if(d.seasonal.length){
  newPage();
  addBlock(Object.assign(document.createElement("h3"),{innerText:"واجهات موسمية"}));

  d.seasonal.forEach(s=>{
    const card=document.createElement("div");
    card.className="card";
    card.innerHTML=`
      <b>المناسبة:</b> ${s.event}<br>
      <b>التاريخ:</b> ${s.date}<br>
      <b>الفكرة:</b> ${s.idea}
    `;
    addBlock(card);
  });
}

/* ====== PDF نصي قابل للنسخ ====== */
html2pdf().set({
  filename:`${d.app}_${d.pack}.pdf`,
  jsPDF:{
    unit:"mm",
    format:"a4",
    orientation:"portrait",
    compressPDF:true
  },
  pagebreak:{ mode:["avoid-all"] }
}).from(pages).save();
