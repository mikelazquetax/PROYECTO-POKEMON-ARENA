var contador = 0;
var contadorDivs = 0;
var contadorLivesBot = 5;
var contadorLivesUser = 5;
var seisLives = 6;
var pokemonChoseByBot = [];
var pokemonChoseByPlayer = [];
var totalPowerBot = 0;
var totalPowerUser = 0;
var audio = new Audio("./pokeMusic.mp3");

window.onload = () => {
  //Instanciación

  const closeModalButtons = document.querySelectorAll("[data-close-button]");
  const overlay = document.getElementById("overlay");
  overlay.classList.add("active");

  closeModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      closeModel(modal);
    });
  });
  //Creación campo input

  bodyDoc = document.querySelector("body");
  divButtonFight = document.createElement("div");
  matchCode = document.createElement("input");
  matchCode.type = "search";
  matchCode.id = "buscador";
  matchCode.placeholder = "Introduce ID o Nombre";
  matchCode.classList.add("buscador");

  searchButton = document.createElement("button");
  searchButton.innerHTML = "Elegir Pokemon";
  searchButton.id = "btonBuscar";
  searchButton.classList.add("btonBuscar");

  bodyDoc.appendChild(matchCode);
  bodyDoc.appendChild(searchButton);

  // La consola elige un pokemon enemigo contra el que luchar
  var pokeBot = randomChoice(1, 898); //Elige un numero aleatorio del 1 al 898
  var user = "bot"; // identificamos al usuario rival como un 'bot' para determinar aposteriori la clase del Pokemon
  datosPokemon(pokeBot, user); // se llama a la función datosPokemon para obtener los datos del pokemon rival

  // El jugador elige al pokemon que luchará con el BOT (solo puede elegir uno).
  //Se elige al pokemón cuando se pulsa el botón "Elegir Pokemon"
  searchButton.addEventListener("click", () => {
    var pokeQuery = document.getElementById("buscador").value.toLowerCase(); // contiene el pokemon buscado
    user = "jugador"; // identificamos al usuario como el jugador cuando se pulsa el boton

    if (audio.paused == true)
      if (contador == 0) {
        //Musica Maestro. Comienza la batalla
         audio.play();

        // La primera vez que se elige pokemon el contador está a cero
        contador = contador + 1; // Se ha elegido el primer pokemon. El contador pasa a 1
        datosPokemon(pokeQuery, user); // Se llama a la funcion para obtener los datos del pokemon que ha eligido el jugador
      } else if (contadorLivesUser < 5) {
        user = "jugador";
        datosPokemon(pokeQuery, user);
      }
  });
};

