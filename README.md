saywhen
=======
[![Build Status](https://travis-ci.org/pushtechnology/saywhen.svg?branch=master)](https://travis-ci.org/pushtechnology/saywhen)
[![npm version](https://badge.fury.io/js/saywhen.svg)](http://badge.fury.io/js/saywhen)

Top up your [Jasmine](http://jasmine.github.io/) spies with better fake calls.

Motivated by the fact that using spies in Jasmine requires a lot of boilerplate to perform different actions depending on provided arguments.

Currently supports Jasmine 2 only. Heavily influenced by the [Mockito](https://github.com/mockito/mockito) library for Java.

---

*Turn this...*

```javascript
spy.and.callFake = function(arg) {
    if (arg === 'something') {
	    return 'a value';
	} else if (arg === 'something else') {
	    return 'a different value';
	} else {
	    throw new Error('some error');
	}
};
```

*... into this*

```javascript
when(spy).isCalled.thenThrow(new Error('some error'));
when(spy).isCalledWith('something').thenReturn('a value');
when(spy).isCalledWith('something else').thenReturn('a different value');
```

---

###Installation

The easiest way to install ```saywhen``` is via [npm](http://npmjs.org/). Simply run ```npm install saywhen``` in your project directory.

###Usage

**Require Say When as a normal module**

```javascript
var when = require('saywhen');
var spy = jasmine.createSpy('foo');
```

**Make a spy return a value when called with a specific argument**

```javascript
when(spy).isCalledWith('foo').thenReturn('bar');
```

**Mix default handlers and specific handlers**

```javascript
when(spy).isCalled.thenReturn(1);
when(spy).isCalledWith('two').thenReturn(2);

spy();      // => 1
spy('bar'); // => 1
spy('two'); // => 2
```

**Make a spy call a particular function, when called with a specific argument**

```javascript
when(spy).isCalledWith('bar').then(function(arg) {
    // Do something with arg
});
```

**Make a spy throw an error**

```javascript
when(spy).isCalledWith('baz').thenThrow(new Error());
```

**Works with jasmine.any & jasmine.objectContaining**

```javascript
when(spy).isCalledWith(jasmine.any(String)).thenReturn("string!");
when(spy).isCalledWith(jasmine.objectContaining({
    foo : "bar"
})).thenReturn("object!");

spy('abc');                 // => string!
spy({ foo : "bar" });       // => object!
```

**Multiple callbacks can be added and will be executed in order**

```javascript
when(spy).isCalled.thenReturn(1)
                  .thenReturn(2)
                  .thenReturn(3)
                  .thenThrow(new Error('eof'));
                        
spy(); // => 1
spy(); // => 2
spy(); // => 3
spy(); // Throws error
```

**Use captors to capture argument values**

```javascript
var captor = when.captor();

when(spy).isCalledWith(jasmine.any(String), captor);

spy("foo", 123);
spy("foo", 456);
spy(null, 789);

captor.values();    // => [123, 456]
captor.latest;     // => 456 (last value)
```

**Captors can also wrap matchers, to allow only capture specific arguments**

```javascript
var captor = when.captor(jasmine.any(Number));

when(spy).isCalledWith(captor).then(function(arg) {
    return arg * 2;
});

spy(2);     // => 4
spy(3);     // => 6
spy("foo")  // => undefined (doesn't match)

captor.values();    // => [2, 3]
captor.latest;     // => 3
```
---

###Contributing

Say When is an open source project, maintained by Push Technology. Issues and pull requests are welcomed.

Tests can be run by installing a dev dependencies with ```npm install``` and then running ```npm test```

---

###License

Licensed under the Apache 2.0 license. See LICENSE.txt.
