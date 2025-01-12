import React from "react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatMoney } from "@/lib/utils";
import { useSwapContext } from "@/contexts/SwapContext";
import { useTokens } from "@/hooks/useTokens";

interface ExchangeFeeAndRateProps {
  rate: number;
  slippageTolerance: string;
  networkCost: number;
  swapFee: number;
}

const ExchangeFeeAndRate: React.FC<ExchangeFeeAndRateProps> = ({
  rate,
  slippageTolerance,
  networkCost,
  swapFee,
}) => {
  const { state } = useSwapContext();
  const { getTokenById } = useTokens();
  const fromToken = getTokenById(state.fromToken || "");
  const toToken = getTokenById(state.toToken || "");
  if (!rate || !fromToken || !toToken) return null;
  return (
    <Accordion type="single" collapsible>
      {/* Accordion Item */}
      <AccordionItem value="exchange-details">
        {/* Trigger */}
        <AccordionTrigger>
          <div className="flex items-center justify-between gap-2 w-full px-2">
            <div className="RowItem ">
              <Image
                src={fromToken?.icon || ""}
                alt={fromToken?.name || ""}
                width={24}
                height={24}
              />
              <p className="text-sm">{`1 ${fromToken?.id.toUpperCase()} = ~${formatMoney(
                rate
              )} ${toToken?.id.toUpperCase()}`}</p>
            </div>
            <p className="text-sm">{`$${swapFee}`}</p>
          </div>
        </AccordionTrigger>

        {/* Content */}
        <AccordionContent>
          <div className="space-y-4 px-4">
            {/* Slippage Tolerance */}
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Slippage tolerance</span>
              <span className="font-medium">{slippageTolerance}</span>
            </div>

            {/* Minimum Receive */}
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Minimum receive</span>
              <span className="font-medium">
                {formatMoney((state.toAmount || 0) * 0.95) +
                  ` (${state.toToken?.toUpperCase()})`}
              </span>
            </div>

            {/* Network Fee */}
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Network Cost</span>
              <span className="font-medium">{networkCost || "Free"}</span>
            </div>

            {/* Swap Fee */}
            <div className="flex items-center justify-between">
              <span className="text-gray-400">{`Swap Fee`}</span>
              <span className="font-medium">{`$${swapFee}`}</span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ExchangeFeeAndRate;
