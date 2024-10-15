import { useForm } from "react-hook-form";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { toast } from "react-toastify";
import useAllCustomer from "../Hooks/useAllCustomers";
import useAllProjects_Master from "../Hooks/useAllProjects_Master";
import useAllDepartment from "../Hooks/useAllDepartments";
import useAllEmployee from "../Hooks/useAllEmployees";

const AddProjectModal = ({ isAddModalOpen, setIsAddModalOpen, refetch }) => {
    const { register, handleSubmit, reset } = useForm();
    const axiosSecure = useAxiosSecure();
    const [allCustomers] = useAllCustomer();
    const [allProjects] = useAllProjects_Master();
    const [allDepartments] = useAllDepartment();
    const [allEmployees] = useAllEmployee();

    const onSubmit = async (data) => {
        console.log(data);

        const addProject = {
            project_name: data.project_name,
            customer_name: data.customer_name,
            project_category: data.project_category,
            department: data.department,
            hod: data.hod,
            pm: data.pm,
            year: data.year,
            phase: data.phase,
            project_code: data.project_code
        }
        const projectRes = await axiosSecure.post('/projects', addProject);
        console.log(projectRes.data);

        if (projectRes.data.insertedId) {
            reset();
            refetch();
            toast.success(`${data.project_name} added successfully`, { autoClose: 1500 });
            closeAddModal();
        }
    }

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    return (
        <>
            {/* Modal Component */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                        <button
                            onClick={closeAddModal}
                            className="absolute top-3 right-3 hover:text-gray-700 text-3xl"
                        >
                            ×
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Add New Project</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Project Name*
                                    </label>
                                    <select
                                        name="project_name"
                                        {...register("project_name", { required: true })}
                                        className="mt-1 block text-sm w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    >
                                        <option className="hidden" value="">Select Project</option>
                                        {allProjects
                                            .filter(projects_master => projects_master.project_status === "1") // Adjust based on data type
                                            .map((project) => (
                                                <option key={project._id} value={project.project_name}>
                                                    {project.project_name}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Customer Name*
                                    </label>
                                    <select
                                        name="customer_name"
                                        {...register("customer_name", { required: true })}
                                        className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    >
                                        <option className="hidden" value="">Select Customer</option>
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Project Category*
                                    </label>
                                    <select
                                        name="project_category"
                                        {...register("project_category", { required: true })}
                                        className="mt-1 block w-full text-sm border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    >
                                        <option className="hidden" value="">Select Category</option>
                                        <option value="1">Service</option>
                                        <option value="2">Product</option>
                                        <option value="3">Supply & Service</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Department*
                                    </label>
                                    <select
                                        name="department"
                                        {...register("department", { required: true })}
                                        className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    >
                                        <option className="hidden" value="">Select Department</option>
                                        {allDepartments.filter(department => department.department_status === "1").map((department) => (
                                            <option key={department._id} value={department.department_name}>
                                                {department.department_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        HOD*
                                    </label>
                                    <select
                                        name="hod"
                                        {...register("hod", { required: true })}
                                        className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    >
                                        <option className="hidden" value="">Select HOD</option>
                                        {allEmployees.map((employee) => (
                                            <option key={employee._id} value={employee.employee_name}>
                                                {employee.employee_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Project Manager*
                                    </label>
                                    <select
                                        name="pm"
                                        {...register("pm", { required: true })}
                                        className="mt-1 block text-sm w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    >
                                        <option className="hidden" value="">Select Project Manager</option>
                                        {allEmployees.map((employee) => (
                                            <option key={employee._id} value={employee.employee_name}>
                                                {employee.employee_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Year
                                    </label>
                                    <input
                                        type="number"
                                        name="year"
                                        {...register("year", { required: true })}
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
                                        Project Code*
                                    </label>
                                    {/* <select
                                        name="project_code"
                                        {...register("project_code", { required: true })}
                                        className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                    >
                                        <option className="hidden" value="">Select Code</option>
                                        {allProjects.map((project) => (
                                            <option key={project._id} value={project.project_code}>
                                                {project.project_code}
                                            </option>
                                        ))}
                                    </select> */}
                                    <input
                                        type="text"
                                        name="project_code"
                                        {...register("project_code", { required: true })}
                                        className="mt-1 text-sm block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={closeAddModal}
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
}

export default AddProjectModal;
