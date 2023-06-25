import { Contract, utils } from "ethers";
import { ERC20, DSC_ENGIN } from "../config/abi";
import ADDRESS from "./../config/address.json"; // import styles from "../styles/Home.module.css";
import { getProviderOrSigner } from "./getProviderOrSigner";
let constant = 100000000;

/**
 * Deposit Collateral on  Defi to get some stable coins against it
 *
 */
export const getTokenBalance = async (
  signer,
  tokenCollateralAddress,
  address
) => {
  try {
    // create a new instance of the token contract
    const exchangeContract = new Contract(
      tokenCollateralAddress,
      ERC20,
      signer
    );
    // Because CD tokens are an ERC20, user would need to give the contract allowance
    // to take the required number CD tokens out of his contract
    return await exchangeContract.balanceOf(address);
  } catch (err) {
    console.error(err);
  }
};

export const getAccountInformation = async (signer, address) => {
  try {
    const dsce = new Contract(ADDRESS.DSCENGIN, DSC_ENGIN, signer);

    // Because CD tokens are an ERC20, user would need to give the contract allowance
    // to take the required number CD tokens out of his contract
    return await dsce.getAccountInformation(address);
  } catch (err) {
    console.error(err);
  }
};

export const calculateHealthFactor = async (
  signer,
  totalDscMinted,
  collateralValueInUsd
) => {
  try {
    const dsce = new Contract(ADDRESS.DSCENGIN, DSC_ENGIN, signer);
    const address = await signer.getAddress();
    // Because CD tokens are an ERC20, user would need to give the contract allowance
    // to take the required number CD tokens out of his contract
    return await dsce.calculateHealthFactor(
      totalDscMinted,
      collateralValueInUsd
    );
  } catch (err) {
    console.error(err);
  }
};

export const getCollateralBalanceOfUser = async (
  signer,
  tokenCollateralAddress
) => {
  try {
    const dsce = new Contract(ADDRESS.DSCENGIN, DSC_ENGIN, signer);
    const address = await signer.getAddress();
    // Because CD tokens are an ERC20, user would need to give the contract allowance
    // to take the required number CD tokens out of his contract
    return await dsce.getCollateralBalanceOfUser(
      address,
      tokenCollateralAddress
    );
  } catch (err) {
    console.error(err);
  }
};

export const getMinHealthFactor = async (signer) => {
  try {
    const dsce = new Contract(ADDRESS.DSCENGIN, DSC_ENGIN, signer);
    const address = await signer.getAddress();
    // Because CD tokens are an ERC20, user would need to give the contract allowance
    // to take the required number CD tokens out of his contract
    return await dsce.getMinHealthFactor();
  } catch (err) {
    console.error(err);
  }
};

export const getUsdValue = async (signer, tokenCollateralAddress, amount) => {
  try {
    const dsce = new Contract(ADDRESS.DSCENGIN, DSC_ENGIN, signer);
    const address = await signer.getAddress();

    // Because CD tokens are an ERC20, user would need to give the contract allowance
    // to take the required number CD tokens out of his contract
    return await dsce.getUsdValue(tokenCollateralAddress, amount);
  } catch (err) {
    console.error(err);
  }
};

export const healthCheck = async (
  web3ModalRef,
  currency,
  totalDSC,
  totalCollateral,
  collateral = 0,
  coin = 0,
  isReedem = false
) => {
  // if (coin == "") {
  //   return;
  // }
  const signer = await getProviderOrSigner(web3ModalRef, true);
  let collateralUSD = 0;
  let health = 0;
  console.log("check 1");

  if (currency != "") {
    if (collateral == "") {
      return;
    }
    collateralUSD = await getUsdValue(
      signer,
      currency,
      utils.parseUnits(collateral.toString(), 8).toString()
    );
  }

  // console.log(totalCollateral, "collateralUSD", collateralUSD.toString());

  if (!isReedem) {
    health = await calculateHealthFactor(
      signer,

      (
        parseFloat(totalDSC.toString()) +
        parseFloat(utils.parseUnits(coin.toString(), 8).toString())
      ).toString(),
      parseFloat(totalCollateral) + parseFloat(collateralUSD)
    );
  }
  if (isReedem) {
    // console.log(
    //   "check for burn",
    //   parseFloat(totalDSC.toString()) -
    //     parseFloat(utils.parseUnits(coin.toString(), 8).toString())
    // );
    health = await calculateHealthFactor(
      signer,

      (
        parseFloat(totalDSC.toString()) -
        parseFloat(utils.parseUnits(coin.toString(), 8).toString())
      ).toString(),
      parseFloat(totalCollateral) - parseFloat(collateralUSD)
    );
  }
  // console.log("1111.health", health.toString());
  const MIN_HEALTH_FACTOR = await getMinHealthFactor(signer);

  // console.log("health = ", MIN_HEALTH_FACTOR.toString());
  if (health && health.lt(MIN_HEALTH_FACTOR)) {
    // console.log("unhealthy");
    // SetIsHealth(true);
    // setMessage("Did not allow to mint more the 50% of collateral ");
    return {
      isHealthy: true,
      message: "Did not allow to mint more the 50% of collateral ",
    };
  } else {
    // console.log("healthy");
    // setMessage("");
    // SetIsHealth(false);
    return { isHealthy: false, message: "" };
  }

  // if()
};

