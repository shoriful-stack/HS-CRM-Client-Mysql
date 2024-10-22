import React, { useEffect, useRef, useState } from "react";
import {
  FaEdit,
  FaFileImport,
  FaFilter,
  FaHistory,
  FaHome,
  FaRegEye,
} from "react-icons/fa";
import { IoMdArrowDropdownCircle } from "react-icons/io";
import { IoAddCircleSharp } from "react-icons/io5";
import {
  TbDatabaseExport,
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";
import { toast, ToastContainer } from "react-toastify";
import useProject from "../Hooks/useProject";
import Loader from "../Components/Loader";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import AddProjectModal from "../Components/AddProjectModal";
import EditProjectModal from "../Components/EditProjectModal";
import ImportProjectsModal from "../Components/ImportProjectsModal";
import AddContractModal from "../Components/AddContractModal";
import useAllProjects_Master from "../Hooks/useAllProjects_Master";
import useAllCustomer from "../Hooks/useAllCustomers";
import useAllDepartment from "../Hooks/useAllDepartments";
import useAllEmployee from "../Hooks/useAllEmployees";
import { RiProjectorFill } from "react-icons/ri";

const Projects = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddContractModalOpen, setIsAddContractModalOpen] = useState(false);
  // New state to store the selected project for adding a contract
  const [contractProject, setContractProject] = useState(null);
  const [editProjectModalOpen, setEditProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [allProjects] = useAllProjects_Master();
  const [allCustomers] = useAllCustomer();
  const [allDepartments] = useAllDepartment();
  const [allEmployees] = useAllEmployee();
  const axiosSecure = useAxiosSecure();
  // New states for filters
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    project_type: "", // 'Service', 'Product', 'Supply & Service'
    project_name: "",
    customer_name: "",
    department: "",
    hod: "",
    pm: "",
    year: "",
    project_code: "",
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

  // Handler for applying filters
  const applyFilter = (filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handler to clear a specific filter
  const clearFilter = (filterKey) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: "",
    }));
    setCurrentPage(1);
  };

  // Handler to clear all filters
  const clearAllFilters = () => {
    setFilters({
      project_type: "", // 'Service', 'Product', 'Supply & Service'
      project_name: "",
      customer_name: "",
      department: "",
      hod: "",
      pm: "",
      year: "",
      project_code: "",
    });
    setCurrentPage(1);
  };

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // Fetch Projects
  const [data, loading, refetch] = useProject(currentPage, limit, filters); // This hook contain the 1st 10 data of project collection
  const projects = data?.projects || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };
  const openAddContractModal = (project) => {
    setContractProject(project);
    setIsAddContractModalOpen(true);
  };
  const openEditTenderModal = (project) => {
    setSelectedProject(project);
    setEditProjectModalOpen(true);
  };
  const openImportModal = () => {
    setImportModalOpen(true);
  };

  const handleImport = async (projectsData) => {
    try {
      const response = await axiosSecure.post("/projects/all", projectsData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        refetch();
      } else {
        toast.error("Import failed!");
      }
    } catch (error) {
      console.error("Import failed:", error);
      toast.error(
        "Import failed: " + (error.response?.data?.message || error.message)
      );
    }
  };

  const handleExport = async () => {
    try {
      // Fetch all projects from the new API endpoint
      const response = await axiosSecure.get("/projects/all", {
        params: { ...filters }, // Pass current filters as query parameters
      });

      if (response.status === 200) {
        const allProjects = response.data;

        // Prepare the data for export
        const data = allProjects.map((project, index) => ({
          "Sl.No.": index + 1,
          "Project Name": project.project_name,
          "Customer Name": project.customer_name,
          "Project Category":
            project.project_category === "1"
              ? "Service"
              : project.project_category === "2"
              ? "Product"
              : "Supply & Service",
          Department: project.department,
          HOD: project.hod,
          "Project Manager": project.pm,
          Year: project.year,
          Phase: project.phase,
          "Project Code": project.project_code,
        }));

        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Projects");

        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });

        // Download the file
        const dataBlob = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });
        saveAs(dataBlob, "projects.xlsx");
      }
    } catch (error) {
      console.error("Failed to export projects:", error);
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
          className={`px-2 py-[2px] rounded-md mx-[2px] ${
            i === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-between items-center mt-4  w-[1080px]">
        {/* Show customer range information */}
        <span className="text-sm text-gray-600">
          Showing {startProject} to {endProject} of {total} projects
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
              <RiProjectorFill />
              Projects
            </a>
          </li>
        </ul>
      </div>
      <div className="flex justify-between items-center mb-2 w-[1080px]">
        <h1 className="font-bold text-xl">Projects</h1>
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
                      <label className="block text-xs font-medium text-gray-700">
                        Project Name
                      </label>
                      <select
                        value={filters.project_name}
                        onChange={(e) =>
                          applyFilter("project_name", e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md p-1 text-xs"
                      >
                        <option value="">All</option>
                        {allProjects
                          .filter(
                            (projects_master) =>
                              projects_master.project_status === 1
                          ) // Adjust based on data type
                          .map((project) => (
                            <option
                              key={project.id}
                              value={project.project_name}
                            >
                              {project.project_name}
                            </option>
                          ))}
                      </select>
                    </div>
                    {/* Customer Name Filter */}
                    <div className="">
                      <label className="block text-xs font-medium text-gray-700">
                        Customer Name
                      </label>
                      <select
                        value={filters.customer_name}
                        onChange={(e) =>
                          applyFilter("customer_name", e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md p-1 text-xs"
                      >
                        <option value="">All</option>
                        {allCustomers
                          .filter((customer) => customer.customer_status === 1) // Adjust based on data type
                          .map((customer) => (
                            <option
                              key={customer.id}
                              value={customer.customer_name}
                            >
                              {customer.customer_name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {/* Project Type Filter */}
                    <div className="">
                      <label className="block text-xs font-medium text-gray-700">
                        Project Type
                      </label>
                      <select
                        value={filters.project_type}
                        onChange={(e) =>
                          applyFilter("project_type", e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md p-1 text-xs"
                      >
                        <option value="">All</option>
                        <option value="1">Service</option>
                        <option value="2">Product</option>
                        <option value="3">Supply & Service</option>
                      </select>
                    </div>
                    {/* Department Filter */}
                    <div className="">
                      <label className="block text-xs font-medium text-gray-700">
                        Department
                      </label>
                      <select
                        value={filters.department}
                        onChange={(e) =>
                          applyFilter("department", e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md p-1 text-xs"
                      >
                        <option value="">All</option>
                        {allDepartments
                          .filter(
                            (department) => department.department_status === 1
                          ) // Adjust based on data type
                          .map((department) => (
                            <option
                              key={department.id}
                              value={department.department_name}
                            >
                              {department.department_name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div className="my-2 grid grid-cols-2 gap-2">
                    {/* HOD Filter */}
                    <div className="">
                      <label className="block text-xs font-medium text-gray-700">
                        HOD
                      </label>
                      <select
                        value={filters.hod}
                        onChange={(e) => applyFilter("hod", e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-1 text-xs"
                      >
                        <option value="">All</option>
                        {allEmployees.map((employee) => (
                          <option
                            key={employee.id}
                            value={employee.employee_name}
                          >
                            {employee.employee_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Project Manager */}
                    <div className="">
                      <label className="block text-xs font-medium text-gray-700">
                        Project Manager
                      </label>
                      <select
                        value={filters.pm}
                        onChange={(e) => applyFilter("pm", e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-1 text-xs"
                      >
                        <option value="">All</option>
                        {allEmployees.map((employee) => (
                          <option
                            key={employee.id}
                            value={employee.employee_name}
                          >
                            {employee.employee_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {/* Year Filter */}
                    <div className="">
                      <label className="block text-xs font-medium text-gray-700">
                        Year
                      </label>
                      <input
                        type="number"
                        placeholder="YYYY"
                        min="2017"
                        max="2100"
                        value={filters.year}
                        onChange={(e) => applyFilter("year", e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-1 text-xs"
                      />
                    </div>
                    {/* Project Code Filter */}
                    <div className="">
                      <label className="block text-xs font-medium text-gray-700">
                        Project Code
                      </label>
                      <input
                        type="text"
                        value={filters.project_code}
                        onChange={(e) =>
                          applyFilter("project_code", e.target.value)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md p-1 text-xs"
                      />
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={clearAllFilters}
                      className="text-xs px-4 py-2 bg-red-500 text-white rounded-md hover:bg-gray-400"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={openAddModal}
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
          <table className="table table-xs w-[1120px] border-collapse border">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="px-2 py-2 border text-xs">Sl.No.</th>
                <th className="px-2 py-2 border text-xs">Action</th>
                <th className="px-2 py-2 border text-xs">Year</th>
                <th className="px-2 py-2 border text-xs">Project Name</th>
                <th className="px-2 py-2 border text-xs">Project Category</th>
                <th className="px-1 py-2 border text-xs">Customer Name</th>
                <th className="px-2 py-2 border text-xs">Department</th>
                <th className="px-2 py-2 border text-xs">HOD</th>
                <th className="px-2 py-2 border text-xs">Project Manager</th>
                <th className="px-2 py-2 border text-xs">Phase</th>
                <th className="px-2 py-2 border text-xs">Project Code</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center py-4">
                    No projects available.
                  </td>
                </tr>
              ) : (
                projects.map((project, index) => (
                  <tr key={project.id} className="bg-gray-100">
                    <td className="px-1 py-1 border text-center">
                      {index + 1 + (currentPage - 1) * limit}
                    </td>
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
                          className="dropdown-content bg-base-100 text-start w-32 pl-3 py-2 rounded-md shadow z-50"
                        >
                          {/* <li>
                          <a href="#" className="flex items-center space-x-2">
                            <FaRegEye />
                            <span>View</span>
                          </a>
                        </li> */}
                          <li>
                            <button
                              onClick={() => openEditTenderModal(project)}
                              className="flex items-center space-x-2"
                            >
                              <FaEdit />
                              <span>Edit</span>
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => openAddContractModal(project)}
                              className="flex items-center space-x-2"
                            >
                              <IoAddCircleSharp className="-ml-[1px]" />
                              <span>Add Contract</span>
                            </button>
                          </li>
                          {/* <li>
                          <a href="#" className="flex items-center space-x-2">
                            <FaHistory />
                            <span>Project History</span>
                          </a>
                        </li> */}
                        </ul>
                      </div>
                    </td>
                    <td className="px-1 py-1 border text-xs">{project.year}</td>
                    <td className="px-1 py-1 border text-xs">
                      {project.project_name}
                    </td>
                    <td className="px-1 py-1 border text-xs">
                      {project.project_type === 1
                        ? "Service"
                        : project.project_type === 2
                        ? "Product"
                        : "Supply & Service"}
                    </td>
                    <td className="px-1 py-1 border text-xs">
                      {project.customer_name}
                    </td>
                    <td className="px-1 py-1 border text-xs">
                      {project.department_name}
                    </td>
                    <td className="px-1 py-1 border text-xs">
                      {project.hod_name}
                    </td>
                    <td className="px-1 py-1 border text-xs">
                      {project.pm_name}
                    </td>
                    <td className="px-1 py-1 border text-xs">
                      {project.phase}
                    </td>
                    <td className="px-1 py-1 border text-xs">
                      {project.project_code}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* Pagination control */}
          {renderPagination()}
        </>
      )}
      <AddProjectModal
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
        refetch={refetch}
      />
      <EditProjectModal
        editProjectModalOpen={editProjectModalOpen}
        setEditProjectModalOpen={setEditProjectModalOpen}
        project={selectedProject}
        refetch={refetch}
      />
      <ImportProjectsModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleImport}
      />
      <AddContractModal
        isAddContractModalOpen={isAddContractModalOpen}
        setIsAddContractModalOpen={setIsAddContractModalOpen}
        selectedProject={contractProject}
        refetch={refetch}
      />
      <ToastContainer></ToastContainer>
    </div>
  );
};

export default Projects;
