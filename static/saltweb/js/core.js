function obj_t(data) {
    "use strict";
    let arr = [];
    if(typeof data !== "object"){
        return false
    }
    for (let x in data) {
        let obj = {};
        if (typeof data[x] === "object") {
            obj = data[x];
        }
        obj["Index"] = x;
        arr.push(obj);
    }
    return arr;
}

function FormatIP(row, column) {
    if(typeof row.ipv4 !== "object"){
        return "Null"
    }
    return row.ipv4[row.ipv4.length - 1]
}