// MediCare+ Smart Hospital — script.js

// ══════════════ DATA ══════════════
const medicines = [
  {name:'Paracetamol 500mg',stock:8,max:100,price:5,expiry:'2026-01-01',cat:'Tablet'},
  {name:'Amoxicillin 250mg',stock:15,max:80,price:12,expiry:'2025-06-25',cat:'Capsule'},
  {name:'Metformin 500mg',stock:22,max:100,price:8,expiry:'2026-03-15',cat:'Tablet'},
  {name:'Ibuprofen 400mg',stock:45,max:100,price:6,expiry:'2026-08-10',cat:'Tablet'},
  {name:'Amlodipine 5mg',stock:60,max:100,price:14,expiry:'2026-12-01',cat:'Tablet'},
  {name:'Omeprazole 20mg',stock:38,max:100,price:10,expiry:'2026-05-20',cat:'Capsule'},
  {name:'Cough Syrup 100ml',stock:8,max:50,price:45,expiry:'2025-07-01',cat:'Syrup'},
  {name:'Antacid Tabs',stock:30,max:100,price:3,expiry:'2025-07-10',cat:'Tablet'},
];

let currentRating = 0;
let selectedSlot = '';
let patientIdCounter = 5;

// ══════════════ INIT ══════════════
window.onload = function() {
  setTimeout(()=>{ document.getElementById('loading').style.display='none'; }, 1800);
  updateClock();
  setInterval(updateClock, 1000);
  renderMedicines();
  renderCalendar();
};

function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit',second:'2-digit'}) + ' IST';
}

// ══════════════ NAVIGATION ══════════════
const pageTitles = {dashboard:'Dashboard',patients:'Patient Management',doctors:'Doctor Management',nurses:'Nurse Management',appointments:'Appointment Management',pharmacy:'Pharmacy',records:'Medical Records',lab:'Laboratory',billing:'Billing',reports:'Reports',care:'Customer Care',feedback:'Feedback'};

function showPage(id, navEl) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');
  if(navEl) { document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active')); navEl.classList.add('active'); }
  document.getElementById('page-title-text').textContent = pageTitles[id] || id;
  if(window.innerWidth <= 900) document.getElementById('sidebar').classList.remove('open');
}

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); }

// ══════════════ TABS ══════════════
function switchTab(btn, tabId) {
  const parent = btn.parentElement;
  parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const page = btn.closest('.page');
  page.querySelectorAll('[id^="ptab-"],[id^="dtab-"],[id^="atab-"],[id^="ptab2-"],[id^="btab-"]').forEach(t => { if(t.parentElement.closest('.page') === page) t.style.display='none'; });
  const el = document.getElementById(tabId);
  if(el) el.style.display = '';
}

// ══════════════ MODALS ══════════════
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(o => o.addEventListener('click', e => { if(e.target === o) o.classList.remove('open'); }));

// ══════════════ PATIENTS ══════════════
function registerPatient() {
  const name = document.getElementById('pf-name').value.trim();
  const age = document.getElementById('pf-age').value;
  if(!name || !age) { document.getElementById('patient-form-alert').innerHTML='<div class="alert alert-danger">⚠️ Name and Age are required!</div>'; return; }
  const id = 'P-00'+patientIdCounter++;
  const blood = document.getElementById('pf-blood').value || '—';
  const phone = document.getElementById('pf-phone').value || '—';
  const tbody = document.getElementById('patients-tbody');
  const row = tbody.insertRow(0);
  row.innerHTML = `<td><span style="font-family:'JetBrains Mono',monospace;font-size:12px">${id}</span></td><td>${name}</td><td>${age}</td><td>${document.getElementById('pf-gender').value}</td><td><span class="badge badge-green">${blood}</span></td><td>${phone}</td><td><span class="badge badge-gold">New</span></td><td><div style="display:flex;gap:6px"><button class="btn btn-xs btn-outline">View</button><button class="btn btn-xs btn-primary">Edit</button><button class="btn btn-xs btn-danger" onclick="deleteRow(this)">Del</button></div></td>`;
  document.getElementById('patient-form-alert').innerHTML='<div class="alert alert-success">✅ Patient <strong>'+name+'</strong> registered successfully! ID: <strong>'+id+'</strong></div>';
  clearPatientForm();
  document.getElementById('badge-patients').textContent = parseInt(document.getElementById('badge-patients').textContent)+1;
}

