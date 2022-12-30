async function main() {
  const TokenContract = await ethers.getContractFactory('Token');
  const token = await TokenContract.deploy('John Coin', "JCN", 1, 100, 1000);
  console.log('Token contract deployed to:', token.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
