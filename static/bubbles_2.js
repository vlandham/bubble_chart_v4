var data1 = [
    {year1: 20, year2: 1, year3: 3, label: "a"},
    {year1: 3, year2: 4, year3: 5, label: "b"},
    {year1: 5, year2: 9, year3: 7, label: "c"},
    {year1: 8, year2: 16, year3: 11, label: "d"},
    {year1: 13, year2: 25, year3: 13, label: "e"},
    {year1: 21, year2: 36, year3: 17, label: "f"},
    {year1: 34, year2: 1, year3: 19, label: "g"},
    {year1: 2, year2: 4, year3: 23, label: "h"},
    {year1: 3, year2: 9, year3: 29, label: "i"},
    {year1: 5, year2: 16, year3: 31, label: "j"},
    {year1: 8, year2: 25, year3: 37, label: "k"},
    {year1: 13, year2: 36, year3: 3, label: "l"},
    {year1: 21, year2: 1, year3: 5, label: "m"}
];

let data2 = [
    {year1: 2, year2: 1, year3: 3, label: "a"},
    {year1: 3, year2: 4, year3: 5, label: "b"},
    {year1: 5, year2: 9, year3: 7, label: "c"},
    {year1: 8, year2: 16, year3: 11, label: "d"},
    {year1: 13, year2: 25, year3: 13, label: "e"},
    {year1: 2, year2: 36, year3: 17, label: "f"},
    {year1: 34, year2: 1, year3: 19, label: "g"},
    {year1: 2, year2: 4, year3: 23, label: "h"},
    {year1: 3, year2: 9, year3: 29, label: "i"},
    {year1: 5, year2: 16, year3: 31, label: "j"},
    {year1: 8, year2: 25, year3: 37, label: "k"},
    {year1: 13, year2: 36, year3: 3, label: "l"},
    {year1: 21, year2: 1, year3: 5, label: "m"},
    {year1: 21, year2: 1, year3: 5, label: "z"}
];

function sickChart(data) {
    let width = 1180;
    let height = 800;

    // Go about setting the force layout:
    var svg = d3.select("#vis")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var maxAmount = d3.max(data, function (d) {
        return d.year1;
    });

    // Sizes bubbles based on area.
    // @v4: new flattened scale names.
    var radiusScale = d3.scalePow()
        .exponent(0.5)
        .range([2, 85])
        .domain([0, maxAmount]);

    var colorScale = d3.scaleLinear()
        .domain([0, 10, 37])
        .range(["#c7e9b4", "#41b6c4", "#253494"]);

    var year = "year1";

    var simulation = d3.forceSimulation()
        .force("x", d3.forceX(function (d) {
            if (parseFloat(d[year]) > 5) {
                return width / 4;
            } else {
                return width / 4 * 3;
            }
        }).strength(0.05))
        .force("y", d3.forceY(height / 2).strength(0.05))
        .force("collide", d3.forceCollide()
            .radius(function (d) {
                return radiusScale(d[year])
            }));

    var bubbles = svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("r", function (d) {
            return radiusScale(d[year])
        })
        .attr("fill", function (d) {
            return colorScale(d[year]);
        });

    simulation.nodes(data)
        .on("tick", ticked)


    function ticked() {
        bubbles.attr("cx", function (d) {
            return d.x;
        }).attr("cy", function (d) {
            return d.y;
        })
    }

    return function(err, newData) {
        if (err) {
            return console.error(err);
        }
            console.log(bubbles.data())
            const old = new Map(bubbles.data().map(d => [d.label, d]));
            console.log(newData);
            data = newData.map(d => Object.assign(old.get(d.label) || {}, d));

            maxAmount = d3.max(data, function (d) {
                return d.year1;
            });
            radiusScale = d3.scalePow()
                .exponent(0.5)
                .range([2, 85])
                .domain([0, maxAmount]);

            // bubbles = svg.selectAll("circle")
            //     .data(data, d => d.label)
            //     .join(enter => enter.append('circle'))
            // .enter()
            // .append('circle')


            simulation.nodes(data);
            simulation
                .alpha(0.5)
                .alphaTarget(0.3)
                .restart();

            simulation.force("x").initialize(data);
            simulation.force("collide").initialize(data);

            bubbles.attr("r", function (d) {
                return radiusScale(d.year1)
            }).attr("fill", function (d) {
                return colorScale(d[year]);
            })
        }
}

let update;
function getData(page = 0) {
    const url = 'http:localhost:3000/' + page;
    fetch(url)
        .then(res => res.json())
        .then(({ path }) => {

            // load data
            if (!page) {
                d3.json(path, (err, data) => {
                    chart = sickChart(data)
                });
            } else { d3.json(path, update) }

            setTimeout(() => {
                getData(page + 1);
            }, 10 * 1000) // 10 sec
        })
        .catch(console.error);
}

// demo code
let updater = sickChart(data1);
setTimeout(() => {
    updater(null, data2);
}, 1000)
