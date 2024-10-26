const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ff8";

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.originalColor = color; // Guardar el color original
        this.text = text;
        this.speed = speed;
        this.dx = (Math.random() > 0.5 ? 1 : -1) * this.speed; // Dirección X aleatoria
        this.dy = (Math.random() > 0.5 ? 1 : -1) * this.speed; // Dirección Y aleatoria
        this.colliding = false; // Bandera para colisiones
        this.flashDuration = 0; // Temporizador para el "flash" de color azul
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);
        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context, circles) {
        // Dibujar el círculo
        this.draw(context);
        // Actualizar la posición X
        this.posX += this.dx;
        // Cambiar la dirección si el círculo llega al borde del canvas en X
        if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
            this.dx = -this.dx;
        }
        // Actualizar la posición Y
        this.posY += this.dy;
        // Cambiar la dirección si el círculo llega al borde del canvas en Y
        if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
            this.dy = -this.dy;
        }

        // Comprobar colisiones con otros círculos
        this.checkCollisions(circles);

        // Reducir la duración del flash si es necesario
        if (this.flashDuration > 0) {
            this.flashDuration--;
        } else {
            this.color = this.originalColor; // Volver al color original
        }
    }

    checkCollisions(circles) {
        for (let i = 0; i < circles.length; i++) {
            let other = circles[i];
            if (other !== this) {
                let distX = this.posX - other.posX;
                let distY = this.posY - other.posY;
                let distance = Math.sqrt(distX * distX + distY * distY);
                
                // Comprobar si hay colisión
                if (distance < this.radius + other.radius) {
                    // Cambiar color a azul temporalmente
                    this.color = "#0000FF";
                    other.color = "#0000FF";
                    this.flashDuration = 10; // Duración del flash en frames
                    other.flashDuration = 10;

                    // Intercambiar velocidades (rebote en dirección contraria)
                    let tempDx = this.dx;
                    let tempDy = this.dy;
                    this.dx = other.dx;
                    this.dy = other.dy;
                    other.dx = tempDx;
                    other.dy = tempDy;

                    // Separar los círculos para evitar "atraparse"
                    let overlap = this.radius + other.radius - distance;
                    let smallerMass = this.radius < other.radius ? this : other;
                    smallerMass.posX += distX / distance * overlap / 2;
                    smallerMass.posY += distY / distance * overlap / 2;
                }
            }
        }
    }
}

// Crear un array para almacenar N círculos
let circles = [];

// Función para generar círculos aleatorios
function generateCircles(n) {
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 30 + 20; // Radio entre 20 y 50
        let x = Math.random() * (window_width - radius * 2) + radius;
        let y = Math.random() * (window_height - radius * 2) + radius;
        let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Color aleatorio
        let speed = Math.random() * 4 + 1; // Velocidad entre 1 y 5
        let text = `C${i + 1}`; // Etiqueta del círculo
        circles.push(new Circle(x, y, radius, color, text, speed));
    }
}

// Función para animar los círculos
function animate() {
    ctx.clearRect(0, 0, window_width, window_height); // Limpiar el canvas
    circles.forEach(circle => {
        circle.update(ctx, circles); // Actualizar cada círculo, pasamos el array de círculos
    });
    requestAnimationFrame(animate); // Repetir la animación
}

// Generar N círculos y comenzar la animación
generateCircles(10); // Puedes cambiar el número de círculos aquí
animate();
