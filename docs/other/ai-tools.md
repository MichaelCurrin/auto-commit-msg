# AI tools
> Using AI to generate commit messages

## AI-based extensions

Search for "gpt commit" in the extensions marketplace and you'll see plenty of extensions that use GPT to write your commit message.

e.g. [GPT Commit](https://marketplace.visualstudio.com/items?itemName=DmytroBaida.gpt-commit)

If done well, this could be even more flexible, thorough and natural than this Auto Commit Msg extension which has no AI (but at least handles basic messages for a variety of cases based on the paths of the files that changed rather than the contents).

You can also try [Codeium](https://codeium.com/download) extension which has a lot of AI chat and completion features and includes a commit message generator (but it always gives me an error).

### Downsides

- There's a time delay.
- Requires network access.
- Your code is shared across the internet with OpenAI etc., which can cause issues for private and company projects.
- You need to a ChatGPT API key and to pay for a premium subscription.
- Limited acccuracy - I don't know if GPT is powerful enough to figure out the context of what you are doing and intend to write based on a diff only, as some of the reasoning for a change won't be covered by code itself but by real world events and requirements. You can pass more unchanged files from you codebase in an extension to the AI but this costs more money and won't always help.

## Local LLMs

To get around the limitations of the above, especially for private codebases, you could use a locally run LLM (like Ollama) instead of ChatGPT. Perhaps there are extensions which support this.
