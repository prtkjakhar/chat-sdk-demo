# Vercel Chat SDK Workshop Exercises

These exercises will help you get hands-on experience with the Vercel AI SDK and custom artifacts. Complete them in order to build your understanding from basic to advanced concepts.

## Exercise 1: Basic Chat Implementation

**Objective**: Create a simple chat interface that uses the Vercel AI SDK with the OpenAI provider.

**Tasks**:
1. Set up a new Next.js project
2. Install the Vercel AI SDK
3. Create an API route for chat
4. Implement a basic chat UI
5. Test with a simple conversation

## Exercise 2: Add Streaming Capabilities

**Objective**: Enhance your chat implementation to support streaming responses.

**Tasks**:
1. Modify your API route to use `StreamingTextResponse`
2. Update your client to handle streaming
3. Add visual indicators for streaming responses
4. Test with longer responses to see the streaming effect

## Exercise 3: Implement the Code Artifact

**Objective**: Add support for code generation with syntax highlighting.

**Tasks**:
1. Implement the code artifact client component
2. Create the server-side handler
3. Register the artifact with the SDK
4. Test code generation with different languages
5. Add copy-to-clipboard functionality

## Exercise 4: Create a Custom Artifact (Math Equations)

**Objective**: Create a custom artifact for generating and displaying math equations.

**Tasks**:
1. Design the artifact interface
2. Implement the client-side component using MathJax or KaTeX
3. Create the server-side handler
4. Register your custom artifact
5. Test with various mathematical expressions

## Exercise 5: Switch LLM Providers

**Objective**: Learn how to use different LLM providers with the SDK.

**Tasks**:
1. Set up API keys for Google's Gemini
2. Create a custom provider configuration
3. Modify your API route to use the new provider
4. Compare response quality between providers
5. Implement provider selection in the UI

## Exercise 6: Improve the LaTeX Artifact

**Objective**: Enhance the LaTeX artifact with additional features.

**Tasks**:
1. Add a preview/edit toggle
2. Implement LaTeX template selection
3. Add error handling for invalid LaTeX
4. Create a "save to PDF" option
5. Add custom styling options

## Exercise 7: System Prompt Engineering

**Objective**: Learn how to craft effective system prompts for artifact generation.

**Tasks**:
1. Create specialized system prompts for different artifacts
2. Experiment with prompt structures
3. Measure the impact on generation quality
4. Implement a prompt template system
5. Create a UI for customizing prompts

## Exercise 8: Advanced Stream Handling

**Objective**: Implement sophisticated stream handling for complex artifacts.

**Tasks**:
1. Create a streaming dashboard with multiple artifacts
2. Implement cancellation for ongoing streams
3. Add progress indicators for long-running generations
4. Create a stream history viewer
5. Implement a stream replay feature

## Exercise 9: Build a Multi-Artifact Project

**Objective**: Combine multiple artifacts into a cohesive application.

**Tasks**:
1. Create a research assistant that generates text, code, and LaTeX
2. Implement navigation between artifacts
3. Add export functionality for all artifacts
4. Create a unified styling system
5. Implement data persistence

## Exercise 10: Deploy Your Application

**Objective**: Deploy your AI application to Vercel.

**Tasks**:
1. Set up environment variables for production
2. Optimize your application for deployment
3. Set up a GitHub repository
4. Deploy to Vercel
5. Implement monitoring and analytics

## Bonus Challenge: Create a Classroom LMS with AI

Create a learning management system with AI-powered features:
- Auto-generate quizzes from text
- Create LaTeX worksheets for math problems
- Generate code examples for programming courses
- Implement an AI teaching assistant
- Add a grading system with AI feedback