export const balanceLoad = async (currency, web3ModalRef) => {
  const signer = await getProviderOrSigner(web3ModalRef, true);
  let balance = 0,
    balanceUSD = 0;
  const address = signer.getAddress();

  balance = await getTokenBalance(signer, currency, address);
  console.log("balance", balance.toString());
  if (balance) {
    // console.log(currency, "balancebalancebalancebalance", balance.toString());
    balanceUSD = await getUsdValue(signer, currency, balance.toString());
    // console.log("balanceUSD", balanceUSD);
    balanceUSD =
      utils.formatEther(utils.parseUnits(balanceUSD.toString())) / 100000000;
    balance =
      utils.formatEther(utils.parseUnits(balance.toString())) / 100000000;
  }
  return { balance, balanceUSD };
};

export const checkCollateral = async (currency, web3ModalRef) => {
  const signer = await getProviderOrSigner(web3ModalRef, true);

  let _collateral = await getCollateralBalanceOfUser(signer, currency);
  let btcUSD = await getUsdValue(signer, currency, _collateral.toString());

  return {
    collateral: (_collateral == 0 ? 0 : _collateral / constant).toString(),
    collateralUSD: (btcUSD == 0 ? 0 : btcUSD / constant).toString(),
  };
};

export const init = async (signer, address) => {
  let accountDetails = await getAccountInformation(signer, address);
  // console.log(
  //   "accountDetails = ",
  //   accountDetails["collateralValueInUsd"].toString()
  // );
  const dsc = new Contract(ADDRESS.DSC, ERC20, signer);
  let _balab = await dsc.balanceOf(address);
  console.log(address, "DSC Balance = > ", _balab.toString());
  let totalCollateral = accountDetails
    ? accountDetails["collateralValueInUsd"].toString()
    : 0;

  let totalDSC = accountDetails
    ? accountDetails["totalDscMinted"].toString()
    : 0;
  // console.log("1.totalCollateral", totalDSC);
  let collateralETH = await getCollateralBalanceOfUser(signer, ADDRESS.WETH);
  let collateralBTC = await getCollateralBalanceOfUser(signer, ADDRESS.WBTC);
  let btcUSD = 0,
    ethUSD = 0;
  if (collateralBTC) {
    btcUSD = await getUsdValue(signer, ADDRESS.WBTC, collateralBTC.toString());
    collateralBTC = collateralBTC.toString();
  }
  if (collateralETH) {
    ethUSD = await getUsdValue(signer, ADDRESS.WETH, collateralETH.toString());
  }
  // console.log("collateralBTC", btcUSD.toString());
  // console.log("collateralETH", collateralETH.toString());
  // let constant = 100000000;
  console.log("ethUSD", ethUSD.toString());
  ethUSD = (ethUSD == 0 ? 0 : ethUSD / constant).toString();

  btcUSD = (btcUSD == 0 ? 0 : btcUSD / constant).toString();
  let health = 0;
  if (accountDetails) {
    health = await calculateHealthFactor(
      signer,
      accountDetails["totalDscMinted"],
      accountDetails["collateralValueInUsd"]
    );
    // console.log("1.health", health.toString());
    // setHealth(utils.formatEther(health));
  }

  return {
    totalCollateral: totalCollateral,
    totalDSC: totalDSC,
    collateralBTC: collateralBTC ? collateralBTC.toString() : 0,
    collateralETH: collateralETH ? collateralETH.toString() : 0,
    ethUSD: ethUSD,
    btcUSD: btcUSD,
    health: utils.formatEther(health),
  };
};
