require("@nomicfoundation/hardhat-toolbox");
require('@nomicfoundation/hardhat-ignition');
const { vars } = require("hardhat/config");
const INFURA_API_KEY = vars.get("INFURA_API_KEY");
const SEPOLIA_PRIVATE_KEY = vars.get("SEPOLIA_PRIVATE_KEY");


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
  },
  
  remappings: [
    '@openzeppelin/=node_modules/@openzeppelin/'
  ]
};