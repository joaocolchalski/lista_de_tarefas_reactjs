import { useEffect, useState } from 'react'
import './admin.css'
import { signOut } from 'firebase/auth'
import { auth, db } from '../../firebaseConnection'
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    where,
    getDoc,
    doc,
    updateDoc,
    deleteDoc
} from 'firebase/firestore'

export default function Admin() {
    const [tarefaInput, setTarefaInput] = useState('')
    const [tarefas, setTarefas] = useState([])
    const [user, setUser] = useState({})
    const [editStatus, setEditStatus] = useState(false)
    const [idTaskEdit, setIdTaskEdit] = useState('')

    useEffect(() => {
        async function loadTarefas() {
            const detailUser = localStorage.getItem('@detailUser')

            setUser(JSON.parse(detailUser))

            if (detailUser) {
                const data = JSON.parse(detailUser)

                const collectionRef = collection(db, 'tarefas')

                const q = query(collectionRef, orderBy('created', 'desc'), where('userUid', '==', data?.uid))

                onSnapshot(q, (snapshot) => {
                    let listaTarefas = []
                    snapshot.forEach((tarefa) => {
                        listaTarefas.push({
                            id: tarefa.id,
                            descricao: tarefa.data().descricao,
                            userUid: tarefa.data().userUid
                        })
                    })

                    setTarefas(listaTarefas)
                })
            }
        }

        loadTarefas()
    }, [])

    async function handleRegisterTask(e) {
        e.preventDefault()
        if (tarefaInput.trim().length === 0) {
            alert('Digite alguma tarefa!')
            return
        }

        const collectionRef = collection(db, 'tarefas')

        await addDoc(collectionRef, {
            descricao: tarefaInput,
            created: new Date(),
            userUid: user?.uid
        })
            .then(() => {
                setTarefaInput('')
            })
            .catch((err) => {
                alert('Erro ao adicionar a tarefa')
                console.log(err.code)
            })
    }

    async function handleEditTask(id) {
        const tarefaRef = doc(db, 'tarefas', id)
        await getDoc(tarefaRef)
            .then((tarefa) => {
                setTarefaInput(tarefa.data().descricao)
                setEditStatus(true)
                setIdTaskEdit(id)
            })
            .catch((err) => {
                alert('Erro ao editar a tarefa!')
                console.log(err.code)
            })
    }

    async function editTask(e) {
        e.preventDefault()

        if (tarefaInput.trim().length === 0) {
            alert('Digite alguma tarefa!')
            setIdTaskEdit('')
            setEditStatus(false)
            return
        }

        const tarefaRef = doc(db, 'tarefas', idTaskEdit)
        await updateDoc(tarefaRef, {
            descricao: tarefaInput
        })
            .then(() => {
                setIdTaskEdit('')
                setEditStatus(false)
                setTarefaInput('')
            })
            .catch((err) => {
                alert('Erro ao editar a tarefa!')
                console.log(err.code)
            })
    }

    async function handleDeleteTask(id) {
        const tarefaRef = doc(db, 'tarefas', id)
        await deleteDoc(tarefaRef)
    }

    async function handleLogout() {
        await signOut(auth)
    }

    return (
        <div className='admin-container'>
            <h1>Minhas Tarefas</h1>

            <form className='form' onSubmit={editStatus ? editTask : handleRegisterTask}>
                <textarea
                    placeholder='Digite sua tarefa...'
                    value={tarefaInput}
                    onChange={(e) => setTarefaInput(e.target.value)}
                />

                <button className='btn-register' type='submit'>
                    {editStatus ? 'Editar Tarefa' : 'Registrar Tarefa'}
                </button>
            </form>

            {tarefas.map((tarefa) => {
                return (
                    <article key={tarefa.id} className='list'>
                        <p>{tarefa.descricao}</p>

                        <div>
                            <button
                                onClick={() => handleEditTask(tarefa.id)}
                                disabled={editStatus ? true : false}
                            >
                                Editar
                            </button>

                            <button
                                className='btn-delete'
                                onClick={() => handleDeleteTask(tarefa.id)}
                                disabled={editStatus ? true : false}
                            >
                                Concluir
                            </button>
                        </div>
                    </article>
                )
            })}
            <button className='btn-logout' onClick={handleLogout}>Sair</button>
        </div>
    )
}