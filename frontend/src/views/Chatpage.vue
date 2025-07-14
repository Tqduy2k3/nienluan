<template>
  <div id="chat-container">
    <div id="chatbox">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="msg.sender === 'user' ? 'user-message' : 'bot-message'"
        class="message"
      >
        <p v-if="msg.text">{{ msg.text }}</p>
        <img
          v-if="msg.image"
          :src="msg.image"
          alt="Hình ảnh sản phẩm"
          class="message-image"
        />
      </div>
    </div>
    <div id="input-container">
      <input
        v-model="userInput"
        @keyup.enter="handleSend"
        placeholder="Nhập tin nhắn..."
        id="chat-input"
      />
      <button
        @click="handleSend"
        id="send-button"
      >
        Gửi
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import sendMessage from '../api'; // API gửi tin nhắn

export default {
  setup() {
    const messages = ref([]); // Danh sách tin nhắn
    const userInput = ref(''); // Input người dùng

    const handleSend = async () => {
      if (userInput.value.trim()) {
        messages.value.push({ text: userInput.value, sender: 'user' });

        try {
          const response = await sendMessage(userInput.value);

          let botResponse;
          try {
            botResponse = JSON.parse(response);
          } catch {
            botResponse = { text: response };
          }

          if (botResponse.text) {
            messages.value.push({ text: botResponse.text, sender: 'bot' });
          }
          if (botResponse.image) {
            messages.value.push({ image: botResponse.image, sender: 'bot' });
          }
        } catch (error) {
          console.error('Lỗi khi gửi tin nhắn:', error);
          messages.value.push({ text: 'Có lỗi xảy ra, vui lòng thử lại.', sender: 'bot' });
        }

        userInput.value = '';
      }
    };

    return { messages, userInput, handleSend };
  }
};
</script>

<style scoped>
/* Container chính */
#chat-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 500px; /* Giảm chiều cao tổng thể */
  max-width: 500px;
  margin: 20px auto;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Khu vực chat */
#chatbox {
  flex: 1;
  padding: 20px;
  overflow-y: auto; /* Cho phép cuộn nếu nội dung quá dài */
  height: 300px; /* Giới hạn chiều cao */
  background-color: #ffffff;
}

/* Tin nhắn */
.message {
  margin: 10px 0;
  padding: 10px 15px;
  border-radius: 20px;
  max-width: 70%;
  word-wrap: break-word;
  font-size: 14px;
  line-height: 1.5;
}

/* Tin nhắn người dùng */
.user-message {
  background-color: #daf5ff;
  align-self: flex-end;
  text-align: right;
  color: #0056b3;
}

/* Tin nhắn bot */
.bot-message {
  background-color: #f1f1f1;
  align-self: flex-start;
  color: #333;
}

/* Khu vực nhập tin nhắn */
#input-container {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #ffffff;
  border-top: 1px solid #ddd;
}

/* Input */
#chat-input {
  flex: 1;
  padding: 10px 15px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 20px;
  margin-right: 10px;
  outline: none;
  transition: 0.3s;
}

#chat-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

/* Nút gửi */
#send-button {
  padding: 10px 15px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: 0.3s;
}

#send-button:hover {
  background-color: #0056b3;
}
.message-image {
  display: block;
  max-width: 100%;
  margin-top: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
</style>
