/*
 * msa-seqtools
 * https://github.com/greenify/msa-seqtools
 *
 * Copyright (c) 2014 greenify
 * Licensed under the MIT license.
 */

// chai is an assertion library
var chai = require('chai');

// @see http://chaijs.com/api/assert/
var assert = chai.assert;
var equal = assert.deepEqual;

// requires your main app (specified in index.js)
var st = require('../').seqs;

describe('msa-seqtools module', function() {
  describe('#getMeta()', function() {
    it('should split correctly', function() {
      equal(st.getMeta("sp|abc|def"), {
        name: "def",
        ids: {
          sp: "abc"
        },
        details: {
          en: "def"
        }
      });
    });
    it('should should recognize key=value', function() {
      equal(st.getMeta("sp|abc|def a long description OS=organism GN=genename"), {
        name: "def",
        ids: {
          sp: "abc"
        },
        details: {
          os: "organism",
          gn: "genename",
          en: "def"
        },
        desc: "a long description"
      });
    });
    it('should deal with spaces in key=value', function() {
      equal(st.getMeta("sp|abc|def Carotenoid cleavage dioxygenase 8, chloroplastic OS=Arabidopsis thaliana GN=CCD8 PE=1 SV=1 "), {
        name: "def",
        desc: "Carotenoid cleavage dioxygenase 8, chloroplastic",
        ids: {
          sp: "abc"
        },
        details: {
          os: "Arabidopsis thaliana",
          gn: "CCD8",
          pe: "1",
          sv: "1",
          en: "def"
        }
      });
    });
    it('correctly parse descriptions without key=value', function() {
      equal(st.getMeta("sp|abc|def a long description with no key values"), {
        name: "def",
        ids: {
          sp: "abc"
        },
        details: {
          en: "def"
        },
        desc: "a long description with no key values"
      });
    });
	
  });
  describe('#buildLinks()', function() {
    it('should show correct links', function() {
      equal(st.buildLinks(st.getMeta("sp|abc|def").ids), {
        "Uniprot": "http://www.uniprot.org/abc"
      });
    });
  });
  describe('#contains()', function() {
    it('should find text', function() {
      assert.ok(st.contains("abc", "a"));
    });
    it('should not find non-existing text', function() {
      assert.notOk(st.contains("abc", "e"));
    });
  });
  describe('#splitNChars()', function() {
    it('should split correctly', function() {
      equal(st.splitNChars("abc", 2), ["ab", "c"]);
    });
  });
  describe('#complement()', function() {
    it('should complement sequence correctly', function() {
      equal(st.complement('actgACTG'), 'tgacTGAC')
    })
  });
  describe('#reverse()', function() {
    it('should reverse a sequence', function() {
      equal(st.reverse('actgACTG'), 'GTCAgtca')
    })
  });
  describe('#reverseComplement()', function() {
    it('should reverse a sequence', function() {
      equal(st.reverseComplement('actgACTG'), 'CAGTcagt')
    })
  });
});
