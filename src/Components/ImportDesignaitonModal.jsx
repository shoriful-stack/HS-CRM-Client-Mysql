import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ImportDesignationModal = ({ isOpen, onClose, onImport }) => {
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
    
        const formData = new FormData();
        formData.append('file', file);
    
        try {
            await onImport(formData);
            toast.success(`${file.name} imported successfully!`);
            onClose();
        } catch (error) {
            console.error("Import failed:", error);
            toast.error("Import failed: " + error.message);
        }
    };    

    return (
        isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-4 rounded-md">
                    <h2 className="font-bold mb-2">Import Designation</h2>
                    <form onSubmit={handleImport}>
                        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
                        <div className="mt-2 flex justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-500 text-white px-2 py-2 rounded-md text-sm"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="ml-2 bg-blue-500 text-white px-2 py-2 rounded-md text-sm">
                                Import
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default ImportDesignationModal;