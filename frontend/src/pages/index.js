import Head from "next/head";
import Action from "../components/Actions";
import LiquidationPool from "../components/LiquidationPool";
import Account from "../components/AccountDetails";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import React, { useEffect, useCallback, useState, useRef } from "react";
import { utils } from "ethers";
import ADDRESS from "./../config/address.json"; // import styles from "../styles/Home.module.css";
import { getProviderOrSigner } from "./../utils/getProviderOrSigner";
import { init } from "./../utils/getDetails";
export default function Home() {
  const router = useRouter();
  const [totalCollateral, setCollateral] = useState(0);
  const [collateralETH, setCollateralETH] = useState(0);
  const [collateralBTC, setCollateralBTC] = useState(0);
  const [collateralETHUSD, setCollateralETHUSD] = useState(0);
  const [collateralBTCUSD, setCollateralBTCUSD] = useState(0);
  const [totalDSC, setTotalDSC] = useState(0);
  const [health, setHealth] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();

  useEffect(() => {
    let isLoaded = false;
    let fatch = async () => {
      const signer = await getProviderOrSigner(web3ModalRef, true);
      const address = await signer.getAddress();
      let response = await init(signer, address);
      // console.log("init log = ", response);
      setCollateral(response.totalCollateral);
      setTotalDSC(response.totalDSC);
      setCollateralBTC(response.collateralBTC.toString());
      setCollateralETH(response.collateralETH.toString());
      setCollateralETHUSD(response.ethUSD);
      setCollateralBTCUSD(response.btcUSD);
      setHealth(response.health);
      // let accountDetails = await getAccountInformation(signer, address);
      // // console.log(
      // //   "accountDetails = ",
      // //   accountDetails["collateralValueInUsd"].toString()
      // // );
      // setCollateral(
      //   accountDetails ? accountDetails["collateralValueInUsd"].toString() : 0
      // );
      // setTotalDSC(
      //   accountDetails ? accountDetails["totalDscMinted"].toString() : 0
      // );
      // let collateralETH = await getCollateralBalanceOfUser(
      //   signer,
      //   ADDRESS.WETH
      // );
      // let collateralBTC = await getCollateralBalanceOfUser(
      //   signer,
      //   ADDRESS.WBTC
      // );
      // let _btcUSD = 0,
      //   _ethUSD = 0;
      // if (collateralBTC) {
      //   _btcUSD = await getUsdValue(
      //     signer,
      //     ADDRESS.WBTC,
      //     collateralBTC.toString()
      //   );
      //   setCollateralBTC(collateralBTC.toString());
      // }
      // if (collateralETH) {
      //   _ethUSD = await getUsdValue(
      //     signer,
      //     ADDRESS.WETH,
      //     collateralETH.toString()
      //   );
      //   setCollateralETH(collateralETH.toString());
      // }
      // // console.log("collateralBTC", _btcUSD.toString());
      // // console.log("collateralETH", collateralETH.toString());
      // let constant = 100000000;
      // setCollateralETHUSD(
      //   (_ethUSD == 0 ? 0 : _ethUSD / constant).toString() + " $"
      // );
      // setCollateralBTCUSD(
      //   (_btcUSD == 0 ? 0 : _btcUSD / constant).toString() + " $"
      // );
      // if (accountDetails) {
      //   let health = await calculateHealthFactor(
      //     signer,
      //     accountDetails["totalDscMinted"],
      //     accountDetails["collateralValueInUsd"]
      //   );
      //   console.log("1.health", health.toString());
      //   setHealth(utils.formatEther(health));
      // }
    };

    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    // console.log("walletConnected  = = 1", walletConnected);
    if (walletConnected && totalCollateral == 0 && !isLoaded) {
      isLoaded = true;
      fatch();
    }
  }, [walletConnected]);
  // wallet
  /*
      connectWallet: Connects the MetaMask wallet
    */
  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  // useEffects are used to react to changes in state of the website
  // The array at the end of function call represents what state changes will trigger this effect
  // In this case, whenever the value of `walletConnected` changes - this effect will be called
  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "sepolia",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={"main "}>
        <div className="w-5/12	float-left		 ">
          <div className="w-full action">
            <Action
              walletConnected={walletConnected}
              web3ModalRef={web3ModalRef}
              totalCollateral={totalCollateral}
              totalDSC={totalDSC}
            />
          </div>
          <div className="w-full detail">
            {" "}
            <Account
              totalCollateral={totalCollateral}
              collateralETH={collateralETH}
              collateralBTC={collateralBTC}
              totalDSC={totalDSC}
              health={health}
              collateralETHUSD={collateralETHUSD}
              collateralBTCUSD={collateralBTCUSD}
            />
          </div>
        </div>
        <div className="w-6/12 float-left	 top-0	liquidated-pool">
          <LiquidationPool
            walletConnected={walletConnected}
            web3ModalRef={web3ModalRef}
          />
        </div>
      </div>
    </div>
  );
}
