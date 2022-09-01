
/* 
* The following function takes in an array of needed keys and an object and returns
* a new object from the given one that only contains the needed keys

*/
function _pick(needed, theObj) {
    let newObj = {}
    Object.keys(theObj).forEach((key, i) => {
        if (needed.includes(key)) {
            newObj[key] = theObj[key]
        }
    })
    return newObj
}

/* 
* The following function takes in an array of unneeded keys and an object and returns
* a new object from the given one that doesn't contain the unneeded keys

*/

function _remove(unneeded, theObj) {
    let newObj = {}
    Object.keys(theObj).forEach((key, i) => {
        if (!unneeded.includes(key)) {
            newObj[key] = theObj[key]
        }
    })
    return newObj
}

/* 
* The following function takes in an array of unneeded keys and an object and returns
* a new object from the given one that doesn't contain the unneeded keys

*/

function arr_pick(needed, theArr) {
    let newArr = {}
    theArr.forEach((val, i) => {
        if (needed.includes(val)) {
            newArr.push(val)
        }
    })
    return newArr
}

function arr_remove(needed, theObj) {
    let newObj = []
    theObj.forEach((value, i) => {
        if (!needed.includes(value)) {
            newObj.push(value)
        }
    })
    return newObj
}

function calculateTime(t) {
    var cd = 24 * 60 * 60 * 1000,
        ch = 60 * 60 * 1000,
        d = Math.floor(t / cd),
        h = Math.floor((t - d * cd) / ch),
        m = Math.round((t - d * cd - h * ch) / 60000),
        pad = function (n) { return n < 10 ? '0' + n : n; };
    if (m === 60) {
        h++;
        m = 0;
    }
    if (h === 24) {
        d++;
        h = 0;
    }
    return {
        days: d, 
        hours: pad(h), 
        minutes: pad(m)
    };
}

