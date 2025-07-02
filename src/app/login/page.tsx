'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import emailjs from '@emailjs/browser';

/* ─── validaciones ─────────────────────────────────────────── */
const EMAIL    = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const PASSWORD = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

/* ─── EmailJS (tus ids) ────────────────────────────────────── */
const EMAILJS_SERVICE_ID  = 'service_cv1fq7o';
const EMAILJS_TEMPLATE_ID = 'template_l3lqvmu';
const EMAILJS_PUBLIC_KEY  = 'dzz7U2uXTrwd3kMME';

interface Errors {
  email?: string;
  password?: string;
  code?: string;
  sendMail?: string;
}

export default function Login() {
  const router = useRouter();

  /* -------- estado login -------- */
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [errors,   setErrors]   = useState<Errors>({});

  /* -------- modal verificación -------- */
  const [showDialog, setShowDialog] = useState(false);
  const [genCode,    setGenCode]    = useState<string | null>(null);
  const [codeInput,  setCodeInput]  = useState('');
  const [sending,    setSending]    = useState(false);
  const [mailSent,   setMailSent]   = useState(false);

  /* ───────── handlers ─────────────────────────────────────── */

  /** submit del login */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const err: Errors = {};
    if (!EMAIL.test(email))        err.email    = 'Correo inválido';
    if (!PASSWORD.test(password))  err.password = 'Contraseña débil';
    setErrors(err);

    if (Object.keys(err).length) return;

    /* —— aquÍ llamarías a tu API de autenticación —— */
    // const ok = await AuthService.login(email, password);
    // if (!ok) { setErrors({ password: 'Credenciales incorrectas' }); return; }

    /* Demo: guardamos flag y recargamos */
    localStorage.setItem('auth', 'true');

    /* Hard-refresh que reconstruye toda la app y hace que el navbar
       se muestre inmediatamente; evita al usuario tener que pulsar F5 */
    window.location.href = '/productos';
  };

  /** genera y envía código para registro */
  const openVerificationDialog = async () => {
    setErrors({});
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGenCode(code);
    setCodeInput('');
    setShowDialog(true);
    setSending(true);
    setMailSent(false);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { code },
        EMAILJS_PUBLIC_KEY
      );
      setMailSent(true);
    } catch {
      setErrors({ sendMail: 'No se pudo enviar el correo, inténtalo de nuevo.' });
    } finally {
      setSending(false);
    }
  };

  /** comprobar código modal */
  const handleVerifyCode = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (codeInput === genCode) window.location.href = '/registro';
    else setErrors({ code: 'Código incorrecto' });
  };

  const inputClass = (err?: string) =>
    `w-full rounded-lg border py-3 pl-11 pr-4 text-sm shadow-sm focus:ring-emerald-500 ${
      err ? 'border-red-500 focus:border-red-500'
          : 'border-gray-300 focus:border-emerald-500'
    }`;

  /* ───────── UI ────────────────────────────────────────────── */

  return (
    <>
      {/* Pantalla de login */}
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#c6ffd9] to-white">
        <div className="w-full max-w-sm space-y-8">

          {/* Logo */}
          <div className="flex flex-col items-center">
            <img src="/images/login/GastroStockIcon.webp" alt="" className="h-60 w-auto" />
          </div>

          {/* Formulario */}
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="relative">
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${inputClass(errors.email)} text-gray-800 bg-white/60 placeholder-gray-500`}
              />
            </div>
            {errors.email && <p className="text-xs text-red-600 -mt-4">{errors.email}</p>}

            {/* Contraseña */}
            <div className="relative">
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass(errors.password)} text-gray-900 bg-white/60 placeholder-gray-500`}
              />
            </div>
            {errors.password && <p className="text-xs text-red-600 -mt-4">{errors.password}</p>}

            {/* Botones */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 rounded-full bg-emerald-600 py-3 text-sm font-medium text-white hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500"
              >
                Login
              </button>

              <button
                type="button"
                onClick={openVerificationDialog}
                className="flex-1 rounded-full border border-emerald-600 py-3 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
              >
                Registro
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de verificación */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-2 text-lg font-semibold text-gray-800">
              Verificación por parte del administrador
            </h2>

            {sending && <p className="text-sm text-gray-700">Enviando código…</p>}
            {errors.sendMail && <p className="text-xs text-red-600">{errors.sendMail}</p>}

            {mailSent && (
              <>
                <p className="mb-3 text-sm text-gray-700">
                  Se envió un código de 4 dígitos a&nbsp;
                  <span className="font-medium">luisgarogu@gmail.com</span>.
                </p>

                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <input
                    maxLength={4}
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    className={`${inputClass(errors.code)} text-center tracking-widest text-lg text-gray-700`}
                    placeholder="0000"
                  />
                  {errors.code && <p className="text-xs text-red-600">{errors.code}</p>}

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowDialog(false)}
                      className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                    >
                      Verificar
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
