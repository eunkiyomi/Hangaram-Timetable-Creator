/**
 * http://www.codesuck.com/2012/02/transpose-javascript-array-in-one-line.html
 */
export default function transpose(a) { // 행렬의 행과 열을 swap해준다
    return Object.keys(a[0]).map(c => a.map(r => r[c]));
}
