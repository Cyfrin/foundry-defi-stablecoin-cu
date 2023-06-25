import Select, { components } from "react-select";
import React, { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/router";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ADDRESS from "../../config/address.json";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { healthCheck, checkCollateral } from "../../utils/getDetails";
import { redeemCurrencyCollateral } from "../../utils/redeem";
import { getProviderOrSigner } from "../../utils/getProviderOrSigner";

export default function Redeem({
  walletConnected,
  web3ModalRef,
  totalCollateral,
  totalDSC,
}) {
  const router = useRouter();
  const [currenct, setCurrency] = useState(ADDRESS.WETH);
  const [isBurn, setIsBurn] = useState(false);
  const [redeem, setRedeem] = useState(0);
  const [burn, setBurn] = useState(0);
  const [redeemCollateral, setRedeemCollateral] = useState(0);
  const [redeemCollateralUSD, setRedeemCollateralUSD] = useState(0);
  const constant = 100000000;

  const [isHealth, setIsHealth] = useState(false);
  const [message, setMessage] = useState("");

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

  const updateCollateral = async (currenct) => {
    let response = await checkCollateral(currenct, web3ModalRef);
    setRedeemCollateral(response.collateral);
    setRedeemCollateralUSD(response.collateralUSD);
    if (response.collateral == 0) {
      setIsHealth(true);
      setMessage("No Collateral For Redeem");
    }
  };
  useEffect(() => {
    let isLoaded = false;
    let fatch = async () => {
      updateCollateral(currenct);
    };
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    // console.log("walletConnected  = = 1", walletConnected);
    if (walletConnected && redeemCollateral == 0 && !isLoaded) {
      isLoaded = true;
      fatch();
    }
  }, [walletConnected]);
  let submit = useCallback(
    async (event) => {
      try {
        if (!walletConnected) {
          toast.error("Wallet Not Connected ");
        }
        const signer = await getProviderOrSigner(web3ModalRef, true);
        setMessage("Depositing ... ");
        setIsHealth(true);
        await redeemCurrencyCollateral(signer, currenct, redeem, burn, isBurn);
        toast.success("Transaction Successfully");
        setMessage("");
        setIsHealth(false);
        router.reload();
      } catch (error) {
        console.log("error", error);
        toast.error("Transaction have Issue");
        setIsHealth(false);
      }
    },
    [redeem, burn, isBurn]
  );
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
            updateCollateral(e.value);
          }}
        />
        <input
          type="checkbox"
          className="  customBorder w-1/12 pt-2 mt-2 	 text-colour rounded text-md  "
          defaultValue=""
          onChange={(e) => {
            setIsBurn(e.currentTarget.checked);
            //   props.setStartDate(e.currentTarget.value);
          }}
        />
        <label htmlFor="vehicle1" className="text-colour mt-2 mb-4">
          {" "}
          Want to Burn Some Coin{" "}
        </label>
        <br />
        <label htmlFor="vehicle1" className=" w-full   text-colour">
          {" "}
          Amount Redeem{" "}
        </label>
        <br />
        <input
          type="number"
          className="  customBorder w-6/12 p-2 mt-2 float-left text-colour rounded text-md  "
          defaultValue=""
          // min={0.1}
          min={0}
          step={0.1}
          max={redeemCollateral}
          disabled={redeemCollateral == 0}
          onChange={(e) => {
            //   props.setStartDate(e.currentTarget.value);
            setRedeem(e.currentTarget.value ? e.currentTarget.value : 0);
          }}
        />
        <label
          htmlFor="vehicle1"
          className=" w-full  mt-2  float-left text-colour"
        >
          {" "}
          Collateral ({redeemCollateral} / {redeemCollateralUSD} $){" "}
        </label>
        {isBurn && (
          <>
            {" "}
            <label
              htmlFor="vehicle1"
              className=" w-full  p-2 mt-2  float-left text-colour"
            >
              {" "}
              Burn Coin{" "}
            </label>
            <input
              type="number"
              className="  customBorder w-6/12 p-2 mt-2 float-left	 text-colour rounded text-md  "
              defaultValue=""
              max={totalDSC / constant}
              min={0}
              disabled={redeem == 0 || totalDSC == 0}
              onChange={async (e) => {
                if (
                  parseFloat(e.currentTarget.value) >
                  parseFloat(totalDSC / constant)
                ) {
                  e.currentTarget.value = totalDSC / constant;
                }
                setBurn(e.currentTarget.value ? e.currentTarget.value : 0);
                let response = await healthCheck(
                  web3ModalRef,
                  currenct,
                  totalDSC,
                  totalCollateral,
                  redeem,
                  e.currentTarget.value ? e.currentTarget.value : 0,
                  true
                );
                if (response) {
                  setIsHealth(response.isHealthy);
                  setMessage(
                    response.isHealthy
                      ? "unhealthy because not enough collateral"
                      : ""
                  );
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
            type="submit"
            disabled={isHealth}
          >
            {/* {spinnerProcess && (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              )}{" "} */}
            Redeem
          </button>
        </div>
      </div>
    </form>
  );
}
