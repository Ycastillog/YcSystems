# Security Policy

YC Systems LLC keeps this repository limited to public website code, public copy and approved public assets.

## Do Not Commit

- access tokens
- API keys
- app secrets
- passwords
- `.env` files with real values
- private legal documents
- personal identity documents
- ownership percentages or sensitive corporate records
- private customer data

The public website currently requires no runtime environment variables. Never commit real values if integrations are added later.

## Reporting

For security or privacy issues affecting the public website, contact:

```text
legal@ycsystems.io
```

The public disclosure instructions are also available at:

```text
https://ycsystems.io/.well-known/security.txt
```

Include the affected URL, a concise description of the impact and reproducible steps when they can be shared safely. Do not send credentials, private customer data or active secrets by email.

## Internal Rule

If a file is required to operate the company but is not meant for customers, it does not belong in this public repository.
