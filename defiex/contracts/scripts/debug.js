const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Debugging with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const WalletContract = await hre.ethers.getContractFactory("WalletContract");
  const walletContract = await WalletContract.deploy();

  await walletContract.deployed();

  console.log("WalletContract deployed to:", walletContract.address);

  // Debug deposit function
  const depositAmount = hre.ethers.utils.parseEther("1");
  const mockTokenAddress = "0x1234567890123456789012345678901234567890"; // Replace with a real token address
  await walletContract.deposit(mockTokenAddress, depositAmount);
  console.log("Deposited:", depositAmount.toString(), "to token:", mockTokenAddress);

  // Debug getBalance function
  const balance = await walletContract.getBalance(deployer.address, mockTokenAddress);
  console.log("Balance after deposit:", balance.toString());

  // Debug withdraw function
  // Note: This will fail if 24 hours haven't passed since deposit
  try {
    await walletContract.withdraw(mockTokenAddress, depositAmount);
    console.log("Withdrawn:", depositAmount.toString(), "from token:", mockTokenAddress);
  } catch (error) {
    console.log("Withdrawal failed. Error:", error.message);
  }

  // Add more debugging steps here as needed
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });