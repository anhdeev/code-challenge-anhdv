/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { Field } from "formik";
import styles from "./TokenCard.module.css";
import { useTokenPrice } from "@/hooks/useTokenPrice";
import { Token } from "@/hooks/useTokens";
import { useWeb3Context } from "@/contexts/Web3Context";
import { useSwapContext } from "@/contexts/SwapContext";
import { formatMoney } from "@/lib/utils";
import { ActionStage } from "@/components/swap/ActionButton";

interface AmountInputProps {
  token: Token | undefined | null; // Name of the Field in Formik
  setAmount: (value: number) => void;
  readonly?: boolean;
  amount?: number | null;
}

const AmountInput: React.FC<AmountInputProps> = ({
  token,
  setAmount,
  readonly,
  amount,
}) => {
  const {
    loading: priceLoading,
    fetchPrices,
    getUsdEstimate,
  } = useTokenPrice();
  const { getFeeAndRate, loading, rate, balances } = useWeb3Context();
  const { state, setToAmount, setStage, stage } = useSwapContext();

  useEffect(() => {
    if (token) fetchPrices([token.id.toLowerCase()]);
  }, [fetchPrices, token, token?.name]);

  const fiatValue = token
    ? getUsdEstimate(token.id.toLowerCase(), amount || 0)
    : 0;

  return (
    <div className="flex flex-col items-end mt-2">
      {/* Amount Input */}
      {readonly || !token ? (
        loading || priceLoading ? (
          // Skeleton loader for amount input
          <div className="w-full h-10 bg-gray-300 animate-pulse rounded-lg" />
        ) : (
          <p className={styles.amount}>{amount}</p>
        )
      ) : (
        <Field name={token.id}>
          {({ field, form }: any) => (
            <input
              {...field}
              type="text"
              placeholder="Enter amount"
              className="w-full p-2 text-lg font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-right"
              maxLength={32}
              value={field.value || amount || ""}
              onChange={(e) => {
                if (!e.target.value) {
                  setAmount(0);
                }
                form.setFieldValue(token.id, e.target.value);
              }}
              onBlur={(e) => {
                field.onBlur(e);
                // Format value on blur
                const formattedValue = formatMoney(e.target.value);
                // Update Formik state with formatted value
                form.setFieldValue(token.id, formattedValue);
                const value = Number(formattedValue.replace(/,/g, ""));
                setAmount(value);
                setToAmount(value * rate);
                getFeeAndRate(
                  state.fromToken || "",
                  state.toToken || "",
                  state.fromNetwork || ""
                );

                // Check if insufficent balance
                const balance =
                  balances?.find((b) => b.token === state.fromToken)?.amount ||
                  0;

                if (stage !== ActionStage.CONNECT)
                  if (value > balance) {
                    setStage(ActionStage.INSUFFICIENT);
                  } else {
                    setStage(ActionStage.SELECT);
                  }
              }}
            />
          )}
        </Field>
      )}

      {/* Fiat Value Display */}
      {loading || priceLoading ? (
        // Skeleton loader for fiat value
        <div className="w-20 h-4 bg-gray-300 animate-pulse rounded-md mt-2" />
      ) : (
        <p className="text-gray-400">{fiatValue}</p>
      )}
    </div>
  );
};

export default AmountInput;
