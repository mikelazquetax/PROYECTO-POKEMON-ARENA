var contador = 0;
var contadorDivs = 0;
var contadorLivesBot = 5;
var contadorLivesUser = 5;
var seisLives = 6;
var pokemonChoseByBot = [];
var pokemonChoseByPlayer = [];
var totalPowerBot = 0;
var totalPowerUser = 0;
var audio = new Audio('./pokeMusic.mp3');


window.onload = () => {


  
  //Creación campo input


  bodyDoc = document.querySelector("body");
  divButtonFight = document.createElement("div");
  matchCode = document.createElement("input");
  matchCode.type = "search";
  matchCode.id = "buscador";
  matchCode.placeholder = 'Introduce ID o Nombre'
  matchCode.classList.add('buscador')

  searchButton = document.createElement("button");
  searchButton.innerHTML = "Elegir Pokemon";
  searchButton.id = "btonBuscar"
  searchButton.classList.add('btonBuscar')

  bodyDoc.appendChild(matchCode);
  bodyDoc.appendChild(searchButton);

  // La consola elige un pokemon enemigo contra el que luchar
  var pokeBot = randomChoice(1, 898);
  var user = "bot"; // identificamos al usuario rival como un 'bot' para determinar aposteriori la clase del Pokemon
  datosPokemon(pokeBot, user);
 

  // El jugador elige al pokemon que luchará con el BOT (solo puede elegir uno)
  searchButton.addEventListener("click", () => {
    var pokeQuery = document.getElementById("buscador").value.toLowerCase();
    user = "jugador";




    if(audio.paused == true)//Musica Maestro
    audio.play()
  
  
  

     if (contador == 0) {
      contador = contador + 1;
      datosPokemon(pokeQuery, user);
    } else if(contadorLivesUser < 5){
      user = "jugador"
      datosPokemon(pokeQuery, user);
    }

  });
};

//Show Pokemon
function showPokemon(dato, style) {
  //aqui solo llegan los pokemon encontrados

  cardPoke = document.createElement("div");

  for (var i = 0; i < seisLives; i++) {
    //Añadimos las vidas a los jugadores. Cada jugador tiene 6 vidas
    var pokeballs = document.createElement("Img");
    pokeballs.classList.add("pokeball");
    pokeballs.src = "./pokeball.png";
    if (style === "cardPoke") {
      pokeballs.id = i + "b";
    } else {
      pokeballs.id = i + "u";
    }

    cardPoke.appendChild(pokeballs);
  }

  cardPoke.classList.add(`${style}`);
  cardPoke.id = `${style}` + 'id' //El id del div del pokemon del bot y del usser
  bodyDoc.appendChild(cardPoke);
  for (propiedad in dato) {
    if (propiedad === "name") {
      var pokeName = document.createElement("p");
      pokeName.innerText = dato.name.toUpperCase()
    
      cardPoke.appendChild(pokeName);
    } else if (propiedad === "sprites") {
      var pokeImg = document.createElement("Img");
      if (style === "cardPoke") {
        pokeImg.src = dato.sprites.front_default;
      } else {
        pokeImg.src = dato.sprites.back_default;
      }
      cardPoke.appendChild(pokeImg);
    } else if (propiedad === "types") {
      var pokeTipo = document.createElement("p");
      pokeTipo.innerText = dato.types[0].type.name;
      cardPoke.appendChild(pokeTipo);
    }
  }

  if (style == "cardPoke") {
    pokeName.id = "nombrePokeBot";
    pokeTipo.id = "tipoPokeBot";
    pokeImg.id = "imgPokeBot";
  } else {
    pokeName.id = "nombrePokeUser";
    pokeTipo.id = "tipoPokeUser";
    pokeImg.id = "imgPokeUser";
  }
}

///Mostrar siguiente Pokemon

