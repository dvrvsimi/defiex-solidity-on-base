const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const WalletContractModule = buildModule("WalletContractModule", (m) => {
  const walletContract = m.contract("WalletContract");

  return { walletContract };
});

module.exports = WalletContractModule;

// npx hardhat run scripts/deploy.js --network sepolia
