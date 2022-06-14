import { initializeApp } from 'firebase/app';
import {
	getAuth,
	signInWithRedirect,
	signInWithPopup,
	GoogleAuthProvider,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
} from 'firebase/auth';

import { getFirestore, doc, setDoc, getDoc, collection, writeBatch, query, getDocs } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyAd2Jqd6fLU2PQeoHGmTEfcE7NvK5VkxVw',
	authDomain: 'crwn-clothing-db-80674.firebaseapp.com',
	projectId: 'crwn-clothing-db-80674',
	storageBucket: 'crwn-clothing-db-80674.appspot.com',
	messagingSenderId: '1052910298564',
	appId: '1:1052910298564:web:e34cb88a97cd7c97023091',
};

// const firebaseApp = initializeApp(firebaseConfig);
initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

provider.setCustomParameters({
	prompt: 'select_account',
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
export const signInWithGoogleRedirect = () => signInWithRedirect(auth, provider);

export const db = getFirestore();

export const addCollectionAndDocuments = async (collectionKey, objectsToAdd) => {
	const collectionRef = collection(db, collectionKey);
	const batch = writeBatch(db);

	objectsToAdd.forEach((object) => {
		const docRef = doc(collectionRef, object.title.toLowerCase());
		batch.set(docRef, object);
	});

	await batch.commit();
	console.log('done');
};

export const getCategoriesAndDocuments = async () => {
	const collectionRef = collection(db, 'categories');
	const q = query(collectionRef);

	const querySnapshot = await getDocs(q);
	return querySnapshot.docs.map((docSnapshot) => docSnapshot.data());
};

export const createUserDocumentFromAuth = async (userAuth, addtionalInformation = {}) => {
	if (!userAuth) return;
	const userDocRef = doc(db, 'users', userAuth.uid);

	const userSnapshot = await getDoc(userDocRef);

	if (!userSnapshot.exists()) {
		const { displayName, email } = userAuth;
		const createdAt = new Date();

		try {
			await setDoc(userDocRef, {
				displayName,
				email,
				createdAt,
				...addtionalInformation,
			});
		} catch (error) {
			console.log('error creating the user', error.message);
		}
	}

	return userSnapshot;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
	if (!email || !password) return;
	return createUserWithEmailAndPassword(auth, email, password);
};
export const signInAuthUserWithEmailAndPassword = async (email, password) => {
	if (!email || !password) return;
	return signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) => onAuthStateChanged(auth, callback);

export const getCurrentUser = () => {
	return new Promise((resolve, reject) => {
		const unsubscribe = onAuthStateChanged(
			auth,
			(userAuth) => {
				unsubscribe();
				resolve(userAuth);
			},
			reject
		);
	});
};
