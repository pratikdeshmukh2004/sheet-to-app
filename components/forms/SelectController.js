import Select from "react-tailwindcss-select";

// create select input component use tailwind css
const SelectInput = ({ label, options, ...rest }) => {
  return (
    <div className="flex my-5 flex-col">
      <label className="text-sm text-gray-500 font-bold mb-2">{label}</label>
      <Select placeholder="Select option" name={label} {...rest} primaryColor="orange" isSearchable options={options} />
    </div>
  );
};

export default SelectInput;
