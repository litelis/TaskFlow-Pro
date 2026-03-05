#!/usr/bin/env python3
"""
TaskFlow Pro - Launcher Script
Automatically installs dependencies and starts the development server.
"""

import os
import sys
import subprocess
import webbrowser
import time

def print_banner():
    print("=" * 50)
    print("  🚀 TaskFlow Pro - Starting...")
    print("=" * 50)
    print()

def install_dependencies():
    print("📦 Installing dependencies...")
    try:
        subprocess.run(
            ["npm", "install"],
            cwd=os.path.dirname(os.path.abspath(__file__)),
            check=True
        )
        print("✅ Dependencies installed successfully!")
        print()
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing dependencies: {e}")
        sys.exit(1)
    except FileNotFoundError:
        print("❌ Error: npm not found. Please install Node.js first.")
        print("   Download from: https://nodejs.org/")
        sys.exit(1)

def start_server():
    print("🌐 Starting development server...")
    print("   URL: http://localhost:3000")
    print()
    print("Press Ctrl+C to stop the server")
    print("-" * 50)
    
    # Open browser after a short delay
    def open_browser():
        time.sleep(2)
        webbrowser.open("http://localhost:3000")
    
    import threading
    browser_thread = threading.Thread(target=open_browser, daemon=True)
    browser_thread.start()
    
    try:
        subprocess.run(
            ["npm", "run", "dev"],
            cwd=os.path.dirname(os.path.abspath(__file__))
        )
    except KeyboardInterrupt:
        print()
        print("👋 Server stopped. Thanks for using TaskFlow Pro!")

def main():
    print_banner()
    
    # Check if node_modules exists
    project_dir = os.path.dirname(os.path.abspath(__file__))
    node_modules = os.path.join(project_dir, "node_modules")
    
    if not os.path.exists(node_modules):
        install_dependencies()
    else:
        print("✅ Dependencies already installed")
        print()
    
    start_server()

if __name__ == "__main__":
    main()

