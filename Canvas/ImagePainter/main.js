(() => {
    let width = 700;
    let height = 500;
    const image = new Image();
    document.querySelector("#fileUploader").addEventListener("change", (e) => {
        let file = document.querySelector('input[type=file]');
        let reader = new FileReader();
        if (file.files[0]) {
            reader.onload = (e) => {
                image.src = e.target.result;

                let img = new Image();
                img.src = e.target.result;

                img.onload = function (e) {
                    width = e.target.width;
                    height = e.target.height;
                }
            };
            reader.readAsDataURL(file.files[0]);
        }
    });

    image.addEventListener("load", () => {
        const canvas = document.querySelector("#imagePainter");
        const ctx = canvas.getContext("2d");
        canvas.width = 1920;
        canvas.height = 1080;
        const particleArray = [];
        const numberOfParticles = 8000;
        let mappedImage = [];
        //todo clear canvas before new image draw
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < canvas.height; y++) {
            let row = [];
            for (let x = 0; x < canvas.width; x++) {
                const red = pixels.data[(y * 4 * pixels.width) + (x * 4)];
                const green = pixels.data[(y * 4 * pixels.width) + (x * 4 + 1)];
                const blue = pixels.data[(y * 4 * pixels.width) + (x * 4 + 2)];
                const brightness = calculateRelativeBrightness(red, green, blue);
                const color = 'rgb(' + red + ',' + green + ',' + blue + ')';
                // const color = 'white';
                const cell = [
                    {
                        cellBrightness: brightness,
                        color
                    }

                ];
                row.push(cell);
            }
            mappedImage.push(row);
        }

        function calculateRelativeBrightness(red, green, blue) {
            return Math.sqrt(
                (red * red) * 0.299 +
                (green * green) * 0.587 +
                (blue * blue) * 0.114
            ) / 100
        }

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = 0;
                this.speed = 0;
                this.velocity = Math.random() * .5;
                this.size = Math.random() * .5 + 1;
                this.position1 = Math.floor(this.y);
                this.position2 = Math.floor(this.x);
                this.angle = 0;
            }

            update() {
                this.position1 = Math.floor(this.y);
                this.position2 = Math.floor(this.x);
                if (mappedImage[this.position1] && mappedImage[this.position1][this.position2]) {
                    this.speed = mappedImage[this.position1][this.position2][0].cellBrightness;
                }

                let movement = (2.5 - this.speed) + this.velocity;
                this.angle += this.speed;

                this.y += movement;
                // this.x += movement;

                // this.y += movement + Math.sin(this.angle) * 4;
                // this.x += movement + Math.sin(this.angle) * 2;
                //
                // if (this.y >= canvas.height) {// fall on y axis
                //     this.y = 0;
                //     this.x = Math.random() * canvas.width;
                // }

                if (this.x >= canvas.width) {// fall on x axis
                    this.x = 0;
                    this.y = Math.random() * canvas.height;
                }
            }

            draw() {
                ctx.beginPath();
                if (mappedImage[this.position1] && mappedImage[this.position1][this.position2]) {
                    ctx.fillStyle = mappedImage[this.position1][this.position2][0].color;
                }
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function init() {
            for (let i = 0; i < numberOfParticles; i++) {
                particleArray.push(new Particle)
            }
        }

        init();

        function animate() {
            ctx.globalAlpha = 0.05;
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 0.2;
            for (let i = 0; i < particleArray.length; i++) {
                particleArray[i].update();
                ctx.globalAlpha = particleArray[i].speed * .5;
                particleArray[i].draw();
            }
            requestAnimationFrame(animate);
        }

        animate();
    });
})();