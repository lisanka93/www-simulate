var navigation = require('../src/components/navigation.js')

module.exports = (h, store, test) => {
    
  test('/', t => {
  
    var el = navigation(h, store)
    document.body.appendChild(el)
    
    ;['tour','demo'].forEach(id => {
      var button = document.querySelector('#' + id)
      t.ok(button, id + ' button exists')
    })
    
    t.end()
  })
}
