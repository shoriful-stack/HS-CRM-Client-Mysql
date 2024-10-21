import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useProject = (page, limit, filters) => {
  const axiosSecure = useAxiosSecure();

  const {
    data,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["projects", page, limit, filters],
    queryFn: async () => {
      const params = {
        page,
        limit,
      };

      // Add filters to params if they are set
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          params[key] = filters[key];
        }
      });

      const res = await axiosSecure.get("/projects", { params });
      return res.data;
    },
    keepPreviousData: true, // Keeps previous data while fetching new data
  });

  return [data, loading, refetch];
};

export default useProject;
