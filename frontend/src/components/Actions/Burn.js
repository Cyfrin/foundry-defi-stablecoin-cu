import Select, { components } from "react-select";
import React, { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/router";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { toast } from "react-toastify";

import { getProviderOrSigner } from "../../utils/getProviderOrSigner";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { burnDSC } from "../../utils/burn";
export default function Burn({
  walletConnected,
  web3ModalRef,
  totalCollateral,
  totalDSC,
}) {
  const router = useRouter();
  const [burn, setBurn] = useState(0);
  const [message, setMessage] = useState("");
  const [isHealth, setIsHealth] = useState(false);
  const validationSchema = Yup.object().shape({
    // image: Yup.string().required("NFG image is required"),
  });
  let constant = 100000000;

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  let submit = useCallback(
    async (event) => {
      try {
        if (!walletConnected) {
          toast.error("Wallet Not Connected ");
        }
        const signer = await getProviderOrSigner(web3ModalRef, true);
        setMessage("Burning ... ");
        setIsHealth(true);
        await burnDSC(signer, burn);
        toast.success("Transaction Successfully");
        setMessage("");
        setIsHealth(false);
        router.reload();
      } catch (error) {
        // console.log("error", error);
        toast.error("Transaction have Issue");
        setIsHealth(false);
      }
    },
    [burn]
  );
  return (
    <form onSubmit={handleSubmit(submit)}>
      <div className="pt-6    ">
        <label htmlFor="vehicle1" className=" w-full   text-colour">
          {" "}
          Burn Stable Coint{" "}
        </label>
        <br />
        <input
          type="number"
          className="  customBorder w-6/12 p-2 mt-2 float-left text-colour rounded text-md  "
          defaultValue=""
          min={0}
          step={0.1}
          max={totalDSC / constant}
          onChange={(e) => {
            console.log("e.currentTarget.value", e.currentTarget.value);
            //   props.setStartDate(e.currentTarget.value);
            setBurn(e.currentTarget.value);
          }}
        />
        <label
          htmlFor="vehicle1"
          className=" w-full  mt-2  float-left text-colour"
        >
          {" "}
          Mint Balance ({totalDSC / constant}){" "}
        </label>
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
            Burn
          </button>
        </div>
      </div>
    </form>
  );
}
