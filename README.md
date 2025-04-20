# Security Form Server

Este proyecto es un servidor básico para manejar un formulario de seguridad. Está construido con Node.js y Express, y soporta tanto HTTP como HTTPS.

## Requisitos

- Node.js (v14 o superior)
- OpenSSL o Mkcert (para generar certificados SSL si se usa HTTPS)

## Instalación

1. Clona este repositorio:
	```bash
	git clone <url-del-repositorio>
	cd security_form
	```

2. Instala las dependencias:
   - Dentro de server y client 
	```bash
	npm install
	```

4. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
	```
	PORT=4000
	USE_SSL=true
	```

5. Si `USE_SSL` está configurado como `true`, asegúrate de tener los certificados SSL en la carpeta `ssl/`. Si no existen, puedes generarlos ejecutando:
	```bash
	rm -rf ssl/
	mkdir -p ssl && cd ssl
	openssl req -x509 -newkey rsa:4096 -keyout localhost-key.pem -out localhost.pem -days 365 -nodes -subj "/CN=localhost"
	```

## Uso

1. Inicia el servidor:
	```bash
	node server.js
	```

2. El servidor estará disponible en:
	- HTTP: `http://localhost:<PORT>` (si `USE_SSL=false`)
	- HTTPS: `https://localhost:<PORT>` (si `USE_SSL=true`)

## Endpoints

### `GET /`

- **Descripción:** Verifica que el servidor está funcionando.
- **Respuesta:**
	```json
	{
	 "message": "✅ Servidor funcionando con HTTP/HTTPS"
	}
	```

### `POST /login`

- **Descripción:** Endpoint para iniciar sesión.
- **Cuerpo de la solicitud:**
	```json
	{
	 "email": "string",
	 "password": "string"
	}
	```
- **Respuestas:**
	- **200 OK:** Inicio de sesión exitoso.
	 ```json
	 {
		"code": 200,
		"succes": true,
		"message": "Inicio de sesión exitoso",
		"data": {
			"token": "string",
			"meta": {
			 "userId": "string",
			 "sesionAtd": "string"
			}
		}
	 }
	 ```
	- **400 Bad Request:** Faltan credenciales.
	 ```json
	 {
		"code": 400,
		"succes": false,
		"message": "Faltan email o password",
		"data": null
	 }
	 ```
	- **401 Unauthorized:** Credenciales inválidas.
	 ```json
	 {
		"code": 401,
		"succes": false,
		"message": "Credenciales inválidas",
		"data": null
	 }
	 ```

## Notas

- Este servidor está configurado para permitir solicitudes CORS desde `http://localhost:3000` y `http://192.168.1.19:3000`.
- Los certificados SSL deben estar en la carpeta `ssl/` con los nombres `localhost-key.pem` y `localhost.pem`.

## Licencia

Este proyecto está bajo la licencia MIT.
