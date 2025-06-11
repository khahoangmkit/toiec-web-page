import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { partName } = req.query;
  const filePath = path.join(process.cwd(), 'public', 'data_by_part', partName, 'data.json');

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    console.log("============", filePath)
    res.status(200).json(JSON.parse(data));
  } catch (err) {
    res.status(404).json({ error: 'Data not found' });
  }
}
nha