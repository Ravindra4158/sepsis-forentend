import config from '@/config/config'

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(ward = null) {
    if (this.socket) {
      this.disconnect();
    }

    // Default configuration assuming WS uses the same host as API
    // Ensure properly formatted URLs
    let wsUrl = '';
    if (config.apiUrl) {
       wsUrl = config.apiUrl.replace(/^http/, 'ws');
       // Remove trailing api/v1 if included in apiUrl
       wsUrl = wsUrl.replace(/\/api\/v1\/?$/, '');
       // Or fallback
    } else {
       wsUrl = `ws://${window.location.hostname}:8000`;
    }
    
    // In FastApi, typical ws routes are at root or specific paths
    const endpoint = ward ? `/ws/alerts/${ward}` : '/ws/alerts';
    const fullUrl = `${wsUrl}${endpoint}`;
    
    console.log(`Connecting to WebSocket: ${fullUrl}`);
    this.socket = new WebSocket(fullUrl);

    this.socket.onopen = () => {
      console.log(`WebSocket connected to ${endpoint}`);
      this.emit('connected');
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.emit('message', data);
      } catch (err) {
        console.error('WebSocket message parsing error:', err);
      }
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      this.emit('disconnected');
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;
    const callbacks = this.listeners.get(event).filter(cb => cb !== callback);
    this.listeners.set(event, callbacks);
  }
  
  emit(event, data) {
      const callbacks = this.listeners.get(event) || [];
      callbacks.forEach(cb => cb(data));
  }
}

export const socketService = new SocketService();
export default socketService;
