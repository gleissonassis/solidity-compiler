const Web3                    = require('web3');
const Tx                      = require('ethereumjs-tx');
const SolidityCompiler        = require('./SolidityCompiler');

class ContractPublisher {
  constructor (baseUrl) {
    this.web3 = new Web3();
    this.web3.setProvider(new Web3.providers.HttpProvider(baseUrl));
  }

  async compileAndPublish (from, privateKey, contractName, content, waitForReceipt) {
    const compiler = new SolidityCompiler();
    return this.publish(from, privateKey, contractName, compiler.compile(contractName, content), waitForReceipt);
  }

  async publish (from, privateKey, contractName, jsonOutput, waitForReceipt) {
      return new Promise(async (resolve, reject) => {
        const gasPrice = await this.web3.eth.getGasPrice();
        const gasPriceHex = this.web3.utils.toHex(gasPrice);
        const nonce = await this.web3.eth.getTransactionCount(from, 'pending');
        const nonceHex = this.web3.utils.toHex(nonce);

        let abi = jsonOutput['contracts'][contractName][contractName]['abi'];
        let bytecode = jsonOutput['contracts'][contractName][contractName]['evm']['bytecode']['object'];

        const rawTx = {
          nonce: nonceHex,
          gasPrice: gasPriceHex,
          data: '0x' + bytecode,
          from: from
        };

        const gasLimit = await this.web3.eth.estimateGas(rawTx);
        rawTx.gasLimit = this.web3.utils.toHex(gasLimit);

        var privKey = Buffer.from(privateKey.startsWith('0x') ?
                                        privateKey.substring(2) :
                                        privateKey, 'hex');
        const tx = new Tx(rawTx);
        tx.sign(privKey);
        const serializedTx = tx.serialize();

        const transaction = this.web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));

        if (waitForReceipt) {
          transaction
            .then(resolve)
            .catch(reject);
        } else {
          transaction.on('transactionHash', function(hash) {
            resolve({transactionHash: hash});
          });

          transaction.on('error', reject);
        }
    });
  }
}

module.exports = function (baseUrl) {
  return new ContractPublisher(baseUrl);
}
