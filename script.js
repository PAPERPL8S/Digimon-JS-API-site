const apiUrl = "https://digimon-api.vercel.app/api/digimon";
let favorites = [];
let digimons;

document.addEventListener("DOMContentLoaded", () => {
  fetchData(apiUrl);
});

function fetchData(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      digimons = data;
      displayData(digimons);
      addClickEvents();
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function displayData(digimonsData) {
  const collectionContainer = document.getElementById("collection");
  if (!Array.isArray(digimonsData) || digimonsData.length === 0) {
    console.error("No digimons to display.");
    return;
  }
  collectionContainer.innerHTML = "";
  digimonsData.slice(0, 30).forEach((digimon) => {
    const digimonHTML = createDigimonHTML(digimon);
    collectionContainer.appendChild(digimonHTML);
  });
}

function createDigimonHTML(digimon) {
  const digimonHTML = document.createElement("div");
  digimonHTML.classList.add("digimon");
  digimonHTML.innerHTML = `
    <h3>${digimon.name}</h3>
    <img src="${digimon.img}" alt="${digimon.name}">
    <p style="color: aqua; font-weight: bold">Level: ${digimon.level}</p>
    <p>Type: ${digimon.type}</p>
    <button onclick="addToFavorites('${digimon.name}')" style="margin-left: 5px; margin-bottom: 3px; background-color: #ef2ab8; color: white; border: 1px solid #ccc;"> Add to Favorites</button>
  `;
  digimonHTML.style.backgroundImage =
    "url('https://world.digimoncard.com/images/products/pack/rb-01/special/point_02_bg.png?230825')";
  return digimonHTML;
}

function addClickEvents() {
  const addToFavoritesButtons = document.querySelectorAll(
    "#collection .digimon button",
  );
  addToFavoritesButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const digimonName = button.parentNode.querySelector("h3").textContent;
      addToFavorites(digimonName);
    });
  });
}

function addToFavorites(digimonName) {
  const isAlreadyFavorite = favorites.some(
    (favorite) => favorite.name === digimonName,
  );

  if (!isAlreadyFavorite) {
    if (digimons) {
      const digimon = digimons.find((digimon) => digimon.name === digimonName);
      if (digimon) {
        favorites.push(digimon);
        updateFavoritesDisplay();

        const collectionContainer = document.getElementById("collection");
        const digimonElements = Array.from(
          collectionContainer.querySelectorAll(".digimon"),
        );
        const digimonElement = digimonElements.find(
          (element) => element.querySelector("h3").textContent === digimonName,
        );
        if (digimonElement) {
          digimonElement.remove();
        }
      } else {
        console.error(`Digimon with name "${digimonName}" not found.`);
      }
    } else {
      console.error("Digimon data not available.");
    }
  } else {
    console.error(`Digimon "${digimonName}" is already in favorites.`);
  }
}

function updateFavoritesDisplay() {
  const favoritesContainer = document.getElementById("favorites");
  favoritesContainer.innerHTML = "";
  favorites.forEach((favorite, index) => {
    const favoriteHTML = document.createElement("div");
    favoriteHTML.classList.add("favorite");
    favoriteHTML.innerHTML = `
      <h3>${favorite.name}</h3>
      <img src="${favorite.img}" alt="${favorite.name}">
      <p style="color: aqua; font-weight: bold; background-image: url('https://world.digimoncard.com/images/products/pack/rb-01/special/point_02_bg.png?230825'); background-size: cover;">Level: ${favorite.level}</p>
      <p style="padding: 5px; background-color: #f0f0f0; color: #cbcbcc; background-image: url('https://world.digimoncard.com/images/products/pack/rb-01/special/point_02_bg.png?230825'); background-size: cover;">Type: ${favorite.type}</p>
      <button onclick="removeFromFavorites(${index})" style="margin-left: 5px; margin-bottom: 3px; background-color: #544ecc; color: white; border: 1px solid #ccc;">Remove from Favorites</button>
    `;
    favoritesContainer.appendChild(favoriteHTML);
  });
}

function removeFromFavorites(index) {
  const removedDigimon = favorites.splice(index, 1)[0];
  updateFavoritesDisplay();

  const collectionContainer = document.getElementById("collection");
  const collectionDigimons = Array.from(
    collectionContainer.querySelectorAll(".digimon"),
  );

  const insertIndex = collectionDigimons.findIndex(
    (digimon) => digimon.querySelector("h3").textContent > removedDigimon.name,
  );

  if (insertIndex === -1) {
    collectionContainer.appendChild(createDigimonHTML(removedDigimon));
  } else {
    collectionContainer.insertBefore(
      createDigimonHTML(removedDigimon),
      collectionDigimons[insertIndex],
    );
  }
}

let isSortAscending = true;

document.getElementById("toggle-btn").addEventListener("click", toggleSort);

function toggleSort() {
  isSortAscending = !isSortAscending;
  const toggleButton = document.getElementById("toggle-btn");

  if (favorites.length > 0) {
    if (isSortAscending) {
      toggleButton.textContent = "Sort Z-A";
    } else {
      toggleButton.textContent = "Sort A-Z";
    }
    favorites.sort((a, b) =>
      isSortAscending
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name),
    );
    updateFavoritesDisplay();
  } else {
    const collectionContainer = document.getElementById("collection");
    const digimonElements = Array.from(
      collectionContainer.querySelectorAll(".digimon"),
    );
    if (isSortAscending) {
      digimonElements.sort((a, b) =>
        a
          .querySelector("h3")
          .textContent.localeCompare(b.querySelector("h3").textContent),
      );
    } else {
      digimonElements.sort((a, b) =>
        b
          .querySelector("h3")
          .textContent.localeCompare(a.querySelector("h3").textContent),
      );
    }
    digimonElements.forEach((element) =>
      collectionContainer.appendChild(element),
    );
  }
}

document.getElementById("toggle-btn").addEventListener("click", toggleSort);
