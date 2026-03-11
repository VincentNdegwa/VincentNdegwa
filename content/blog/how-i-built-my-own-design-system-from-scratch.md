---
title: "Integrating LLMs into Laravel Using Python Microservices"
description: A practical guide to wiring a LangChain Python service to a Laravel backend so you can add AI-powered features without abandoning your existing stack.
date: 2025-03-05
image: https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1260&auto=format&fit=crop&q=80
minRead: 6
author:
  name: Vincent
  avatar:
    src: https://media.licdn.com/dms/image/v2/D4D03AQH277wN5U3E6Q/profile-displayphoto-scale_400_400/B4DZoIDfnkG8Ag-/0/1761071732624?e=1775088000&v=beta&t=J9QjZYYVnIdtRmvPPuD1QGgOxxXh2Gtq0DIsm0puffY
    alt: Vincent
---

The CRM I built needed an AI assistant that could draft personalised follow-up emails based on a client's deal history. The business logic and data all lived in Laravel. The AI capabilities I wanted — LangChain, the OpenAI API, vector embeddings — live in the Python ecosystem.

The answer wasn't to rewrite anything. It was a lightweight Python microservice that Laravel calls over HTTP.

## The Architecture

```
Laravel App  →  HTTP POST /generate  →  FastAPI + LangChain  →  OpenAI API
     ←  JSON response  ←
```

Laravel remains the source of truth. It handles auth, the database, and business logic. The Python service is stateless and only does one thing: take structured input and return AI-generated text.

## The Python Service (FastAPI + LangChain)

```python
from fastapi import FastAPI
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from pydantic import BaseModel

app = FastAPI()

class EmailRequest(BaseModel):
    client_name: str
    deal_summary: str
    rep_name: str

@app.post("/generate/follow-up")
def generate_follow_up(req: EmailRequest):
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a professional sales assistant. Write concise, friendly follow-up emails."),
        ("human", "Draft a follow-up for {client_name}. Deal context: {deal_summary}. From: {rep_name}")
    ])
    chain = prompt | llm
    result = chain.invoke(req.dict())
    return {"email": result.content}
```

## Calling It from Laravel

```php
// app/Services/AiEmailService.php
public function draftFollowUp(Contact $contact, Deal $deal, User $rep): string
{
    $response = Http::timeout(15)->post(
        config('services.ai.base_url') . '/generate/follow-up',
        [
            'client_name'  => $contact->full_name,
            'deal_summary' => $deal->summary,
            'rep_name'     => $rep->name,
        ]
    );

    return $response->throw()->json('email');
}
```

`Http::throw()` ensures any non-2xx response triggers an exception that Laravel's exception handler can deal with cleanly.

## Deployment

Both services run in Docker containers behind an internal network. The Python service is **never exposed publicly** — only the Laravel app can reach it. This keeps the attack surface minimal.

```yaml
# docker-compose.yml (excerpt)
services:
  laravel:
    networks: [app-network]
  ai-service:
    networks: [app-network]  # internal only, no ports exposed
```

## Lessons Learned

- **Keep the service stateless.** No database, no sessions. Pure input → output.
- **Set tight timeouts.** LLM calls can hang. 15s is generous; fail fast and show the user a graceful error.
- **Cache aggressively.** Identical prompts return identical results. A quick Redis cache keyed on the input hash saves money and latency.

After years of starting each project with a blank Figma file, I finally took the plunge and created my own comprehensive design system. The process was both challenging and incredibly rewarding, and I wanted to share my approach for other designers considering the same journey.

I started by auditing five of my recent projects, identifying common patterns and components that appeared across different designs. This revealed inconsistencies in my work that I hadn't noticed before—seven slightly different button styles, inconsistent spacing rules, and text styles that varied without clear purpose.

Rather than creating a rigid system upfront, I built it iteratively through a real client project. For the EcoTrack app, I documented each component as I designed it, creating a living system that evolved with the project's needs.

The core of my system includes:

- A flexible color system with semantic naming conventions
- Typography scales based on the golden ratio
- Component variants with clear usage guidelines
- Spacing and layout rules that maintain consistency across devices

The biggest challenge wasn't technical but psychological—learning to trust the system instead of reinventing solutions for each new problem. But the payoff has been enormous: my design process is now 40% faster, client revisions have decreased significantly, and handoff to development is much smoother.

If you're considering building your own system, my advice is to start small with core elements, test them on real projects, and document as you go. A good design system should feel like a trusted collaborator, not a set of restrictions.

I've attached a template of my component documentation method below—feel free to adapt it for your own workflow!