//Show Pokemon
function showPokemon(dato, style) {
  //aqui solo llegan los pokemon encontrados

  cardPoke = document.createElement("div"); // Se crea el div que "aloja" el pokemon. Primero el del bot y luego el del usuario

  for (var i = 0; i < seisLives; i++) {
    //Añadimos las vidas a los jugadores. Cada jugador tiene 6 vidas
    var pokeballs = document.createElement("Img");

    pokeballs.src = "./pokeball.png";
    if (style === "cardPoke") {
      pokeballs.id = i + "b";
      pokeballs.classList.add("pokeball");
    } else {
      pokeballs.id = i + "u";
      pokeballs.classList.add("pokeballu");
    }

    cardPoke.appendChild(pokeballs);
  }
  container = document.getElementById("container");
  cardPoke.classList.add(`${style}`); // El estilo que añadimos al div del bot y del user
  cardPoke.id = `${style}` + "id"; //El id del div del pokemon del bot y del usser
  container.appendChild(cardPoke);
  bodyDoc.appendChild(container);
  for (propiedad in dato) {
    if (propiedad === "name") {
      var pokeName = document.createElement("p");
      pokeName.innerText = dato.name.toUpperCase(); // MOSTRAMOS el nombre del pokemon elegido por el usuario y el bot

      cardPoke.appendChild(pokeName);
    } else if (propiedad === "sprites") {
      var pokeImg = document.createElement("Img");
      if (style === "cardPoke") {
        pokeImg.src = dato.sprites.front_shiny;
      } else {
        pokeImg.src = dato.sprites.back_shiny;
      }
      cardPoke.appendChild(pokeImg);
    } else if (propiedad === "types") {
      var pokeTipo = document.createElement("p");
      pokeTipo.innerText = dato.types[0].type.name.toUpperCase();
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
  // Esta funcion se ejecuta despues de la primera batalla y hace que se vayan sobrescribiendo los pokemons elegidos
  // tanto por parte del jugador como del bot.
  for (propiedad in dato) {
    if (propiedad === "name" && style == "cardPoke") {
      var pokeName = document.getElementById("nombrePokeBot");
      pokeNames(pokeName,dato);
     // pokeName.innerText = dato.name.toUpperCase();
    } else if (propiedad === "sprites" && style == "cardPoke") {
      var pokeImg = document.getElementById("imgPokeBot");
    } else if (propiedad === "types" && style == "cardPoke") {
      var pokeTipo = document.getElementById("tipoPokeBot");
      pokeTypes(pokeTipo,dato);
     // pokeTipo.innerText = dato.types[0].type.name;
    } else if (propiedad === "name" && style == "cardPokeUser") {
      var pokeName = document.getElementById("nombrePokeUser");
      pokeNames(pokeName,dato);
 //     pokeName.innerText = dato.name.toUpperCase();
    } else if (propiedad === "sprites" && style == "cardPokeUser") {
      var pokeImg = document.getElementById("imgPokeUser");
    } else if (propiedad === "types" && style == "cardPokeUser") {
      var pokeTipo = document.getElementById("tipoPokeUser");
      pokeTypes(pokeTipo,dato);
  //    pokeTipo.innerText = dato.types[0].type.name;
    }
  }

  if (style === "cardPoke") {
    test(pokeImg, dato, 0);
    //  pokeImg.src = dato.sprites.front_default;
  } else {
    test(pokeImg, dato, 1);
    //  pokeImg.src = dato.sprites.back_default;
  }
}

//Fetch a la api de todos los pokemon

var errorText = "";
const datosPokemon = async (id, user) => {
  try {
    let respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    let dato = await respuesta.json();

    console.log(dato); // Se muestra el por el consola el pokemon que elegimos y el que elige el bot

    //Elegimos el estilo dependiendo de quien es el jugador (bot o user)
    if (user === "bot") {
      style = "cardPoke";
      pokemonChoseByBot = dato; // se guarda en esta variable el pokemon elegido por el bot
    } else {
      style = "cardPokeUser";
      pokemonChoseByPlayer = dato; // Se guarda en esta variable el pokemon elegido
    }

    /////////////////////////////////////
    if (contadorDivs <= 1) {
      showPokemon(dato, style); // Cuando elige el bot por primera vez, se mete en esta función y cuando elegimos nosotros por primera vez, también.
      contadorDivs = contadorDivs + 1; // Despues de que el bot haya elegido el pokemon el contador de divs pasa a 1. Cuando elija el jugador pasará a 2
    } else {
      showNextPokemon(dato, style); // A partir de la segunda batalla, se procesa esta función porque el contadordeDivs es 2 o mayor
    }
    ///////////////////////////////////

    if (user === "jugador" && contadorLivesUser == 5) {
      showButtonFight(); //Despues de mostrar el pokemón aparece el botón de lucha. Solo se muestra una vez. Cuando el usuario es el jugador y cuando tiene las 6 vidas. Es decir,
      // despues de elegir el primer pokemon unicamente. ¡¡YA ESTAMOS LISTOS PARA LUCHAR POR PRIMERA VEZ!
    }
  } catch {
    console.log("Not Found");
    var error = "No Existe el Pokemón buscado";
    if (error != null) {
      alert("No Existe el Pokemón Buscado");
      error = null;
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
  buttonFights.id = "AL"
  buttonFights.innerText = "A (Luchar)";
  buttonFights.classList.add("pokeballFight");
  divButtonFight.appendChild(buttonFights);

  buttonRun = document.createElement("button");
  buttonRun.innerText = "B (Huir)";
  buttonRun.id = "BH"
  buttonRun.classList.add("pokeballRun");
  divButtonFight.appendChild(buttonRun);

  divButtonFight.classList.add('controlBotones')

  buttonFights.addEventListener("click", () => {
    imgInicializada = null;
    imgInicializada = document.getElementById("imgPokeUser");
    if (imgInicializada.currentSrc !== "") {
      //Se evita que el jugdor pueda darle a fight sin elegir pokemon antes

      pokeFight(contadorLivesBot, contadorLivesUser); // Se pulsa el boton 'FIGHT!' por primera vez y los usuarios tienen 6 vidas
    } else {
      alert("elige un pokemon");
    }
  });

  buttonRun.addEventListener("click", () => {
    alert("Cobarde!");
    window.location.reload();
  });
};

function pokeFight() {

  document.getElementById('AL').disabled = true;
  document.getElementById('BH').disabled = true;
  document.getElementById('btonBuscar').disabled = true;

  for (key in pokemonChoseByBot.stats) {
    totalPowerBot = totalPowerBot + pokemonChoseByBot.stats[key].base_stat; //sumamos el poder del bot
  }

  for (key in pokemonChoseByPlayer.stats) {
    totalPowerUser = totalPowerUser + pokemonChoseByPlayer.stats[key].base_stat; //sumamos el poder del user
  }
  console.log(totalPowerUser);
  console.log(totalPowerBot);
  if (totalPowerUser >= totalPowerBot) {


    nombrepokemonAEliminar = document.getElementById("nombrePokeBot"); // No hace falta
    tipopokemonAEliminar = document.getElementById("tipoPokeBot"); // No hace falta
    imagenpokemonAEliminar = document.getElementById("imgPokeBot"); // No hace falta

    messageToast(nombrepokemonAEliminar) //Mensaje de cuando cae un rival eliminado



    pokeballAEliminar = document.getElementById(`${contadorLivesBot}` + "b"); //Quitamos la  pokeball
    pokeballAEliminar.remove();
    contadorLivesBot = contadorLivesBot - 1; // le restamos una vida al rival



    totalPowerUser = 0; // Ha acabado la pelea y reiniciamos el poder
    totalPowerBot = 0; // Si no reiniciamos los poderes, se les acumularán a los siguientes pokemons

    var pokeChoiceBot = randomChoice(1, 898); // Pierde la maquina y vuelve a elegir pokemon
    datosPokemon(pokeChoiceBot, "bot"); // El bot pasa el id elegido y vuelve a hacer la query
  } else {
    var pokeQueryIn = document.getElementById("buscador").value;
    pokeballAEliminar = document.getElementById(`${contadorLivesUser}` + "u");
    pokeballAEliminar.remove();
    contadorLivesUser = contadorLivesUser - 1;
    nombrepokemonAEliminar = document.getElementById("nombrePokeUser");
    messageToast(nombrepokemonAEliminar)
    nombrepokemonAEliminar.innerText = null;
    tipopokemonAEliminar = document.getElementById("tipoPokeUser");
    tipopokemonAEliminar.innerText = null;
    imagenpokemonAEliminar = document.getElementById("imgPokeUser");
    imagenpokemonAEliminar.src = "";

    totalPowerUser = 0;
    totalPowerBot = 0;

    /*     var pokeQuery = document.getElementById("buscador").value;

    if (pokeQuery != pokeQueryIn) datosPokemon(pokeQuery, "jugador"); */
  }

  if (contadorLivesBot < 0) {
    alert("Has ganado a tus rivales!");
    window.location.reload();
  } else if (contadorLivesUser < 0) {
    alert("Gary Te ha Ganado");
    window.location.reload();
  }
}

function closeModel(modal) {
  if (modal == null) return;
  modal.classList.remove("active");
  overlay.classList.remove("active");
}

function delayPokeball(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function delaytexts(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
async function test(pokedata, dato, position) {
  pokedata.classList.add("claseImg");
  pokedata.src = "./pokeballCut.jpg";
  await delayPokeball(4000);
  pokedata.classList.remove("claseImg");
  if (position == 0) {
    pokedata.src = dato.sprites.front_default;
  } else {
    pokedata.src = dato.sprites.back_default;
  }
}

async function pokeNames(pokeName,dato) {
  pokeName.classList.add("claseTextos");
  
  pokeName.innerText = dato.name.toUpperCase()
  await delaytexts(40000)
  pokeName.classList.remove("claseTextos");
}

async function pokeTypes(pokeTypes,dato) {
  pokeTypes.classList.add("claseTextos");
  
  pokeTypes.innerText = dato.types[0].type.name;
  await delaytexts(40000)
  pokeTypes.classList.remove("claseTextos");

 
}

async function messageToast(nombrepokemonAEliminar){
var messageToast = document.createElement('div');
messageToast.classList.add('msgToast')
messageToast.innerText = `${nombrepokemonAEliminar.innerText} derrotado`

bodyDoc.appendChild(messageToast)

await delayPokeball(4000);
messageToast.remove()
document.getElementById('AL').disabled = false;
document.getElementById('BH').disabled = false;
document.getElementById('btonBuscar').disabled = false;

}
