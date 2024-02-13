from django.urls import path
from . import views


urlpatterns = [ 
    path('', views.get_routes, name="getRoutes"),

    # Members CRUD
    path('create-member/', views.create_member, name="createMember"),
    path('get-members/', views.get_members, name="getMembers"),
    path('update-member/', views.update_member, name="updateMember"),
    path('delete-member/', views.delete_member, name="deleteMember"),

    # Books CRUD
    path('import-books/', views.import_books, name="importBooks"),
    path('create-book/', views.create_book, name="createBook"),
    path('get-books/', views.get_books, name="getBooks"),
    path('update-book/', views.update_book, name="updateBook"),
    path('delete-book/', views.delete_book, name="deleteBook"),

    # Books issue and return
    path('issue-book/', views.issue_book, name="issueBook"),
    path('return-book/', views.return_book, name="returnBook"),
    path('get-fees/', views.get_fees, name="getFees"),
]