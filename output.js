function toSwift(graph) {
  const lines = ['var graph = Graph<String>(isDirected: true)'];
  
  graph.nodes.forEach((node) => {
    lines.push(`graph.addNode(Node("${node.id}"))`);
  });
  
  graph.links.forEach((link) => {
    lines.push(`graph.addEdge(Edge(source: Node("${link.source}"), destination: Node("${link.target}"), weight: ${link.weight}))`);
  });
  
  return lines.join('\n');
}

function displaySwiftOutput(graph) {
  $('#swift-output').text(toSwift(graph));
}

function displayJsonOutput(graph) {
  $('#json-output').text(JSON.stringify(graph, null, 2));
}