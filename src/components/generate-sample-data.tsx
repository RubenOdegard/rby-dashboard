"use client";
import { insertSampleData } from "@/app/actions";
import { useEffect } from "react";

const GenerateSampleData = () => {
	if (process.env.NODE_ENV === "development") {
		for (let i = 0; i < 10; i++) {
			insertSampleData();
		}
	}
	return null;
};

export default GenerateSampleData;
