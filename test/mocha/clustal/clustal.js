var fs = require('fs');

var Clustal = require('../').clustal;

var assert = require("assert");
var request = require("request");
var nock = require('nock');

var testFile = "/p53";
var testUrl = 'http://an.msa.url' + testFile;

var scope = nock('http://an.msa.url')
.get(testFile)
.replyWithFile(200, __dirname + '/p53.clustalo.clustal');

describe("Clustal", function(){

it('test parsing of sample clustal file', function(done){
  request(testUrl, function(err,resp,body){
    var seqs = Clustal.parse(body);
    assert.equal(seqs.length, 34, "invalid seq length" + seqs.length);
    done();
  });
});

it("test with fs", function(done) {
  fs.readFile(__dirname + '/p53.clustalo.clustal','utf8', function(err,data){
    if (err) {
      return console.log(err);
    }
    var seqs = Clustal.parse(data);
    assert.equal(seqs.length, 34, "invalid seq length" + seqs.length);
    done();
  });

});
});
