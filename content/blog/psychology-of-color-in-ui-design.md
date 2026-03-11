---
title: "Why I Chose PostgreSQL Over MongoDB for a CRM Reporting Engine"
description: Exploring how strategic database choices impact query complexity, reporting accuracy, and long-term maintainability — and why relational won for this use case.
date: 2025-03-15
image: https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1260&auto=format&fit=crop&q=80
minRead: 5
author:
  name: Vincent Ndegwa
  avatar:
    src: https://media.licdn.com/dms/image/v2/D4D03AQH277wN5U3E6Q/profile-displayphoto-scale_400_400/B4DZoIDfnkG8Ag-/0/1761071732624?e=1775088000&v=beta&t=J9QjZYYVnIdtRmvPPuD1QGgOxxXh2Gtq0DIsm0puffY
    alt: Vincent Ndegwa
---

When I started building the CRM Automation Suite, the initial tech discussion went exactly where most startup tech discussions go: "Should we use MongoDB? It's flexible."

I've heard that argument many times. Flexibility is real, but it comes with a cost that only shows up later — usually when someone asks for their first non-trivial report.

## The Flexibility Trap

For a CRM, almost every interesting query involves *relationships*. Who are my top 10 clients by deal value this quarter, grouped by sales rep, filtered by lead source? That question is a JOIN. MongoDB can answer it, but you'll write an aggregation pipeline that looks like this:

```js
db.leads.aggregate([
  { $match: { created_at: { $gte: startOfQuarter } } },
  { $lookup: { from: 'deals', localField: '_id', foreignField: 'lead_id', as: 'deals' } },
  { $unwind: '$deals' },
  { $group: { _id: '$rep_id', total: { $sum: '$deals.value' } } },
  { $sort: { total: -1 } },
  { $limit: 10 }
])
```

In PostgreSQL:

```sql
SELECT rep_id, SUM(d.value) AS total
FROM leads l
JOIN deals d ON d.lead_id = l.id
WHERE l.created_at >= date_trunc('quarter', now())
GROUP BY rep_id
ORDER BY total DESC
LIMIT 10;
```

The SQL is shorter, easier to review in a PR, and the query planner will optimise it efficiently with the right indexes.

## Where Postgres Wins for CRMs

**JSONB columns give you the flexibility you actually need.** Instead of going full document store, I used a `metadata JSONB` column on the contacts table for custom fields. You get the best of both worlds: structured joins where structure matters, and schemaless flexibility where it doesn't.

**Window functions are a reporting superpower.** Calculating a rolling 30-day conversion rate per rep isn't something you want to do in application code:

```sql
SELECT rep_id,
       date,
       SUM(converted) OVER (PARTITION BY rep_id ORDER BY date ROWS 29 PRECEDING) AS rolling_conversions
FROM daily_stats;
```

**Full-text search with `tsvector`** handled name and note searching without needing Elasticsearch for our scale.

## The Verdict

For a system where the data model has clear relationships and reporting is a first-class requirement, PostgreSQL is the right default. Save MongoDB for genuine document-centric problems — CMS content, event logs, product catalogues with wildly varying schemas. Don't reach for it because it *feels* modern.

Color is one of the most powerful tools in my design arsenal, yet I find it's often reduced to mere aesthetics or brand guidelines. After conducting a series of A/B tests for the Wavelength music app redesign, I've gathered some fascinating insights about how color psychology directly impacts user behavior.

When we initially launched the app, we used a vibrant purple as our primary action color. The color looked great with our brand palette, but our conversion metrics were underwhelming. On a hunch, I proposed testing different primary colors while keeping all other elements identical.

The results were striking: switching to a specific shade of blue increased our call-to-action conversion by 34%. Even more interesting was how different user segments responded to color variations—younger users engaged more with vibrant tones, while our 35+ demographic showed stronger preference for more subdued colors.

Beyond conversion metrics, I discovered that color significantly affected how users perceived waiting times. By implementing a softer color progression in our loading animations, users reported that the app felt faster, even though the actual loading times remained unchanged.

I've since developed a framework for color decision-making that goes beyond aesthetics:

1. Consider the emotional response you want to evoke
2. Test color choices with your specific user demographics
3. Use color to create visual hierarchies that guide users naturally
4. Consider cultural associations of colors for international audiences
5. Ensure sufficient contrast for readability and accessibility

The most valuable lesson I've learned is that there are no universal "right" colors—only colors that effectively communicate your message and guide users toward their goals within your specific context.

Next time you're selecting a color palette, think beyond what looks good and consider what your colors are actually saying to your users.
