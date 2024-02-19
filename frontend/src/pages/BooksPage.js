import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'

Modal.setAppElement('#root') // replace '#root' with the id of your app's root element

const BooksPage = () => {

    let [books, setBooks] = useState([])
    let [modalIsOpen, setModalIsOpen] = useState(false)
    let [editingBook, setEditingBook] = useState(null)

    let createBook = async (e) => {
        e.preventDefault()

        // Make a POST request to the API.
        let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/create-book/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'bookID': e.target.bookID.value, 'title': e.target.title.value, 'author': e.target.author.value })
        })
        let data = await response.json()

        if (response.status === 200) {
            alert(data.message)
            // Reload the page to see the new book in the list.
            window.location.reload()
        } else {
            alert("Error: ", data.message)
        }
    }

    let deleteBook = async (e) => {

        // Make a DELETE request to the API.
        let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/delete-book/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'bookID': e.target.value })
        })
        let data = await response.json()

        if (response.status === 200) {
            alert(data.message)
            // Set the books state to all books except the deleted book.
            window.location.reload()
        } else {
            alert("Error: ", data.message)
        }
    }

    let openModal = (book) => {
        setEditingBook(book)
        setModalIsOpen(true)
    }

    let closeModal = () => {
        setModalIsOpen(false)
    }

    let updateBook = async (e) => {
        e.preventDefault()

        // Make a PUT request to the API.
        let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/update-book/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'bookID': editingBook.bookID, 'title': e.target.title.value, 'author': e.target.author.value, 'quantity': e.target.quantity.value })
        })
        let data = await response.json()

        if (response.status === 200) {
            alert(data.message)
            setBooks(books.map(book => book.bookID === editingBook.bookID ? { ...book, bookID: e.target.bookID.value, title: e.target.title.value , author: e.target.author.value, quantity: e.target.quantity.value} : book))
            closeModal()
        } else {
            alert("Error: ", data.message)
        }
    }


    useEffect(() => {
        let getBooks = async () => {
            // Make a GET request to the API.
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/get-books/`)
            let data = await response.json()
            console.log("Data: ", data)

            if (response.status === 200) {
                setBooks(data)
            } else {
                alert("Error: ", data.message)
            }
        }
        getBooks()
    }, [])

    return (
        <div>
            <h1> Library Management System </h1>

            <h2> Add Book </h2>
            <form onSubmit={createBook}>
                <input type="text" name='bookID' placeholder="Book ID" />
                <input type="text" name='title' placeholder="Title" />
                <input type="text" name='author' placeholder="Author(s)" />
                <button type="submit">Add Book</button>
            </form>

            <h2> Book list </h2>
            <ul>
                {books.map((book, index) => {
                    return (
                        <div key={index}>
                            {index + 1}.&nbsp;
                            <li>
                                Book ID: {book.bookID} <br />
                                Title: {book.title} <br />
                                Author(s): {book.author} <br />
                                Quantity: {book.quantity} <br />
                            </li>
                            <button onClick={() => openModal(book)}>Edit</button>
                            <button onClick={deleteBook} name='bookID' value={book.bookID}>Delete</button>
                        </div>
                    )
                })}
            </ul>

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
                <h2>Edit Book</h2>
                <form onSubmit={updateBook}>
                    <input type="text" name='bookID' defaultValue={editingBook?.bookID} disabled />
                    <input type="text" name='title' defaultValue={editingBook?.title} />
                    <input type="text" name='author' defaultValue={editingBook?.author} />
                    <input type="text" name='quantity' defaultValue={editingBook?.quantity} />
                    <button type="submit">Save</button>
                </form>
                <button onClick={closeModal}>Close</button>
            </Modal>


        </div>
    )
}

export default BooksPage
