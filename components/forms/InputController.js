const InputController = ({ label, ...rest }) => {
  return (
    <div className="flex my-5 flex-col">
      <label className="text-sm text-gray-700 font-bold mb-2">{label}</label>
      <input
        name={label}
        className="text-sm focus:border-orange-600 focus:border-2 rounded border border-gray-200 p-2 outline-none font-bold text-gray-600"
        {...rest}
      />
    </div>
  );
};
export default InputController;
