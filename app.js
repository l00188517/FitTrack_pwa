// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.log('ServiceWorker registration failed:', error);
        });
    });
}

// Nutritional App Logic
document.addEventListener('DOMContentLoaded', () => {
    const foodEntryForm = document.getElementById('food-entry-form');
    const mealsList = document.getElementById('meals-list');
    const totalCaloriesSpan = document.getElementById('total-calories');
    const totalProteinSpan = document.getElementById('total-protein');
    const totalCarbsSpan = document.getElementById('total-carbs');
    const totalFatSpan = document.getElementById('total-fat');
    const logoutButton = document.getElementById('logout-button');

    let dailyMeals = JSON.parse(localStorage.getItem('dailyMeals')) || [];

    // --- Navigation Logic ---
    const navLinks = document.querySelectorAll('nav ul li a');
    const pages = document.querySelectorAll('.page');

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = event.target.getAttribute('href').substring(1);

            pages.forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById(targetId).classList.add('active');

            // Optionally update URL hash
            window.location.hash = targetId;

            // Re-render dashboard if navigating to it
            if (targetId === 'dashboard') {
                renderMeals();
            }
        });
    });

    // Activate dashboard on initial load or based on hash
    const initialPage = window.location.hash ? window.location.hash.substring(1) : 'dashboard';
    const activePageElement = document.getElementById(initialPage);
    if (activePageElement) {
        activePageElement.classList.add('active');
        if (initialPage === 'dashboard') {
            renderMeals();
        }
    } else {
        document.getElementById('dashboard').classList.add('active');
        renderMeals();
    }


    // --- Food Entry Logic ---
    foodEntryForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const foodName = document.getElementById('food-name').value;
        const calories = parseInt(document.getElementById('calories').value);
        const protein = parseFloat(document.getElementById('protein').value);
        const carbs = parseFloat(document.getElementById('carbs').value);
        const fat = parseFloat(document.getElementById('fat').value);

        const newMeal = {
            id: Date.now(), // Simple unique ID
            name: foodName,
            calories: calories,
            protein: protein,
            carbs: carbs,
            fat: fat,
            timestamp: new Date().toISOString()
        };

        dailyMeals.push(newMeal);
        localStorage.setItem('dailyMeals', JSON.stringify(dailyMeals)); // Save to local storage

        foodEntryForm.reset(); // Clear form
        renderMeals(); // Update display
    });

    // --- Render Meals and Summaries ---
    function renderMeals() {
        mealsList.innerHTML = ''; // Clear current list
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;

        dailyMeals.forEach(meal => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${meal.name} - ${meal.calories} kcal (${meal.protein}P/${meal.carbs}C/${meal.fat}F)</span>
                <button data-id="${meal.id}">Remove</button>
            `;
            mealsList.appendChild(listItem);

            totalCalories += meal.calories;
            totalProtein += meal.protein;
            totalCarbs += meal.carbs;
            totalFat += meal.fat;
        });

        totalCaloriesSpan.textContent = totalCalories;
        totalProteinSpan.textContent = totalProtein.toFixed(1);
        totalCarbsSpan.textContent = totalCarbs.toFixed(1);
        totalFatSpan.textContent = totalFat.toFixed(1);

        // Add event listener for remove buttons
        mealsList.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', (event) => {
                const mealIdToRemove = parseInt(event.target.dataset.id);
                dailyMeals = dailyMeals.filter(meal => meal.id !== mealIdToRemove);
                localStorage.setItem('dailyMeals', JSON.stringify(dailyMeals));
                renderMeals();
            });
        });
    }

    // --- Basic Logout ---
    logoutButton.addEventListener('click', () => {
        // In a real app, this would clear authentication tokens and redirect to a login page.
        // For this simple example, we'll just clear local storage and reload.
        localStorage.removeItem('dailyMeals');
        alert('You have been logged out.');
        dailyMeals = []; // Clear current data
        renderMeals();   // Update UI
        // In a real app, you'd navigate back to a login screen.
        // window.location.href = '/login.html';
    });

    // Initial render
    renderMeals();
});


