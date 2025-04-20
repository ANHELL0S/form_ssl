// UTILS
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config()

// SERVER
import cors from 'cors'
import http from 'http'
import https from 'https'
import express from 'express'

const app = express()
const port = Number(process.env.PORT) || 4000
const useSSL = process.env.USE_SSL === 'true'
const __dirname = path.resolve()

// PERMITIR ACCESO DESDE OTRO ORIGEN
app.use(
	cors({
		origin: ['http://localhost:3000', 'http://192.168.1.19:3000'],
		credentials: true,
	})
)

app.use(express.json())

function verifySSLFiles() {
	const sslPath = path.join(__dirname, 'ssl')
	const keyPath = path.join(sslPath, 'localhost-key.pem')
	const certPath = path.join(sslPath, 'localhost.pem')

	if (!fs.existsSync(sslPath)) {
		console.error(`❌ No existe el directorio SSL: ${sslPath}`)
		return false
	}

	const files = fs.readdirSync(sslPath)
	console.log('📁 Archivos encontrados en ssl/:', files)

	if (!files.includes('localhost-key.pem') || !files.includes('localhost.pem')) {
		console.error('❌ Faltan archivos SSL')
		return false
	}

	try {
		fs.accessSync(keyPath, fs.constants.R_OK)
		fs.accessSync(certPath, fs.constants.R_OK)
		return true
	} catch (err) {
		console.error('🔒 Error de permisos:', err.message)
		return false
	}
}

app.get('/', (req, res) => {
	res.send(`✅ Servidor funcionando con ${useSSL ? 'HTTPS' : 'HTTP'}`)
})

// 🔐 Endpoint de login
app.post('/login', (req, res) => {
	const { email, password } = req.body

	if (!email || !password)
		return res.status(400).json({ code: 400, succes: false, message: 'Faltan email o password', data: null })

	if (email === 'admin@gmail.com' && password === 'admin@gmail.com') {
		return res.status(200).json({
			code: 200,
			succes: true,
			message: 'Inicio de sesión exitoso',
			data: {
				token:
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
				meta: {
					userId: '5c0ed583-ac4a-4d79-9025-35cbf06150f2',
					sesionAtd: new Date().toISOString(),
				},
			},
		})
	} else {
		return res.status(401).json({ code: 401, succes: false, message: 'Credenciales inválidas', data: null })
	}
})

// 🔧 Iniciar servidor
if (useSSL) {
	if (!verifySSLFiles()) {
		console.log('\n💡 Ejecuta estos comandos para solucionarlo:')
		console.log('rm -rf ssl/')
		console.log('mkdir -p ssl && cd ssl')
		console.log(
			'openssl req -x509 -newkey rsa:4096 -keyout localhost-key.pem -out localhost.pem -days 365 -nodes -subj "/CN=localhost"'
		)
		process.exit(1)
	}

	const sslOptions = {
		key: fs.readFileSync(path.join(__dirname, 'ssl', 'localhost-key.pem')),
		cert: fs.readFileSync(path.join(__dirname, 'ssl', 'localhost.pem')),
	}

	https.createServer(sslOptions, app).listen(port, () => {
		console.log(`🚀 Servidor HTTPS activo en: https://localhost:${port}`)
	})
} else {
	http.createServer(app).listen(port, () => {
		console.log(`🚀 Servidor HTTP activo en: http://localhost:${port}`)
	})
}
