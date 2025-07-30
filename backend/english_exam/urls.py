from django.urls import path
from . import views

urlpatterns = [
    path('questions/', views.ExamQuestionsView.as_view(), name='questions'),
    path('submit/', views.SubmitExamView.as_view(), name='submit'),
    path('advice/', views.GetAdviceView.as_view(), name='advice'),
    # Endpoint mới cho Exercise-Gram
    path('exercises/<str:topic>/', views.ExerciseQuestionsView.as_view(), name='exercise_questions'),
]