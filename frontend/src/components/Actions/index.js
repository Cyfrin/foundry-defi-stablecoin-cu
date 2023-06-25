import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  faMoneyBillTrendUp,
  faBurn,
  faMoneyBillTransfer,
  faCoins,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Deposit from "./Deposit";
import Mint from "./Mint";
import Redeem from "./Redeem";
import Burn from "./Burn";
export default function Action({
  walletConnected,
  web3ModalRef,
  totalCollateral,
  totalDSC,
}) {
  const router = useRouter();
  const [selected, setSelected] = useState("Deposit");

  return (
    <div>
      <ul className="hidden customBorder  text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
        <li className="w-full ">
          <button
            className={
              " w-full p-4 bg-white font-bold text-bold  focus:ring-4 focus:ring-blue-300 focus:outline-none" +
              " " +
              (selected === "Deposit"
                ? " active rounded-l-lg bg-gray-100 text-white dark:bg-gray-700 dark:text-white active"
                : " hover:bg-gray-50 hover:text-gray-700  dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700")
            }
            onClick={() => {
              setSelected("Deposit");
            }}
          >
            <FontAwesomeIcon
              icon={faMoneyBillTrendUp}
              className={
                "text-sm text-colour pr-2 " +
                (selected === "Deposit" ? " fa-fade" : "")
              }
            />
            Deposit
          </button>
        </li>
        <li className="w-full">
          <button
            onClick={() => {
              setSelected("Mint");
            }}
            className={
              " w-full p-4 bg-white font-bold text-bold  focus:ring-4 focus:ring-blue-300 focus:outline-none" +
              " " +
              (selected === "Mint"
                ? " active bg-gray-100 text-white dark:bg-gray-700 dark:text-white active"
                : " hover:bg-gray-50 hover:text-gray-700  dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700")
            }
          >
            <FontAwesomeIcon
              icon={faCoins}
              className={
                "text-sm text-colour pr-2 " +
                (selected === "Mint" ? " fa-fade" : "")
              }
            />
            Mint Coin
          </button>
        </li>
        <li className="w-full">
          <button
            onClick={() => {
              setSelected("Redeem");
            }}
            className={
              " w-full p-4 bg-white font-bold text-bold  focus:ring-4 focus:ring-blue-300 focus:outline-none" +
              " " +
              (selected === "Redeem"
                ? " active bg-gray-100 text-white dark:bg-gray-700 dark:text-white active"
                : " hover:bg-gray-50 hover:text-gray-700  dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700")
            }
          >
            <FontAwesomeIcon
              icon={faMoneyBillTransfer}
              className={
                "text-sm text-colour pr-2 " +
                (selected === "Redeem" ? " fa-fade" : "")
              }
            />
            Redeem
          </button>
        </li>
        <li className="w-full">
          <button
            onClick={() => {
              setSelected("Burn");
            }}
            className={
              " w-full p-4 bg-white font-bold text-bold  focus:ring-4 focus:ring-blue-300 focus:outline-none" +
              " " +
              (selected === "Burn"
                ? "rounded-r-lg active bg-gray-100 text-white dark:bg-gray-700 dark:text-white active"
                : " hover:bg-gray-50 hover:text-gray-700  dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700")
            }
          >
            <FontAwesomeIcon
              icon={faBurn}
              className={
                "text-sm text-colour pr-2 " +
                (selected === "Burn" ? " fa-fade" : "")
              }
            />
            Burn
          </button>
        </li>
      </ul>
      {selected == "Deposit" && (
        <Deposit
          walletConnected={walletConnected}
          web3ModalRef={web3ModalRef}
          totalCollateral={totalCollateral}
          totalDSC={totalDSC}
        />
      )}
      {selected == "Mint" && (
        <Mint
          walletConnected={walletConnected}
          web3ModalRef={web3ModalRef}
          totalCollateral={totalCollateral}
          totalDSC={totalDSC}
        />
      )}
      {selected == "Redeem" && (
        <Redeem
          walletConnected={walletConnected}
          web3ModalRef={web3ModalRef}
          totalCollateral={totalCollateral}
          totalDSC={totalDSC}
        />
      )}
      {selected == "Burn" && (
        <Burn
          walletConnected={walletConnected}
          web3ModalRef={web3ModalRef}
          totalCollateral={totalCollateral}
          totalDSC={totalDSC}
        />
      )}
    </div>
  );
}
