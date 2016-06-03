# bio.io

Collection of JavaScript module to parse biological formats.

[![NPM version](http://img.shields.io/npm/v/bio.io.svg)](https://www.npmjs.org/package/bio.io) 
[![Build Status](https://travis-ci.org/wilzbach/bio.io.svg?branch=master)](https://travis-ci.org/wilzbach/bio.io)

### Gotchas

* Remember that you need [CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing) to download files from other servers on the web

FASTA
-----

```
var Fasta = require('biojs-io-fasta');
```

#### `read(url)`

Parses an url an calls your `parse` method with the returned body.

```
Fasta.read("https://raw.githubusercontent.com/biojs-io/biojs-io-fasta/master/test/foo.fasta", function(err, model) {
	// model is the parsed url
});
```
If callback is undefined, `read` returns a promise.

```
var p = Fasta.read("https://raw.githubusercontent.com/biojs-io/biojs-io-fasta/master/test/foo.fasta");
// ...
p.then(function(model) {
	// model is the parsed url
}, function(err){
	console.error("err happened during downloading", err);
});
```

### `parse(str)`

```
var seqs = Fasta.parse(str);
```

### `export(model)`


```
var text = Fasta.export(seqs);
```

### `extend(customParser)`

Thanks to [@sillitoe](https://github.com/sillitoe) you can provide a custom parser
if your FASTA header is formatted "in weird and wonderful ways".

```
var customGetMeta = function(header) {
	return {
      id: "id",
      name: "name",
      // optional
      details: {
		foo: "bar"
      },
      // optional
      ids: {
		customId: "bar"
      }
    };
}
var altFasta = Fasta.extend(customGetMeta);
```

Take a look at [tests](https://github.com/biojs-io/biojs-io-fasta/blob/master/test/fasta.js#L56)
for a better example of such a parser;

Sequence object
---------------

```
{
  seq: "ABC",
  name: "awesome seq",
  id: "unique id"
}
```

Clustal
-------

#### `read(url)`

Parses an url an calls your `parse` method with the returned body.

```
Clustal.read("https://raw.githubusercontent.com/greenify/biojs-io-clustal/blob/master/test/p53.clustalo.clustal", function(err, model) {
	// model is the parsed url
});
```
If callback is undefined, `read` returns a promise.

```
Clustal.read("https://raw.githubusercontent.com/greenify/biojs-io-clustal/blob/master/test/p53.clustalo.clustal").then(function(model) {
	// model is the parsed url
}, function(err){
	console.error("err happened during downloading", err);
});
```

`function` is your async callback.

### `parse(str)`

```
var seqs = Clustal.parse(str);
```

Sequence object
---------------

```
this.seq
this.name
this.id
```

## Seq.tools

### st.getMeta(label)

``
st.getMeta("sp|abc|def") // {name: "def", ids: {sp: "abc"}}
``

### st.contains(text,search)

```
st.contains("ABC", 2) // false
st.contains("ABC","C") // true
```

### st.splitNChars(text,n)

```
st.splitNChars("ABC", 2) // ["AB", "C"]
```


GFF (General feature format)
----------------------------

> A GFF (general feature format) parser

[Official Spec](https://www.sanger.ac.uk/resources/software/gff/spec.html)

```
<seqname> <source> <feature> <start> <end> <score> <strand> <frame> [attributes] [comments]
```

Short [description about the formats](https://github.com/greenify/biojs-vis-msa/wiki/Annotation-Features).

## Supported formats

* [GFF 3](http://www.sequenceontology.org/gff3.shtml)
* [Jalview feature format](http://www.jalview.org/help/html/features/featuresFormat.html)

## Getting Started
Install the module with: `npm install biojs-io-gff`

```javascript
var gff = require('biojs-io-gff');
```

## Documentation

#### `.read(file, cb)`

Callback with `parseSeqs` or Promise

```javascript
var p = gff.read("https://cdn.rawgit.com/greenify/biojs-io-gff/master/test/import.gff3");
// ..
p.then(function(seqs){
  // handle the model
}, function(err){
	console.warn(err);
});
```

#### `.parseSeqs(str)` (alias: `parse`)

**Parameter**: `GFF file` (as string)
**Type**: `String`
**Example**: `SEQ1  EMBL  atg  103  105  .  +  0`

Returns a dictionary of all sequences. Each sequences is an array of its features.

```javascript
gff.parseSeqs('SEQ1  EMBL  atg  103  105  .  +  0');
```

__Result__

```
{ "seqs":
  { "SEQ1":
		[ { seqname: 'SEQ1',
		    source: 'EMBL',
		    feature: 'atg',
		    start: 103,
	    	end: 105,
	    	strand: '+',
	    	frame: 0,
	    	attributes: {} } ]
  },
  "config": {
	type: "gff3"
  }
}
```

#### `.parseLines(str)`

**Parameter**: `GFF file`
**Type**: `String`
**Example**: `SEQ1  EMBL  atg  103  105  .  +  0`

The 'parse' method converts a GFF into its JSON representation.

How to use this method

```javascript
gff.parseLines('SEQ1  EMBL  atg  103  105  .  +  0');
```

__Result__

```
{ "features":
	[{ seqname: 'SEQ1',
    	source: 'EMBL',
    	feature: 'atg',
    	start: 103,
    	end: 105,
    	strand: '+',
    	frame: 0,
    	attributes: {} } ],
  "config": {
	type: "gff3"
  }
}
```
#### `.exportLines(lines)`

Return the textual GFF representation for the given lines

#### `.exportSeqs(seqs)` (alias: `export`)

Return the textual GFF representation for the given seqs

#### `.parseLine(line)`

**Parameter**: `GFF line`
**Type**: `String`
**Example**: `SEQ1  EMBL  atg  103  105  .  +  0`

The 'parseLine' method converts a GFF line into its JSON representation.


```javascript
gff.parseLine('SEQ1  EMBL  atg  103  105  .  +  0');
```

## Gotchas

* undefined properties (dots) are removed (checking for undefined is native)


Parser API
==========

It expects that you provide at least a method `parse` (see below for more details).

Provided methods
---------------

#### `read(url)`

Parses an url an calls your `parse` method with the returned body.

```
parser.read("http://your-url", function(err, model) {
	// model is the parsed url
});
```
If callback is undefined, `read` returns a promise.

```
parser.read("http://your-url").then(function(model) {
	// model is the parsed url
}, function(err){
	console.error("err happened during downloading", err);
});
```

Expected methods
----------------

Your parser should have the following methods:

* `parse`: Takes in an entire file as string and returns the JSON representation

Optional:

* `write`: Takes the JSON representation of a file and writes it in the custom format

If the file is line-by-line, one should create a `new` instance of the parser:

* `parseLine`: parses another line
* `result`: returns the current, resulting object of the parsing process.

How to extend
-------------

### With functions

```
var parser = function(){
  this.parse = function(data){
      return data;
  };
  Parser.mixin(this);
};
```



### With objects

```
var throughParserAlt = {
  parse: function(data) {
    return data;
  }
};
```

Matrix
------

> Parse 2D matrices  (e.g. PAM)

### `read(url)`

Parses an url an calls your `parse` method with the returned body.

```
MParser.read("https://cdn.rawgit.com/greenify/biojs-io-matrix/master/test/data/pam_250", function(err, model) {
	// model is the parsed url
});
```

If callback is undefined, `read` returns a promise.

```
var p = MParser.read("https://cdn.rawgit.com/greenify/biojs-io-matrix/master/test/data/pam_250");
// ...
p.then(function(model) {
	// model is the parsed url
}, function(err){
	console.error("err happened during downloading", err);
});
```

### Read a entire file

```
var matrix = MParser.parse("A 1\nB 1 2");
> { A: { A: 1, B: 1 },
  B: { A: 1, B: 2 } }
```

### Line by line

```
var mParser = new MParser();
mParser.parseLine("A 1");
mParser.parseLine("B 2 3");
var matrix = mParser.buildMatrix();
```

### Save a matrix


```
var matrix = MParser("A 1\nB 1 2");
var out = mParser.export(matrix);
> 'A\t1\nB\t1\t2'
```

Or you can use objects

```
var matrix = new MParser("A 1\nB 1 2");
matrix.buildMatrix(); \\ returns the 2D array
var out = matrix.export();
> 'A\t1\nB\t1\t2'
```



BLAST
-----

> BLAST parser

It parses the XML output of BLAST. You can activate the XML output by adding the
`-outfmt 5` flag to your BLAST program.

[More info about BLAST](http://www.ncbi.nlm.nih.gov/books/NBK153387/)

## Getting Started
Install the module with: `npm install biojs-io-blast`

```javascript
var blast = require('biojs-io-blast');
blast.read("http://files.biojs.net/blast/examples/syne1.xml", function(data){
	console.log("blast object", data);
});
```

[Play on JSBin](http://jsbin.com/cidoga/1/edit?js,console)

## Documentation

[BLAST: short recap (with the output format)](https://docs.google.com/presentation/d/1OtYi-ihHapeHRq_PTc3fi7grnbHoXMbJBJI4Yq1kKGo/present?usp=sharing&slide=id.p)

#### `.read(url)`

**Parameter**: `URL of a BLAST output (in xml)`
**Type**: `String`
**Example**: `http://files.biojs.net/blast/examples/syne1.xml`

**Parameter**: `Callback` or promise
**Type**: `function`

Downloads the XML BLAST file and parses it to JSON.

```javascript
blast.read('http://files.biojs.net/blast/examples/syne1.xml', function(err, data){
	console.log("blast object", data);
});
```

If you don't specify a callback, it will return a promise.

```javascript
var p = blast.read("https://raw.githubusercontent.com/greenify/biojs-io-blast/master/test/dummy/single.xml");
p.then(function(model) {
    // model is the parsed url
}, function(err){
    console.error("err happened during downloading", err);
});
```


As downloading the file is asynchronous, it will call your callback with the
resulting data object.

#### `.parse(str)`

**Parameter**: `XML Output of BLAST`
**Type**: `String`
**Example**: `<BlastOutput><BlastOutput_program>blastp</BlastOutput_program></BlastOutput>`

Parses the BLAST XML output to JSON.

```javascript
blast.parse('<BlastOutput><BlastOutput_program>blastp</BlastOutput_program></BlastOutput>');
```

## CLI version

Install it globally `npm install -g biojs-io-blast` and then you can pipe directly into the parser.

```
cat <blast-file.xml> | biojs-blast
```
## Output

* there can be multiple iterations
* there can be multiple per hits per iteration
* there can be multiple HSPS per hit

### Full example

![entity diagram](http://i.imgur.com/icB9EuG.png)

[Official BLAST XML spec](http://tinyurl.com/ncbi-blast-xml)

```
{
    "program": "blastp",
    "version": "BLASTP 2.2.29+",
    "reference": "Stephen F. Altschul, Thomas L. Madden, Alejandro A. Sch&auml;ffer, Jinghui Zhang, Zheng Zhang, Webb Miller, and David J. Lipman (1997), \"Gapped BLAST and PSI-BLAST: a new generation of protein database search programs\", Nucleic Acids Res. 25:3389-3402.",
    "db": "/home/xsebi/tmp/blast/swiss",
    "query-ID": "Query_1",
    "query-def": "sp|Q8NF91|SYNE1_HUMAN Nesprin-1 OS=Homo sapiens GN=SYNE1 PE=1 SV=4",
    "query-len": "8797",
    "param": {
        "matrix": "BLOSUM62",
        "expect": "10",
        "gap-open": "11",
        "gap-extend": "1",
        "filter": "F"
    },
    "iterations": [
        {
            "iter-num": "1",
            "query-ID": "Query_1",
            "query-def": "sp|Q8NF91|SYNE1_HUMAN Nesprin-1 OS=Homo sapiens GN=SYNE1 PE=1 SV=4",
            "query-len": "8797",
            "hits": [
                {
                    "num": "1",
                    "id": "gnl|BL_ORD_ID|140988",
                    "def": "gi|425906075|sp|Q8NF91.4|SYNE1_HUMAN RecName: Full=Nesprin-1; AltName: Full=Enaptin; AltName: Full=Myocyte nuclear envelope protein 1; Short=Myne-1; AltName: Full=Nuclear envelope spectrin repeat protein 1; AltName: Full=Synaptic nuclear envelope protein 1; Short=Syne-1 [Homo sapiens]",
                    "accession": "140988",
                    "len": "8797",
                    "hsps": [
                        {
                            "num": "1",
                            "bit-score": "17954.1",
                            "score": "46598",
                            "evalue": "0",
                            "query-from": "1",
                            "query-to": "8797",
                            "hit-from": "1",
                            "hit-to": "8797",
                            "query-frame": "0",
                            "hit-frame": "0",
                            "identity": "8797",
                            "positive": "8797",
                            "gaps": "0",
                            "align-len": "8797",
                            "qseq": "MATSRGASRCPR...",
                            "hseq": "MATSRGASRCPR...",
                            "midline": "MATSRGASRCPR..."
                        }
                    ]
            "stat": {
                "db-num": "459767",
                "db-len": "171814008",
                "hsp-len": "143",
                "eff-space": "917906647858",
                "kappa": "0.041",
                "lambda": "0.267",
                "entropy": "0.14"
            }
        }
    ]
}
```

Newick Parser
----------

Just call method `parse_newickk(string)` for parsing a newick string into JSON.

```javascript
Biojs.io.newick.parse_newick('((A,B),C)');
```

Call the method `parse_nhx(string)` for parsing an extended newick formats into JSON.

```javascript
Biojs.io.newick.parse_nhx('((A,B),C)');
```

[Example tree](http://en.wikipedia.org/wiki/Newick_format):

Newick format:

```sh
(A:0.1,B:0.2,(C:0.3,D:0.4)E:0.5)F
```

Converted to JSON:

```javascript
{name : "F",
  children: [
    {name: "A", branch_length: 0.1},
    {name: "B", branch_length: 0.2},
    {
      name: "E",
      length: 0.5,
      children: [
        {name: "C", branch_length: 0.3},
        {name: "D", branch_length: 0.4}
      ]
    }
  ]
}
```
