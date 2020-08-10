const canvas = document.getElementById("particle1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particles = [];
let adjustX = 6;
let adjustY = 0;

const mouse = {
    x: null,
    y: null,
    radius: 250
};

window.addEventListener("mousemove", function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

ctx.fillStyle = "white";
ctx.font = "30px Roboto";
ctx.fillText("CSS", 0, 40);
ctx.strokeStyle = "white";
// ctx.strokeRect(0, 0, 100, 100);
const textCoordinates = ctx.getImageData(0, 0, 100, 100);

class Particle {
    constructor(x, y) {
        this.x = x + 100;
        this.y = y;
        this.size = 3;
        this.baseX = this.x;
        this.baseY = this.y;
        this.distance = 0;
        this.density = (Math.random() * 40) + 5
    }

    draw() {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);//make a dots
        ctx.closePath();
        ctx.fill();


        // ctx.drawImage('output-onlinepngtools.png', 10, 10);
    }

    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / this.distance;
        let forceDirectionY = dy / this.distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - this.distance) / maxDistance; // return value between 0 and 1 to make particle slow down as it goes fare
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (this.distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 10;
            }

            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 10;
            }
        }
    }
}

function init() {
    particles = [];
    for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
        for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4 + 3)] > 128) {
                let positionX = x + adjustX;
                let positionY = y + adjustY;
                particles.push(new Particle(positionX * 15, positionY * 15))
            }

        }
    }

    // for (let i = 0; i < 20; i++) {
    //     let x = Math.random() * canvas.width;
    //     let y = Math.random() * canvas.height;
    //     particles.push(new Particle(x, y));
    // }
}

init();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update();
    }
    connect();
    requestAnimationFrame(animate);
}

animate();

function connect() {
    let opacity = 0.1;
    for (let a = 0; a < particles.length; a++) {
        for (let b = 0; b < particles.length; b++) {
            let dx = particles[a].x - particles[b].x;
            let dy = particles[a].y - particles[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (particles[b].distance > 250) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            } else {
                // ctx.strokeStyle = `rgba(255, 255, 126, ${opacity})`;
                // ctx.strokeStyle = `rgba(240, 255, 0,  ${opacity})`;
                ctx.strokeStyle = `rgba(244, 247, 118, ${opacity})`;
                // ctx.strokeStyle = `rgba(212, 175, 55, ${opacity})`;
                // ctx.strokeStyle = `rgba(240, 54, 12, ${opacity})`;
            }

            if (distance < 40) {
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}
