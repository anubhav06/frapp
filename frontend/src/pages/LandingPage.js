import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'

Modal.setAppElement('#root') // replace '#root' with the id of your app's root element

const LandingPage = () => {

    const [books, setBooks] = useState([]);
    const [members, setMembers] = useState([]);
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState('');
    const [selectedMember, setSelectedMember] = useState('');
    const [dateBorrowed, setDateBorrowed] = useState('');
    const [dateReturned, setDateReturned] = useState('');


    useEffect(() => {

        let getBooks = async () => {
            // Make a GET request to the API.
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/get-books/`)
            let data = await response.json()
            if (response.status === 200) {
                setBooks(data)
                // Set the selected book to the first book in the list.
                setSelectedBook(data[0]?.bookID)

            } else {
                alert("Error: ", data.message)
            }
        }
        let getMembers = async () => {
            // Make a GET request to the API.
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/get-members/`)
            let data = await response.json()
            if (response.status === 200) {
                setMembers(data)
                // Set the selected member to the first member in the list.
                setSelectedMember(data[0].email)
            } else {
                alert("Error: ", data.message)
            }
        }
        getBooks()
        getMembers()

    }, []);

    useEffect(() => {
        let getBorrowedBooks = async () => {
            // Make a GET request to the API.
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/get-borrowed-books/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'email': selectedMember })
            })
            let data = await response.json()
            if (response.status === 200) {
                setBorrowedBooks(data)
                // Set the selected book to the first book in the list.
                setSelectedBook(data[0]?.bookID)
            } else {
                alert("Error: ", data.message)
            }
        }
        if (selectedMember) {
            getBorrowedBooks()
        }
    }, [selectedMember]);


    let handleSubmit = async (e) => {
        e.preventDefault()

        // Make a POST request to the API.
        let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/issue-book/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'bookID': selectedBook, 'email': selectedMember, 'dateBorrowed': dateBorrowed })
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

    let calculateFees = async (e) => {
        e.preventDefault()

        // Make a POST request to the API.
        let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/get-fees/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'bookID': selectedBook, 'email': selectedMember, 'dateReturned': dateReturned })
        })
        let data = await response.json()

        if (response.status === 200) {
            if (data.totalFees > 500) {
                alert("Book Fee: " + data.bookFee + "\nTotal Outstanding Fees: " + data.totalFees + "\n⚠️ Member has outstanding fees of more than 500")
                return
            } else {
                alert("Book Fee: " + data.bookFee + "\nTotal Outstanding Fees: " + data.totalFees)
            }
        }
        else {
            alert("Error: ", data.message)
        }
    }

    let handleReturn = async (e) => {
        e.preventDefault()

        // Make a POST request to the API.
        let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/return-book/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'bookID': selectedBook, 'email': selectedMember, 'dateReturned': dateReturned })
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


    return (
        <div>
            <h1> Library Management System </h1>

            <h2>Issue Book</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Books:
                    <select value={selectedBook} onChange={e => setSelectedBook(e.target.value)}>
                        {books.map(book => <option key={book.bookID} value={book.bookID}>{book.title}</option>)}
                    </select>
                </label>
                <label>
                    Members:
                    <select value={selectedMember} onChange={e => setSelectedMember(e.target.value)}>
                        {members.map(member => <option key={member.email} value={member.email}>{member.name}</option>)}
                    </select>
                </label>
                <label>
                    Date:
                    <input type="date" value={dateBorrowed} onChange={e => setDateBorrowed(e.target.value)} />
                </label>
                <input type="submit" value="Issue Book" />
            </form>


            <h2> Return Book</h2>
            <form>
                <label>
                    Member:
                    <select value={selectedMember} onChange={e => setSelectedMember(e.target.value)}>
                        {members.map(member => <option key={member.email} value={member.email}>{member.name}</option>)}
                    </select>
                </label>
                <label>
                    Book:
                    <select value={selectedBook} onChange={e => setSelectedBook(e.target.value)}>
                        {borrowedBooks.map(book => <option key={book.bookID} value={book.bookID}>{book.title}</option>)}
                    </select>
                </label>
                <label>
                    Date:
                    <input type="date" value={dateReturned} onChange={e => setDateReturned(e.target.value)} />
                </label>
                <input type="submit" value="Return Book" onClick={handleReturn} />
                <input type="submit" value="Calculate Fees" onClick={calculateFees} />
            </form>


        </div>
    )
}

export default LandingPage
