# 🔒 SecretPass

A secure, self-hosted web application for sharing sensitive information through one-time access links. Perfect for sharing passwords, API keys, or other confidential data in a controlled environment.

## Features

- **One-Time Access**: Secrets are automatically destroyed after being viewed once
- **Time-Limited**: Configurable expiration times (1 hour to 7 days)
- **Simple Interface**: Clean, intuitive web UI
- **No Database Required**: Uses in-memory storage for maximum security
- **Docker Ready**: Easy deployment with Docker and Docker Compose
- **Secure by Default**: Secrets are deleted immediately after access or expiration

## Quick Start

### Using Docker (Recommended)

1. **Build and run with Docker Compose**:
   ```bash
   docker-compose up -d
   ```

2. **Access the application**:
   Open your browser to `http://localhost:3000`

3. **Stop the application**:
   ```bash
   docker-compose down
   ```

### Using Docker without Compose

1. **Build the image**:
   ```bash
   docker build -t secretpass .
   ```

2. **Run the container**:
   ```bash
   docker run -d -p 3000:3000 --name secretpass secretpass
   ```

3. **Access the application**:
   Open your browser to `http://localhost:3000`

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

3. **Access the application**:
   Open your browser to `http://localhost:3000`

## How It Works

1. **Create a Secret**:
   - Enter your sensitive data in the text field
   - Choose an expiration time
   - Click "Generate Secret Link"

2. **Share the Link**:
   - Copy the generated unique URL
   - Send it to the intended recipient

3. **View the Secret**:
   - Recipient opens the link
   - Secret is displayed and immediately deleted from the server
   - The link becomes invalid after first access

## API Endpoints

### Create a Secret
```http
POST /api/secret
Content-Type: application/json

{
  "secret": "your secret message",
  "expiresIn": 86400000  // milliseconds (optional, default: 24h)
}
```

Response:
```json
{
  "id": "uuid",
  "url": "http://localhost:3000/view.html?id=uuid"
}
```

### Retrieve a Secret
```http
GET /api/secret/:id
```

Response (one-time only):
```json
{
  "secret": "your secret message",
  "createdAt": 1234567890
}
```

### Health Check
```http
GET /api/health
```

Response:
```json
{
  "status": "healthy",
  "activeSecrets": 5,
  "uptime": 123.45
}
```

## Configuration

### Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)

### Expiration Times

Modify the options in `public/index.html`:
```html
<select id="expiry-select">
    <option value="3600000">1 hour</option>
    <option value="21600000">6 hours</option>
    <option value="86400000" selected>24 hours</option>
    <option value="604800000">7 days</option>
</select>
```

## Security Considerations

1. **In-Memory Storage**: Secrets are stored in memory and lost on server restart (by design)
2. **HTTPS Recommended**: Use HTTPS in production to protect secrets in transit
3. **No Logging**: Secrets are never logged to disk
4. **Immediate Deletion**: Secrets are destroyed immediately after first access
5. **Auto-Expiration**: Unaccessed secrets are automatically deleted after expiration time

## Production Deployment

For production use, consider:

1. **Use HTTPS**: Deploy behind a reverse proxy (nginx, Traefik) with SSL/TLS
2. **Use Redis**: For persistent storage across container restarts, integrate Redis
3. **Rate Limiting**: Add rate limiting to prevent abuse
4. **Authentication**: Add authentication for creating secrets (optional)
5. **Monitoring**: Monitor the `/api/health` endpoint

### Example nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name secrets.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Use Cases

- Sharing passwords with team members
- Sending API keys securely
- One-time delivery of sensitive configuration
- Secure credential exchange during onboarding
- Emergency access to critical information

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License - feel free to use this in your own projects!

## Support

For issues, questions, or suggestions, please open an issue on the project repository.
