"use client";

import { ReactNode, useEffect, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FaExchangeAlt } from "react-icons/fa";
import React, { useState } from "react";
import TokenCard from "@/components/swap/TokenCard/TokenCard";
import { useSwapContext } from "@/contexts/SwapContext";
import ActionButton, { ActionStage } from "@/components/swap/ActionButton";
import ExchangeFeeAndRate from "@/components/swap/ExchangeRate";
import { Form, Formik } from "formik";

const SwapForm = ({ children }: { children: ReactNode }) => {
  const initialValues = {
    fromToken: "ETH",
    fromNetwork: "ethereum",
    toToken: "",
    toNetwork: "",
    fromAmount: "",
    toAmount: "",
  };

  const handleSubmit = (values: unknown) => {
    console.log("Form submitted with values:", values);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {() => <Form className="p-4 space-y-4">{children}</Form>}
    </Formik>
  );
};

export default function SwapPage() {
  const [rotated, setRotated] = useState(false);
  const [stage, setStage] = useState(ActionStage.CONNECT);
  const { state } = useSwapContext();

  const handleSwapClick = () => {
    setRotated((prev) => !prev);
  };
  const readyToSwap = !!(state.fromToken && state.toToken && state.fromAmount);
  useEffect(() => {
    if (readyToSwap && stage === ActionStage.SELECT) {
      setStage(ActionStage.CONFIRM);
    }
  }, [state.fromAmount, state.fromToken, state.toToken, stage, readyToSwap]);

  return (
    <Tabs defaultValue="swap" className="max-w-md md:max-w-lg mx-auto">
      {/* Tabs Header */}
      <TabsList className="w-full">
        <TabsTrigger value="swap" className="w-1/2">
          Swap
        </TabsTrigger>
        <TabsTrigger value="limit" className="w-1/2">
          Limit
        </TabsTrigger>
      </TabsList>

      {/* Tabs Content */}
      <TabsContent value="swap">
        <Card className="space-y-4">
          <CardHeader className="py-4">
            <CardTitle>Swap Tokens</CardTitle>
            <CardDescription>
              Exchange tokens quickly and securely.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 relative">
            {/* Token 1 */}
            <SwapForm>
              <TokenCard
                title="You pay"
                tokenName="ETH"
                tokenSymbol="Ether"
                network="Ethereum"
                fiatValue="~$3,302.55"
                tokenIcon="https://cryptologos.cc/logos/ethereum-eth-logo.png"
                type="source"
              />

              {/* Swap Icon */}
              <div
                className="absolute left-1/2 transform -translate-x-1/2 -translate-y-2/3 800 p-3 rounded-full cursor-pointer bg-secondary"
                onClick={handleSwapClick}
              >
                <FaExchangeAlt
                  className={`text-xl transform transition-transform duration-300 ${
                    rotated ? "rotate-[270deg]" : "rotate-90"
                  }`}
                />
              </div>

              {/* Token 2 */}
              <TokenCard title="You receive" type="target" readonly />
              <ExchangeFeeAndRate
                rate="1 ETH = ~$3,367.2"
                slippageTolerance="0.5%"
                minimumReceive="207.247228"
                networkCost="Free"
                swapFee="$3.5"
                tokenIcon="https://cryptologos.cc/logos/ethereum-eth-logo.png"
                tokenName="ETH"
              />
              <ActionButton
                onClick={() => {
                  if (stage === ActionStage.CONNECT) {
                    setStage(ActionStage.LOADING);

                    setTimeout(() => {
                      alert("Connect to your wallet...");
                      setStage(
                        readyToSwap ? ActionStage.CONFIRM : ActionStage.SELECT
                      );
                    }, 0);
                  }
                }}
                stage={stage}
              />
            </SwapForm>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="limit">
        <Card className="p-4 mt-4">
          <CardHeader>
            <CardTitle>Limit Order</CardTitle>
            <CardDescription>
              Set a limit price for token swaps.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-gray-500">
              Limit order functionality coming soon...
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
