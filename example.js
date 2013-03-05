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

function write(data, left, right) {
  this.resolve((data > 5) ? left : right)
}
