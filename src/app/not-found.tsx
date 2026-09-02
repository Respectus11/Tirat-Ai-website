import Link from "next/link";
import GrainMark from "@/components/ui/GrainMark";

/**
 * Custom 404 page — matches the site's branding instead of showing
 * Next.js's default plain page. Provides a clear path back to the
 * home page with consistent styling.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-5 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-brand text-cream">
        <GrainMark className="size-8" />
      </span>

      <h1 className="mt-8 text-6xl font-extrabold tracking-tight text-forest">
        404
      </h1>
      <p className="mt-3 max-w-md text-lg text-forest/65">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-sm font-bold text-cream shadow-soft transition-all hover:-translate-y-0.5 hover:bg-deep"
      >
        Back to home
        <svg
          viewBox="0 0 24 24"
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M5 12h14m-6-6 6 6-6 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </div>
  );
}
