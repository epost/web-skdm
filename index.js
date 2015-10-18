// based on ideas from http://www.mta.ca/~rrosebru/project/Easik/
// based on code from http://jointjs.com/js/demos/umlcd.js
// TODO auto-set the height?

joint.shapes.skdm = {};

joint.shapes.skdm.Table = joint.shapes.basic.Generic.extend({
    markup: '<g class="rotatable"><g class="scalable"><rect/></g><text/></g>',

    defaults: joint.util.deepSupplement({
        type: 'skdm.Table',
        attrs: {
            'rect': { fill: '#aaa', stroke: '#777', 'follow-scale': true, width: 80, height: 40 },
            'text': { 'font-size': 14, 'ref-x': .5, 'ref-y': .5, ref: 'rect', 'y-alignment': 'middle', 'x-alignment': 'middle' }
        }
    }, joint.shapes.basic.Generic.prototype.defaults)
});


// adapted from joint.shapes.uml.Class
joint.shapes.skdm.Table2 = joint.shapes.basic.Generic.extend({
    markup: [
        '<g class="rotatable">',
          '<g class="scalable">',
            '<rect class="skdm-table-name-rect"/><rect class="skdm-table-attrs-rect"/><rect class="skdm-table-methods-rect"/>',
          '</g>',
          '<text class="skdm-table-name-text"/><text class="skdm-table-attrs-text"/><text class="skdm-table-methods-text"/>',
        '</g>'
    ].join(''),

    defaults: joint.util.deepSupplement({
        type: 'skdm.Table2',
        attrs: {
            'rect': { fill: 'white', stroke: '#777', 'follow-scale': true, width: 80, height: 140 },
            'text': {
                'font-size': 14,
                'ref-x': .5,
                'ref-y': .5,
                'ref': 'rect',
                'y-alignment': 'middle',
                'x-alignment': 'middle'
            },

            rect: { 'width': 200 },

            '.skdm-table-name-rect':    { 'stroke': '#777', 'stroke-width': 1, 'fill': '#aaa' },
            '.skdm-table-attrs-rect':   { 'stroke': '#777', 'stroke-width': 1, 'fill': '#ccc' },
            '.skdm-table-methods-rect': { 'stroke': '#777', 'stroke-width': 1, 'fill': '#ccc' },

            '.skdm-table-name-text': {
                'ref': '.skdm-table-name-rect', 'ref-y': .5, 'ref-x': .5, 'text-anchor': 'middle', 'y-alignment': 'middle', 'font-weight': 'bold',
                'fill': '#555', 'font-size': 12
            },
            '.skdm-table-attrs-text': {
                'ref': '.skdm-table-attrs-rect', 'ref-y': 5, 'ref-x': 5,
                'fill': '#555', 'font-size': 12
            },
            '.skdm-table-methods-text': {
                'ref': '.skdm-table-methods-rect', 'ref-y': 5, 'ref-x': 5,
                'fill': '#555', 'font-size': 12
            }
        }
    }, joint.shapes.basic.Generic.prototype.defaults),


    initialize: function() {
        this.on('change:name change:attributes change:methods', function() {
            this.updateRectangles();
            this.trigger('skdm-update');
        }, this);

        this.updateRectangles();

        joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
    },

    getClassName: function() {
        return this.get('name');
    },

    updateRectangles: function() {
        var attrs = this.get('attrs');

        var rects = [
            { type: 'name', text: this.getClassName() },
            { type: 'attrs', text: this.get('attributes') },
            { type: 'methods', text: this.get('methods') }
        ];

        var offsetY = 0;

        _.each(rects, function(rect) {

            var lines = _.isArray(rect.text) ? rect.text : [rect.text];
            var rectHeight = lines.length * 20 + 20;

            attrs['.skdm-table-' + rect.type + '-text'].text = lines.join('\n');
            attrs['.skdm-table-' + rect.type + '-rect'].height = rectHeight;
            attrs['.skdm-table-' + rect.type + '-rect'].transform = 'translate(0,' + offsetY + ')';

            offsetY += rectHeight;
        });
    }

});

var graph = new joint.dia.Graph;

var paper = new joint.dia.Paper({
    el: $('#sketch'),
    width: 600,
    height: 400,
    model: graph,
    gridSize: 1
});

var pb = new joint.shapes.skdm.Table({
    position: { x: 250, y: 190 },
    size: { width: 100, height: 30 },
    attrs: { text: { text: 'PB' } }
});

var course = new joint.shapes.skdm.Table2({
    name: 'Course',
    attributes: ['@dept', '@credits', '@level', '@name'],
    methods: ['$course'],
    position: { x: 200, y: 30 },
    size: { width: 200, height: 120 }
});

var clazz = new joint.shapes.skdm.Table2({
    name: 'Class',
    attributes: ['@offerNumber'],
    methods: [],
    position: { x: 400, y: 190 },
    size: { width: 200, height: 80 }
});


// link styling examples: http://jointjs.com/demos/links
var links = [
    new joint.dia.Link({ source: { id: pb.id }   , target: { id: course.id },  attrs: { '.connection': { stroke: '#777', 'stroke-width': 2, 'stroke-dasharray': '5 2' }}}),
    new joint.dia.Link({ source: { id: clazz.id }, target: { id: course.id } }),
    new joint.dia.Link({ source: { id: pb.id }   , target: { id: clazz.id }
    }),
];

graph.addCells([pb, course, clazz].concat(links));
