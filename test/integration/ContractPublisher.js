const ContractPublisher         = require('../../src/index').ContractPublisher;
const chai                      = require('chai');
const sinon                     = require('sinon');
const expect                    = chai.expect;

describe('Contract Publisher', function() {
  const publisher = new ContractPublisher('http://127.0.0.1:7545');

  it('compileAndPublish', function() {
    return publisher.compileAndPublish(
    '0xbd65f7961FdF889e1Bc62991383C3129C9e44dFb',
    '0x431d7377ff7fdbd3e4076d284ea60343b8c3ce7e531bf8e18041ca5f64903dc6',
    'F',
    'contract F {}',
    true)
      .then(res => {
        console.log(res);
      })
  });
});
