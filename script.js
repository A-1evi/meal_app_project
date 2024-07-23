const apiURL = 'https://www.themealdb.com/api/json/v1/1';

// Fetch meals by search term
async function fetchMealsBySearch(term) {
    const response = await fetch(`${apiURL}/search.php?s=${term}`);
    const data = await response.json();
    return data.meals;
}

// Fetch meal details by ID
async function fetchMealById(id) {
    const response = await fetch(`${apiURL}/lookup.php?i=${id}`);
    const data = await response.json();
    return data.meals[0];
}

// Render meal search results
function renderMealResults(meals) {
    const resultsContainer = document.getElementById('meal-results');
    resultsContainer.innerHTML = '';

    if (meals) {
        meals.forEach(meal => {
            const mealCard = document.createElement('div');
            mealCard.classList.add('bg-white', 'p-4', 'm-5' ,'rounded-lg', 'shadow-md');

            mealCard.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-full h-44 object-cover rounded-lg">
                <h3 class="text-xl mt-2">${meal.strMeal}</h3>
                <button class="mt-2 p-2 bg-blue-300 text-white rounded favorite-btn" data-id="${meal.idMeal}">Add to Favorites</button>
            `;

            mealCard.addEventListener('click', () => {
                showMealDetails(meal.idMeal);
            });

            mealCard.querySelector('.favorite-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                addToFavorites(meal.idMeal);
            });

            resultsContainer.appendChild(mealCard);
        });
    } else {
        resultsContainer.innerHTML = '<p>No results found.</p>';
    }
}

// Show meal details
async function showMealDetails(mealId) {
    const meal = await fetchMealById(mealId);
    const mealDetailContainer = document.getElementById('meal-detail');
    
    let ingredients = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== '') {
            ingredients += `<li class = "mb-2 font-semibold ">${ingredient} - ${measure}</li>`;
        }
    }
    
    mealDetailContainer.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-1/2 h-96 shadow-lg mx-auto object-cover rounded-lg">
        <h2 class="text-5xl font-bold m-4">${meal.strMeal}</h2>
        <p class="mx-4 my-8 p-4">${meal.strInstructions}</p>

        <ol class="m-4 p-4">
            ${ingredients}
        </ol>
    `;

    document.getElementById('home-section').classList.add('hidden');
    document.getElementById('favorites-section').classList.add('hidden');
    document.getElementById('meal-detail-section').classList.remove('hidden');
}

// Add meal to favorites
function addToFavorites(mealId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(mealId)) {
        favorites.push(mealId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Added to favorites');
    } else {
        alert('Already in favorites');
    }
}

// Render favorite meals
async function renderFavoriteMeals() {
    const favoritesContainer = document.getElementById('favorite-meals');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.length > 0) {
        favoritesContainer.innerHTML = '';
        for (const mealId of favorites) {
            const meal = await fetchMealById(mealId);
            const mealCard = document.createElement('div');
            mealCard.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-md');

            mealCard.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-full h-40 object-cover rounded-lg">
                <h3 class="text-xl mt-2">${meal.strMeal}</h3>
                <button class="mt-2 p-2 bg-red-500 text-white rounded remove-btn" data-id="${meal.idMeal}">Remove from Favorites</button>
            `;

            mealCard.querySelector('.remove-btn').addEventListener('click', () => {
                removeFromFavorites(meal.idMeal);
            });

            favoritesContainer.appendChild(mealCard);
        }
    } else {
        favoritesContainer.innerHTML = '<p>No favorite meals yet.</p>';
    }
}

// Remove meal from favorites
function removeFromFavorites(mealId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(id => id !== mealId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderFavoriteMeals();
}

// Search functionality
document.getElementById('search').addEventListener('input', async (e) => {
    const term = e.target.value;
    const meals = await fetchMealsBySearch(term);
    renderMealResults(meals);
});

// Back button functionality
document.getElementById('back-btn').addEventListener('click', () => {
    document.getElementById('home-section').classList.remove('hidden');
    document.getElementById('meal-detail-section').classList.add('hidden');
    document.getElementById('favorites-section').classList.add('hidden');
});

// Navigation buttons functionality
document.getElementById('home-btn').addEventListener('click', () => {
    document.getElementById('home-section').classList.remove('hidden');
    document.getElementById('meal-detail-section').classList.add('hidden');
    document.getElementById('favorites-section').classList.add('hidden');
});

document.getElementById('favorites-btn').addEventListener('click', () => {
    document.getElementById('home-section').classList.add('hidden');
    document.getElementById('meal-detail-section').classList.add('hidden');
    document.getElementById('favorites-section').classList.remove('hidden');
    renderFavoriteMeals();
});

// Initialize the appropriate functionality based on the page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('meal-results')) {
        // Home Page
    } else if (document.getElementById('meal-detail')) {
        renderMealDetails();
    } else if (document.getElementById('favorite-meals')) {
        renderFavoriteMeals();
    }
});