function showNextPokemon(dato, style) {
  for (propiedad in dato) {
    if (propiedad === "name" && style == "cardPoke") {
      var pokeName = document.getElementById("nombrePokeBot");
      pokeName.innerText = dato.name;
    } else if (propiedad === "sprites" && style == "cardPoke") {
      var pokeImg = document.getElementById("imgPokeBot");
    } else if (propiedad === "types" && style == "cardPoke") {
      var pokeTipo = document.getElementById("tipoPokeBot");
      pokeTipo.innerText = dato.types[0].type.name;
    } else if (propiedad === "name" && style == "cardPokeUser") {
      var pokeName = document.getElementById("nombrePokeUser");
      pokeName.innerText = dato.name;
    } else if (propiedad === "sprites" && style == "cardPokeUser") {
      var pokeImg = document.getElementById("imgPokeUser");
    } else if (propiedad === "types" && style == "cardPokeUser") {
      var pokeTipo = document.getElementById("tipoPokeUser");
      pokeTipo.innerText = dato.types[0].type.name;
    }
  }

  if (style === "cardPoke") {
    pokeImg.src = dato.sprites.front_default;
  } else {
    pokeImg.src = dato.sprites.back_default;
  }
}

//Fetch a la api de todos los pokemon

var errorText = "";
const datosPokemon = async (id, user) => {
  try {
    let respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    let dato = await respuesta.json();

    console.log(dato);

    //Elegimos el estilo dependiendo de quien es el jugador (bot o user)
    if (user === "bot") {
      style = "cardPoke";
      pokemonChoseByBot = dato;
    } else {
      style = "cardPokeUser";
      pokemonChoseByPlayer = dato;
    }

    /////////////////////////////////////
    if (contadorDivs <= 1) {
      showPokemon(dato, style);
      contadorDivs = contadorDivs + 1;
    } else {
      showNextPokemon(dato, style);
    }
    ///////////////////////////////////
    var buttonFights = document.getElementById
    if (user === "jugador" && contadorLivesUser == 5) {
      showButtonFight(); //Despues de mostrar el pokemón aparece el botón de lucha
    }
  } catch {
    console.log("Not Found");
    var error = "No Existe el Pokemón buscado";
    if (error != null) {

      alert('No Existe el Pokemón Buscado')
      error = null
    }
  }
  return error;
};

function randomChoice(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const showButtonFight = () => {
 
  bodyDoc.appendChild(divButtonFight);
  buttonFights = document.createElement("button");
  buttonFights.innerHTML = "FIGHT!";
  divButtonFight.appendChild(buttonFights);

  buttonFights.addEventListener("click", () => {
    pokeFight(contadorLivesBot, contadorLivesUser);
  

  });
};

function pokeFight() {
  for (key in pokemonChoseByBot.stats) {
    totalPowerBot = totalPowerBot + pokemonChoseByBot.stats[key].base_stat;
   
  }

  for (key in pokemonChoseByPlayer.stats) {
    totalPowerUser = totalPowerUser + pokemonChoseByPlayer.stats[key].base_stat;
    
  }
  console.log(totalPowerUser)
  console.log(totalPowerBot)
  if (totalPowerUser >= totalPowerBot) {
    pokeballAEliminar = document.getElementById(`${contadorLivesBot}` + "b");
    pokeballAEliminar.remove();
    contadorLivesBot = contadorLivesBot - 1;

    nombrepokemonAEliminar = document.getElementById("nombrePokeBot");
    tipopokemonAEliminar = document.getElementById("tipoPokeBot");
    imagenpokemonAEliminar = document.getElementById("imgPokeBot");
    totalPowerUser = 0
    totalPowerBot = 0

    
    var pokeChoiceBot = randomChoice(1, 898);
    datosPokemon(pokeChoiceBot, "bot");
  
  } else {
    var pokeQueryIn = document.getElementById("buscador").value;
    pokeballAEliminar = document.getElementById(`${contadorLivesUser}` + "u");
    pokeballAEliminar.remove();
    contadorLivesUser = contadorLivesUser - 1;
    nombrepokemonAEliminar = document.getElementById("nombrePokeUser");
    nombrepokemonAEliminar.innerText = null;
    tipopokemonAEliminar = document.getElementById("tipoPokeUser");
    tipopokemonAEliminar.innerText = null;
    imagenpokemonAEliminar = document.getElementById("imgPokeUser");
    imagenpokemonAEliminar.src = "";

    totalPowerUser = 0
    totalPowerBot = 0



/*     var pokeQuery = document.getElementById("buscador").value;

    if (pokeQuery != pokeQueryIn) datosPokemon(pokeQuery, "jugador"); */
  }

  if(contadorLivesBot < 0){
    alert('Has ganado a tus rivales!')
  }else if(contadorLivesUser < 0){
    alert('Gary Te ha Ganado')
  }
}


