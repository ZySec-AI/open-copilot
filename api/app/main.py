from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

from app.api.endpoints.api_token_routers import api_token_router
from app.api.endpoints.expert_routers import expert_router
from app.api.endpoints.auth_routers import auth_router
from app.api.endpoints.category_routers import category_router
from app.api.endpoints.chat_routers import chat_router
from app.api.endpoints.content_item_routers import content_item_router
from app.api.endpoints.file_info_routers import file_info_router
from app.api.endpoints.folder_routers import folder_router
from app.api.endpoints.application_routers import application_router
from app.api.endpoints.llm_routers import llm_router
from app.api.endpoints.message_routers import message_router
from app.api.endpoints.graph_routers import graph_routers
from app.api.endpoints.sample_routers import sample_router
from app.api.endpoints.user_routers import user_router
from app.api.endpoints.zysec_config_router import config_router
from app.core.config import config
from app.socket import create_socket_app
from app.utils.schedulars.block_list_token_schedular import scheduler

config.load_configs()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(sample_router)
app.include_router(content_item_router)
app.include_router(llm_router)
app.include_router(user_router)
app.include_router(auth_router)
app.include_router(file_info_router)
app.include_router(folder_router)
app.include_router(category_router)
app.include_router(api_token_router)
app.include_router(expert_router)
app.include_router(message_router)
app.include_router(chat_router)
app.include_router(config_router)
app.include_router(application_router)
app.include_router(graph_routers)

# Health check endpoint for Docker
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "es-copilot-api"}

# Initialize APScheduler
task_scheduler = AsyncIOScheduler()

@app.on_event("startup")
async def startup_event():
    # Start the scheduler
    task_scheduler.start()
    # Add the recurring task (24 hours = 24 * 60 * 60 seconds)
    task_scheduler.add_job(
        func=scheduler.run_task,
        trigger=IntervalTrigger(seconds=60 * 60 * 24),  # 24 hours
        id='remove_expired_tokens_task',
        name='Remove expired tokens',
        replace_existing=True
    )

@app.on_event("shutdown")
async def shutdown_event():
    # Shutdown the scheduler
    task_scheduler.shutdown()

app.mount("/app/assets", StaticFiles(directory="app/assets"), name="assets")
create_socket_app(app)
