const addNum = function(ele, i, arr) {arr[i] += this;},
    addArr = function(ele, i, arr) {arr[i] += this[i];},
    timesNum = function(ele, i, arr) {arr[i] *= this;},
    timesArr = function(ele, i, arr) {arr[i] *= this[i];};

export function* objGen(obj) {
    for(let key of Object.keys(obj)) {
        yield [key, obj[key]];
    }
}

export function degToRad(deg) {
    return deg * Math.PI / 180;
}

export function Vector(...args) {
    this.push(...args);
}

Vector.prototype = Object.assign(Object.create(Array.prototype), {
    "constructor": Vector,
    "slice": function() {
        return new this.constructor(...Array.prototype.slice.apply(this, arguments));
    },
    "map": function() {
        return new this.constructor(...Array.prototype.map.apply(this, arguments));
    },
    "add": function(b) {
        if(typeof(b) === "number") {
            this.forEach(addNum, b);
        } else {
            this.forEach(addArr, b);
        }

        return this;
    },
    "addCopy": function(b) {
        return this.slice().add(b);
    },
    "times": function(b) {
        if(typeof(b) === "number") {
            this.forEach(timesNum, b);
        } else {
            this.forEach(timesArr, b);
        }

        return this;
    },
    "timesCopy": function(b) {
        return this.slice().times(b);
    },
    "toJSON": function() {
        return Array.prototype.slice.call(this);
    },
    "toString": function() {
        return JSON.stringify(this);
    }
});

export function Color(r, g, b) {
    Vector.call(this, Math.max(0, Math.min(255, r)), Math.max(0, Math.min(255, g)), Math.max(0, Math.min(255, b)));
};

Color.prototype = Object.assign(Object.create(Vector.prototype), {
    "toString": function() {
        const clamp = function(c) {
            return (c < 15 ? "0" : "") + c.toString(16);
        };

        return `#${clamp(this[0])}${clamp(this[1])}${clamp(this[2])}`;
    }
});
