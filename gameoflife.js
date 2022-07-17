var grid = createGrid(50, 40);
initRender();
   
const start = [
   
    {x:4, y:5},
    {x:2, y:5},
    {x:3, y:5},

    {x:4, y:4},

    {x:3, y:3},

];

start.map( e => setStatus(e, 1));

render();


window.setInterval(generation, 300);

/////////////////////////////////////

function generation(){
    prepareNextGeneration();
    performNextGeneration();
    render();
}

function prepareNextGeneration(){
    grid.map( (line,y) => {
        line.map( (e, x) => { 
            const gna = getCountNeighboursAlive({x,y}); 

            if(getStatus({x,y}) === 1 ){
                if(gna === 2 || gna === 3){
                    prepareStatus({x,y}, 1);
                } else {
                    prepareStatus({x,y}, 0);
                }
            }

            if(getStatus({x,y}) === 0 ){
                if( gna === 3){
                    prepareStatus({x,y}, 1);
                } else {
                    prepareStatus({x,y}, 0);
                }
            }
        })
    })
}

function performNextGeneration(){
    grid.map( (line,y) => {
        line.map( (e, x) => { 
            setStatus({x,y}, grid[y][x].next);           
        })
    })
}

function createGrid(width, height) {
    return Array.from(Array(height), () => new Array(width).fill({status: 0, next: 3}));
}

function initRender() {
    const gol = document.getElementById('gol');

    grid.map( (line,y) => {
        line.map( (e, x) => {        
            let element = document.createElement("div");
            element.id = `${x},${y}`;
            element.title = `${x},${y}`;
            element.classList.add('element')
            gol.appendChild(element)
        });
        let element = document.createElement("div");
        element.classList.add('break')
        gol.appendChild(element)
    });
   
}

function render() {
    grid.map( (line,y) => {
        line.map( (e, x) => {    
            if(grid[y][x].status === 1 ){    
                document.getElementById(`${x},${y}`).classList.add('alive');
            } else {
                document.getElementById(`${x},${y}`).classList.remove('alive');
            }
        });
    });
   
}

function setStatus(e, status) {
    grid[e.y][e.x] = {status, next: 0};
}

function prepareStatus(e, next) {
    const status = grid[e.y][e.x].status;
    grid[e.y][e.x] = {status, next};;
}

function getStatus(e) {
    return grid[e.y][e.x].status;
}

function getNeighbours(e) {
    const x = e.x;
    const y = e.y;

    // no neighbours at the border
    if (x == 0 || y == 0 || y == grid.length - 1 || x == grid[0].length - 1) {
        return [];
    }
    return [
        {x: x - 1, y: y - 1},
        {x: x, y: y - 1},
        {x: x + 1, y: y - 1},

        {x: x - 1, y: y},
        {x: x + 1, y: y},

        {x: x - 1, y: y + 1},
        {x: x, y: y + 1},
        {x: x + 1, y: y + 1},
    ];
}

function getCountNeighboursAlive(e){
   return getNeighbours(e).reduce( (p,c) => (getStatus(c)) ? p + 1 : p, 0)
}