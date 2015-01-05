import LSystem from "../l-system";

const form = document.getElementById("l-system-example-selection"),
    canvas = document.getElementById("l-system-example-canvas"),
    ctx = canvas.getContext("2d");

canvas.width = parseInt(getComputedStyle(canvas).width, 10);
canvas.height = parseInt(getComputedStyle(canvas).height, 10);

form.elements.name.addEventListener("change", function(e) {
    const val = this.value;

    for(let child of Array.from(this.form.elements["additional-parameters"].children)) {
        child.hidden = child.dataset.for && child.dataset.for !== val;
    }
});
form.elements.name.dispatchEvent(new Event("change"));

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const iterations = parseInt(this.elements.iterations.value, 10),
        name = this.elements.name.value,
        additionalParameters = [];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(let child of Array.from(this.elements["additional-parameters"].children)) {
        if(child.dataset.for === name) {
            for(let ele of Array.from(child.querySelectorAll("*"))) {
                if(ele.value) {
                    additionalParameters.push(ele.value);
                }
            }
        }
    }

    System.import("examples/" + name).then(function(example) {
        const lSystem = new LSystem(example.axiom, example.productionRules);

        for(let i = 0; i < iterations; ++i) {
            lSystem.step();
        }
        example.default(canvas.getContext("2d"), lSystem.current, ...additionalParameters);
    });
});
form.dispatchEvent(new Event("submit"));
