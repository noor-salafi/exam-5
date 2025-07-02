class MultiChainWallet {
  constructor(bridge) {
    this.providers = {};
    this.signers = {};
    this.bridge = bridge; 
  }

  async connectChain(chainId) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const network = await provider.getNetwork();
    if (network.chainId !== chainId) {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ethers.utils.hexValue(chainId) }]
      });
    }

    this.providers[chainId] = provider;
    this.signers[chainId] = provider.getSigner();
  }

  async sendCrossChain(fromChain, toChain, amount) {
    const signer = this.signers[fromChain];
    const address = await signer.getAddress();

    const balance = await signer.getBalance();
    if (balance.lt(ethers.utils.parseEther(amount.toString()))) {
      throw new Error("Insufficient balance");
    }

    const tx = await this.bridge.send(fromChain, toChain, amount, signer);
    const receipt = await tx.wait(); 
    return receipt.transactionHash;
  }
}
