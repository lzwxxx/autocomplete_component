import React, { useState } from "react";
import Autocomplete from "./components/Autocomplete";

const options = [
  { label: "Singapore Dollar", value: "SGD", description: "Currency of Singapore" },
  { label: "US Dollar", value: "USD", description: "Currency of the United States" },
  { label: "Euro", value: "EUR", description: "Currency of the Eurozone" },
  { label: "British Pound", value: "GBP", description: "Currency of the United Kingdom" },
  { label: "Japanese Yen", value: "JPY", description: "Currency of Japan" },
  { label: "Australian Dollar", value: "AUD", description: "Currency of Australia" },
  { label: "Canadian Dollar", value: "CAD", description: "Currency of Canada" },
  { label: "Swiss Franc", value: "CHF", description: "Currency of Switzerland" },
  { label: "Chinese Yuan", value: "CNY", description: "Currency of China" },
  { label: "Indian Rupee", value: "INR", description: "Currency of India" },
  { label: "Brazilian Real", value: "BRL", description: "Currency of Brazil" },
  { label: "South African Rand", value: "ZAR", description: "Currency of South Africa" },
  { label: "Mexican Peso", value: "MXN", description: "Currency of Mexico" },
  { label: "Russian Ruble", value: "RUB", description: "Currency of Russia" },
  { label: "New Zealand Dollar", value: "NZD", description: "Currency of New Zealand" },
  { label: "Hong Kong Dollar", value: "HKD", description: "Currency of Hong Kong" },
  { label: "Norwegian Krone", value: "NOK", description: "Currency of Norway" },
  { label: "Swedish Krona", value: "SEK", description: "Currency of Sweden" },
  { label: "Turkish Lira", value: "TRY", description: "Currency of Turkey" },
  { label: "Saudi Riyal", value: "SAR", description: "Currency of Saudi Arabia" },
  { label: "United Arab Emirates Dirham", value: "AED", description: "Currency of the UAE" },
  { label: "South Korean Won", value: "KRW", description: "Currency of South Korea" },
  { label: "Taiwan Dollar", value: "TWD", description: "Currency of Taiwan" },
  { label: "Malaysian Ringgit", value: "MYR", description: "Currency of Malaysia" },
  { label: "Indonesian Rupiah", value: "IDR", description: "Currency of Indonesia" },
  { label: "Philippine Peso", value: "PHP", description: "Currency of the Philippines" },
  { label: "Vietnamese Dong", value: "VND", description: "Currency of Vietnam" },
];

function App() {

  // to store the selected options based on click
  const [selectedClick, setSelectedClick] = useState<
    { label: string; value: string; description?: string } | { label: string; value: string; description?: string }[]
  >([]);

  // to store the selected options based on typing
  const [selectedTyping, setSelectedTyping] = useState<
    { label: string; value: string; description?: string } | { label: string; value: string; description?: string }[]
  >([]);

  // track loading status for click 
  const [loadingClick, setLoadingClick] = useState(false);
  
  // track loading status for typing
  const [loadingTyping, setLoadingTyping] = useState(false);

  // for changing selected items in click
  const handleSelectionChangeClick = (
    newSelection: { label: string; value: string; description?: string } | { label: string; value: string; description?: string }[]
  ) => {
    setSelectedClick(newSelection);
  };

  // for changing selected items in typing
  const handleSelectionChangeTyping = (
    newSelection: { label: string; value: string; description?: string } | { label: string; value: string; description?: string }[]
  ) => {
    setSelectedTyping(newSelection);
  };

  const handleInputChangeClick = (inputValue: string) => {
    setLoadingClick(true);
    console.log("Click-based input change:", inputValue);
    setTimeout(() => {
      setLoadingClick(false);
    }, 1000);
  };

  const handleInputChangeTyping = (inputValue: string) => {
    setLoadingTyping(true);
    console.log("Typing-based input change:", inputValue);
    setTimeout(() => {
      setLoadingTyping(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="flex flex-col md:flex-row p-4 md:p-10 shadow-2xl rounded-lg bg-white w-screen max-w-[700px]">
        {/* typing */}
        <div className="flex flex-col w-full mb-4 md:mb-0 md:mr-4">
          <Autocomplete
            label="Async Search"
            description="Custom results display"
            options={options}
            value={selectedTyping}
            onChange={handleSelectionChangeTyping}
            onInputChange={handleInputChangeTyping}
            multiple={true}
            showOnTypingOnly={true}
            loading={loadingTyping}
          />
          <h2 className="text-sm mt-4">Selected Items:</h2>
          <ul className="text-sm list-disc list-inside">
            {Array.isArray(selectedTyping) && selectedTyping.length > 0 ? (
              selectedTyping.map((item, index) => (
                <li key={index}>
                  {typeof item === "string" ? item : (item as { label: string }).label}
                </li>
              ))
            ) : (
              <p>No items selected</p>
            )}
          </ul>
        </div>

        {/* click */}
        <div className="flex flex-col w-full">
          <Autocomplete
            label="Sync Search"
            description="Dropdown and search on focus"
            options={options}
            value={selectedClick}
            onChange={handleSelectionChangeClick}
            onInputChange={handleInputChangeClick}
            multiple={true}
            loading={loadingClick}
          />
          <h2 className="text-sm mt-4">Selected Items:</h2>
          <ul className="text-sm list-disc list-inside">
            {Array.isArray(selectedClick) && selectedClick.length > 0 ? (
              selectedClick.map((item, index) => (
                <li key={index}>
                  {typeof item === "string" ? item : (item as { label: string }).label}
                </li>
              ))
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