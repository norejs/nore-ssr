function isPlainObject(obj) {
    return (
        typeof obj === 'object' &&
        Object.prototype.toString.call(obj) === '[object Object]'
    );
}
function deepAssign() {
    let len = arguments.length,
        target = arguments[0];
    if (!isPlainObject(target)) {
        target = {};
    }
    for (let i = 1; i < len; i++) {
        let source = arguments[i];
        if (isPlainObject(source)) {
            for (let s in source) {
                if (s === '__proto__' || target === source[s]) {
                    continue;
                }
                if (isPlainObject(source[s])) {
                    target[s] = deepAssign(target[s], source[s]);
                } else {
                    target[s] = source[s];
                }
            }
        }
    }
    return target;
}
module.exports = deepAssign;