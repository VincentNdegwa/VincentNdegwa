---
title: "How I Cut Report Generation from 30s to 2s in Laravel"
description: A practical walkthrough of how Redis caching, Laravel Queues, and careful query optimisation transformed a sluggish ERP reporting module into a near-instant one.
date: 2025-04-23
image: https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1260&auto=format&fit=crop&q=80
minRead: 8
author:
  name: Vincent Ndegwa
  avatar:
    src: https://media.licdn.com/dms/image/v2/D4D03AQH277wN5U3E6Q/profile-displayphoto-scale_400_400/B4DZoIDfnkG8Ag-/0/1761071732624?e=1775088000&v=beta&t=J9QjZYYVnIdtRmvPPuD1QGgOxxXh2Gtq0DIsm0puffY
    alt: Vincent Ndegwa
---

I inherited a Laravel reporting module that looked fine in code review but failed in real life. The monthly report endpoint took 32 seconds on a good day. At month end, when many users hit the button together, request queues piled up and CPU usage climbed into panic territory.

I did not start with rewrites. I started with measurement.

## Step 1: Profile Before You Touch Anything

Laravel Telescope showed the endpoint was firing 47 SQL queries, many inside loops. A few were scanning large transaction tables with weak indexes.

```php
foreach ($departments as $department) {
    $department->transactions; // one query per row
}
```

This pattern was the main reason latency exploded under load.

## Step 2: Remove N+1 and Fix Indexing

I switched to eager loading and added a composite index on high selectivity columns used in filters.

```php
$departments = Department::with([
    'transactions' => fn ($q) => $q->whereBetween('created_at', [$start, $end])
])->get();
```

```sql
CREATE INDEX idx_txn_department_created_at
ON transactions (department_id, created_at);
```

Result: query phase dropped from around 18 seconds to around 6 seconds.

## Step 3: Move Heavy Generation to Queues

PDF generation and aggregation logic were running in the request cycle. I moved the expensive work to a queued job and made the endpoint return immediately.

```php
public function generate(ReportRequest $request)
{
    $job = GenerateReportJob::dispatch($request->validated());

    return response()->json([
        'status' => 'queued',
        'job_id' => $job->id,
    ]);
}
```

The frontend now polls a lightweight status endpoint. Users get fast feedback instead of watching a spinner freeze.

## Step 4: Cache Expensive Aggregates in Redis

Some report widgets are read hundreds of times but change only when new transactions land. Perfect cache candidates.

```php
$summary = Cache::tags(['reports', 'department:' . $departmentId])
    ->remember('month:' . $month, now()->addMinutes(15), function () use ($departmentId, $month) {
        return Transaction::where('department_id', $departmentId)
            ->whereMonth('created_at', $month)
            ->selectRaw('SUM(amount) AS total, COUNT(*) AS count')
            ->first();
    });
```

On transaction writes, I invalidate only related tags so fresh data appears quickly without nuking the whole cache.

## Step 5: Guardrails for Scale

Performance wins disappear without guardrails. I added:

- slow query logging
- a threshold alert for report queue wait time
- basic load tests in CI before each release

## Outcome

| Metric | Before | After |
|---|---|---|
| Report generation | 32s | 1.8s |
| API response time | 32s | < 200ms |
| Month end CPU | ~90% | ~20% |

The important lesson: serious performance tuning is usually less about heroics and more about disciplined bottleneck removal. Measure, target one class of failure at a time, and verify with numbers.
