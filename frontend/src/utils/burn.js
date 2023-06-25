import { Contract, utils } from "ethers";
import { DSC_ENGIN, ERC20 } from "../config/abi";
import ADDRESS from "./../config/address.json"; // import styles from "../styles/Home.module.css";
let constant = 100000000;

/**
 * Deposit Collateral on  Defi to get some stable coins against it
 *
 */
export const burnDSC = async (signer, amountToBurn) => {
  try {
    // create a new instance of the token contract
    const dsce = new Contract(ADDRESS.DSCENGIN, DSC_ENGIN, signer);
    const dsc = new Contract(ADDRESS.DSC, ERC20, signer);
    // Because CD tokens are an ERC20, user would need to give the contract allowance
    // to take the required number CD tokens out of his contract
    amountToBurn = amountToBurn * constant;
    let tx = await dsc.approve(ADDRESS.DSCENGIN, amountToBurn.toString());
    await tx.wait();
    // console.log("amountToBurn", amountToBurn);
    tx = await dsce.burnDsc(amountToBurn.toString());
    await tx.wait();
  } catch (err) {
    console.error(err);
  }
};
