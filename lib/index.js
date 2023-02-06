;(function($, doc) {
  const frame = doc.createElement("IFRAME"); 
  frame.setAttribute("src", "https://id.decentraland.org/");
  doc.body.appendChild(frame);

  const callbacksById = new Map()
  doc.addEventListener('result', function(event) {
    if (event.origin !== 'https://id.decentraland.org') {
      return
    }
    const callback = callbacksById[event.id]
    if (callback) {
      callback(event.value)
    }
  }, false)

  $.idGet = function(key) {
    const id = Math.random().toFixed(8).substring(2)
    const result = new Promise((resolve, reject) => {
      callbacksById.set(id, function(result) {
        if (result.status === 'ok') {
          return resolve(result.value)
        } else {
          return reject(result)
        }
      })
      frame.contentDocument.dispatchEvent({
        type: 'get',
        id,
        key
      })
    })
    return result
  }
  $.idSet = function(key, value) {
    const id = Math.random().toFixed(8).substring(2)
    const result = new Promise((resolve, reject) => {
      callbacksById.set(id, function(result) {
        if (result.status === 'ok') {
          return resolve(result.value)
        } else {
          return reject(result)
        }
      })
      frame.contentDocument.dispatchEvent({
        type: 'set',
        id,
        key,
        value
      })
    })
    return result
  }

})(window, window.document)
