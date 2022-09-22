/* bubbleChart creation function. Returns a function that will
 * instantiate a new bubble chart given a DOM element to display
 * it in and a dataset to visualize.
 *
 * Organization and style inspired by:
 * https://bost.ocks.org/mike/chart/
 *
 */
function bubbleChart() {
  // Constants for sizing

  var width = 940;
  var height = 600;

  // tooltip for mouseover functionality
  // var tooltip = floatingTooltip('gates_tooltip', 240);

  var orderStatusCenters = {
    incomplete: { x: width / 3, y: height / 2 },
    complete: { x: 2 * width / 3, y: height / 2 }
  };

  // X locations of the year titles.
  var orderStatusTitlesX = {
    incomplete: width / 3,
    complete: width / 3 * 2
  };

  // @v4 strength to apply to the position forces
  var forceStrength = 0.03;

  // These will be set in create_nodes and create_vis
  var svg = null;
  var bubbles = null;
  var nodes = [];

  // Charge function that is called for each node.
  // As part of the ManyBody force.
  // This is what creates the repulsion between nodes.
  //
  // Charge is proportional to the diameter of the
  // circle (which is stored in the radius attribute
  // of the circle's associated data.
  //
  // This is done to allow for accurate collision
  // detection with nodes of different sizes.
  //
  // Charge is negative because we want nodes to repel.
  // @v4 Before the charge was a stand-alone attribute
  //  of the force layout. Now we can use it as a separate force!
  function charge(d) {
    return -Math.pow(d.radius, 2.0) * forceStrength;
  }

  // Here we create a force layout and
  // @v4 We create a force simulation now and
  //  add forces to it.
  var simulation = d3.forceSimulation()
    .velocityDecay(0.2)
    .force('x', d3.forceX().strength(forceStrength).x(orderStatusCenters.incomplete))
    .force('y', d3.forceY().strength(forceStrength).y(height / 2))
    .force('charge', d3.forceManyBody().strength(charge))
    .on('tick', ticked);

  // @v4 Force starts up automatically,
  //  which we don't want as there aren't any nodes yet.
  simulation.stop();

  // Nice looking colors - no reason to buck the trend
  // @v4 scales now have a flattened naming scheme
  var fillColor = d3.scaleOrdinal()
    .domain(['low', 'medium', 'high'])
    .range(['#d84b2a', '#beccae', '#7aa25c']);


  /*
   * This data manipulation function takes the raw data from
   * the CSV file and converts it into an array of node objects.
   * Each node will store data and visualization values to visualize
   * a bubble.
   *
   * rawData is expected to be an array of data objects, read in from
   * one of d3's loading functions like d3.csv.
   *
   * This function returns the new node array, with a node in that
   * array for each element in the rawData input.
   */
  function createNodes(rawData) {
    // Use the max total_amount in the data as the max in the scale's domain
    // note we have to ensure the total_amount is a number.

    // TODO: refactor this to get the max order price/amount
    var maxAmount = d3.max(rawData, function (d) { return d.amount; });

    // Sizes bubbles based on area.
    // @v4: new flattened scale names.
    var radiusScale = d3.scalePow()
      .exponent(0.5)
      .range([2, 85])
      .domain([0, maxAmount]);

    // Use map() to convert raw data into node data.
    // Checkout http://learnjsdata.com/ for more on
    // working with data.

    // TODO: convert to order data
    var myNodes = rawData.map(function (d) {
      return {
        id: d.id,
        radius: radiusScale(+d.amount),
        value: +d.amount,
        name: '',
        state: d.state,
        org: d.organization,
        group: d.group,
        year: d.start_year,
        x: orderStatusCenters[d.state],
        y: Math.random() * 800
      };
    });

    // sort them to prevent occlusion of smaller nodes.
    myNodes.sort(function (a, b) { return b.value - a.value; });

    return myNodes;
  }

  // TODO: this should be a class that exposes an update function that takes new rawData
  /*
   * Main entry point to the bubble chart. This function is returned
   * by the parent closure. It prepares the rawData for visualization
   * and adds an svg element to the provided selector and starts the
   * visualization creation process.
   *
   * selector is expected to be a DOM element or CSS selector that
   * points to the parent element of the bubble chart. Inside this
   * element, the code will add the SVG continer for the visualization.
   *
   * rawData is expected to be an array of data objects as provided by
   * a d3 loading function like d3.csv.
   */
  var chart = function chart(selector, rawData) {
    // convert raw data into nodes data
    nodes = createNodes(rawData);

    // Create a SVG element inside the provided selector
    // with desired size.
    svg = d3.select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Bind nodes data to what will become DOM elements to represent them.
    bubbles = svg.selectAll('.bubble')
      .data(nodes, function (d) { return d.id; });

    // Create new circle elements each with class `bubble`.
    // There will be one circle.bubble for each object in the nodes array.
    // Initially, their radius (r attribute) will be 0.
    // @v4 Selections are immutable, so lets capture the
    //  enter selection to apply our transtition to below.
    var bubblesE = bubbles.enter().append('circle')
      .classed('bubble', true)
      .attr('r', 0)
      .attr('fill', function (d) { return fillColor(d.group); })
      .attr('stroke', function (d) { return d3.rgb(fillColor(d.group)).darker(); })
      .attr('stroke-width', 2)
      // .on('mouseover', showDetail)
      // .on('mouseout', hideDetail);

    // @v4 Merge the original empty selection and the enter selection
    bubbles = bubbles.merge(bubblesE);

    // Fancy transition to make bubbles appear, ending with the
    // correct radius
    bubbles.transition()
      .duration(2000)
      .attr('r', function (d) { return d.radius; });

    // Set the simulation's nodes to our newly created nodes array.
    // @v4 Once we set the nodes, the simulation will start running automatically!
    simulation.nodes(nodes);

    renderBubbles();
  };

   chart.update = function(rawData) {
     // TODO: add new nodes

    // update nodes
     const old = new Map(bubbles.data().map(d => [d.id, d]));
     nodes = createNodes(rawData);
     nodes = nodes.map(d => Object.assign(old.get(d.id) || {}, d));
     bubbles.data(nodes, function(d) {return d.id})
     console.log(nodes)

     simulation.alpha(1).restart();
     simulation.nodes(nodes)
     simulation.force('x').initialize(nodes);

     // @v4 We can reset the alpha value and restart the simulation

  }

  /*
   * Callback function that is called after every tick of the
   * force simulation.
   * Here we do the acutal repositioning of the SVG circles
   * based on the current x and y values of their bound node data.
   * These x and y values are modified by the force simulation.
   */
  function ticked() {
    bubbles
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; });
  }

  /*
   * Provides a x value for each node to be used with the split by year
   * x force.
   */
  // TODO: use order.completed/incomplete here, also rename
  function nodeYearPos(d) {
    const xxx = orderStatusCenters[d.state].x;
    console.log(xxx)
    return xxx;
  }


  // TODO: does this need to be part of the update function? Andrew thinks so
  function renderBubbles() {
    showOrderStatusTitles();

    // @v4 Reset the 'x' force to draw the bubbles to their year centers
    simulation.force('x', d3.forceX().strength(forceStrength).x(nodeYearPos));

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }

  /*
   * Shows Year title displays.
   */
  function showOrderStatusTitles() {
    // Another way to do this would be to create
    // the year texts once and then just hide them.
    var orderStatusData = d3.keys(orderStatusTitlesX);
    var orderStatuses = svg.selectAll('.year')
      .data(orderStatusData);

    orderStatuses.enter().append('text')
      .attr('class', 'year')
      .attr('x', function (d) { return orderStatusTitlesX[d]; })
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });
  }




  // return the chart function from closure.
  return chart;
}

