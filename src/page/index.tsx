import React from "react";
import SearchBar from "@/components/SearchBar";
import Map from "@/components/Map";
import "./index.scss";

const Page: React.FC = () => {
  return (
    <div className="page">
      <Map />
      <SearchBar />
    </div>
  );
};

export default Page;
