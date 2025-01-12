"use client";

import { ReactNode, useEffect } from "react";
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
import { useWeb3Context } from "@/contexts/Web3Context";
import { FiRefreshCw } from "react-icons/fi";

const SwapForm = ({ children }: { children: ReactNode }) => {
  const { state } = useSwapContext();
  const initialValues = state;

  const handleSubmit = (values: unknown) => {
    console.log("Form submitted with values:", values);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {() => <Form className="p-2">{children}</Form>}
    </Formik>
  );
};

export default function SwapPage() {
  const [rotated, setRotated] = useState(false);
  const { state, swap, stage, setStage, setFromNetwork } = useSwapContext();
  const { fee, rate, getFeeAndRate, getBalances, loading, connect } =
    useWeb3Context();

  const handleSwapClick = () => {
    setRotated((prev) => !prev);
    swap();
  };
  const readyToSwap = !!(state.fromToken && state.toToken && state.fromAmount);
  useEffect(() => {
    if (readyToSwap && stage === ActionStage.SELECT) {
      setStage(ActionStage.CONFIRM);
    }
  }, [
    state.fromAmount,
    state.fromToken,
    state.toToken,
    stage,
    readyToSwap,
    setStage,
  ]);

  useEffect(() => {
    const retrieveFeeAndRate = async (
      fromToken: string,
      toToken: string,
      fromNetwork: string
    ) => {
      await getFeeAndRate(fromToken, toToken, fromNetwork);
    };
    if (state.fromToken && state.toToken && state.fromNetwork)
      retrieveFeeAndRate(state.fromToken, state.toToken, state.fromNetwork);
  }, [
    readyToSwap,
    state.fromToken,
    state.toToken,
    state.fromAmount,
    getFeeAndRate,
    state.fromNetwork,
  ]);

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
          <CardHeader className="py-4 flex flex-row items-center justify-between px-8">
            <div>
              <CardTitle>Swap Tokens</CardTitle>
              <CardDescription>
                Exchange tokens quickly and securely.
              </CardDescription>
            </div>
            <button
              onClick={() => {
                getFeeAndRate(
                  state.fromToken || "",
                  state.toToken || "",
                  state.fromNetwork || ""
                );
                if (stage !== ActionStage.CONNECT)
                  getBalances(state.fromNetwork || "");
              }}
              className="text-gray-500 hover:text-gray-800 transition-colors"
              aria-label="Refresh"
            >
              <FiRefreshCw className="w-5 h-5" />
            </button>
          </CardHeader>

          <CardContent className="space-y-4 relative">
            {/* Token 1 */}
            <SwapForm>
              <TokenCard
                title="You pay"
                tokenSymbol={state.fromToken || ""}
                network={state.fromNetwork || ""}
                type="source"
                amount={state.fromAmount || 0}
              />

              {/* Swap Icon */}
              <div
                className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 800 p-3 rounded-full cursor-pointer bg-secondary"
                onClick={handleSwapClick}
              >
                <FaExchangeAlt
                  className={`text-xl transform transition-transform duration-300 ${
                    rotated ? "rotate-[270deg]" : "rotate-90"
                  }`}
                />
              </div>

              {/* Token 2 */}
              <TokenCard
                title="You receive"
                type="target"
                rate={rate}
                readonly
              />
              {loading ? (
                <div className="w-full h-8 bg-gray-300 animate-pulse rounded-md my-4" />
              ) : (
                <ExchangeFeeAndRate
                  rate={rate}
                  slippageTolerance="0.5%" // TODO: add slippage tolerance to config
                  networkCost={0}
                  swapFee={fee}
                />
              )}
              <ActionButton
                onClick={() => {
                  if (stage === ActionStage.CONNECT) {
                    if (!state.fromNetwork) {
                      alert("Select a network to connect to your wallet.");
                      return;
                    }
                    setStage(ActionStage.LOADING);

                    setTimeout(() => {
                      alert("Connect to your wallet...");
                      setStage(
                        readyToSwap ? ActionStage.CONFIRM : ActionStage.SELECT
                      );
                      connect();
                      getBalances(state.fromNetwork || "");
                      setFromNetwork(state.fromNetwork || "");
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
