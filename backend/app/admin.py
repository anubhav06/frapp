from django.contrib import admin
from app.models import Books, Members, BorrowedBooks

# Register your models here.
admin.site.register(Books)
admin.site.register(Members)
admin.site.register(BorrowedBooks)
