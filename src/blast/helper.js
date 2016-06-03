const helper = {};
export default helper;

// add all attributes of a current node to a target dictionary
helper.addAttr = function(node, target) {
  if (target == undefined) {
    target = {};
  }
  for (var key in node.attr) {
    if(typeof(target) != "string")
    {
        target[key] = node.attr[key].replace(/'/g, "");
    }
  }
  return target;
};

helper.checkIntProps = function(obj, intKeys){
  helper.checkProps(obj, intKeys, parseInt);
};

helper.checkFloatProps = function(obj, intKeys){
  helper.checkProps(obj, intKeys, parseFloat);
};

helper.checkProps = function(obj, intKeys, fn) {
  for(var i = 0; i< intKeys.length; i++){
    var key = intKeys[i];
    if (!!obj[key]) {
      obj[key] = fn(obj[key]);
    }
  }
};

helper.renameParams = function(obj, remapKeys) {
  for(var key in remapKeys){
    var remapKey = remapKeys[key];
    if (!!obj[key]) {
      obj[remapKey] = obj[key];
      delete obj[key];
    }
  }
};

// renames a key in a dictionary
helper.renameProperty = function(obj, oldName, newName) {
  if (obj.hasOwnProperty(oldName)) {
    obj[newName] = obj[oldName];
    delete obj[oldName];
  }
  return obj;
};
