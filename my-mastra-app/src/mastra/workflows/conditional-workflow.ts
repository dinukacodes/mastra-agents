import { z } from "zod";
import { createWorkflow } from "@mastra/core/workflows";
import { createStep } from "@mastra/core/workflows";


const assessContentStep = createStep({
    id: "assess-content",
    description: "Assesses content to determine processing path",
    inputSchema: z.object({
      content: z.string(),
      type: z.enum(["article", "blog", "social"]).default("article"),
    }),
    outputSchema: z.object({
      content: z.string(),
      type: z.enum(["article", "blog", "social"]).default("article"),
      wordCount: z.number(),
      complexity: z.enum(["simple", "moderate", "complex"]),
      category: z.enum(["short", "medium", "long"]),
    }),
    execute: async ({ inputData }) => {
      const { content, type } = inputData;
      const words = content.trim().split(/\s+/);
      const wordCount = words.length;
  
      // Determine category by length
      let category: "short" | "medium" | "long" = "short";
      if (wordCount >= 50) category = "medium";
      if (wordCount >= 200) category = "long";
  
      // Determine complexity by average word length
      const avgWordLength =
        words.reduce((sum, word) => sum + word.length, 0) / wordCount;
      let complexity: "simple" | "moderate" | "complex" = "simple";
      if (avgWordLength > 5) complexity = "moderate";
      if (avgWordLength > 7) complexity = "complex";
  
      console.log(`📋 Assessment: ${category} content, ${complexity} complexity`);
  
      return {
        content,
        type,
        wordCount,
        complexity,
        category,
      };
    },
  });

  const quickProcessingStep = createStep({
    id: "quick-processing",
    description: "Quick processing for short and simple content",
    inputSchema: z.object({
      content: z.string(),
      type: z.enum(["article", "blog", "social"]).default("article"),
      wordCount: z.number(),
      complexity: z.enum(["simple", "moderate", "complex"]),
      category: z.enum(["short", "medium", "long"]),
    }),
    outputSchema: z.object({
      processedContent: z.string(),
      processingType: z.string(),
      recommendations: z.array(z.string()),
    }),
    execute: async ({ inputData }) => {
      console.log("⚡ Quick processing for short and simple content...");
  
      return {
        processedContent: inputData.content,
        processingType: "quick",
        recommendations: [
          "Content is concise",
          "Consider expanding for more detail",
        ],
      };
    },
  });

  const generalProcessingStep = createStep({
    id: "general-processing",
    description: "General processing for all other content",
    inputSchema: z.object({
      content: z.string(),
      type: z.enum(["article", "blog", "social"]).default("article"),
      wordCount: z.number(),
      complexity: z.enum(["simple", "moderate", "complex"]),
      category: z.enum(["short", "medium", "long"]),
    }),
    outputSchema: z.object({
      processedContent: z.string(),
      processingType: z.string(),
      recommendations: z.array(z.string()),
    }),
    execute: async ({ inputData }) => {
      console.log("📝 General processing for non-short/simple content...");
  
      // Simulate more involved processing
      await new Promise((resolve) => setTimeout(resolve, 500));
  
      return {
        processedContent: inputData.content,
        processingType: "general",
        recommendations: [
          "Consider simplifying content",
          "Break up long paragraphs",
          "Add examples or explanations if needed",
        ],
      };
    },
  });

  export const conditionalWorkflow = createWorkflow({
    id: "conditional-workflow",
    description: "Content processing with conditional branching",
    inputSchema: z.object({
      content: z.string(),
      type: z.enum(["article", "blog", "social"]).default("article"),
    }),
    outputSchema: z.object({
      processedContent: z.string(),
      processingType: z.string(),
      recommendations: z.array(z.string()),
    }),
  })
    .then(assessContentStep)
    .branch([
      // Branch 1: Short and simple content
      [
        async ({ inputData }) =>
          inputData.category === "short" && inputData.complexity === "simple",
        quickProcessingStep,
      ],
      // Branch 2: Everything else
      [
        async ({ inputData }) =>
          !(inputData.category === "short" && inputData.complexity === "simple"),
        generalProcessingStep,
      ],
    ])
    .commit();