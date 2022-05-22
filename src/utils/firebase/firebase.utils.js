import { initializeApp } from 'firebase/app'
import {
	getAuth,
	signInWithRedirect,
	signInWithPopup,
	GoogleAuthProvider,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword
} from 'firebase/auth'

import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'

const firebaseConfig = {
	apiKey: 'AIzaSyAd2Jqd6fLU2PQeoHGmTEfcE7NvK5VkxVw',
	authDomain: 'crwn-clothing-db-80674.firebaseapp.com',
	projectId: 'crwn-clothing-db-80674',
	storageBucket: 'crwn-clothing-db-80674.appspot.com',
	messagingSenderId: '1052910298564',
	appId: '1:1052910298564:web:e34cb88a97cd7c97023091'
}

const firebaseApp = initializeApp(firebaseConfig)

const provider = new GoogleAuthProvider()

provider.setCustomParameters({
	prompt: 'select_account'
})

export const auth = getAuth()
export const signInWithGooglePopup = () => signInWithPopup(auth, provider)
export const signInWithGoogleRedirect = () => signInWithRedirect(auth, provider)

export const db = getFirestore()

export const createUserDocumentFromAuth = async (userAuth, addtionalInformation = {}) => {
	if (!userAuth) return
	const userDocRef = doc(db, 'users', userAuth.uid)

	const userSnapshot = await getDoc(userDocRef)

	if (!userSnapshot.exists()) {
		const { displayName, email } = userAuth
		const createdAt = new Date()

		try {
			await setDoc(userDocRef, {
				displayName,
				email,
				createdAt,
				...addtionalInformation
			})
		} catch (error) {
			console.log('error creating the user', error.message)
		}
	}

	return userDocRef
}

export const createAuthUserWithEmailAndPassword = async (email, password) => {
	if (!email || !password) return
	return createUserWithEmailAndPassword(auth, email, password)
}
export const signInAuthUserWithEmailAndPassword = async (email, password) => {
	if (!email || !password) return
	return createUserWithEmailAndPassword(auth, email, password)
}
