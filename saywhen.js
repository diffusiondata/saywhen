var handlers = [];

function MatcherSet(matchers) {
    matchers = matchers || [];
    var responses = [];

    this.matches = function(args) {
        if (matchers.length !== args.length) return false;

        for (var i = 0; i < args.length; ++i) {
            var matcher = matchers[i], result = false;
            
            if (matcher instanceof Function) {
                result = matcher(args[i]);
            } else if (matcher.jasmineMatches !== undefined) {
                result = matcher.jasmineMatches(args[i]);
            } else  {
                result = matchers[i] === args[i];
            }

            if (!result) return false;
        }

        return true;
    };

    this.apply = function(args) {
        var res = responses.length > 1 ? responses.shift() : responses[0];

        if (res) {
            return res.apply(res, args);
        }
    };

    this.addResponse = function(fn) {
        responses.push(fn);
    };
}

function proxy(matcher) {
    return {
        then : function(fn) {
            matcher.addResponse(fn);
            return this;
        },
        thenReturn : function(val) {
            matcher.addResponse(function() {
                return val;
            });

            return this;
        },
        thenThrow : function(err) {
            matcher.addResponse(function() {
                throw err;
            });

            return this;
        }
    };
}

function CallHandler(spy) {
    var matchers = [];
    var defaultSet = new MatcherSet();

    spy.and.callFake(function() {
        var args = Array.prototype.slice.call(arguments, 0);

        for (var i = 0; i < matchers.length; ++i) {
            var set = matchers[i];
            
            if (set.matches(args)) {
                return set.apply(args);
            }
        }

        return defaultSet.apply(args);
    });

    this.isCalledWith = function() {
        var args = Array.prototype.slice.call(arguments, 0);

        var matcher = new MatcherSet(args);
        matchers.push(matcher);

        return proxy(matcher);
    };

    this.isCalled = proxy(defaultSet);
}

function when(spy) {
    for (var i = 0; i < handlers.length; ++i) {
        if (handlers[i].spy === spy) {
            return handlers[i].handler;
        }
    }
    
    var handler = new CallHandler(spy);
    
    handlers.push({
        'spy' : spy,
        'handler' : handler
    });

    return handler;
}

when.is = function(val) {
    return function(arg) {
        return val == arg;
    };
};

module.exports = when;