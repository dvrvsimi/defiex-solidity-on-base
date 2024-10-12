const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WalletContract", function () {
  let WalletContract;
  let walletContract;
  let owner;
  let addr1;
  let addr2;
  let mockToken;

  beforeEach(async function () {
    // Deploy a mock ERC20 token for testing
    const MockToken = await ethers.getContractFactory("MockERC20");
    mockToken = await MockToken.deploy("MockToken", "MTK");
    await mockToken.deployed();

    WalletContract = await ethers.getContractFactory("WalletContract");
    [owner, addr1, addr2] = await ethers.getSigners();
    walletContract = await WalletContract.deploy();
    await walletContract.deployed();

    // Mint some tokens to the owner for testing
    await mockToken.mint(owner.address, ethers.utils.parseEther("1000"));
    await mockToken.approve(walletContract.address, ethers.utils.parseEther("1000"));
  });

  describe("Deposit", function () {
    it("Should allow deposits", async function () {
      const depositAmount = ethers.utils.parseEther("100");
      await expect(walletContract.deposit(mockToken.address, depositAmount))
        .to.emit(walletContract, "Deposit")
        .withArgs(owner.address, mockToken.address, depositAmount);

      const balance = await walletContract.getBalance(owner.address, mockToken.address);
      expect(balance).to.equal(depositAmount);
    });

    it("Should fail when depositing 0 amount", async function () {
      await expect(walletContract.deposit(mockToken.address, 0)).to.be.revertedWith("Amount must be greater than 0");
    });
  });

  describe("Withdraw", function () {
    it("Should not allow withdrawal before 24 hours", async function () {
      const depositAmount = ethers.utils.parseEther("100");
      await walletContract.deposit(mockToken.address, depositAmount);

      await expect(walletContract.withdraw(mockToken.address, depositAmount))
        .to.be.revertedWith("Withdrawal locked for 24 hours after deposit");
    });

    it("Should allow withdrawal after 24 hours", async function () {
      const depositAmount = ethers.utils.parseEther("100");
      await walletContract.deposit(mockToken.address, depositAmount);

      // Increase time by 24 hours + 1 second
      await ethers.provider.send("evm_increaseTime", [24 * 60 * 60 + 1]);
      await ethers.provider.send("evm_mine");

      await expect(walletContract.withdraw(mockToken.address, depositAmount))
        .to.emit(walletContract, "Withdrawal")
        .withArgs(owner.address, mockToken.address, depositAmount);

      const balance = await walletContract.getBalance(owner.address, mockToken.address);
      expect(balance).to.equal(0);
    });

    it("Should fail when withdrawing more than balance", async function () {
      const depositAmount = ethers.utils.parseEther("100");
      await walletContract.deposit(mockToken.address, depositAmount);

      await ethers.provider.send("evm_increaseTime", [24 * 60 * 60 + 1]);
      await ethers.provider.send("evm_mine");

      await expect(walletContract.withdraw(mockToken.address, depositAmount.add(1)))
        .to.be.revertedWith("Insufficient balance");
    });
  });

  describe("GetBalance", function () {
    it("Should return correct balance", async function () {
      const depositAmount = ethers.utils.parseEther("100");
      await walletContract.deposit(mockToken.address, depositAmount);

      const balance = await walletContract.getBalance(owner.address, mockToken.address);
      expect(balance).to.equal(depositAmount);
    });

    it("Should return 0 for address with no deposits", async function () {
      const balance = await walletContract.getBalance(addr1.address, mockToken.address);
      expect(balance).to.equal(0);
    });
  });
});