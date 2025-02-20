import { useEffect, useState } from "react";
import {
  API_BASE_URL,
  SPREADSHEET_ID,
  INVENTORY_WORKSHEET_NAME,
} from "@/lib/constants";

function Dashboard({ token }: { token: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/${SPREADSHEET_ID}/${INVENTORY_WORKSHEET_NAME}/read`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        setApiResponse(data);
        console.log("API response", data);
      } catch (error) {
        console.log("Failed to fetch products", error);
        setApiResponse(null);
      }
      setIsLoading(false);
    };
    fetchProducts();
  }, [token]);
  return <div>Dashboard</div>;
}
export default Dashboard;
