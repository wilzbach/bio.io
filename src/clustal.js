let Clustal;
import GenericReader from "./parser";
import st from "./seqs";

export default Clustal = {

  parse(text) {
    let seqs = [];

    if (Object.prototype.toString.call(text) === '[object Array]') {
      var lines = text;
    } else {
      var lines = text.split("\n");
    }

    // The first line in the file must start with the words "CLUSTAL"
    if (lines[0].slice(0, 6) === !"CLUSTAL") {
      throw new Error("Invalid CLUSTAL Header");
    }

    let k = 0;
    // 0: reading sequences, 1: reading new lines
    let blockstate = 1;
    // count the sequence for every block
    let seqCounter = 0;


    while (k < lines.length) {
      k++;
      let line = lines[k];

      if (!(line != null) || line.length === 0) {
        blockstate = 1;
        continue;
      }

      // okay we have an empty line
      if (line.trim().length === 0) {
        blockstate = 1;
        continue;
      } else {
        // ignore annotations
        if (st.contains(line , "*")) {
          continue;
        }
        if (blockstate === 1) {
          // new block recognized - reset
          seqCounter = 0;
          blockstate = 0;
        }

        let regex = /^(?:\s*)(\S+)(?:\s+)(\S+)(?:\s*)(\d*)(?:\s*|$)/g;
        let match = regex.exec(line);
        if (match != null) {
          let label = match[1].trim();
          let sequence = match[2].trim();

          // check for the first block
          if (seqCounter >= seqs.length) {

            let obj = st.getMeta(label.trim());
            label = obj.name;

            let cSeq = new st.model(sequence, label, seqCounter);
            cSeq.ids = obj.ids || {};
            cSeq.details = obj.details || {};

            let keys = Object.keys(cSeq.ids);
            if (keys.length > 0) {
              cSeq.id = cSeq.ids[keys[0]];
            }
            seqs.push(cSeq);
          } else {
            seqs[seqCounter].seq += sequence;
          }

          seqCounter++;
        } else {
          console.log("parse error", line);
        }
      }
    }

    return seqs;
  }
};

GenericReader.mixin(Clustal);
