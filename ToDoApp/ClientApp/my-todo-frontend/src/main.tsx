import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx' // Or wherever your TodoApp component is
import './index.css' // <-- ADD THIS LINE

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)