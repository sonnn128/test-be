// server.cjs
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 8080;

app.use(cors());

app.get('/api/shorten', async (req, res) => {
  const destinationUrl = req.query.url;
  const apiKey = req.query.api;

  if (!destinationUrl || !apiKey) {
    return res.status(400).json({ error: 'Thiếu tham số url hoặc api' });
  }

  // ===== THAY ĐỔI QUAN TRỌNG NHẤT NẰM Ở ĐÂY =====
  // Sử dụng đúng tên miền và endpoint từ trang "Developers API"
  const link4mApiUrl = `https://link4m.co/api-shorten/v2?api=${apiKey}&url=${destinationUrl}`;
  // ===============================================
  
  console.log("Đang gọi đến API:", link4mApiUrl); // Thêm dòng này để debug

  try {
    const response = await fetch(link4mApiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
      // Bỏ tùy chọn family: 4 đi để thử lại từ đầu với endpoint mới
    });

    // Kiểm tra xem response có phải là JSON hợp lệ không
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        res.json(data);
    } else {
        const textData = await response.text();
        throw new Error(`Phản hồi không phải là JSON: ${textData}`);
    }

  } catch (error) {
    console.error("LỖI CHI TIẾT TỪ FETCH:", error);
    res.status(500).json({ 
        error: 'Lỗi khi gọi API của link4m. Xem console của server để biết thêm chi tiết.',
        details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});