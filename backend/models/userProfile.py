# Create user profile model

from pydantic import BaseModel, EmailStr

class UserProfile(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: EmailStr
    country: str
    level: str
    interests: list[str]
    goals: str
    onboarded: bool = True # default to true after onboarding
