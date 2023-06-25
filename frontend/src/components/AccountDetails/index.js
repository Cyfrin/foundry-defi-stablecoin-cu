import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { utils } from "ethers";

export default function Account({
  totalCollateral,
  collateralETH,
  collateralBTC,
  totalDSC,
  health,
  collateralETHUSD,
  collateralBTCUSD,
} = props) {
  // console.log("totalDSC", totalCollateral);
  const router = useRouter();
  const [selected, setSelected] = useState("Deposit");
  let constant = 100000000;
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <tbody>
          <tr className="bg-white w-full dark:bg-gray-800">
            <th
              scope="row"
              className="px-6 w-6/12	 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              Total WETH Collateral :{" "}
              {collateralETH && collateralETH != 0
                ? collateralETH / constant
                : 0}{" "}
              / {collateralETHUSD} $
            </th>
            <td className="px-6 w-6/12	 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              Total WBTC Collateral :{" "}
              {collateralBTC && collateralBTC != 0
                ? collateralBTC / constant
                : 0}{" "}
              / {collateralBTCUSD} $
            </td>
          </tr>
          <tr className="bg-white w-full dark:bg-gray-800">
            <th
              scope="row"
              className="px-6 w-6/12	 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              Total Collateral $ :{" "}
              {totalCollateral && totalCollateral != 0
                ? (totalCollateral / 100000000).toString()
                : 0}{" "}
              $
            </th>
            <td className="px-6 w-6/12	 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              Total DSC Minted :{" "}
              {totalDSC ? (totalDSC.toString() / 100000000).toString() : 0}
            </td>
          </tr>
          <tr className="bg-white w-full dark:bg-gray-800">
            <th
              scope="row"
              className="px-6 w-6/12	 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              Health : {totalDSC == 0 ? 0 : health}
            </th>
            {/* <td className="px-6 w-6/12	 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              Total Coin Can Minted : 100
            </td> */}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