function clearPatientForm() {
  ['pf-name','pf-age','pf-phone','pf-addr','pf-emerg','pf-history'].forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
}

function registerPatientModal() {
  const name = document.getElementById('mp-name').value.trim();
  if(!name) { alert('Please enter patient name'); return; }
  const id = 'P-00'+patientIdCounter++;
  const tbody = document.getElementById('patients-tbody');
  const row = tbody.insertRow(0);
  const blood = document.getElementById('mp-blood').value || '—';
  row.innerHTML = `<td><span style="font-family:'JetBrains Mono',monospace;font-size:12px">${id}</span></td><td>${name}</td><td>${document.getElementById('mp-age').value||'—'}</td><td>${document.getElementById('mp-gender').value}</td><td><span class="badge badge-green">${blood}</span></td><td>${document.getElementById('mp-phone').value||'—'}</td><td><span class="badge badge-gold">New</span></td><td><div style="display:flex;gap:6px"><button class="btn btn-xs btn-outline">View</button><button class="btn btn-xs btn-primary">Edit</button><button class="btn btn-xs btn-danger" onclick="deleteRow(this)">Del</button></div></td>`;
  closeModal('modal-reg-patient');
  showToast('✅ Patient '+name+' registered! ID: '+id);
}

function viewPatient(id, name) {
  document.getElementById('pd-title').textContent = 'Patient: '+name;
  document.getElementById('pd-body').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
      <div><div style="font-size:11px;color:var(--gray-400);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:2px">Patient ID</div><div style="font-family:'JetBrains Mono',monospace;font-weight:600">${id}</div></div>
      <div><div style="font-size:11px;color:var(--gray-400);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:2px">Full Name</div><div style="font-weight:600">${name}</div></div>
      <div><div style="font-size:11px;color:var(--gray-400);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:2px">Status</div><span class="badge badge-green">Active</span></div>
      <div><div style="font-size:11px;color:var(--gray-400);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:2px">Last Visit</div><div>2025-06-08</div></div>
    </div>
    <div class="alert alert-info">📋 Full medical history and prescriptions are available in Medical Records module.</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
      <button class="btn btn-sm btn-primary" onclick="closeModal('modal-patient-detail');showPage('records',null)">View Records</button>
      <button class="btn btn-sm btn-outline" onclick="closeModal('modal-patient-detail');showPage('appointments',null)">Book Appt</button>
      <button class="btn btn-sm btn-outline" onclick="closeModal('modal-patient-detail');showPage('billing',null)">Billing</button>
    </div>`;
  openModal('modal-patient-detail');
}

function filterPatients(val) {
  val = val.toLowerCase();
  document.querySelectorAll('#patients-tbody tr').forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(val) ? '' : 'none';
  });
}

function showHistory() {
  const val = document.getElementById('hist-search').value.trim().toLowerCase();
  const histMap = { 'p-001': { name:'Priya Sharma', diag:'Hypertension (2025-06-01)', rx:'Amlodipine 5mg OD' }, 'p-002': { name:'Rohit Kumar', diag:'Knee Osteoarthritis (2025-05-28)', rx:'Ibuprofen 400mg + Physio' }, 'priya': { name:'Priya Sharma', diag:'Hypertension (2025-06-01)', rx:'Amlodipine 5mg OD' } };
  const found = histMap[val];
  const el = document.getElementById('history-result');
  if(!found) { el.innerHTML='<div class="alert alert-danger">❌ No patient found. Try P-001, P-002 or patient name.</div>'; return; }
  el.innerHTML = `<div class="card" style="margin-top:0"><div class="card-body"><h4 style="margin-bottom:12px">${found.name}</h4><div class="timeline"><div class="tl-item"><div class="tl-dot"></div><div class="tl-content"><div class="tl-date">Latest Visit</div><strong>${found.diag}</strong></div></div><div class="tl-item"><div class="tl-dot" style="background:var(--gold)"></div><div class="tl-content"><div class="tl-date">Prescription</div>${found.rx}</div></div></div></div></div>`;
}

// ══════════════ APPOINTMENTS ══════════════
function selectSlot(el) {
  if(el.classList.contains('booked')) return;
  document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  selectedSlot = el.textContent;
}

function bookAppointment() {
  const patient = document.getElementById('af-patient').value.trim();
  const doc = document.getElementById('af-doc').value;
  const date = document.getElementById('af-date').value;
  if(!patient || !doc || !date || !selectedSlot) { document.getElementById('appt-alert').innerHTML='<div class="alert alert-danger">⚠️ Please fill all fields and select a time slot!</div>'; return; }
  const tbody = document.getElementById('appt-tbody');
  const id = 'A-00'+(tbody.rows.length+1);
  const row = tbody.insertRow(0);
  const docName = doc.split(' (')[0];
  row.innerHTML = `<td style="font-family:'JetBrains Mono',monospace;font-size:12px">${id}</td><td>${patient}</td><td>${docName}</td><td>${date}</td><td>${selectedSlot}</td><td>${document.getElementById('af-type').value}</td><td><span class="badge badge-green">Confirmed</span></td><td><button class="btn btn-xs btn-outline">Reschedule</button> <button class="btn btn-xs btn-danger" onclick="cancelAppt(this)">Cancel</button></td>`;
  document.getElementById('appt-alert').innerHTML='<div class="alert alert-success">✅ Appointment booked! ID: <strong>'+id+'</strong></div>';
  document.getElementById('badge-appts').textContent = parseInt(document.getElementById('badge-appts').textContent)+1;
  clearApptForm();
}

function clearApptForm() {
  document.getElementById('af-patient').value='';
  document.getElementById('af-doc').value='';
  document.getElementById('af-date').value='';
  document.getElementById('af-notes').value='';
  document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
  selectedSlot='';
}

function cancelAppt(btn) {
  const row = btn.closest('tr');
  const status = row.querySelector('.badge');
  if(confirm('Cancel this appointment?')) { status.className='badge badge-red'; status.textContent='Cancelled'; btn.remove(); }
}

function bookApptModal() { closeModal('modal-book-appt'); showToast('✅ Appointment booked successfully!'); }
function addDoctorModal() { closeModal('modal-add-doctor'); showToast('✅ Doctor added successfully!'); }
function addNurseModal() { closeModal('modal-add-nurse'); showToast('✅ Nurse added successfully!'); }
function addRecordModal() { closeModal('modal-add-record'); showToast('✅ Medical record saved!'); }
function addLabModal() { closeModal('modal-add-lab'); showToast('🔬 Lab report generated!'); }
function addMedModal() { closeModal('modal-add-med'); showToast('💊 Medicine added to inventory!'); }

// ══════════════ PHARMACY ══════════════
function renderMedicines() {
  const grid = document.getElementById('med-grid');
  grid.innerHTML = medicines.map(m => {
    const pct = Math.round((m.stock/m.max)*100);
    const stockColor = pct < 20 ? '#e53e3e' : pct < 40 ? '#f0a500' : '#38a169';
    return `<div class="med-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px"><span style="font-size:22px">${m.cat==='Tablet'?'💊':m.cat==='Syrup'?'🧪':m.cat==='Injection'?'💉':'📦'}</span><span class="badge" style="background:rgba(13,115,119,0.1);color:var(--teal);font-size:10px">${m.cat}</span></div>
      <div class="med-name">${m.name}</div>
      <div class="med-stock">Stock: <strong>${m.stock}</strong> units · ₹${m.price}</div>
      <div class="stock-bar"><div class="stock-fill" style="width:${pct}%;background:${stockColor}"></div></div>
      <div style="font-size:11px;color:var(--gray-400);margin-top:4px">${pct}% remaining</div>
    </div>`;
  }).join('');
}

function searchMedicine(val) {
  const res = document.getElementById('med-search-result');
  if(!val) { res.innerHTML=''; return; }
  const found = medicines.filter(m => m.name.toLowerCase().includes(val.toLowerCase()));
  if(!found.length) { res.innerHTML='<div class="alert alert-danger">❌ No medicine found.</div>'; return; }
  res.innerHTML = `<table><thead><tr><th>Medicine</th><th>Stock</th><th>Price (₹)</th><th>Expiry</th><th>Status</th></tr></thead><tbody>${found.map(m=>`<tr><td>${m.name}</td><td>${m.stock}</td><td>${m.price}</td><td style="font-family:'JetBrains Mono',monospace;font-size:12px">${m.expiry}</td><td><span class="badge ${m.stock<15?'badge-red':m.stock<30?'badge-gold':'badge-green'}">${m.stock<15?'Low':m.stock<30?'Limited':'In Stock'}</span></td></tr>`).join('')}</tbody></table>`;
}

// ══════════════ RECORDS ══════════════
function viewRecord(name, diag, rx) {
  document.getElementById('rd-body').innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px">
      <div><span style="font-size:11px;color:var(--gray-400);text-transform:uppercase;letter-spacing:0.5px">Patient</span><div style="font-weight:600;font-size:15px;margin-top:2px">${name}</div></div>
      <div><span style="font-size:11px;color:var(--gray-400);text-transform:uppercase;letter-spacing:0.5px">Diagnosis</span><div class="alert alert-warning" style="margin-top:6px;margin-bottom:0">🩺 ${diag}</div></div>
      <div><span style="font-size:11px;color:var(--gray-400);text-transform:uppercase;letter-spacing:0.5px">Prescription</span><div style="background:var(--gray-50);border-radius:var(--radius-sm);padding:12px;margin-top:6px;font-family:'JetBrains Mono',monospace;font-size:13px">💊 ${rx}</div></div>
    </div>`;
  openModal('modal-record-detail');
}

