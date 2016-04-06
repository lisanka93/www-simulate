const nav = require('../components/navigation.js')
console.log(nav)
module.exports = (h) => {

  return h`
    <div id='home'>
      <h1 id='title'>Simulate</h1>
      ${ nav(h) }
    </div>
  ` 
}
