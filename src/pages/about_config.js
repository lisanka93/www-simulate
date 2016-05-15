exports.panes = {
  'intro': {
    title: 'Introduction'
  , description:
  'Welcome to the visualisation of our group project on Resource Allocation in Content-Centric Networks.'
  'The current internet hosts communicate via IP addresses in the packet headers. Therefore, IP defines the packet'
  'stucture of the encapsulated data to be delivered and is absolutely location dependent – the requestor-host addresses'
  'the server-host and vice versa. This, however, is not very efficient. It results in a lot of unnecessary traffic while'
  'the requests propagate back and forth between the peers. The most intuitive solution would be to cache popular content'
  'closer to locations with high demand and address data via content and not location. The requestor would then be served'
  'from the closest node that has cached that particular content before and the request would not have to propagate all the way'
  'to the initial source every time.'
  }
, 'motive': {
    title: 'Motivation'
  , description:
  'Some companies including Netflix and YouTube already make use of this idea and locate popular content closer to the locations'
  'where there is a higher demand for that specific content. However, they are still doing that in a location based way, by'
  'prepopulating the servers with popular content in order to reduce traffic during peek times. We wanted to implement '
  'popularity based caching on the protocol level and develop an algorithm that would allow the caching nodes in a network'
  'decide what content to cache based on that contents popularity score. Data objects in such a network are addressed by their '
  'content using a hash function and not by the location of the server. Such networks are called "Content-Centric" and over'
  'the past years this area has attracted a lot of research interest'
  }
, 'cache': {
    title: 'Caching'
  , description: 
  'Our caching algorithms are all based on the same concept by using a populrity table for keeping track of the popularity'
  'for specific content that is traveling throughout the network. All caching nodes maintain a popularity table and every time'
  'a data object travels through them it increments the popularity of that object by one in its table. As soon as the content'
  'reaches an established threshold, it is being cached in the node. In order to avoid caching'
  'content that becomes unpopular over time, the popularity of all contents is being decremend every time interval by a'
  'fixed amount. As soon as the cache becomes full, the content with the lowest accumulated popularity score is being deleted'
  'and replaced by the new popular content. If a specific content had not been requested for a long period of time, it is being'
  'deleted as well.'
  }
, 'algo': {
    title: 'Algorithms'
  , description: 'We implemented six different algoithms'
  'self-caching (static): using this algorithm, the caching node will only cache the content in itself as soon as the content'
  'reaches a defined threshold'
  'self-caching (dynamic): this algorithm does the same with the difference that the threshold at each node is'
  'dynamic changes over time'
  'neighbour-caching (static): this algorithm suggests its neighbours to cache popular content and the neighbouring nodes'
  'always cache'
  'neighbour-caching (dynamic): same, but threshold dynamic'
  'neighbour-caching-t (static): this algorithm differs from the pervious by allowing the nodes that receive a suggestion'
  'to decline if their threshold was not met'
  'neighbour-caching-t (dynamic): same but both thresholds dynamic'
  }
, 'who': {
    title: 'Who is behind it?'
  , description: 'Supervisor: Kin Leung (Department of Electrical and Electronic Engineering'
  'Group Members: William F., Noppawee A., Hugh O., Lisa C., David L., Wing L.'
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
