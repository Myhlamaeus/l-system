const objGen = function*(obj) {for(let key of Object.keys(obj)) {yield [key, obj[key]];}},
    Vector = function(...args) {this.push(...args)},
    degToRad = function(deg) {
        return deg * Math.PI / 180;
    },
    addNum = function(ele, i, arr) {arr[i] += this;},
    addArr = function(ele, i, arr) {arr[i] += this[i];},
    timesNum = function(ele, i, arr) {arr[i] *= this;},
    timesArr = function(ele, i, arr) {arr[i] *= this[i];};

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

const Color = function(r, g, b) {
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

export const axiom = "X",
    productionRules = new Map(objGen({
        "X": Array.from("F-[[X]+X]+F[+FX]-X"),
        "F": ["F", "F"],
        "+": "+",
        "-": "-",
        "[": "[",
        "]": "]"
    }));

export default function(ctx, step, angle, startAngle, startLength, lengthChange) {
    angle = degToRad(angle);

    var pos = new Vector(10, 10),
        stack = [],
        length = startLength,
        currentAngle = degToRad(startAngle),
        dir = new Vector(Math.cos(currentAngle), Math.sin(currentAngle));

    lengthChange = lengthChange;

    ctx.beginPath();
    ctx.moveTo(pos[0], pos[1]);
    for(let symbol of step) {
        if(symbol === "]") {
            const last = stack.pop();
            pos = last.pos;
            length = last.length;
            dir = last.dir;
            currentAngle = last.currentAngle;

            ctx.stroke();
            ctx.closePath();

            ctx.strokeStyle = (new Color(parseInt(Math.random() * 255, 10), parseInt(Math.random() * 255, 10), parseInt(Math.random() * 255, 10))).toString();

            ctx.beginPath();
            ctx.moveTo(pos[0], pos[1]);
        } else if(symbol === "[") {
            stack.push({
                "pos": pos.slice(),
                "length": length,
                "dir": dir,
                "currentAngle": currentAngle
            });
        } else if(symbol === "F") {
            pos.add(dir.timesCopy(length));
            length += lengthChange;

            ctx.lineTo(pos[0], pos[1]);
            ctx.moveTo(pos[0], pos[1]);
        } else if(symbol === "-" || symbol === "+") {
            if(symbol === "-") {
                currentAngle -= angle;
            } else {
                currentAngle += angle;
            }

            dir = new Vector(Math.cos(currentAngle), Math.sin(currentAngle));
        }
    }
    ctx.stroke();
    ctx.closePath();
}