// ══════════════ LAB ══════════════
function viewLabReport() { openModal('modal-lab-detail'); }

// ══════════════ BILLING ══════════════
function calcBill() {
  const c = parseFloat(document.getElementById('bf-consult').value)||0;
  const m = parseFloat(document.getElementById('bf-med').value)||0;
  const l = parseFloat(document.getElementById('bf-lab').value)||0;
  document.getElementById('bill-total').textContent = '₹ '+(c+m+l).toLocaleString('en-IN');
}

function calcModalBill() {
  const c = parseFloat(document.getElementById('mb-consult').value)||0;
  const m = parseFloat(document.getElementById('mb-med').value)||0;
  const l = parseFloat(document.getElementById('mb-lab').value)||0;
  document.getElementById('modal-bill-total').textContent = '₹ '+(c+m+l).toLocaleString('en-IN');
}

function generateBill() {
  const patient = document.getElementById('bf-patient').value.trim();
  if(!patient) { document.getElementById('bill-alert').innerHTML='<div class="alert alert-danger">⚠️ Enter patient name!</div>'; return; }
  const c = parseFloat(document.getElementById('bf-consult').value)||0;
  const m = parseFloat(document.getElementById('bf-med').value)||0;
  const l = parseFloat(document.getElementById('bf-lab').value)||0;
  showReceipt(patient, c, m, l, c+m+l);
  document.getElementById('bill-alert').innerHTML='<div class="alert alert-success">✅ Bill generated for '+patient+'</div>';
}

