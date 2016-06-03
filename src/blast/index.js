var xmldoc = require("xmldoc");
import parser from "../parser";
import helper from "./helper";

const blast = {};
export default blast;

parser.mixin(blast);

blast.parse = function(str) {
  var doc = new xmldoc.XmlDocument(str);
  var res = {};
  var customFormat = "";

  // assign general attributes
  var rootName = doc.name + "_";
  doc.eachChild(function(child, index) {
    var name = child.name.replace(rootName, "");
    switch (name) {
      case "iterations":
        res.iterations = parseArray(child, parseIteration);
        break;
      case "SequenceSimilaritySearchResult":
        // the uniprot format excludes the BlasOutput_iteration
        res.iterations = [];
        res.iterations[0] = parseIteration(child);
        break;
      case "param":
        // somehow the 2.29 format has a doubly nested parameter format
        res[name] = child2Json(child.children[0]);
        helper.addAttr(child, res[name]);
        break;
      case "Header":
        // EBI parameters
        customFormat = "EBI";

        var header = child2Json(child);
        // TODO: convert them into NCBI
        var parametersChild = child.childNamed("parameters");
        if (parametersChild != undefined) {
          header.param = child2Json(parametersChild);
          var databases = parametersChild.childNamed("databases");
          header.param.databases = parseArray(databases, helper.addAttr);

          var db = {};
          db.sequences = parseInt(databases.attr.sequences);
          db.letters = parseInt(databases.attr.letters);
          // TODO: does it make sense to overwrite databases?
          header.param.databases = db;

          var sequences = parametersChild.childNamed("sequences");
          header.param.sequences = parseArray(sequences, helper.addAttr);
        }
        // convert the header
        header.version = header.program.version;
        header.program = header.program.name.toLowerCase();
        res["query-len"] = header.param.sequences[0].length;

        var remapParams = {
          "gapOpen": "gap-open",
          "gapExtend": "gap-extend"
        };
        helper.renameParams(header.param, remapParams);

        // TODO: more conversion might be needed

        // copy props into main node
        for (var key in header) {
          res[key] = header[key];
        }
        break;
      default:
        res[name] = child.val;
    }
  });

  // do some post processing
  res["query-len"] = parseInt(res["query-len"]);
  var paramsIntKeys = ["expect", "gap-open", "gap-extend", "scores", "alignments"];
  if (!!res.param) {
    helper.checkIntProps(res.param, paramsIntKeys);
  }

  switch (customFormat) {
    case "EBI":
      res.iterations[0].stat = {};
      res.iterations[0].stat["db-num"] = res.param.databases.sequences;
      res.iterations[0]["query-len"] = res.param.sequences[0].length;
      break;
  }

  return res;
};

// ---------------------
// helper functions for parsing the XML
// ---------------------

// only returns leaf nodes
function child2Json(node) {
  if (node.children.length === 0) {
    return node.val;
  }
  var obj = {};
  var parentName = node.name + "_";
  node.eachChild(function(child, index) {
    var name = child.name.replace(parentName, "");
    // only add childs without leafs (=leafs)
    if (child.children.length === 0) {
      obj[name] = child.val;
      if (Object.keys(child.attr).length > 0) {
        // empty leaf nodes
        if (obj[name].trim().length === 0) {
          obj[name] = {};
        }
        helper.addAttr(child, obj[name]);
      }
    }
  });
  return obj;
}

// converts a xml node into an array
function parseArray(node, fn) {
  var iters = [];
  if (node == undefined) {
    console.log("not found" + node);
    return;
  }
  var parentName = node.name + "_";
  node.eachChild(function(child, index) {
    child.name = child.name.replace(parentName, "");
    iters.push(fn(child));
  });
  return iters;
}

// a BLAST iteration
function parseIteration(node) {
  var iter = {};
  var parentName = node.name + "_";
  node.eachChild(function(child, index) {
    var name = child.name.replace(parentName, "");
    switch (name) {
      case "hits":
        iter[name] = parseArray(child, parseHit);
        break;
      case "stat":
        // somehow the 2.29 format has a double nested parameter format
        iter[name] = child2Json(child.children[0]);
        break;
      default:
        iter[name] = child2Json(child);
    }
  });
  return iter;
}

var hitIntKeys = ["num", "length"];

// a BLAST hit
function parseHit(node) {
  var obj = child2Json(node);
  var childNode = node.childNamed(node.name + "_hsps");
  // workaround for EBI XML
  if (childNode == undefined) {
    childNode = node.childNamed("alignments");
    helper.addAttr(node, obj);
    helper.renameProperty(obj, "length", "len");
    helper.renameProperty(obj, "ac", "accession");
    helper.renameProperty(obj, "number", "num");
    delete obj.length;
  }
  obj.hsps = parseArray(childNode, parseHSP);
  helper.checkIntProps(obj, hitIntKeys);
  return obj;
}

var hsspIntKeys = ["num", "score", "query-from", "query-to", "hit-from", "hit-to", "query-frame", "hit-frame",
  "align-len", "identitiy", "positive", "gaps"
];
var hsspFloatKeys = ["bit-score", "evalue"];

// a BLAST HSP (part of an hit)
function parseHSP(node) {
  var obj = child2Json(node);
  // EBI XML hacks
  if (node.childNamed("querySeq") != undefined) {
    var querySeq = node.childNamed("querySeq").attr;
    obj["query-from"] = querySeq.start;
    obj["query-to"] = querySeq.end;
  }
  if (node.childNamed("matchSeq") != undefined) {
    var matchSeq = node.childNamed("matchSeq").attr;
    obj["hit-from"] = matchSeq.start;
    obj["hit-to"] = matchSeq.end;
  }
  // rename EBI params
  helper.renameProperty(obj, "expectation", "evalue");
  helper.renameProperty(obj, "bits", "bit-score");
  helper.renameProperty(obj, "querySeq", "qseq");
  helper.renameProperty(obj, "matchSeq", "hseq");
  helper.renameProperty(obj, "pattern", "midline");
  if (obj["align-len"] == undefined) {
    obj["align-len"] = obj["qseq"].length;
  }
  helper.checkIntProps(obj, hsspIntKeys);
  helper.checkFloatProps(obj, hsspFloatKeys);
  return obj;
}
