import React from "react";
import ReactDOM from "react-dom/client";
import ChatWidget from './components/chat-widget.jsx'
import "/src/App.css";
import './index.css'

window.ChatWidget = {
  init: (options = {}) => {
    const containerId = options.containerId || "chat-widget-root";

    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement("div");
      container.id = containerId;
      document.body.appendChild(container);
    }

    const root = ReactDOM.createRoot(container);
    root.render(<ChatWidget {...options} />);
  },
};
