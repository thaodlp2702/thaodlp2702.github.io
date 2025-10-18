// ===== Simple in-page flow state =====
const state = {
  category: null,   // {id, name}
  service:  null,   // {id, name, duration, price}
  datetime: null,   // ISO string or {day, time}
  staff:    null,   // {id, name}
};

// ===== Sample data (bạn đổi theo thực tế) =====
const DATA = {
  categories: [
    { id: "nail", name: "Nail care" },
    { id: "foot", name: "Foot care" },
    { id: "lash", name: "Lash & Brow" },
    { id: "combo", name: "Combo" },
  ],
  services: {
    nail: [
      { id: "gel-polish",   name: "Gel Polish",           duration: "1 hour",   price: 25 },
      { id: "extension",    name: "Extensions",           duration: "1–1.5 hr", price: 47 },
      { id: "manicure",     name: "Classic Manicure",     duration: "1 hour",   price: 36 },
      { id: "nail-art",     name: "Nail Art",             duration: "1–1.5 hr", price: 54 },
    ],
    foot: [
      { id: "classic-pedicure", name:"Classic Pedicure",  duration:"1 hour",    price: 43 },
      { id: "gel-toes",         name:"Gel polish for Toes", duration:"1 hour",  price: 43 },
      { id: "foot-massage",     name:"Foot Massage",      duration:"1 hour",    price: 43 },
      { id: "pedicure-gel",     name:"Pedicure + Gel Polish", duration:"1 hour", price: 43 },
    ],
    lash: [
      { id: "classic-lash", name:"Classic Lash",          duration:"1 hour",    price: 43 },
      { id: "hybrid-lash",  name:"Hybrid Lash",           duration:"1 hour",    price: 43 },
      { id: "volume-lash",  name:"Volume Lash",           duration:"1 hour",    price: 43 },
      { id: "brow-shape",   name:"Brow Shape",            duration:"1 hour",    price: 43 },
    ]
  },
  staff: [
    { id:"linda", name:"Linda", avatar:"assets/Linda.jpg", langs:"Finnish and English"},
    { id:"yen",   name:"Anna",   avatar:"assets/Anna.jpg",   langs:"English and Vietnamese"},
    { id:"tram",  name:"Truc",  avatar:"assets/Truc.jpg",  langs:"English and Vietnamese"},
    { id:"trang", name:"Han", avatar:"assets/Han.jpg", langs:"English and Vietnamese"},
  ]
};

// ===== Utilities =====
const qs  = s => document.querySelector(s);
const qsa = s => [...document.querySelectorAll(s)];
const show = id => qs(id).classList.remove('hidden');
const hide = id => qs(id).classList.add('hidden');

function setStepActive(step){
  const items = DATA_STEPS.map((t,i)=>`
    <div class="item ${i===step?'active':''}">
      <span class="dot">${i+1}</span> <span>${t}</span>
    </div>`).join('');
  qs('#stepper').innerHTML = items;
}

const DATA_STEPS = ["Category","Service","Time","Staff","Info"];

// ===== Renderers =====
function renderCategories(){
  setStepActive(0);
  const el = qs('#cat-list');
  el.innerHTML = '';
  DATA.categories.forEach(c=>{
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `<div><h4>${c.name}</h4></div>
      <a class="btn select btn--primary squishy">SELECT</a>`;
    row.querySelector('.select').onclick = ()=>{
      state.category = c;
      renderServices();
    };
    el.appendChild(row);
  });
  hide('#step-2'); hide('#step-3'); hide('#step-4'); hide('#step-5'); show('#step-1');
}

function renderServices(){
  setStepActive(1);
  const list = DATA.services[state.category.id] || [];
  qs('#svc-title').textContent = `Choose a service – ${state.category.name}`;
  const el = qs('#svc-list');
  el.innerHTML = '';
  list.forEach(svc=>{
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `
      <div>
        <h4>${svc.name}</h4>
        <div class="muted">${svc.duration} • €${svc.price.toFixed(2)}</div>
      </div>
      <a class="btn select btn--primary squishy">SELECT</a>`;
    row.querySelector('.select').onclick = ()=>{
      state.service = svc;
      renderTimes();
    };
    el.appendChild(row);
  });
  qs('#back-2').onclick = ()=>renderCategories();
  hide('#step-1'); show('#step-2'); hide('#step-3'); hide('#step-4'); hide('#step-5');
}

function generateTimeSlots(){
  // ví dụ tạo slot trong 5 ngày tới, 08:00–18:00 mỗi 5 phút (demo rút gọn 10–minute)
  const slots = [];
  const now = new Date();
  for(let d=0; d<5; d++){
    for(let h=8; h<=18; h++){
      for(let m=0; m<60; m+=10){
        const t = new Date(now.getFullYear(), now.getMonth(), now.getDate()+d, h, m);
        slots.push(t);
      }
    }
  }
  return slots;
}

