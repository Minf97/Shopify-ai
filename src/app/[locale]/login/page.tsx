'use client'

import { login, signup, signInWithGitHub, signInWithGoogle } from './actions'

export default function LoginPage() {
  return (
    <>
      <style>
        {`
          .glass-effect {
            background: rgba(23, 23, 23, 0.8);
            backdrop-filter: blur(8px);
          }
          .input-focus-effect:focus {
            box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3);
          }
          .btn-hover-effect:hover {
            transform: translateY(-1px);
          }
        `}
      </style>
      
      <div className="bg-[#111111] min-h-screen flex items-center justify-center text-gray-200 font-sans">
        <div className="fixed inset-0 glass-effect flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#151515] border border-[#222222] rounded-xl overflow-hidden shadow-2xl">
            {/* Logo header */}
            <div className="pt-8 pb-2 px-8 flex justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            {/* Modal content */}
            <div className="px-8 pb-8">
              <h2 className="text-xl font-medium text-white text-center mb-1">Welcome back</h2>
              <p className="text-sm text-gray-500 text-center mb-6">Sign in to your account to continue</p>
              
              {/* Form */}
              <form>
                <div className="space-y-4 mb-6">
                  {/* Email input */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label htmlFor="email" className="block text-xs font-medium text-gray-400">Email</label>
                      <span className="text-xs text-indigo-400">Required</span>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input 
                        id="email" 
                        name="email"
                        type="email" 
                        required
                        className="input-focus-effect block w-full bg-[#1A1A1A] border border-[#333333] rounded-md pl-10 pr-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition duration-150" 
                        placeholder="name@company.com"
                      />
                    </div>
                  </div>
                  
                  {/* Password input */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label htmlFor="password" className="block text-xs font-medium text-gray-400">Password</label>
                      <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition">Forgot?</a>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input 
                        id="password" 
                        name="password"
                        type="password" 
                        required
                        className="input-focus-effect block w-full bg-[#1A1A1A] border border-[#333333] rounded-md pl-10 pr-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition duration-150" 
                        placeholder="••••••••••"
                      />
                    </div>
                  </div>
                  
                  {/* Remember me checkbox */}
                  <div className="flex items-center">
                    <input 
                      id="remember-me" 
                      type="checkbox" 
                      className="h-4 w-4 bg-[#1A1A1A] border-[#333333] rounded text-indigo-500 focus:ring-indigo-600 focus:ring-opacity-25"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-400">Remember me for 30 days</label>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="space-y-3">
                  <button 
                    formAction={login}
                    type="submit" 
                    className="btn-hover-effect w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150"
                  >
                    Sign in
                  </button>
                  
                  <button 
                    formAction={signup}
                    type="submit" 
                    className="btn-hover-effect w-full flex justify-center py-2.5 px-4 border border-[#333333] rounded-md shadow-sm text-sm font-medium text-gray-300 bg-transparent hover:bg-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150"
                  >
                    Create Account
                  </button>
                </div>
              </form>
              
              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#222222]"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 bg-[#151515] text-gray-500">Or continue with</span>
                </div>
              </div>
              
              {/* Social logins */}
              <div className="grid grid-cols-2 gap-3">
                <form action={signInWithGitHub}>
                  <button 
                    type="submit"
                    className="btn-hover-effect w-full flex justify-center items-center py-2 px-4 bg-[#1A1A1A] border border-[#333333] rounded-md hover:bg-[#222222] transition-all duration-150"
                  >
                    <svg className="h-5 w-5 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span className="ml-2 text-xs">GitHub</span>
                  </button>
                </form>
                
                <form action={signInWithGoogle}>
                  <button 
                    type="submit"
                    className="btn-hover-effect w-full flex justify-center items-center py-2 px-4 bg-[#1A1A1A] border border-[#333333] rounded-md hover:bg-[#222222] transition-all duration-150"
                  >
                    <svg className="h-5 w-5 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span className="ml-2 text-xs">Google</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}