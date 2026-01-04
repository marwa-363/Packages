function generateAll(){
  generateNotifications();
  generateAds();
  generateSeasonal();
  handlePackageRules();
}

/* ================= قواعد الباقة ================= */
function handlePackageRules(){
  if(package.value==="launch"){
    seasonalBtn.disabled = true;
    seasonalBtn.style.display = "none";
    seasonalTitle.style.display = "none";
    seasonalContainer.innerHTML="";
  }else{
    seasonalBtn.disabled = false;
    seasonalBtn.style.display = "";
    seasonalTitle.style.display = "";
  }
}

/* ================= إشعارات ================= */
function generateNotifications(){
  notificationsBody.innerHTML="";
  let count = package.value==="launch"?10:package.value?30:0;
  notifCounter.innerText = `عدد الإشعارات: ${count}`;

  let hours="", mins="", ampm="";
  for(let h=1;h<=12;h++) hours+=`<option>${h}</option>`;
  for(let m=0;m<60;m++) mins+=`<option>${String(m).padStart(2,"0")}</option>`;
  ampm = `<option>AM</option><option>PM</option>`;

  for(let i=0;i<count;i++){
    notificationsBody.innerHTML+=`
    <tr>
      <td><input></td>
      <td><input></td>
      <td>
        <div class="time-group">
          <select>${hours}</select>
          <select>${mins}</select>
          <select>${ampm}</select>
        </div>
      </td>
      <td><input></td>
    </tr>`;
  }
}

/* ================= إعلانات ================= */
function generateAds(){
  adsContainer.innerHTML="";
  let count = package.value==="launch"?3:package.value?10:0;
  adsCounter.innerText = `عدد الإعلانات: ${count}`;

  for(let i=0;i<count;i++){
    adsContainer.innerHTML+=`
    <div class="card">
      <label>العنوان</label>
      <input>

      <label>الرسالة</label>
      <textarea rows="2"></textarea>

      <label>طريقة العرض</label>
      <select>
        <option>Rotating Banner</option>
        <option>Countdown Banner</option>
        <option>Smart Banner</option>
        <option>Smart Popup</option>
        <option>Message Bar</option>
      </select>

      <label>المكان</label>
      <input>
    </div>`;
  }
}

/* ================= تعديلات التصميم ================= */
function addDesignEdit(){
  const card=document.createElement("div");
  card.className="card";
  card.innerHTML=`<textarea rows="2" placeholder="اكتب التعديل"></textarea>`;
  designEdits.appendChild(card);
}

/* ================= موسمي ================= */
function generateSeasonal(){
  seasonalContainer.innerHTML="";
}

/* ================= إضافة واجهة ================= */
function addSeasonal(){
  if(package.value==="launch") return;

  const card=document.createElement("div");
  card.className="card";
  card.innerHTML=`
    <label>المناسبة</label>
    <input>

    <label>التاريخ المتوقع</label>
    <input>

    <label>الفكرة</label>
    <textarea rows="2"></textarea>
  `;
  seasonalContainer.appendChild(card);
}

/* ================= جمع البيانات ================= */
function collectData(){
  return {
    app:appName.value,
    pack:package.options[package.selectedIndex].text,

    notifications:[...notificationsBody.querySelectorAll("tr")].map(r=>{
      let i=r.querySelectorAll("input");
      let s=r.querySelectorAll("select");
      return{
        title:i[0].value,
        msg:i[1].value,
        time:`${s[0].value}:${s[1].value} ${s[2].value}`,
        reason:i[2].value
      };
    }),

    ads:[...adsContainer.children].map(c=>{
      let i=c.querySelectorAll("input,textarea");
      let s=c.querySelector("select");
      return{
        title:i[0].value,
        msg:i[1].value,
        display:s.value,
        place:i[2].value
      };
    }),

    edits:[...designEdits.querySelectorAll("textarea")].map(t=>t.value),

    seasonal:[...seasonalContainer.children].map(c=>{
      let i=c.querySelectorAll("input,textarea");
      return{
        event:i[0].value,
        date:i[1].value,
        idea:i[2].value
      };
    })
  };
}

/* ================= PDF ================= */
function generatePreview(){
  if(!appName.value){
    alert("من فضلك اكتب اسم التطبيق");
    return;
  }
  localStorage.setItem("data",JSON.stringify(collectData()));
  window.open("preview.html","_blank");
}
