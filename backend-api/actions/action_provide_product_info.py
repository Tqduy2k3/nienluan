from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import mysql.connector
import os
from dotenv import load_dotenv
import logging

# Cấu hình logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class ActionProvideProductInfo(Action):
    def name(self) -> Text:
        return "action_provide_product_info"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Lấy tên sản phẩm từ entity
        product = next(tracker.get_latest_entity_values("product_name"), None)
        logger.info(f"Product name received: {product}")

        if not product:
            dispatcher.utter_message(text="Bạn có thể cho tôi biết tên sản phẩm bạn quan tâm không?")
            return []

        # Nạp các biến môi trường từ file .env
        load_dotenv()

        # Kết nối cơ sở dữ liệu
        connection = None
        cursor = None
        try:
            logger.info("Connecting to the database...")
            connection = mysql.connector.connect(
                host=os.getenv("DB_HOST"),
                user=os.getenv("DB_USER"),
                password=os.getenv("DB_PASS"),
                database=os.getenv("DB_NAME")
            )
            cursor = connection.cursor(dictionary=True)

            # Truy vấn sản phẩm dựa trên tên
            query = """
                SELECT P_name, P_price, P_description, P_image_url 
                FROM products 
                WHERE P_name LIKE %s
            """
            cursor.execute(query, (f"%{product}%",))
            result = cursor.fetchall()  # Đọc tất cả kết quả

            # Xử lý kết quả
            if result:
                # Sử dụng kết quả đầu tiên (nếu có nhiều dòng trả về)
                first_result = result[0]
                message = (
                    f"Sản phẩm **{first_result['P_name']}** có giá **{first_result['P_price']}**. "
                    f"Mô tả: {first_result['P_description']}."
                )
                base_url = "http://localhost:3000"  # Cấu hình URL gốc
                image_url = f"{base_url}/public/upload/{first_result['P_image_url']}"
                logger.info(f"Product found: {first_result['P_name']}, Image URL: {image_url}")
                dispatcher.utter_message(text=message)
                dispatcher.utter_message(image=image_url)
            else:
                logger.info("No product found for the given name.")
                dispatcher.utter_message(text="Rất tiếc, tôi không tìm thấy sản phẩm bạn yêu cầu.")

        except mysql.connector.Error as err:
            logger.error(f"MySQL Error: {err}")
            dispatcher.utter_message(text="Có lỗi xảy ra khi truy vấn cơ sở dữ liệu. Vui lòng thử lại sau.")
        except Exception as e:
            logger.error(f"Unexpected Error: {e}")
            dispatcher.utter_message(text="Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.")
        finally:
            # Đảm bảo đóng con trỏ và kết nối cơ sở dữ liệu
            if cursor:
                cursor.close()  # Đóng con trỏ
            if connection:
                connection.close()  # Đóng kết nối

        return []
