export default function FooterSection() {
  return (
    <footer className="py-16 md:py-24 bg-black text-white relative min-h-[200px] w-full border-t border-zinc-900">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>

      <div className="mx-auto max-w-5xl px-6 relative z-10 h-full flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xl font-bold text-gray-200 tracking-tight">&lt;CodeSync/&gt;</span>
        </div>

        <p className="text-gray-400 text-sm text-center max-w-md mb-8">
          Real-time collaborative code editor with instant synchronization, multi-language support, and interactive code execution.
        </p>

        <div className="flex justify-center gap-6 mb-8">
          <a
            href="https://github.com/rj9884/codeSync"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <svg className="size-5" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"
              ></path>
            </svg>
          </a>
        </div>

        <span className="text-gray-500 text-center text-xs">
          © {new Date().getFullYear()} CodeSync. All rights reserved.
        </span>
      </div>
    </footer>
  )
}
