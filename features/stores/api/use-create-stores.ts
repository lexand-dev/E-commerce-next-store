"use client";
import axios from "axios";
import { useState } from "react";

interface CreateStore {
  values: string;
}

export const useCreateStore = ({ values }: CreateStore) => {
  const [loading, setLoading] = useState(false);

  const response = async () => {
    const fetch = await axios.post("/api/stores", values);
  };

  try {
    setLoading(true);
    response()
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false)
  }

  return {
    loading,
  }
};
