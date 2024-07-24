from sqlalchemy import create_engine, engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine import URL

connection_string = "DRIVER={SQL Server Native Client 11.0};SERVER=DESKTOP-IO06Q63;DATABASE=vk_fitness;UID=sa;PWD=Admin123"
connection_url = URL.create("mssql+pyodbc", query={"odbc_connect": connection_string})


engine = create_engine(connection_url)


SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
