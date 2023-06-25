import React, { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { faCopy, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ADDRESS from "../../config/address.json";
import copy from "clipboard-copy";
import { toast } from "react-toastify";
import { ellipseAddress } from "../../utils/utilities";
import { getProviderOrSigner } from "../../utils/getProviderOrSigner";
import { liquidated } from "../../utils/liquidated";
export default function Row({
  address,
  health,
  amountPay,
  walletConnected,
  web3ModalRef,
}) {
  let constant = 100000000;
  const router = useRouter();
  const [isHealth, setIsHealth] = useState(false);

  let submit = useCallback(
    async (event) => {
      try {
        if (!walletConnected) {
          toast.error("Wallet Not Connected ");
        }
        const signer = await getProviderOrSigner(web3ModalRef, true);
        // setMessage("Depositing ... ");
        setIsHealth(true);
        await liquidated(signer, ADDRESS.WETH, address, amountPay);
        toast.success("Transaction Successfully");
        // setMessage("");
        setIsHealth(false);
        // router.reload();
      } catch (error) {
        console.log("error", error);
        toast.error("Transaction have Issue");
        setIsHealth(false);
      }
    },
    [address, health, amountPay]
  );
  return (
    <tr className="border-b  border-gray-200 dark:border-gray-700">
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
      >
        {ellipseAddress(address.toString())}{" "}
        <FontAwesomeIcon
          icon={faCopy}
          onClick={() => {
            copy(address);
            toast.info("Address Copy");
          }}
          className={"text-sm text-colour pr-2  hover:text-sky-600		"}
        />{" "}
      </th>
      <td className="px-6 py-4">{health.slice(0, 5)}</td>
      <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
        {amountPay / constant} DSC
      </td>
      <td className="px-6 py-4  underline fa-fade">
        {!isHealth && (
          <button
            className="text-sky-200 background-transparent font-bold uppercase px-3 py-1 text-ms outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            disabled={isHealth}
            onClick={() => {
              submit();
            }}
          >
            Buy
          </button>
        )}
        {isHealth && (
          <FontAwesomeIcon
            icon={faSpinner}
            className={"text-sm text-colour pr-2 spin fa-spin fa-spin-reverse"}
          />
        )}
      </td>
    </tr>
  );
}
