import React, { useState } from "react";
import Autocomplete from "./components/Autocomplete";

const options = [
  "Singapore Dollar (SGD)",
  "US Dollar (USD)",
  "Euro (EUR)",
  "British Pound (GBP)",
  "Japanese Yen (JPY)",
  "Australian Dollar (AUD)",
  "Canadian Dollar (CAD)",
  "Swiss Franc (CHF)",
  "Chinese Yuan (CNY)",
  "Indian Rupee (INR)",
  "Brazilian Real (BRL)",
  "South African Rand (ZAR)",
  "Mexican Peso (MXN)",
  "Russian Ruble (RUB)",
  "New Zealand Dollar (NZD)",
  "Hong Kong Dollar (HKD)",
  "Norwegian Krone (NOK)",
  "Swedish Krona (SEK)",
  "Turkish Lira (TRY)",
  "Saudi Riyal (SAR)",
  "United Arab Emirates Dirham (AED)",
  "South Korean Won (KRW)",
  "Taiwan Dollar (TWD)",
  "Malaysian Ringgit (MYR)",
  "Indonesian Rupiah (IDR)",
  "Philippine Peso (PHP)",
  "Vietnamese Dong (VND)"
];


function App() {
  const [selected, setSelected] = useState<
    | string
    | { label: string; value: string }
    | (string | { label: string; value: string })[]
  >([]);
  const [displaySelected, setDisplaySelected] = useState<string[]>([]);
  const [isMultiple, setIsMultiple] = useState(true); // to toggle btw multiple and single selection

  const handleSelectionChange = (
    newSelection:
      | string
      | { label: string; value: string }
      | (string | { label: string; value: string })[]
  ) => {
    setSelected(newSelection);

    if (isMultiple) {
      if (Array.isArray(newSelection)) {
        // to handle the case where the newSelection is an array
        const labels = newSelection.map((item) =>
          typeof item === "string" ? item : (item as { label: string }).label
        );
        setDisplaySelected(labels);
      } else {
        // to handle the case where it is in single mode; shouldnt happen in mutliple modeee
        setDisplaySelected([
          typeof newSelection === "string"
            ? newSelection
            : (newSelection as { label: string }).label,
        ]);
      }
    } else {
      // this is for single selection
      setDisplaySelected([
        typeof newSelection === "string"
          ? newSelection
          : (newSelection as { label: string }).label,
      ]);
    }
  };

  const handleToggleSelectionMode = () => {
    // this is to the clear the selection and display when its in the toggling mode
    setSelected([]);
    setDisplaySelected([]);
    setIsMultiple(!isMultiple);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex p-10 shadow-2xl rounded-lg bg-white">
        <div className="flex flex-col mr-6">
          <h1 className="text-2xl mb-4">Autocomplete</h1>
          <Autocomplete
            label="Search"
            options={options}
            value={selected}
            onChange={handleSelectionChange}
            multiple={isMultiple}
          />
          <button
            onClick={handleToggleSelectionMode}
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            Toggle {isMultiple ? "Single" : "Multiple"} Selection
          </button>
        </div>

        <div className="flex flex-col">
          <h2 className="text-xl mb-2">
            {isMultiple ? "Selected Items:" : "Selected Item:"}
          </h2>
          <ul className="list-disc list-inside">
            {displaySelected.length > 0 ? (
              displaySelected.map((item, index) => <li key={index}>{item}</li>)
            ) : (
              <p>No items selected</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
