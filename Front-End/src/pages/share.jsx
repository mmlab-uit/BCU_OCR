import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function SharedJson() {
  const [jsonObject, setJsonObject] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const encodedJsonString = queryParams.get("objectfield");
    const jsonString = decodeURIComponent(encodedJsonString);
    const parsedObject = JSON.parse(jsonString);
    setJsonObject(parsedObject);
  }, [location]);

  return (
    <div className=" bg-gray-900 flex flex-col items-center h-screen pt-[10vw]">
        <h1 className="text-green-500">Shared JSON Data</h1>
        <pre className="text-green-500">{JSON.stringify(jsonObject, null, 2)}</pre>
    </div>
  );
}

export default SharedJson;
