var data = require('./POP_NEIGHBOUR_DYN_clean_events.json')

var obj = {}
obj.events = data['EVENTS'].map(function (e) {

    e.type = e.event_type
    return e
})
obj.topology = {}

//console.log(data['TOPOLOGY']['NODES'])

function find_node_index(n) {
    for (var i = 0; i < obj.topology['nodes'].length; i++) {
        if (obj.topology['nodes'][i].name == n) {
            return i
        }
    }
}

obj.topology['nodes'] = Object.keys(data['TOPOLOGY']['NODES']).map(function (n) {

    return {
        name: n,
        type: data['TOPOLOGY']['NODES'][n].stack[0] 
    }
})

obj.topology['edges'] = Object.keys(data['TOPOLOGY']['EDGES']).map(function (n) {

//    console.log(data['TOPOLOGY']['EDGES'][n])
    return {
        source: find_node_index(data['TOPOLOGY']['EDGES'][n][0]),
        target: find_node_index(data['TOPOLOGY']['EDGES'][n][1]),
        value: data['TOPOLOGY']['EDGES'][n][2].weight
    }

})

//console.log(obj.topology.edges)

//var data = require('../../data/demo.json')
console.log(JSON.stringify(obj))
