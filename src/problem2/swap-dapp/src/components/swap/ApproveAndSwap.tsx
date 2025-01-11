import React, { useState } from "react";
import Image from "next/image";
import { FaChevronDown } from "react-icons/fa";
import { FiInfo } from "react-icons/fi";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaSpinner } from "react-icons/fa6";

interface ApproveAndSwapProps {
  fromToken: { name: string; amount: string; icon: string };
  toToken: { name: string; amount: string; icon: string };
  fee: string;
  networkCost: string;
  onSwap: () => Promise<void>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ApproveAndSwap: React.FC<ApproveAndSwapProps> = ({
  fromToken,
  toToken,
  fee,
  networkCost,
  onSwap,
  open,
  setOpen,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      onSwap().then(() => setIsLoading(false));
    } catch (error) {
      console.error("Error during swap:", error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Dialog Content */}
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Swap Confirmation</DialogTitle>
        </DialogHeader>

        <div className="p-4 rounded-lg space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <p className="text-gray-400">{"You're swapping"}</p>
            <button className="text-gray-400 hover:text-white">×</button>
          </div>

          {/* From Token */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-semibold">
                {fromToken.amount} {fromToken.name}
              </p>
              <p className="text-gray-400">n/a</p>
            </div>
            <Image
              src={fromToken.icon}
              alt={fromToken.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>

          {/* Swap Arrow */}
          <div className="flex justify-center">
            <FaChevronDown className="text-gray-400" />
          </div>

          {/* To Token */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-semibold">
                {toToken.amount} {toToken.name}
              </p>
              <p className="text-gray-400">n/a</p>
            </div>
            <Image
              src={toToken.icon}
              alt={toToken.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>

          {/* Show More */}
          <div className="flex items-center justify-between text-gray-400">
            <p>Show more</p>
            <FaChevronDown />
          </div>

          {/* Fee and Network Cost */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <p>Swap Fee</p>
                <FiInfo className="text-gray-400" />
              </div>
              <p className="text-green-600">{networkCost}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <p>Network cost</p>
                <FiInfo className="text-gray-400" />
              </div>
              <div className="flex items-center gap-1">
                {/* TODO: update icon depends on the selected network */}
                <Image
                  src="/assets/tokens/eth.svg"
                  alt="ETH"
                  width={16}
                  height={16}
                />
                <p>${fee}</p>
              </div>
            </div>
          </div>

          {/* Approve and Swap Button */}
          <button
            onClick={handleClick}
            className="w-full py-3 font-medium rounded-lg bg-secondary"
          >
            {isLoading ? (
              <div className="RowItem px-6">
                <span>Processing...</span>
                <FaSpinner className="animate-spin" />
              </div>
            ) : (
              <span>Approve and swap</span>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApproveAndSwap;
