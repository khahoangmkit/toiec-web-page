import fs from 'fs';

export default async function handler(req, res) {
  const { testName } = req.query;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const filePath = `${apiUrl}/data/${testName}/data.json`;

  console.log(filePath, "test name ")
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    res.status(200).json({ data });
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ message: 'Failed to read or parse file' });
  }
}