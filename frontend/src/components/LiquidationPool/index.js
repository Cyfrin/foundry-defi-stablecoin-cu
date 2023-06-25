import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import {
  faCartPlus,
  faArrowUpRightDots,
  faAddressCard,
  faWaveSquare,
  faCoins,
} from "@fortawesome/free-solid-svg-icons";
import { useApolloClient } from "@apollo/client";
import ADDRESS from "../../config/address.json"; // import styles from "../styles/Home.module.css";
import { getProviderOrSigner } from "../../utils/getProviderOrSigner";
import { healthCheck } from "../../utils/getDetails";

import Row from "./row";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GET_ALL_DEPOSIT_ACCOUNTS } from "../../utils/subgrapQueries";
import { init } from "../../utils/getDetails";
export default function LiquidationPool({ walletConnected, web3ModalRef }) {
  const router = useRouter();
  let constant = 100000000;

  const [depositAccount, setDepositAccount] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRequested, setIsRequested] = useState(false);

  const subgraphClient = useApolloClient();

  useEffect(() => {
    // console.log("documentDetails && showModal", documentDetails, showModal, isSigner);
    const fetchData = async () => {
      try {
        try {
          const _depositAccount = await subgraphClient.query({
            query: GET_ALL_DEPOSIT_ACCOUNTS,
          });
          const signer = await getProviderOrSigner(web3ModalRef, true);
          let tempDepositAccount = depositAccount;
          for (
            let index = 0;
            index < _depositAccount.data.collateralDepositeds.length;
            index++
          ) {
            const element = _depositAccount.data.collateralDepositeds[index];
            let response = await init(signer, element.depositor);
            console.log(
              response.ethUSD.toString() * constant,
              "response.ethUSD.toString()",
              response.totalCollateral.toString()
            );
            if (
              response &&
              BigInt(response.totalCollateral.toString()) > 0 &&
              BigInt(response.totalDSC.toString()) > 0
            ) {
              let responseHealthCheck = await healthCheck(
                web3ModalRef,
                "",
                response.totalDSC.toString(),
                response.totalCollateral.toString(),
                0,
                0,
                false
              );
              console.log(
                "responseHealthCheck.isHealthy",
                responseHealthCheck.isHealthy
              );
              if (responseHealthCheck.isHealthy) {
                var newArray = tempDepositAccount.filter(function (el) {
                  return el.address == element.depositor;
                });
                if (newArray.length == 0) {
                  tempDepositAccount.push({
                    address: element.depositor,
                    amountPay: response.totalDSC,
                    health: response.health,
                    responseHealthCheck: responseHealthCheck.isHealthy,
                  });
                }
              }
            }
          }
          setDepositAccount(tempDepositAccount);
          setLoading(true);
        } catch (error) {}
        setUriData(data);
      } catch (error) {}
    };
    // console.log("depositAccount.length", depositAccount.length);
    if (depositAccount.length == 0 && !isRequested) {
      setIsRequested(true);

      fetchData();
    }
  }, []);

  return (
    <div className="p-3">
      <div className="relative customBorder overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm  table-auto overflow-x-scroll text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-colour bg-gray-50 dark:bg-gray-800"
              >
                <FontAwesomeIcon
                  icon={faCoins}
                  className={"text-sm text-colour pr-2 "}
                />{" "}
                Address
              </th>

              <th scope="col" className="px-6 text-colour py-3">
                <FontAwesomeIcon
                  icon={faWaveSquare}
                  className={"text-sm text-colour pr-2 "}
                />{" "}
                Health
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-colour bg-gray-50 dark:bg-gray-800"
              >
                <FontAwesomeIcon
                  icon={faArrowUpRightDots}
                  className={"text-sm text-colour pr-2 "}
                />{" "}
                Amount Pay
              </th>
              <th scope="col" className="px-6 text-colour py-3">
                <FontAwesomeIcon
                  icon={faCartPlus}
                  className={"text-sm text-colour pr-2 "}
                />{" "}
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              depositAccount.map((_depositAccount, index) => (
                <Row
                  key={index}
                  address={_depositAccount.address}
                  health={_depositAccount.health}
                  amountPay={_depositAccount.amountPay}
                  walletConnected={walletConnected}
                  web3ModalRef={web3ModalRef}
                />
              ))}
          </tbody>
        </table>
        {!loading && (
          <h1 className="    center  w-full p-2 mt-2 float-left	 text-colour rounded text-md  ">
            Loading ...
            {/* <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> */}
          </h1>
        )}
      </div>
    </div>
  );
}
