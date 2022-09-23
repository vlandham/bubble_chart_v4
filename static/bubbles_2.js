const data1 = [

    {"id": 1, "amount": 10.00, 'state': 'unpaid', 'date': '09-22-2022', 'bentobox_revenue': 1.00, 'restaurant_revenue': 9.00},
    {"id": 2, "amount": 25.90, 'state': 'unpaid', 'date': '09-22-2022', 'bentobox_revenue': 2.59, 'restaurant_revenue': 23.41}
]

const data2 = [
    {"id": 1, "amount": 10.00, 'state': 'unpaid', 'date': '09-22-2022', 'bentobox_revenue': 1.00, 'restaurant_revenue': 9.00},
    {"id": 2, "amount": 25.90, 'state': 'paid', 'date': '09-22-2022', 'bentobox_revenue': 2.59, 'restaurant_revenue': 23.41}
]

function sickChart(data) {
    let width = 1180;
    let height = 800;

    // Go about setting the force layout:
    var svg = d3.select("#vis")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var maxAmount = d3.max(data, function (d) {
        return d.amount;
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

    var simulation = d3.forceSimulation()
        .force("x", d3.forceX(function (d) {
            if (d.state === 'unpaid') {
                return width / 4;
            } else {
                return width / 4 * 3;
            }
        }).strength(0.05))
        .force("y", d3.forceY(height / 2).strength(0.05))
        .force("collide", d3.forceCollide()
            .radius(function (d) {
                return radiusScale(d.amount)
            }));

    var bubbles = svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("r", function (d) {
            return radiusScale(d.amount)
        })
        .attr("fill", function (d) {
            return colorScale(d.amount);
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
            const old = new Map(bubbles.data().map(d => [d.id, d]));
            data = newData.map(d => Object.assign(old.get(d.id) || {}, d));

            maxAmount = d3.max(data, function (d) {
                return d.amount;
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
                return radiusScale(d.amount)
            }).attr("fill", function (d) {
                return colorScale(d.amount);
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
