import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  RiUser3Line,
  RiLockLine,
  RiEyeLine,
  RiEyeOffLine,
  RiErrorWarningLine,
} from '@remixicon/react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { AuroraBackdrop } from '@/components/layout/AuroraBackdrop'
import { Logo } from '@/components/layout/Logo'
import { useAuthStore } from '@/store/auth.store'
import { register as registerRequest } from '@/services/auth.service'
import { isNetworkError, resolveApiError } from '@/lib/apiError'
import { appTitle } from '@/config/app'

export default function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const schema = useMemo(
    () =>
      z.object({
        username: z.string().trim().min(3, t('auth.usernameMin')),
        password: z.string().min(6, t('auth.passwordMin')),
      }),
    [t],
  )

  type FormValues = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: '', password: '' },
  })

  if (isAuthenticated) return <Navigate to="/" replace />

  async function onSubmit(values: FormValues) {
    setFormError(null)
    try {
      // Registrasi TIDAK memasang cookie sesi (`AuthController.Register` hanya
      // membuat user), jadi hasilnya tidak boleh diperlakukan sebagai login —
      // arahkan ke halaman masuk alih-alih menaruh profil di store dan membuat
      // UI tampak ter-login padahal setiap request akan 401.
      await registerRequest({ ...values, role: 'VIEWER' })
      toast.success(t('auth.registerSuccess'))
      navigate('/login', { replace: true })
    } catch (error) {
      setFormError(
        isNetworkError(error)
          ? t('auth.serverUnreachable')
          : resolveApiError(error, t('auth.registerFailed')),
      )
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-chrome-content px-4 py-10">
      <AuroraBackdrop variant="auth" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo className="h-14 w-14" />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {appTitle}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('app.subtitle')}</p>
        </div>

        <div className="rounded-card border border-gray-200 bg-white/95 p-6 shadow-card backdrop-blur dark:border-gray-800 dark:bg-gray-900/90">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('auth.registerTitle')}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('auth.registerSubtitle')}
          </p>

          {formError && (
            <div
              role="alert"
              className="mt-5 flex items-start gap-2.5 rounded-card bg-error-50 px-3.5 py-3 dark:bg-error-500/10"
            >
              <RiErrorWarningLine
                size={18}
                className="mt-px shrink-0 text-error-500 dark:text-error-400"
              />
              <p className="text-sm text-error-600 dark:text-error-400">{formError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4" noValidate>
            <Input
              isFullWidth
              id="username"
              label={t('auth.username')}
              placeholder={t('auth.usernamePlaceholder')}
              autoComplete="username"
              autoFocus
              leftIcon={<RiUser3Line size={18} />}
              error={errors.username?.message}
              required
              {...register('username')}
            />

            <Input
              isFullWidth
              id="password"
              type={showPassword ? 'text' : 'password'}
              label={t('auth.password')}
              placeholder={t('auth.passwordPlaceholder')}
              autoComplete="new-password"
              leftIcon={<RiLockLine size={18} />}
              error={errors.password?.message}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                  className="rounded-sm text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                </button>
              }
              required
              {...register('password')}
            />

            <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full">
              {t('auth.register')}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
            {t('auth.haveAccount')}{' '}
            <Link
              to="/login"
              className="font-medium text-brand-600 transition-colors hover:text-brand-500 dark:text-brand-300 dark:hover:text-brand-200"
            >
              {t('auth.signIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
