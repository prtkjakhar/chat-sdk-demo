# 🧠 Pre-Reads: Getting Started with AI Chat Interfaces using Vercel AI SDK

## ✅ Local Setup (with Vercel)

1. Make a [Vercel account](https://vercel.com) (skip if you already have one).
2. Visit [https://github.com/vercel/ai-chatbot](https://github.com/vercel/ai-chatbot) and click the **Deploy** button in the README.
3. You will be redirected to Vercel's **New Project** page.
4. Set the **Git Scope** to your GitHub username and give a **project name** (you can keep the repo public).
5. Click **Add** to include all AI Products requested by Vercel.
6. For the `AUTH_SECRET` environment variable, you can provide any random value.
7. Click **Deploy** and wait for deployment to complete.
8. Once deployed, explore the live app via the Vercel link.
9. Go to your **GitHub profile**, and you'll see a new repo created by Vercel with the chosen project name.
10. **Clone** this repo to your local machine.
11. Open the repo in your **code editor** and install the Vercel CLI:
    ```bash
    npm i -g vercel
    ```
12. Link the project to your local machine and fetch environment variables:
    ```bash
    vercel link
    vercel env pull
    ```
13. Ensure you have **pnpm** installed. If not:
    ```bash
    npm install -g pnpm
    ```
14. Install dependencies and start the dev server:
    ```bash
    pnpm install
    pnpm dev
    ```

---

## 🛠️ Local Setup (without Vercel)

1. **Fork** the repo: [https://github.com/vercel/ai-chatbot](https://github.com/vercel/ai-chatbot)
2. **Clone** your forked repo to your local machine.
3. Create a `.env` file in the root folder and populate it with the variables from `.env.example`.
4. Use **pnpm** to install dependencies and run the app:
    ```bash
    pnpm install
    pnpm dev
    ```

---

![Vercel AI SDK](https://vercel.com/_next/image?url=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Fcontentful%2Fimage%2Fe5382hct74si%2FpnQF1eJ7kXPdEdMP0qv8v%2F30c05be62142567942b702210aae1024%2Farch-simple-dark.png&w=1920&q=75)

---

## Docs to Read

- [Chat SDK](https://chat-sdk.dev/docs/getting-started/overview)
- [Artifacts](https://chat-sdk.dev/docs/customization/artifacts)
- [Agents](https://ai-sdk.dev/docs/foundations/agents)
- [Providers and Models](https://ai-sdk.dev/docs/foundations/providers-and-models)
- [AI SDK](https://ai-sdk.dev/docs/introduction)

Happy hacking! 🚀
