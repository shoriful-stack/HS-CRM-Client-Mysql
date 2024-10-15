import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

// This hook contain all the data of customer collection
const useAllEmployee = () => {
    const axiosSecure = useAxiosSecure();

    const { data: allEmployees = [], isPending: loading, refetch } = useQuery({
        queryKey: ["all-employees"],
        queryFn: async () => {
            const res = await axiosSecure.get("/employees/all");
            return res.data;
        },
    });

    return [allEmployees, loading, refetch];
}

export default useAllEmployee;