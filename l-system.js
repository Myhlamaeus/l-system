class LSystem {
    constructor(axiom, productionRules) {
        if(!(Symbol.iterator in productionRules)) {
            throw new Error("LSystem: productionRules (argument 1) must be iterable");
        }

        productionRules = new Map(productionRules);

        const alphabet = Array.from(productionRules.keys()),
            constants = [];

        if(alphabet.indexOf(axiom) === -1) {
            throw new Error("LSystem: axiom (argument 0) has to be in productionRules");
        }

        for(let [from, to] of productionRules) {
            if(typeof(to) === "string" || !(Symbol.iterator in to)) {
                to = [to];
                productionRules.set(from, to);
            }

            if(to.length === 1 && to[0] === from) {
                constants.push(to);
            }

            for(let ele of to) {
                if(alphabet.indexOf(ele) === -1) {
                    throw new Error(`LSystem: unknown value ${ele} in productionRules of ${from}`);
                }
            }
        }

        Object.assign(this, {
            "axiom": axiom,
            "alphabet": alphabet,
            "constants": constants,
            "productionRules": productionRules
        });
        this.reset();
    }

    step() {
        const next = [];

        for(let ele of this.current) {
            next.push(...this.productionRules.get(ele));
        }

        this.current = next;
    }

    reset() {
        this.current = [this.axiom];
    }

    ended() {
        for(let ele of this.current) {
            if(this.constants.indexOf(ele) === -1) {
                return false;
            }
        }

        return true;
    }

    * generator() {
        while(true) {
            yield this.current;

            this.step();
            if(this.ended()) {
                break;
            }
        }
    }

    [Symbol.iterator]() {
        return (new LSystem(this.axiom, this.productionRules)).generator();
    }
}

export default LSystem;
