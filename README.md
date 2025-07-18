## Configuración del Backend (Django Rest)

### Requisitos

- Python 3.8+
- pip

### Instalación

```bash
cd Backend
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Ejecutar el servidor de desarrollo

```bash
cd Backend
source venv/bin/activate
python manage.py migrate
python manage.py runserver
```

## Configuración del Frontend (React)

### Requisitos

- Node.js 14+
- npm

### Instalación

```bash
cd Frontend/adr
npm install
```

### Ejecutar el servidor de desarrollo

```bash
cd Frontend/adr
npm start
```

## Tecnologías Utilizadas

### Backend

- Django 5.2.4
- Django REST Framework 3.16.0
- Django CORS Headers 4.7.0

### Frontend

- React 18
- Axios (para peticiones HTTP)
