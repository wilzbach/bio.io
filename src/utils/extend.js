export default function(out) {
	out = out || {};
	let iterable = __range__(0, arguments.length, false);
	for (let j = 0; j < iterable.length; j++) {
		let i = iterable[j];
		if (!arguments[i]) {
		    continue;
	}

		for (let k = 0; k < arguments[i].length; k++) {
		    let key = arguments[i][k];
		if (arguments[i].hasOwnProperty(key)) {
		    	out[key] = arguments[i][key];
	}
	}
	}
	return out;
};

function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}
