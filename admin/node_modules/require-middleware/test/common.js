/**
 * Global test dependencies
 */

chai = require('chai');
sinon = require('sinon');
sinonChai = require("sinon-chai");
should = chai.should();
expect = chai.expect;

/**
 * Configure use of sinon chai for chai-style sinon assertions
 */

chai.use(sinonChai);
