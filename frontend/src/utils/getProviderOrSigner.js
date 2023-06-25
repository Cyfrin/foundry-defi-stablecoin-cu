import { providers, Contract } from "ethers";
/**
 * This code exports a function called "getProviderOrSigner" that takes in a reference to a Web3Modal
 * object and a boolean flag indicating whether a signer is needed. It then connects to the user's Metamask
 * provider and creates a Web3Provider object. If the user is not connected to the Sepolia network, an error
 * is thrown. If a signer is needed, the function returns a signer object, otherwise it returns the Web3Provider object.
 * @param {*} web3ModalRef
 * @param {*} needSigner return signer object
 * @returns
 */
export const getProviderOrSigner = async (web3ModalRef, needSigner = false) => {
  // Connect to Metamask
  // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
  const provider = await web3ModalRef.current.connect();
  const web3Provider = new providers.Web3Provider(provider);

  // If user is not connected to the Sepolia network, let them know and throw an error
  const { chainId } = await web3Provider.getNetwork();
  if (chainId !== 11155111) {
    window.alert("Change the network to Sepolia");
    throw new Error("Change network to Sepolia");
  }

  if (needSigner) {
    const signer = web3Provider.getSigner();
    return signer;
  }
  return web3Provider;
};
