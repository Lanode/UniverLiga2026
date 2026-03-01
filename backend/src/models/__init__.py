# Import all models so SQLAlchemy can discover them
from .user import User
from .feedback import Feedback, FeedbackSubcategory, FeedbackResponse
from .quastionare import Quastionare, Question, Answer
from .task import Task, TaskLink

# Make all models available for import
__all__ = [
    "User",
    "Feedback",
    "FeedbackSubcategory",
    "FeedbackResponse",
    "Quastionare",
    "Question",
    "Answer",
    "Task",
    "TaskLink"
]