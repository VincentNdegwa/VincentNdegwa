---
title: "How I Cut Report Generation from 30s to 2s in Laravel"
description: A practical walkthrough of how Redis caching, Laravel Queues, and careful query optimisation transformed a sluggish ERP reporting module into a near-instant one.
date: 2025-04-23
image: https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1260&auto=format&fit=crop&q=80
minRead: 8
author:
  name: Vincent
  avatar:
    src: https://media.licdn.com/dms/image/v2/D4D03AQH277wN5U3E6Q/profile-displayphoto-scale_400_400/B4DZoIDfnkG8Ag-/0/1761071732624?e=1775088000&v=beta&t=J9QjZYYVnIdtRmvPPuD1QGgOxxXh2Gtq0DIsm0puffY
    alt: Vincent
---

When I inherited the reporting module for a mid-sized ERP, the first thing I did was click "Generate Monthly Report" and wait. And wait. Thirty-two seconds later, a PDF appeared. With 50+ users all hitting that button at month-end, the server was begging for mercy.

Here's exactly how I fixed it.

## The Diagnosis

The first step was understanding *why* it was slow, not guessing. Laravel Telescope showed me the problem immediately: the report controller was firing **47 sequential database queries**, several of which were full table scans on a `transactions` table with 2.3 million rows.

```php
// The original sin — N+1 inside a loop
foreach ($departments as $dept) {
    $dept->transactions; // separate query per department
}
```

## Fix 1: Eager Loading & Query Optimisation

The first win was free. Switching to eager loading and adding a composite index on `(department_id, created_at)` dropped query time from ~18s to ~6s.

```php
// Before: 47 queries
$departments = Department::all();

// After: 2 queries
$departments = Department::with([
    'transactions' => fn($q) => $q->whereBetween('created_at', [$start, $end])
])->get();
```

## Fix 2: Move Heavy Work Off the Request Cycle

PDF generation was the remaining bottleneck. It had no business running synchronously inside an HTTP request. I moved it to a **Laravel Queue job** and returned an immediate response to the user.

```php
// Controller — returns instantly now
public function generate(ReportRequest $request)
{
    $job = GenerateReportJob::dispatch($request->validated());
    return response()->json(['status' => 'queued', 'job_id' => $job->id]);
}
```

The frontend polls a `/reports/status/{id}` endpoint and shows a progress indicator until the download is ready.

## Fix 3: Cache Expensive Aggregations with Redis

Some numbers — like department totals for the current month so far — are read hundreds of times but only change when new transactions arrive. Redis was the obvious answer.

```php
$totals = Cache::tags(['reports', 'dept-'.$deptId])
    ->remember('monthly-totals-'.$month, now()->addMinutes(15), function () use ($deptId, $month) {
        return Transaction::where('department_id', $deptId)
            ->whereMonth('created_at', $month)
            ->selectRaw('SUM(amount) as total, COUNT(*) as count')
            ->first();
    });
```

When a new transaction is saved, the model's `saved` event fires a tagged cache invalidation — so the data is always fresh within 15 minutes, or immediately after a write.

## The Result

| Metric | Before | After |
|---|---|---|
| Report generation | 32s | 1.8s |
| Peak request time | 32s | < 200ms |
| Server CPU at month-end | ~90% | ~20% |

The server stopped choking. Users stopped complaining. The client was happy.

## Key Takeaway

Never guess at performance problems. Profile first with Telescope or Debugbar, fix the actual bottleneck, then verify with numbers. In this case three targeted changes — eager loading, async queues, and Redis — were all it took.

Creating successful digital products isn't about following a rigid formula—it's about developing a flexible framework that adapts to the unique challenges of each project. After refining my approach across dozens of products, I've developed a process that consistently delivers results while leaving room for creativity and iteration.

In this article, I'll walk through my end-to-end design process, from initial discovery to developer handoff, using my recent work on the EcoTrack application as a case study.

## Phase 1: Discovery & Research

Every great product starts with understanding the problem it's trying to solve. For EcoTrack, our challenge was creating an engaging way for users to track their environmental impact without feeling overwhelmed by guilt or complex data.

### User Interviews

I began by conducting interviews with 12 potential users across different demographics, focusing on their current habits and attitudes toward sustainability. These conversations revealed a crucial insight: most people wanted to make environmentally friendly choices but felt paralyzed by the complexity of calculating their impact.

> "I care about the environment, but I have no idea if using a paper bag is actually better than plastic, or if my reusable water bottle makes any difference." — Interview participant

