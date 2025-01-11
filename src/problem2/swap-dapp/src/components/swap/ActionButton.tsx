import React, { Fragment, useState } from "react";
import {
  FaWallet,
  FaCheck,
  FaPencil,
  FaTriangleExclamation,
} from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // Spinner for loading
import { useSwapContext } from "@/contexts/SwapContext";
import ApproveAndSwap from "@/components/swap/ApproveAndSwap";
import { useWeb3Context } from "@/contexts/Web3Context";
import { useTokens } from "@/hooks/useTokens";
import { NetworkIDs } from "@/constants";

interface ActionButtonProps {
  onClick: () => void; // Function to handle button click
  disabled?: boolean; // Optional: Disable the button
  stage: ActionStage; // Current action stage
}

export enum ActionStage {
  CONNECT = "Connect Wallet",
  SELECT = "Select Token",
  INSUFFICIENT = "Insufficient Balance",
  CONFIRM = "Confirm",
  LOADING = "Loading...",
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  disabled = false,
  stage,
}) => {
  const { state } = useSwapContext();
  const { rate, fee, getBalances } = useWeb3Context();
  const [open, setOpen] = useState(false); // Boolean state to control dialog visibility
  const { getTokenById } = useTokens();

  return (
    <Fragment>
      <button
        onClick={() => {
          if (stage === ActionStage.CONFIRM) {
            setOpen(true);
          }
          onClick();
        }}
        disabled={disabled || stage === ActionStage.LOADING}
        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-md font-medium w-full border ${
          stage === ActionStage.INSUFFICIENT
            ? "border-red-500 bg-red-100 text-red-500"
            : "border-secondary"
        } ${
          stage === ActionStage.LOADING
            ? "cursor-wait bg-gray-100 text-gray-500"
            : "cursor-pointer"
        }`}
      >
        {stage === ActionStage.CONNECT && <FaWallet size={20} />}
        {stage === ActionStage.SELECT && <FaPencil size={20} />}
        {stage === ActionStage.CONFIRM && <FaCheck size={20} />}
        {stage === ActionStage.INSUFFICIENT && (
          <FaTriangleExclamation size={20} />
        )}
        {stage === ActionStage.LOADING && (
          <AiOutlineLoading3Quarters className="animate-spin" size={20} />
        )}
        <span>{stage}</span>
      </button>
      <ApproveAndSwap
        fromToken={{
          name: state.fromToken || "",
          amount: `${state.fromAmount}`,
          icon: getTokenById(state.fromToken || "")?.icon || "",
        }}
        toToken={{
          name: state.toToken || "",
          amount: `${parseFloat(((state.fromAmount || 0) * rate).toFixed(6))}`,
          icon: getTokenById(state.toToken || "")?.icon || "",
        }}
        fee={`${fee}`}
        networkCost="Free!"
        onSwap={async () => {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          setOpen(false);
          getBalances(NetworkIDs.Ethereum); // TODO: passing network from props
        }}
        open={open}
        setOpen={setOpen}
      />
    </Fragment>
  );
};

export default ActionButton;
