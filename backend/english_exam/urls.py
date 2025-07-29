from django.urls import path
from .views import ExamQuestionsView, SubmitExamView, GetAdviceView

urlpatterns = [
        path('questions/', ExamQuestionsView.as_view(), name='exam_questions'),
        path('submit/', SubmitExamView.as_view(), name='submit_exam'),
        path('advice/', GetAdviceView.as_view(), name='get_advice'),
]