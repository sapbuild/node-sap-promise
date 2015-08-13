<a name="Promise"></a>
## Promise
**Kind**: global class  

* [Promise](#Promise)
  * [new Promise(executor)](#new_Promise_new)
  * _instance_
    * [.then(onFulfilled, onRejected)](#Promise+then) ⇒ <code>[Promise](#Promise)</code>
    * [.catch(onRejected)](#Promise+catch) ⇒ <code>[Promise](#Promise)</code>
    * [.always(onSettled)](#Promise+always) ⇒ <code>[Promise](#Promise)</code>
    * [.thenInvoke([thisArg], fn, [...arg])](#Promise+thenInvoke) ⇒ <code>[Promise](#Promise)</code>
    * [.thenCall([thisArg], fn, [...arg])](#Promise+thenCall) ⇒ <code>[Promise](#Promise)</code>
    * [.timeout(delay, [resolution])](#Promise+timeout) ⇒ <code>[Promise](#Promise)</code>
    * [.finally(finalizer)](#Promise+finally) ⇒ <code>[Promise](#Promise)</code>
    * [.callback([done])](#Promise+callback) ⇒ <code>[Promise](#Promise)</code>
    * [.delay(delay)](#Promise+delay) ⇒ <code>[Promise](#Promise)</code>
  * _static_
    * [.resolve(value)](#Promise.resolve) ⇒ <code>[Promise](#Promise)</code>
    * [.reject(reason)](#Promise.reject) ⇒ <code>[Promise](#Promise)</code>
    * [.all(promises)](#Promise.all) ⇒ <code>[Promise](#Promise)</code>
    * [.race(promises)](#Promise.race) ⇒ <code>[Promise](#Promise)</code>
    * ~~[.cast()](#Promise.cast)~~
    * [.waitAll(promises)](#Promise.waitAll) ⇒ <code>[Promise](#Promise)</code>
    * [.defer()](#Promise.defer) ⇒ <code>Object</code>
    * [.invoke([thisArg], fn, [...arg])](#Promise.invoke) ⇒ <code>[Promise](#Promise)</code>
    * [.objectInvoke(thisArg, fn, [...arg])](#Promise.objectInvoke) ⇒ <code>[Promise](#Promise)</code>
    * [.fnCall([thisArg], fn, [...arg])](#Promise.fnCall) ⇒ <code>[Promise](#Promise)</code>
    * [.delay([resolution], delay)](#Promise.delay) ⇒ <code>[Promise](#Promise)</code>

<a name="new_Promise_new"></a>
### new Promise(executor)
Creates a new Promise


| Param | Type | Description |
| --- | --- | --- |
| executor | <code>function</code> | Function object with two arguments resolve and reject. The resolve function that is passed to an executor function accepts a single argument. The executor code may eventually call the resolve function to indicate that it wishes to resolve the associated Promise object. The argument passed to the resolve function represents the eventual value of the deferred action and can be either the actual fulfillment value or another Promise or thenable object which will provide the value if it is fulfilled.  The reject function that is passed to an executor function accepts a single argument. The executor code may eventually call the reject function to indicate that the associated Promise is rejected and will never be fulfilled. The argument passed to the reject function is used as the rejection value of the promise. Typically it will be an Error object. |

<a name="Promise+then"></a>
### promise.then(onFulfilled, onRejected) ⇒ <code>[Promise](#Promise)</code>
The Promise.prototype.then method returns a Promise. It takes two arguments, both are callback functions for the success and failure cases of the Promise.
If the invoked callback function returns a value, the then Promise will be fulfilled. If it throws an exception, the then Promise will be rejected.

**Kind**: instance method of <code>[Promise](#Promise)</code>  

| Param | Type | Description |
| --- | --- | --- |
| onFulfilled | <code>function</code> | Function called when the Promise is fulfilled. This function has one argument, the fulfillment value. |
| onRejected | <code>function</code> | Function called when the Promise is rejected. This function has one argument, the rejection reason. |

<a name="Promise+catch"></a>
### promise.catch(onRejected) ⇒ <code>[Promise](#Promise)</code>
The Promise.prototype.catch method returns a Promise and deals with rejected cases only. It behaves the same as calling Promise.prototype.then(undefined, onRejected).

**Kind**: instance method of <code>[Promise](#Promise)</code>  

| Param | Type | Description |
| --- | --- | --- |
| onRejected | <code>function</code> | Function called when the Promise is rejected. This function has one argument, the rejection reason. |

<a name="Promise+always"></a>
### promise.always(onSettled) ⇒ <code>[Promise](#Promise)</code>
Returns a promise which will be settled based on the outcome of the onSettled callback. onSettled will be called when the initial promise is settled (i.e. either fulfilled or rejected).

**Kind**: instance method of <code>[Promise](#Promise)</code>  

| Param | Description |
| --- | --- |
| onSettled | Function called when the promise is settled. If the promise is rejected, onSettled is called with the rejection reason as single argument. If the promise is fulfilled, onSettled is called with null as first arguments and the promise fulfillment value as second argument. |

<a name="Promise+thenInvoke"></a>
### promise.thenInvoke([thisArg], fn, [...arg]) ⇒ <code>[Promise](#Promise)</code>
Performs a callback-based API call upon promise completion

**Kind**: instance method of <code>[Promise](#Promise)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [thisArg] | <code>object</code> | Optional this parameter |
| fn | <code>function</code> &#124; <code>string</code> | Function or method name to call |
| [...arg] | <code>\*</code> | Optional parameters to be passed AFTER promise result which is always the first parameter (final callback parameter must NOT be passed) |

<a name="Promise+thenCall"></a>
### promise.thenCall([thisArg], fn, [...arg]) ⇒ <code>[Promise](#Promise)</code>
Performs a regular function call upon promise completion

**Kind**: instance method of <code>[Promise](#Promise)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [thisArg] | <code>object</code> | Optional this parameter |
| fn | <code>function</code> &#124; <code>string</code> | Function or method name to call |
| [...arg] | <code>\*</code> | Optional parameters to be passed AFTER promise result which is always the first parameter |

<a name="Promise+timeout"></a>
### promise.timeout(delay, [resolution]) ⇒ <code>[Promise](#Promise)</code>
Returns a promise which will be resolved to an alternative resolution if the initial promise has not been settled at timeout expiration.
If the initial promise is settled before timeout, the setTimeout promise will be settled accordingly.

**Kind**: instance method of <code>[Promise](#Promise)</code>  

| Param | Type | Description |
| --- | --- | --- |
| delay |  | timeout in ms |
| [resolution] | <code>any</code> | This controls how the promise will be settled after timeout. If resolution is an instance of Error, the promise will be rejected with resolution. If resolution is a function, the promise will be resolved with the return value of the function call. If the function throws an exception, the promise will be rejected accordingly. Otherwise, the promise will be resolved with resolution (applying the standard PromiseResolve logic). If no resolution argument is passed, the promise will be rejected with a default Error. |

<a name="Promise+finally"></a>
### promise.finally(finalizer) ⇒ <code>[Promise](#Promise)</code>
Returns a promise which will be settled according to the initial promise when the return value of the finalizer is settled.

**Kind**: instance method of <code>[Promise](#Promise)</code>  

| Param | Type | Description |
| --- | --- | --- |
| finalizer | <code>function</code> | Callback function which will be called when the initial promise is settled. If finalizer returns a promise, the finally promise will be settled once the finalizer promise is settled (but with the outcome of the initial promise). |

<a name="Promise+callback"></a>
### promise.callback([done]) ⇒ <code>[Promise](#Promise)</code>
Returns a promise that will be settled with the initial promise outcome, after invoking an optional callback.

**Kind**: instance method of <code>[Promise](#Promise)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [done] | <code>function</code> | Optional callback |

<a name="Promise+delay"></a>
### promise.delay(delay) ⇒ <code>[Promise](#Promise)</code>
Returns a promise which will be settled as the initial promise after some delay

**Kind**: instance method of <code>[Promise](#Promise)</code>  

| Param | Type | Description |
| --- | --- | --- |
| delay | <code>number</code> | Delay in milliseconds before settling the returned promise |

<a name="Promise.resolve"></a>
### Promise.resolve(value) ⇒ <code>[Promise](#Promise)</code>
The Promise.resolve function returns a Promise object that is resolved with the given value. If the value is a Promise, Promise.resolve returns the value itself. If the value is a thenable object (i.e. has a then method), the returned promise will "follow" that thenable, adopting its eventual state. Otherwise the returned promise will be fulfilled with the value.

**Kind**: static method of <code>[Promise](#Promise)</code>  

| Param | Type |
| --- | --- |
| value | <code>\*</code> | 

<a name="Promise.reject"></a>
### Promise.reject(reason) ⇒ <code>[Promise](#Promise)</code>
The Promise.reject function returns a Promise object which is rejected with the given reason. While not mandatory, it is recommended to restrict reason to be an instance of Error.

**Kind**: static method of <code>[Promise](#Promise)</code>  

| Param | Type |
| --- | --- |
| reason | <code>\*</code> | 

<a name="Promise.all"></a>
### Promise.all(promises) ⇒ <code>[Promise](#Promise)</code>
The Promise.all function returns a new promise which is fulfilled with an array of fulfillment values for the passed values, or rejects with the reason of the first passed promise that rejects. It resolves all elements to promises as it runs this algorithm.

**Kind**: static method of <code>[Promise](#Promise)</code>  

| Param | Type | Description |
| --- | --- | --- |
| promises | <code>Array</code> | Array of promises or values. Currently, only Array is supported whereas it should be iterable according to EcmaScript 2015 |

<a name="Promise.race"></a>
### Promise.race(promises) ⇒ <code>[Promise](#Promise)</code>
The Promise.race function returns a new promise which is settled in the same way as the first passed promise to settle. It resolves all elements to promises as it runs this algorithm.

**Kind**: static method of <code>[Promise](#Promise)</code>  

| Param | Type | Description |
| --- | --- | --- |
| promises | <code>Array</code> | Array of promises or values. Currently, only Array is supported whereas it should be iterable according to EcmaScript 2015 |

<a name="Promise.cast"></a>
### ~~Promise.cast()~~
***Deprecated***

**Kind**: static method of <code>[Promise](#Promise)</code>  
<a name="Promise.waitAll"></a>
### Promise.waitAll(promises) ⇒ <code>[Promise](#Promise)</code>
**Kind**: static method of <code>[Promise](#Promise)</code>  

| Param |
| --- |
| promises | 

<a name="Promise.defer"></a>
### Promise.defer() ⇒ <code>Object</code>
**Kind**: static method of <code>[Promise](#Promise)</code>  
<a name="Promise.invoke"></a>
### Promise.invoke([thisArg], fn, [...arg]) ⇒ <code>[Promise](#Promise)</code>
Transforms a callback-based API call into a Promise-based one

**Kind**: static method of <code>[Promise](#Promise)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [thisArg] | <code>object</code> | Optional this parameter |
| fn | <code>function</code> &#124; <code>string</code> | Function or method name to call |
| [...arg] | <code>\*</code> | Optional function parameters: final callback parameter must NOT be passed |

<a name="Promise.objectInvoke"></a>
### Promise.objectInvoke(thisArg, fn, [...arg]) ⇒ <code>[Promise](#Promise)</code>
Transforms a callback-based API call into a Promise-based one

**Kind**: static method of <code>[Promise](#Promise)</code>  

| Param | Type | Description |
| --- | --- | --- |
| thisArg | <code>object</code> | this parameter |
| fn | <code>function</code> &#124; <code>string</code> | Function or method name to call |
| [...arg] | <code>\*</code> | Optional function parameters: final callback parameter must NOT be passed |

<a name="Promise.fnCall"></a>
### Promise.fnCall([thisArg], fn, [...arg]) ⇒ <code>[Promise](#Promise)</code>
Wraps the result of a synchronous function into a Promise.

**Kind**: static method of <code>[Promise](#Promise)</code>  
**Returns**: <code>[Promise](#Promise)</code> - Promise resolved to the function return value or rejected with the error thrown by the function  

| Param | Type | Description |
| --- | --- | --- |
| [thisArg] | <code>object</code> | Optional this parameter |
| fn | <code>function</code> &#124; <code>string</code> | Function or method name to call |
| [...arg] | <code>\*</code> | Optional function parameters |

<a name="Promise.delay"></a>
### Promise.delay([resolution], delay) ⇒ <code>[Promise](#Promise)</code>
Returns a Promise which will be resolved with resolution after delay milliseconds

**Kind**: static method of <code>[Promise](#Promise)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [resolution] | <code>\*</code> | Resolved value, default to undefined |
| delay | <code>number</code> | Delay in milliseconds before promise is fulfilled |

