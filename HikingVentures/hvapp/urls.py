from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

app_name = 'hvapp'

urlpatterns = [
    path('difficulties/', views.getDifficulties, name='difficulties'),
    path('difficulties/<str:pk>/', views.getDifficulty, name='difficulty'),
    path('routetypes/', views.getRouteTypes, name='routetypes'),
    path('routetypes/<str:pk>/', views.getRouteType, name='routetype'),
    path('states/', views.getStates, name='states'),
    path('states/<str:pk>/', views.getState, name='state'),
    path('parks/', views.getParks, name='parks'),
    path('parks/create/', views.createPark, name='create-park'),
    path('parks/<str:pk>/', views.getPark, name='park'),
    path('parks/<str:pk>/update/', views.updatePark, name="update-park"),
    path('parks/<str:pk>/delete/', views.deletePark, name="delete-park"),
    path('trails/', views.getTrails, name='trails'),
    path('trails/create/', views.createTrail, name='create-trail'),
    path('trails/<str:pk>/', views.getTrail, name='trail'),
    path('trails/<str:pk>/update/', views.updateTrail, name="update-trail"),
    path('trails/<str:pk>/delete/', views.deleteTrail, name="delete-trail"),
    path('images/', views.getImages, name='images'),
    path('images/create/', views.createImage, name='create-image'),
    path('images/<str:pk>/delete/', views.deleteImage, name="delete-image"),
    path('reviews/', views.getReviews, name='reviews'),
    path('reviews/create/', views.createReview, name='create-review'),
    path('userfavorites/', views.getUserFavorites, name='userfavorites'),
    path('userfavorites/create/', views.createUserFavorite, name='create-userfavorite'),
    path('userfavorites/<str:pk>/delete/', views.deleteUserFavorite, name="delete-userfavorite"),
    path('history/', views.getHistory, name='history'),
    path('history/create/', views.createHistory, name='create-history'),
]
