const { ethers } = require('ethers');

class PaymentChannel {
constructor(channelAddress, signer) {
this.channel = new ethers.Contract(channelAddress, abi, signer);
this.signer = signer;
this.nonce = 0;
}
async createPayment(amount) {
    this.nonce++;
const messageHash = ethers.utils.solidityKeccak256(
['address', 'uint256','uint256'],
[this.channel.address, amount,this.nonce]
);
const messageHashBinary = ethers.utils.arrayify(messageHash);
const signature = await this.signer.signMessage(messageHashBinary);
return { amount, nonce: this.nonce,signature };
}

async closeChannel(payment) {

const tx = await this.channel.close(
payment.amount,
payment.nonce,
payment.signature
);
return tx;
}
}
MediaSourceHandle.exports = PaymentChannel;