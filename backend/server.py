from fastapi import FastAPI, HTTPException, Depends, status, File, UploadFile
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List, Optional
import os
import httpx
import asyncio
from datetime import datetime
import uuid
import base64
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
client = AsyncIOMotorClient(os.environ.get('MONGO_URL'))
db = client["pempek_domino"]
collection_products = db["products"]
collection_orders = db["orders"]
collection_categories = db["categories"]

# Security
security = HTTPBearer()

# Pydantic models
class Category(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: Optional[str] = ""

class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    price: int
    category_id: str
    category_name: str
    image_url: str
    stock: int = 100
    description: Optional[str] = ""

class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    customer_phone: str
    customer_address: str
    items: List[dict]
    total_amount: int
    status: str = "pending"
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())

class LoginRequest(BaseModel):
    username: str
    password: str

# Admin authentication
def verify_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    admin_username = os.environ.get('ADMIN_USERNAME')
    admin_password = os.environ.get('ADMIN_PASSWORD')
    
    if not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    # Simple token check (in real app, use JWT)
    if credentials.credentials != f"{admin_username}:{admin_password}":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    return True

# Telegram notification function
async def send_telegram_notification(order: Order):
    try:
        bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
        chat_id = os.environ.get('TELEGRAM_CHAT_ID')
        
        if not bot_token or not chat_id:
            print("Telegram credentials not configured")
            return
        
        # Format order details
        items_text = "\n".join([f"• {item['name']} x{item['quantity']} = Rp {item['subtotal']:,}" 
                               for item in order.items])
        
        message = f"""🍽️ *PESANAN BARU PEMPEK DOMINO* 🍽️

👤 *Pelanggan:* {order.customer_name}
📱 *Telepon:* {order.customer_phone}
📍 *Alamat:* {order.customer_address}

🛍️ *Pesanan:*
{items_text}

💰 *Total:* Rp {order.total_amount:,}
🕐 *Waktu:* {order.created_at}

Status: ⏳ Menunggu Konfirmasi"""

        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        payload = {
            "chat_id": chat_id,
            "text": message,
            "parse_mode": "Markdown"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload)
            if response.status_code == 200:
                print("Telegram notification sent successfully")
            else:
                print(f"Failed to send Telegram notification: {response.text}")
    except Exception as e:
        print(f"Error sending Telegram notification: {e}")

# Initialize database with sample data
@app.on_event("startup")
async def startup_event():
    try:
        # Check if categories exist
        categories_count = await collection_categories.count_documents({})
        if categories_count == 0:
            # Initialize categories
            categories = [
                {"id": str(uuid.uuid4()), "name": "Pempek Goreng", "description": "Pempek yang digoreng"},
                {"id": str(uuid.uuid4()), "name": "Pempek Kuah", "description": "Pempek dengan kuah cuko"},
                {"id": str(uuid.uuid4()), "name": "Snack", "description": "Cemilan pelengkap"}
            ]
            await collection_categories.insert_many(categories)
            
            # Initialize products
            products = [
                # Pempek Goreng
                {"id": str(uuid.uuid4()), "name": "Pempek Kapal Selam", "price": 15000, 
                 "category_id": categories[0]["id"], "category_name": "Pempek Goreng",
                 "image_url": "https://images.unsplash.com/photo-1587907988134-94b4d1c3e40e", 
                 "stock": 50, "description": "Pempek isi telur yang digoreng"},
                
                {"id": str(uuid.uuid4()), "name": "Pempek Lenjer", "price": 8000, 
                 "category_id": categories[0]["id"], "category_name": "Pempek Goreng",
                 "image_url": "https://images.unsplash.com/photo-1540100716001-4b432820e37f", 
                 "stock": 100, "description": "Pempek bulat panjang yang digoreng"},
                
                {"id": str(uuid.uuid4()), "name": "Pempek Adaan", "price": 5000, 
                 "category_id": categories[0]["id"], "category_name": "Pempek Goreng",
                 "image_url": "https://images.unsplash.com/photo-1642744901889-9efbec703430", 
                 "stock": 80, "description": "Pempek kecil bulat"},
                
                {"id": str(uuid.uuid4()), "name": "Pempek Kulit", "price": 10000, 
                 "category_id": categories[0]["id"], "category_name": "Pempek Goreng",
                 "image_url": "https://images.pexels.com/photos/8858693/pexels-photo-8858693.jpeg", 
                 "stock": 30, "description": "Pempek dari kulit ikan"},
                
                # Pempek Kuah
                {"id": str(uuid.uuid4()), "name": "Tekwan", "price": 12000, 
                 "category_id": categories[1]["id"], "category_name": "Pempek Kuah",
                 "image_url": "https://images.pexels.com/photos/1343537/pexels-photo-1343537.jpeg", 
                 "stock": 40, "description": "Pempek kecil dalam kuah kaldu"},
                
                # Snack
                {"id": str(uuid.uuid4()), "name": "Kemplang", "price": 25000, 
                 "category_id": categories[2]["id"], "category_name": "Snack",
                 "image_url": "https://images.unsplash.com/photo-1619265554876-cbdaeb033aeb", 
                 "stock": 20, "description": "Kerupuk khas Palembang"},
                
                {"id": str(uuid.uuid4()), "name": "Getas", "price": 20000, 
                 "category_id": categories[2]["id"], "category_name": "Snack",
                 "image_url": "https://images.unsplash.com/photo-1700513971573-4f941ab7d282", 
                 "stock": 15, "description": "Cemilan renyah khas Palembang"}
            ]
            await collection_products.insert_many(products)
            print("Database initialized with sample data")
    except Exception as e:
        print(f"Error initializing database: {e}")

