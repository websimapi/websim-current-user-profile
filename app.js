const STORAGE_KEY = 'demo_current_user';

function qs(sel, root=document) { return root.querySelector(sel); }

function getDefaultAvatar(name){
  // use pravatar with a hash fallback
  const i = Math.abs(hashCode(name||'demo')) % 70 + 1;
  return `https://i.pravatar.cc/128?img=${i}`;
}

function hashCode(str){
  let h=0;
  for(let i=0;i<str.length;i++){ h = ((h<<5)-h)+str.charCodeAt(i); h |= 0; }
  return h;
}

function loadUser(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return null;
    return JSON.parse(raw);
  }catch(e){ return null; }
}
function saveUser(user){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}
function clearUser(){
  localStorage.removeItem(STORAGE_KEY);
}

function renderCurrentUser(){
  const container = qs('#current-user');
  const user = loadUser();
  container.innerHTML = '';
  const logoutBtn = qs('#logoutBtn');
  if(!user){
    const el = document.createElement('div');
    el.className = 'empty';
    const a = document.createElement('div');
    a.className = 'avatar';
    a.style.borderRadius = '8px';
    a.style.background = '#f0f2f5';
    const txt = document.createElement('div');
    txt.innerHTML = '<div style="font-weight:600">Not signed in</div><div class="sub">No user currently logged in</div>';
    el.appendChild(a);
    el.appendChild(txt);
    container.appendChild(el);
    logoutBtn.hidden = true;
    return;
  }

  const img = document.createElement('img');
  img.className = 'avatar';
  img.alt = user.name || 'User avatar';
  img.src = user.avatar || getDefaultAvatar(user.name);
  img.onerror = () => { img.src = getDefaultAvatar(user.name); };

  const info = document.createElement('div');
  const nm = document.createElement('div');
  nm.className = 'name';
  nm.textContent = user.name || 'User';
  const sub = document.createElement('div');
  sub.className = 'sub';
  sub.textContent = user.email || 'Signed in';
  info.appendChild(nm);
  info.appendChild(sub);

  container.appendChild(img);
  container.appendChild(info);
  logoutBtn.hidden = false;
}

function initForm(){
  const form = qs('#signinForm');
  const nameInput = qs('#name');
  const avatarInput = qs('#avatar');
  const fillDemo = qs('#fillDemo');
  const logoutBtn = qs('#logoutBtn');

  // prefill if user exists
  const user = loadUser();
  if(user){
    nameInput.value = user.name || '';
    avatarInput.value = user.avatar || '';
  }

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = nameInput.value.trim();
    const avatar = avatarInput.value.trim();
    if(!name) return;
    const stored = { name, avatar: avatar || getDefaultAvatar(name), email: `${slugify(name)}@example.com` };
    saveUser(stored);
    renderCurrentUser();
    // clear inputs but keep values visible
  });

  fillDemo.addEventListener('click', ()=>{
    const demoName = 'Alex Morgan';
    nameInput.value = demoName;
    avatarInput.value = `https://i.pravatar.cc/128?u=demo-${Date.now()}`;
  });

  logoutBtn.addEventListener('click', ()=>{
    clearUser();
    renderCurrentUser();
  });
}

function slugify(s){ return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }

function main(){
  renderCurrentUser();
  initForm();
}

document.addEventListener('DOMContentLoaded', main);

