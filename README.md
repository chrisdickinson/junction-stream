# junction-stream

pipe to many destinations, depending on the results of a function.

basically, represent an `if` statement in terms of a stream.

```javascript

var junction = require('junction-stream')
  , through = require('through')

var source = through()
  , child_1 = through()
  , child_2 = through()

source.pipe(junction(write))
      .pipe(
          child_1.pipe(bloop)
        , child_2.pipe(blorp)
      )
      .pipe(fs.createWriteStream('file'))

function write(data, left, right) {
  this.resolve((data > 5) ? left : right)
}

```

## api

#### junction(writefunction[, outoforder=false]) -> junction stream

create a junction stream. `writefunction` takes at least 1 arg, as well
as the list of child streams. it is called against a subinstance of the 
junction stream, with a special method, `.resolve(stream)`.

`.resolve(stream)` makes the stream write the incoming data to the stream
given as an argument to resolve.

if `outoforder === false` (the default), if the child stream the data is
written to needs to pause, the parent stream will pause as well.

otherwise, the parent stream will ignore all pause requests from the child
streams, though they'll still buffer data until they resume.

if you have to asynchronously decide how to resolve, you should call 
`this.pause()` inside the `writefunction`.

```javascript

junction(writefunction)
    .pipe(
        gary = through()
      , michael = through()
      , busey = through()
    )

function writefunction(data, gary_stream, michael_stream, busey_stream) {
  return this.resolve(left)
}

```

#### junctionStream.pipe(child1[, ... childN][, options]) -> output

pipe to `N` children, which will be given as arguments to `writefunction`
(following `data`).

#### output.pipe(destination[, options]) -> destination

works like a normal stream `.pipe` operation. no matter which child stream
emits the data, it'll get emitted to the next step in the chain.


## license

MIT
