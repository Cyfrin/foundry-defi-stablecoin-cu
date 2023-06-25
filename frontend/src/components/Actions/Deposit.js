import Select, { components } from "react-select";
import React, { useEffect, useCallback, useState, useRef } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getProviderOrSigner } from "../../utils/getProviderOrSigner";
import { depositCollateral } from "../../utils/depost";
import { healthCheck, balanceLoad } from "../../utils/getDetails";
import ADDRESS from "../../config/address.json"; // import styles from "../styles/Home.module.css";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

export default function Deposit({
  walletConnected,
  web3ModalRef,
  totalCollateral,
  totalDSC,
}) {
  const router = useRouter();
  const [currenct, setCurrency] = useState(ADDRESS.WETH);
  const [isMint, setIsMint] = useState(false);
  const [deposit, setDeposit] = useState(0);
  const [mint, setMint] = useState(0);
  const [balance, setBalance] = useState(0);
  const [balanceUsd, setBalanceUsd] = useState(0);
  const [isHealth, setIsHealth] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isLoaded = false;
    let fatch = async () => {
      let response = await balanceLoad(currenct, web3ModalRef);

      setBalance(response.balance);
      setBalanceUsd(response.balanceUSD);
    };
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    // console.log("walletConnected  = = 1", walletConnected);
    if (walletConnected && balance == 0 && !isLoaded) {
      isLoaded = true;
      fatch();
    }
  }, [walletConnected]);
  // waller action
  const validationSchema = Yup.object().shape({
    // image: Yup.string().required("NFG image is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const options = [
    { value: ADDRESS.WETH, label: "WETH", icon: "weth.png" },
    { value: ADDRESS.WBTC, label: "WBTC", icon: "wbtc.png" },
  ];

  const { Option } = components;
  const IconOption = (props) => (
    <Option {...props} className="">
      <div className="grid grid-cols-2    ">
        <div>
          <span className="text-sm">{props.data.label}</span>
        </div>
        <div className="">
          <img
            src={"/" + props.data.icon}
            style={{ width: 20 }}
            alt={props.data.label}
          />
        </div>
      </div>
    </Option>
  );
  let submit = useCallback(async () => {
    try {
      const signer = await getProviderOrSigner(web3ModalRef, true);
      setMessage("Depositing ... ");
      setIsHealth(true);
      await depositCollateral(signer, currenct, deposit, mint, isMint);
      toast.success("Transaction Successfully");
      setMessage("");
      setIsHealth(false);
      router.reload();
    } catch (error) {
      toast.error("Transaction have Issue");
      setIsHealth(false);
    }
  }, [deposit, mint]);
  return (
    <form onSubmit={handleSubmit(submit)}>
      <div className="pt-6    ">
        <Select
          className="  customBorder w-6/12 currency-dropdown	 text-colour rounded text-md  "
          defaultValue={options[0]}
          options={options}
          components={{ Option: IconOption }}
          isSearchable={false}
          onChange={async (e) => {
            setCurrency(e.value);
            let response = await balanceLoad(e.value, web3ModalRef);

            setBalance(response.balance);
            setBalanceUsd(response.balanceUSD);
          }}
        />
        <input
          type="checkbox"
          className="  customBorder w-1/12 pt-2 mt-2 	 text-colour rounded text-md  "
          defaultValue=""
          onChange={(e) => {
            // console.log("check", e.currentTarget.checked);
            setIsHealth(e.currentTarget.checked);
            setIsMint(e.currentTarget.checked);
            //   props.setStartDate(e.currentTarget.value);
          }}
        />
        <label htmlFor="vehicle1" className="text-colour mt-2 mb-4">
          {" "}
          is Mint{" "}
        </label>
        <br />
        <label htmlFor="vehicle1" className=" w-full   text-colour">
          {" "}
          Amount Deposit{" "}
        </label>
        <br />
        <input
          type="number"
          className="  customBorder w-6/12 p-2 mt-2 float-left text-colour rounded text-md  "
          defaultValue=""
          min={0}
          // value={deposit}
          max={balance}
          onChange={(e) => {
            // props.setStartDate(e.currentTarget.value);
            if (e.currentTarget.value == "") {
              setDeposit(0);
              return;
            }
            if (parseFloat(e.currentTarget.value) <= parseFloat(balance)) {
              // console.log("e.currentTarget.value", e.currentTarget.value);

              setDeposit(e.currentTarget.value);
            } else {
              e.currentTarget.value = balance;
            }
          }}
        />
        <label
          htmlFor="vehicle1"
          className=" w-full  mt-2  float-left text-colour"
        >
          {" "}
          Balance ({balance}/{balanceUsd} $){" "}
        </label>
        {isMint && (
          <>
            {" "}
            <label
              htmlFor="vehicle1"
              className=" w-full  p-2 mt-2  float-left text-colour"
            >
              {" "}
              Amount Mint{" "}
            </label>
            <input
              type="number"
              className="  customBorder w-6/12 p-2 mt-2 float-left	 text-colour rounded text-md  "
              defaultValue=""
              min={0}
              // value={mint}
              disabled={deposit == 0 || deposit == ""}
              onChange={async (e) => {
                // console.log("e.currentTarget.value", e.currentTarget.value);
                setMint(e.currentTarget.value);

                let response;

                response = await healthCheck(
                  web3ModalRef,
                  currenct,
                  totalDSC,
                  totalCollateral,
                  deposit,
                  e.currentTarget.value,
                  false
                );
                if (response) {
                  setIsHealth(response.isHealthy);
                  setMessage(response.message);
                }
              }}
            />
          </>
        )}
        {message && (
          <div className="w-full pt-2 float-left   ">
            <span className="text-colour">
              {message} {}
              {message.indexOf("Depositing") != -1 && (
                <FontAwesomeIcon
                  icon={faSpinner}
                  className={"text-sm text-colour pr-2 fa-spin"}
                />
              )}
            </span>
          </div>
        )}
        <div className="w-full float-left   ">
          <button
            className="  relative  center  customBorder action-button w-6/12 p-2 mt-2 float-left	 text-colour rounded text-md  "
            disabled={isHealth}
            type="submit"
            onClick={() => {}}
          >
            {/* {spinnerProcess && (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              )}{" "} */}
            Deposit
          </button>
        </div>
      </div>
    </form>
  );
}
