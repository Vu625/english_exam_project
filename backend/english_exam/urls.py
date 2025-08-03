from django.urls import path
from . import views 
from .views import VocabularyExerciseView

urlpatterns = [
    path('questions/', views.ExamQuestionsView.as_view(), name='questions'),
    path('submit/', views.SubmitExamView.as_view(), name='submit'),
    path('advice/', views.GetAdviceView.as_view(), name='advice'),
    path('exercises/<str:topic>/', views.ExerciseQuestionsView.as_view(), name='exercise_questions'),
    path('reading-exercises/<str:topic>/', views.ReadingQuestionsView.as_view(), name='reading_questions'),
    path('chat/', views.ChatView.as_view(), name='chat'),
    path('vocabulary-exercises/<str:topic>/', VocabularyExerciseView.as_view(), name='vocabulary-exercises'),
]