function clearBillForm() {
  ['bf-patient','bf-consult','bf-med','bf-lab'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  document.getElementById('bill-total').textContent='₹ 0';
}

function genBillModal() { closeModal('modal-gen-bill'); showToast('🧾 Bill generated successfully!'); }

function showReceipt(name, c, m, l, total) {
  const now = new Date().toLocaleString('en-IN');
  document.getElementById('receipt-body').innerHTML = `
    <div class="receipt">
      <div class="receipt-header">
        <div style="font-size:28px;margin-bottom:8px">🏥</div>
        <strong style="font-size:17px">MediCare+ Hospital</strong><br>
        <span style="font-size:11px;opacity:0.6">New Delhi | Tel: 1800-123-4567</span><br>
        <span style="font-size:11px;opacity:0.6">Receipt Date: ${now}</span>
      </div>
      <div class="receipt-row"><span>Patient</span><span>${name}</span></div>
      <div class="receipt-row"><span>Consultation Charges</span><span>₹ ${parseFloat(c).toLocaleString('en-IN')}</span></div>
      <div class="receipt-row"><span>Medicine Charges</span><span>₹ ${parseFloat(m).toLocaleString('en-IN')}</span></div>
      <div class="receipt-row"><span>Laboratory Charges</span><span>₹ ${parseFloat(l).toLocaleString('en-IN')}</span></div>
      <div class="receipt-total"><div class="receipt-row"><span>TOTAL AMOUNT</span><span>₹ ${parseFloat(total).toLocaleString('en-IN')}</span></div></div>
      <div style="text-align:center;margin-top:12px;font-size:11px;opacity:0.6">Thank you for choosing MediCare+ 💙</div>
    </div>`;
  openModal('modal-receipt');
}

function printReceipt() { window.print(); }

// ══════════════ CALENDAR ══════════════
function renderCalendar() {
  const el = document.getElementById('mini-calendar');
  if(!el) return;
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const appts = {9:'3 appts',10:'5 appts',12:'2 appts',15:'8 appts',16:'4 appts',20:'6 appts',23:'1 appt'};
  let html = '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;text-align:center;">';
  days.forEach(d => html += `<div style="font-size:12px;color:var(--gray-400);font-weight:600;padding:6px 0">${d}</div>`);
  for(let i=0;i<6;i++) html += `<div style="height:16px"></div>`;
  for(let d=1;d<=30;d++) {
    const isToday = d===9;
    const hasAppt = appts[d];
    html += `<div style="padding:8px 4px;border-radius:8px;cursor:pointer;transition:all 0.2s;${isToday?'background:var(--teal);color:white;font-weight:700;':''}${hasAppt&&!isToday?'background:rgba(13,115,119,0.08);':''}font-size:13px" onmouseover="this.style.background='${isToday?'var(--teal-dark)':'var(--gray-100)'}'" onmouseout="this.style.background='${isToday?'var(--teal)':hasAppt?'rgba(13,115,119,0.08)':'transparent'}'">${d}${hasAppt?'<div style="font-size:9px;margin-top:2px;color:'+(isToday?'rgba(255,255,255,0.8)':'var(--teal)')+'">'+hasAppt+'</div>':''}</div>`;
  }
  html += '</div>';
  el.innerHTML = html;
}

// ══════════════ CUSTOMER CARE ══════════════
function activateCare(card, panelId) {
  document.querySelectorAll('.care-channel-card').forEach(c=>c.classList.remove('active-channel'));
  card.classList.add('active-channel');
  document.querySelectorAll('.care-panel').forEach(p=>p.style.display='none');
  const panel = document.getElementById(panelId);
  if(panel) { panel.style.display='block'; panel.scrollIntoView({behavior:'smooth',block:'nearest'}); }
}

function requestCallback() {
  const phone = document.getElementById('callback-phone').value.trim();
  if(!phone) { document.getElementById('callback-alert').innerHTML='<div class="alert alert-danger">⚠️ Enter your phone number!</div>'; return; }
  document.getElementById('callback-alert').innerHTML='<div class="alert alert-success">✅ Callback scheduled! We will call you at <strong>'+phone+'</strong> within 30 minutes.</div>';
}

function submitEmail() {
  const name = document.getElementById('care-name').value.trim();
  const email = document.getElementById('care-email').value.trim();
  const msg = document.getElementById('care-msg').value.trim();
  if(!name||!email||!msg) { document.getElementById('email-alert').innerHTML='<div class="alert alert-danger">⚠️ Please fill all fields!</div>'; return; }
  document.getElementById('email-alert').innerHTML='<div class="alert alert-success">✅ Message sent! Our team will respond to <strong>'+email+'</strong> within 2 hours.</div>';
  document.getElementById('care-name').value=''; document.getElementById('care-email').value=''; document.getElementById('care-msg').value='';
}

function sendLiveChat() {
  const inp = document.getElementById('live-chat-inp');
  const msg = inp.value.trim();
  if(!msg) return;
  const chat = document.getElementById('live-chat-msgs');
  chat.innerHTML += `<div style="background:var(--gray-200);padding:10px 14px;border-radius:12px;border-bottom-right-radius:3px;width:fit-content;max-width:80%;align-self:flex-end;margin-left:auto;font-size:13.5px">${msg}</div>`;
  inp.value='';
  chat.scrollTop = chat.scrollHeight;
  setTimeout(()=>{
    const responses = ['Thank you for reaching out! Our team will assist you shortly.','Could you please provide your Patient ID for faster assistance?','I understand your concern. Let me check that for you.','Your query has been noted. Please hold on for a moment.','Is there anything else I can help you with today?'];
    chat.innerHTML += `<div style="background:var(--teal);color:white;padding:10px 14px;border-radius:12px;border-bottom-left-radius:3px;width:fit-content;max-width:80%;font-size:13.5px">👤 Aryan: ${responses[Math.floor(Math.random()*responses.length)]}</div>`;
    chat.scrollTop = chat.scrollHeight;
  }, 1200);
}

// ══════════════ FEEDBACK ══════════════
function setRating(val) {
  currentRating = val;
  document.querySelectorAll('.star').forEach((s,i) => s.classList.toggle('active', i < val));
  const labels = ['','Very Poor','Poor','Average','Good','Excellent'];
  document.getElementById('rating-label').textContent = labels[val]+' ('+val+'/5)';
}

function submitFeedback() {
  const name = document.getElementById('fb-name').value.trim();
  const text = document.getElementById('fb-text').value.trim();
  if(!name||!text||!currentRating) { document.getElementById('feedback-alert').innerHTML='<div class="alert alert-danger">⚠️ Please fill name, feedback and rating!</div>'; return; }
  const dept = document.getElementById('fb-dept').value || 'General';
  const stars = '★'.repeat(currentRating)+'☆'.repeat(5-currentRating);
  document.getElementById('extra-reviews').innerHTML += `
    <div style="border-bottom:1px solid var(--gray-100);padding-bottom:16px;margin-bottom:16px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
        <div class="user-avatar" style="width:36px;height:36px;font-size:14px;background:linear-gradient(135deg,var(--teal),var(--teal-light))">${name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}</div>
        <div><div style="font-weight:600;font-size:14px">${name}</div><div style="font-size:11px;color:var(--gray-400)">${dept} · Just now</div></div>
        <div style="margin-left:auto;color:var(--gold);font-size:16px">${stars}</div>
      </div>
      <p style="font-size:13.5px;color:var(--gray-600)">${text}</p>
    </div>`;
  document.getElementById('feedback-alert').innerHTML='<div class="alert alert-success">💙 Thank you for your feedback, <strong>'+name+'</strong>!</div>';
  document.getElementById('fb-name').value=''; document.getElementById('fb-text').value=''; document.getElementById('fb-pid').value='';
  document.querySelectorAll('.star').forEach(s=>s.classList.remove('active'));
  currentRating=0; document.getElementById('rating-label').textContent='Click to rate';
  document.getElementById('fb-dept').value='';
}

// ══════════════ UTILITIES ══════════════
function deleteRow(btn) { if(confirm('Delete this record?')) btn.closest('tr').remove(); }

function showToast(msg) {
  const toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:var(--teal);color:white;padding:12px 24px;border-radius:24px;font-size:14px;font-weight:500;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,0.2);animation:fadeIn 0.3s ease';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(()=>toast.remove(), 3500);
}

