import React from 'react'

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-32 -top-32 w-96 h-96 bg-gradient-to-br from-indigo-300 to-pink-300 opacity-20 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-gradient-to-br from-yellow-300 to-green-300 opacity-10 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative w-full max-w-md px-6">
        <div className="bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl p-8 backdrop-blur-md">
          {children}
        </div>
      </div>
    </div>
  )
}
