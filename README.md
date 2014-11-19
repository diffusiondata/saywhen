saywhen
=======

Provides conditional fake calls for Jasmine 2 spies.

Motivated by the fact that using spies in Jasmine requires a lot of boilerplate to perform different actions depending on provided arguments.

Heavily influenced by the [Mockito](https://github.com/mockito/mockito) library for Java.

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
when(spy).isCalledWith('something').thenReturn('a value');
when(spy).isCalledWith('something else').thenReturn('a value');
when(spy).isCalledWith(jasmine.any(Object)).thenThrow(new Error('some error'));
```

---

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

**Make a spy call a particular function, when called with a specific argument**

```javascript
when(spy).isCalledWith('bar').then(function(arg) {
    // Do something
});
```

**Make a spy throw an error**

```javascript
when(spy).isCalledWith('baz').thenThrow(new Error());
```

**Multiple callbacks can be added and will be executed in order**

```javascript
when(spy).isCalledWith().thenReturn(1)
                        .thenReturn(2)
                        .thenReturn(3)
                        .thenThrow(new Error('eof'));
                        
spy(); // => 1
spy(); // => 2
spy(); // => 3
spy(); // Throws error
```

---

###License

Licensed under the Apache 2.0 license. See LICENSE.txt.