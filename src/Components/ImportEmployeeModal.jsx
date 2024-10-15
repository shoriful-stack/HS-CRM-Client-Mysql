import React, { useState } from 'react';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

const ImportEmployeesModal = ({ isOpen, onClose, onImport }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleImport = async (event) => {
        event.preventDefault();

        if (!file) {
            toast.error("Please upload a file!");
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const employees = XLSX.utils.sheet_to_json(worksheet);

                if (employees.length === 0) {
                    toast.error("No data found in the file!");
                    return;
                }

                // Pass the parsed data to the parent component
                await onImport(employees);
                toast.success(`${employees.length} employees imported successfully!`);
                onClose();
            } catch (error) {
                console.error("Import failed:", error);
                toast.error("Import failed: " + error.message);
            }
        };

        reader.readAsArrayBuffer(file);
    };

    return (
        isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-4 rounded-md">
                    <h2 className="font-bold mb-2">Import Employees</h2>
                    <form onSubmit={handleImport}>
                        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
                        <div className="mt-2 flex justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="ml-2 bg-gray-500 text-white px-2 py-2 rounded-md text-sm"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="bg-blue-500 text-white px-2 py-2 rounded-md text-sm">
                                Import
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default ImportEmployeesModal;