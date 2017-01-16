// Start with 5 nodes
const editor = {
  ele: $('.matrix table'),
  
  getLabel: function (index) {
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[index];
  },
  
  createCell: function(x, y) {
    const cell = $('<td>');
    const id = `matrix-${this.getLabel(y)}-${this.getLabel(x)}`;

    $('<input>', {
      id: id,
      type: 'text',
    }).appendTo(cell);

    $('<label>', {
      html: `
        <span style="color: ${color(this.getLabel(y))}">${this.getLabel(y)}</span> → 
        <span style="color: ${color(this.getLabel(x))}">${this.getLabel(x)}</span>`,
      'for': id,
    }).appendTo(cell);

    return cell;
  },
  
  getColumn: function (n) {
    return this.ele.find(`tr td:nth-child(${n})`);
  },

  getCell: function(x, y) {
    const max = this.ele.find('tr').length;
    
    // Handle wrap around
    if (x < 0) x = max + x;
    if (y < 0) y = max + y;
    if (x >= max) x = x - max;
    if (y >= max) y = y - max;
  
    return this.ele.find(`tr:nth-child(${y+1}) td:nth-child(${x+1})`);
  },

  addNode: function() {
    const cell = $('<td>');
    $('<input>', {
      type: 'text',
    }).appendTo(cell);

    this.ele.find('tr').each((y, ele) => {
      const $e = $(ele);
      $e.append(this.createCell($e.children().length, y));
    });

    const row = $('<tr>');
    const y = this.ele.find('tr').length;
    if (!y) {
      // First row
      row.append(this.createCell(0, 0));
    } else {
      this.ele.find('tr').first().children()
        .each((i) => row.append(this.createCell(i, y)));
    }
    this.ele.append(row);
  },

  getupdateGraphFromEditor: function() {
    const nodes = this.ele.find('tr').map(i => ({id: this.getLabel(i)})).get();
    const links = [];

    this.ele.find('tr').each((x, ele) => {
      $(ele).find('input').each((y, ele) => {
        // TODO: Handle multigraph

        const val = ele.value;
        if (!isNaN(parseFloat(val))) {
          links.push({
            source: this.getLabel(x),
            target: this.getLabel(y),
            weight: val,
          });
        }
      });
    });

    return {
      nodes: nodes,
      links: links,
    };
  },
  
  handleArrowKeys: function(key, ele) {
    const $e = $(ele).closest('td');
    const x = $e.prevAll().length;
    const y = $e.closest('tr').prevAll().length;

    let cell;
    switch (key) {
      case 'ArrowUp':
        cell = this.getCell(x, y - 1);
        break;
      case 'ArrowDown':
        cell = this.getCell(x, y + 1);
        break;
      case 'ArrowRight':
        cell = this.getCell(x + 1, y);
        break;
      case 'ArrowLeft':
        cell = this.getCell(x - 1, y);
        break;
    }

    if (cell) {
      cell.find('input').focus();
    }
  },
  
  updateGraph: function () {
    const graph = this.getupdateGraphFromEditor();

    displayJsonOutput(graph);
    displaySwiftOutput(graph);

    // This needs to be run after the display functions because 
    // d3.js mutates the input graph
    refreshGraph(graph);
  },
  
  init: function() {
    for (let i = 0; i < 5; i++) {
      this.addNode();
    }
    
    this.ele.on('keydown', 'input', e => this.handleArrowKeys(e.key, e.target));
    $('.add-node').click(() => this.addNode());
    $('.update-graph').click(() => this.updateGraph());

  },
};

editor.init();
