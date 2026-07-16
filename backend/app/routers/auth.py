from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.security import create_access_token, get_current_user
from backend.app.database import get_db
from backend.app import crud, schemas
from backend.app.security import create_access_token
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/signup", response_model=schemas.UserResponse)
def signup(user: schemas.UserSignup, db: Session = Depends(get_db)):
    created = crud.create_user(
        db=db,
        full_name=user.full_name,
        email=user.email,
        password=user.password,
    )

    if created is None:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    return created


@router.post("/login", response_model=schemas.Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    db_user = crud.authenticate_user(
        db,
        form_data.username,   # username field me email aayega
        form_data.password
    )

    if db_user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token(
        {
            "sub": db_user.email,
            "user_id": db_user.id,
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
    }

@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user=Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=schemas.UserResponse)
def update_me(
    user_data: schemas.UserUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud.update_user(
        db,
        current_user,
        user_data
    )