import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../firebase'; // adjust path to your config file

// Initialize Firebase only once
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const ShowCurrentUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // cleanup listener
  }, []);

  if (!user) {
    return <p>Not logged in</p>;
  }

  return (
    <div>
      <p>Logged in as: {user.email}</p>
    </div>
  );
};

export default ShowCurrentUser;