function renderTimes(){
  setStepActive(2);
  const grid = qs('#time-grid');
  grid.innerHTML = '';
  const slots = generateTimeSlots().slice(0,50); // demo: lấy 50 slot đầu
  slots.forEach(t=>{
    const label = t.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    const btn = document.createElement('div');
    btn.className = 'slot';
    btn.textContent = `${label}`;
    btn.onclick = ()=>{
      qsa('.slot.selected').forEach(s=>s.classList.remove('selected'));
      btn.classList.add('selected');
      state.datetime = t.toISOString();
      // chuyển ngay sang bước staff
      renderStaff();
    };
    grid.appendChild(btn);
  });
  qs('#back-3').onclick = ()=>renderServices();
  hide('#step-1'); hide('#step-2'); show('#step-3'); hide('#step-4'); hide('#step-5');
}

function renderStaff(){
  setStepActive(3);
  const el = qs('#staff-list');
  el.innerHTML = '';
  DATA.staff.forEach(s=>{
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `
      <div style="display:flex;align-items:center;">
        <img src="${s.avatar||'img/staff_placeholder.jpg'}" alt="${s.name}"/>
        <div>
          <h4>${s.name}</h4>
          <div class="muted">Languages: ${s.langs}</div>
        </div>
      </div>
      <a class="btn select btn--primary squishy">SELECT</a>`;
    row.querySelector('.select').onclick = ()=>{
      state.staff = s;
      renderSummary();
    };
    el.appendChild(row);
  });
  qs('#back-4').onclick = ()=>renderTimes();
  hide('#step-1'); hide('#step-2'); hide('#step-3'); show('#step-4'); hide('#step-5');
}

function renderSummary(){
  setStepActive(4);
  const s = state;
  const timePretty = new Date(s.datetime).toLocaleString([], {weekday:'long', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit'});
  const html = `
    <p><strong>${s.service.name}</strong> with <strong>${s.staff.name}</strong></p>
    <p>${s.service.duration} • €${s.service.price.toFixed(2)}</p>
    <p>${timePretty}</p>`;
  qs('#summary').innerHTML = html;

  qs('#back-5').onclick = ()=>renderStaff();
 // helper nhỏ để show/hide modal
function openModal(html){
  qs('#bk-modal-body').innerHTML = html;
  qs('#bk-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeModal(){
  qs('#bk-modal').classList.add('hidden');
  document.body.style.overflow = '';
}

// --- gán lại nút Confirm ở bước 5:
qs('#confirm').onclick = (e)=>{
  e.preventDefault();

  // Validate form (HTML5 required đã có; kiểm tra lại cho chắc)
  const formEl = document.getElementById('info-form');
  if(!formEl.reportValidity()){ return; }

  const form = new FormData(formEl);
  const payload = {
    firstName: form.get('firstName')?.trim(),
    lastName:  form.get('lastName')?.trim(),
    phone:     form.get('phone')?.trim(),
    email:     form.get('email')?.trim(),
    notes:     form.get('notes')?.trim(),
    selection: state
  };

  // Render bảng xác nhận
  const when = new Date(state.datetime).toLocaleString([], {
    weekday:'long', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit'
  });

  const confirmHTML = `
    <div style="line-height:1.5">
      <p><strong>Service:</strong> ${state.service.name} (${state.service.duration}) — €${state.service.price.toFixed(2)}</p>
      <p><strong>Staff:</strong> ${state.staff?.name || 'Any'}</p>
      <p><strong>Time:</strong> ${when}</p>
      <hr/>
      <p><strong>Name:</strong> ${payload.firstName} ${payload.lastName}</p>
      <p><strong>Phone:</strong> ${payload.phone}</p>
      <p><strong>Email:</strong> ${payload.email}</p>
      ${payload.notes ? `<p><strong>Notes:</strong> ${payload.notes}</p>` : ''}
    </div>
  `;
  openModal(confirmHTML);

  // Nút Cancel và bấm nền tối để đóng
  qs('#bk-modal-cancel').onclick = closeModal;
  qs('#bk-modal').querySelector('.bk-modal__backdrop').onclick = closeModal;

  // Nút Confirm booking (ở trong popup)
  qs('#bk-modal-submit').onclick = ()=>{
    // TODO: gửi dữ liệu lên server / Google Sheet / email… tại đây
    // Ví dụ: fetch('/api/appointments', {method:'POST', body: JSON.stringify(payload)})

    // Thông báo thành công + đóng modal
    closeModal();
    // Optional: reset form/điều hướng cảm ơn
    formEl.reset();
    alert('Your appointment has been submitted! We will send a confirmation to your email.');
  };
};
  hide('#step-1'); hide('#step-2'); hide('#step-3'); hide('#step-4'); show('#step-5');
}

// init
// ===== SIMPLE AUTO-SELECT SERVICE FROM URL =====
const params = new URLSearchParams(window.location.search);
const serviceID = params.get("svc"); // lấy ?svc=...

if (serviceID) {
  // Tìm trong tất cả danh sách dịch vụ
  let foundService = null;
  let foundCategory = null;

  for (let cat in DATA.services) {
    for (let s of DATA.services[cat]) {
      if (s.id === serviceID) {
        foundService = s;
        foundCategory = cat;
        break;
      }
    }
    if (foundService) break;
  }

  if (foundService) {
    // Gán sẵn vào state
    state.category = { id: foundCategory, name: foundCategory };
    state.service = foundService;

    // Đi thẳng đến bước chọn thời gian
    renderTimes();
  } else {
    // Nếu không tìm thấy, quay về flow bình thường
    renderCategories();
  }

} else {
  // Nếu không có ?svc=..., chạy flow bình thường
  renderCategories();
}

