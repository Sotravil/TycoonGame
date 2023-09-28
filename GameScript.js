// JavaScript (script.js)
  // Variables para el juego
  let username = "";
  let missionPoints = 100; // Define tu misión inicial
  let totalScore = 0;
  let progress = "0/100"; // Define tu misión inicial
  let currency = 0;
  let bankMoney = 0;
  let experience = 0;
  let level = 0;

  // Variable para llevar un registro de los multiplicadores activos
  let activeMultipliers = [];

  // Obtener elementos del DOM
  const usernameInput = document.getElementById("username");
  const missionPointsSpan = document.getElementById("missionPoints");
  const totalScoreSpan = document.getElementById("totalScore");
  const progressSpan = document.getElementById("progress");
  const currencySpan = document.getElementById("currency");
  const bankMoneySpan = document.getElementById("bankMoney");
  const experienceSpan = document.getElementById("experience");
  const levelSpan = document.getElementById("level");
  const collectButton = document.getElementById("collectButton");
  const shopButton = document.getElementById("shopButton");
  const saveButton = document.getElementById("saveButton");
  const loadButton = document.getElementById("loadButton");
  const bankButton = document.getElementById("bankButton");
  const depositButton = document.getElementById("depositButton");
  const withdrawButton = document.getElementById("withdrawButton");
  const exchangeButton = document.getElementById("exchangeButton"); // Botón de intercambio

  // Función para recolectar puntos
  collectButton.addEventListener("click", () => {
    totalScore++;
    progress = `${totalScore}/${missionPoints}`;
    progressSpan.textContent = progress;
    
    // Increment experience with each collect
    experience += 10;
    
    // Check if experience reaches 100 or more
    if (experience >= 100) {
        // Level up and reset experience
        level++;
        experience = 0;
    }
    
    // Check if the mission is complete
    if (totalScore >= missionPoints) {
        // Award experience, currency, and set a new mission
        experience += 10;
        currency += 100;
        missionPoints += 100;
        missionPointsSpan.textContent = missionPoints;
    }
    
    // Apply active multipliers
    activeMultipliers.forEach(multiplier => {
        totalScore += multiplier.multiplier;
    });

    // Update DOM elements
    totalScoreSpan.textContent = totalScore;
    currencySpan.textContent = currency;
    experienceSpan.textContent = `${experience}/100`;
    levelSpan.textContent = level;
  });


  // Lógica de la tienda
  const shopItems = [
    { name: "Multiplicador x2", cost: 20, multiplier: 2, timer: 30, type: "multiplier" },
    { name: "Multiplicador x4", cost: 80, multiplier: 4, timer: 60, type: "multiplier" },
    { name: "Multiplicador x6", cost: 480, multiplier: 6, timer: 120, type: "multiplier" },
    { name: "Multiplicador x12", cost: 5760, multiplier: 12, timer: 240, type: "multiplier" },
    { name: "Multiplicador x20", cost: 20000, multiplier: 20, timer: 300, type: "multiplier" },
    // Agrega más elementos de la tienda según sea necesario
  ];

  shopButton.addEventListener("click", () => {
    const shopList = document.getElementById("shopList");
    shopList.innerHTML = ""; // Limpia la lista de la tienda
    
    // Crea elementos de la tienda
    shopItems.forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.name} - Costo: ${item.cost}`;
        
        // Botón para comprar el artículo
        const buyButton = document.createElement("button");
        buyButton.textContent = "Comprar";
        buyButton.addEventListener("click", () => {
            buyItem(item);
        });
        
        // Agrega el botón a la lista de la tienda
        listItem.appendChild(buyButton);
        shopList.appendChild(listItem);
    });
  });

  // Función para comprar artículos de la tienda
  function buyItem(item) {
    if (currency >= item.cost) {
        currency -= item.cost;
        currencySpan.textContent = currency;
        
        if (item.type === "multiplier") {
            // Agrega el multiplicador a un arreglo para llevar un registro
            activeMultipliers.push(item);

            // Inicia el temporizador del multiplicador
            startMultiplierTimer(item);
        } else if (item.type === "exchange") {
            // Realiza el intercambio de puntos por monedas
            currency += item.currencyGiven;
            currencySpan.textContent = currency;
        }
    } else {
        alert("No tienes suficiente moneda para comprar esto.");
    }
  }

  // Temporizador para el multiplicador
  let multiplierTimer = null;

  function startMultiplierTimer(item) {
    if (multiplierTimer) {
        clearInterval(multiplierTimer);
    }
    multiplierTimer = setInterval(() => {
        // Remueve los multiplicadores activos
        activeMultipliers = activeMultipliers.filter(multiplier => multiplier !== item);
        clearInterval(multiplierTimer);
    }, item.timer * 1000);
  }

  // Función para guardar progreso del juego en la "gameData" folder
saveButton.addEventListener("click", () => {
    // Get the username from the input field
    const usernameInput = document.getElementById("username");
    const username = usernameInput.value;

    if (username.trim() === "") {
        alert("Por favor, ingresa un nombre de usuario válido.");
        return;
    }

    const gameData = {
        username,
        missionPoints,
        totalScore,
        progress,
        currency,
        bankMoney,
        experience,
        level,
    };

    // Create a folder named "gameData" if it doesn't exist
    if (!localStorage.getItem("gameDataFolder")) {
        localStorage.setItem("gameDataFolder", JSON.stringify({}));
    }

    // Get the game data folder
    const gameDataFolder = JSON.parse(localStorage.getItem("gameDataFolder"));

    // Save the user's game data as a separate JSON file
    gameDataFolder[username] = gameData;
    localStorage.setItem("gameDataFolder", JSON.stringify(gameDataFolder));

    alert("Progreso guardado correctamente.");
});



  // Función para cargar progreso del juego desde la "gameData" folder
loadButton.addEventListener("click", () => {
    // Get the username from the input field
    const usernameInput = document.getElementById("username");
    const inputUsername = usernameInput.value;

    // Get the game data folder
    const gameDataFolder = JSON.parse(localStorage.getItem("gameDataFolder"));

    if (gameDataFolder && gameDataFolder[inputUsername]) {
        const gameData = gameDataFolder[inputUsername];

        // Load the user's game data
        username = gameData.username;
        missionPoints = gameData.missionPoints;
        totalScore = gameData.totalScore;
        progress = gameData.progress;
        currency = gameData.currency;
        bankMoney = gameData.bankMoney;
        experience = gameData.experience;
        level = gameData.level;

        // Actualizar elementos del DOM con los datos cargados
        usernameInput.value = username;
        missionPointsSpan.textContent = missionPoints;
        totalScoreSpan.textContent = totalScore;
        progressSpan.textContent = progress;
        currencySpan.textContent = currency;
        bankMoneySpan.textContent = bankMoney;
        experienceSpan.textContent = experience;
        levelSpan.textContent = level;
    } else {
        alert("No se encontraron datos de progreso guardados para el usuario especificado.");
    }
});



  // Botón para ver el banco
  bankButton.addEventListener("click", () => {
    // Get the bank buttons container
    const bankButtons = document.getElementById("bankButtons");
    
    // Get the deposit and withdraw buttons
    const depositButton = document.getElementById("depositButton");
    const withdrawButton = document.getElementById("withdrawButton");
    
    // Toggle the visibility of the bank buttons container
    if (bankButtons.style.display === "none" || bankButtons.style.display === "") {
        bankButtons.style.display = "block";
        depositButton.style.display = "block";
        withdrawButton.style.display = "block";
    } else {
        bankButtons.style.display = "none";
        depositButton.style.display = "none";
        withdrawButton.style.display = "none";
    }
  });


  // Add this event listener for the "Depositar al Banco" button
  depositButton.addEventListener("click", () => {
    // Get the deposit amount from the input field
    const depositInput = document.getElementById("depositAmount");
    const depositAmount = parseInt(depositInput.value);

    if (!isNaN(depositAmount) && depositAmount >= 0) {
        if (currency >= depositAmount) {
            // Realiza el depósito
            currency -= depositAmount;
            bankMoney += depositAmount;

            // Actualiza elementos del DOM
            currencySpan.textContent = currency;
            bankMoneySpan.textContent = bankMoney;

            // Clear the input field
            depositInput.value = "";
        } else {
            alert("No tienes suficiente moneda para hacer este depósito. ¡Ve a la tienda para comprar más monedas!");
        }
    } else {
        alert("Cantidad de depósito no válida.");
    }
  });


  // Botón para retirar monedas del banco
  withdrawButton.addEventListener("click", () => {
    // Get the withdrawal amount from the input field
    const withdrawInput = document.getElementById("depositAmount");
    const withdrawAmount = parseInt(withdrawInput.value);

    if (!isNaN(withdrawAmount) && withdrawAmount >= 0 && bankMoney >= withdrawAmount) {
        // Realiza el retiro
        currency += withdrawAmount;
        bankMoney -= withdrawAmount;

        // Actualiza elementos del DOM
        currencySpan.textContent = currency;
        bankMoneySpan.textContent = bankMoney;

        // Clear the input field
        withdrawInput.value = "";
    } else {
        alert("Cantidad de retiro no válida o no tienes suficiente dinero en el banco.");
    }
  });


  // Botón para cambiar puntos por monedas
  exchangeButton.addEventListener("click", () => {
    if (totalScore >= 10) { // Verifica si tienes al menos 10 puntos para el intercambio
        totalScore -= 10; // Resta 10 puntos
        currency += 5; // Añade 5 monedas
        
        // Actualiza elementos del DOM
        totalScoreSpan.textContent = totalScore;
        currencySpan.textContent = currency;
    } else {
        alert("No tienes suficientes puntos para realizar este intercambio.");
    }
  });