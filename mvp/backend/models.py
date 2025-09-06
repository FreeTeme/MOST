from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    password = Column(String)
    role = Column(String)  # blogger / advertiser

    blogger_profile = relationship("BloggerProfile", back_populates="user", uselist=False)

class BloggerProfile(Base):
    __tablename__ = "blogger_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    platform = Column(String)
    profile_url = Column(String)
    subscribers = Column(Integer)
    er = Column(String)
    category = Column(String)
    price = Column(Integer)
    content_example = Column(String)

    user = relationship("User", back_populates="blogger_profile")

campaign_blogger = Table(
    "campaign_blogger", Base.metadata,
    Column("campaign_id", Integer, ForeignKey("campaigns.id")),
    Column("blogger_id", Integer, ForeignKey("blogger_profiles.id"))
)

class Campaign(Base):
    __tablename__ = "campaigns"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))

    bloggers = relationship("BloggerProfile", secondary=campaign_blogger)
