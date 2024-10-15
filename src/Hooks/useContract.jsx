import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useContract = (page, limit, filters) => {
    const axiosSecure = useAxiosSecure();

    const { data, isLoading: loading, refetch } = useQuery({
        queryKey: ["contracts", page, limit, filters],
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

            if (filters.contractStatus) {
                params.contractStatus = filters.contractStatus;
            }

            if (filters.project_name) {
                params.project_name = filters.project_name;
            }

            if (filters.customer_name) {
                params.customer_name = filters.customer_name;
            }

            if (filters.signingDateFrom) {
                params.signingDateFrom = filters.signingDateFrom;
            }

            if (filters.signingDateTo) {
                params.signingDateTo = filters.signingDateTo;
            }

            if (filters.effectiveDateFrom) {
                params.effectiveDateFrom = filters.effectiveDateFrom;
            }

            if (filters.effectiveDateTo) {
                params.effectiveDateTo = filters.effectiveDateTo;
            }

            if (filters.closingDateFrom) {
                params.closingDateFrom = filters.closingDateFrom;
            }

            if (filters.closingDateTo) {
                params.closingDateTo = filters.closingDateTo;
            }

            const res = await axiosSecure.get("/contracts", { params });
            return res.data;
        },
        keepPreviousData: true, // Keeps previous data while fetching new data
    });

    return [data, loading, refetch];
}

export default useContract;
