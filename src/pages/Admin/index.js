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
    doc,
    updateDoc,
    deleteDoc
} from 'firebase/firestore'

export default function Admin() {
    const [tarefaInput, setTarefaInput] = useState('')
    const [tarefas, setTarefas] = useState([])
    const [user, setUser] = useState({})
    const [taskToEdit, setTaskToEdit] = useState({})

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

    function handleEditTask(tarefa) {
        setTarefaInput(tarefa.descricao)
        setTaskToEdit(tarefa)
    }

    async function editTask(e) {
        e.preventDefault()

        if (tarefaInput.trim().length === 0) {
            alert('Digite alguma tarefa!')
            setTaskToEdit({})
            setTarefaInput('')
            return
        }

        const tarefaRef = doc(db, 'tarefas', taskToEdit?.id)
        await updateDoc(tarefaRef, {
            descricao: tarefaInput
        })
            .then(() => {
                setTaskToEdit({})
                setTarefaInput('')
            })
            .catch((err) => {
                alert('Erro ao editar a tarefa!')
                console.log(err.code)
                setTaskToEdit({})
                setTarefaInput('')
            })
    }

    async function handleDeleteTask(id) {
        const tarefaRef = doc(db, 'tarefas', id)
        await deleteDoc(tarefaRef)
            .catch((err) => {
                alert('Erro ao deletar a tarefa!')
                console.log(err.code)
            })
    }

    async function handleLogout() {
        await signOut(auth)
    }

    return (
        <div className='admin-container'>
            <h1>Minhas Tarefas</h1>

            <form className='form' onSubmit={taskToEdit?.id ? editTask : handleRegisterTask}>
                <textarea
                    placeholder='Digite sua tarefa...'
                    value={tarefaInput}
                    onChange={(e) => setTarefaInput(e.target.value)}
                />

                {taskToEdit?.id ? (
                    <button className='btn-register' type='submit' style={{ backgroundColor: '#6add39', color: '#000' }}>Editar Tarefa</button>
                ) : (
                    <button className='btn-register' type='submit'>Registrar Tarefa</button>
                )}
            </form>

            {tarefas.map((tarefa) => (
                <article key={tarefa.id} className='list'>
                    <p>{tarefa.descricao}</p>

                    <div>
                        <button
                            onClick={() => handleEditTask(tarefa)}
                            disabled={taskToEdit?.id ? true : false}
                        >
                            Editar
                        </button>

                        <button
                            className='btn-delete'
                            onClick={() => handleDeleteTask(tarefa.id)}
                            disabled={taskToEdit?.id ? true : false}
                        >
                            Concluir
                        </button>
                    </div>
                </article>
            )
            )}
            <button className='btn-logout' onClick={handleLogout}>Sair</button>
        </div>
    )
}