// 1. SET TAHUN & INITIAL LOAD (Auto-Load Data & Posisi Kursor)
document.getElementById('y').textContent = new Date().getFullYear();

window.addEventListener('load', function() {
    const ids = ['cvarBox', 'addonBox', 'scriptBox'];
    ids.forEach(id => {
        const savedData = localStorage.getItem('auto_' + id);
        if (savedData) document.getElementById(id).value = savedData;
        
        const pos = localStorage.getItem('pos_' + id);
        if (pos) document.getElementById(id).setSelectionRange(pos, pos);
    });
});

// 2. FUNGSI BUTANG (Save, Copy, Clear, Download)
function saveData(id) {
    localStorage.setItem('auto_' + id, document.getElementById(id).value);
}

function copyIt(id) {
    const t = document.getElementById(id);
    t.select();
    t.setSelectionRange(0, 99999);
    document.execCommand('copy');
    alert('Berjaya disalin!');
}

function clearIt(id) {
    if(confirm('Padam semua kandungan?')) {
        document.getElementById(id).value = '';
        localStorage.removeItem('auto_' + id);
    }
}

function dl(id, filename) {
    const val = document.getElementById(id).value;
    if(!val) return alert('Kotak kosong!');
    const blob = new Blob([val], {type: 'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
}

// 3. EVENT LISTENERS: SMART LOGIC (Auto-Indent, SV_ Replace, dsb)
document.querySelectorAll('textarea').forEach(t => {
    // Glow Focus & Blur (Simpan posisi kursor)
    t.addEventListener('focus', () => {
        t.style.borderColor = '#58a6ff';
        t.style.boxShadow = '0 0 12px rgba(88, 166, 255, 0.4)';
    });
    t.addEventListener('blur', () => {
        t.style.borderColor = '#30363d';
        t.style.boxShadow = 'none';
        localStorage.setItem('pos_' + t.id, t.selectionStart);
        // Buang log console (] atau (con))
        t.value = t.value.replace(/^(\] |\(con\) ).*$/gm, "");
    });

    // Auto-Scroll & Format SV_/CL_ & Auto-Trim Space
    t.addEventListener('input', () => {
        saveData(t.id);
        if(t.selectionStart === t.value.length) t.scrollTop = t.scrollHeight;
        if (t.value.startsWith(' ')) t.value = t.value.trimStart();
        t.value = t.value.replace(/\b(SV_|CL_)\w+/g, m => m.toLowerCase());
    });

    // Smart Paste: Auto-Indent 4 Spaces & Prevent Double Paste
    let lastPaste = "";
    t.addEventListener('paste', e => {
        const txt = e.clipboardData.getData('text');
        if (txt === lastPaste) e.preventDefault();
        lastPaste = txt;
        
        setTimeout(() => {
            const lines = t.value.split('\n');
            t.value = lines.map(l => l.trim() && !l.startsWith(' ') ? "    " + l : l).join('\n');
        }, 50);
    });

    // Shortcuts: Ctrl+F (Search) & Smart Comment (/*) & Semi-colon Fix
    t.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            const search = prompt("Cari perkataan:");
            if (search) {
                const count = this.value.split(search).length - 1;
                alert(`Jumpa ${count} kali perkataan "${search}"`);
            }
        }
        if (e.key === ';' && t.value[t.selectionStart] === ';') {
            e.preventDefault();
            t.selectionStart++; t.selectionEnd = t.selectionStart;
        }
    });

    t.addEventListener('keypress', e => {
        if (e.key === '*') {
            const pos = t.selectionStart;
            if (t.value[pos-1] === '/') {
                t.value = t.value.substring(0, pos) + " * */" + t.value.substring(pos);
                t.setSelectionRange(pos + 2, pos + 2);
            }
        }
    });

    // Idle Lock (10 Minit)
    let lockTimer;
    t.addEventListener('keydown', () => {
        t.readOnly = false;
        clearTimeout(lockTimer);
        lockTimer = setTimeout(() => { t.readOnly = true; alert("Editor Locked (Idle)"); }, 600000);
    });

    // Drag & Drop Support
    t.addEventListener('dragover', e => { e.preventDefault(); t.style.background = '#1c2128'; });
    t.addEventListener('dragleave', () => { t.style.background = '#010409'; });
    t.addEventListener('drop', e => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        const reader = new FileReader();
        reader.onload = (f) => { t.value = f.target.result; t.dispatchEvent(new Event('input')); };
        reader.readAsText(file);
    });
    
    t.addEventListener('contextmenu', () => t.select());
    t.style.scrollBehavior = 'smooth';
});

