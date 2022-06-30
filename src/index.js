// endpoint
const API_endpoint = "https://pokeapi.co/api/v2/";

// vars
let currentPokemon = 1;
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
}

// Utils functions
const fetchData = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data
};

const cleanNode = (node) => {
    let n = node.childElementCount;
    for(;n!=0;) {
        try {
            n = node.childElementCount;
            node.removeChild(node.childNodes[0])
        } catch {
            continue
        }
    }
}

// get API requests
const buildPokeCard = async (pokemon) => {
    const data = await fetchData(pokemon.url);
    const liContainer = document.createElement('li');
    let colorClass = data.types[0].type.name;
    liContainer.classList.add('pokemon', cardColors[colorClass]);

    const divImg = document.createElement('div');
    divImg.classList.add('pokemon__image');
    const img = document.createElement('img');
    img.src = data.sprites.other['official-artwork'].front_default;
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
    buttonMore.addEventListener('click', () => {getPokemonDetails(data.id)});

    liContainer.appendChild(divHero);
    liContainer.appendChild(divTypes);
    liContainer.appendChild(divImg);
    liContainer.appendChild(buttonMore);
    return liContainer;
};

const listPokemons = async (url) => {
    cleanNode(listPokemonsContainer);
    const response = await fetchData(url);
    const data = response.results;
    const cards = await Promise.all(data.map(pokemon => {
        return buildPokeCard(pokemon);
    }));
    cards.forEach((card => {
        listPokemonsContainer.appendChild(card);
    }));
};


// start  page
listPokemons(API_endpoint + "pokemon/?limit=100")