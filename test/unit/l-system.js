/* global describe, it */

import LSystem from '../../l-system'

const assert = require('assert')
const objGen = function * (obj) {
  for (let key of Object.keys(obj)) {
    yield [key, obj[key]]
  }
}

const tests = {
  'algae': {
    'axiom': 'A',
    'productionRules': {
      'A': ['A', 'B'],
      'B': ['A']
    },
    'expect': [
      'A',
      'AB',
      'ABA',
      'ABAAB',
      'ABAABABA',
      'ABAABABAABAAB',
      'ABAABABAABAABABAABABA',
      'ABAABABAABAABABAABABAABAABABAABAAB'
    ]
  },
  'pythagorasTree': {
    'axiom': '0',
    'productionRules': {
      '0': Array.from('1[0]0'),
      '1': ['1', '1'],
      '[': '[',
      ']': ']'
    },
    'expect': [
    '0',
    '1[0]0',
    '11[1[0]0]1[0]0',
    '1111[11[1[0]0]1[0]0]11[1[0]0]1[0]0'
    ]
  },
  'kochCurve': {
    'axiom': 'F',
    'productionRules': {
      'F': Array.from('F+F-F-F+F'),
      '+': '+',
      '-': '-'
    },
    'expect': [
      'F',
      'F+F-F-F+F',
      'F+F-F-F+F+F+F-F-F+F-F+F-F-F+F-F+F-F-F+F+F+F-F-F+F',
      `F+F-F-F+F+F+F-F-F+F-F+F-F-F+F-F+F-F-F+F+F+F-F-F+F+
       F+F-F-F+F+F+F-F-F+F-F+F-F-F+F-F+F-F-F+F+F+F-F-F+F-
       F+F-F-F+F+F+F-F-F+F-F+F-F-F+F-F+F-F-F+F+F+F-F-F+F-
       F+F-F-F+F+F+F-F-F+F-F+F-F-F+F-F+F-F-F+F+F+F-F-F+F+
       F+F-F-F+F+F+F-F-F+F-F+F-F-F+F-F+F-F-F+F+F+F-F-F+F`.replace(/\s/g, '')
    ]
  }
}

for (let [name, data] of objGen(tests)) {
  describe(name, function () {
    const gen = (new LSystem(data.axiom, new Map(objGen(data.productionRules)))).generator()

    for (let expect of data.expect) {
      it(expect, function () {
        assert.equal(gen.next().value.join(''), expect)
      })
    }
  })
}