// --- GOOGLE AI VISUAL EFFECTS ---

// 1. Google AI Gradient Bar (Top)
(function injectGoogleAIBar() {
    const style = document.createElement('style');
    style.innerHTML = `#google-ai-bar { position: fixed; top: 0; left: 0; width: 0%; height: 3px; z-index: 100000; background: linear-gradient(90deg, #4285F4, #EA4335, #FBBC05, #34A853, #4285F4); background-size: 200% 100%; transition: width 0.3s ease-out, opacity 0.5s ease; animation: aiBarMove 2s linear infinite; opacity: 0; } @keyframes aiBarMove { 0% { background-position: 200% 0; } 100% { background-position: 0 0; } }`;
    document.head.appendChild(style);

    const bar = document.createElement('div');
    bar.id = 'google-ai-bar';
    document.body.prepend(bar);

    window.triggerGoogleBar = function() {
        bar.style.opacity = '1'; bar.style.width = '30%';
        setTimeout(() => { bar.style.width = '70%'; }, 400);
        setTimeout(() => { 
            bar.style.width = '100%'; 
            setTimeout(() => { bar.style.opacity = '0'; bar.style.width = '0%'; }, 400);
        }, 800);
    };
    window.addEventListener('load', triggerGoogleBar);
    document.querySelectorAll('button').forEach(btn => btn.addEventListener('click', triggerGoogleBar));
})();

// 2. Kursor & Border Flow (Warna Berpusing)
(function initGoogleBorderAndCursor() {
    const style = document.createElement('style');
    style.innerHTML = `:root { --google-border: #4285F4; --warna-kursor: #4285F4; } textarea { caret-color: var(--warna-kursor) !important; transition: border-color 0.8s, box-shadow 0.8s; } textarea:focus { border-color: var(--google-border) !important; box-shadow: 0 0 12px var(--google-border) !important; } .google-ai-rotate { animation: borderPusing 1.2s linear infinite !important; } @keyframes borderPusing { 0% { border-color: #4285F4; } 50% { border-color: #FBBC05; } 100% { border-color: #4285F4; } }`;
    document.head.appendChild(style);

    setInterval(() => {
        const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];
        const c = colors[Math.floor(Math.random()*4)];
        document.documentElement.style.setProperty('--google-border', c);
        document.documentElement.style.setProperty('--warna-kursor', c);
    }, 2000);

    document.querySelectorAll('textarea').forEach(t => {
        t.addEventListener('focus', function() {
            this.classList.add('google-ai-rotate');
            setTimeout(() => this.classList.remove('google-ai-rotate'), 1500);
        });
    });
})();

// 3. Shimmer Line & Loading Dots
(function injectExtraVisuals() {
    document.querySelectorAll('textarea').forEach(t => {
        const line = document.createElement('div');
        line.className = 'shimmer-line';
        t.parentNode.insertBefore(line, t.nextSibling);
    });

    document.querySelectorAll('.card').forEach((card, i) => {
        const dots = document.createElement('div');
        dots.className = 'google-dots';
        dots.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div>';
        card.prepend(dots);
        
        // Entrance Animation
        card.style.opacity = '0'; card.style.transform = 'translateY(20px)';
        setTimeout(() => { card.style.transition = 'all 0.6s ease'; card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, i * 200);
    });
})();

// 4. Button Particles (Confetti)
document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', (e) => {
        for(let i=0; i<5; i++) {
            const p = document.createElement('div');
            p.style = `position:fixed; width:4px; height:4px; border-radius:50%; background:#4285F4; left:${e.clientX}px; top:${e.clientY}px; z-index:9999; pointer-events:none;`;
            document.body.appendChild(p);
            p.animate([{transform:'translate(0,0)', opacity:1}, {transform:`translate(${(Math.random()-0.5)*50}px, ${(Math.random()-0.5)*50}px)`, opacity:0}], 600);
            setTimeout(() => p.remove(), 600);
        }
    });
});

