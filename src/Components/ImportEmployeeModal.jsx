import React, { useState } from "react";
import { toast } from "react-toastify";

const ImportEmployeesModal = ({ isOpen, onClose, onImport }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleImport = async (event) => {
    event.preventDefault();

    if (!file) {
      toast.error("Please upload a file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const response = await onImport(formData);
      if (response && response.status === 200) {
        toast.success(`${file.name} imported successfully!`);
        onClose();
      } else {
        toast.success(`${file.name} imported successfully!`);
        onClose();
      }
    } catch (error) {
      console.error("Import failed:", error);
      toast.error(
        "Import failed: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-4 rounded-md">
          <h2 className="font-bold mb-2">Import Employees</h2>
          <form onSubmit={handleImport}>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
            />
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="mr-2 bg-gray-500 text-white px-2 py-2 rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`bg-blue-500 text-white px-2 py-2 rounded-md text-sm ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Importing..." : "Import"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default ImportEmployeesModal;
