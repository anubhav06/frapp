import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'

Modal.setAppElement('#root') // replace '#root' with the id of your app's root element

const MembersPage = () => {

    let [members, setMembers] = useState([])
    let [modalIsOpen, setModalIsOpen] = useState(false)
    let [editingMember, setEditingMember] = useState(null)

    let createMember = async (e) => {
        e.preventDefault()

        // Make a POST request to the API.
        let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/create-member/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'email': e.target.email.value, 'name': e.target.name.value })
        })
        let data = await response.json()

        if (response.status === 200) {
            alert(data.message)
            // Add the new member to the members state.
            setMembers([...members, { 'name': e.target.name.value, 'email': e.target.email.value }])
        } else {
            alert("Error: ", data.message)
        }
    }

    let deleteMember = async (e) => {

        // Make a DELETE request to the API.
        let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/delete-member/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'email': e.target.value })
        })
        let data = await response.json()

        if (response.status === 200) {
            alert(data.message)
            // Set the members state to all members except the deleted member.
            setMembers(members.filter(member => member.email !== e.target.value))
        } else {
            alert("Error: ", data.message)
        }
    }

    let openModal = (member) => {
        setEditingMember(member)
        setModalIsOpen(true)
    }

    let closeModal = () => {
        setModalIsOpen(false)
    }

    let updateMember = async (e) => {
        e.preventDefault()

        // Make a PUT request to the API.
        let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/update -member/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'email': editingMember.email, 'name': e.target.name.value })
        })
        let data = await response.json()

        if (response.status === 200) {
            alert(data.message)
            setMembers(members.map(member => member.email === editingMember.email ? { ...member, name: e.target.name.value } : member))
            closeModal()
        } else {
            alert("Error: ", data.message)
        }
    }


    useEffect(() => {
        let getMembers = async () => {
            console.log("Get Members")

            // Make a GET request to the API.
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/get-members/`)
            let data = await response.json()
            console.log("Data: ", data)

            if (response.status === 200) {
                setMembers(data)
            } else {
                alert("Error: ", data.message)
            }
        }
        getMembers()
    }, [])

    return (
        <div>
            <h1> Library Management System </h1>

            <h2> Create Member </h2>
            <form onSubmit={createMember}>
                <input type="text" name='name' placeholder="Name" />
                <input type="text" name='email' placeholder="Email" />
                <button type="submit">Create Member</button>
            </form>

            <h2> Member list </h2>
            <ul>
                {members.map((member, index) => {
                    return (
                        <div key={index}>
                            {index + 1}.&nbsp;
                            <li>
                                {member.name} - {member.email}
                            </li>
                            <button onClick={() => openModal(member)}>Edit</button>
                            <button onClick={deleteMember} name='email' value={member.email}>Delete</button>
                        </div>
                    )
                })}
            </ul>

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
                <h2>Edit Member</h2>
                <form onSubmit={updateMember}>
                    <input type="text" name='email' defaultValue={editingMember?.email} disabled />
                    <input type="text" name='name' defaultValue={editingMember?.name} />
                    <button type="submit">Save</button>
                </form>
                <button onClick={closeModal}>Close</button>
            </Modal>


        </div>
    )
}

export default MembersPage  
