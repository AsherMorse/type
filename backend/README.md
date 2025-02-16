# Backend Server

## Setup

1. Install dependencies:
```bash
npm install
```

2. Development:
```bash
npm run dev
```

3. Production Build:
```bash
npm run build
npm start
```

## Endpoints

- `/health`: Health check endpoint 

# Backend Setup with Nginx

## Prerequisites
- Node.js
- npm
- Nginx

## Nginx Configuration

### Installation
1. Install Nginx:
   - macOS: `brew install nginx`
   - Ubuntu/Debian: `sudo apt-get install nginx`
   - CentOS/RHEL: `sudo yum install nginx`

### Configuration Steps
1. Symlink or copy the Nginx configuration:
   ```bash
   sudo ln -s $(pwd)/nginx.conf /usr/local/etc/nginx/nginx.conf
   ```

2. Test Nginx configuration:
   ```bash
   npm run nginx:test
   ```

3. Reload Nginx:
   ```bash
   npm run nginx:reload
   ```

## Development Workflow
1. Build the project:
   ```bash
   npm run build
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Development with Nodemon:
   ```bash
   npm run dev
   ```

## Notes
- Nginx will proxy requests to `localhost:3000`
- Adjust `nginx.conf` as needed for your specific setup 