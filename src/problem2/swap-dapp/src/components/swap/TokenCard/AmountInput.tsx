/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { Field } from "formik";
import styles from "./TokenCard.module.css";
import { useTokenPrice } from "@/hooks/useTokenPrice";
import { Token } from "@/hooks/useTokens";
import { useWeb3Context } from "@/contexts/Web3Context";
import { useSwapContext } from "@/contexts/SwapContext";

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
  const { loading, fetchPrices, getUsdEstimate } = useTokenPrice();
  const { getFeeAndRate } = useWeb3Context();
  const { state } = useSwapContext();
  useEffect(() => {
    if (token) fetchPrices([token.name.toLowerCase()]);
  }, [fetchPrices, token, token?.name]);

  const fiatValue = token
    ? getUsdEstimate(token.name.toLowerCase(), amount || 0)
    : 0;

  return (
    <div className="flex flex-col items-end mt-2">
      {/* Amount Input */}
      {readonly || !token ? (
        <p className={styles.amount}>{amount}</p>
      ) : (
        <Field name={token.id}>
          {({ field, form }: any) => (
            <input
              {...field}
              type="text"
              placeholder="Enter amount"
              className="w-full p-2 text-lg font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-right"
              maxLength={32}
              onBlur={(e) => {
                field.onBlur(e); // Trigger Formik's blur handler
                // Format value on blur
                const formattedValue = parseFloat(
                  (e.target.value || "0").replace(/,/g, "")
                ).toLocaleString("en", {
                  maximumFractionDigits: 8,
                });
                // Update Formik state with formatted value
                form.setFieldValue(token.id, formattedValue);
                setAmount(Number(formattedValue.replace(/,/g, "")));
                getFeeAndRate(
                  state.fromToken || "",
                  state.toToken || "",
                  state.fromNetwork || ""
                );
              }}
            />
          )}
        </Field>
      )}

      {/* Fiat Value Display */}
      {!loading && <p className="text-gray-400">{fiatValue}</p>}
    </div>
  );
};

export default AmountInput;
