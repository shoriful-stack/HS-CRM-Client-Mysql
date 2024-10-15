import React, { useEffect, useRef, useState } from "react";
import { FaDownload, FaEdit, FaFileImport, FaFilter, FaHome, FaMoneyCheckAlt, FaRegEye } from "react-icons/fa";
import { IoMdArrowDropdownCircle } from "react-icons/io";
import { IoAddCircleSharp } from "react-icons/io5";
import { TbDatabaseExport, TbPlayerTrackNextFilled, TbPlayerTrackPrevFilled } from "react-icons/tb";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../Components/Loader";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import useAxiosSecure from "../Hooks/useAxiosSecure";
// import AddContractModal from "../Components/AddContractModal";
import useContract from "../Hooks/useContract";
import ImportContractModal from "../Components/ImportContractModal";
import EditContractModal from "../Components/EditContractModal";
import { useNavigate } from "react-router-dom";
import useAllProjects_Master from "../Hooks/useAllProjects_Master";
import useAllCustomer from "../Hooks/useAllCustomers";

const Contracts = () => {
    // const [isAddContractModalOpen, setIsAddContractModalOpen] = useState(false);
    const [editContractModalOpen, setEditContractModalOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState(null);
    // const [importContractModalOpen, setImportContractModalOpen] = useState(false);
    const [allProjects] = useAllProjects_Master();
    const [allCustomers] = useAllCustomer();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    // New states for filters
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        project_category: "", // 'Service', 'Product', 'Supply & Service'
        contractStatus: "", // 'Expired', 'Not Expired'
        project_name: "",
        customer_name: "",
        signingDateFrom: "",
        signingDateTo: "",
        effectiveDateFrom: "",
        effectiveDateTo: "",
        closingDateFrom: "",
        closingDateTo: ""
    });

    // Reference for clicking outside the filter dropdown
    const filterRef = useRef();

    // Handle click outside to close filter dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return ''; // Return empty if no date is provided
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return ''; // Check if the date is invalid
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options);
    };


    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;

    // Fetch contracts
    const [data, loading, refetch] = useContract(currentPage, limit, filters); // This hook contain the 1st 10 data of project collection
    const contracts = data?.contracts || [];
    const total = data?.total || 0;
    const totalPages = data?.totalPages || 1;

    // Handler for applying filters
    const applyFilter = (filterKey, value) => {
        setFilters((prev) => ({
            ...prev,
            [filterKey]: value
        }));
        setCurrentPage(1); // Reset to first page on filter change
    };

    // Handler to clear a specific filter
    const clearFilter = (filterKey) => {
        setFilters((prev) => ({
            ...prev,
            [filterKey]: ""
        }));
        setCurrentPage(1);
    };

    // Handler to clear all filters
    const clearAllFilters = () => {
        setFilters({
            project_category: "",
            contractStatus: "",
            project_name: "",
            customer_name: "",
            signingDateFrom: "",
            signingDateTo: "",
            effectiveDateFrom: "",
            effectiveDateTo: "",
            closingDateFrom: "",
            closingDateTo: ""
        });
        setCurrentPage(1);
    };
    const openEditContractModal = (contract) => {
        setSelectedContract(contract);
        setEditContractModalOpen(true);
    };

    // Handler to navigate to ViewContract page
    const handleViewContract = (contract) => {
        navigate(`/dashboard/contracts/view/${contract._id}`);
    };

    // const openImportModal = () => {
    //     setImportContractModalOpen(true);
    // };

    // const handleImport = async (contractsData) => {
    //     try {
    //         const response = await axiosSecure.post("/contracts/all", contractsData, {
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //         });

    //         if (response.status === 200) {
    //             refetch();
    //         } else {
    //             toast.error("Import failed!");
    //         }
    //     } catch (error) {
    //         console.error("Import failed:", error);
    //         toast.error("Import failed: " + (error.response?.data?.message || error.message));
    //     }
    // };

    const handleExport = async () => {
        try {
            // Fetch all contracts from the new API endpoint
            const response = await axiosSecure.get("/contracts/all", {
                params: { ...filters } // Pass current filters as query parameters
            });

            if (response.status === 200) {
                const allContracts = response.data;

                // Prepare the data for export
                const data = allContracts.map((contract, index) => ({
                    "Sl.No.": index + 1,
                    "Title": contract.contract_title,
                    "Project Name": contract.project_details.project_name,
                    "Project Type": contract.project_type === '1' ? 'Service' :
                        contract.project_type === '2' ? 'Product' :
                            'Supply & Service',
                    "First Party": contract.first_party,
                    "Customer": contract.customer_name,
                    "Ref No.": contract.refNo,
                    "Signing Date": contract.signing_date,
                    "Effective Date": contract.effective_date,
                    "Closing Date": contract.closing_date,
                    "Status": contract.contract_status === '1' ? 'Not Expired' : 'Expired',
                    "Scan Copy": contract.scan_copy_status === '1' ? 'Done' : 'Undone',
                    "Hard Copy": contract.hard_copy_status === '1' ? 'Found' : 'Not Found'
                }));

                // Create worksheet
                const worksheet = XLSX.utils.json_to_sheet(data);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Contracts");

                const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

                // Download the file
                const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
                saveAs(dataBlob, 'contracts.xlsx');
            }
        } catch (error) {
            console.error("Failed to export contracts:", error);
        }
    };

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

        const startProject = (currentPage - 1) * limit + 1;
        const endProject = Math.min(currentPage * limit, total);

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
            <div className="flex justify-between items-center mt-4 w-[1037px]">
                {/* Show customer range information */}
                <span className="text-sm text-gray-600">
                    Showing {startProject} to {endProject} of {total} contracts
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
                            <FaMoneyCheckAlt className="mr-[2px]"/>
                            Contracts
                        </a>
                    </li>
                </ul>
            </div>
            <div className="flex justify-between items-center mb-2 w-[1037px]">
                <h1 className="font-bold text-xl">Contracts</h1>
                <div className="flex items-center gap-1">
                    {/* Filter Button */}
                    <div className="relative" ref={filterRef}>
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="bg-indigo-500 text-white px-2 py-2 rounded-md hover:bg-black flex items-center gap-1"
                        >
                            <FaFilter className="w-3 h-3" />
                            <span className="text-xs">Filter</span>
                        </button>

                        {isFilterOpen && (
                            <div className="absolute right-0 mt-2 w-96 bg-white border rounded-md shadow-lg z-50">
                                <div className="p-3">
                                    <h3 className="text-sm font-semibold mb-2">Filter By</h3>
                                    <div className="grid grid-cols-2 gap-2 mb-1">
                                        {/* Project Name Filter */}
                                        <div className="">
                                            <label className="block text-xs font-medium text-gray-700">Project Name</label>
                                            <select
                                                value={filters.project_name}
                                                onChange={(e) => applyFilter('project_name', e.target.value)}
                                                className="mt-1 block w-full border border-gray-300 rounded-md p-1 text-xs"
                                            >
                                                <option value="">All</option>
                                                {allProjects
                                                    .filter(projects_master => projects_master.project_status === "1") // Adjust based on data type
                                                    .map((project) => (
                                                        <option key={project._id} value={project.project_name}>
                                                            {project.project_name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                        {/* Customer Name Filter */}
                                        <div className="">
                                            <label className="block text-xs font-medium text-gray-700">Customer Name</label>
                                            <select
                                                value={filters.customer_name}
                                                onChange={(e) => applyFilter('customer_name', e.target.value)}
                                                className="mt-1 block w-full border border-gray-300 rounded-md p-1 text-xs"
                                            >
                                                <option value="">All</option>
                                                {allCustomers
                                                    .filter(customer => customer.status === "1") // Adjust based on data type
                                                    .map((customer) => (
                                                        <option key={customer._id} value={customer.name}>
                                                            {customer.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {/* Project Type Filter */}
                                        <div className="">
                                            <label className="block text-xs font-medium text-gray-700">Project Type</label>
                                            <select
                                                value={filters.project_category}
                                                onChange={(e) => applyFilter('project_category', e.target.value)}
                                                className="mt-1 block w-full border border-gray-300 rounded-md p-1 text-xs"
                                            >
                                                <option value="">All</option>
                                                <option value="Service">Service</option>
                                                <option value="Product">Product</option>
                                                <option value="Supply & Service">Supply & Service</option>
                                            </select>
                                        </div>
                                        {/* Contract Status Filter */}
                                        <div className="">
                                            <label className="block text-xs font-medium text-gray-700">Contract Status</label>
                                            <select
                                                value={filters.contractStatus}
                                                onChange={(e) => applyFilter('contractStatus', e.target.value)}
                                                className="mt-1 block w-full border border-gray-300 rounded-md p-1 text-xs"
                                            >
                                                <option value="">All</option>
                                                <option value="Not Expired">Not Expired</option>
                                                <option value="Expired">Expired</option>
                                            </select>
                                        </div>
                                    </div>
                                    {/* signing date */}
                                    <div className="my-2">
                                        <label className="block text-xs font-medium text-gray-700">Signing Date</label>
                                        <div className="flex space-x-2">
                                            <input
                                                type="date"
                                                value={filters.signingDateFrom}
                                                onChange={(e) => applyFilter('signingDateFrom', e.target.value)}
                                                className="block w-full border border-gray-300 rounded-md p-1 text-xs"
                                                placeholder="From"
                                            />
                                            <input
                                                type="date"
                                                value={filters.signingDateTo}
                                                onChange={(e) => applyFilter('signingDateTo', e.target.value)}
                                                className="block w-full border border-gray-300 rounded-md p-1 text-xs"
                                                placeholder="To"
                                            />
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <h4 className="block text-xs font-medium text-gray-700">Effective Date</h4>
                                        <div className="flex space-x-2">
                                            <input
                                                type="date"
                                                value={filters.effectiveDateFrom}
                                                onChange={(e) => applyFilter('effectiveDateFrom', e.target.value)}
                                                className="block w-full border border-gray-300 rounded-md p-1 text-xs"
                                                placeholder="From"
                                            />
                                            <input
                                                type="date"
                                                value={filters.effectiveDateTo}
                                                onChange={(e) => applyFilter('effectiveDateTo', e.target.value)}
                                                className="block w-full border border-gray-300 rounded-md p-1 text-xs"
                                                placeholder="To"
                                            />
                                        </div>
                                    </div>
                                    <div className="my-2">
                                        <h4 className="block text-xs font-medium text-gray-700">Closing Date</h4>
                                        <div className="flex space-x-2">
                                            <input
                                                type="date"
                                                value={filters.closingDateFrom}
                                                onChange={(e) => applyFilter('closingDateFrom', e.target.value)}
                                                className="block w-full border border-gray-300 rounded-md p-1 text-xs"
                                                placeholder="From"
                                            />
                                            <input
                                                type="date"
                                                value={filters.closingDateTo}
                                                onChange={(e) => applyFilter('closingDateTo', e.target.value)}
                                                className="block w-full border border-gray-300 rounded-md p-1 text-xs"
                                                placeholder="To"
                                            />
                                        </div>
                                    </div>

                                    {/* Clear Filters */}
                                    <div className="flex justify-end">
                                        <button
                                            onClick={clearAllFilters}
                                            className="text-xs text-red-500 hover:underline"
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* import and export button */}
                    {/* <button
                        onClick={openImportModal}
                        className="bg-blue-700 text-white px-2 py-2 rounded-md hover:bg-black flex items-center gap-1"
                    >
                        <FaFileImport className="w-5 h-4" />
                        <span className="text-xs">Import</span>
                    </button> */}
                    <button
                        onClick={handleExport}
                        className="bg-blue-500 text-white px-2 py-2 rounded-md hover:bg-black flex items-center gap-1"
                    >
                        <TbDatabaseExport className="w-5 h-4" />
                        <span className="text-xs">Export</span>
                    </button>
                </div>
            </div>

            {/* Show Loader when loading */}
            {loading ? (
                <Loader />
            ) : (
                <>
                    <table className="table w-[1290px] border-collapse border">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="px-2 py-2 border text-xs">Sl.No.</th>
                                <th className="px-2 py-2 border text-xs">Action</th>
                                <th className="px-2 py-2 border text-xs">Title</th>
                                <th className="px-2 py-2 border text-xs">Project Name</th>
                                <th className="px-2 py-2 border text-xs">Project Type</th>
                                <th className="px-2 py-2 border text-xs">First Party</th>
                                <th className="px-2 py-2 border text-xs">Customer Name</th>
                                <th className="px-2 py-2 border text-xs">Ref No.</th>
                                <th className="px-1 py-2 border text-xs">Signing Date</th>
                                <th className="px-1 py-2 border text-xs">Effective Date</th>
                                <th className="px-1 py-2 border text-xs">Closing Date</th>
                                <th className="px-2 py-2 border text-xs text-center">Status</th>
                                <th className="px-2 py-2 border text-xs">Scan Copy</th>
                                <th className="px-2 py-2 border text-xs">Hard Copy</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contracts.length === 0 ? (
                                <tr>
                                    <td colSpan="14" className="text-center py-4">
                                        {filters.project_category || filters.contractStatus || filters.project_name || filters.customer_name ||
                                            (filters.signingDateFrom && filters.signingDateTo) ||
                                            (filters.effectiveDateFrom && filters.effectiveDateTo) ||
                                            (filters.closingDateFrom && filters.closingDateTo)
                                            ? "No contracts match the selected filters."
                                            : "No contract available."}

                                    </td>
                                </tr>
                            ) : (
                                contracts.map((contract, index) => <tr key={contract._id} className="bg-gray-100">
                                    <td className="px-1 py-1 border text-center">{index + 1 + (currentPage - 1) * limit}</td>
                                    <td className="px-1 py-[1px] border text-center text-sm">
                                        <div className="dropdown">
                                            <div
                                                tabIndex={0}
                                                role="button"
                                                className="px-[6px] py-[5px] rounded-md text-white bg-blue-600"
                                            >
                                                <IoMdArrowDropdownCircle className="text-2xl" />
                                            </div>
                                            <ul
                                                tabIndex={0}
                                                className="dropdown-content bg-base-100 text-start w-[100px] pl-3 py-2 rounded-md shadow text-sm z-50"
                                            >
                                                <li>
                                                    <button onClick={() => handleViewContract(contract)}
                                                        className="flex items-center space-x-2">
                                                        <FaRegEye />
                                                        <span>View</span>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button onClick={() => openEditContractModal(contract)} href="#" className="flex items-center space-x-2">
                                                        <FaEdit />
                                                        <span>Edit</span>
                                                    </button>
                                                </li>
                                                {/* <li>
                                                    <a href="#" className="flex items-center space-x-2">
                                                        <FaDownload />
                                                        <span>Contract Details</span>
                                                    </a>
                                                </li> */}
                                            </ul>
                                        </div>
                                    </td>
                                    <td className="px-1 py-1 border text-xs">{contract.contract_title}</td>
                                    <td className="px-1 py-1 border text-xs">{contract.project_details ? contract.project_details.project_name : 'N/A'}</td>
                                    <td className="px-1 py-1 border text-xs">
                                        {contract.project_category === '1' ? 'Service' :
                                            contract.project_category === '2' ? 'Product' :
                                                'Supply & Service'}
                                    </td>
                                    <td className="px-1 py-1 border text-xs">{contract.first_party}</td>
                                    <td className="px-1 py-1 border text-xs">{contract.customer_name}</td>
                                    <td className="px-1 py-1 border text-xs">{contract.refNo}</td>
                                    <td className="px-1 py-1 border text-xs">{formatDate(contract.signing_date)}</td>
                                    <td className="px-1 py-1 border text-xs">{formatDate(contract.effective_date)}</td>
                                    <td className="px-1 py-1 border text-xs">{formatDate(contract.closing_date)}</td>
                                    <td className="px-1 py-1 border text-xs text-center w-24">
                                        <span
                                            className={`px-1 py-1 font-semibold rounded-md ${contract.contract_status === '1' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                                        >
                                            {contract.contract_status === '1' ? 'Not Expired' : 'Expired'}
                                        </span>
                                    </td>
                                    <td className="px-1 py-1 border text-xs">
                                        {contract.scan_copy_status === '1' ? 'Done' : 'Undone'}
                                    </td>
                                    <td className="px-1 py-1 border text-xs">{contract.hard_copy_status === '1' ? 'Found' : 'Not Found'}</td>
                                </tr>))
                            }
                        </tbody>
                    </table>
                    {/* Pagination control */}
                    {renderPagination()}
                </>
            )}
            <EditContractModal editContractModalOpen={editContractModalOpen} setEditContractModalOpen={setEditContractModalOpen} contract={selectedContract} refetch={refetch} />
            {/* <ImportContractModal isOpen={importContractModalOpen} onClose={() => setImportContractModalOpen(false)} onImport={handleImport} /> */}
            <ToastContainer></ToastContainer>
        </div>
    );
};

export default Contracts;
