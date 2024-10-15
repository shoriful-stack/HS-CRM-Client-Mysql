import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useProject = (page, limit, filters) => {
    const axiosSecure = useAxiosSecure();

    const { data, isLoading: loading, refetch } = useQuery({
        queryKey: ["projects", page, limit, filters],
        queryFn: async () => {
            // Build query parameters based on filters
            const params = {
                page,
                limit,
            };

            // Add filters to params if they are set
            if (filters.project_category) {
                params.project_category = filters.project_category;
            }

            if (filters.project_name) {
                params.project_name = filters.project_name;
            }

            if (filters.customer_name) {
                params.customer_name = filters.customer_name;
            }

            if (filters.department) {
                params.department = filters.department;
            }
            if (filters.pm) {
                params.pm = filters.pm;
            }

            if (filters.year) {
                params.year = filters.year;
            }

            if (filters.project_code) {
                params.project_code = filters.project_code;
            }

            const res = await axiosSecure.get("/projects", { params });
            return res.data;
        },
        keepPreviousData: true, // Keeps previous data while fetching new data
    });

    return [data, loading, refetch];
}

export default useProject;
