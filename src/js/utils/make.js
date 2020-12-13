export function make(len, mapper) {
  return [...new Array(+len)].map(mapper);
}

export default make;
