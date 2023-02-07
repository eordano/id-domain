;(function($, doc) {

  const callbacksById = new Map()
  let source = null
  const untilSourceIsReady = new Promise((resolve) => {
    $.addEventListener('message', function(event) {
      if (event.origin !== 'https://id.decentraland.org') {
        return
      }
      if (!source) {
        source = event.source
        resolve(source)
      } else {
        const data = JSON.parse(event.data)
        if (!data.id) {
          console.error('eps')
          return
        }
        const callback = callbacksById.get(data.id)
        if (callback) {
          callback(data)
        }
      }
    }, false)
  })

  const frame = doc.createElement("IFRAME"); 
  frame.setAttribute("src", "https://id.decentraland.org/?" + $.location.domain.split('.')[0]);
  frame.setAttribute("style", "display: none");
  doc.body.appendChild(frame);

  $.idGet = function(key) {
    const id = Math.random().toFixed(8).substring(2)
    const result = new Promise(async (resolve, reject) => {
      callbacksById.set(id, function(result) {
        if (result.status === 'ok') {
          return resolve(result.value)
        } else {
          return reject(result)
        }
      })
      if (!source) {
        await untilSourceIsReady
      }
      source.postMessage(JSON.stringify({
        type: 'get',
        id,
        key
      }), 'https://id.decentraland.org')
    })
    return result
  }
  $.idSet = function(key, value) {
    const id = Math.random().toFixed(8).substring(2)
    const result = new Promise(async (resolve, reject) => {
      callbacksById.set(id, function(result) {
        if (result.status === 'ok') {
          return resolve(result.value)
        } else {
          return reject(result)
        }
      })
      if (!source) {
        await untilSourceIsReady
      }
      source.postMessage(JSON.stringify({
        type: 'set',
        id,
        key,
        value
      }), 'https://id.decentraland.org')
    })
    return result
  }

})(window, window.document)
