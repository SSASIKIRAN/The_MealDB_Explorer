// Simple frontend that talks to backend at http://localhost:5000
const API_BASE = 'http://localhost:5000/api';

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const randomBtn = document.getElementById('randomBtn');
const catList = document.getElementById('catList');
const grid = document.getElementById('grid');
const details = document.getElementById('details');
const resultsSection = document.getElementById('results');
const mealDetail = document.getElementById('mealDetail');
const backBtn = document.getElementById('backBtn');
const status = document.getElementById('status');

async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
    return res.json();
  } catch (err) {
    status.textContent = 'Error contacting backend at ' + API_BASE + ' — make sure backend is running. (' + err.message + ')';
    throw err;
  }
}

async function loadCategories() {
  catList.textContent = 'Loading...';
  try {
    const data = await fetchJSON(API_BASE + '/categories');
    catList.innerHTML = '';
    (data.categories || []).forEach(c => {
      const btn = document.createElement('button');
      btn.textContent = c.strCategory;
      btn.onclick = () => loadByCategory(c.strCategory);
      catList.appendChild(btn);
    });
    if ((data.categories || []).length === 0) catList.textContent = 'No categories found';
  } catch (e) {
    catList.textContent = 'Failed to load categories';
  }
}

async function loadByCategory(cat) {
  grid.innerHTML = 'Loading...';
  try {
    const data = await fetchJSON(API_BASE + '/category/' + encodeURIComponent(cat));
    renderMeals(data.meals || []);
  } catch (e) {
    grid.textContent = 'Failed to load meals';
  }
}

function renderMeals(meals) {
  if (!meals || meals.length === 0) { grid.textContent = 'No meals found'; return; }
  grid.innerHTML = '';
  meals.forEach(m => {
    const card = document.createElement('div');
    card.className = 'meal-card';
    card.innerHTML = `<img src="${m.strMealThumb}" alt="${m.strMeal}"><h4>${m.strMeal}</h4>`;
    card.onclick = () => showDetails(m.idMeal || m.id);
    grid.appendChild(card);
  });
}

async function searchMeals(q) {
  if (!q) return;
  grid.innerHTML = 'Searching...';
  try {
    const data = await fetchJSON(API_BASE + '/search?q=' + encodeURIComponent(q));
    renderMeals(data.meals || []);
  } catch (e) {
    grid.textContent = 'Search failed';
  }
}

async function randomMeal() {
  try {
    const data = await fetchJSON(API_BASE + '/random');
    showDetails(data.meal);
  } catch (e) {
    alert('Failed to load random meal');
  }
}

async function showDetails(mealOrId) {
  resultsSection.classList.add('hidden');
  details.classList.remove('hidden');
  mealDetail.innerHTML = 'Loading...';

  let mealData = null;
  if (typeof mealOrId === 'string' || typeof mealOrId === 'number') {
    const data = await fetchJSON(API_BASE + '/meal/' + mealOrId);
    mealData = data.meal;
  } else {
    mealData = mealOrId;
  }

  if (!mealData) {
    mealDetail.textContent = 'Meal not found';
    return;
  }

  const ingredients = [];
  for (let i=1;i<=20;i++){
    const ing = mealData['strIngredient'+i];
    const measure = mealData['strMeasure'+i];
    if (ing && ing.trim()) ingredients.push((measure||'') + ' ' + ing);
  }

  let html = `<h2>${mealData.strMeal}</h2>`;
  if (mealData.strMealThumb) html += `<img src="${mealData.strMealThumb}" alt="">`;
  html += `<p><strong>Category:</strong> ${mealData.strCategory || ''} • <strong>Area:</strong> ${mealData.strArea || ''}</p>`;
  html += '<h3>Ingredients</h3><ul>';
  ingredients.forEach(it => html += '<li>' + it + '</li>');
  html += '</ul>';
  html += '<h3>Instructions</h3><p style="white-space:pre-line">' + (mealData.strInstructions || '') + '</p>';
  if (mealData.strYoutube) {
    const vid = new URL(mealData.strYoutube).searchParams.get('v');
    if (vid) html += `<h3>Video</h3><iframe width="560" height="315" src="https://www.youtube.com/embed/${vid}" frameborder="0" allowfullscreen></iframe>`;
  }
  mealDetail.innerHTML = html;
}

backBtn.onclick = () => {
  details.classList.add('hidden');
  resultsSection.classList.remove('hidden');
};

searchBtn.onclick = () => searchMeals(searchInput.value.trim());
randomBtn.onclick = randomMeal;

// load initial
loadCategories();