// ══════════════ AI CHAT ══════════════
const aiResponses = {
  'register': 'To register a patient, go to **Patient Management** in the sidebar, click **Register Patient**, and fill in the form. You\'ll get a unique Patient ID (P-001, P-002...). You can also click the yellow "+ Register Patient" button on the Dashboard! 📋',
  'appointment': 'To book an appointment: \n1. Go to **Appointment Management**\n2. Click the **Book New** tab\n3. Enter patient name, select doctor\n4. Pick a date and available time slot\n5. Click **Confirm Booking**\n\nYou\'ll get a confirmation with an Appointment ID! 📅',
  'billing': 'For billing: Go to **Billing Management** → **Create Bill** tab. Enter patient name, consultation charges, medicine charges, and lab charges. The system auto-calculates the total. Click **Generate Bill** to get a printable receipt! 🧾',
  'pharmacy': 'The Pharmacy module lets you view medicine inventory, check stock levels, search medicines, and track expiry dates. Go to **Pharmacy** in the sidebar. Low stock medicines are highlighted in red! 💊',
  'emergency': '🚨 **Emergency Contact:**\nHelpline: **1800-123-4567** (24/7)\nEmergency Ward: Ext. 999\nAmbulance: **102**\n\nFor patient emergencies, use the Emergency appointment type in the Appointments module.',
  'doctor': 'To add a doctor, go to **Doctor Management** → click **Add Doctor**. You can add their specialization, consultation fee, and available slots. To view schedules, use the **Schedule** tab! 👨‍⚕️',
  'lab': 'The Laboratory module is for managing lab reports. You can generate new reports, view existing ones, and track test results. Go to **Laboratory** in the sidebar. 🔬',
  'records': 'Medical Records store diagnosis, prescriptions, and treatment notes for each patient. Go to **Medical Records** to add or view patient records. You can search by patient ID! 📋',
  'password': 'For security concerns or password reset, please contact the IT administrator or call the helpline at **1800-123-4567**. 🔒',
  'hello': 'Hello there! 👋 I\'m Dr. MedAI, your AI assistant for MediCare+. I can help you navigate the system, answer questions about modules, or guide you through any feature. What would you like to know?',
  'help': 'I can help you with:\n• 👤 Patient registration & management\n• 📅 Booking appointments\n• 💊 Pharmacy & medicines\n• 🧾 Billing & receipts\n• 🔬 Lab reports\n• 📋 Medical records\n• 💬 Customer support\n\nJust ask me anything!',
  'nurse': 'Nurse Management lets you add nurses, assign them to departments (ICU, Pediatrics, Emergency), and manage their shifts (Morning/Evening/Night). Go to **Nurse Management** in the sidebar! 👩‍⚕️',
  'report': 'Hospital Reports give you monthly summaries of patients, revenue, appointments, and lab tests. Go to **Reports** in the sidebar. You can also export data as CSV! 📈',
};

