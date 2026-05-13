import { transactionItemStyles } from "../assets/dummyStyles.js";
import { colorClasses } from "../assets/color.jsx";
import { useState } from "react";
import { DollarSign, Save, X, Edit, Trash2 } from "lucide-react";

const TransactionItem = ({
  transaction,
  isEditing,
  editForm,
  setEditForm,
  onSave,
  onCancel,
  onDelete,
  type = "expense",
  categoryIcons,
  setEditingId,
  amountClass = "font-bold truncate block text-right",
  iconClass = "p-3 rounded-xl flex-shrink-0",
}) => {
  const [errors, setErrors] = useState({
    description: "",
    amount: "",
  });

  const classes = colorClasses[type];
  const sign = type === "income" ? "+" : "-";

  // ---------------- VALIDATION ----------------
  const validate = () => {
    const nextErrors = { description: "", amount: "" };

    const desc = String(editForm?.description ?? "").trim();
    const amt = editForm?.amount;

    if (!desc) {
      nextErrors.description = "Description is required.";
    }

    if (amt === "" || amt === null || amt === undefined) {
      nextErrors.amount = "Amount is required.";
    } else if (Number(amt) <= 0 || isNaN(Number(amt))) {
      nextErrors.amount = "Amount must be greater than 0.";
    }

    setErrors(nextErrors);

    return !nextErrors.description && !nextErrors.amount;
  };

  const handleSaveClick = () => {
    if (validate()) {
      setErrors({ description: "", amount: "" });
      onSave();
    }
  };

  // ---------------- SAFE DATE ----------------
  const safeDate = transaction?.date ? new Date(transaction.date) : null;

  const formattedDate =
    safeDate && !isNaN(safeDate)
      ? safeDate.toLocaleDateString()
      : "Invalid date";

  return (
    <div className={transactionItemStyles.container(isEditing, classes)}>
      {/* LEFT SIDE */}
      <div className={transactionItemStyles.mainContainer}>
        <div
          className={transactionItemStyles.iconContainer(iconClass, classes)}
        >
          {categoryIcons?.[transaction.category] || (
            <DollarSign className="w-5 h-5" />
          )}
        </div>

        <div className={transactionItemStyles.contentContainer}>
          {/* DESCRIPTION */}
          {isEditing ? (
            <>
              <input
                type="text"
                value={editForm?.description ?? ""}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className={transactionItemStyles.input(
                  !!errors.description,
                  classes,
                )}
              />

              {errors.description && (
                <p className={transactionItemStyles.errorText}>
                  {errors.description}
                </p>
              )}
            </>
          ) : (
            <p className={transactionItemStyles.description}>
              {transaction.description}
            </p>
          )}

          {/* META */}
          <p className={transactionItemStyles.details}>
            {formattedDate}{" "}
            <span className="ml-2 capitalize">{transaction.category}</span>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className={transactionItemStyles.actionsContainer}>
        {/* AMOUNT */}
        <div className={transactionItemStyles.amountContainer}>
          {isEditing ? (
            <>
              <input
                type="number"
                value={editForm?.amount ?? ""}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    amount: e.target.value,
                  }))
                }
                className={transactionItemStyles.amountInput(
                  !!errors.amount,
                  classes,
                )}
              />

              {errors.amount && (
                <p className={transactionItemStyles.errorText}>
                  {errors.amount}
                </p>
              )}
            </>
          ) : (
            <span
              className={transactionItemStyles.amountText(amountClass, classes)}
            >
              {sign} ₦
              {Number(transaction.amount || 0).toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
            </span>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className={transactionItemStyles.buttonsContainer}>
          {isEditing ? (
            <>
              <button
                onClick={handleSaveClick}
                className={transactionItemStyles.saveButton(classes)}
              >
                <Save size={16} />
              </button>

              <button
                onClick={() => {
                  setErrors({ description: "", amount: "" });
                  onCancel();
                }}
                className={transactionItemStyles.cancelButton}
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setEditForm({
                    description: transaction.description ?? "",
                    amount: transaction.amount ?? "",
                    category: transaction.category ?? "",
                    date: transaction.date ?? "",
                    type: transaction.type ?? "expense",
                  });

                  setErrors({ description: "", amount: "" });
                  setEditingId(transaction.id);
                }}
                className={transactionItemStyles.editButton(classes)}
              >
                <Edit size={16} />
              </button>

              <button
                onClick={() => onDelete(transaction.id)}
                className={transactionItemStyles.deleteButton(classes)}
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
