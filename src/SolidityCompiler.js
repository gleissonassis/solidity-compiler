const solc = require('solc');

class SolidityCompiler {
  compile (contractName, content) {
    const input = {
        language: 'Solidity',
        sources: {},
        settings: {
            outputSelection: {
                '*': {
                    '*': [ '*' ]
                }
            }
        }
    }

    input.sources[contractName] = {
      content: content
    };

    return JSON.parse(solc.compile(JSON.stringify(input)));
  }
}

module.exports = function () {
  return new SolidityCompiler();
}
