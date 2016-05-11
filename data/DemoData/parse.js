var fs = require('fs')
var path = require('path')

fs.readdirSync('./data/DemoData')

.filter(function (f) {return f.indexOf('json') >= 0})

.forEach(function (f) {

    
    var data = require(path.resolve(__dirname, f))

    var obj = {}
    obj.events = data['EVENTS'].map(function (e) {
    
        e.type = e.event_type
        return e
    })
    obj.topology = {}
    
    
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
    
        return {
            source: find_node_index(data['TOPOLOGY']['EDGES'][n][0]),
            target: find_node_index(data['TOPOLOGY']['EDGES'][n][1]),
            value: data['TOPOLOGY']['EDGES'][n][2].weight
        }
    
    })

    fs.writeFileSync(path.resolve(__dirname, 'formatted_'+f), JSON.stringify(obj))
    
   // fs.readFile(path.resolve(__dirname, f), function (d, e) {
   //     if (e) return console.log(e.toString())

   //     console.log(Object.keys(d))
   // })
})

/*
var data = require(path)

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

    return {
        source: find_node_index(data['TOPOLOGY']['EDGES'][n][0]),
        target: find_node_index(data['TOPOLOGY']['EDGES'][n][1]),
        value: data['TOPOLOGY']['EDGES'][n][2].weight
    }

})

//console.log(obj.topology.edges)

//var data = require('../../data/demo.json')
console.log(JSON.stringify(obj))
*/
