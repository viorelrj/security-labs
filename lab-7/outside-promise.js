module.exports = () => {
    let _res;
    let _rej;

    const promise = new Promise((resolve, reject) => {
        _res = resolve;
        _rej = reject;
    })

    return {
        resolve: _res,
        reject: _rej,
        promise: promise
    }
}