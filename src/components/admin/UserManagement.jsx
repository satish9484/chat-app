import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import { db } from '../../firebase';

const UserManagement = () => {
  const { currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  // const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersList = [];

      usersSnapshot.forEach(doc => {
        usersList.push({ id: doc.id, ...doc.data() });
      });

      setUsers(usersList);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = useCallback(() => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(
      user =>
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.uid?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  useEffect(() => {
    filterUsers();
  }, [filterUsers]);

  const handleEditUser = user => {
    setEditingUser({ ...user });
    setShowUserModal(true);
  };

  const handleDeleteUser = user => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      // Step 1: Delete Firestore data
      const deleteFirestorePromise = async () => {
        // Delete user from users collection
        await deleteDoc(doc(db, 'users', userToDelete.id));

        // Delete user's chats
        await deleteDoc(doc(db, 'userChats', userToDelete.id));

        // Delete user's friends
        await deleteDoc(doc(db, 'friends', userToDelete.id));

        return 'Firestore data deleted successfully';
      };

      await toast.promise(deleteFirestorePromise, {
        pending: '🗑️ Deleting user data...',
        success: '✅ User data deleted successfully!',
        error: '❌ Failed to delete user data',
      });

      // Step 2: Attempt to delete Firebase Authentication account
      // Note: This requires Firebase Admin SDK on backend for full functionality
      // For now, we'll show a warning about the limitation
      toast.warning(
        `⚠️ User data deleted from database. Note: Firebase Authentication account (${userToDelete.email}) still exists and user can still log in. To completely remove the user, use Firebase Admin SDK on your backend.`,
        {
          autoClose: 8000,
          position: 'top-center',
        }
      );

      setShowDeleteModal(false);
      setUserToDelete(null);
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    try {
      // Step 1: Update Firestore data
      const updateFirestorePromise = async () => {
        await updateDoc(doc(db, 'users', editingUser.id), {
          displayName: editingUser.displayName,
          email: editingUser.email,
          photoURL: editingUser.photoURL,
        });
        return 'Firestore data updated successfully';
      };

      await toast.promise(updateFirestorePromise, {
        pending: '💾 Updating user data...',
        success: '✅ User data updated successfully!',
        error: '❌ Failed to update user data',
      });

      // Step 2: Note about Firebase Authentication limitations
      toast.info(
        'ℹ️ User data updated in database. Note: Firebase Authentication profile updates require the user to be logged in or use Firebase Admin SDK on your backend.',
        {
          autoClose: 5000,
          position: 'top-center',
        }
      );

      setShowUserModal(false);
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const toggleUserStatus = async user => {
    try {
      await updateDoc(doc(db, 'users', user.id), {
        isActive: !user.isActive,
      });

      toast.success(
        `User ${user.isActive ? 'deactivated' : 'activated'} successfully`
      );
      loadUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Failed to update user status');
    }
  };

  if (isLoading) {
    return (
      <div className="user-management-loading">
        <div className="loading-spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h2>User Management</h2>
        <div className="user-actions">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={loadUsers} className="refresh-btn">
            Refresh
          </button>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Display Name</th>
              <th>Email</th>
              <th>UID</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <img
                    src={user.photoURL || '/default-avatar.png'}
                    alt={user.displayName}
                    className="user-avatar"
                  />
                </td>
                <td>{user.displayName}</td>
                <td>{user.email}</td>
                <td className="uid-cell">{user.uid}</td>
                <td>
                  <span
                    className={`status-badge ${user.isActive !== false ? 'active' : 'inactive'}`}
                  >
                    {user.isActive !== false ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="edit-btn"
                      title="Edit User"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => toggleUserStatus(user)}
                      className={`status-btn ${user.isActive !== false ? 'deactivate' : 'activate'}`}
                      title={
                        user.isActive !== false ? 'Deactivate' : 'Activate'
                      }
                    >
                      {user.isActive !== false ? '⏸️' : '▶️'}
                    </button>
                    {user.id !== currentUser?.uid && (
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="delete-btn"
                        title="Delete User"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      {showUserModal && editingUser && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit User</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  value={editingUser.displayName}
                  onChange={e =>
                    setEditingUser({
                      ...editingUser,
                      displayName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={e =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Photo URL</label>
                <input
                  type="url"
                  value={editingUser.photoURL || ''}
                  onChange={e =>
                    setEditingUser({ ...editingUser, photoURL: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setShowUserModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button onClick={handleSaveUser} className="btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div
          className="modal-overlay"
          onClick={() => setShowDeleteModal(false)}
        >
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete User</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete user{' '}
                <strong>{userToDelete.displayName}</strong>?
              </p>
              <p className="warning-text">
                This will delete all user data from the database including chats
                and friends.
              </p>
              <div className="limitation-notice">
                <h4>⚠️ Important Limitation:</h4>
                <p>
                  <strong>
                    Firebase Authentication account will NOT be deleted.
                  </strong>
                  The user will still be able to log in with their email and
                  password.
                </p>
                <p>
                  To completely remove the user, you need to implement Firebase
                  Admin SDK on your backend server.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button onClick={confirmDeleteUser} className="btn-danger">
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
