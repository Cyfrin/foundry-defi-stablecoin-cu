// import './globals.css'

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { ellipseAddress } from "../../utils/utilities";
export default function Header() {
  const router = useRouter();

  // walletConnected keep track of whether the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);
  const [address, setAddress] = useState("");

  // joinedWhitelist keeps track of whether the current metamask address has joined the Whitelist or not
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  // loading is set to true when we are waiting for a transaction to get mined
  const [loading, setLoading] = useState(false);
  // numberOfWhitelisted tracks the number of addresses's whitelisted
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
  const web3ModalRef = useRef();

  /**
   * Returns a Provider or Signer object representing the Ethereum RPC with or without the
   * signing capabilities of metamask attached
   *
   * A `Provider` is needed to interact with the blockchain - reading transactions, reading balances, reading state, etc.
   *
   * A `Signer` is a special type of Provider used in case a `write` transaction needs to be made to the blockchain, which involves the connected account
   * needing to make a digital signature to authorize the transaction being sent. Metamask exposes a Signer API to allow your website to
   * request signatures from the user using Signer functions.
   *
   * @param {*} needSigner - True if you need the signer, default false otherwise
   */
  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Goerli network, let them know and throw an error
    const { chainId, ensAddress } = await web3Provider.getNetwork();
    // console.log("chainId =>", chainId);
    if (chainId !== 11155111) {
      window.alert("Change the network to sepolia");
      throw new Error("Change network to Hardhat");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      // console.log("signer.address", await signer.getAddress());
      setAddress(await signer.getAddress());
      return signer;
    }
    return web3Provider;
  };
  /*
    connectWallet: Connects the MetaMask wallet
  */
  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      localStorage.setItem("connected", true);
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      await getProviderOrSigner(true);
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let fatch = async () => {
      if (web3ModalRef && localStorage.getItem("connected")) {
        // console.log("inside");
        const handleAccountsChanged = async (accounts) => {
          // eslint-disable-next-line no-console
          await getProviderOrSigner();
          setWalletConnected(true);
        };

        web3ModalRef.current = new Web3Modal({
          network: "goerli",
          providerOptions: {},
          disableInjectedProvider: false,
        });
        const provider = await web3ModalRef.current.connect();
        const web3Provider = new providers.Web3Provider(provider);

        web3Provider.provider.on("accountsChanged", handleAccountsChanged);
        // Subscription Cleanup
        // router.reload()
      }
    };
    fatch();
  }, [web3ModalRef]);
  const disconnect = async () => {
    web3ModalRef.current.clearCachedProvider();
    window.localStorage.clear();
    localStorage.removeItem("connected");
    router.reload();
  };
  /*
    renderButton: Returns a button based on the state of the dapp
  */
  const renderButton = () => {
    // console.log("walletConnected", walletConnected);
    if (walletConnected) {
      return (
        <div className="w-full ">
          <div className="w-5/12 float-left">
            <button onClick={disconnect} className={"button connect "}>
              Disconnect
            </button>
          </div>
          <div className="w-5/12 float-left pt-5">
            {" "}
            <span className="address">{ellipseAddress(address)}</span>
          </div>
        </div>
      );
    } else {
      return (
        <button onClick={connectWallet} className={"button connect"}>
          Connect
        </button>
      );
    }
  };
  // useEffects are used to react to changes in state of the website
  // The array at the end of function call represents what state changes will trigger this effect
  // In this case, whenever the value of `walletConnected` changes - this effect will be called
  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected && localStorage.getItem("connected")) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);
  return (
    <>
      <div className="w-full">
        <div className="absolute left-0 top-0  mb-8">
          <img className={"image"} alt="bc" src="./logo.png" />
        </div>
        <div className="absolute top-0 right-0  pr-12 pt-4  ">
          {renderButton()}
        </div>
      </div>
    </>
  );
}
