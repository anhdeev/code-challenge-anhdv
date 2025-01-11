import SwapBox from "@/components/swap/SwapBox";
import { SwapProvider } from "@/contexts/SwapContext";

export default function SwapPage() {
  return (
    <div className="pt-8">
      <SwapProvider>
        <SwapBox />
      </SwapProvider>
    </div>
  );
}
