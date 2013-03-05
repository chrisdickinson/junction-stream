var test = require('tape')
  , through = require('through')
  , concat = require('concat-stream')
  , junction = require('./index')

test('test of junction-stream', function(assert) {
  var interval = setInterval(function() {
        var data = Math.random()
        input.write(data)
        expected += data > 0.45 ? 'a' : 'b'
      }, 10)
    , input = through()
    , transform_a
    , transform_b
    , expected = ''

  setTimeout(function() {
    clearInterval(interval)
    input.end()
  }, 100)

  transform_a = through(function(x) { this.queue('a') })
  transform_b = through(function(x) { this.queue('b') }) 

  input
    .pipe(junction(write))
    .pipe(
      transform_a
    , transform_b
    )  
    .pipe(concat(done))

  function write(data, left, right) {
    return this.resolve(data > 0.45 ? left : right)
  }

  function done(err, data) {
    assert.ok(!err, 'no error')
    assert.equal(data, expected, 'should be the expected value')
    assert.end()
  }
})

test('test of junction-stream with pausing', function(assert) {
  var interval = setInterval(function() {
        var data = Math.random()
        input.write(data)
        expected += data > 0.45 ? 'a' : 'b'
      }, 10)
    , input = through()
    , transform_a
    , transform_b
    , expected = ''

  setTimeout(function() {
    clearInterval(interval)
    input.end()
    transform_b.resume()
  }, 100)

  transform_a = through(function(x) { this.queue('a') })
  transform_b = through(function(x) {
    this.queue('b')
  }) 
  transform_b.pause()

  input
    .pipe(junction(write))
    .pipe(
      transform_a
    , transform_b
    )  
    .pipe(concat(done))


  function write(data, left, right) {
    return this.resolve(data > 0.45 ? left : right)
  }

  function done(err, data) {
    assert.ok(!err, 'no error')
    assert.equal(data, expected, 'should be the expected value')
    assert.end()
  }
})

test('test of junction-stream with pausing (outoforder=true)', function(assert) {
  var interval = setInterval(function() {
        var data = Math.random()
        input.write(data)
        expected += data > 0.45 ? 'a' : 'b'
      }, 10)
    , input = through()
    , transform_a
    , transform_b
    , expected = ''

  setTimeout(function() {
    clearInterval(interval)
    input.end()
    transform_b.resume()
  }, 100)

  transform_a = through(function(x) { this.queue('a') })
  transform_b = through(function(x) {
    this.queue('b')
  }) 
  transform_b.pause()

  input
    .pipe(junction(write, true))
    .pipe(
      transform_a
    , transform_b
    )  
    .pipe(concat(done))


  function write(data, left, right) {
    return this.resolve(data > 0.45 ? left : right)
  }

  function done(err, data) {
    assert.ok(!err, 'no error')
    assert.equal(data, expected.split('').sort().join(''), 'should be the expected value')
    assert.end()
  }
})
