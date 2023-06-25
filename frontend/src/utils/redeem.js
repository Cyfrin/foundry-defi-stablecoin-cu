import { Contract, utils } from "ethers";
import { DSC_ENGIN, ERC20 } from "../config/abi";
import ADDRESS from "./../config/address.json"; // import styles from "../styles/Home.module.css";

/**
 * Deposit Collateral on  Defi to get some stable coins against it
 *
 */
export const redeemCurrencyCollateral = async (
  signer,
  tokenCollateralAddress,
  amountCollateral,
  amountToBurn,
  isBurn
) => {
  try {
    let constant = 100000000;

    // create a new instance of the token contract
    const dsce = new Contract(ADDRESS.DSCENGIN, DSC_ENGIN, signer);
    console.log("1. amountCollateral", amountCollateral);
    amountCollateral = amountCollateral * constant;
    //  utils
    //   .parseUnits(amountCollateral.toString(), 8)
    //   .toString();
    console.log("amountToBurn");
    // amountToBurn = amountToBurn * constant;

    amountToBurn = utils.parseUnits(amountToBurn.toString(), 8).toString();
    let tx;
    console.log(amountCollateral.toString(), "isBurn", amountToBurn);
    if (isBurn) {
      const dsc = new Contract(ADDRESS.DSC, ERC20, signer);
      // Because CD tokens are an ERC20, user would need to give the contract allowance
      // to take the required number CD tokens out of his contract
      let tx = await dsc.approve(ADDRESS.DSCENGIN, amountToBurn.toString());
      await tx.wait();
      // After the contract has the approval, add the ether and cd tokens in the liquidity
      tx = await dsce.redeemCollateralForDsc(
        tokenCollateralAddress,
        amountCollateral.toString(),
        amountToBurn
      );
      await tx.wait();
    } else {
      tx = await dsce.redeemCollateral(
        tokenCollateralAddress,
        amountCollateral.toString()
      );
      await tx.wait();
    }
  } catch (err) {
    console.error(err);
  }
};
