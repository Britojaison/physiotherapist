// src/api.js
const BASE_URL = 'http://localhost:3000/api';

export async function fetchCategories() {
  try {
    const response = await fetch(`${BASE_URL}/exercises`);
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export const fetchSavedPrograms = async () => {
  const response = await fetch(`${BASE_URL}/programs`);
  return response.json();
};

export const saveProgram = async (program) => {
  const response = await fetch(`${BASE_URL}/programs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(program),
  });
  return response.json();
};
