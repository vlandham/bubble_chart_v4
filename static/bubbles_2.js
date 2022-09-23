const allData = [
   [{"amount": 56.43, "bentobox_revenue": "9.50", "date": "01/21/2022", "id": "3d3ff12f-3227-4c3e-9bb4-d10b965794b5", "restaurant_revenue": 65.93, "state": "unpaid"}],
    [{"amount": 56.43, "bentobox_revenue": "9.50", "date": "01/21/2022", "id": "3d3ff12f-3227-4c3e-9bb4-d10b965794b5", "restaurant_revenue": 65.93, "state": "paid"}, {"amount": 50.7, "bentobox_revenue": "2.74", "date": "07/04/2022", "id": "90d300da-dddc-4d18-8c65-64a7c981198b", "restaurant_revenue": 53.44, "state": "unpaid"}],
    [{"amount": 56.43, "bentobox_revenue": "9.50", "date": "01/21/2022", "id": "3d3ff12f-3227-4c3e-9bb4-d10b965794b5", "restaurant_revenue": 65.93, "state": "paid"}, {"amount": 50.7, "bentobox_revenue": "2.74", "date": "07/04/2022", "id": "90d300da-dddc-4d18-8c65-64a7c981198b", "restaurant_revenue": 53.44, "state": "paid"}, {"amount": 51.63, "bentobox_revenue": "14.99", "date": "10/13/2022", "id": "32449c9c-b161-4b66-83b2-e6cff8ae6498", "restaurant_revenue": 66.62, "state": "unpaid"}, {"amount": 35.31, "bentobox_revenue": "9.80", "date": "05/20/2022", "id": "f6b502f1-0169-4ade-b568-9c26f99fd05c", "restaurant_revenue": 45.11, "state": "unpaid"}],
    [{"amount": 56.43, "bentobox_revenue": "9.50", "date": "01/21/2022", "id": "3d3ff12f-3227-4c3e-9bb4-d10b965794b5", "restaurant_revenue": 65.93, "state": "paid"}, {"amount": 50.7, "bentobox_revenue": "2.74", "date": "07/04/2022", "id": "90d300da-dddc-4d18-8c65-64a7c981198b", "restaurant_revenue": 53.44, "state": "paid"}, {"amount": 51.63, "bentobox_revenue": "14.99", "date": "10/13/2022", "id": "32449c9c-b161-4b66-83b2-e6cff8ae6498", "restaurant_revenue": 66.62, "state": "paid"}, {"amount": 35.31, "bentobox_revenue": "9.80", "date": "05/20/2022", "id": "f6b502f1-0169-4ade-b568-9c26f99fd05c", "restaurant_revenue": 45.11, "state": "paid"}, {"amount": 51.14, "bentobox_revenue": "8.63", "date": "09/25/2022", "id": "7f95c752-fa15-423a-bcc1-54a5ac5973c1", "restaurant_revenue": 59.77, "state": "unpaid"}]
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
        .range([2, 25])
        .domain([0, maxAmount]);

    var colorScale = d3.scaleLinear()
        .domain([3, 33, 63])
        .range(["#c7e9b4", "#41b6c4", "#253494"]);

    var simulation = d3.forceSimulation()
        .force("x", d3.forceX(function (d) {
            if (d.state === 'unpaid') {
                return width / 6;
            } else {
                return width / 6 * 5;
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
                .range([2, 25])
                .domain([0, maxAmount]);

            bubbles = svg.selectAll("circle")
                .data(data, d => d.id)

            bubbles.exit().remove();

            bubbles.enter()
                .append('circle')
                .merge(bubbles)




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
    const url = 'http://localhost:3000/api/orders/' + page;
    fetch(url)
        .then(res => res.json())
        .then((data) => {

            // load data
            if (!update) {
                update = sickChart(data)
            } else {
                update(null, data)
            }

            setTimeout(() => {
                getData(page + 1);
            }, 3 * 1000) // 10 sec
        })
        .catch(console.error);
}
getData();

 // demo code
// let updater = sickChart(allData[0]);
// setTimeout(() => {
//     updater(null, allData[1]);
//     updater(null, allData[1]);
// }, 1000)
// setTimeout(() => {
//     updater(null, allData[2]);
//     updater(null, allData[2]);
// }, 2000)
// setTimeout(() => {
//     updater(null, allData[3]);
//     updater(null, allData[3]);
// }, 3000)
