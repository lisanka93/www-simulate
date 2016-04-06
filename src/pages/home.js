const nav = require('../components/navigation.js')

module.exports = (h, store) => {

  return h`
    <div id='home'>
      <h1 id='title'>Simulate</h1>
      ${ nav(h, store) }
    </div>
  ` 
}
