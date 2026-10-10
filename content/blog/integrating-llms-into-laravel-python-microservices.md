---
title: "Integrating LLMs into Laravel Using Python Microservices"
description: A practical guide to wiring a LangChain Python service to a Laravel backend so you can add AI-powered features without abandoning your existing stack.
date: 2025-03-05
image: https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1260&auto=format&fit=crop&q=80
minRead: 6
author:
  name: Vincent Ndegwa
  avatar:
    src: /personal/profile.jpeg
    alt: Vincent Ndegwa
---

In one CRM project, product wanted AI generated follow-up emails and sentiment assisted lead scoring. The data, users, and workflow logic already lived in Laravel. Rewriting everything in Python would have delayed delivery and increased risk.

The solution was simple: Laravel remained the system of record, and a small FastAPI service handled LLM tasks.

## Why This Split Works

- Laravel keeps auth, permissions, and business rules in one place
- FastAPI hosts AI specific dependencies like LangChain and vector tooling
- Both services evolve independently with clear contracts

This model is easier to maintain than mixing Python runtime concerns directly into a PHP monolith.

## Architecture

```text
Nuxt/React UI -> Laravel API -> FastAPI AI service -> LLM provider
                         <- JSON response <-
```

Laravel never exposes provider secrets to the frontend. It validates inputs, enriches context from the database, then calls FastAPI over an internal network.

## FastAPI Endpoint

```python
from fastapi import FastAPI
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

app = FastAPI()

class FollowUpInput(BaseModel):
    client_name: str
    deal_summary: str
    sender_name: str

@app.post("/generate/follow-up")
def generate_follow_up(payload: FollowUpInput):
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.4)

    prompt = ChatPromptTemplate.from_messages([
        ("system", "You write concise B2B follow-up emails."),
        (
            "human",
            "Client: {client_name}\nDeal: {deal_summary}\nSender: {sender_name}\nWrite an email with a clear next step."
        ),
    ])

    chain = prompt | llm
    result = chain.invoke(payload.model_dump())
    return {"email": result.content}
```

## Laravel Service Layer

```php
public function draftFollowUp(Contact $contact, Deal $deal, User $sender): string
{
    $response = Http::timeout(10)
        ->retry(2, 300)
        ->post(config('services.ai.base_url') . '/generate/follow-up', [
            'client_name' => $contact->full_name,
            'deal_summary' => $deal->summary,
            'sender_name' => $sender->name,
        ]);

    return $response->throw()->json('email');
}
```

This gives you predictable error handling in one place and keeps controllers clean.

## Production Hardening

I learned these checks matter more than the prompt itself:

- strict request schemas with Pydantic
- request timeouts and retries at Laravel boundary
- Redis caching for repeated prompt payloads
- circuit breaker fallback when AI service is degraded
- internal only networking for FastAPI

## What Hiring Teams Usually Care About

When I discuss this architecture in interviews, teams respond well to three things:

- clear separation of concerns
- secure handling of secrets and internal traffic
- realistic failure strategy for AI dependent features

That is what turns an AI demo into production software.