/*
 * Below is the initialization code as well as some helper functions
 * to create a new bubble chart instance, load the data, and display it.
 */

var myBubbleChart = bubbleChart();

/*
 * Function called once data is loaded from CSV.
 * Calls bubble chart function to display inside #vis div.
 */
function renderFirst(error, data) {
  if (error) {
    console.log(error);
  }
  myBubbleChart('#vis', data);
}

function update(error, data) {
  if (error) {
    console.log(error);
  }

  myBubbleChart.update(data)
}

function getData(page = 0) {
  const url = 'url/' + dataCounter;
  fetch(url)
      .then(res => res.json())
      .then(({ path }) => {

        // load data
        if (!page) { d3.json(path, renderFirst); }
        else { d3.json(path, update) }

        setTimeout(() => {
          getData(page + 1);
        }, 10 * 1000) // 10 sec
      })
      .catch(console.error);
}

// getData();

const dataOne = [

  {"id": 1, "amount": 10.00, 'state': 'incomplete', 'date': '09-22-2022', 'bentobox_revenue': 1.00, 'restaurant_revenue': 9.00},
  {"id": 2, "amount": 25.90, 'state': 'incomplete', 'date': '09-22-2022', 'bentobox_revenue': 2.59, 'restaurant_revenue': 23.41}
]

const dataTwo = [
  {"id": 1, "amount": 10.00, 'state': 'incomplete', 'date': '09-22-2022', 'bentobox_revenue': 1.00, 'restaurant_revenue': 9.00},
  {"id": 2, "amount": 25.90, 'state': 'complete', 'date': '09-22-2022', 'bentobox_revenue': 2.59, 'restaurant_revenue': 23.41}
]

renderFirst(null, dataOne);
setTimeout(() => {
  update(null, dataTwo);
}, 2000);

// Load the data.
// d3.csv('data/gates_money.csv', renderFirst);

// setup the buttons.
// setupButtons();
