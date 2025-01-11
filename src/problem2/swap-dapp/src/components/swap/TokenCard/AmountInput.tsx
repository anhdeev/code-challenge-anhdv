/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Field } from "formik";
import styles from "./TokenCard.module.css";

interface AmountInputProps {
  name: string; // Name of the Field in Formik
  fiatValue: string; // Fiat equivalent value (e.g., "~$1,234.56")
  amount?: string;
  setAmount: (value: number) => void;
}

const AmountInput: React.FC<AmountInputProps> = ({
  name,
  fiatValue,
  amount,
  setAmount,
}) => {
  return (
    <div className="flex flex-col items-end mt-2">
      {/* Amount Input */}
      {amount || !name ? (
        <p className={styles.amount}>{amount}</p>
      ) : (
        <Field name={name}>
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
                form.setFieldValue(name, formattedValue);
                setAmount(Number(formattedValue));
                console.log({ field, formattedValue, name });
              }}
            />
          )}
        </Field>
      )}

      {/* Fiat Value Display */}
      <p className="text-gray-400">{fiatValue}</p>
    </div>
  );
};

export default AmountInput;
