
import React, { useEffect, useState } from "react";

export default function App() {
  const [users, setUsers] = useState([]);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const [editId, setEditId] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/users");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.log(err);
      setMessage("Failed to fetch users");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setMessage("Please fill all fields");
      return;
    }

    if (editId === null) {
      await addUser();
    } else {
      await updateUser();
    }
  };

  const addUser = async () => {
    try {
      const response = await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to save user");
        return;
      }

      setMessage("User saved successfully");
      clearForm();
      fetchUsers();
    } catch (err) {
      console.log(err);
      setMessage("Backend connection failed");
    }
  };

  const updateUser = async () => {
    try {
      const response = await fetch(`http://localhost:8080/users/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to update user");
        return;
      }

      setMessage("User updated successfully");
      clearForm();
      fetchUsers();
    } catch (err) {
      console.log(err);
      setMessage("Backend connection failed");
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/users/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to delete user");
        return;
      }

      setMessage("User deleted successfully");
      fetchUsers();
    } catch (err) {
      console.log(err);
      setMessage("Backend connection failed");
    }
  };

  const startEdit = (user) => {
    setEditId(user.id);
    setUsername(user.username);
    setEmail(user.email);
    setPassword(user.password);
    setMessage("Editing user ID: " + user.id);
  };

  const clearForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setEditId(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);
// When component first appears on screen, run this code once.
// useEffect is used when you want to run some code after the component renders.
// useEffect(() => {
//   const timer = setInterval(() => {
//     setTime(new Date());
//   }, 1000);

//   return () => {
//     clearInterval(timer);
//   };
// }, []);

// This component only displays UI.

// But sometimes we need to do extra work like:

// fetch data from backend
// read from localStorage
// set document title
// start timer
// listen for events

// These are called side effects.
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-10">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6">
          Register User
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter username"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            value={username}
             maxLength={35}
  required
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="email"
            placeholder="Enter email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Enter password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg"
          >
            {editId === null ? "Submit" : "Update User"}
          </button>

          {editId !== null && (
            <button
              type="button"
              onClick={clearForm}
              className="w-full bg-gray-500 text-white py-2 rounded-lg"
            >
              Cancel Edit
            </button>
          )}
        </form>

        {message && (
          <p className="text-center mt-4 font-semibold">
            {message}
          </p>
        )}

        <h2 className="text-2xl font-bold mt-8 mb-4">
          Users From Database
        </h2>

        <div className="space-y-3">
          {users.length === 0 ? (
            <p>No users found</p>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="border rounded-lg p-4 bg-gray-50"
              >
                <div>
                  <p>
                    <bold>ID:</bold> {user.id}
                  </p>

                  <p>
                    <strong>Username:</strong> {user.username}
                  </p>

                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>

                  <p>
                    <strong>Password:</strong> {user.password}
                  </p>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => startEdit(user)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteUser(user.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
// npm create vite@latest
//  npm install express cors sqlite3