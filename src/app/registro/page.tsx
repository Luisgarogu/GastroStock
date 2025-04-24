"use client";

import { useState } from "react";

const EMAIL_REGEX =
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

interface FormErrors {
  email?: string;
  password?: string;
  confirm?: string;
}

export default function Registro() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: FormErrors = {};
    if (!EMAIL_REGEX.test(email))
      newErrors.email = "Ingresa un correo válido.";
    if (!PASSWORD_REGEX.test(password))
      newErrors.password =
        "Contraseña: mínimo 8 caracteres, con letras y números.";
    if (confirm !== password)
      newErrors.confirm = "Las contraseñas no coinciden.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Registro válido ✅");
      // TODO: enviar datos a /api/auth/signup o similar
    }
  };

  /** Utilidad para colorear bordes según error */
  const inputClass = (hasError: boolean) =>
    `w-full rounded-lg border py-3 pl-11 pr-4 text-sm shadow-sm focus:ring-emerald-500 ${
      hasError
        ? "border-red-500 focus:border-red-500"
        : "border-gray-300 focus:border-emerald-500"
    }`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#c6ffd9] to-white">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <img
            src="/images/login/GastroStockIcon.webp"
            alt="GastroStock Icono"
            className="h-30 w-auto"
          />
          <h1 className="mt-4 text-2xl font-semibold tracking-wide text-gray-800">
            GastroStock – Registro de Usuario
          </h1>
        </div>

        {/* Formulario */}
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          {/* Correo */}
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l9 6 9-6m-18 8h18V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8z"
              />
            </svg>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${inputClass(!!errors.email)} text-gray-800 bg-white/60 placeholder-gray-500`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-600 -mt-4">{errors.email}</p>
          )}

          {/* Contraseña */}
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m6-6V9a6 6 0 10-12 0v2m-2 0h16v9a2 2 0 01-2 2H6a2 2 0 01-2-2v-9z"
              />
            </svg>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass(!!errors.password)} text-gray-800 bg-white/60 placeholder-gray-500`}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-red-600 -mt-4">{errors.password}</p>
          )}

          {/* Confirmar contraseña */}
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m6-6V9a6 6 0 10-12 0v2m-2 0h16v9a2 2 0 01-2 2H6a2 2 0 01-2-2v-9z"
              />
            </svg>
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={`${inputClass(!!errors.confirm)} text-gray-800 bg-white/60 placeholder-gray-500`}
            />
          </div>
          {errors.confirm && (
            <p className="text-xs text-red-600 -mt-4">{errors.confirm}</p>
          )}

          {/* Botones */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 rounded-full bg-emerald-600 py-3 text-sm font-medium text-white shadow-md transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              Registrarse
            </button>
            <a
              href="/login"
              className="flex-1 rounded-full border border-emerald-600 py-3 text-center text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
            >
              Volver a Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
