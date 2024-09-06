import React, { useState, useEffect, useRef, useCallback } from "react";
import { useFloating, offset, shift } from "@floating-ui/react-dom";

interface AutocompleteProps<T> {
  label: string;
  options: T[];
  value: T | T[];
  onChange: (value: T | T[]) => void;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  loading?: boolean;
  filterOptions?: (inputValue: string, options: T[]) => T[];
  renderOption?: (
    option: T,
    isSelected: boolean,
    onSelect: () => void
  ) => JSX.Element;
  debounceTime?: number;
}

function Autocomplete<T extends string | { label: string; value: any }>({
  label,
  options,
  value,
  onChange,
  placeholder = "Search...",
  disabled = false,
  multiple = false,
  loading = false,
  filterOptions,
  renderOption,
  debounceTime = 300,
}: AutocompleteProps<T>) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<T[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { refs, floatingStyles } = useFloating({
    placement: "bottom-start",
    middleware: [offset(5), shift()],
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!loading) {
        const filtered = filterOptions
          ? filterOptions(inputValue, options)
          : options.filter((option) =>
              typeof option === "string"
                ? option.toLowerCase().includes(inputValue.toLowerCase())
                : option.label.toLowerCase().includes(inputValue.toLowerCase())
            );
        setFilteredOptions(filtered);
        setHighlightedIndex(0);
      }
    }, debounceTime);

    return () => clearTimeout(timeoutId);
  }, [inputValue, options, filterOptions, debounceTime, loading]);

  const handleSelect = (option: T) => {
    if (multiple) {
      const newValue = Array.isArray(value)
        ? value.includes(option)
          ? value.filter((v) => v !== option)
          : [...value, option]
        : [option];
      onChange(newValue);
    } else {
      onChange(option);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        setHighlightedIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % filteredOptions.length;
          scrollToHighlighted(nextIndex);
          return nextIndex;
        });
        break;
      case "ArrowUp":
        setHighlightedIndex((prevIndex) => {
          const prevIndexWrapped =
            (prevIndex - 1 + filteredOptions.length) % filteredOptions.length;
          scrollToHighlighted(prevIndexWrapped);
          return prevIndexWrapped;
        });
        break;
      case "Enter":
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
      default:
        break;
    }
  };

  const scrollToHighlighted = (index: number) => {
    const optionElement = dropdownRef.current?.querySelector(
      `div[data-index='${index}']`
    );
    optionElement?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="w-full">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>
      <div ref={refs.setReference} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        {loading && <div className="spinner">Loading...</div>}
        {isOpen && (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className="absolute z-10 w-full bg-gray-100 border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            <div className="py-1" ref={dropdownRef}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => {
                  const isSelected = Array.isArray(value)
                    ? value.includes(option)
                    : value === option;
                  const isHighlighted = index === highlightedIndex;

                  return (
                    <div
                      key={index}
                      data-index={index}
                      onClick={() => handleSelect(option)}
                      className={`flex items-center p-2 cursor-pointer hover:bg-gray-200 ${
                        isSelected ? "bg-gray-200" : ""
                      } ${isHighlighted ? "bg-gray-300" : ""} text-black`}
                    >
                      {multiple && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelect(option);
                          }}
                          className="mr-2"
                        />
                      )}
                      {renderOption
                        ? renderOption(option, isSelected, () =>
                            handleSelect(option)
                          )
                        : typeof option === "string"
                        ? option
                        : option.label}
                    </div>
                  );
                })
              ) : (
                <div className="p-2 text-gray-500">No options available</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Autocomplete;
