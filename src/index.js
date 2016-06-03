// TODO: make BLAST slim
//export blast from "./blast";
export clustal from "./clustal";
export fasta from "./fasta";
export gff from "./gff";
export matrix from "./matrix";
export newick from "./newick";
export parser from "./parser";
export seqs from "./seqs";

// convenience export
const xhr = require("xhr");
export {xhr};

// version will be automatically injected by webpack
// IO_VERSION is only defined if loaded via webpack
var VERSION = "imported";
if (typeof IO_VERSION !== "undefined" ) {
    VERSION = IO_VERSION;
}

export const version = VERSION;
