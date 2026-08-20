import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
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
  RiSunLine,
  RiMoonLine,
} from '@remixicon/react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Tooltip } from '@/components/ui/Tooltip'
import { FlagGB, FlagID } from '@/components/ui/Flag'
import { AuroraBackdrop } from '@/components/layout/AuroraBackdrop'
import { Logo } from '@/components/layout/Logo'
import { useAuthStore } from '@/store/auth.store'
import { useThemeStore } from '@/store/theme.store'
import { useLanguageStore } from '@/store/language.store'
import { login as loginRequest } from '@/services/auth.service'
import { isNetworkError, isUnauthorized, resolveApiError } from '@/lib/apiError'
import { appTitle } from '@/config/app'

const iconButton =
  'flex h-9 w-9 items-center justify-center rounded-button text-gray-500 transition-colors hover:bg-white/70 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-brand-200'

const flagChip = 'h-3 w-5 shrink-0 rounded-sm ring-1 ring-black/10 dark:ring-white/15'

export default function LoginPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const setSession = useAuthStore((s) => s.setSession)
  const { theme, toggle: toggleTheme } = useThemeStore()
  const toggleLanguage = useLanguageStore((s) => s.toggle)

  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const isId = i18n.language.startsWith('id')

  // Skema dibangun ulang saat bahasa berganti supaya pesan validasinya ikut
  // berpindah bahasa — skema modul-level akan mengunci pesannya ke bahasa yang
  // aktif saat modulnya pertama dievaluasi.
  const schema = useMemo(
    () =>
      z.object({
        username: z.string().trim().min(1, t('auth.usernameRequired')),
        password: z.string().min(1, t('auth.passwordRequired')),
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

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/'

  // Sudah punya sesi — tidak ada gunanya menampilkan form lagi. Tujuannya harus
  // `from`, bukan '/': `setSession()` memicu render ulang dan cabang ini menang
  // balapan melawan `navigate(from)` di onSubmit; kalau keduanya tidak sepakat,
  // operator yang tadinya menuju /connectivity/devices akan terlempar ke dasbor.
  if (isAuthenticated) return <Navigate to={from} replace />

  async function onSubmit(values: FormValues) {
    setAuthError(null)
    try {
      const user = await loginRequest(values)
      setSession(user)
      toast.success(t('auth.loginSuccess'))
      navigate(from, { replace: true })
    } catch (error) {
      setAuthError(resolveLoginError(error))
    }
  }

  function resolveLoginError(error: unknown): string {
    if (isUnauthorized(error)) return t('auth.invalidCredentials')
    // Jaringan lokal putus atau gateway belum menyala — bedakan dari kredensial
    // salah, kalau tidak operator akan mengetik ulang password yang sudah benar.
    if (isNetworkError(error)) return t('auth.serverUnreachable')
    return resolveApiError(error, t('auth.loginFailed'))
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-chrome-content px-4 py-10">
      <AuroraBackdrop variant="auth" />

      <div className="absolute right-4 top-4 z-10 flex items-center gap-1">
        <Tooltip content={t('lang.switch')} position="bottom">
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={t('lang.switch')}
            className={iconButton}
          >
            {isId ? <FlagID className={flagChip} /> : <FlagGB className={flagChip} />}
          </button>
        </Tooltip>
        <Tooltip content={theme === 'dark' ? t('theme.light') : t('theme.dark')} position="bottom">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t('theme.light') : t('theme.dark')}
            className={iconButton}
          >
            {theme === 'dark' ? <RiSunLine size={20} /> : <RiMoonLine size={20} />}
          </button>
        </Tooltip>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo className="h-14 w-14" />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {appTitle}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('app.subtitle')}</p>
        </div>

        <div className="rounded-card border border-gray-200 bg-white/95 p-6 shadow-card backdrop-blur dark:border-gray-800 dark:bg-gray-900/90">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('auth.login')}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('auth.subtitle')}</p>

          {/* Banner, bukan toast: pesannya harus bertahan selagi operator
              mengetik ulang. Toast empat detik sudah hilang sebelum ia selesai
              membaca alasannya. */}
          {authError && (
            <div
              role="alert"
              className="mt-5 flex items-start gap-2.5 rounded-card bg-error-50 px-3.5 py-3 dark:bg-error-500/10"
            >
              <RiErrorWarningLine
                size={18}
                className="mt-px shrink-0 text-error-500 dark:text-error-400"
              />
              <p className="text-sm text-error-600 dark:text-error-400">{authError}</p>
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
              autoComplete="current-password"
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
              {t('auth.signIn')}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
            {t('auth.noAccount')}{' '}
            <Link
              to="/register"
              className="font-medium text-brand-600 transition-colors hover:text-brand-500 dark:text-brand-300 dark:hover:text-brand-200"
            >
              {t('auth.register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
