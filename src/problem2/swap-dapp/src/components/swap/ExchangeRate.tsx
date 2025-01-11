import React from "react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ExchangeFeeAndRateProps {
  rate: number; // Example: "1 ETH = ~$3,367.2"
  slippageTolerance: string; // Example: "0.5%"
  networkCost: number; // Example: "Free"
  swapFee: number; // Example: "Free"
  tokenIcon: string; // Icon for the token (e.g., Ethereum)
  tokenName: string; // Name of the token (e.g., "ETH")
}

const ExchangeFeeAndRate: React.FC<ExchangeFeeAndRateProps> = ({
  rate,
  slippageTolerance,
  networkCost,
  swapFee,
  tokenIcon,
  tokenName,
}) => {
  return (
    <Accordion type="single" collapsible>
      {/* Accordion Item */}
      <AccordionItem value="exchange-details">
        {/* Trigger */}
        <AccordionTrigger>
          <div className="flex items-center justify-between gap-2 w-full px-2">
            <div className="RowItem ">
              <Image src={tokenIcon} alt={tokenName} width={24} height={24} />
              <p className="text-sm">{rate}</p>
            </div>
            <p className="font-semibold text-sm">{networkCost}</p>
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
              <span className="font-medium">{"0"}</span>
            </div>

            {/* Network Fee */}
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Network Cost</span>
              <span className="font-medium">{networkCost}</span>
            </div>

            {/* Swap Fee */}
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Swap Fee</span>
              <span className="font-medium">{swapFee}</span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ExchangeFeeAndRate;
