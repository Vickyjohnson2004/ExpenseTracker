import * as XLSX from "xlsx";

export const exportToExcel = (data, fileName = "transcations") => {
  if (!data || data.length === 0) {
    alert("No data to export");
    return;
  }

  try {
    const worksheet = XLSX.utils.json_to_sheet(data)

    // create a webhook
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transcations")

    // Generate excel file and trigger download
    XLSX.writeFile(workbook, `${fileName}.xlsx`, {bookType: 'xlsx', type: 'array'})
  } catch (error) {
    console.error("Export error:", error)
    alert("Error exporting data, Please try again")
  }
};
