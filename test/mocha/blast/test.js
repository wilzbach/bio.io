/*
 * biojs-io-blast
 * https://github.com/greenify/biojs-io-blast
 *
 * Copyright (c) 2014 greenify
 * Licensed under the Apache 2 license.
 */

// chai is an assertion library
var chai = require('chai');

// @see http://chaijs.com/api/assert/
var assert = chai.assert;
var equal = assert.equal;

// requires your main app (specified in index.js)
var blast = require("../").blast;

describe('NCBI format', function(){
  var result,hits;
  before(function(){
    var str = require("fs").readFileSync(__dirname + "/dummy/single.xml");
    result = blast.parse(str);
    hits = result.iterations[0].hits;
  })
  it('basic equality', function(){
    equal(result.program, "blastp");
    equal(result.param.matrix, "BLOSUM62");
  });

  it('nr. of iterations', function(){
    equal(result.iterations.length, 1);
    equal(result.iterations[0]["query-len"], 8797);
    equal(result.iterations[0].stat["db-num"], 459767);
    equal(hits.length, 162);
  });

  it('last hit', function(){
    equal(hits[161].len, 10421);
    equal(hits[161].hsps[0]["hit-from"], 7035);
    equal(hits[161].hsps[0]["align-len"], 286);
    equal(hits[161].hsps[0]["gaps"], 40);
  });

  it('check a specific hit', function(){
    equal(hits[26].accession, 139969);
    equal(hits[26].hsps.length, 17);
    equal(hits[26].hsps[0]["bit-score"], 193.356);
    equal(hits[26].hsps[0]["evalue"], 6.42773e-47);
    equal(hits[26].hsps[0]["hit-to"], 258);
    equal(hits[26].hsps[0]["qseq"], "EQEIVQKRTFTKWINSHLAKRKPPMVVDDLFEDMKDGVKLLALLEVLSGQKLPCEQGRRMKRIHAVANIGTALKFLEGRKIKLVNINSTDIADGRPSIVLGLMWTIILYFQIEELTSNLPQLQSLSSSASSVDSIVSSETPSPPSKRKVTTKIQGNAKKALLKWVQYTAGKQTGIEVKDFGKSWRSGVAFHSVIHAIRPELVDLETVKG-RSNRENLEDAFTIAETELGIPRLLDPEDVDVDKPDEKSIMTYVAQFLKHYPDIHNASTDGQEDDEILPGFP");
  });
  it('should return numeric values', function(){
    equal(hits[26].accession, 139969);
    equal(hits[26].hsps[0]["bit-score"], 193.356);
    equal(typeof result["query-len"], "number", "query-len should be an int");
    equal(typeof result.param["expect"], "number", "query params should be an int");
  });

});

describe('EBI format', function(){
  var result,hits;
  before(function(){
    var str = require("fs").readFileSync(__dirname + "/dummy/ebi.xml");
    result = blast.parse(str);
    hits = result.iterations[0].hits;
  })
  it('basic equality', function(){
    equal(result.program, "blastp");
    equal(result.param.matrix, "BLOSUM62");
  });

  it('nr. of iterations', function(){
    equal(result.iterations.length, 1);
    equal(result.iterations[0]["query-len"], 3418);
    equal(result.iterations[0].stat["db-num"], 87121513);
    equal(hits.length, 50);
  });

  it('last hit', function(){
    equal(hits[49].len, 1644);
    equal(hits[49].hsps[0]["hit-from"], 1);
    equal(hits[49].hsps[0]["align-len"], 1646);
    equal(hits[49].hsps[0]["gaps"], 0);
  });

  it('check a specific hit', function(){
    equal(hits[26].accession, "W5PNG4");
    equal(hits[26].hsps.length, 1);
    equal(hits[26].hsps[0]["bit-score"], 4399.0);
    equal(hits[26].hsps[0]["evalue"], 0.0);
    equal(hits[26].hsps[0]["hit-to"], 3369);
    equal(hits[26].hsps[0]["qseq"].substring(0,20), "MPIGSKERPTFFEIFKTRCN");
  });
});
