import { useState } from "react";
import { FaEdit, FaFileImport, FaHome, FaUsers } from "react-icons/fa";
import { IoAddCircleSharp, IoSearchSharp } from "react-icons/io5";
import AddModal from "../Components/AddModal";
import { toast, ToastContainer } from "react-toastify";
import EditCustomerModal from "../Components/EditCustomerModal";
import useCustomer from "../Hooks/useCustomer";
import Loader from "../Components/Loader";
import { TbDatabaseExport, TbPlayerTrackNextFilled, TbPlayerTrackPrevFilled } from "react-icons/tb";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import useAxiosSecure from "../Hooks/useAxiosSecure";
import ImportModal from "../Components/ImportModal";
import debounce from "lodash.debounce";
import { AiFillEdit } from "react-icons/ai";

const Customers = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const axiosSecure = useAxiosSecure();

    // Debounce the search input to prevent excessive API calls
    const debounceSearch = debounce((value) => {
        setDebouncedSearch(value);
        setCurrentPage(1); // Reset to first page on new search
    }, 500);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        debounceSearch(e.target.value);
    };

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;

    // Fetch Customers
    const [data, loading, refetch] = useCustomer(currentPage, limit, debouncedSearch); // This hook contain the 1st 10 data of customer collection cause of pagination
    const customers = data?.customers || [];
    const total = data?.total || 0;
    const totalPages = data?.totalPages || 1;

    const openModal = () => {
        setIsModalOpen(true);
    };
    const openEditModal = (customer) => {
        setSelectedCustomer(customer);
        setEditModalOpen(true);
    }

    const openImportModal = () => {
        setImportModalOpen(true);
    };

    const handleImport = async (customersData) => {
        try {
            const response = await axiosSecure.post("/customers/import", customersData, {
                headers: {
                    "Content-Type": "multipart/form-data", 
                },
            });
    
            if (response.status === 200) {
                refetch();
            } else {
                toast.error("Import failed!");
            }
        } catch (error) {
            console.error("Import failed:", error);
            toast.error("Import failed: " + (error.response?.data?.message || error.message));
        }
    };


    // const handleExport = async () => {
    //     try {
    //         // Fetch all customers from the new API endpoint
    //         const response = await axiosSecure.get("/customers/all");

    //         if (response.status === 200) {
    //             const allCustomers = response.data;

    //             // Prepare the data for export
    //             const data = allCustomers.map((customer, index) => ({
    //                 "SL.NO.": index + 1,
    //                 "Name": customer.name,
    //                 "Phone": customer.phone,
    //                 "Email": customer.email,
    //                 "Address": customer.address,
    //                 "Status": customer.status === "1" ? "Active" : "Inactive",
    //             }));

    //             // Create worksheet
    //             const worksheet = XLSX.utils.json_to_sheet(data);
    //             const workbook = XLSX.utils.book_new();
    //             XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

    //             const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    //             // Download the file
    //             const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    //             saveAs(dataBlob, 'customers.xlsx');
    //         }
    //     } catch (error) {
    //         console.error("Failed to export customers:", error);
    //         // Show an error message if needed
    //     }
    // };

    // Pagination Handlers
    const handlePrevious = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handlePageSelect = (page) => {
        setCurrentPage(page);
    };

    const renderPagination = () => {
        const pages = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 1);
        let endPage = startPage + maxPagesToShow - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(endPage - maxPagesToShow + 1, 1);
        }

        const startCustomer = (currentPage - 1) * limit + 1;
        const endCustomer = Math.min(currentPage * limit, total);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageSelect(i)}
                    className={`px-2 py-[2px] rounded-md mx-[2px] ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="flex justify-between items-center mt-4">
                {/* Show customer range information */}
                <span className="text-sm text-gray-600">
                    Showing {startCustomer} to {endCustomer} of {total} customers
                </span>

                <div className="flex items-center">
                    <button
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        className="px-2 py-1 rounded-md mx-1 bg-gray-200 disabled:opacity-50"
                    >
                        <TbPlayerTrackPrevFilled />
                    </button>
                    {pages}
                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className="px-2 py-1 rounded-md mx-1 bg-gray-200 disabled:opacity-50"
                    >
                        <TbPlayerTrackNextFilled />
                    </button>
                </div>
            </div>
        );
    };
    return (
        <div className="font-lexend -mt-2">
            {/* Breadcrumbs Component */}
            <div className="breadcrumbs text-sm">
                <ul>
                    <li>
                        <a>
                            <FaHome />
                            Home
                        </a>
                    </li>
                    <li>
                        <a>
                            <FaUsers className="font-bold mr-1" />
                            CRM
                        </a>
                    </li>
                    <li>
                        <a>
                            Customers
                        </a>
                    </li>
                </ul>
            </div>
            <div className="flex justify-between items-center mb-2">
                <h1 className="font-bold text-xl">Customers</h1>
                <div className="flex items-center gap-1">
                    {/* Search Input */}
                    <div className="relative">
                        <input
                            type="text"
                            value={search}
                            onChange={handleSearchChange}
                            placeholder="Search..."
                            className="px-2 py-1 text-sm bg-gray-100 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        />
                        <IoSearchSharp className="absolute right-3 top-1.5" />
                    </div>
                    <button
                        onClick={openModal}
                        className="bg-green-500 text-white px-2 py-2 rounded-md hover:bg-black flex items-center gap-1"
                    >
                        <IoAddCircleSharp className="w-5 h-4" />
                        <span className="text-xs">Add New</span>
                    </button>
                    <button
                        onClick={openImportModal}
                        className="bg-blue-700 text-white px-2 py-2 rounded-md hover:bg-black flex items-center gap-1"
                    >
                        <FaFileImport className="w-5 h-4" />
                        <span className="text-xs">Import</span>
                    </button>
                    {/* <button
                        onClick={handleExport}
                        className="bg-blue-500 text-white px-2 py-2 rounded-md hover:bg-black flex items-center gap-1"
                    >
                        <TbDatabaseExport className="w-5 h-4" />
                        <span className="text-xs">Export</span>
                    </button> */}
                </div>
            </div>

            {/* Show Loader when loading */}
            {loading ? (
                <Loader />
            ) : (
                <>
                    <table className="table table-xs w-full border-collapse border">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="px-1 py-2 border text-sm">Sl.No.</th>
                                <th className="px-2 py-2 border text-sm">Name</th>
                                <th className="px-2 py-2 border text-sm">Phone</th>
                                <th className="px-2 py-2 border text-sm">Email</th>
                                <th className="px-2 py-2 border text-sm">Address</th>
                                <th className="px-2 py-2 border text-sm">Status</th>
                                <th className="px-2 py-2 border text-sm">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">No customer available.</td>
                                </tr>
                            ) : (customers?.map((customer, index) =>
                                <tr key={customer.id} className="bg-gray-100">
                                    <td className="px-1 py-1 border text-center">{index + 1 + (currentPage - 1) * limit}</td>
                                    <td className="px-3 py-1 border text-xs">
                                        {customer.customer_name}
                                    </td>
                                    <td className="px-3 py-1 border text-xs">{customer.customer_phone}</td>
                                    <td className="px-3 py-1 border text-xs">{customer.customer_email}</td>
                                    <td className="px-3 py-1 border text-xs">{customer.customer_address || "N/A"}</td>
                                    <td className="px-2 py-1 border text-xs text-center">
                                        <p
                                            className={`px-1 py-1 text-xs font-semibold rounded-md ${customer.customer_status === 1 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                                        >
                                            {customer.customer_status === 1 ? 'Active' : 'Inactive'}
                                        </p>
                                    </td>
                                    <td className="px-2 py-1 border text-center">
                                        <button onClick={() => openEditModal(customer)} className="bg-blue-500 rounded-md pl-[6px] py-[3px] w-8">
                                        <AiFillEdit className="bg-blue-500 text-white font-bold text-xl" />
                                        </button>
                                    </td>
                                </tr>))
                            }
                        </tbody>
                    </table>
                    {/* Pagination control */}
                    {renderPagination()}
                </>

            )}

            <AddModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} refetch={refetch} />
            <EditCustomerModal editModalOpen={editModalOpen} setEditModalOpen={setEditModalOpen} customer={selectedCustomer} refetch={refetch}></EditCustomerModal>
            <ImportModal isOpen={importModalOpen} onClose={() => setImportModalOpen(false)} onImport={handleImport} />
            <ToastContainer></ToastContainer>
        </div>
    );
}

export default Customers;