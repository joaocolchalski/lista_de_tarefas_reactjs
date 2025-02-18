import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../../firebaseConnection'
import { createUserWithEmailAndPassword } from 'firebase/auth'

export default function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    async function handleRegister(e) {
        e.preventDefault()

        if (email.trim().length === 0 || password.trim().length === 0) {
            alert("Preencha todos os campos!")
            return
        }

        await createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                navigate('/admin')
            })
            .catch((err) => {
                if (err.code === 'auth/email-already-in-use') {
                    alert('Email já em uso por outro usuário!')
                } else if (err.code === 'auth/missing-email') {
                    alert('O email é obrigatório')
                } else if (err.code === 'auth/invalid-email') {
                    alert('E-mail Inválido')
                } else if (err.code === 'auth/missing-password') {
                    alert('A senha é obrigatória')
                } else if (err.code === 'auth/weak-password') {
                    alert('A senha precisa ter no mínimo 6 caracteres')
                } else {
                    console.log(err.code)
                }
            })
    }

    return (
        <div className='home-container'>
            <h1>Cadastre-se</h1>
            <span>Vamos criar sua conta!</span>

            <form onSubmit={handleRegister} className='form'>
                <input
                    type='email'
                    placeholder='Digite seu email...'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type='password'
                    placeholder='*******'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type='submit'>Cadastrar</button>
            </form>

            <Link className='button-link' to="/">
                Já possui uma conta? Faça login!
            </Link>
        </div>
    )
}