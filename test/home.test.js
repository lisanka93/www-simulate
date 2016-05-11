module.exports = (h, store, test) => {

  var home = require('../src/pages/home.js')(h, store)
  
  test('home', t => {
    t.equals(home.id, 'home', 'component id is #home')
    
    var title = home.querySelector('#title')
    t.ok(title, '#title component rendered')

    ;['tour','demo','compare','about'].forEach(id => {
      var button = home.querySelector('#' + id)
      t.ok(button, id + ' navigation button exists')
    })
    
    t.end()
  })
}
