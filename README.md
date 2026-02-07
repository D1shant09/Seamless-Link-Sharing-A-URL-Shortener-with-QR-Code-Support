# URL Shortener with QR Code Support

A simple and elegant URL shortening service built with Flask that also generates QR codes for easy sharing.

## Features

- **URL Shortening**: Convert long URLs into short, shareable links
- **Custom Aliases**: Create memorable custom short URLs (e.g., `yoursite.com/my-link`)
- **QR Code Generation**: Generate QR codes for any URL for easy mobile sharing
- **Input Validation**: Validates URLs and sanitizes user input for security
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Backend**: Python, Flask
- **Frontend**: HTML, CSS, JavaScript
- **Libraries**: Flask-CORS, qrcode, Pillow

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd URL-Shortener-Project
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   python app.py
   ```

4. **Open in browser**
   ```
   http://127.0.0.1:5000
   ```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Home page |
| POST | `/shorten` | Shorten a URL |
| GET | `/<short_url>` | Redirect to original URL |
| POST | `/generate_qr` | Generate QR code for a URL |

### Shorten URL

**Request:**
```
POST /shorten
Content-Type: application/x-www-form-urlencoded

url=https://example.com&alias=my-custom-alias
```

**Response:**
```json
{
  "short_url": "http://127.0.0.1:5000/my-custom-alias"
}
```

### Generate QR Code

**Request:**
```
POST /generate_qr
Content-Type: application/json

{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "qr_code": "http://127.0.0.1:5000/static/qr_codes/abc123.png"
}
```

## Project Structure

```
URL-Shortener-Project/
├── app.py              # Flask application
├── requirements.txt    # Python dependencies
├── templates/
│   └── index.html      # Main HTML template
└── static/
    ├── styles.css      # Stylesheet
    ├── script.js       # Frontend JavaScript
    └── qr_codes/       # Generated QR code images
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
