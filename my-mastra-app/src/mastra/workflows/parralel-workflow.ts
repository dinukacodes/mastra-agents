import { createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { createWorkflow } from "@mastra/core/workflows";


const seoAnalysisStep = createStep({
    id: "seo-analysis",
    description: "SEO optimization analysis",
    inputSchema: z.object({
      content: z.string(),
      type: z.enum(["article", "blog", "social"]).default("article"),
    }),
    outputSchema: z.object({
      seoScore: z.number(),
      keywords: z.array(z.string()),
    }),
    execute: async ({ inputData }) => {
      console.log("🔍 Running SEO analysis...");
      await new Promise((resolve) => setTimeout(resolve, 800));
  
      const words = inputData.content.toLowerCase().split(/\s+/);
      const keywords = words.filter((word) => word.length > 4).slice(0, 3);
  
      return {
        seoScore: Math.floor(Math.random() * 40) + 60,
        keywords,
      };
    },
  });

  const readabilityStep = createStep({
    id: "readability-analysis",
    description: "Content readability analysis",
    inputSchema: z.object({
      content: z.string(),
      type: z.enum(["article", "blog", "social"]).default("article"),
    }),
    outputSchema: z.object({
      readabilityScore: z.number(),
      gradeLevel: z.string(),
    }),
    execute: async ({ inputData }) => {
      console.log("📖 Running readability analysis...");
      await new Promise((resolve) => setTimeout(resolve, 600));
  
      const sentences = inputData.content.split(/[.!?]+/).length;
      const words = inputData.content.split(/\s+/).length;
      const avgWordsPerSentence = words / sentences;
  
      const score = Math.max(0, 100 - avgWordsPerSentence * 3);
      const gradeLevel = score > 80 ? "Easy" : score > 60 ? "Medium" : "Hard";
  
      return {
        readabilityScore: Math.floor(score),
        gradeLevel,
      };
    },
  });

  const sentimentStep = createStep({
    id: "sentiment-analysis",
    description: "Content sentiment analysis",
    inputSchema: z.object({
      content: z.string(),
      type: z.enum(["article", "blog", "social"]).default("article"),
    }),
    outputSchema: z.object({
      sentiment: z.enum(["positive", "neutral", "negative"]),
      confidence: z.number(),
    }),
    execute: async ({ inputData }) => {
      console.log("😊 Running sentiment analysis...");
      await new Promise((resolve) => setTimeout(resolve, 700));
  
      const content = inputData.content.toLowerCase();
      const positiveWords = ["good", "great", "excellent", "amazing"];
      const negativeWords = ["bad", "terrible", "awful", "horrible"];
  
      const positive = positiveWords.filter((word) =>
        content.includes(word),
      ).length;
      const negative = negativeWords.filter((word) =>
        content.includes(word),
      ).length;
  
      let sentiment: "positive" | "neutral" | "negative" = "neutral";
      if (positive > negative) sentiment = "positive";
      if (negative > positive) sentiment = "negative";
  
      return {
        sentiment,
        confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
      };
    },
  });

  export const parallelAnalysisWorkflow = createWorkflow({
    id: "parallel-analysis-workflow",
    description: "Run multiple content analyses in parallel",
    inputSchema: z.object({
      content: z.string(),
      type: z.enum(["article", "blog", "social"]).default("article"),
    }),
    outputSchema: z.object({
      results: z.object({
        seo: z.object({
          seoScore: z.number(),
          keywords: z.array(z.string()),
        }),
        readability: z.object({
          readabilityScore: z.number(),
          gradeLevel: z.string(),
        }),
        sentiment: z.object({
          sentiment: z.enum(["positive", "neutral", "negative"]),
          confidence: z.number(),
        }),
      }),
    }),
  })
    .parallel([seoAnalysisStep, readabilityStep, sentimentStep])
    .then(
      createStep({
        id: "combine-results",
        description: "Combines parallel analysis results",
        inputSchema: z.object({
          "seo-analysis": z.object({
            seoScore: z.number(),
            keywords: z.array(z.string()),
          }),
          "readability-analysis": z.object({
            readabilityScore: z.number(),
            gradeLevel: z.string(),
          }),
          "sentiment-analysis": z.object({
            sentiment: z.enum(["positive", "neutral", "negative"]),
            confidence: z.number(),
          }),
        }),
        outputSchema: z.object({
          results: z.object({
            seo: z.object({
              seoScore: z.number(),
              keywords: z.array(z.string()),
            }),
            readability: z.object({
              readabilityScore: z.number(),
              gradeLevel: z.string(),
            }),
            sentiment: z.object({
              sentiment: z.enum(["positive", "neutral", "negative"]),
              confidence: z.number(),
            }),
          }),
        }),
        execute: async ({ inputData }) => {
          console.log("🔄 Combining parallel results...");
  
          return {
            results: {
              seo: inputData["seo-analysis"],
              readability: inputData["readability-analysis"],
              sentiment: inputData["sentiment-analysis"],
            },
          };
        },
      }),
    )
    .commit();
