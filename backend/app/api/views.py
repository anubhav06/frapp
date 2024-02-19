from rest_framework.response import Response
from rest_framework.decorators import api_view
from app.models import Books, Members, BorrowedBooks
import requests

# Member CRUD Operations


@api_view(['POST'])
def create_member(request):

    email = request.data['email']
    name = request.data['name']

    try:
        member = Members(email=email, name=name)
        member.save()
        return Response({'message': 'Member created successfully'})
    except Exception as e:
        return Response({'message': 'Error: ' + str(e)})


@api_view(['GET'])
def get_members(request):

    members = Members.objects.all()
    memberList = []
    for member in members:
        memberList.append({
            'email': member.email,
            'name': member.name
        })

    return Response(memberList)


@api_view(['PUT'])
def update_member(request):

    email = request.data['email']
    name = request.data['name']

    try:
        member = Members.objects.get(email=email)
        member.name = name
        member.save()
        return Response({'message': 'Member updated successfully'})
    except Exception as e:
        return Response({'message': 'Error: ' + str(e)})


@api_view(['DELETE'])
def delete_member(request):

    email = request.data['email']

    try:
        member = Members.objects.get(email=email)
        member.delete()
        return Response({'message': 'Member deleted successfully'})
    except Exception as e:
        return Response({'message': 'Error: ' + str(e)})

# Books CRUD Operations


@api_view(['POST'])
def import_books(request):

    title = request.data['title']
    quantity = request.data['quantity']

    books = fetch_books(title, quantity)
    return Response(books)


def fetch_books(title, quantity):
    base_url = 'https://frappe.io/api/method/frappe-library'
    books = []
    page = 1

    while len(books) < quantity:
        params = {'page': page, 'title': title}
        response = requests.get(base_url, params=params)
        data = response.json()
        books.extend(data['message'])

        # Increment the page number for the next request
        page += 1

    # If more than N books are fetched, trim the list down to N books
    return books[:quantity]


@api_view(['POST'])
def create_book(request):

    bookID = request.data['bookID']
    title = request.data['title']
    author = request.data['author']

    if Books.objects.filter(bookID=bookID).exists():
        book = Books.objects.get(bookID=bookID)
        book.quantity += 1
        book.save()
        return Response({'message': 'Book already exists. Quantity increased by 1'})

    book = Books(bookID=bookID, title=title, author=author, quantity=1)
    book.save()

    return Response({'message': 'Book added successfully'})


@api_view(['GET'])
def get_books(request):

    books = Books.objects.all()
    bookList = []
    for book in books:
        bookList.append({
            'bookID': book.bookID,
            'title': book.title,
            'author': book.author,
            'quantity': book.quantity
        })

    return Response(bookList)


@api_view(['PUT'])
def update_book(request):

    bookID = request.data['bookID']
    title = request.data['title']
    author = request.data['author']
    quantity = request.data['quantity']

    try:
        book = Books.objects.get(bookID=bookID)
        book.title = title
        book.author = author
        book.quantity = quantity
        book.save()

        return Response({'message': 'Book updated successfully'})
    except Exception as e:
        return Response({'message': 'Error: ' + str(e)})


@api_view(['DELETE'])
def delete_book(request):

    bookID = request.data['bookID']

    try:
        book = Books.objects.get(bookID=bookID)
        book.delete()

        return Response({'message': 'Book deleted successfully'})
    except Exception as e:
        return Response({'message': 'Error: ' + str(e)})

# Issue book to a member


@api_view(['POST'])
def issue_book(request):

    bookID = request.data['bookID']
    book = Books.objects.get(bookID=bookID)
    email = request.data['email']
    member = Members.objects.get(email=email)
    dateBorrowed = request.data['dateBorrowed']

    borrowed = BorrowedBooks(book=book, member=member,
                             dateBorrowed=dateBorrowed, returned=False)
    borrowed.save()

    book.quantity -= 1
    book.save()

    return Response({'message': 'Book issued successfully'})


# Return book from a member
@api_view(['POST'])
def return_book(request):

    bookID = request.data['bookID']
    book = Books.objects.get(bookID=bookID)
    email = request.data['email']
    member = Members.objects.get(email=email)
    dateReturned = request.data['dateReturned']

    borrowed = BorrowedBooks.objects.get(
        book=book, member=member, returned=False)
    borrowed.returned = True
    borrowed.dateReturned = dateReturned
    borrowed.save()

    book.quantity += 1
    book.save()

    return Response({'message': 'Book returned successfully'})


# Get fees for a member
@api_view(['GET'])
def get_fees(request):

    bookID = request.data['bookID']
    book = Books.objects.get(bookID=bookID)
    email = request.data['email']
    member = Members.objects.get(email=email)

    borrowed = BorrowedBooks.objects.filter(member=member, returned=False)

    # Total Fees is the sum of all the fees for the books borrowed
    # Book Fee is the fee for the book that the user is interested in returning
    # Common fine of Rs. 10 per day
    totalFees = 0
    bookFee = 0
    for book in borrowed:
        days = book.dateReturned - book.dateBorrowed
        fee = 10 * days.days
        totalFees += fee
        if book.book == bookID:
            bookFee = fee

    return Response({'totalFees': totalFees, 'bookFee': bookFee})

# --------- FOR DRF DOCS ------------


@api_view(['GET'])
def get_routes(request):

    routes = [
        '/',
        'register/'
    ]
    return Response(routes)
