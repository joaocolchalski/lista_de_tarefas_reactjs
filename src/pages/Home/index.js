import { useState } from 'react'
import './home.css'
import { Link, replace, useNavigate } from 'react-router-dom'
import { auth } from '../../firebaseConnection'
import { signInWithEmailAndPassword } from 'firebase/auth'

export default function Home() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    async function handleLogin(e) {
        e.preventDefault()

        if (email.trim().length === 0 || password.trim().length === 0) {
            alert("Preencha todos os campos!")
            return
        }

        await signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                navigate('/admin')
            })
            .catch((error) => {
                if (error.code === 'auth/missing-password') {
                    alert('A senha é obrigatória')
                } else if (error.code === 'auth/invalid-credential') {
                    alert('Email incorreto ou senha incorreta!')
                } else if (error.code === 'auth/invalid-email') {
                    alert('O email é obrigatório')
                } else {
                    console.log(error.code)
                }
            })
    }

    return (
        <div className='home-container'>
            <h1>Lista de Tarefas</h1>
            <span>Gerencie sua agenda de forma fácil</span>

            <form onSubmit={handleLogin} className='form'>
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

                <button type='submit'>Acessar</button>
            </form>

            <Link className='button-link' to="/register">
                Não possui uma conta? Cadastre-se
            </Link>
        </div>
    )
}