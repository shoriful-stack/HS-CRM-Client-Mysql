import { useForm } from "react-hook-form";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { useEffect } from "react";
import useAllCustomer from "../Hooks/useAllCustomers";
import useAllProjects_Master from "../Hooks/useAllProjects_Master";
import useAllDepartment from "../Hooks/useAllDepartments";
import useAllEmployee from "../Hooks/useAllEmployees";

const EditProjectModal = ({
  editProjectModalOpen,
  setEditProjectModalOpen,
  project,
  refetch,
}) => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const axiosSecure = useAxiosSecure();
  const [allProjects] = useAllProjects_Master();
  const [allDepartments] = useAllDepartment();
  const [allEmployees] = useAllEmployee();
  const [allCustomers] = useAllCustomer(); // This hook contain all the data of customers collection

  useEffect(() => {
    if (project) {
      // Set form values with customer data when modal opens
      setValue("project_name", project.project_name);
      setValue("customer_name", project.customer_name);
      setValue("project_type", project.project_type);
      setValue("department_name", project.department_name);
      setValue("hod_name", project.hod_name);
      setValue("pm_name", project.pm_name);
      setValue("year", project.year);
      setValue("phase", project.phase);
      setValue("project_code", project.project_code);
    }
  }, [project, setValue]);
  const closeEditProjectModal = () => {
    setEditProjectModalOpen(false);
  };
  const onSubmit = async (data) => {
    console.log(data);

    const updatedProject = {
      project_name: data.project_name,
      customer_name: data.customer_name,
      project_type: data.project_type,
      department_name: data.department_name,
      hod_name: data.hod_name,
      pm_name: data.pm_name,
      year: data.year,
      phase: data.phase,
      project_code: data.project_code,
    };
    try {
      const projectRes = await axiosSecure.patch(
        `/projects/${project.id}`,
        updatedProject
      );
      console.log(projectRes.data);

      if (projectRes?.data?.changedRows > 0) {
        reset();
        refetch();
        toast.success(`${data.project_name} updated successfully`, {
          autoClose: 1500,
        });
        closeEditProjectModal();
      }else {
        reset();
        // Handle the case where the update was not successful
        toast.info("No changes made", { autoClose: 1500 });
        closeEditProjectModal();
      }
    } catch (error) {
      console.error("Failed to update project:", error);
      toast.error("This project already exists", { autoClose: 1500 });
    }
  };

  return (
    <>
      {/* Modal Component */}
      {editProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={closeEditProjectModal}
              className="absolute top-3 right-3 hover:text-gray-700 text-3xl"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Project</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Project Name
                  </label>
                  <select
                    name="project_name"
                    {...register("project_name")}
                    className="mt-1 block text-sm w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option className="hidden" value="">
                      Select Project
                    </option>
                    {allProjects.map((project) => (
                      <option key={project.id} value={project.project_name}>
                        {project.project_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Customer Name
                  </label>
                  <select
                    name="customer_name"
                    {...register("customer_name")}
                    className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option className="hidden" value="">
                      Select Customer
                    </option>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Project Category
                  </label>
                  <select
                    name="project_type"
                    {...register("project_type")}
                    className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option className="hidden" value="">
                      Select Category
                    </option>
                    <option value="1">Service</option>
                    <option value="2">Product</option>
                    <option value="3">Supply & Service</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <select
                    name="department_name"
                    {...register("department_name")}
                    className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option className="hidden" value="">
                      Select Department
                    </option>
                    {allDepartments
                      .filter(
                        (department) => department.department_status === 1
                      )
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
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    HOD
                  </label>
                  <select
                    name="hod_name"
                    {...register("hod_name")}
                    className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option className="hidden" value="">
                      Select HOD
                    </option>
                    {allEmployees.map((employee) => (
                      <option key={employee.id} value={employee.employee_name}>
                        {employee.employee_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    PM
                  </label>
                  <select
                    name="pm_name"
                    {...register("pm_name")}
                    className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option className="hidden" value="">
                      Select PM
                    </option>
                    {allEmployees.map((employee) => (
                      <option key={employee.id} value={employee.employee_name}>
                        {employee.employee_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Year
                  </label>
                  <input
                    type="number"
                    name="year"
                    {...register("year")}
                    className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phase
                  </label>
                  <input
                    type="text"
                    name="phase"
                    {...register("phase")}
                    className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Project Code
                  </label>
                  <input
                    type="text"
                    name="project_code"
                    {...register("project_code")}
                    className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeEditProjectModal}
                  className="mr-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-teal-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProjectModal;
