var handlers = [];


function defaultMatcher() {
    return true;
}

function createMatcher(val) {
    if (val instanceof Function) {
        return val;
    } else if (val && val.jasmineMatches !== undefined) {
        return val.jasmineMatches.bind(val);
    } else {
        return function(arg) { return val === arg };
    }
}

function MatcherSet(matchers) {
    matchers = matchers || [];
    var responses = [];

    this.matches = function(args) {
        if (matchers.length !== args.length) return false;

        for (var i = 0; i < args.length; ++i) {
            // Quickly bail if we can't match
            if (!matchers[i](args[i])) {
                return false;
            }
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

function captor(val) {
    var matcher = arguments.length === 0 ?  defaultMatcher : createMatcher(val);

    var values = [];

    var matcherProxy = function(arg) {
        if (matcher(arg)) {
            values.push(arg);
            return true;
        }

        return false;
    };

    matcherProxy.value = function() {
        return values[values.length - 1];  
    };

    matcherProxy.values = function() {
        return values;
    };

    return matcherProxy;
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
    var matcherSets = [];
    var defaultSet = new MatcherSet();

    spy.and.callFake(function() {
        var args = Array.prototype.slice.call(arguments, 0);

        for (var i = 0; i < matcherSets.length; ++i) {
            var set = matcherSets[i];
            
            if (set.matches(args)) {
                return set.apply(args);
            }
        }

        return defaultSet.apply(args);
    });

    this.isCalledWith = function() {
        var args  = Array.prototype.slice.call(arguments, 0);
        var matchers = [];

        for (var i = 0; i < args.length; ++i) {
            matchers.push(createMatcher(args[i]));
        }

        var matcherSet = new MatcherSet(matchers);
        matcherSets.push(matcherSet);

        return proxy(matcherSet);
    };

    this.isCalled = proxy(defaultSet);
    spy.and.callFake = this.isCalled.then;
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

when.captor = captor;

module.exports = when;