### Competitive Analysis

Next, I analyzed existing sustainability apps, creating a feature comparison matrix to identify gaps and opportunities. Most competitors focused on carbon footprint calculations but failed to provide actionable guidance or positive reinforcement.

### Defining Success

Before opening Figma, I collaborated with stakeholders to define clear success metrics:

- Increase daily active usage by 40%
- Improve user-reported understanding of environmental impact
- Drive measurable behavior changes in at least two sustainability categories

## Phase 2: Ideation & Conceptualization

With a solid understanding of the problem space, I moved into the creative phase of the process.

### Sketching

I always start with pen and paper, rapidly exploring different approaches without the constraints of digital tools. For EcoTrack, I filled three sketchbooks with concepts ranging from gamified experiences to data-heavy dashboards.

### Information Architecture

Based on research insights, I developed a user-centered information architecture that prioritized simplicity and actionable information:

1. **Dashboard** — Personalized overview with immediate impact insights
2. **Daily Tracker** — Simple logging of activities with immediate feedback
3. **Impact Journey** — Visualization of progress over time
4. **Action Center** — Customized recommendations based on user behavior

### Design Principles

I established four core design principles to guide all decisions:

- **Simplify complexity** — Translate environmental impact into understandable units
- **Celebrate progress** — Focus on positive reinforcement rather than guilt
- **Enable informed choices** — Provide context for decision-making
- **Design for habit formation** — Create satisfying interaction loops

## Phase 3: Prototyping & Testing

With the conceptual framework in place, I moved into the iterative cycle of prototyping and testing.

### Low-Fidelity Wireframes

I created wireframes focusing on user flows and information hierarchy, deliberately keeping the visual design minimal to focus feedback on functionality and structure.

### User Testing (Round 1)

Testing wireframes with 8 participants revealed several key insights:

- Users wanted more immediate feedback when logging activities
- The impact visualization wasn't intuitive for most users
- People were confused by technical environmental terminology

### Mid-Fidelity Prototypes

Based on testing feedback, I refined the concept and developed interactive prototypes with more visual detail, focusing on:

- Simplified data visualization using familiar metaphors
- Immediate positive reinforcement for logged activities
- Progressive disclosure of more complex environmental information

### User Testing (Round 2)

A second round of testing showed significant improvements in usability, but highlighted new challenges:

- Users wanted to compare their impact with friends or community averages
- Weekly summaries were more motivating than daily statistics
- The onboarding process felt too lengthy

## Phase 4: Visual Design & Refinement

With the core experience validated, I moved into high-fidelity visual design.

### Visual Language

I developed a visual language that balanced approachability with credibility:

- A nature-inspired color palette with clear functional color coding
- Custom iconography that simplified complex concepts
- Typography that prioritized readability across devices
- Micro-interactions that provided satisfaction and reinforcement

### Design System

To ensure consistency and facilitate development, I created a comprehensive design system including:

- Component library with documented states and behaviors
- Responsive layout guidelines
- Animation specifications
- Accessibility standards

### Final Prototype

The final prototype brought together all elements into a cohesive experience, which we tested with a broader user group before moving to development.

## Phase 5: Implementation & Iteration

The design process doesn't end when development begins—it evolves.

### Developer Collaboration

I worked closely with developers throughout implementation, participating in code reviews and adjusting designs to address technical constraints while preserving the core experience.

### Analytics Implementation

We integrated analytics to track our success metrics, setting up dashboards to monitor key interactions and user journeys.

### Post-Launch Iteration

After launch, we established a regular cycle of analysis and iteration:

- Weekly reviews of user feedback and behavior data
- Bi-weekly design sprints to address emerging issues
- Monthly feature planning based on usage patterns

## Results & Learnings

Six months after launch, EcoTrack has exceeded our initial success metrics:

- 52% increase in daily active usage
- 78% of users report better understanding of their environmental impact
- Average user has adopted 3.4 new sustainable habits

The most valuable lesson from this project was the importance of making abstract concepts tangible. By translating complex environmental data into personal, actionable insights, we created an experience that not only educated users but empowered them to make meaningful changes.

## Conclusion

Effective product design is never a linear journey—it's a continuous cycle of learning and refinement. By staying focused on user needs while maintaining a flexible approach to problem-solving, we can create products that not only meet business objectives but genuinely improve people's lives.

I'd love to hear about your own design process and how you approach similar challenges. Feel free to reach out with questions or share your experiences in the comments below.