# API Routes

# Public routes
@app.get("/api/categories")
async def get_categories() -> List[Category]:
    try:
        categories = await collection_categories.find().to_list(length=None)
        return [Category(**cat) for cat in categories]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching categories: {str(e)}")

@app.get("/api/products")
async def get_products(category: Optional[str] = None) -> List[Product]:
    try:
        filter_query = {}
        if category:
            filter_query["category_name"] = category
        
        products = await collection_products.find(filter_query).to_list(length=None)
        return [Product(**product) for product in products]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching products: {str(e)}")

@app.post("/api/orders")
async def create_order(order: Order):
    try:
        order_dict = order.dict()
        await collection_orders.insert_one(order_dict)
        
        # Send Telegram notification
        await send_telegram_notification(order)
        
        return {"message": "Pesanan berhasil dikirim!", "order_id": order.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating order: {str(e)}")

# Admin routes
@app.post("/api/admin/login")
async def admin_login(login_request: LoginRequest):
    admin_username = os.environ.get('ADMIN_USERNAME')
    admin_password = os.environ.get('ADMIN_PASSWORD')
    
    if login_request.username != admin_username or login_request.password != admin_password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Simple token (in real app, use JWT)
    token = f"{admin_username}:{admin_password}"
    return {"access_token": token, "token_type": "bearer"}

@app.get("/api/admin/orders")
async def get_admin_orders(admin_verified: bool = Depends(verify_admin)) -> List[Order]:
    try:
        orders = await collection_orders.find().sort("created_at", -1).to_list(length=None)
        return [Order(**order) for order in orders]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching orders: {str(e)}")

@app.get("/api/admin/products")
async def get_admin_products(admin_verified: bool = Depends(verify_admin)) -> List[Product]:
    try:
        products = await collection_products.find().to_list(length=None)
        return [Product(**product) for product in products]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching products: {str(e)}")

@app.post("/api/admin/products")
async def create_product(product: Product, admin_verified: bool = Depends(verify_admin)):
    try:
        product_dict = product.dict()
        await collection_products.insert_one(product_dict)
        return {"message": "Product created successfully", "product_id": product.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating product: {str(e)}")

@app.put("/api/admin/products/{product_id}")
async def update_product(product_id: str, product: Product, admin_verified: bool = Depends(verify_admin)):
    try:
        product_dict = product.dict()
        result = await collection_products.update_one(
            {"id": product_id}, 
            {"$set": product_dict}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Product not found")
        return {"message": "Product updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating product: {str(e)}")

@app.delete("/api/admin/products/{product_id}")
async def delete_product(product_id: str, admin_verified: bool = Depends(verify_admin)):
    try:
        result = await collection_products.delete_one({"id": product_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Product not found")
        return {"message": "Product deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting product: {str(e)}")

@app.post("/api/admin/categories")
async def create_category(category: Category, admin_verified: bool = Depends(verify_admin)):
    try:
        category_dict = category.dict()
        await collection_categories.insert_one(category_dict)
        return {"message": "Category created successfully", "category_id": category.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating category: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Pempek Domino API is running!"}