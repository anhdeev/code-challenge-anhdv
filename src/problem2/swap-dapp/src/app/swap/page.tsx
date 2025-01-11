import SwapBox from "@/components/swap/SwapBox";
import { SwapProvider } from "@/contexts/SwapContext";
import { Web3ActionsProvider } from "@/contexts/Web3Context";

export default function SwapPage() {
  return (
    <div className="pt-8">
      <Web3ActionsProvider>
        <SwapProvider>
          <SwapBox />
        </SwapProvider>
      </Web3ActionsProvider>
    </div>
  );
}
