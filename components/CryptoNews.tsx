"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Clock, AlertTriangle, RefreshCw } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  references_count: number;
  reference_title: string;
  published_at: string;
  author: {
    name: string;
  };
  tags: Array<{
    name: string;
    slug: string;
  }>;
  url: string;
}

export function CryptoNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try Messari API first
      const messariResponse = await fetch(
        "https://data.messari.io/api/v1/news"
      );

      if (messariResponse.ok) {
        const messariData = await messariResponse.json();

        if (messariData.data && messariData.data.length > 0) {
          setNews(messariData.data);
          return;
        }
      }

      // Fallback to CryptoPanic API
      const cryptoPanicResponse = await fetch(
        "https://cryptopanic.com/api/v1/posts/?auth_token=free&kind=news&public=true&page=1"
      );

      if (cryptoPanicResponse.ok) {
        const cryptoPanicData = await cryptoPanicResponse.json();

        // Transform CryptoPanic data to match Messari format
        const transformedNews = (cryptoPanicData.results || []).map(
          (item: any) => ({
            id: item.id.toString(),
            title: item.title,
            content: "",
            references_count: 0,
            reference_title: item.source?.title || "",
            published_at: item.published_at,
            author: {
              name: item.source?.title || "Unknown",
            },
            tags: item.currencies
              ? item.currencies.map((c: any) => ({
                  name: c.code,
                  slug: c.slug,
                }))
              : [],
            url: item.url,
          })
        );

        setNews(transformedNews);
        return;
      }

      throw new Error("All news sources failed");
    } catch (err) {
      setError("Failed to load crypto news");
      console.error("News fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();

    // Refresh news every 10 minutes
    const interval = setInterval(fetchNews, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Recently";
    }
  };

  const getSentimentFromContent = (content: string, title: string) => {
    const text = (content + " " + title).toLowerCase();
    const positiveWords = [
      "bullish",
      "surge",
      "rally",
      "pump",
      "moon",
      "gains",
      "positive",
      "up",
      "rise",
      "breakthrough",
    ];
    const negativeWords = [
      "bearish",
      "crash",
      "dump",
      "down",
      "fall",
      "negative",
      "loss",
      "decline",
      "drop",
    ];

    const positiveCount = positiveWords.filter((word) =>
      text.includes(word)
    ).length;
    const negativeCount = negativeWords.filter((word) =>
      text.includes(word)
    ).length;

    if (positiveCount > negativeCount) return "positive";
    if (negativeCount > positiveCount) return "negative";
    return "neutral";
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Positive
          </Badge>
        );
      case "negative":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Negative
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-gray-600 border-gray-600">
            Neutral
          </Badge>
        );
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Latest Crypto News
            {!isLoading && !error && (
              <Badge variant="secondary" className="text-xs">
                Live
              </Badge>
            )}
            {error && (
              <Badge variant="destructive" className="text-xs">
                Error
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchNews}
            disabled={isLoading}
            className="w-8 h-8"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="border-b border-border last:border-0 pb-3 last:pb-0"
              >
                <div className="flex items-start gap-3">
                  <Skeleton className="w-12 h-12 rounded flex-shrink-0" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-3" />
            <p className="text-sm font-medium mb-2">{error}</p>
            <p className="text-xs text-muted-foreground mb-4">
              Check your internet connection and try again
            </p>
            <Button variant="outline" size="sm" onClick={fetchNews}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No news available</p>
            <p className="text-sm">Try refreshing to load latest updates</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {news.slice(0, 10).map((item) => {
              const sentiment = getSentimentFromContent(
                item.content,
                item.title
              );

              return (
                <div
                  key={item.id}
                  className="border-b border-border last:border-0 pb-3 last:pb-0"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-medium text-sm leading-tight line-clamp-2 flex-1">
                          {truncateText(item.title, 100)}
                        </h4>
                        {item.references_count > 0 && (
                          <Badge
                            variant="secondary"
                            className="text-xs ml-2 flex-shrink-0"
                          >
                            � {item.references_count} refs
                          </Badge>
                        )}
                      </div>
                      {item.content && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {truncateText(item.content, 120)}
                        </p>
                      )}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatDate(item.published_at)}
                        </div>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1 transition-colors"
                        >
                          Read more
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {item.author?.name && (
                          <Badge variant="outline" className="text-xs">
                            {item.author.name}
                          </Badge>
                        )}
                        {getSentimentBadge(sentiment)}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex gap-1">
                            {item.tags.slice(0, 3).map((tag, tagIndex) => (
                              <Badge
                                key={tagIndex}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {item.reference_title && (
                          <Badge
                            variant="outline"
                            className="text-xs text-blue-600 border-blue-600"
                          >
                            � {truncateText(item.reference_title, 20)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
