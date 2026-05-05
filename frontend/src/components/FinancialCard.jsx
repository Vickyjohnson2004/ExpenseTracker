const FinancialCard = ({
  icon,
  label,
  value,
  additionalContent,
  borderColor = "",
  bgColor = "bg-white",
}) => {
  return (
    <div
      className={`${bgColor} rounded-xl p-5 lg:mx-2 lg:p-2 shadow-sm border hover:shadow-md border-gray-100 transition-all ${borderColor}`}
    >
      <div className="text-sm font-medium text-gray-600 flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-2xl font-bold mt-1 text-gray-800">{value}</p>
      {additionalContent && (
        <div className="mt-2 text-sm text-gray-500">{additionalContent}</div>
      )}
    </div>
  );
};

export default FinancialCard;
