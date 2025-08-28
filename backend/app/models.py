from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, index=True)
    status = Column(String, default="todo") # e.g., "todo", "in-progress", "done" 
    priority = Column(String, default="medium") # e.g., "low", "medium", "high"
    due_date = Column(DateTime, nullable=True)

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    lead = Column(String, index=True)
    health = Column(String, default="green") # e.g., "green", "yellow", "red"
    members = Column(String) # Store as comma-separated string for simplicity

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
