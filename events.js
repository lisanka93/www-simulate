module.exports = function () {
  var cs = {}
  return {
    on(c, f) {
      if (typeof f !== 'function') return
      (cs[c] = cs[c] || []).unshift(f) 
    }
  , emit(c, d) {
      (cs[c] || []).forEach(f => { f(d) }) 
    }
  }
}
