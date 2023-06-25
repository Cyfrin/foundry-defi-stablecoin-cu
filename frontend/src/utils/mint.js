import { Contract, utils } from "ethers";
import { DSC_ENGIN, ERC20 } from "../config/abi";
import ADDRESS from "./../config/address.json"; // import styles from "../styles/Home.module.css";

/**
 * Deposit Collateral on  Defi to get some stable coins against it
 *
 */
let constant = 100000000;

export const mintDSC = async (signer, amountToMint) => {
  try {
    // create a new instance of the token contract
    const dsce = new Contract(ADDRESS.DSCENGIN, DSC_ENGIN, signer);

    // Because CD tokens are an ERC20, user would need to give the contract allowance
    // to take the required number CD tokens out of his contract
    amountToMint = amountToMint * constant;
    let tx = await dsce.mintDsc(amountToMint.toString());
    await tx.wait();
  } catch (err) {
    console.error(err);
  }
};
