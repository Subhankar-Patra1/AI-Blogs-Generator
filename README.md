# AI Blog Generator

A modern, AI-powered blog generator that helps you create, translate, and repurpose content with ease. Built with Next.js, TypeScript, and Tailwind CSS.

---

## ✨ Features

- **AI Blog Generation:** Generate high-quality blog posts using advanced AI models.
- **Content Translation:** Instantly translate blog content into multiple languages.
- **Content Repurposing:** Transform blog posts into email newsletters and more.
- **Customizable Styles & Tones:** Choose from various writing styles and tones.
- **SEO Optimization:** Generate SEO-friendly content with best practices.
- **Modern UI:** Responsive and accessible design with Tailwind CSS.

---

## 🛠 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, PostCSS
- **Package Manager:** pnpm
- **AI Integration:** Google Gemini API
- **State Management:** React Context & Hooks

---

## 📁 Codebase Structure

```
.
├── app/                # Next.js app directory (pages, layouts, actions)
│   ├── actions/        # Server actions (blog generation, translation, etc.)
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main page
├── components/         # Reusable React components
├── contexts/           # React context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries and helpers
├── public/             # Static assets
├── styles/             # Additional styles
├── .env.example        # Example environment variables
├── tailwind.config.ts  # Tailwind CSS configuration
├── postcss.config.mjs  # PostCSS configuration
├── package.json        # Project metadata and scripts
└── tsconfig.json       # TypeScript configuration
```

---

## ⚡ Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/Subhankar-Patra1/AI-Blogs-Generator.git
   cd BLOG-GENERATOR
   ```

2. **Install dependencies:**
   ```sh
   pnpm install
   ```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

```sh
cp .env.example .env
```

**Example variables:**

```
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key-here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
# Add other required variables as needed
```

---

## 🚀 Usage

- **Development:**

  ```sh
  pnpm dev
  ```

  Open [http://localhost:3000](http://localhost:3000) in your browser.

- **Production Build:**
  ```sh
  pnpm build
  pnpm start
  ```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

> Built with ❤️ by Subhankar Patra
