const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const pokemonModal = document.getElementById('pokemonModal')

const maxRecords = 151
const limit = 10
let offset = 0;
let currentPokemons = [];
let currentIndex = 0;

function showPokemonModal(pokemon, pokemons = currentPokemons) {
    currentPokemons = pokemons;
    currentIndex = pokemons.findIndex(p => p.number === pokemon.number);

    pokemonModal.innerHTML = `
        <button class="close-btn">&times;</button>
        <button class="arrow-btn left" title="Anterior">&#8592;</button>
        <button class="arrow-btn right" title="Próximo">&#8594;</button>
        <span class="number">#${pokemon.number}</span>
        <span class="name">${pokemon.name}</span>
        <img src="${pokemon.photo}" alt="${pokemon.name}">
        <div class="types">
            ${pokemon.types.map(type => `<span class="type ${type}">${type}</span>`).join('')}
        </div>
    `;
    pokemonModal.classList.remove('hidden');

    pokemonModal.querySelector('.close-btn').onclick = () => {
        pokemonModal.classList.add('hidden');
    };

    pokemonModal.querySelector('.arrow-btn.left').onclick = () => {
        if (currentIndex > 0) {
            showPokemonModal(currentPokemons[currentIndex - 1], currentPokemons);
        }
    };
    pokemonModal.querySelector('.arrow-btn.right').onclick = () => {
        if (currentIndex < currentPokemons.length - 1) {
            showPokemonModal(currentPokemons[currentIndex + 1], currentPokemons);
        }
    };
}

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-number="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml

        // Adiciona evento de clique para cada Pokémon
        pokemons.forEach((pokemon, idx) => {
            const li = pokemonList.querySelector(`li[data-number="${pokemon.number}"]`);
            if (li) {
                li.onclick = () => showPokemonModal(pokemon, pokemons);
            }
        });
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})