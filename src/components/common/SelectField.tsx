import Select, { ActionMeta, MultiValue, SingleValue, components } from "react-select";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  value: string | string[];
  onChange: (v: string | string[]) => void;
  options: Option[];
  error?: string;
  selectAllOptions?: boolean;
  isMulti?: boolean;
  placeholder?: string;
  separator?: string; // new prop
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  error,
  selectAllOptions = false,
  isMulti = true,
  separator = "",
}) => {
  const selectAllOption: Option = { value: "__ALL__", label: "Select All" };
  const allOptions: Option[] = [
    ...(selectAllOptions && isMulti ? [selectAllOption] : []),
    ...options
  ];

  const handleChange = (
    selected: MultiValue<Option> | SingleValue<Option>,
    _actionMeta: ActionMeta<Option>
  ) => {
    if (!selected) {
      onChange(isMulti ? [] : "");
      return;
    }

    if (isMulti) {
      const selectedArray = selected as MultiValue<Option>;
      const values = selectedArray.map((opt) => opt.value);

      if (values.includes("__ALL__")) {
        const allValues = options.map((o) => o.value);
        onChange(allValues);
      } else {
        onChange(values);
      }
    } else {
      const singleValue = (selected as SingleValue<Option>)?.value || "";
      onChange(singleValue);
    }
  };

  const selectedValue = isMulti
    ? (value as string[]).map((v) => ({
      value: v,
      label: options.find((o) => o.value === v)?.label || v
    }))
    : value
      ? { value: value as string, label: options.find((o) => o.value === value)?.label || (value as string) }
      : null;

  const MultiValueLabel = (props: any) => {
    const { data, selectProps } = props;
    const selectedValues: Option[] = selectProps.value || [];

    // Check if this is the last selected value
    const isLast = selectedValues.length > 0
      ? selectedValues[selectedValues.length - 1].value === data.value
      : true;

    // Only show separator if more than one selected and not last
    const showSeparator = selectedValues.length > 1 && !isLast;

    return (
      <components.MultiValueLabel {...props}>
        {data.label}
        {showSeparator ? separator : ""}
      </components.MultiValueLabel>
    );
  };

  return (
    <>
      <label>{label}</label>
      <Select
        isMulti={isMulti}
        options={allOptions}
        value={selectedValue}
        onChange={handleChange}
        placeholder=""
        menuPortalTarget={document.body}
        className="mt-2"
        components={isMulti ? { MultiValueLabel } : {}}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          menuList: (provided) => ({
            ...provided,
            maxHeight: "200px",
            overflowY: "auto",
          }),
          valueContainer: (provided) => ({
            ...provided,
            maxHeight: "100px",
            overflowY: "auto",
          }),
        }}
      />
      {error && <span className="text-danger small">{error}</span>}
    </>
  );
};

export default SelectField;