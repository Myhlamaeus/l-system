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

    window.performance.mark("exampleFormSubmit");

    const iterations = parseInt(this.elements.iterations.value, 10),
        name = this.elements.name.value,
        additionalParameters = [];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(let ele of Array.from(this.querySelectorAll(`[name="additional-parameters"] > [data-for="${name}"] [value]`))) {
        let val = ele.value;

        if(ele.nodeName === "INPUT" && ele.type === "number") {
            val = ele.valueAsNumber;
        }
        additionalParameters.push(val);
    }

    window.performance.mark("exampleImport");
    System.import("examples/" + name).then(function(example) {
        window.performance.mark("lSystemInstantiation");
        const lSystem = new LSystem(example.axiom, example.productionRules);

        window.performance.mark("lSystemGeneration");
        for(let i = 0; i < iterations; ++i) {
            lSystem.step();
        }
        window.performance.mark("exampleStart");
        example.default(canvas.getContext("2d"), lSystem.current, ...additionalParameters);
        window.performance.mark("exampleEnd");

        window.performance.measure("exampleSetup", "exampleFormSubmit", "exampleImport");
        window.performance.measure("exampleImport", "exampleImport", "lSystemInstantiation");
        window.performance.measure("lSystemInstantiation", "lSystemInstantiation", "lSystemGeneration");
        window.performance.measure("lSystemGeneration", "lSystemGeneration", "exampleStart");
        window.performance.measure("example", "exampleStart", "exampleEnd");
        window.performance.measure("totalExample", "exampleFormSubmit", "exampleEnd");

        console.group("Performance");
        for(let ele of window.performance.getEntriesByType("measure")) {
            console.log("%s: %f ms", ele.name, ele.duration);
        }
        console.groupEnd("Performance");
        window.performance.clearMarks();
        window.performance.clearMeasures();
    });
});
form.dispatchEvent(new Event("submit"));
