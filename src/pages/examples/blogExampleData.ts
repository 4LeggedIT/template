import type { BlogCategoryConfig, BlogPostEntry } from "@/components/patterns/BlogSection";
import { exampleImages } from "@/data/examples/images";
import { daysAgoISO } from "@/data/examples/dates";

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
    slug: "simple-social-media-routine",
    title: "A Simple Social Media Routine for Busy Rescue Volunteers",
    excerpt: "A small weekly posting habit that fits around fostering, applications and everything else on your plate.",
    publishedAt: daysAgoISO(18),
    author: "4leggedIT",
    category: "guides",
    emoji: "🐶",
    featured: true,
    content: `You're already doing the hard part: caring for animals, coordinating fosters, and managing applications with a volunteer team.

Social media should support that work, not add to it. A few small habits go a long way.

## Keep the Setup Small

You only need two things: a way to make clear, readable posts, and a way to schedule them ahead of time. Free versions of both are plenty to start with.

- A free design app for adoption posts and flyers, using one or two templates you reuse every time
- A free scheduling tool so posts go out while you're busy with the animals

## A Simple Weekly Rhythm

- Monday: Adoptable animal spotlight
- Wednesday: Behind the scenes update
- Friday: Call to action

Set aside thirty minutes once a week, write all three posts, and schedule them.

> A good post that goes out is better than a perfect post that never gets published.

Need help getting set up? [Reach out](https://example.org/contact) and we'll walk you through it.`,
  },
  {
    id: "story-maple",
    slug: "maples-journey-home",
    title: "Maple's Journey Home",
    excerpt: "Found shivering under a porch in December, Maple spent four months in foster care before finding her forever family.",
    publishedAt: daysAgoISO(32),
    author: "Foster Coordinator",
    authorRole: "Example Rescue",
    category: "rescue-stories",
    imageSrc: exampleImages.maple,
    imageAlt: "Maple, a cocker spaniel mix, resting in the grass",
    content: `When a neighbor first spotted Maple, she was too scared to come near anyone.

It took three weeks of quiet visits from our stray team before she trusted a hand reaching out.

## Foster Care Made the Difference

Maple spent four months with a foster family learning that people could be safe.

![Volunteers walking dogs together, the way Maple practiced meeting new people and dogs during her foster placement](${exampleImages.groupWalk})

- Weekly vet check-ins
- Slow, patient socialization walks
- A foster home with another calm dog to learn from

**By month three, she was greeting visitors at the door instead of hiding.**

Maple was adopted by a family who had been waiting for exactly her kind of quiet, gentle energy.`,
  },
  {
    id: "story-embedded-post",
    slug: "a-post-worth-sharing",
    title: "A Post Worth Sharing: Seeing the Original",
    excerpt: "Sometimes the best story is the original post. Here is how a blog post can show a public social post as posted.",
    publishedAt: daysAgoISO(46),
    author: "Foster Coordinator",
    authorRole: "Example Rescue",
    category: "rescue-stories",
    emoji: "📸",
    // Example only: swap in a real public Facebook, Instagram or TikTok post, reel or video URL.
    content: `Sometimes the best way to tell a story is to let the original post speak for itself.

Put a public Facebook, Instagram or TikTok post URL on a line by itself and the blog shows it as posted, using the platform's own embed:

https://www.instagram.com/p/CuE2WNQs6vH/

## What Happens If It Disappears

If the post is later deleted, made private or can't be embedded, the embed drops away and the rest of the story stays. A URL inside a sentence stays a normal link, like [this one](https://example.org).`,
  },
  {
    id: "spotlight-maria",
    slug: "volunteer-spotlight-maria",
    title: "Volunteer Spotlight: Maria's Five Years of Transport Runs",
    excerpt: "Maria has driven over 400 transport legs connecting shelters to foster homes across three counties, all as a volunteer.",
    publishedAt: daysAgoISO(74),
    author: "Volunteer Team",
    category: "volunteer-spotlight",
    emoji: "🚗",
    content: `Every rescue depends on people willing to drive.

Maria started with a single transport run five years ago and has since logged over 400 legs, connecting shelters to foster homes across three counties.

## Why Transport Matters

A single adoption often depends on three or four separate drivers, each covering one leg of the trip.

- Shelter to foster home
- Foster home to vet appointments
- Vet to adoption events

"I just like knowing that showing up for one hour makes someone else's whole week easier," Maria says.

Thank you, Maria — from all of us, and from every dog you've driven to safety.`,
  },
];
