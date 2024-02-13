from django.db import models

# Books
class Books(models.Model):
    bookID = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=200)
    quantity = models.IntegerField()

# Members
class Members(models.Model):
    email = models.CharField(unique=True, max_length=100)
    name = models.CharField(max_length=100)

# Transactions/BorrowedData
class BorrowedBooks(models.Model):
    book = models.ForeignKey(Books, on_delete=models.CASCADE)
    member = models.ForeignKey(Members, on_delete=models.CASCADE)
    dateBorrowed = models.DateField()
    dateReturned = models.DateField()
    returned = models.BooleanField()
