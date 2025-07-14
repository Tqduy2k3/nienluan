export default async function sendMessage(input) {
  try {
    // Gửi yêu cầu POST đến API
    const response = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input })
    });

    // Kiểm tra trạng thái HTTP của phản hồi
    if (!response.ok) {
      throw new Error(`Lỗi API: ${response.statusText}`);
    }

    // Phân tích cú pháp phản hồi JSON
    const messages = await response.json();

    // Kiểm tra nếu phản hồi là mảng và có chứa đối tượng với thuộc tính 'text'
    if (Array.isArray(messages)) {
      return messages.map((m) => m.text).join('\n');
    } else {
      throw new Error('Dữ liệu phản hồi không hợp lệ');
    }
  } catch (error) {
    console.error('Lỗi khi gửi tin nhắn:', error);
    return 'Có lỗi xảy ra, vui lòng thử lại.';
  }
}
