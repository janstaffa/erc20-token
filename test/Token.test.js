const { expect } = require('chai');
describe('Token', async () => {
  it('should return name of Token', async () => {
    const TokenContract = await ethers.getContractFactory('Token');
    const token = await TokenContract.deploy('John Coin', 'JCN', 1, 100, 0);
    await token.deployed();
    expect(await token.name()).to.equal('John Coin');
  });
  it('should return symbol of Token', async () => {
    const TokenContract = await ethers.getContractFactory('Token');
    const token = await TokenContract.deploy('John Coin', 'JCN', 1, 100, 0);
    await token.deployed();
    expect(await token.symbol()).to.equal('JCN');
  });
  it('should return decimals of Token', async () => {
    const TokenContract = await ethers.getContractFactory('Token');
    const token = await TokenContract.deploy('John Coin', 'JCN', 1, 100, 0);
    await token.deployed();
    expect(await token.decimals()).to.equal(1);
  });
  it('should return supply of Token', async () => {
    const TokenContract = await ethers.getContractFactory('Token');
    const token = await TokenContract.deploy('John Coin', 'JCN', 1, 100, 0);
    await token.deployed();
    expect(await token.totalSupply()).to.equal(100);
  });
  it('should return balance of an Account in Token', async () => {
    const [owner] = await ethers.getSigners();
    const TokenContract = await ethers.getContractFactory('Token');
    const token = await TokenContract.deploy('John Coin', 'JCN', 1, 100, 0);
    await token.deployed();
    expect(await token.balanceOf(owner.address)).to.equal(100);
  });
  it('should transfer some ammount of Token to another address', async () => {
    const [firstAccount, secondAccount] = await ethers.getSigners();
    const TokenContract = await ethers.getContractFactory('Token');
    const token = await TokenContract.deploy('John Coin', 'JCN', 1, 200, 0);
    await token.deployed();

    await expect(
      token.transferFrom(firstAccount.address, secondAccount.address, 201)
    ).to.reverted;
    await expect(
      token.transferFrom(firstAccount.address, secondAccount.address, -1)
    ).to.reverted;

    await expect(token.transfer(secondAccount.address, 55))
      .to.emit(token, 'Transfer')
      .withArgs(firstAccount.address, secondAccount.address, 55);

    expect(await token.balanceOf(firstAccount.address)).to.equal(145);
    expect(await token.balanceOf(secondAccount.address)).to.equal(55);
  });
  it('should approve an address to spend Token of another address', async () => {
    const [firstAccount, secondAccount] = await ethers.getSigners();
    const TokenContract = await ethers.getContractFactory('Token');
    const token = await TokenContract.deploy('John Coin', 'JCN', 1, 200, 0);
    await token.deployed();

    await expect(token.approve(secondAccount.address, -1)).to.reverted;

    await expect(token.approve(secondAccount.address, 101))
      .to.emit(token, 'Approval')
      .withArgs(firstAccount.address, secondAccount.address, 101);

    expect(
      await token.allowance(firstAccount.address, secondAccount.address)
    ).to.equal(101);
  });
  it('should transfer some ammount of Token to an addresss by another address', async () => {
    const [firstAccount, secondAccount] = await ethers.getSigners();
    const TokenContract = await ethers.getContractFactory('Token');
    const token = await TokenContract.deploy('John Coin', 'JCN', 1, 200, 0);
    await token.deployed();
    await token.approve(secondAccount.address, 101);

    await expect(
      token.transferFrom(firstAccount.address, secondAccount.address, 102)
    ).to.reverted;
    await expect(
      token.transferFrom(firstAccount.address, secondAccount.address, 201)
    ).to.reverted;
    await expect(
      token.transferFrom(firstAccount.address, secondAccount.address, -1)
    ).to.reverted;

    await expect(
      token.transferFrom(firstAccount.address, secondAccount.address, 99)
    )
      .to.emit(token, 'Transfer')
      .withArgs(firstAccount.address, secondAccount.address, 99);
    expect(await token.balanceOf(firstAccount.address)).to.equal(101);
    expect(await token.balanceOf(secondAccount.address)).to.equal(99);
  });
  
  it('should fail to deply Token with larger supply than cap', async () => {
    const TokenContract = await ethers.getContractFactory('Token');
    await expect(TokenContract.deploy('John Coin', 'JCN', 1, 200, 10)).to.reverted;
  });
  
  it('should return Token cap', async () => {
    const TokenContract = await ethers.getContractFactory('Token');
    const token = await TokenContract.deploy('John Coin', 'JCN', 1, 200, 500);
	expect(await token.cap()).to.equal(500);
  });
});
