from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import mysql.connector
import os
from dotenv import load_dotenv

class ActionCheckDatabaseConnection(Action):

    def name(self) -> Text:
        return "action_check_database_connection"  # Đổi tên hành động này theo ý bạn

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Nạp các biến môi trường từ file .env
        load_dotenv()

        try:
            # Kết nối tới MySQL sử dụng biến môi trường
            connection = mysql.connector.connect(
                host=os.getenv("DB_HOST"),
                user=os.getenv("DB_USER"),
                password=os.getenv("DB_PASS"),
                database=os.getenv("DB_NAME")
            )
            # Kiểm tra kết nối
            if connection.is_connected():
                dispatcher.utter_message(text="Kết nối cơ sở dữ liệu thành công.")
            else:
                dispatcher.utter_message(text="Không thể kết nối đến cơ sở dữ liệu.")
        except mysql.connector.Error as err:
            dispatcher.utter_message(text="Có lỗi xảy ra khi kết nối tới cơ sở dữ liệu.")
            print(f"Error: {err}")
        finally:
            # Đảm bảo đóng kết nối
            if connection.is_connected():
                connection.close()

        return []