function toggleChat() {
  const chat = document.getElementById('ai-chat');
  chat.classList.toggle('open');
}

function sendMessage() {
  const inp = document.getElementById('ai-input');
  const msg = inp.value.trim();
  if(!msg) return;
  addMsg(msg, 'user');
  inp.value = '';
  const msgs = document.getElementById('ai-messages');
  const typing = document.createElement('div');
  typing.className = 'msg bot'; typing.id = 'typing-indicator';
  typing.innerHTML = '<div class="msg-avatar bot">👨‍⚕️</div><div class="ai-typing"><span></span><span></span><span></span></div>';
  msgs.appendChild(typing); msgs.scrollTop = msgs.scrollHeight;
  setTimeout(()=>{
    const t = document.getElementById('typing-indicator'); if(t) t.remove();
    addMsg(getAIResponse(msg), 'bot');
  }, 900+Math.random()*600);
}

function sendQuick(msg) { document.getElementById('ai-input').value = msg; sendMessage(); }

function addMsg(text, type) {
  const msgs = document.getElementById('ai-messages');
  const div = document.createElement('div');
  div.className = 'msg '+type;
  const formattedText = text.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>');
  div.innerHTML = `<div class="msg-avatar ${type}">${type==='bot'?'👨‍⚕️':'👤'}</div><div class="msg-bubble">${formattedText}</div>`;
  msgs.appendChild(div); msgs.scrollTop = msgs.scrollHeight;
}

function getAIResponse(msg) {
  const m = msg.toLowerCase();
  for(const [key, resp] of Object.entries(aiResponses)) {
    if(m.includes(key)) return resp;
  }
  if(m.includes('fever')||m.includes('pain')||m.includes('sick')||m.includes('symptom')) return 'For medical symptoms, please consult a doctor in person. You can **book an appointment** through the Appointments module. If it\'s an emergency, call **102** immediately. 🏥';
  if(m.includes('thank')) return 'You\'re welcome! 😊 Stay healthy and don\'t hesitate to ask if you need anything else!';
  if(m.includes('bed')||m.includes('admit')) return 'For bed availability and admissions, please contact the front desk directly at **1800-123-4567** or visit the hospital. The system tracks admissions under Patient Management. 🛏️';
  return 'I understand your question about "'+msg+'". For specific medical advice, please consult our doctors directly. For system help, you can ask me about: patient registration, appointments, billing, pharmacy, lab reports, or medical records. 😊 Type "help" to see all topics!';
}
