module.exports = junction

var through = require('through')
  , emit = require('emit-function')

var slice = [].slice.call.bind([].slice)

function junction(write, outoforder) {
  var input = through(onwrite, onend)
    , output = through()
    , base_pipe = input.pipe
    , children = [null]

  outoforder = !!outoforder

  input.pipe = input_pipe

  return input 

  function onwrite(data) {
    var self = Object.create(this)

    children[0] = data
    self.resolve = onresolution

    write.apply(self, children)
    children[0] = null

    function onresolution(direction) {
      direction.write(data)
      if(direction.paused && !outoforder) {
        input.pause()
      }
    }
  }

  function onend(data) {
    for(var i = 1, len = children.length; i < len; ++i) {
      if(children[i].paused) {
        children[i].once('drain', onend)
        return
      }
    }
    output.queue(null)
  }

  function input_pipe() {
    var args = slice(arguments)
      , options
      , temp

    if(args.length && !args[args.length - 1].readable) {
      options = args[args.length - 1]
      --args.length
    } else {
      options = {} 
    }

    for(var i = 0, len = args.length; i < len; ++i) {
      temp = args[i]
      args[i] = through()
      args[i].original = temp
      args[i].pipe(temp).pipe(output)
      temp.on('error', emit(input, 'error'))
      args[i].on('drain', function() {
        input.resume()
      })

    }
    children = children.concat(args)
    return output 
  }
}
