import { useState } from "react";
import { FaEdit, FaHome, FaUsers } from "react-icons/fa";
import { IoAddCircleSharp, IoSearchSharp, IoSettings } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../Components/Loader";
import { TbPlayerTrackNextFilled, TbPlayerTrackPrevFilled } from "react-icons/tb";
import AddDepartmentModal from "../Components/AddDepartmentModal";
import useDepartment from "../Hooks/useDepartment";
import EditDepartmentModal from "../Components/EditDepartmentModal";
import debounce from "lodash.debounce";
import { AiFillEdit } from "react-icons/ai";

const Department = () => {
    const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
    const [editDepartmentModalOpen, setEditDepartmentModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");


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

    // Fetch Department
    const [data, loading, refetch] = useDepartment(currentPage, limit, debouncedSearch); // This hook contain the 1st 10 data of department collection cause of pagination
    const departments = data?.departments || [];
    const total = data?.total || 0;
    const totalPages = data?.totalPages || 1;

    const openDepartmentModal = () => {
        setIsDepartmentModalOpen(true);
    };

    const openEditModal = (department) => {
        setSelectedDepartment(department);
        setEditDepartmentModalOpen(true);
    }

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

        const startDepartment = (currentPage - 1) * limit + 1;
        const endDepartment = Math.min(currentPage * limit, total);

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
                    Showing {startDepartment} to {endDepartment} of {total} Department
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
                            <IoSettings />
                            Settings
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
                            Departments
                        </a>
                    </li>
                </ul>
            </div>
            <div className="flex justify-between items-center mb-2">
                <h1 className="font-bold text-xl">Departments</h1>
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
                        onClick={openDepartmentModal}
                        className="bg-green-500 text-white px-2 py-2 rounded-md hover:bg-black flex items-center gap-1"
                    >
                        <IoAddCircleSharp className="w-5 h-4" />
                        <span className="text-xs">Add New</span>
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
                                <th className="px-2 py-2 border text-sm">Department Name</th>
                                <th className="px-2 py-2 border text-sm">Status</th>
                                <th className="px-2 py-2 border text-sm">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">No Department available.</td>
                                </tr>
                            ) : (departments?.map((department, index) =>
                                <tr key={department._id} className="bg-gray-100">
                                    <td className="px-1 py-1 border text-center">{index + 1 + (currentPage - 1) * limit}</td>
                                    <td className="px-3 py-1 border text-xs">
                                        {department.department_name}
                                    </td>
                                    <td className="px-2 py-1 border text-xs text-center">
                                        <p
                                            className={`px-1 py-1 text-xs font-semibold rounded-md ${department.department_status === '1' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                                        >
                                            {department.department_status === '1' ? 'Active' : 'Inactive'}
                                        </p>
                                    </td>
                                    <td className="px-2 py-1 border text-center">
                                        <button onClick={() => openEditModal(department)} className="bg-blue-500 rounded-md pl-[6px] py-1 w-8">
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

            <AddDepartmentModal isDepartmentModalOpen={isDepartmentModalOpen} setIsDepartmentModalOpen={setIsDepartmentModalOpen} refetch={refetch} />
            <EditDepartmentModal editDepartmentModalOpen={editDepartmentModalOpen} setEditDepartmentModalOpen={setEditDepartmentModalOpen} department={selectedDepartment} refetch={refetch}></EditDepartmentModal>
            <ToastContainer></ToastContainer>
        </div>
    );
}

export default Department;