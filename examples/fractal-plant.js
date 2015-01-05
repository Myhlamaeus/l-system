const objGen = function*(obj) {for(let key of Object.keys(obj)) {yield [key, obj[key]];}},
    Vector = function(...args) {this.push(...args)};

Vector.prototype = Object.assign(Object.create(Array.prototype), {
    "constructor": Vector,
    "add": function(b) {
        if(typeof(b) === "number") {
            return new this.constructor(...this.map((ele) => ele + b));
        }
        return new this.constructor(...this.map((ele, i) => ele + b[i]));
    },
    "times": function(b) {
        if(typeof(b) === "number") {
            return new this.constructor(...this.map((ele) => ele * b));
        }
        return new this.constructor(...this.map((ele, i) => ele * b[i]));
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

export const axiom = "X";
export const productionRules = new Map(objGen({
    "X": Array.from("F-[[X]+X]+F[+FX]-X"),
    "F": ["F", "F"],
    "+": "+",
    "-": "-",
    "[": "[",
    "]": "]"
}));

export default function(ctx, step, angle, startAngle, startLength, lengthChange) {
    angle = parseInt(angle, 10) * Math.PI / 180;

    var pos = new Vector(10, 10),
        stack = [],
        length = parseInt(startLength, 10),
        currentAngle = parseInt(startAngle, 10) * Math.PI / 180,
        dir = new Vector(Math.cos(currentAngle), Math.sin(currentAngle));

    lengthChange = parseInt(lengthChange, 10);

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

            ctx.beginPath();
            ctx.moveTo(pos[0], pos[1]);
        } else if(symbol === "[") {
            stack.push({
                "pos": pos,
                "length": length,
                "dir": dir,
                "currentAngle": currentAngle
            });
        } else if(symbol === "F") {
            pos = pos.add(dir.times(length));
            length += lengthChange;

            ctx.lineTo(pos[0], pos[1]);
            ctx.stroke();
            ctx.closePath();
            ctx.strokeStyle = (new Color(parseInt(Math.random() * 255, 10), parseInt(Math.random() * 255, 10), parseInt(Math.random() * 255, 10))).toString();
            ctx.beginPath();
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
