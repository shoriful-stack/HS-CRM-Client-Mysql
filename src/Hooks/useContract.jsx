import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useContract = (page, limit, filters) => {
    const axiosSecure = useAxiosSecure();

    const { data, isLoading: loading, refetch } = useQuery({
        queryKey: ["contracts", page, limit, filters],
        queryFn: async () => {
            // Passing filters as query params to the API
            const params = {
                page,
                limit,
                ...filters,
            };

            const res = await axiosSecure.get("/contracts", { params });
            return res.data;
        },
        keepPreviousData: true, // Keeps previous data while fetching new data
    });

    return [data, loading, refetch];
}

export default useContract;
