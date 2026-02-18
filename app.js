
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
let score = 0;
const claw = { x: 300, y: 40, len: 30, dropping: false, grabbing: false };
const prizes = Array.from({length:5}, (_,i)=>({ x: 80+i*110, y: 340, w:40, h:40, held:false, color: ['#ef4444','#10b981','#f59e0b','#3b82f6','#8b5cf6'][i] }));
let frame = 0;
function draw() {
  ctx.fillStyle = '#111827'; ctx.fillRect(0,0,600,400);
  ctx.fillStyle='#374151'; ctx.fillRect(0,360,600,40);
  prizes.forEach(p => { if (!p.held) { ctx.fillStyle=p.color; ctx.fillRect(p.x,p.y,p.w,p.h); } });
  ctx.fillStyle='#e5e7eb'; ctx.strokeStyle='#e5e7eb';
  ctx.fillRect(claw.x-15, claw.y-10, 30, 10);
  ctx.beginPath(); ctx.moveTo(claw.x, claw.y); ctx.lineTo(claw.x, claw.y+claw.len); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(claw.x, claw.y+claw.len); ctx.lineTo(claw.x-10, claw.y+claw.len+15); ctx.lineTo(claw.x+10, claw.y+claw.len+15); ctx.stroke();
  const held = prizes.find(p=>p.held);
  if (held) { ctx.fillStyle=held.color; ctx.fillRect(claw.x-10, claw.y+claw.len+15, 20, 20); }
}
function update() {
  if (claw.dropping) {
    claw.len += 4;
    if (claw.len > 280 && !claw.grabbing) { claw.grabbing=true; claw.dropping=false; }
    if (claw.grabbing) {
      const hit = prizes.find(p => !p.held && Math.abs(claw.x-(p.x+p.w/2))<30 && Math.abs(claw.y+claw.len-p.y-20)<40);
      if (hit) { hit.held=true; score+=10; document.getElementById('score').textContent='Score: '+score; }
    }
  } else {
    if (claw.len > 30) claw.len -= 4;
    else { claw.grabbing=false; prizes.forEach(p=>p.held=false); }
    // sway
    claw.x = 300 + Math.sin(frame/30)*200;
  }
  frame++;
}
function loop() { update(); draw(); requestAnimationFrame(loop); }
document.getElementById('drop').addEventListener('click', () => { if (!claw.dropping && claw.len<=35) claw.dropping=true; });
loop();
