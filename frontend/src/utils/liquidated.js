import { Contract, utils } from "ethers";
import { DSC_ENGIN, ERC20 } from "../config/abi";
import ADDRESS from "./../config/address.json";

/**
 *
 *
 */
export const liquidated = async (
  signer,
  tokenCollateralAddress,
  defaultUser,
  amountDeposit
) => {
  try {
    console.log(
      tokenCollateralAddress,
      defaultUser,
      "amountDeposit",
      ADDRESS.DSCENGIN
    );
    // create a new instance of the token contract
    const dsce = new Contract(ADDRESS.DSCENGIN, DSC_ENGIN, signer);
    const dsc = new Contract(ADDRESS.DSC, ERC20, signer);
    let tx = await dsc.approve(ADDRESS.DSCENGIN, amountDeposit.toString());
    await tx.wait();

    tx = await dsce.liquidate(
      tokenCollateralAddress,
      defaultUser,
      amountDeposit
    );
    await tx.wait();
  } catch (err) {
    console.error(err);
  }
};
