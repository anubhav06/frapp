from django.db import models

# Books


class Books(models.Model):
    bookID = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=200)
    quantity = models.IntegerField()

    def __str__(self):
        return f"{self.bookID} - {self.title}"

# Members


class Members(models.Model):
    email = models.CharField(unique=True, max_length=100)
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.email}"

# Transactions/BorrowedData


class BorrowedBooks(models.Model):
    book = models.ForeignKey(Books, on_delete=models.CASCADE)
    member = models.ForeignKey(Members, on_delete=models.CASCADE)
    dateBorrowed = models.DateField()
    dateReturned = models.DateField(null=True, blank=True)
    returned = models.BooleanField()

    def __str__(self):
        return f"{self.book} - {self.member}"
