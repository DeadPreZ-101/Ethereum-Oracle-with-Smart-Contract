const StockOracle = artifacts.require("StockOracle");

module.exports = function(deployer) {
  deployer.deploy(StockOracle);
};
