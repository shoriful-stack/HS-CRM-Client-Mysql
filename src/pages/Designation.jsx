import { useState } from "react";
import { FaFileImport, FaHome } from "react-icons/fa";
import { IoAddCircleSharp, IoSearchSharp, IoSettings } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../Components/Loader";
import { TbPlayerTrackNextFilled, TbPlayerTrackPrevFilled } from "react-icons/tb";
import EditDesignationModal from "../Components/EditDesignationModal";
import AddDesignationModal from "../Components/AddDesignationModal";
import useDesignation from "../Hooks/useDesignation";
import debounce from "lodash.debounce";
import { AiFillEdit } from "react-icons/ai";
import ImportDesignationModal from "../Components/ImportDesignaitonModal";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const Designation = () => {
    const [isDesignationModalOpen, setIsDesignationModalOpen] = useState(false);
    const [editDesignationModalOpen, setEditDesignationModalOpen] = useState(false);
    const [selectedDesignation, setSelectedDesignation] = useState(null);
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

    // Fetch Designation
    const [data, loading, refetch] = useDesignation(currentPage, limit, debouncedSearch); // This hook contain the 1st 10 data of designation collection cause of pagination
    const designations = data?.designations || [];
    const total = data?.total || 0;
    const totalPages = data?.totalPages || 1;

    const openDesignationModal = () => {
        setIsDesignationModalOpen(true);
    };

    const openEditModal = (designation) => {
        setSelectedDesignation(designation);
        setEditDesignationModalOpen(true);
    }

    const openImportModal = () => {
        setImportModalOpen(true);
    };

    const handleImport = async (designationsData) => {
        try {
            const response = await axiosSecure.post("/designations/import", designationsData, {
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

        const startDesignation = (currentPage - 1) * limit + 1;
        const endDesignation = Math.min(currentPage * limit, total);

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
                    Showing {startDesignation} to {endDesignation} of {total} Designation
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
                            <IoSettings />
                            Settings
                        </a>
                    </li>
                    <li>
                        <a>
                            Designations
                        </a>
                    </li>
                </ul>
            </div>
            <div className="flex justify-between items-center mb-2">
                <h1 className="font-bold text-xl">Designations</h1>
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
                    {/* add button */}
                    <button
                        onClick={openDesignationModal}
                        className="bg-green-500 text-white px-2 py-2 rounded-md hover:bg-black flex items-center gap-1"
                    >
                        <IoAddCircleSharp className="w-5 h-4" />
                        <span className="text-xs">Add New</span>
                    </button>
                    {/* import button */}
                    <button
                        onClick={openImportModal}
                        className="bg-blue-700 text-white px-2 py-2 rounded-md hover:bg-black flex items-center gap-1"
                    >
                        <FaFileImport className="w-5 h-4" />
                        <span className="text-xs">Import</span>
                    </button>
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
                                <th className="px-2 py-2 border text-sm">Designation</th>
                                <th className="px-2 py-2 border text-sm">Status</th>
                                <th className="px-2 py-2 border text-sm">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {designations.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">No Designation available.</td>
                                </tr>
                            ) : (designations?.map((designation, index) =>
                                <tr key={designation.id} className="bg-gray-100">
                                    <td className="px-1 py-1 border text-center">{index + 1 + (currentPage - 1) * limit}</td>
                                    <td className="px-3 py-1 border text-xs">
                                        {designation.designation}
                                    </td>
                                    <td className="px-2 py-1 border text-xs text-center">
                                        <p
                                            className={`px-1 py-1 text-xs font-semibold rounded-md ${designation.designation_status === 1 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                                        >
                                            {designation.designation_status === 1 ? 'Active' : 'Inactive'}
                                        </p>
                                    </td>
                                    <td className="px-2 py-1 border text-center">
                                        <button onClick={() => openEditModal(designation)} className="bg-blue-500 rounded-md pl-[6px] py-1 w-8">
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

            <AddDesignationModal isDesignationModalOpen={isDesignationModalOpen} setIsDesignationModalOpen={setIsDesignationModalOpen} refetch={refetch} />
            <EditDesignationModal editDesignationModalOpen={editDesignationModalOpen} setEditDesignationModalOpen={setEditDesignationModalOpen} designation={selectedDesignation} refetch={refetch}></EditDesignationModal>
            <ImportDesignationModal isOpen={importModalOpen} onClose={() => setImportModalOpen(false)} onImport={handleImport} />
            <ToastContainer></ToastContainer>
        </div>
    );
}

export default Designation;