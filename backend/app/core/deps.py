from fastapi import HTTPException, Request, status

from app.core.config import settings
from app.core.logger import get_logger
from app.schemas.user import UserOut
from app.services.auth import get_user_from_session

logger = get_logger(__name__)

async def get_current_user(
    request: Request,
) -> UserOut:
    session_token = request.cookies.get(settings.SESSION_COOKIE_NAME)
    if not session_token:
        logger.error("Missing session token")
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User not authorized.")
    user = await get_user_from_session(session_token)
    if not user:
        logger.error("User does not exist")
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User not authorized.")

    return UserOut(**user.model_dump())

async def get_current_session(
    request: Request,
) -> str:

    # print("=" * 50)
    # print("REQUEST PATH:", request.url.path)
    # print("ALL COOKIES:", dict(request.cookies))
    # print("LOOKING FOR:", settings.SESSION_COOKIE_NAME)
    # print("=" * 50)
    #
    session_token = request.cookies.get(settings.SESSION_COOKIE_NAME)
    if not session_token:
        logger.error("Mission session token")
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User not authorized.")

    return session_token

async def admin_only(request: Request):
    session_token = request.cookies.get(settings.SESSION_COOKIE_NAME)
    if not session_token:
        logger.error("Missing session token")
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User not authenticated.")

    user = await get_user_from_session(session_token)
    if not user:
        logger.error("User does not exist")
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid Session.")

    if user.role != "admin":
        logger.error("AUTH: error: user is not admin")
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Admin access required.")

async def admin_and_staff(request: Request):
    session_token = request.cookies.get(settings.SESSION_COOKIE_NAME)
    if not session_token:
        logger.error("Not authenticated")
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User not authenticated.")

    user = await get_user_from_session(session_token)
    if not user:
        logger.error("User does not exist")
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid Session.")

    if (user.role != "admin") and (user.role != "staff"):
        logger.error("error: user is not admin or staff")
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Admin or staff access required.")

