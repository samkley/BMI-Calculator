document.addEventListener('DOMContentLoaded', function () {
    // Form elements
    const form = document.getElementById('bmiForm');
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const unitToggle = document.getElementById('unitToggle');
    const weightError = document.getElementById('weightError');
    const heightError = document.getElementById('heightError');
    const submitButton = form.querySelector('button');
    const resultDiv = document.getElementById('result');

    // Dark Mode elements
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = darkModeToggle.querySelector('i');

    // Color picker elements for custom cursor
    const colorPickerButton = document.getElementById('colorPickerButton');
    const colorPicker = document.getElementById('colorPicker');
    const rainbowOptionButton = document.getElementById('rainbowOptionButton');

    // Setup canvas for cursor effects
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);

    canvas.id = 'cursorCanvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.pointerEvents = 'none';

    let hue = 0;
    let cursorColor = `hsl(0, 100%, 50%)`; // Default color
    let isRainbowMode = false; // Toggle for rainbow mode
    const particles = [];

    // Validate input fields
    function validateInputs() {
        const weight = parseFloat(weightInput.value);
        const height = parseFloat(heightInput.value);
        let isValid = true;

        if (isNaN(weight) || weight <= 0) {
            weightError.textContent = 'Please enter a valid weight.';
            isValid = false;
        } else {
            weightError.textContent = '';
        }

        if (isNaN(height) || height <= 0) {
            heightError.textContent = 'Please enter a valid height.';
            isValid = false;
        } else {
            heightError.textContent = '';
        }

        submitButton.disabled = !isValid;
    }

    // Calculate BMI based on input and selected unit system
    function calculateBMI(weight, height, isMetric) {
        if (isMetric) {
            height = height / 100; // Convert height to meters
            return weight / (height * height);
        } else {
            return (weight / (height * height)) * 703; // Imperial formula
        }
    }

    // Toggle between metric and imperial units
    unitToggle.addEventListener('change', function () {
        const isMetric = unitToggle.value === 'metric';
        weightInput.placeholder = isMetric ? 'Enter your weight in kg' : 'Enter your weight in lbs';
        heightInput.placeholder = isMetric ? 'Enter your height in cm' : 'Enter your height in inches';
        validateInputs();
    });

    // Validate inputs as user types
    weightInput.addEventListener('input', validateInputs);
    heightInput.addEventListener('input', validateInputs);

    // Submit BMI form and display results
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const weight = parseFloat(weightInput.value);
        const height = parseFloat(heightInput.value);
        const isMetric = unitToggle.value === 'metric';
        const bmi = calculateBMI(weight, height, isMetric);

        let bmiCategory = '';
        if (bmi < 18.5) {
            bmiCategory = 'Underweight';
        } else if (bmi < 24.9) {
            bmiCategory = 'Normal weight';
        } else if (bmi < 29.9) {
            bmiCategory = 'Overweight';
        } else {
            bmiCategory = 'Obese';
        }

        resultDiv.innerHTML = `
            <p>Your BMI is: <strong>${bmi.toFixed(2)}</strong></p>
            <p>Category: <strong>${bmiCategory}</strong></p>
        `;
    });

    // Reset form and results
    form.addEventListener('reset', function () {
        resultDiv.innerHTML = '';
        weightError.textContent = '';
        heightError.textContent = '';
        submitButton.disabled = true;
    });

    // Dark Mode Toggle
    darkModeToggle.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            darkModeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            darkModeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    });

    // Handle color picker toggle for cursor color
    colorPickerButton.addEventListener('click', function () {
        const isVisible = colorPicker.style.display === 'block';
        colorPicker.style.display = isVisible ? 'none' : 'block'; // Toggle visibility
    });

    // Handle color selection
    colorPicker.addEventListener('input', function () {
        cursorColor = colorPicker.value; // Set the cursor color based on user selection
        isRainbowMode = false; // Turn off rainbow mode when a color is selected
        rainbowOptionButton.textContent = 'Rainbow'; // Reset button text
        rainbowOptionButton.style.display = 'block'; // Show rainbow button after color pick
    });

    // Toggle rainbow mode
    rainbowOptionButton.addEventListener('click', function () {
        isRainbowMode = !isRainbowMode; // Toggle rainbow mode
        cursorColor = isRainbowMode ? `hsl(${hue}, 100%, 50%)` : `hsl(0, 100%, 50%)`;
        rainbowOptionButton.textContent = isRainbowMode ? 'Stop Rainbow' : 'Rainbow'; // Toggle button text
    });

    // Particle class to handle custom cursor effects
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 5 + 1;
            this.color = isRainbowMode ? `hsl(${hue}, 100%, 50%)` : cursorColor; // Rainbow or selected color
            this.velocityX = Math.random() * 2 - 1;
            this.velocityY = Math.random() * 2 - 1;
        }

        update() {
            this.x += this.velocityX;
            this.y += this.velocityY;
            this.size *= 0.95; // Shrink the particles over time
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color; // Set particle color (rainbow or selected color)
            ctx.fill();
        }
    }

    // Handle particles' movement and drawing
    function handleParticles() {
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].size < 0.5) {
                particles.splice(i, 1);
            }
        }
    }

    // Mousemove event for drawing cursor trail and particles
    window.addEventListener('mousemove', function (event) {
        const x = event.clientX;
        const y = event.clientY;

        // Rainbow line effect
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 1, y + 1);
        ctx.strokeStyle = cursorColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Fireworks effect with both rainbow and gold sparkles
        for (let i = 0; i < 5; i++) {
            particles.push(new Particle(x, y));
        }

        hue += 5; // Increase hue for rainbow effect
        if (hue >= 360) hue = 0; // Reset hue to keep it within range
    });

    // Adjust canvas size on window resize
    window.addEventListener('resize', function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // Animate particles
    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        handleParticles();
        requestAnimationFrame(animate);
    }

    animate();
});
