exports.panes = {
  'intro': {
    title: 'Introduction'
  , description: 'Hello@'
  }
, 'motive': {
    title: 'Motivation'
  , description: 'Motivational speech'
  }
, 'content': {
    title: 'Content-Addressing'
  , description: 'dear content'
  }
, 'cache': {
    title: 'Caching'
  , description: 'Caught youg'
  }
, 'algo': {
    title: 'Algorithm'
  , description: 'Bob dole'
  }
}

exports.render = section => {
  return (h, store) => {

    return h`<div class='section'>
      <h2 class='title'>${section.title}</h2>
      <p class='description'>${section.description}</p>
    </div>`
  }
}
