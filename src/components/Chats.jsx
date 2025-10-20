import {
  arrayUnion,
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

const Chats = () => {
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
    try {
      // console.log('🔍 Loading friends for user:', currentUser.uid);
      const friendsDoc = doc(db, 'friends', currentUser.uid);
      const friendsSnapshot = await getDoc(friendsDoc);

      // console.log('Friends document exists:', friendsSnapshot.exists());

      if (friendsSnapshot.exists()) {
        const friendsData = friendsSnapshot.data();
        // console.log('Friends data:', friendsData);
        const friendsList = friendsData.friendsList || [];
        // console.log('Friends list loaded:', friendsList);
        // console.log('Friends count:', friendsList.length);
        setFriends(friendsList);
      } else {
        // console.log('No friends document found for user:', currentUser.uid);
        // console.log('Creating empty friends list');
        setFriends([]);
      }
    } catch (error) {
      // console.error('Error getting friends:', error);
      setFriends([]);
    }
  }, [currentUser?.uid]);

  useEffect(() => {
    const getChats = () => {
      // console.log('🚀 Setting up Firebase listener for user:', currentUser.uid);

      const unsub = onSnapshot(
        doc(db, 'userChats', currentUser.uid),
        doc => {
          const chatData = doc.data();

          // console.group('🔥 Firebase Listener Triggered');
          // console.log('Document exists:', doc.exists());
          // console.log('Chat data received:', chatData);
          // console.log('Chat data keys:', Object.keys(chatData || {}));
          // console.log('Chat data entries:', Object.entries(chatData || {}));

          // Check for lastMessage entries specifically
          // console.group('📝 LastMessage Entries');
          Object.entries(chatData || {}).forEach(([key, value]) => {
            if (key.includes('lastMessage')) {
              // console.log(`Found lastMessage key: ${key}`, value);
            }
          });
          // console.groupEnd();

          // console.groupEnd();
          setChats(chatData || {});
        },
        error => {
          // console.error('❌ Firebase listener error:', error);
        }
      );

      return () => {
        // console.log('🧹 Cleaning up Firebase listener');
        unsub();
      };
    };

    const getAllUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const users = [];
        querySnapshot.forEach(doc => {
          // Filter out the current user by both displayName and uid
          if (
            doc.id !== currentUser?.displayName &&
            doc.data().uid !== currentUser?.uid
          ) {
            users.push({ id: doc.id, ...doc.data() });
          }
        });
        // console.log(
        //   'Current user:',
        //   currentUser?.displayName,
        //   currentUser?.uid
        // );
        // console.log('All users (filtered):', users);
        setAllUsers(users);
      } catch (error) {
        // console.error('Error getting users:', error);
      }
    };

    if (currentUser?.uid) {
      // console.log('🔄 Loading all data for user:', currentUser.uid);
      getChats();
      getAllUsers();
      getFriends();
    }
  }, [currentUser?.uid, currentUser?.displayName, getFriends]);

  // Handle search term changes
  useEffect(() => {
    setShowSearchResults(searchTerm && searchTerm.length > 0);
  }, [searchTerm]);

  const handleSelect = u => {
    // console.log('Selecting user:', u);

    // Check if user object is valid
    if (!u || !u.uid) {
      // console.error('Invalid user object:', u);
      return;
    }

    // console.log('User displayName:', u.displayName);
    // console.log('User uid:', u.uid);
    dispatch({ type: 'CHANGE_USER', payload: u });
  };

  const addFriend = async user => {
    setAddingFriend(user.uid); // Set loading state for this specific user

    try {
      const friendsDoc = doc(db, 'friends', currentUser.uid);
      await setDoc(
        friendsDoc,
        {
          friendsList: arrayUnion(user),
        },
        { merge: true }
      );

      // Also add to the other user's friends list
      const otherUserFriendsDoc = doc(db, 'friends', user.uid);
      await setDoc(
        otherUserFriendsDoc,
        {
          friendsList: arrayUnion({
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
          }),
        },
        { merge: true }
      );

      // console.log('Friend added successfully');
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
      // console.error('Error adding friend:', error);
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
      // console.log('Removing friend:', friendToRemove.displayName);
      // console.log('Note: Chat history will be preserved');

      // Only remove from friends lists - DO NOT delete chat data
      // Remove from current user's friends list
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
        // console.log("Removed from current user's friends list");
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
        // console.log("Removed from other user's friends list");
      }

      // console.log('Friend removed successfully - chat history preserved');
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
    return friends.some(friend => friend.uid === user.uid);
  };

  return (
    <>
      <div className="overflow-y-auto h-screen p-3 mb-9 pb-20 mt-8">
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
                    onClick={() => !isAlreadyFriend(user) && addFriend(user)}
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

        {/* Debug Button - Remove this later */}
        {/* {!showSearchResults && (
          <div
            style={{ padding: '10px', background: '#f0f0f0', margin: '10px 0' }}
          >
            <button
              onClick={async () => {
                // console.log('🧪 Manual Firebase Test');
                try {
                  const docRef = doc(db, 'userChats', currentUser.uid);
                  const docSnap = await getDoc(docRef);
                  // console.log(
                  //   'Manual test - Document exists:',
                  //   docSnap.exists()
                  // );
                  // console.log('Manual test - Document data:', docSnap.data());

                  // Manually update the chats state
                  if (docSnap.exists()) {
                    // console.log('🔄 Manually updating chats state');
                    setChats(docSnap.data());
                  }
                } catch (error) {
                  // console.error('Manual test error:', error);
                }
              }}
              style={{ padding: '5px 10px', margin: '5px' }}
            >
              Test Firebase Connection
            </button>
            <button
              onClick={() => {
                // console.log('🔄 Force refresh chats');
                // Force re-run the getChats function
                const getChats = () => {
                  // console.log(
                  //   '🚀 Setting up Firebase listener for user:',
                  //   currentUser.uid
                  // );

                  const unsub = onSnapshot(
                    doc(db, 'userChats', currentUser.uid),
                    doc => {
                      const chatData = doc.data();
                      // console.log('🔥 Firebase Listener Triggered (Manual)');
                      // console.log('Document exists:', doc.exists());
                      // console.log('Chat data received:', chatData);
                      setChats(chatData || {});
                    },
                    error => {
                      // console.error('❌ Firebase listener error:', error);
                    }
                  );
                  return unsub;
                };

                if (currentUser?.uid) {
                  getChats();
                }
              }}
              style={{ padding: '5px 10px', margin: '5px' }}
            >
              Force Refresh Chats
            </button>
          </div>
        )} */}

        {/* Recent Chats */}
        {!showSearchResults && chats && Object.entries(chats).length > 0 && (
          <div className="recent-chats">
            <h3>Recent</h3>
            {/* {console.log('All chats entries:', Object.entries(chats))} */}
            {(() => {
              // console.group('📊 Parsing Chat Data');
              // console.log('🔍 Current friends state:', friends);
              // console.log('🔍 Friends count:', friends.length);
              // Parse the Firebase data structure
              const chatEntries = [];
              const processedChatIds = new Set();

              // console.group('🔍 Processing Chat Entries');
              Object.entries(chats).forEach(([key, value]) => {
                // Extract chatId from keys like "chatId.userInfo" or "chatId.date"
                const chatId = key.split('.')[0];

                if (!processedChatIds.has(chatId)) {
                  processedChatIds.add(chatId);

                  // Look for userInfo and date for this chatId
                  const userInfo = chats[`${chatId}.userInfo`];
                  const date = chats[`${chatId}.date`];

                  // Check both possible structures for lastMessage
                  let lastMessage = chats[`${chatId}.lastMessage`];
                  if (
                    !lastMessage &&
                    chats[chatId] &&
                    chats[chatId].lastMessage
                  ) {
                    lastMessage = chats[chatId].lastMessage;
                  }

                  // console.group(`💬 Chat ${chatId}`);
                  // console.log('userInfo:', userInfo);
                  // console.log('lastMessage:', lastMessage);
                  // console.log('date:', date);
                  // console.groupEnd();

                  if (userInfo) {
                    // Only include chats with users who are in the friends list
                    const isFriend = friends.some(
                      friend => friend.uid === userInfo.uid
                    );

                    // console.log(
                    //   `🔍 Checking friend status for ${userInfo.displayName}:`
                    // );
                    // console.log('  - User UID:', userInfo.uid);
                    // console.log('  - Is friend:', isFriend);
                    // console.log(
                    //   '  - Available friends:',
                    //   friends.map(f => `${f.displayName} (${f.uid})`)
                    // );

                    if (isFriend) {
                      chatEntries.push({
                        chatId,
                        userInfo,
                        date,
                        lastMessage,
                      });
                      // console.log(
                      //   `✅ Added ${userInfo.displayName} to recent chats`
                      // );
                    } else {
                      // console.log(
                      //   `❌ Skipped ${userInfo.displayName} - not in friends list`
                      // );
                    }
                  }
                }
              });
              // console.groupEnd();

              // console.group('📋 Final Chat Entries');
              // console.log('Parsed chat entries:', chatEntries);
              chatEntries.forEach(entry => {
                // console.group(
                //   `👤 Entry ${entry.chatId} (${entry.userInfo?.displayName})`
                // );
                // console.log('userInfo:', entry.userInfo?.displayName);
                // console.log('lastMessage:', entry.lastMessage);
                // console.log('hasText:', entry.lastMessage?.text);
                // console.log('textLength:', entry.lastMessage?.text?.length);
                // console.log('date:', entry.lastMessage?.date);
                // console.groupEnd();
              });
              // console.groupEnd();
              // console.groupEnd();

              if (chatEntries.length === 0) {
                // console.log('No chats passed filter, showing debug info');
                return (
                  <div
                    style={{
                      padding: '10px',
                      background: '#f0f0f0',
                      margin: '10px 0',
                    }}
                  >
                    <p>Debug: No recent chats found</p>
                    <p>Total chats: {Object.entries(chats).length}</p>
                    <p>Friends count: {friends.length}</p>
                    <p>
                      Friends:{' '}
                      {friends.map(f => f.displayName).join(', ') || 'None'}
                    </p>
                    <p>Chat keys: {Object.keys(chats).join(', ')}</p>
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

                  // console.group(`🎨 Rendering Chat: ${chatId}`);
                  // console.log('Chat data:', chat);
                  // console.log('User info:', userInfo);
                  // console.log('Display name:', userInfo?.displayName);
                  // console.log('Last message:', lastMessage);
                  // console.groupEnd();

                  return (
                    <div
                      className="userChat"
                      key={chatId}
                      onClick={() => {
                        // console.log('Clicking chat:', userInfo);
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
            {/* {console.log(
              'Rendering friends list, friends count:',
              friends.length
            )} */}
            {friends.map(friend => {
              // console.log('Rendering friend:', friend);
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
