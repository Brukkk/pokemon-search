const form = document.querySelector("form");
const input = document.querySelector("#query");
const pokemons = document.querySelector(".pokemons");
const alert = document.querySelector("#error");

const colorTypes = {
    bug: "#a6b91a",
    fighting: "#c22e28",
    electric: "#f7d02c",
    poison: "#a33ea1",
    fire: "#ee8130",
    steel: "#b7b7ce",
    ghost: "#735797",
    flying: "#a98ff3",
    dragon: "#6f35fc",
    ice : "#96d9d6",
    rock: "#b6a136",
    water: "#6390f0",
    normal: "#a8a77a",
    grass: "#7ac74c",
    fairy: "#d685ad",
    dark: "#705746",
    psychic: "#f95587",
    ground: "#e2bf65"
}

form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    let searchPokemon  = input.value.toLowerCase().trim(); // Initial UpperCase breaks and possible white space removed
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchPokemon}`)
        .then((response)=>{
            alert.classList.remove("alert-on");
            return response.data;
        })
        .catch((e)=>{
            alert.classList.add("alert-on");
            console.log("Ups, hubo un error",e);
        });
    // CREATING ELEMENTS
    console.log(res) 

    let container = document.createElement("div");
    let typesDiv = document.createElement("div");
    let name = document.createElement("h2");
    let number = document.createElement("span");
    let image = document.createElement("img");
    let grid = document.createElement("div");
    let newPokemontypes = [];
    // SET VALUES
    name.textContent = res.name.slice(0,1).toUpperCase() + res.name.slice(1);
    number.textContent = `#${res.id}`;
    // NEED IF STATMENT : NO DREAMWORLD FOR NEWER GENERATIONS
    image.src = res.sprites.other.dream_world.front_default;
    
    res.types.forEach(type =>{
        newPokemontypes.push(type.type.name);
    });
    // CLASSES    
    container.classList.add("container");
    typesDiv.classList.add("types");
    grid.classList.add("graph")

    // append all the shit
    container.append(name);
    container.append(number);
    container.append(image);
    container.append(typesDiv);
    container.append(grid);

    // Setting each type ( max = 2)
    newPokemontypes.forEach((type)=>{
        let newSpan = document.createElement("span");
        newSpan.textContent = type;
        
        newSpan.style.backgroundColor = colorTypes[type];
        typesDiv.append(newSpan);
    })
    
    // D3
    const dataset = res.stats.map((x)=>{
        /* return {
            statName: x.stat.name,
            value: x.base_stat 
        } */
        return x.base_stat

    });
    
    let statNames = ["HP","ATK","DEF","SAtk","SDef","SPD"]
    const w = 300;
    const h = 200;
    const svg = d3.select(grid)
        .append("svg")
        .attr("width", w)
        .attr("height", h);
    svg.selectAll("svg")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => {
            return i * 50 + 10
        })
        .attr("y", (d, i) => h - d - 20)
        .attr("width", 30)
        .attr("height", (d)=> `${d}px`)
        .attr("fill",`${colorTypes[newPokemontypes[0]]}`)
        .append("title")
        .text((d,i)=> d);
    
      
    svg.selectAll("text")
        .data(statNames)
        .enter()
        .append("text")
        .attr("x",(d,i) => i * 50 +12)
        .attr("y",(d,i) => h)
        .attr("font-size","14px")
        .text((d,i) => d)
    pokemons.insertBefore(container,pokemons.firstChild);
    // RESET INPUT ON SUBMIT
    input.value = '';
})
