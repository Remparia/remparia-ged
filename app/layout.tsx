import type { Metadata } from "next";
import "../src/ged-landing.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://ged.remparia.com"),
  title: {
    default: "Remparia GED — Retrouvez n’importe quel document en moins de 15 secondes.",
    template: "%s · Remparia GED",
  },
  description:
    "Remparia GED classe chaque document dès son dépôt, vérifie qu’il ne vous en manque aucun et le conserve le temps exigé par la loi. Un agent IA répond à vos questions, sources à l’appui.",
  alternates: {
    canonical: "/",
    languages: {
      fr: "/",
      en: "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: ["en_US"],
    title: "Remparia GED — Retrouvez n’importe quel document en moins de 15 secondes.",
    description:
      "Classez, complétez et conservez vos documents. Un agent IA répond à vos questions, sources à l’appui. Hébergé en France.",
    siteName: "Remparia GED",
    images: [{ url: "/assets/ged/ged-hero-human-v2.png", width: 1024, height: 576, alt: "Remparia GED" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Remparia GED — Retrouvez n’importe quel document en moins de 15 secondes.",
    description:
      "Classez, complétez et conservez vos documents. Un agent IA répond à vos questions, sources à l’appui. Hébergé en France.",
    images: ["/assets/ged/ged-hero-human-v2.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&family=Inter+Tight:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
