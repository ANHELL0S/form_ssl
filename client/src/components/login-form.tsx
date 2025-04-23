'use client'

import axios from 'axios'
import { cn } from '@/lib/utils'
import { useState } from 'react'

import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface SuccessResponse {
	data: {
		meta: {
			userId: string
			sesionAtd: string
		}
		token: string
	}
	message: string
}

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
	const [formData, setFormData] = useState({ email: '', password: '' })
	const [success, setSuccess] = useState<SuccessResponse | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const apiUrl = process.env.NEXT_PUBLIC_URL_API

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target
		setFormData(prev => ({ ...prev, [id]: value }))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)
		setSuccess(null)

		try {
			const response = await axios.post(`${apiUrl}/login`, formData, {
				withCredentials: true,
			})
			setSuccess(response.data)
			toast.success(response?.data?.message)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			toast.error(err?.response?.data?.message || 'Ha ocurrido un error inesperado')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className={cn('flex flex-col gap-6 w-full max-w-lg mx-auto', className)} {...props}>
			{success ? (
				<Card className='text-gray-800 w-full'>
					<CardHeader>
						<CardTitle className='text-xl'>Bienvenido</CardTitle>
						<CardDescription>¡Has iniciado sesión exitosamente!</CardDescription>
					</CardHeader>
					<CardContent className='flex flex-col gap-4'>
						<div className='flex items-center justify-between'>
							<span className='font-medium'>Usuario ID:</span>
							<span>{success?.data?.meta?.userId}</span>
						</div>
						<div className='flex items-center justify-between'>
							<span className='font-medium'>Sesión iniciada en:</span>
							<span>
								{new Date(success?.data?.meta?.sesionAtd).toLocaleString('es-ES', {
									day: '2-digit',
									month: '2-digit',
									year: '2-digit',
									hour: '2-digit',
									minute: '2-digit',
									second: '2-digit',
									hour12: false,
								})}
							</span>
						</div>
						<div className='flex items-center justify-between'>
							<span className='font-medium'>Token:</span>
							<span className='truncate'>{success?.data?.token}</span>
						</div>
					</CardContent>
				</Card>
			) : (
				<Card>
					<CardHeader>
						<CardTitle>Inicia sesión en tu cuenta</CardTitle>
						<CardDescription>
							Ingrese su correo electrónico a continuación para iniciar sesión en su cuenta
						</CardDescription>
					</CardHeader>

					<CardContent>
						<form onSubmit={handleSubmit}>
							<div className='flex flex-col gap-6 w-full'>
								<div className='grid gap-3'>
									<Label htmlFor='email'>E-mail</Label>
									<Input
										id='email'
										type='email'
										placeholder='m@ejemplo.com'
										value={formData.email}
										onChange={handleChange}
										disabled={isSubmitting}
									/>
								</div>

								<div className='grid gap-3'>
									<Label htmlFor='password'>Contraseña</Label>
									<Input
										id='password'
										type='password'
										placeholder='********'
										value={formData.password}
										onChange={handleChange}
										disabled={isSubmitting}
									/>
								</div>

								<div className='flex flex-col gap-3'>
									<Button type='submit' className='w-full' disabled={isSubmitting}>
										{isSubmitting ? 'Iniciando...' : 'Continuar'}
									</Button>
								</div>
							</div>
						</form>
					</CardContent>
				</Card>
			)}
		</div>
	)
}
