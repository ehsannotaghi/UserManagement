import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'users.json');

async function readData() {
  const jsonData = await fs.readFile(dataFilePath, 'utf8');
  return JSON.parse(jsonData);
}

async function writeData(data) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

export default async function handler(req, res) {
  const { method } = req;
  let users = await readData();

  switch (method) {
    case 'GET':
      // Check user
      const { id } = req.query;
      if (id) {
        const user = users.find(user => user.id === parseInt(id));
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({ message: 'User not found' });
        }
      } else {
        res.status(200).json(users);
      }
      break;
    
    case 'POST':
      // Create user
      const newUser = req.body;
      newUser.id = users.length ? users[users.length - 1].id + 1 : 1;
      users.push(newUser);
      await writeData(users);
      res.status(201).json(newUser);
      break;
    
    case 'PUT':
      // Update user
      const updatedUser = req.body;
      const userIndex = users.findIndex(user => user.id === updatedUser.id);
      if (userIndex > -1) {
        users[userIndex] = updatedUser;
        await writeData(users);
        res.status(200).json(updatedUser);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
      break;
    
    case 'DELETE':
      // Delete user
      const { id: deleteId } = req.query;
      const filteredUsers = users.filter(user => user.id !== parseInt(deleteId));
      if (filteredUsers.length !== users.length) {
        users = filteredUsers;
        await writeData(users);
        res.status(200).json({ message: 'User deleted' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
      break;
    
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
