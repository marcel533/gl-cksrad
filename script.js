let terms = [], isDrawing = false, swInterval, swElapsed = 0, wheelRot = 0;

// Security Setup
const n1 = Math.floor(Math.random() * 10), n2 = Math.floor(Math.random() * 10);
document.getElementById('n1').innerText = n1;
document.getElementById('n2').innerText = n2;

function verify() {
    const input = parseInt(document.getElementById('captcha-input').value);
    if(input === (n1 + n2)) {
        document.getElementById('auth-overlay').style.display = 'none';
        document.getElementById('main-wrapper').classList.remove('locked');
        syncData();
        setInterval(() => { 
            document.getElementById('clock').innerText = new Date().toLocaleTimeString(); 
        }, 1000);
    }
}

function show(id) {
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
    document.getElementById(id).style.display = 'flex';
    if(id === 'draw-view') initPaint();
}

function syncData() {
    terms = document.getElementById('itemInput').value.split(',').map(t => t.trim()).filter(t => t !== "");
    drawWheel();
}

// BINGO
function generateBingo() {
    const grid = document.getElementById('bingo-grid');
    grid.innerHTML = "";
    let pool = [...terms].sort(() => 0.5 - Math.random());
    for(let i=0; i<16; i++) {
        const c = document.createElement('div');
        c.className = 'bingo-cell';
        c.innerText = pool[i] || "X";
        grid.appendChild(c);
    }
}

function downloadBingo() {
    const area = document.getElementById('bingo-capture-area');
    html2canvas(area).then(canvas => {
        const link = document.createElement('a');
        link.download = 'bingo_karte.jpg';
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.click();
    });
}

// WHEEL
function drawWheel() {
    const c = document.getElementById('wheelCanvas'), ctx = c.getContext('2d');
    if(!terms.length) return;
    const arc = (Math.PI*2) / terms.length;
    ctx.clearRect(0,0,500,500);
    terms.forEach((t, i) => {
        ctx.fillStyle = i % 2 === 0 ? "#00ff88" : "#00d2ff";
        ctx.beginPath(); ctx.moveTo(250,250); ctx.arc(250,250,240, i*arc, (i+1)*arc); ctx.fill();
        ctx.save(); ctx.translate(250,250); ctx.rotate(i*arc + arc/2);
        ctx.fillStyle = "#000"; ctx.font = "bold 14px Inter"; ctx.textAlign = "right";
        ctx.fillText(t.slice(0,15), 230, 5); ctx.restore();
    });
}

function spinWheel() {
    wheelRot += Math.floor(Math.random() * 360) + 1800;
    document.getElementById('wheelCanvas').style.transform = `rotate(${wheelRot}deg)`;
}

// DRAW
function initPaint() {
    const c = document.getElementById('paintCanvas'), ctx = c.getContext('2d');
    c.width = c.offsetWidth; c.height = c.offsetHeight;
    const draw = (e) => {
        if(!isDrawing) return;
        const r = c.getBoundingClientRect();
        const x = (e.clientX || (e.touches && e.touches[0].clientX)) - r.left;
        const y = (e.clientY || (e.touches && e.touches[0].clientY)) - r.top;
        ctx.lineWidth = document.getElementById('pen-size').value;
        ctx.lineCap = "round"; ctx.strokeStyle = document.getElementById('pen-color').value;
        ctx.lineTo(x, y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x,y);
    };
    c.onmousedown = (e) => { isDrawing = true; ctx.beginPath(); draw(e); };
    c.onmousemove = draw; window.onmouseup = () => isDrawing = false;
}

function clearCanvas() { const c = document.getElementById('paintCanvas'); c.getContext('2d').clearRect(0,0,c.width,c.height); }

// TIMER
function startT() { if(!swInterval) { let s = Date.now()-swElapsed; swInterval = setInterval(() => { swElapsed = Date.now()-s; let d = new Date(swElapsed); document.getElementById('timer').innerText = d.getUTCMinutes().toString().padStart(2,'0')+":"+d.getUTCSeconds().toString().padStart(2,'0')+"."+Math.floor(d.getUTCMilliseconds()/10).toString().padStart(2,'0'); }, 30); } }
function stopT() { clearInterval(swInterval); swInterval = null; }
function resetT() { stopT(); swElapsed = 0; document.getElementById('timer').innerText = "00:00.00"; }
