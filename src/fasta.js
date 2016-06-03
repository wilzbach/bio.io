let Fasta;
import st from "./seqs";
import extend from "./utils/extend";
import GenericReader from "./parser";

export default Fasta = {

  getMeta: st.getMeta,

  extend(metaParser) {
  	let customFasta = extend(Fasta);
  	Fasta.getMeta = metaParser;
  	return customFasta;
},

  parse(text) {
    let seqs = [];

    // catch empty string
    if (!text || text.length === 0) {
      return [];
    }

    if (Object.prototype.toString.call(text) !== '[object Array]') { text = text.split("\n"); }

    let { getMeta } = Fasta;

    for (let i = 0; i < text.length; i++) {
      // check for header
      let line = text[i];
      if (line[0] === ">" || line[0] === ";") {

        let label = line.slice(1).trim();
        // extract IDs and push them to the meta dict
        let obj = getMeta(label.trim());
        label = obj.name;
        let id = obj.id || seqs.length;
        var currentSeq = new st.model( "", obj.name, id );
        currentSeq.ids = obj.ids || {};
        currentSeq.details = obj.details || {};
        seqs.push(currentSeq);
      } else {
        currentSeq.seq += line;
      }
    }
    return seqs;
  },

  write(seqs, access) {
    let text = "";
    for (let i = 0; i < seqs.length; i++) {
      let seq = seqs[i];
      if (access != null) { seq = access(seq); }
      //FASTA header
      text += `>${seq.name}\n`;
      // seq
      text += (st.splitNChars(seq.seq, 80)).join("\n");

      text += "\n";
    }
    return text;
  }
};
GenericReader.mixin(Fasta);
