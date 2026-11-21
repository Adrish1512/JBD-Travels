import os
from app import create_app

env = os.environ.get('FLASK_CONFIG', 'development')
app = create_app(env)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"================================================================")
    print(f"  JBD Travels - AI-Assisted Travel Planning & Management System")
    print(f"  Running on: http://127.0.0.1:{port}")
    print(f"  Environment: {env}")
    print(f"  Default Accounts:")
    print(f"    - Admin:    admin@jbdtravels.com / Admin123!")
    print(f"    - Employee: agent@jbdtravels.com / Agent123!")
    print(f"    - Customer: customer@jbdtravels.com / Customer123!")
    print(f"================================================================")
    app.run(host='0.0.0.0', port=port, debug=True)
