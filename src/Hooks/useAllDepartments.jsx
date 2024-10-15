import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

// This hook contain all the data of customer collection
const useAllDepartment = () => {
    const axiosSecure = useAxiosSecure();

    const { data: allDepartments = [], isPending: loading, refetch } = useQuery({
        queryKey: ["all-departments"],
        queryFn: async () => {
            const res = await axiosSecure.get("/departments/all");
            return res.data;
        },
    });

    return [allDepartments, loading, refetch];
}

export default useAllDepartment;