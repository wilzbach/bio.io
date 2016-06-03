const xhr = require('request');
const vow = require('vow');

const GenericReader = {};

export default GenericReader;

// returns a promise if callback is undefined
GenericReader.read = function(url, callback) {
  const onret = (function(_this) {
    return function(err, response, text) {
      return GenericReader._onRetrieval(err, text, callback, _this);
    };
  })(this);

  if(typeof callback === "undefined"){
    const prom = vow.defer();
    callback = function(err, res){
      if(err){
        prom.reject(err);
      }else{
        prom.resolve(res);
      }
    };
    xhr(url, onret);
    return prom.promise();
  }else{
    return xhr(url, onret);
  }
};

GenericReader._onRetrieval = function(err, text, callback, _this) {
  let rText;
  if(typeof err !== "undefined"){
    rText = _this.parse(text);
  }
  return callback.call(_this, err, rText);
};

// provide a convenient shortcut to inherit
GenericReader.extend = function(obj, statics){
  return extend(GenericReader, obj, statics);
};
// Mixin utility
GenericReader.mixin = function(proto) {
  const exports = ['read'];
  if(typeof proto !== "object"){
    proto = proto.prototype;
  }
  exports.forEach(function(name) {
    proto[name] = GenericReader[name];
  }, this);
  return proto;
};
