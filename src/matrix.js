import parser from './parser';

/** Example of a simple 2d matrix parser
 * Can be used for e.g. BLOSUM
 * */

var MatrixReader = function(text) {
  if (this.constructor != MatrixReader) return new MatrixReader(text);
  this.matrix = {};
  this.parsingOrder = [];
  if (text != undefined) {
    this.parse(text);
  }
  return this;
};

parser.mixin(MatrixReader);

module.exports = MatrixReader;

MatrixReader.prototype.parse = function(text) {
  text.split("\n").forEach(function(el) {
    this.parseLine(el);
  }.bind(this));
  this.buildMatrix();
  return this.matrix;
};

MatrixReader.read = function(url, cb) {
  return (new MatrixReader()).read(url, cb);
};

MatrixReader.parse = function(text) {
  return (new MatrixReader()).parse(text);
};

MatrixReader.prototype.parseLine = function(line) {
  var c = line.charAt(0);
  if (c === '#') {
    return;
  } else {
    this.parsingOrder.push(c);
    var intStr = line.substring(1);
    var ints = intStr.split(/\s+/)
      .filter(function(e) {
        return e.length > 0;
      })
      .map(function(e) {
        return parseInt(e);
      });

    var m = {};
    for (var i = 0; i < ints.length; i++) {
      m[this.parsingOrder[i]] = ints[i];
    }
    this.matrix[c] = m;
  }
};

MatrixReader.prototype.export = function() {
  return MatrixReader.export(this.matrix);
};

MatrixReader.export = function(matrix) {
  var lines = [];
  var max = 1;
  // use the matrix attribute if an object is given
  if("matrix" in matrix){
      matrix = matrix.matrix;
  }
  for (var key in matrix) {
    var line = key;
    var keys = Object.keys(matrix[key]);
    for (var i = 0; i < max; i++) {
      line += "\t" + matrix[key][keys[i]];
    }
    lines.push(line);
    max++;
  }
  return lines.join("\n");
};

/**
 * faster access time
 */
MatrixReader.prototype.buildMatrix = function() {
  for (var i = this.parsingOrder.length - 1; i >= 0; i--) {
    var curC = this.parsingOrder[i];
    var map = this.matrix[curC];
    for (var key in map) {
      this.matrix[key][curC] = map[key];
    }
  }
};
