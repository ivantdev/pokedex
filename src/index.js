// endpoint
const API_endpoint = "https://pokeapi.co/api/v2/";

// vars
let currentPokemon = 1;
let nextPage = "";
let previousPage = "";
const cardColors = {
    "normal": "none",
    "flying": "none",
    "poison": "none",
    "psychic": "none",
    "dragon": "none",
    "dark": "none",
    "fairy": "none",
    "unknown": "none",
    "ghost": "none",
    "grass": "box__green",
    "bug": "box__green",
    "fire": "box__red",
    "electric": "box__yellow",
    "ground": "box__ground",
    "rock": "box__gray",
    "fighting": "box__red",
    "steel": "box__gray",
    "water": "box__blue",
    "ice": "box__soft-blue",
    "shadow": "box__gray",
};

// Utils functions
const fetchData = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
};

const clearNode = (node) => {
    let n = node.childElementCount;
    for(;n!=0;) {
        try {
            n = node.childElementCount;
            node.removeChild(node.childNodes[0]);
        } catch {
            continue;
        }
    }
};

const clearClassList = (node, newClasslist=[]) => {
    node.classList = "";
    newClasslist.forEach((className) => {
        node.classList.add(className);
    });
};

// get API requests
const buildPokeCard = async (pokemon) => {
    const data = await fetchData(pokemon.url);
    const liContainer = document.createElement('li');
    const ice = data.types.some((item => {
        return item.type.name === "ice";
    }))
    let colorClass = ice ? "ice" : data.types[0].type.name;
    liContainer.classList.add('pokemon', cardColors[colorClass]);

    const divImg = document.createElement('div');
    divImg.classList.add('pokemon__image');
    const img = document.createElement('img');
    if(data.sprites.other["official-artwork"].front_default != null) {
        img.src = data.sprites.other["official-artwork"].front_default;
    } else {
        img.src = "../pokeball-color.png";
    }
    divImg.appendChild(img);

    const divHero = document.createElement("div");
    divHero.classList.add("list__pokemon-hero");
    divHero.innerHTML = `
    <h3>${pokemon.name}</h3>
    <span class="pokemon-id">#${data.id}</span>
    `;
    const divTypes = document.createElement('div');
    divTypes.classList.add('list__pokemon-type');
    data.types.forEach(type => {
        const  spanType = document.createElement('span');
        spanType.classList.add("pokemon-type");
        spanType.textContent = type.type.name;
        divTypes.appendChild(spanType);
    });

    const buttonMore = document.createElement('button');
    buttonMore.classList.add('pokemon__button');
    const buttonText = document.createTextNode("Seen more");
    buttonMore.appendChild(buttonText);
    buttonMore.addEventListener('click', () => {
        getPokemonDetails(data.id);
        window.scrollTo(0, 0);
    });

    liContainer.appendChild(divHero);
    liContainer.appendChild(divTypes);
    liContainer.appendChild(divImg);
    liContainer.appendChild(buttonMore);
    return liContainer;
};

const listPokemons = async (url) => {
    if( url == null) {
        return;
    }
    clearNode(listPokemonsContainer);
    const response = await fetchData(url);
    const data = response.results;
    const cards = await Promise.all(data.map(pokemon => {
        return buildPokeCard(pokemon);
    }));
    nextPage = response.next;
    previousPage = response.previous;
    cards.forEach((card => {
        listPokemonsContainer.appendChild(card);
    }));
};

const getPokemonDetails = async (str) => {
    if (str < 1) {
        return;
    }
    const data = await fetchData(API_endpoint + `pokemon/${str}`);
    if(data.sprites.other["official-artwork"].front_default != null) {
        imagePokemonSection.src = data.sprites.other["official-artwork"].front_default;
    } else {
        imagePokemonSection.src = "./imgs/pokeball-color.png";
    }

    const ice = data.types.some((item => {
        return item.type.name === "ice";
    }))
    let colorClass = ice ? "ice" : data.types[0].type.name;

    clearClassList(detailsMiniContainer, ["details__details", "no-background", cardColors[colorClass]]);
    clearClassList(backgroundPokemonSection, ["details__background", cardColors[colorClass]])

    namePokemonSection.textContent = data.name;
    idPokemonSection.textContent = "#" + data.id;
    clearNode(typesPokemonContainer);
    data.types.forEach(type => {
        const  spanType = document.createElement('span');
        spanType.classList.add("pokemon-type");
        spanType.textContent = type.type.name;
        typesPokemonContainer.appendChild(spanType);
    });
    const descriptionData = await fetchData(data.species.url)
    const description = descriptionData.flavor_text_entries.find((lang => {
        return lang.language.name === "en";
    }))
    description.flavor_text = description.flavor_text.split("\f").join().toLowerCase();
    description.flavor_text = description.flavor_text.charAt(0).toUpperCase() + description.flavor_text.slice(1);
    descriptionPokemonSection.textContent = description.flavor_text;

    weightPokemonSection.textContent = `${data.weight/10} Kgr.`;
    heightPokemonSection.textContent = `${data.height/10} mts.`;

    hpValue.textContent = data.stats[0].base_stat;
    atkValue.textContent = data.stats[1].base_stat;
    defValue.textContent = data.stats[2].base_stat;
    satkValue.textContent = data.stats[3].base_stat;
    sdefValue.textContent = data.stats[4].base_stat;
    speedValue.textContent = data.stats[4].base_stat;

    hpLine.style.width = `${data.stats[0].base_stat/1}%`;
    atkLine.style.width = `${data.stats[1].base_stat/1}%`;
    defLine.style.width = `${data.stats[2].base_stat/1}%`;
    satkLine.style.width = `${data.stats[3].base_stat/1.5}%`;
    sdefLine.style.width = `${data.stats[4].base_stat/1.5}%`;
    speedLine.style.width = `${data.stats[5].base_stat/1.5}%`;

    currentPokemon = data.id;
};

const searchPokemon = () => {
    event.preventDefault();
    getPokemonDetails(event.target.query.value);
};

// start  page
listPokemons(API_endpoint + "pokemon/?limit=16");
getPokemonDetails(currentPokemon);

nextPagePokemons.addEventListener('click', () => {
    mainListCointainer.scrollIntoView();
    listPokemons(nextPage);
});
previousPagePokemons.addEventListener('click', () => {
    mainListCointainer.scrollIntoView();
    listPokemons(previousPage);
});

nextPokemon.addEventListener('click', () => {
    currentPokemon = currentPokemon < 906 ? currentPokemon + 1 : currentPokemon;
    getPokemonDetails(currentPokemon);
});

previousPokemon.addEventListener('click', () => {
    currentPokemon = currentPokemon > 0 ? currentPokemon - 1 : currentPokemon;
    getPokemonDetails(currentPokemon);
});