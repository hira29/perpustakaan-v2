export function concatAndDeDuplicateObjectsArray(key: string, array1: any, array2: any): any {
  const concatArray = (p, ...arrs) => [].concat(...arrs).reduce((a, b) => !a.filter(c => b[p] === c[p]).length ? [...a, b] : a, []);
  let result: any;

  if (Array.isArray(array1) && Array.isArray(array2)) {
    result = concatArray(key, array1, array2);
  }

  return result;
}

/* Checking data string can parse to json */
export function isJson(str: any) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
