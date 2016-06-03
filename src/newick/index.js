import parse_newick from './newick';
import parse_nhx from './extended_newick';

const newick = {};
newick.parse = parse_newick;
newick.parseNhx = parse_nhx;

export default newick;

export parse from './newick';
export parseNhx from './extended_newick';
