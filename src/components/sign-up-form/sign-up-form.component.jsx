import { useState } from 'react'

import FormInput from '../form-input/form-input.component'
import Button from '../button/button.component'

import { createAuthUserWithEmailAndPassword, createUserDocumentFromAuth } from '../../utils/firebase/firebase.utils'

import './sign-up-form.styles.scss'

const defaultFormFields = {
	displayName: '',
	email: '',
	password: '',
	confirmPassword: ''
}

const SignUpForm = () => {
	const [formFields, setFormFields] = useState(defaultFormFields)
	const { displayName, email, password, confirmPassword } = formFields

	const resetFormFields = () => {
		setFormFields(defaultFormFields)
	}

	const handleChange = (event) => {
		const { name, value } = event.target
		setFormFields({ ...formFields, [name]: value })
	}

	const handleSubmit = async (event) => {
		event.preventDefault()

		if (password !== confirmPassword) {
			alert('passwords do not match')
			return
		}

		try {
			const { user } = await createAuthUserWithEmailAndPassword(email, password)
			await createUserDocumentFromAuth(user, { displayName })
			resetFormFields()
		} catch (error) {
			if (error.code === 'auth/email-already-in-use') {
				alert('cannot create user, email already in use')
			} else {
				console.log('user creation encountered an error', error)
			}
		}
	}

	return (
		<div className='sign-up-container'>
			<h2>Don't have an account?</h2>
			<span>Sign up with your email and password</span>
			<form onSubmit={handleSubmit}>
				<FormInput label={'Display Name'} name='displayName' type='text' value={displayName} onChange={handleChange} required />
				<FormInput label={'Email'} name='email' type='email' value={email} onChange={handleChange} required />
				<FormInput label={'Password'} name='password' type='password' value={password} onChange={handleChange} required />
				<FormInput
					label={'Confirm Password'}
					name='confirmPassword'
					type='password'
					value={confirmPassword}
					onChange={handleChange}
					required
				/>

				<Button type='submit'>Sign Up</Button>
			</form>
		</div>
	)
}

export default SignUpForm
