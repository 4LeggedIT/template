import type { BlogCategoryConfig, BlogPostEntry } from "@/components/patterns/BlogSection";

// This example mixes two genuinely different use cases the same pattern must support:
// a tech/how-to guide (the shape 4leggedIT's own blog uses) and a rescue-story post with
// a real photo (the shape a client rescue site's blog would use) — see /standards/blog's
// intro copy for why both are shown side by side.
export const blogExampleCategories: BlogCategoryConfig[] = [
  { value: "guides", label: "Guides", colorClassName: "bg-primary/10 text-primary" },
  { value: "rescue-stories", label: "Rescue Stories", colorClassName: "bg-accent/10 text-accent" },
  { value: "volunteer-spotlight", label: "Volunteer Spotlight", colorClassName: "bg-highlight/10 text-highlight" },
];

export const blogExamplePosts: BlogPostEntry[] = [
  {
    id: "guide-social-media",
    slug: "free-tools-for-social-media",
    title: "Two Free Tools That Make Rescue Social Media Easier",
    excerpt: "A practical, beginner-friendly setup for creating and scheduling adoption posts without a marketing background.",
    publishedAt: "2026-03-23",
    author: "4leggedIT",
    category: "guides",
    emoji: "🐶",
    featured: true,
    content: `You're already doing the hard part: caring for animals, coordinating fosters, and managing applications with a volunteer team.

The last thing you need is a complicated social media setup that eats your time.

## What These Tools Actually Do

**Canva** lets you create eye-catching adoption posts and flyers without a design background. **Buffer** schedules those posts so they go out automatically.

- Making things look good
- Remembering to post consistently

## A Simple Weekly Rhythm

- Monday: Adoptable animal spotlight
- Wednesday: Behind the scenes update
- Friday: Call to action

> A good post that goes out is better than a perfect post that never gets published.

Need help getting set up? [Reach out](https://example.org/contact) and we'll walk you through it.`,
  },
  {
    id: "story-luna",
    slug: "lunas-journey-home",
    title: "Luna's Journey Home",
    excerpt: "Found shivering under a porch in December, Luna spent four months in foster care before finding her forever family.",
    publishedAt: "2026-04-02",
    author: "Foster Coordinator",
    authorRole: "Example Rescue",
    category: "rescue-stories",
    imageSrc: "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "A rescued dog resting on a porch",
    content: `When a neighbor first spotted Luna, she was too scared to come near anyone.

It took three weeks of quiet visits from our stray team before she trusted a hand reaching out.

## Foster Care Made the Difference

Luna spent four months with a foster family learning that people could be safe.

- Weekly vet check-ins
- Slow, patient socialization
- A foster home with another calm dog to learn from

**By month three, she was greeting visitors at the door instead of hiding.**

Luna was adopted in April by a family who had been waiting for exactly her kind of quiet, gentle energy.`,
  },
  {
    id: "spotlight-maria",
    slug: "volunteer-spotlight-maria",
    title: "Volunteer Spotlight: Maria's Five Years of Transport Runs",
    excerpt: "Maria has driven over 400 transport legs connecting shelters to foster homes across three counties.",
    publishedAt: "2026-02-10",
    author: "Volunteer Team",
    category: "volunteer-spotlight",
    emoji: "🚗",
    content: `Every rescue depends on people willing to drive.

Maria started with a single transport run in 2021 and has since logged over 400 legs, connecting shelters to foster homes across three counties.

## Why Transport Matters

A single adoption often depends on three or four separate drivers, each covering one leg of the trip.

- Shelter to foster home
- Foster home to vet appointments
- Vet to adoption events

"I just like knowing that showing up for one hour makes someone else's whole week easier," Maria says.

Thank you, Maria — from all of us, and from every dog you've driven to safety.`,
  },
];
