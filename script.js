document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('bmiForm');
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const weightError = document.getElementById('weightError');
    const heightError = document.getElementById('heightError');
    const submitButton = form.querySelector('button');
    const resultDiv = document.getElementById('result');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = darkModeToggle.querySelector('i');

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

    weightInput.addEventListener('input', validateInputs);
    heightInput.addEventListener('input', validateInputs);

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const weight = parseFloat(weightInput.value);
        const height = parseFloat(heightInput.value) / 100;

        const bmi = weight / (height * height);

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
});

