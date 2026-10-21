import { useOutletContext } from "react-router-dom";

/** Current customer for any route nested under /customers/:id */
export const useCustomer = () => useOutletContext();
