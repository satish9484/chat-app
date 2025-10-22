import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { db } from '../firebase';
import { log, MODULE_FLAGS } from '../utils/logger';
import { getQuickConfig } from '../utils/quickLoggerConfig';

/**
 * Chats Component - Manages friend list and recent chats
 *
 * Uses professional logging system with granular control:
 * - Individual module flags for specific functions
 * - Log grouping for better organization
 * - Performance tracking
 * - Production-safe logging
 */

const Chats = () => {
  // Initialize logger with quick configuration
  useEffect(() => {
    log.updateConfig(getQuickConfig());
    log.info(MODULE_FLAGS.CHAT, '🚀 Chats component initialized');
  }, []);

  const [chats, setChats] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [addingFriend, setAddingFriend] = useState(null); // Track which user is being added
  const [removingFriend, setRemovingFriend] = useState(null); // Track which user is being removed
  const [addedFriend, setAddedFriend] = useState(null); // Track which user was just added
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Show confirmation modal
  const [friendToRemove, setFriendToRemove] = useState(null); // Friend to be removed

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const getFriends = useCallback(async () => {
    log.timeStart(MODULE_FLAGS.GET_FRIENDS, 'getFriends');

    try {
      log.debug(
        MODULE_FLAGS.GET_FRIENDS,
        'Loading friends for user:',
        currentUser.uid
      );

      const friendsDoc = doc(db, 'friends', currentUser.uid);
      const friendsSnapshot = await getDoc(friendsDoc);

      log.debug(
        MODULE_FLAGS.GET_FRIENDS,
        'Friends document exists:',
        friendsSnapshot.exists()
      );

      if (friendsSnapshot.exists()) {
        const friendsData = friendsSnapshot.data();
        log.debug(MODULE_FLAGS.GET_FRIENDS, 'Friends data:', friendsData);
        const friendsList = friendsData.friendsList || [];
        log.debug(
          MODULE_FLAGS.GET_FRIENDS,
          'Friends list loaded:',
          friendsList
        );
        log.debug(
          MODULE_FLAGS.GET_FRIENDS,
          'Friends count:',
          friendsList.length
        );
        setFriends(friendsList);
        log.firebase('READ', 'friends', currentUser.uid, true);
      } else {
        log.debug(
          MODULE_FLAGS.GET_FRIENDS,
          'No friends document found for user:',
          currentUser.uid
        );
        log.debug(MODULE_FLAGS.GET_FRIENDS, 'Creating empty friends list');
        setFriends([]);
        log.firebase(
          'READ',
          'friends',
          currentUser.uid,
          false,
          'Document not found'
        );
      }
    } catch (error) {
      log.error(MODULE_FLAGS.GET_FRIENDS, 'Error getting friends:', error);
      setFriends([]);
    } finally {
      log.timeEnd(MODULE_FLAGS.GET_FRIENDS, 'getFriends');
    }
  }, [currentUser?.uid]);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(
        doc(db, 'userChats', currentUser.uid),
        doc => {
          const chatData = doc.data();
          setChats(chatData || {});
        },
        error => {
          log.error(
            MODULE_FLAGS.FIREBASE,
            '❌ Firebase listener error:',
            error
          );
        }
      );

      return () => {
        unsub();
      };
    };

    const getAllUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const users = [];
        querySnapshot.forEach(doc => {
          const userData = doc.data();
          // Filter out the current user by uid
          if (userData.uid !== currentUser?.uid) {
            users.push({ id: doc.id, ...userData });
          }
        });
        setAllUsers(users);
      } catch (error) {
        log.error(MODULE_FLAGS.GET_USERS, 'Error getting users:', error);
      }
    };

    if (currentUser?.uid) {
      getChats();
      getAllUsers();
      getFriends();
    }
  }, [currentUser?.uid, currentUser?.displayName, getFriends]);

  // Handle search term changes
  useEffect(() => {
    setShowSearchResults(searchTerm && searchTerm.length > 0);
  }, [searchTerm]);

  // Debug friends state changes
  useEffect(() => {
    log.debug(MODULE_FLAGS.FRIENDS, 'Friends state changed:', friends);
    log.debug(MODULE_FLAGS.FRIENDS, 'Friends count:', friends.length);
  }, [friends]);

  const handleSelect = u => {
    // Check if user object is valid
    if (!u || !u.uid) {
      log.error(MODULE_FLAGS.CHAT, 'Invalid user object:', u);
      return;
    }

    dispatch({ type: 'CHANGE_USER', payload: u });
  };

  const addFriend = async user => {
    log.debug(
      MODULE_FLAGS.ADD_FRIEND,
      'Adding friend:',
      user.displayName,
      'UID:',
      user.uid
    );
    log.debug(MODULE_FLAGS.ADD_FRIEND, 'User object:', user);

    setAddingFriend(user.uid); // Set loading state for this specific user

    try {
      const friendsDoc = doc(db, 'friends', currentUser.uid);
      log.debug(
        MODULE_FLAGS.ADD_FRIEND,
        'Adding to friends document:',
        friendsDoc.path
      );

      // Get current friends list
      const friendsSnapshot = await getDoc(friendsDoc);
      let currentFriendsList = [];

      if (friendsSnapshot.exists()) {
        const friendsData = friendsSnapshot.data();
        currentFriendsList = friendsData.friendsList || [];
        log.debug(
          MODULE_FLAGS.ADD_FRIEND,
          'Current friends list:',
          currentFriendsList
        );
      }

      // Check if friend already exists
      const friendExists = currentFriendsList.some(
        friend => friend.uid === user.uid
      );
      if (friendExists) {
        log.debug(MODULE_FLAGS.ADD_FRIEND, 'Friend already exists in list');
        toast.info(`${user.displayName} is already your friend!`);
        return;
      }

      // Add new friend to the list
      const updatedFriendsList = [...currentFriendsList, user];
      log.debug(
        MODULE_FLAGS.ADD_FRIEND,
        'Updated friends list:',
        updatedFriendsList
      );

      await setDoc(friendsDoc, {
        friendsList: updatedFriendsList,
      });
      log.debug(
        MODULE_FLAGS.ADD_FRIEND,
        'Successfully added friend to current user document'
      );

      // Also add to the other user's friends list
      const otherUserFriendsDoc = doc(db, 'friends', user.uid);

      const currentUserFriendData = {
        uid: currentUser.uid,
        displayName: currentUser.displayName,
        email: currentUser.email,
        photoURL: currentUser.photoURL,
      };

      // Get other user's current friends list
      const otherUserSnapshot = await getDoc(otherUserFriendsDoc);
      let otherUserFriendsList = [];

      if (otherUserSnapshot.exists()) {
        const otherUserData = otherUserSnapshot.data();
        otherUserFriendsList = otherUserData.friendsList || [];
      }

      // Check if current user already exists in other user's list
      const currentUserExists = otherUserFriendsList.some(
        friend => friend.uid === currentUser.uid
      );
      if (!currentUserExists) {
        // Add current user to the other user's friends list
        const updatedOtherUserFriendsList = [
          ...otherUserFriendsList,
          currentUserFriendData,
        ];

        await setDoc(otherUserFriendsDoc, {
          friendsList: updatedOtherUserFriendsList,
        });
      } else {
      }

      toast.success(`${user.displayName} added as friend!`);

      await getFriends(); // Refresh friends list

      // Show success state
      setAddedFriend(user.uid);

      // Automatically start a chat with the new friend
      dispatch({ type: 'CHANGE_USER', payload: user });

      // Reset success state after 3 seconds
      setTimeout(() => {
        setAddedFriend(null);
      }, 3000);
    } catch (error) {
      log.error(MODULE_FLAGS.ADD_FRIEND, 'Error adding friend:', error);
      toast.error(`Failed to add ${user.displayName} as friend`);
    } finally {
      setAddingFriend(null); // Clear loading state
    }
  };

  const showRemoveConfirmation = friend => {
    setFriendToRemove(friend);
    setShowConfirmModal(true);
  };

  const confirmRemoveFriend = async () => {
    if (!friendToRemove) return;

    setRemovingFriend(friendToRemove.uid); // Set loading state for this specific friend
    setShowConfirmModal(false); // Hide modal

    try {
      const friendsDoc = doc(db, 'friends', currentUser.uid);
      const friendsSnapshot = await getDoc(friendsDoc);

      if (friendsSnapshot.exists()) {
        const friendsData = friendsSnapshot.data();
        const updatedFriendsList = friendsData.friendsList.filter(
          f => f.uid !== friendToRemove.uid
        );

        await setDoc(friendsDoc, {
          friendsList: updatedFriendsList,
        });
      }

      // Remove from the other user's friends list
      const otherUserFriendsDoc = doc(db, 'friends', friendToRemove.uid);
      const otherUserSnapshot = await getDoc(otherUserFriendsDoc);

      if (otherUserSnapshot.exists()) {
        const otherUserFriendsData = otherUserSnapshot.data();
        const updatedOtherUserFriendsList =
          otherUserFriendsData.friendsList.filter(
            f => f.uid !== currentUser.uid
          );

        await setDoc(otherUserFriendsDoc, {
          friendsList: updatedOtherUserFriendsList,
        });
      }

      toast.success(`${friendToRemove.displayName} removed from friends list`);

      // Reset chat context if currently chatting with the removed friend
      if (friendToRemove.uid === currentUser?.uid) {
        dispatch({ type: 'RESET_CHAT' });
      }

      // Refresh friends list
      await getFriends();

      // No need to refresh chats - they remain intact
    } catch (error) {
      // console.error('Error removing friend:', error);
      toast.error(
        `Failed to remove ${friendToRemove.displayName} from friends list`
      );
    } finally {
      setRemovingFriend(null); // Clear loading state
    }
  };

  const filteredUsers = allUsers.filter(user =>
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if a user is already a friend
  const isAlreadyFriend = user => {
    const isFriend = friends.some(friend => friend.uid === user.uid);
    log.debug(
      MODULE_FLAGS.FRIENDS,
      `Checking if ${user.displayName} is friend:`,
      isFriend
    );
    log.debug(
      MODULE_FLAGS.FRIENDS,
      'Current friends:',
      friends.map(f => f.displayName)
    );
    log.debug(MODULE_FLAGS.FRIENDS, 'User UID:', user.uid);
    log.debug(
      MODULE_FLAGS.FRIENDS,
      'Friends UIDs:',
      friends.map(f => f.uid)
    );
    return isFriend;
  };

  return (
    <>
      <div className="overflow-y-auto h-screen p-3 pb-20 ">
        {/* Search Input */}
        <div className="search-form">
          <input
            type="text"
            placeholder="Search for friends..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Search Results */}
        {showSearchResults && (
          <div className="search-results">
            <h3>Search Results</h3>
            {filteredUsers.map(user => (
              <div className="userChat" key={user.uid}>
                <div className="user-avatar-section">
                  <img
                    src={user.photoURL || '/default-avatar.png'}
                    alt={user.displayName || 'User'}
                    className="user-avatar"
                  />
                  <button
                    className={`add-friend-btn ${
                      isAlreadyFriend(user) ? 'already-friends-btn' : ''
                    } ${addingFriend === user.uid ? 'adding-friend-btn' : ''} ${
                      addedFriend === user.uid ? 'added-friend-btn' : ''
                    }`}
                    onClick={() => {
                      log.debug(
                        MODULE_FLAGS.ADD_FRIEND,
                        'Button clicked for user:',
                        user.displayName
                      );
                      log.debug(
                        MODULE_FLAGS.ADD_FRIEND,
                        'Is already friend:',
                        isAlreadyFriend(user)
                      );
                      if (!isAlreadyFriend(user)) {
                        log.debug(
                          MODULE_FLAGS.ADD_FRIEND,
                          'Calling addFriend...'
                        );
                        addFriend(user);
                      } else {
                        log.debug(
                          MODULE_FLAGS.ADD_FRIEND,
                          'User is already a friend, not adding'
                        );
                      }
                    }}
                    disabled={
                      addingFriend === user.uid ||
                      addedFriend === user.uid ||
                      isAlreadyFriend(user)
                    }
                  >
                    {addingFriend === user.uid ? (
                      <div className="loading-spinner">
                        <div className="spinner"></div>
                        <span>Adding...</span>
                      </div>
                    ) : addedFriend === user.uid ? (
                      <div className="success-state">
                        <span>✓ Added</span>
                      </div>
                    ) : isAlreadyFriend(user) ? (
                      <div className="already-friends-state">
                        <span>✓ Friends</span>
                      </div>
                    ) : (
                      'Add Friend'
                    )}
                  </button>
                </div>
                <div className="userChatInfo">
                  <span className="user-name">{user.displayName}</span>
                  <p className="user-email">{user.email}</p>
                </div>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <p className="no-results">
                No users found matching "{searchTerm}"
              </p>
            )}
          </div>
        )}

        {/* Recent Chats */}
        {!showSearchResults && chats && Object.entries(chats).length > 0 && (
          <div className="recent-chats">
            <h3>Recent</h3>
            {(() => {
              const chatEntries = [];
              const processedChatIds = new Set();

              Object.entries(chats).forEach(([key, value]) => {
                // Extract chatId from keys like "chatId.userInfo" or "chatId.date"
                const chatId = key.split('.')[0];

                if (!processedChatIds.has(chatId)) {
                  processedChatIds.add(chatId);

                  // Look for userInfo and date for this chatId
                  let userInfo = chats[`${chatId}.userInfo`];
                  let date = chats[`${chatId}.date`];

                  // Fallback: check if the chat data itself contains userInfo
                  if (
                    !userInfo &&
                    chats[chatId] &&
                    typeof chats[chatId] === 'object'
                  ) {
                    userInfo = chats[chatId].userInfo;
                    date = chats[chatId].date;
                  }

                  // Check both possible structures for lastMessage
                  let lastMessage = chats[`${chatId}.lastMessage`];
                  if (
                    !lastMessage &&
                    chats[chatId] &&
                    chats[chatId].lastMessage
                  ) {
                    lastMessage = chats[chatId].lastMessage;
                  }

                  if (userInfo) {
                    // TEMPORARY: Show all chats for debugging
                    // TODO: Re-enable friend filtering once we identify the issue
                    const isFriend = friends.some(friend => {
                      // Match by UID (primary method)
                      if (friend.uid === userInfo.uid) return true;
                      // Match by displayName (fallback)
                      if (friend.displayName === userInfo.displayName)
                        return true;
                      // Match by email (fallback)
                      if (friend.email === userInfo.email) return true;
                      return false;
                    });

                    if (isFriend) {
                      chatEntries.push({
                        chatId,
                        userInfo,
                        date,
                        lastMessage,
                      });
                    }
                  }
                }
              });

              if (chatEntries.length === 0) {
                return (
                  <div
                    style={{
                      padding: '10px',
                      background: '#f0f0f0',
                      margin: '10px 0',
                    }}
                  >
                    <p>No recent chats found</p>
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#666',
                        marginTop: '10px',
                      }}
                    >
                      Recent chats only show friends you've added. Add friends
                      using the search above.
                    </p>
                  </div>
                );
              }

              return chatEntries
                .sort((a, b) => {
                  // Sort by last message date if available, otherwise by chat creation date
                  const aLastMessage =
                    a.lastMessage?.date?.seconds || a.date?.seconds || 0;
                  const bLastMessage =
                    b.lastMessage?.date?.seconds || b.date?.seconds || 0;
                  return bLastMessage - aLastMessage;
                })
                .map(chat => {
                  const { chatId, userInfo, lastMessage } = chat;

                  return (
                    <div
                      className="userChat"
                      key={chatId}
                      onClick={() => {
                        if (userInfo) {
                          handleSelect(userInfo);
                        }
                      }}
                    >
                      <img
                        src={userInfo?.photoURL || '/default-avatar.png'}
                        alt=""
                      />
                      <div className="userChatInfo">
                        <span>{userInfo?.displayName || 'Unknown User'}</span>
                        <p>
                          {lastMessage &&
                          lastMessage.text &&
                          lastMessage.text.trim() !== '' ? (
                            <>
                              <span className="message-text">
                                {lastMessage.text}
                              </span>
                              {lastMessage.date && (
                                <span className="message-time">
                                  {new Date(
                                    lastMessage.date.seconds * 1000
                                  ).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="no-messages">No messages yet</span>
                          )}
                        </p>
                      </div>
                    </div>
                  );
                });
            })()}
          </div>
        )}

        {/* Friends List - Always visible when not searching */}
        {!showSearchResults && (
          <div className="friends-list">
            <h3>Friends</h3>
            {friends.map(friend => {
              return (
                <div className="userChat" key={friend.uid}>
                  <img src={friend.photoURL || '/default-avatar.png'} alt="" />
                  <div
                    className="userChatInfo"
                    onClick={() => handleSelect(friend)}
                  >
                    <span>{friend.displayName || 'Unknown Friend'}</span>
                    <p>Start a conversation</p>
                  </div>
                  <button
                    className={`remove-friend-btn ${
                      removingFriend === friend.uid ? 'removing-friend-btn' : ''
                    }`}
                    onClick={() => showRemoveConfirmation(friend)}
                    disabled={removingFriend === friend.uid}
                    title="Remove friend"
                  >
                    {removingFriend === friend.uid ? (
                      <div className="loading-spinner">
                        <div className="spinner"></div>
                        <span>Removing...</span>
                      </div>
                    ) : (
                      '✕'
                    )}
                  </button>
                </div>
              );
            })}
            {friends.length === 0 && (
              <div className="no-friends">
                <p>No friends yet</p>
                <p
                  style={{
                    fontSize: '12px',
                    color: '#666',
                    marginTop: '10px',
                  }}
                >
                  Use the search field above to find and add friends
                </p>
              </div>
            )}
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Remove Friend</h3>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to remove{' '}
                  <strong>{friendToRemove?.displayName}</strong> from your
                  friends list?
                </p>
                <p className="warning-text">
                  This will remove them from your friends list. Chat history
                  will be preserved.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn-cancel"
                  onClick={() => {
                    setShowConfirmModal(false);
                    setFriendToRemove(null);
                  }}
                  disabled={removingFriend}
                >
                  Cancel
                </button>
                <button
                  className="btn-confirm"
                  onClick={confirmRemoveFriend}
                  disabled={removingFriend}
                >
                  {removingFriend ? 'Removing...' : 'Remove Friend'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Chats;
