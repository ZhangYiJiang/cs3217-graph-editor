const svg = d3.select("svg");

// Get the height and width
const svgEle = $("svg");
const width = svgEle.width();
const height = svgEle.height();

const color = d3.scaleOrdinal(d3.schemeCategory10);

const simulation = d3.forceSimulation()
  .force("link", d3.forceLink().id(d => d.id).distance(100))
  .force("charge", d3.forceManyBody().strength(-1000))
  .force("center", d3.forceCenter(width / 2, height / 2))
  .force("x", d3.forceX())
  .force("y", d3.forceY())
  .on("tick", ticked);

let links = svg.append("g").attr("class", "links");
let nodes = svg.append("g").attr("class", "nodes");

const graph = {
  nodes: [{id: "A"}, {id: "B"}, {id: "C"}, {id: "D"}], 
  links: [{
    source: "A",
    target: "B",
    weight: 1,
  }, {
    source: "A",
    target: "C",
    weight: 2,
  }, {
    source: "B",
    target: "D",
    weight: 1,
  }, {
    source: "A",
    target: "D",
    weight: 3,
  }],
};

function ticked() {
  links
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

  nodes
    .attr("transform", d => "translate(" + d.x + "," + d.y + ")");
}

function refreshGraph(graph) {
  nodes = svg.select('.nodes')
    .selectAll(".node")
    .data(graph.nodes, d => d.id);
  
  links = svg.select(".links")
    .selectAll(".links .link")
    .data(graph.links, d => [d.source, d.target, d.weight].join('-'));
  
  // Handle removing links and nodes
  nodes.exit().remove();
  links.exit().remove();
  
  links = links.enter()
    .append("line")
      .attr("class", "link")
      .attr("stroke", "#999")
    .merge(links)
      .attr("stroke-width", d => d.weight);
  
  const newNodes = nodes.enter()
    .append("g")
      .attr("class", "node")
      .attr("id", d => "node-" + d.id)
      .call(d3.drag()
        .on("start", d => {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", d => {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        })
        .on("end", d => {
          if (!d3.event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

  nodes = nodes.merge(newNodes);

  newNodes.append("circle")
    .attr("r", 11)
    .attr("fill", d => color(d.id));
  
  newNodes.append("text")
    .attr("x", -4)
    .attr("y", 4)
    .text(d => d.id);
  
  simulation.nodes(graph.nodes);
  simulation.force("link").links(graph.links);
  simulation.alpha(1).restart();
}

refreshGraph(graph);
