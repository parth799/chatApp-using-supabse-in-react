import React from "react";
import { useParams } from "react-router-dom";

function Error() {
  const { message } = useParams();
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <h1>{message}</h1>
    </div>
  );
}

export default Error;
