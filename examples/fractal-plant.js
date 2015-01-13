import {objGen, degToRad, Vector, Color} from "./tools";

export const axiom = "X",
    productionRules = new Map(objGen({
        "X": Array.from("F-[[X]+X]+F[+FX]-X"),
        "F": ["F", "F"],
        "+": "+",
        "-": "-",
        "[": "[",
        "]": "]"
    })),
    result = true;

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
