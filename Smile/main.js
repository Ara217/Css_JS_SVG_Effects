const NF = 32;
const face = document.querySelector('rect');
const mounth = document.querySelector('path');
const rmax = .5 * face.getAttribute('width');
const data = mounth.getAttribute('d').replace(/M|C/g, '').trim().split(/\s+/).map(c => +c);
const cpy_ini = data[3];
const cpy_range = 2 * (data[1] - data[3]);
let rID = null;
let f = 0;
let dir = -1;

function stopAni() {
    cancelAnimationFrame(rID);
    rID = null;
}

function timing(k) {
    return 1 - Math.pow(1 - k, 2)
}

function update() {
    f += dir;
    let k = f / NF, cpy = cpy_ini + timing(k) * cpy_range;

    face.setAttribute('rx', (timing(k) * rmax).toFixed(2));
    mounth.setAttribute('d',
        `M${data.slice(0, 2)}
		 C${data[2]} ${cpy} 
		 ${data[4]} ${cpy} 
		 ${data.slice(-2)}`
    );

    if (!(f % NF)) {
        stopAni();
        return
    }

    rID = requestAnimationFrame(update)
}

face.addEventListener('click', e => {
    if (rID) stopAni();
    dir *= -1;
    update();
}, false);