export default function Head() {
  const title = "playdate — invitation to play";
  const description =
    "demo of the daily invitation-to-play card. not the final app.";

  return (
    <>
      <meta name="robots" content="noindex, nofollow" />
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* open graph for rich previews */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/opengraph-image.png" />
      <meta property="og:url" content="https://todaysplaydate.com/invite" />

      {/* x (twitter) card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="/twitter-image.png" />
    </>
  );
}

