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
            { type: 'name'   , text: this.getClassName() },
            { type: 'attrs'  , text: this.get('attributes') },
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


// parse XML ///////////////////////////////////////////////////////////////////

var skdmXmlStr = sampleXMLMovies;
var entitiesXmlPath = "entities > entity";
var edgesXmlPath = "edges > edge";

// https://developer.mozilla.org/en-US/docs/Web/Guide/Parsing_and_serializing_XML
var parser = new DOMParser();
var sketchXMLDOM = parser.parseFromString(skdmXmlStr, "text/xml");
//console.log(sketchXMLDOM.documentElement.nodeName == "parsererror" ? "error while parsing" : oDOM.documentElement);
console.log('document = ', sketchXMLDOM.documentElement);

var entityNodes = sketchXMLDOM.documentElement.querySelectorAll(entitiesXmlPath);
console.log('entityNodes = ', entityNodes);

var edgeNodes = sketchXMLDOM.documentElement.querySelectorAll(edgesXmlPath);
console.log('edgeNodes = ', edgeNodes);

////////////////////////////////////////////////////////////////////////////////

function toEntityAttribute(node) {
    return { name: node.attributes['name'].nodeValue
           , attributeTypeClass:  node.attributes['attributeTypeClass'].nodeValue
           };
}

function toEntity(node) {
    return { name: node.attributes['name'].nodeValue
           , attributes: _.map(node.children, toEntityAttribute)
           , x:    node.attributes['x'].nodeValue
           , y:    node.attributes['y'].nodeValue
           };
}

function toPartialSkdmEntityShapeDesc(entity) {
    return { name:       entity.name
           , position:   { x: entity.x, y: entity.y }
           , attributes: _.map(entity.attributes, e => e.name)
           };
}

const defaultShapeAttrs = {
    // attributes: ['@foo'],
    methods: [],
    size: { width: 130, height: 80 }
};

const entities      = _.map(entityNodes, toEntity);
const skdmShapesMap = _.object(_.map(entities, entity => [entity.name, new joint.shapes.skdm.Table2(_.extend(defaultShapeAttrs, toPartialSkdmEntityShapeDesc(entity)))]));

////////////////////////////////////////////////////////////////////////////////

function toEdge(edgeNode) {
    return { source:  edgeNode.attributes['source'].nodeValue
           , target:  edgeNode.attributes['target'].nodeValue
           , type:    edgeNode.attributes['type'].nodeValue
           , cascade: edgeNode.attributes['cascade'].nodeValue
           };
}

// curried
// :: Map String joint.shapes.skdm.Table2 -> Edge -> PartialLinkDesc
function edgeToPartialSkdmEdgeShapeDesc(skdmShapesMap) {
    return function(edge) {
        return { source: { id: skdmShapesMap[ edge.source ].id }
               , target: { id: skdmShapesMap[ edge.target ].id }
               };
    };
}

var edges = _.map(edgeNodes, _.compose(edgeToPartialSkdmEdgeShapeDesc(skdmShapesMap), toEdge));
console.log('edges[0] = ', edges[0]);
console.log('edges = ', edges);


// draw graph //////////////////////////////////////////////////////////////////

// attrs: { '.connection': { stroke: '#777', 'stroke-width': 2, 'stroke-dasharray': '5 2' }}
const edgeLinks  = _.map(edges, edge => new joint.dia.Link(edge));
const skdmShapes = _.values(skdmShapesMap);

var graph = new joint.dia.Graph;

var paper = new joint.dia.Paper({
    el: $('#sketch'),
    width: 1200,
    height: 1000,
    model: graph,
    gridSize: 1
});

graph.addCells(skdmShapes.concat(edgeLinks));


