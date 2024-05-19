import { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    username: '',
    walletaddress: '',
    email: '',
    isemailverified: '0',
    token: '',
    referer: '',
    RolePremission: '',
    coins: '0',
    Tether: '0',
  });
  const [isUpdate, setIsUpdate] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isUpdate) {
        await axios.put('/api/users', formData);
        setMessage('User updated successfully!');
      } else {
        await axios.post('/api/users', formData);
        setMessage('User created successfully!');
      }
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/users?id=${id}`);
      setMessage('User deleted successfully!');
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (user) => {
    setFormData(user);
    setIsUpdate(true);
  };

  const resetForm = () => {
    setFormData({
      id: '',
      username: '',
      walletaddress: '',
      email: '',
      isemailverified: '0',
      token: '',
      referer: '',
      RolePremission: '',
      coins: '0',
      Tether: '0',
    });
    setIsUpdate(false);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const user = users.find(u => u.email === formData.email && u.token === formData.token);
      if (user) {
        setMessage('Sign in successful!');
      } else {
        setMessage('Invalid email or token.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>User Management</h1>
      <form onSubmit={isUpdate ? handleSubmit : handleSignIn}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input type="text" className="form-control" name="username" value={formData.username} onChange={handleInputChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Wallet Address</label>
          <input type="text" className="form-control" name="walletaddress" value={formData.walletaddress} onChange={handleInputChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" name="email" value={formData.email} onChange={handleInputChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Token</label>
          <input type="text" className="form-control" name="token" value={formData.token} onChange={handleInputChange} required />
        </div>
        {isUpdate && (
          <>
            <div className="mb-3">
              <label className="form-label">Referer</label>
              <input type="text" className="form-control" name="referer" value={formData.referer} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Role Permission</label>
              <input type="text" className="form-control" name="RolePremission" value={formData.RolePremission} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Coins</label>
              <input type="text" className="form-control" name="coins" value={formData.coins} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Tether</label>
              <input type="text" className="form-control" name="Tether" value={formData.Tether} onChange={handleInputChange} />
            </div>
          </>
        )}
        <button type="submit" className="btn btn-primary">
          {isUpdate ? 'Update User' : 'Sign In'}
        </button>
        {isUpdate && (
          <button type="button" className="btn btn-secondary ms-2" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>
      <p className="mt-3">{message}</p>
      <h2 className="mt-5">Users List</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Wallet Address</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.walletaddress}</td>
              <td>{user.email}</td>
              <td>
                <button className="btn btn-warning btn-sm" onClick={() => handleEdit(user)}>
                  Edit
                </button>
                <button className="btn btn-danger btn-sm ms-2" onClick={() => handleDelete(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
