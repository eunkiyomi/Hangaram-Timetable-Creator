/**
 * http://www.codesuck.com/2012/02/transpose-javascript-array-in-one-line.html
 */
export function transpose(a) { // 행렬의 행과 열을 swap해준다
    return Object.keys(a[0]).map(c => a.map(r => r[c]));
}

export function isSameSubjectWithDifferentClassIdentifier(a, b) {
    if (a === b) {
        return false;
    }

    return getRawSubjectWithoutClassIdentifier(a) === getRawSubjectWithoutClassIdentifier(b);
}

export function getRawSubjectWithoutClassIdentifier(subject) {
    return /^[A-H]$/.test(subject.charAt(subject.length - 1)) ? subject.substring(0, subject.length - 1) : subject;
}

export const BLANK_LESSON = {
    subject: '공강',
    teacher: '',
    room: '',
    empty: true
};
